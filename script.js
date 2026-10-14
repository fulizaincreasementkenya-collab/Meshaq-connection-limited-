// MESHAQ CONNECTION LIMITED — standalone website interactions (no backend/database)

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });
}

// Clicking a service card preselects the matching enquiry form option.
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const service = link.dataset.service;
    const select = document.getElementById('service');
    if (select) {
      const option = Array.from(select.options).find(item => item.value === service || item.text === service);
      if (option) select.value = option.value;
    }
  });
});

// This form intentionally sends through WhatsApp and does not save data to a database.
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const value = id => document.getElementById(id)?.value.trim() || 'Not specified';
    const message = [
      'MESHAQ CONNECTION LIMITED — NEW ENQUIRY',
      '',
      `Name: ${value('fullName')}`,
      `Phone: ${value('phone')}`,
      `Service required: ${value('service')}`,
      `Estimated budget: ${value('budget')}`,
      `Project location: ${value('location')}`,
      '',
      'Project details:',
      value('message'),
      '',
      'Please contact me regarding this enquiry.'
    ].join('\n');

    const whatsappUrl = `https://wa.me/254712242050?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow) window.location.href = whatsappUrl;
  });
}

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Give remote images a neutral background if the source is temporarily unavailable.
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.classList.add('image-unavailable');
    img.style.backgroundColor = '#e5eaf0';
  });
});
