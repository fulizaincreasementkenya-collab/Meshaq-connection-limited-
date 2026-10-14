require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { z } = require('zod');
const crypto = require('crypto');
const path = require('path');
const { pool, migrate } = require('./src/db');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || '';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'meshaqconnectionlimited@gmail.com').toLowerCase();
const COOKIE_NAME = 'meshaq_admin';
if (IS_PROD && JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production.');

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'self'"], scriptSrc: ["'self'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
  imgSrc: ["'self'", 'data:', 'https:', 'blob:'], connectSrc: ["'self'"],
  frameSrc: ['https://www.google.com', 'https://maps.google.com'], objectSrc: ["'none'"], ...(IS_PROD ? { upgradeInsecureRequests: [] } : {})
} }}));
app.use(express.json({ limit: '40kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many attempts. Please wait and try again.' } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 6, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many login attempts. Try again later.' } });
const mutationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 80, standardHeaders: 'draft-7', legacyHeaders: false });

const mailer = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000
}) : null;

function asyncRoute(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
function checkSameOrigin(req, res, next) {
  const origin = req.get('origin');
  const host = req.get('host');
  if (origin) {
    try { if (new URL(origin).host !== host) return res.status(403).json({ error: 'Origin not allowed.' }); }
    catch { return res.status(403).json({ error: 'Invalid origin.' }); }
  }
  next();
}
function requireAdmin(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token || !JWT_SECRET) return res.status(401).json({ error: 'Please sign in.' });
  try { req.admin = jwt.verify(token, JWT_SECRET, { issuer: 'meshaq-website', audience: 'meshaq-admin' }); next(); }
  catch { res.clearCookie(COOKIE_NAME, cookieOptions()); return res.status(401).json({ error: 'Session expired. Please sign in again.' }); }
}
function csrfCheck(req, res, next) {
  const cookie = req.cookies.meshaq_csrf;
  const header = req.get('x-csrf-token');
  if (!cookie || !header || cookie.length !== header.length || !crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(header))) return res.status(403).json({ error: 'Security token expired. Refresh the page and try again.' });
  next();
}
function cookieOptions() { return { httpOnly: true, secure: IS_PROD, sameSite: 'strict', path: '/' }; }
function setCsrf(res) { const token = crypto.randomBytes(24).toString('hex'); res.cookie('meshaq_csrf', token, { httpOnly: false, secure: IS_PROD, sameSite: 'strict', path: '/', maxAge: 8 * 60 * 60 * 1000 }); return token; }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
async function sendEnquiryNotification(enquiry) {
  if (!mailer) { console.warn('SMTP not configured: enquiry stored, email notification skipped.'); return; }
  const fields = [ ['Name', enquiry.name], ['Phone', enquiry.phone], ['Email', enquiry.email || 'Not supplied'], ['Preferred contact', enquiry.contact_method || 'Not supplied'], ['County', enquiry.county], ['Project location', enquiry.location], ['Project type', enquiry.project_type], ['Services', (enquiry.services || []).join(', ')], ['Budget', enquiry.budget], ['Start', enquiry.start_date || 'Not specified'], ['Plot status', enquiry.plot_status || 'Not specified'], ['Size', enquiry.size || 'Not specified'], ['Details', enquiry.details] ];
  const text = fields.map(([k,v]) => `${k}: ${v}`).join('\n');
  const html = `<h2>New project enquiry — MESHAQ CONNECTION LIMITED</h2><table cellpadding="7" cellspacing="0" border="1">${fields.map(([k,v])=>`<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g,'<br>')}</td></tr>`).join('')}</table><p>Enquiry ID: ${enquiry.id}</p>`;
  await mailer.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: process.env.NOTIFY_EMAIL || 'meshaqconnectionlimited@gmail.com', replyTo: enquiry.email || undefined, subject: `New project enquiry #${enquiry.id} — ${enquiry.name}`, text, html });
}

