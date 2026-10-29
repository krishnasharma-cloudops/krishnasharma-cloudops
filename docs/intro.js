(() => {
  'use strict';
  const entry = document.getElementById('entry');
  if (!entry) return;
  const enterButton = document.getElementById('enter-portfolio');
  const resumeButton = document.getElementById('entry-resume');
  const replayButton = document.getElementById('replay-intro');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const main = document.getElementById('main');
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');
  const assistant = document.getElementById('assistant-launcher');
  let open = true;
  let leaving = false;
  let raf = null;
  let particles = [];
  const canvas = document.getElementById('entry-particles');
  const ctx = canvas && canvas.getContext('2d');
  let width=0,height=0,dpr=1;

  function lockBackground(locked) {
    document.body.classList.toggle('intro-active',locked);
    for (const el of [main,header,footer,assistant]) if (el) el.inert = locked;
    entry.setAttribute('aria-hidden', String(!locked));
  }

  function resize() {
    if (!ctx || !canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1,2);
    width = window.innerWidth; height=window.innerHeight;
    canvas.width = Math.floor(width*dpr);
    canvas.height = Math.floor(height*dpr);
    canvas.style.width = width+'px'; canvas.style.height = height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const maxPoints=width<600?28:64;
    particles = Array.from({length:maxPoints},(_,i)=>({
      x: (Math.sin(i*91.7+17)*.5+.5)*width,
      y: (Math.sin(i*66.38+51)*.5+.5)*height,
      r: (i%8===0?1.7:.85),
      phase:i*.67,
      vx:((i%5)-2)*.07,
      vy:((i%7)-3)*.055
    }));
  }
  function draw(time) {
    if (!open || !ctx) return;
    ctx.clearRect(0,0,width,height);
    const t=time*.00045;
    for (let i=0;i<particles.length;i++) {
      const p=particles[i];
      const x=p.x + (reduced ? 0 : Math.sin(t+p.phase)*11);
      const y=p.y + (reduced ? 0 : Math.cos(t*.8+p.phase)*8);
      const a=.13 + .20*(.5+.5*Math.sin(t*2+p.phase));
      ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);
      ctx.fillStyle=i%3===0?`rgba(163,181,255,${a})`:`rgba(131,220,236,${a})`;
      ctx.fill();
    }
    if (!reduced && open) raf = window.requestAnimationFrame(draw);
  }
  function show() {
    if (leaving) return;
    open=true;
    entry.classList.remove('is-hidden','is-leaving');
    entry.style.removeProperty('display');
    lockBackground(true);
    if (ctx) {resize();if(raf)cancelAnimationFrame(raf);raf=window.requestAnimationFrame(draw);}
    // Let keyboard users Tab to the button; do not show a focus ring on mouse entry.
  }
  function exit(goToResume=false) {
    if (!open || leaving) return;
    leaving=true;
    open=false;
    if (raf) {cancelAnimationFrame(raf);raf=null;}
    entry.classList.add('is-leaving');
    const delay=reduced?70:910;
    window.setTimeout(()=>{
      entry.classList.add('is-hidden');
      entry.classList.remove('is-leaving');
      lockBackground(false);
      leaving=false;
      if(goToResume){
        document.getElementById('resume')?.scrollIntoView({behavior:reduced?'instant':'smooth'});
        document.getElementById('resume-heading')?.setAttribute('tabindex','-1');
        window.setTimeout(()=>document.getElementById('resume-heading')?.focus({preventScroll:true}),250);
      } else {
        window.scrollTo({top:0,behavior:'instant'});
        document.querySelector('.brand')?.focus({preventScroll:true});
      }
    },delay);
  }
  enterButton?.addEventListener('click',()=>exit());
  resumeButton?.addEventListener('click',()=>exit(true));
  replayButton?.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'instant'});
    show();
  });
  entry.addEventListener('keydown',event=>{
    if(event.key==='Enter' && !event.repeat && event.target===entry){event.preventDefault();exit();}
    if(event.key==='Escape'){event.preventDefault();exit();}
  });
  document.addEventListener('keydown',event=>{
    if(!open||leaving||event.repeat)return;
    if(event.key==='Enter' && event.target?.tagName!=='BUTTON' && event.target?.tagName!=='A'){event.preventDefault();exit();}
  });
  window.addEventListener('resize',()=>{if(open&&ctx){resize();if(reduced)draw(0);}}, {passive:true});
  // Deep links should open directly to the requested portfolio section.
  if(window.location.hash && window.location.hash!=='#top') {
    open=false;
    entry.classList.add('is-hidden');
    lockBackground(false);
  } else {
    lockBackground(true);
    if(ctx) {resize();raf=window.requestAnimationFrame(draw);}
    // No automatic focus ring on initial load.
  }
})();
