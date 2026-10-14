let projectData = [
  {title:"Contemporary Family Home",category:"homes",tag:"RESIDENTIAL",location:"Modern home design",image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85"},
  {title:"Luxury Modern Residence",category:"luxury",tag:"LUXURY HOME",location:"Clean lines and natural light",image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"},
  {title:"Modern Bungalow Concept",category:"homes",tag:"BUNGALOW",location:"Practical single-level living",image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85"},
  {title:"Executive Maisonette",category:"luxury",tag:"MAISONETTE",location:"A bold two-storey profile",image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"},
  {title:"Coastal Villa Inspiration",category:"luxury",tag:"VILLA",location:"Indoor-outdoor living",image:"https://images.unsplash.com/photo-1613490493576-7kan3b45b?auto=format&fit=crop&w=900&q=85"},
  {title:"Apartment Development",category:"commercial",tag:"MULTI-RESIDENTIAL",location:"Urban living concept",image:"https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=85"},
  {title:"Hospitality & Hotel Design",category:"commercial",tag:"HOSPITALITY",location:"Guest-focused architecture",image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85"},
  {title:"Gated Estate Concept",category:"homes",tag:"RESIDENTIAL ESTATE",location:"A coordinated neighbourhood",image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"},
  {title:"Country Home Retreat",category:"homes",tag:"COUNTRY HOME",location:"Calm and open surroundings",image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=85"},
  {title:"Premium Townhouse",category:"luxury",tag:"TOWNHOUSE",location:"Contemporary city living",image:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85"},
  {title:"Commercial Office Building",category:"commercial",tag:"COMMERCIAL",location:"Professional workplace concept",image:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85"},
  {title:"Rental Apartment Concept",category:"commercial",tag:"INVESTMENT PROPERTY",location:"Space-efficient layouts",image:"https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=900&q=85"},
  {title:"Modern Farmhouse",category:"homes",tag:"FARMHOUSE",location:"Warm materials and space",image:"https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=85"},
  {title:"Minimalist Luxury Home",category:"luxury",tag:"MINIMALIST",location:"Simple forms, refined detail",image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85"},
  {title:"Contemporary Duplex",category:"homes",tag:"DUPLEX",location:"Flexible family layout",image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"},
  {title:"Luxury Living Room",category:"interiors",tag:"INTERIOR",location:"Natural textures and light",image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85"},
  {title:"Modern Kitchen Finishes",category:"interiors",tag:"KITCHEN",location:"Clean, practical detailing",image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"},
  {title:"Premium Bathroom Concept",category:"interiors",tag:"BATHROOM",location:"Refined surfaces and fittings",image:"https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=85"},
  {title:"Modern Coastal Residence",category:"luxury",tag:"COASTAL HOME",location:"Open-plan tropical living",image:"https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85"},
  {title:"Mixed-Use Development",category:"commercial",tag:"MIXED USE",location:"Retail and residential concept",image:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=85"},
  {title:"Premium Home Exterior",category:"homes",tag:"EXTERIOR FINISH",location:"A considered street presence",image:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85"},
  {title:"Luxury Bedroom Interior",category:"interiors",tag:"BEDROOM",location:"Comfort-led interior design",image:"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85"},
  {title:"Boutique Hotel Exterior",category:"commercial",tag:"HOTEL",location:"Hospitality design inspiration",image:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=85"},
  {title:"Elegant Staircase Detail",category:"interiors",tag:"INTERIOR DETAIL",location:"Material and finish inspiration",image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85"}
];

const projectsGrid = document.getElementById("projectsGrid");
function renderProjects(filter="all") {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = projectData.filter(p => filter === "all" || p.category === filter).map((p, index) => `
    <article class="project-card">
      <img src="${p.image}" alt="${p.title} design inspiration" loading="lazy" onerror="this.style.display='none'">
      <div class="project-open" aria-hidden="true"><i data-lucide="arrow-up-right"></i></div>
      <div class="project-card-content"><div class="project-category">${p.tag}</div><h3>${p.title}</h3><p>${p.location}</p></div>
    </article>`).join("");
  if (window.lucide) lucide.createIcons();
}
renderProjects();
async function loadPublishedProjects() {
  try {
    const response = await fetch("/api/projects", {credentials:"same-origin"});
    if (!response.ok) return;
    const projects = await response.json();
    if (!projects.length) return; // Keep the clearly labelled design-inspiration gallery until verified work is published.
    projectData = projects.map(p => ({title:p.title,category:p.category||"homes",tag:String(p.category||"PROJECT").toUpperCase(),location:p.location||"Kenya",image:p.image_url||"",description:p.description||""}));
    renderProjects(document.querySelector(".filter-btn.active")?.dataset.filter || "all");
  } catch {}
}
loadPublishedProjects();
async function loadServices() {
  try {
    const response = await fetch("/api/services", {credentials:"same-origin"}); if(!response.ok)return;
    const services=await response.json(); if(!services.length)return;
    const grid=document.getElementById("servicesGrid"); if(!grid)return;
    grid.innerHTML=services.map((service,index)=>`<article class="service-card ${index===0?'service-featured':''}"><div class="service-number">${String(index+1).padStart(2,'0')}${index===0?' / CORE SERVICE':''}</div><div class="service-icon"><i data-lucide="${safeText(service.icon||'hammer')}"></i></div><h3>${safeText(service.title)}</h3><p>${safeText(service.description)}</p><a href="#project-request" class="service-link" data-service="${safeText(service.title)}">Discuss this service <i data-lucide="arrow-up-right"></i></a></article>`).join("");
    if(window.lucide)lucide.createIcons();
  } catch {}
}
loadServices();
document.getElementById("servicesGrid")?.addEventListener("click",event=>{const link=event.target.closest(".service-link");if(!link)return;const type=document.getElementById("projectType");if(type){const title=link.dataset.service.toLowerCase();if(title.includes('renovat'))type.value='Renovation / remodeling';else if(title.includes('commercial'))type.value='Commercial building';else if(title.includes('interior')||title.includes('finish'))type.value='Interior finishing';else if(title.includes('house'))type.value='Full house project';else type.value='Other project';}});
async function loadTestimonials(){
  const target=document.getElementById('testimonialsGrid');if(!target)return;
  try{const response=await fetch('/api/testimonials',{credentials:'same-origin'});if(!response.ok)return;const items=await response.json();if(!items.length){target.innerHTML='';return;}
    target.innerHTML=items.map(t=>`<article class="testimonial-card"><div class="testimonial-stars" aria-label="${Number(t.rating)||5} out of 5 stars">${'★'.repeat(Math.max(1,Math.min(5,Number(t.rating)||5)))}</div><blockquote>“${safeText(t.quote)}”</blockquote><strong>${safeText(t.name)}</strong><small>${safeText(t.role||'Client')}</small></article>`).join('');
  }catch{}
}
loadTestimonials();
document.querySelectorAll(".filter-btn").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  renderProjects(button.dataset.filter);
}));

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  if (window.lucide) lucide.createIcons();
});
mainNav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  if (menuToggle) menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  if (window.lucide) lucide.createIcons();
}));

document.querySelectorAll(".service-link").forEach(link => link.addEventListener("click", () => {
  const service = link.dataset.service;
  const type = document.getElementById("projectType");
  if (type && service) {
    const mapping = {
      "Full house project":"Full house project",
      "Construction and building":"Construction and building",
      "Renovations and remodeling":"Renovations / remodeling",
      "Design and planning coordination":"Full house project",
      "Commercial project":"Commercial building",
      "Finishes and interior upgrades":"Interior finishing",
      "Project coordination":"Full house project",
      "Property improvement advice":"Renovation / remodeling"
    };
    type.value = mapping[service] || "";
    const boxes = [...document.querySelectorAll('input[name="services"]')];
    boxes.forEach(box => { if (box.value.toLowerCase().includes(service.toLowerCase().split(" ")[0])) box.checked = true; });
  }
}));

const form = document.getElementById("projectForm");
form?.addEventListener("submit", async event => {
  event.preventDefault();
  const checkedServices = [...form.querySelectorAll('input[name="services"]:checked')].map(el => el.value);
  const feedback = document.getElementById("formFeedback");
  if (!checkedServices.length) {
    feedback.textContent = "Please select at least one service so we understand what you need.";
    form.querySelector(".services-field").scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }
  if (!form.querySelector('[name="consent"]')?.checked) { feedback.textContent = "Please confirm the privacy consent before submitting."; return; }
  const data = new FormData(form);
  const payload = {
    name: String(data.get("name") || "").trim(), phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(), contactMethod: data.get("contactMethod"),
    county: data.get("county"), location: String(data.get("location") || "").trim(),
    projectType: data.get("projectType"), services: checkedServices, budget: data.get("budget"),
    startDate: data.get("startDate"), plotStatus: data.get("plotStatus"), size: String(data.get("size") || "").trim(),
    details: String(data.get("details") || "").trim(), website: String(data.get("website") || ""), consent: true
  };
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true; feedback.textContent = "Submitting your enquiry securely…";
  try {
    const response = await fetch("/api/enquiries", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),credentials:"same-origin"});
    const result = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(result.error || "We couldn't submit your enquiry. Please check your details and try again.");
    const message = [
      "PROJECT APPLICATION — MESHAQ CONNECTION LIMITED", "", `Reference: ${result.id || "Submitted online"}`,
      `Full name: ${payload.name}`, `Phone: ${payload.phone}`, `Email: ${payload.email || "Not provided"}`,
      `Preferred contact: ${payload.contactMethod}`, `County: ${payload.county}`, `Project location: ${payload.location}`,
      `Project type: ${payload.projectType}`, `Services required: ${checkedServices.join(", ")}`,
      `Estimated budget: ${payload.budget}`, `Preferred start: ${payload.startDate || "Not specified"}`,
      `Plot status: ${payload.plotStatus || "Not specified"}`, `Bedrooms / floors: ${payload.size || "Not specified"}`,
      `Project details: ${payload.details}`, "", "I have submitted this enquiry through your website. Please contact me about the next steps."
    ].join("\n");
    feedback.textContent = `${result.message || "Your enquiry has been received."} You can also send the details to our WhatsApp team.`;
    const wa = document.createElement("a"); wa.href = "https://wa.me/254712242050?text=" + encodeURIComponent(message); wa.target="_blank"; wa.rel="noopener noreferrer"; wa.className="btn btn-gold"; wa.textContent="Continue on WhatsApp"; wa.style.marginTop="10px"; feedback.appendChild(document.createElement("br")); feedback.appendChild(wa);
    form.reset();
  } catch (error) { feedback.textContent = error.message || "Network error. Please try again or contact us by WhatsApp."; }
  finally { submit.disabled = false; }
});

const commentInput = document.getElementById("commentInput");
const commentName = document.getElementById("commentName");
const commentsList = document.getElementById("commentsList");
const commentCount = document.getElementById("commentCount");
const postComment = document.getElementById("postComment");
function safeText(value) { const span = document.createElement("span"); span.textContent = value ?? ""; return span.innerHTML; }
async function renderComments() {
  if (!commentsList) return;
  try {
    const response = await fetch("/api/comments", {credentials:"same-origin"});
    const comments = response.ok ? await response.json() : [];
    commentCount.textContent = `${comments.length} published comment${comments.length === 1 ? "" : "s"}`;
    if (!comments.length) { commentsList.innerHTML = '<div class="empty-comments">No approved comments yet. Be the first to share feedback.</div>'; return; }
    commentsList.innerHTML = comments.map(comment => `<article class="comment" data-id="${Number(comment.id)}"><div class="comment-head"><b>${safeText(comment.name)}</b><small>${new Date(comment.created_at).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"})}</small></div><p>${safeText(comment.text)}</p><div class="comment-actions"><button class="like-comment" data-id="${Number(comment.id)}"><i data-lucide="thumbs-up"></i> Like <span>${Number(comment.likes)||0}</span></button></div></article>`).join("");
    if (window.lucide) lucide.createIcons();
  } catch { commentCount.textContent = "Community feedback"; commentsList.innerHTML = '<div class="empty-comments">Comments are temporarily unavailable.</div>'; }
}
postComment?.addEventListener("click", async () => {
  const name = commentName?.value.trim() || ""; const text = commentInput?.value.trim() || "";
  if (name.length < 2) { commentName?.focus(); return; }
  if (text.length < 2) { commentInput?.focus(); return; }
  postComment.disabled = true;
  try {
    const response = await fetch("/api/comments", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,text,website:""}),credentials:"same-origin"});
    const result = await response.json().catch(()=>({})); if (!response.ok) throw new Error(result.error || "Unable to send comment.");
    commentName.value=""; commentInput.value=""; alert(result.message || "Thank you. Your comment is awaiting review.");
  } catch (error) { alert(error.message || "Unable to send comment. Please try again."); }
  finally { postComment.disabled = false; }
});
commentInput?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); postComment.click(); }});
commentsList?.addEventListener("click", async e => {
  const button = e.target.closest(".like-comment"); if (!button) return;
  button.disabled=true;
  try { const response=await fetch(`/api/comments/${button.dataset.id}/like`,{method:"POST",credentials:"same-origin"});const result=await response.json();if(!response.ok)throw new Error(result.error);const count=button.querySelector('span');if(count)count.textContent=result.likes; }
  catch(error){ console.warn(error); } finally { button.disabled=false; }
});
renderComments();

const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => backToTop?.classList.toggle("show", window.scrollY > 500));
backToTop?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
document.getElementById("year").textContent = new Date().getFullYear();
if (window.lucide) lucide.createIcons();
