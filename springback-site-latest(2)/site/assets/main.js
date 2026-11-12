// ===== Shared site engine — used by every page =====
// Expects a page-specific `const T = {en:{...}, es:{...}}` (and optionally
// `const FAQS = {en:[...], es:[...]}` on pages with a #faq-list) to already
// be defined in a <script> tag BEFORE this file is loaded.

function renderFAQ(lang){
  const list=document.getElementById('faq-list');
  if(!list || typeof FAQS === 'undefined') return;
  list.innerHTML='';
  FAQS[lang].forEach((item,i)=>{
    const div=document.createElement('div');
    div.className='faq-item';
    div.innerHTML=`<button class="faq-q" onclick="toggleFAQ(${i})"><span>${item.q}</span><span class="faq-arrow">▾</span></button><div class="faq-a"><p>${item.a}</p></div>`;
    list.appendChild(div);
  });
}

function toggleFAQ(i){
  document.querySelectorAll('.faq-item')[i].classList.toggle('open');
}

function setLang(lang){
  document.documentElement.lang=lang;
  localStorage.setItem('sb-lang',lang);
  const btnEn=document.getElementById('btn-en');
  const btnEs=document.getElementById('btn-es');
  if(btnEn) btnEn.classList.toggle('active',lang==='en');
  if(btnEs) btnEs.classList.toggle('active',lang==='es');
  const t=T[lang];
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n');
    if(t[k]!==undefined) el.innerHTML=t[k];
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{
    const k=el.getAttribute('data-i18n-title');
    if(t[k]!==undefined) document.title=t[k];
  });
  document.querySelectorAll('[data-i18n-desc]').forEach(el=>{
    const k=el.getAttribute('data-i18n-desc');
    if(t[k]!==undefined) el.setAttribute('content', t[k]);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const k=el.getAttribute('data-i18n-placeholder');
    if(t[k]!==undefined) el.setAttribute('placeholder', t[k]);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el=>{
    const k=el.getAttribute('data-i18n-alt');
    if(t[k]!==undefined) el.setAttribute('alt', t[k]);
  });
  renderFAQ(lang);
}

function toggleTheme(){
  const html=document.documentElement;
  const isLight=html.getAttribute('data-theme')==='light';
  html.setAttribute('data-theme',isLight?'dark':'light');
  const btn=document.getElementById('theme-btn');
  if(btn) btn.textContent=isLight?'☀️':'🌙';
  localStorage.setItem('sb-theme',isLight?'dark':'light');
}

async function init(){
  const savedTheme=localStorage.getItem('sb-theme');
  if(savedTheme){
    document.documentElement.setAttribute('data-theme',savedTheme);
    const btn=document.getElementById('theme-btn');
    if(btn) btn.textContent=savedTheme==='dark'?'☀️':'🌙';
  }
  const saved=localStorage.getItem('sb-lang');
  if(saved){setLang(saved);return;}
  const apis=[
    ()=>fetch('https://ipwho.is/').then(r=>r.json()).then(d=>d.country_code),
    ()=>fetch('https://ipapi.co/country/').then(r=>r.text()).then(t=>t.trim()),
    ()=>fetch('https://api.country.is/').then(r=>r.json()).then(d=>d.country)
  ];
  for(const api of apis){
    try{const c=await api();setLang(c==='MX'?'es':'en');return;}catch(e){continue;}
  }
  setLang(navigator.language?.toLowerCase().startsWith('es')?'es':'en');
}

// Contact form handler — submits via Web3Forms, blocks bot submissions via honeypot
(function(){
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (document.getElementById('botcheck').checked) return;

    const resultEl = document.getElementById('formResult');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: json
      });
      const result = await response.json();

      if (result.success) {
        resultEl.style.color = 'var(--green)';
        resultEl.textContent = document.documentElement.lang === 'es'
          ? '¡Mensaje enviado! Te contactaremos pronto.'
          : "Message sent! We'll be in touch soon.";
        contactForm.reset();
      } else {
        resultEl.style.color = 'var(--orange)';
        resultEl.textContent = document.documentElement.lang === 'es'
          ? 'Algo salió mal. Intenta de nuevo o escríbenos directamente a hello@springbackadvisors.com'
          : 'Something went wrong. Please try again or email us directly at hello@springbackadvisors.com';
      }
    } catch (error) {
      resultEl.style.color = 'var(--orange)';
      resultEl.textContent = document.documentElement.lang === 'es'
        ? 'Algo salió mal. Intenta de nuevo o escríbenos directamente a hello@springbackadvisors.com'
        : 'Something went wrong. Please try again or email us directly at hello@springbackadvisors.com';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
})();

