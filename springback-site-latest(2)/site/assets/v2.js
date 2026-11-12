/* Springback V2 — tabs, scroll reveal, subtle glass parallax. All optional/safe. */
(function(){
  // Tabs (About block)
  var tabs=[].slice.call(document.querySelectorAll('.tab')),panels=[].slice.call(document.querySelectorAll('.tabpanel'));
  tabs.forEach(function(t){t.addEventListener('click',function(){
    var i=t.getAttribute('data-tab');
    tabs.forEach(function(x){x.classList.toggle('on',x===t)});
    panels.forEach(function(p){p.classList.toggle('on',p.getAttribute('data-panel')===i)});
  })});

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;

  // Parallax: glass squares drift slightly with the pointer
  var arts=[].slice.call(document.querySelectorAll('.art2'));
  window.addEventListener('mousemove',function(e){
    var x=(e.clientX/window.innerWidth-.5)*2,y=(e.clientY/window.innerHeight-.5)*2;
    arts.forEach(function(a){a.style.setProperty('--mx',(x*14)+'px');a.style.setProperty('--my',(y*10)+'px')});
  },{passive:true});

  // Scroll reveal
  if(!('IntersectionObserver' in window))return;
  var sel='.sec-lbl,.sec h2,.sec-sub,.srv-card,.pillar,.fcard,.price-line,.case-study-card,.blog-card,.acard,.faq-item,.checks li,.tabs,.art2,.cform,.cinfo';
  var els=[].slice.call(document.querySelectorAll(sel));
  document.documentElement.classList.add('js-reveal');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){
    el.classList.add('rv');
    var sib=[].indexOf.call(el.parentNode.children,el);
    el.style.setProperty('--rd',Math.min(sib,6)*0.07+'s');
    io.observe(el);
  });
})();
