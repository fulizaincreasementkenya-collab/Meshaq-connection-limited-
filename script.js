const projectData = [
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
form?.addEventListener("submit", event => {
  event.preventDefault();
  const checkedServices = [...form.querySelectorAll('input[name="services"]:checked')].map(el => el.value);
  const feedback = document.getElementById("formFeedback");
  if (!checkedServices.length) {
    feedback.textContent = "Please select at least one service so we understand what you need.";
    form.querySelector(".services-field").scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }
  const data = new FormData(form);
  const attachment = document.getElementById("attachment")?.files?.[0];
  const message = [
    "PROJECT APPLICATION — MESHAQ CONNECTION LIMITED",
    "",
    `Full name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email") || "Not provided"}`,
    `Preferred contact: ${data.get("contactMethod")}`,
    `County: ${data.get("county")}`,
    `Project location: ${data.get("location")}`,
    `Project type: ${data.get("projectType")}`,
    `Services required: ${checkedServices.join(", ")}`,
    `Estimated budget: ${data.get("budget")}`,
    `Preferred start: ${data.get("startDate")}`,
    `Plot status: ${data.get("plotStatus")}`,
    `Bedrooms / floors: ${data.get("size") || "Not specified"}`,
    `Project details: ${data.get("details")}`,
    `Reference file selected: ${attachment ? attachment.name + " (please attach it manually in WhatsApp)" : "No file selected"}`,
    "",
    "Please contact me to discuss the next steps. Thank you."
  ].join("\n");
  feedback.textContent = "Your application message is ready. WhatsApp will open in a new tab so you can review and send it.";
  const whatsappUrl = "https://wa.me/25471224050?text=" + encodeURIComponent(message);
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const commentInput = document.getElementById("commentInput");
const commentsList = document.getElementById("commentsList");
const commentCount = document.getElementById("commentCount");
const postComment = document.getElementById("postComment");
const storageKey = "meshaq_local_comments_v1";
function getComments() {
  try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; }
}
function saveComments(comments) {
  try { localStorage.setItem(storageKey, JSON.stringify(comments)); } catch {}
}
function safeText(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}
function renderComments() {
  const comments = getComments();
  commentCount.textContent = `${comments.length} comment${comments.length === 1 ? "" : "s"}`;
  if (!comments.length) {
    commentsList.innerHTML = '<div class="empty-comments">No comments yet. Be the first to leave a question or feedback.</div>';
    return;
  }
  commentsList.innerHTML = comments.slice().reverse().map(comment => `
    <article class="comment" data-id="${comment.id}">
      <div class="comment-head"><b>${safeText(comment.name || "Website visitor")}</b><small>${safeText(comment.date || "Just now")}</small></div>
      <p>${safeText(comment.text)}</p>
      <div class="comment-actions"><button class="like-comment ${comment.liked ? "liked" : ""}" data-id="${comment.id}"><i data-lucide="thumbs-up"></i> Like <span>${comment.likes || 0}</span></button></div>
    </article>`).join("");
  if (window.lucide) lucide.createIcons();
}
postComment?.addEventListener("click", () => {
  const text = commentInput.value.trim();
  if (!text) { commentInput.focus(); return; }
  const comments = getComments();
  comments.push({id:Date.now().toString(), name:"Website visitor", text, date:new Date().toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}), likes:0, liked:false});
  saveComments(comments);
  commentInput.value = "";
  renderComments();
});
commentInput?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); postComment.click(); }});
commentsList?.addEventListener("click", e => {
  const button = e.target.closest(".like-comment");
  if (!button) return;
  const comments = getComments();
  const comment = comments.find(c => c.id === button.dataset.id);
  if (!comment) return;
  comment.liked = !comment.liked;
  comment.likes = Math.max(0, (comment.likes || 0) + (comment.liked ? 1 : -1));
  saveComments(comments);
  renderComments();
});
renderComments();

const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => backToTop?.classList.toggle("show", window.scrollY > 500));
backToTop?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
document.getElementById("year").textContent = new Date().getFullYear();
if (window.lucide) lucide.createIcons();