app.get('/api/health', asyncRoute(async (_req,res) => { await pool.query('SELECT 1'); res.json({ ok: true, service: 'meshaq-website-api' }); }));
app.get('/api/csrf', (_req,res) => res.json({ token: setCsrf(res) }));

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120), phone: z.string().trim().min(7).max(40),
  email: z.union([z.string().trim().email().max(254), z.literal(''), z.null()]).optional(),
  contactMethod: z.string().trim().max(40).optional(), county: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(180), projectType: z.string().trim().min(2).max(120),
  services: z.array(z.string().trim().min(1).max(100)).min(1).max(12), budget: z.string().trim().min(2).max(100),
  startDate: z.string().trim().max(100).optional(), plotStatus: z.string().trim().max(100).optional(),
  size: z.string().trim().max(120).optional(), details: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(), consent: z.union([z.literal(true), z.literal('on'), z.literal('true')])
});
app.post('/api/enquiries', publicLimiter, checkSameOrigin, asyncRoute(async (req,res) => {
  if (req.body.website) return res.status(202).json({ ok: true, message: 'Thank you. Your enquiry has been received.' });
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please check the required fields and try again.', fields: parsed.error.flatten().fieldErrors });
  const d = parsed.data;
  const result = await pool.query(`INSERT INTO enquiries (name,phone,email,contact_method,county,location,project_type,services,budget,start_date,plot_status,size,details)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id,name,phone,email,contact_method,county,location,project_type,services,budget,start_date,plot_status,size,details,created_at`,
    [d.name,d.phone,d.email || null,d.contactMethod || null,d.county,d.location,d.projectType,d.services,d.budget,d.startDate || null,d.plotStatus || null,d.size || null,d.details]);
  const enquiry = result.rows[0];
  sendEnquiryNotification(enquiry).catch(err => console.error('Enquiry notification failed:', err.message));
  res.status(201).json({ ok: true, id: enquiry.id, message: 'Thank you. Your project enquiry has been received. Our team will contact you.' });
}));

