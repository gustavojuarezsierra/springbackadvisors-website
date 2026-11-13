// ===== Shared site engine — used by every page =====
// Expects a page-specific `const T = {en:{...}, es:{...}}` (and optionally
// `const FAQS = {en:[...], es:[...]}` on pages with a #faq-list) to already
// be defined in a <script> tag BEFORE this file is loaded.

// Shared strings used on every page (footer legal links, cookie banner, form
// privacy notes). Page T entries win over these. Must stay valid JSON between
// "const TC=" and "\n};" — tools/validate_site.py parses it.
const TC={
  "en": {
    "lg.priv": "Privacy Notice",
    "lg.terms": "Terms of Use",
    "lg.cookies": "Cookies",
    "lg.form": "Springback Technology Advisors uses your details only to respond to this request.",
    "lg.form.link": "Privacy Notice",
    "ck.set": "Cookie settings",
    "ck.msg": "We use Google Analytics cookies to see which pages are useful, only if you allow it. Your theme and language choices are stored on your device so the site works.",
    "ck.more": "How we use cookies",
    "ck.acc": "Accept analytics",
    "ck.rej": "Reject"
  },
  "es": {
    "lg.priv": "Aviso de Privacidad",
    "lg.terms": "Términos de Uso",
    "lg.cookies": "Cookies",
    "lg.form": "Springback Technology Advisors usa tus datos solo para atender esta solicitud.",
    "lg.form.link": "Aviso de Privacidad",
    "ck.set": "Configurar cookies",
    "ck.msg": "Usamos cookies de Google Analytics para saber qué páginas son útiles, solo si lo permites. Tu tema y tu idioma se guardan en tu dispositivo para que el sitio funcione.",
    "ck.more": "Cómo usamos las cookies",
    "ck.acc": "Aceptar analítica",
    "ck.rej": "Rechazar"
  }
};

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
  const t=Object.assign({},TC[lang],T[lang]);
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

function init(){
  const savedTheme=localStorage.getItem('sb-theme');
  if(savedTheme){
    document.documentElement.setAttribute('data-theme',savedTheme);
    const btn=document.getElementById('theme-btn');
    if(btn) btn.textContent=savedTheme==='dark'?'☀️':'🌙';
  }
  // Language: saved choice, else the browser's language. No IP lookups:
  // they sent every visitor's IP to third parties and delayed the first paint.
  const saved=localStorage.getItem('sb-lang');
  const langs=navigator.languages||[navigator.language||'en'];
  setLang(saved||(langs.some(l=>/^es\b/i.test(l))?'es':'en'));
  initConsent();
}

// ===== Cookie consent (Google Analytics loads only after "Accept") =====
const SB_GA='G-5C07PH8H24';
const SB_CONSENT_DAYS=365;
const SB_BASE=new URL('../',document.currentScript.src); // site root, works in /test/ too

function readConsent(){
  try{
    const c=JSON.parse(localStorage.getItem('sb-consent'));
    if(c&&c.v===1&&Date.now()-c.ts<SB_CONSENT_DAYS*864e5) return c;
  }catch(e){}
  return null;
}

function loadAnalytics(){
  window['ga-disable-'+SB_GA]=false;
  if(window.gtag) return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){dataLayer.push(arguments);};
  gtag('js',new Date());
  gtag('config',SB_GA);
  const s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+SB_GA;
  document.head.appendChild(s);
}

function clearAnalyticsCookies(){
  window['ga-disable-'+SB_GA]=true;
  const host=location.hostname, root=host.split('.').slice(-2).join('.');
  document.cookie.split(';').forEach(c=>{
    const n=c.split('=')[0].trim();
    if(!/^_ga/.test(n)) return;
    ['',host,'.'+host,'.'+root].forEach(d=>{
      document.cookie=n+'=; Max-Age=0; path=/'+(d?'; domain='+d:'');
    });
  });
}

function saveConsent(analytics){
  try{localStorage.setItem('sb-consent',JSON.stringify({v:1,analytics:analytics,ts:Date.now()}));}catch(e){}
  analytics?loadAnalytics():clearAnalyticsCookies();
  const b=document.getElementById('sb-ck');
  if(b) b.hidden=true;
}

function showConsentBanner(){
  let b=document.getElementById('sb-ck');
  if(!b){
    b=document.createElement('div');
    b.id='sb-ck';
    b.className='ck';
    b.setAttribute('role','region');
    b.setAttribute('aria-label','Cookies');
    b.innerHTML='<p><span data-i18n="ck.msg"></span> <a data-i18n="ck.more"></a></p>'+
      '<div class="ck-btns"><button type="button" class="ck-b" data-ck="0" data-i18n="ck.rej"></button>'+
      '<button type="button" class="ck-b" data-ck="1" data-i18n="ck.acc"></button></div>';
    b.querySelector('a').href=new URL('privacy.html#cookies',SB_BASE).href;
    b.addEventListener('click',e=>{
      const v=e.target.getAttribute('data-ck');
      if(v!==null) saveConsent(v==='1');
    });
    document.body.appendChild(b);
    const t=Object.assign({},TC[document.documentElement.lang]||TC.en,(typeof T!=='undefined'&&T[document.documentElement.lang])||{});
    b.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=t[el.getAttribute('data-i18n')];});
  }
  b.hidden=false;
}

function initConsent(){
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-sb-cookies]')){e.preventDefault();showConsentBanner();}
  });
  const c=readConsent();
  if(c){ if(c.analytics) loadAnalytics(); return; }
  // Browser "Global Privacy Control" signal counts as a refusal; don't ask.
  if(navigator.globalPrivacyControl) return;
  showConsentBanner();
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