// Generic gated-resource form handler — any form with class="gated-form" and
// a data-resource-url attribute: on successful submit, captures the email via
// Web3Forms, then triggers the actual file download. Reusable for any future
// gated resource (checklists, guides, quiz results) — just add the class and
// data attribute, no new JS needed.
(function(){
  document.querySelectorAll('form.gated-form').forEach(function(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.checked) return;

      const resultEl = form.querySelector('.gated-result');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '...';

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: json
        });
        const result = await response.json();

        if (result.success) {
          const resourceUrl = form.getAttribute('data-resource-url');
          if (resourceUrl) {
            const link = document.createElement('a');
            link.href = resourceUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          if (resultEl) {
            resultEl.style.color = 'var(--green)';
            resultEl.textContent = document.documentElement.lang === 'es'
              ? (resourceUrl ? '¡Listo! Tu descarga debería comenzar automáticamente.' : '¡Recibido! Nos pondremos en contacto contigo pronto.')
              : (resourceUrl ? "You're in! Your download should start automatically." : "Got it! We'll be in touch soon.");
          }
          form.reset();
        } else {
          if (resultEl) {
            resultEl.style.color = 'var(--orange)';
            resultEl.textContent = document.documentElement.lang === 'es'
              ? 'Algo salió mal. Intenta de nuevo.'
              : 'Something went wrong. Please try again.';
          }
        }
      } catch (error) {
        if (resultEl) {
          resultEl.style.color = 'var(--orange)';
          resultEl.textContent = document.documentElement.lang === 'es'
            ? 'Algo salió mal. Intenta de nuevo.'
            : 'Something went wrong. Please try again.';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
})();

init();

// Floating logo icon (only present in the homepage hero)
(function(){
  const el = document.getElementById('hcoil');
  if(!el) return;

  let x = 0, y = 0;
  let vx = 0.09, vy = 0.06;
  const bounds = { x: 28, y: 22 };

  let tilt = -20;
  let tiltTarget = -20;

  let mouseX = 0, mouseY = 0;
  let targetMX = 0, targetMY = 0;

  document.addEventListener('mousemove', function(e){
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetMX = ((e.clientX - cx) / cx) * 10;
    targetMY = ((e.clientY - cy) / cy) * 8;
  });

  function tick(){
    x += vx;
    y += vy;

    if(x >  bounds.x){ x =  bounds.x; vx *= -1; }
    if(x < -bounds.x){ x = -bounds.x; vx *= -1; }
    if(y >  bounds.y){ y =  bounds.y; vy *= -1; }
    if(y < -bounds.y){ y = -bounds.y; vy *= -1; }

    if(Math.random() < 0.004){
      vx += (Math.random() - 0.5) * 0.03;
      vy += (Math.random() - 0.5) * 0.03;
      const speed = Math.sqrt(vx*vx + vy*vy);
      if(speed > 0.13){ vx *= 0.13/speed; vy *= 0.13/speed; }
      if(speed < 0.04){ vx *= 0.07/speed; vy *= 0.07/speed; }
    }

    tiltTarget = (vx / 0.13) * 45;
    tilt += (tiltTarget - tilt) * 0.012;

    mouseX += (targetMX - mouseX) * 0.03;
    mouseY += (targetMY - mouseY) * 0.03;

    el.style.transform = `translate(${x + mouseX}px, calc(-50% + ${y + mouseY}px)) rotate(${tilt}deg)`;
    requestAnimationFrame(tick);
  }

  el.style.transform = 'translateY(-50%) rotate(-20deg)';
  requestAnimationFrame(tick);
})();