app.get('/api/services', asyncRoute(async (_req,res) => { const r = await pool.query('SELECT id,title,description,icon,sort_order FROM services WHERE active=TRUE ORDER BY sort_order,id'); res.json(r.rows); }));
app.get('/api/projects', asyncRoute(async (_req,res) => { const r = await pool.query('SELECT id,title,category,location,description,image_url,featured FROM projects WHERE published=TRUE ORDER BY featured DESC,created_at DESC'); res.json(r.rows); }));
app.get('/api/testimonials', asyncRoute(async (_req,res) => { const r = await pool.query('SELECT id,name,role,quote,rating FROM testimonials WHERE published=TRUE ORDER BY created_at DESC'); res.json(r.rows); }));
app.get('/api/comments', asyncRoute(async (_req,res) => { const r = await pool.query('SELECT id,name,text,likes,created_at FROM comments WHERE approved=TRUE ORDER BY created_at DESC LIMIT 100'); res.json(r.rows); }));
app.post('/api/comments', publicLimiter, checkSameOrigin, asyncRoute(async (req,res) => {
  if (req.body.website) return res.status(202).json({ ok: true });
  const parsed = z.object({ name:z.string().trim().min(2).max(100), text:z.string().trim().min(2).max(600), website:z.string().max(0).optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Enter your name and a comment (maximum 600 characters).' });
  await pool.query('INSERT INTO comments(name,text) VALUES($1,$2)', [parsed.data.name, parsed.data.text]);
  res.status(201).json({ ok:true, message:'Thanks. Your comment has been sent for moderation before publication.' });
}));
app.post('/api/comments/:id/like', publicLimiter, checkSameOrigin, asyncRoute(async (req,res) => {
  const id = Number(req.params.id); if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({error:'Invalid comment.'});
  const r = await pool.query('UPDATE comments SET likes=LEAST(likes+1,1000000) WHERE id=$1 AND approved=TRUE RETURNING likes', [id]);
  if (!r.rowCount) return res.status(404).json({error:'Comment not found.'}); res.json({likes:r.rows[0].likes});
}));

app.post('/api/admin/login', loginLimiter, checkSameOrigin, asyncRoute(async (req,res) => {
  const parsed = z.object({email:z.string().email().max(254),password:z.string().min(1).max(200)}).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({error:'Enter your email and password.'});
  const r = await pool.query('SELECT id,email,password_hash FROM admins WHERE email=$1', [parsed.data.email.toLowerCase()]);
  const admin = r.rows[0];
  if (!admin || !(await bcrypt.compare(parsed.data.password, admin.password_hash))) return res.status(401).json({error:'Invalid email or password.'});
  if (!JWT_SECRET) return res.status(500).json({error:'Server authentication is not configured.'});
  const token = jwt.sign({sub:String(admin.id),email:admin.email}, JWT_SECRET, {expiresIn:'8h',issuer:'meshaq-website',audience:'meshaq-admin'});
  res.cookie(COOKIE_NAME, token, {...cookieOptions(), maxAge:8*60*60*1000}); setCsrf(res);
  await pool.query('UPDATE admins SET last_login_at=NOW() WHERE id=$1',[admin.id]);
  res.json({ok:true,email:admin.email});
}));
app.post('/api/admin/logout', requireAdmin, checkSameOrigin, csrfCheck, (_req,res) => { res.clearCookie(COOKIE_NAME,cookieOptions()); res.clearCookie('meshaq_csrf',{path:'/'}); res.json({ok:true}); });
app.get('/api/admin/me', requireAdmin, (req,res) => { setCsrf(res); res.json({email:req.admin.email}); });
app.get('/api/admin/summary', requireAdmin, asyncRoute(async (_req,res) => {
  const [enquiries,comments,projects,services,testimonials] = await Promise.all([
    pool.query("SELECT COUNT(*)::int total, COUNT(*) FILTER(WHERE status='new')::int fresh FROM enquiries"),
    pool.query("SELECT COUNT(*)::int total, COUNT(*) FILTER(WHERE approved=FALSE)::int pending FROM comments"),
    pool.query('SELECT COUNT(*)::int total FROM projects'), pool.query('SELECT COUNT(*)::int total FROM services'), pool.query('SELECT COUNT(*)::int total FROM testimonials')
  ]); res.json({enquiries:enquiries.rows[0],comments:comments.rows[0],projects:projects.rows[0].total,services:services.rows[0].total,testimonials:testimonials.rows[0].total});
}));
app.get('/api/admin/enquiries', requireAdmin, asyncRoute(async (req,res) => {
  const status = String(req.query.status || 'all');
  const valid = ['all','new','contacted','quoted','won','closed']; if (!valid.includes(status)) return res.status(400).json({error:'Invalid status filter.'});
  const r = status==='all' ? await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 500') : await pool.query('SELECT * FROM enquiries WHERE status=$1 ORDER BY created_at DESC LIMIT 500',[status]); res.json(r.rows);
}));
app.patch('/api/admin/enquiries/:id', requireAdmin, checkSameOrigin, csrfCheck, mutationLimiter, asyncRoute(async (req,res) => {
  const id=Number(req.params.id); const p=z.object({status:z.enum(['new','contacted','quoted','won','closed']),admin_notes:z.string().max(5000).optional()}).safeParse(req.body);
  if(!Number.isSafeInteger(id)||id<1||!p.success)return res.status(400).json({error:'Invalid enquiry update.'});
  const r=await pool.query('UPDATE enquiries SET status=$1,admin_notes=$2 WHERE id=$3 RETURNING *',[p.data.status,p.data.admin_notes||'',id]); if(!r.rowCount)return res.status(404).json({error:'Enquiry not found.'}); res.json(r.rows[0]);
}));

const resources = {
 services:{table:'services', fields:['title','description','icon','active','sort_order'], schema:z.object({title:z.string().trim().min(2).max(160),description:z.string().trim().min(2).max(3000),icon:z.string().trim().max(60).optional(),active:z.boolean().optional(),sort_order:z.number().int().min(0).max(10000).optional()}), order:'sort_order,id'},
 projects:{table:'projects', fields:['title','category','location','description','image_url','featured','published'], schema:z.object({title:z.string().trim().min(2).max(180),category:z.string().trim().min(2).max(80),location:z.string().trim().max(160).optional(),description:z.string().trim().max(4000).optional(),image_url:z.string().trim().max(2000).optional(),featured:z.boolean().optional(),published:z.boolean().optional() }), order:'created_at DESC'},
 comments:{table:'comments', fields:['name','text','approved'], schema:z.object({name:z.string().trim().min(2).max(100),text:z.string().trim().min(2).max(600),approved:z.boolean().optional()}), order:'created_at DESC'},
 testimonials:{table:'testimonials', fields:['name','role','quote','rating','published'], schema:z.object({name:z.string().trim().min(2).max(100),role:z.string().trim().max(120).optional(),quote:z.string().trim().min(2).max(1000),rating:z.number().int().min(1).max(5).optional(),published:z.boolean().optional()}), order:'created_at DESC'}
};
for (const [resource, cfg] of Object.entries(resources)) {
  app.get(`/api/admin/${resource}`, requireAdmin, asyncRoute(async (_req,res) => { const r=await pool.query(`SELECT * FROM ${cfg.table} ORDER BY ${cfg.order}`); res.json(r.rows); }));
  app.post(`/api/admin/${resource}`, requireAdmin, checkSameOrigin, csrfCheck, mutationLimiter, asyncRoute(async (req,res) => {
    const p=cfg.schema.safeParse(req.body); if(!p.success)return res.status(400).json({error:'Please check the fields.',fields:p.error.flatten().fieldErrors});
    const data=p.data; const cols=cfg.fields.filter(f=>data[f]!==undefined); if(!cols.length)return res.status(400).json({error:'No data provided.'});
    const vals=cols.map(f=>data[f]); const placeholders=cols.map((_,i)=>`$${i+1}`).join(',');
    const r=await pool.query(`INSERT INTO ${cfg.table} (${cols.join(',')}) VALUES (${placeholders}) RETURNING *`,vals); res.status(201).json(r.rows[0]);
  }));
  app.patch(`/api/admin/${resource}/:id`, requireAdmin, checkSameOrigin, csrfCheck, mutationLimiter, asyncRoute(async (req,res) => {
    const id=Number(req.params.id); const p=cfg.schema.partial().safeParse(req.body); if(!Number.isSafeInteger(id)||id<1||!p.success)return res.status(400).json({error:'Invalid update.'});
    const cols=cfg.fields.filter(f=>p.data[f]!==undefined); if(!cols.length)return res.status(400).json({error:'No changes provided.'});
    const vals=cols.map(f=>p.data[f]); vals.push(id); const sets=cols.map((f,i)=>`${f}=$${i+1}`).join(',');
    const r=await pool.query(`UPDATE ${cfg.table} SET ${sets} WHERE id=$${vals.length} RETURNING *`,vals); if(!r.rowCount)return res.status(404).json({error:'Item not found.'}); res.json(r.rows[0]);
  }));
  app.delete(`/api/admin/${resource}/:id`, requireAdmin, checkSameOrigin, csrfCheck, mutationLimiter, asyncRoute(async (req,res) => {
    const id=Number(req.params.id); if(!Number.isSafeInteger(id)||id<1)return res.status(400).json({error:'Invalid item.'});
    const r=await pool.query(`DELETE FROM ${cfg.table} WHERE id=$1 RETURNING id`,[id]); if(!r.rowCount)return res.status(404).json({error:'Item not found.'}); res.json({ok:true});
  }));
}

const publicDir = path.join(__dirname, 'public');
app.use('/admin', express.static(path.join(publicDir,'admin')));
app.use(express.static(publicDir, { index:'index.html', dotfiles:'ignore', setHeaders(res,filePath){ if(filePath.endsWith('.html')) res.setHeader('Cache-Control','no-cache'); } }));
app.get('/admin', (_req,res)=>res.sendFile(path.join(publicDir,'admin','index.html')));
app.use((req,res)=> req.path.startsWith('/api/') ? res.status(404).json({error:'Endpoint not found.'}) : res.status(404).sendFile(path.join(publicDir,'index.html')));
app.use((err,req,res,_next)=>{ console.error('Request failed:',err.message); if(res.headersSent)return; res.status(500).json({error:'Something went wrong. Please try again later.'}); });

async function seedServices() {
  const count = await pool.query('SELECT COUNT(*)::int AS count FROM services');
  if (count.rows[0].count) return;
  const defaults = [
    ['Full House Projects','Support for new residential builds, from early planning and coordination to finishing and handover.','house',0],
    ['Construction & Building','Building works coordinated around agreed drawings, specifications, scope and schedule.','hammer',1],
    ['Renovations & Remodeling','Refresh interiors, improve layouts and upgrade existing homes or business premises.','paint-roller',2],
    ['Design & Planning Coordination','Help coordinating the plans and professionals needed to move a project forward.','drafting-compass',3],
    ['Commercial Projects','Construction and improvement enquiries for offices, shops, hospitality and business spaces.','building',4],
    ['Finishes & Interior Upgrades','Discuss flooring, ceilings, painting, cabinetry, tiling and other finishing requirements.','layers',5],
    ['Project Coordination','Organised communication around scope, milestones, workmanship and progress.','clipboard-check',6],
    ['Property Improvement Advice','Talk through improvement goals, priorities and practical next steps for your property.','key-round',7]
  ];
  for (const [title,description,icon,sort] of defaults) await pool.query('INSERT INTO services(title,description,icon,sort_order) VALUES($1,$2,$3,$4)',[title,description,icon,sort]);
}

async function seedAdmin() {
  const password=process.env.ADMIN_PASSWORD;
  if (!password) { console.warn('ADMIN_PASSWORD not set; no initial admin account seeded.'); return; }
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
  const existing=await pool.query('SELECT id FROM admins WHERE email=$1',[ADMIN_EMAIL]);
  if (!existing.rowCount) { const hash=await bcrypt.hash(password,12); await pool.query('INSERT INTO admins(email,password_hash) VALUES($1,$2)',[ADMIN_EMAIL,hash]); console.log(`Initial admin created for ${ADMIN_EMAIL}`); }
}
(async()=>{
  try { await migrate(); await seedAdmin(); await seedServices(); app.listen(PORT,()=>console.log(`MESHAQ website listening on port ${PORT}`)); }
  catch(err) { console.error('Startup failed:',err); process.exit(1); }
})();

process.on('SIGTERM', async()=>{ await pool.end(); process.exit(0); });
process.on('SIGINT', async()=>{ await pool.end(); process.exit(0); });
