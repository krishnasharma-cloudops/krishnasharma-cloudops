(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Spotlight + subtle 3D tilt cards
  document.querySelectorAll('.project-card,.skill-card,.impact-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      card.style.setProperty('--mx',`${x}px`);card.style.setProperty('--my',`${y}px`);
      if(!reduce && innerWidth>820){const rx=(.5-y/r.height)*4.5,ry=(x/r.width-.5)*6;card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`}
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
  const canvas=document.querySelector('#fabricCanvas'); if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:true}); if(!ctx)return;
  const stage=canvas.parentElement; let w=0,h=0,dpr=1,raf=0,visible=true;
  const mouse={x:.5,y:.5,active:false};
  const palette=['#54f4ff','#4d8dff','#9b6cff','#ff5fcf','#67ffbd'];
  const nodes=Array.from({length:34},(_,i)=>({
    x:.08+Math.random()*.84,y:.09+Math.random()*.82,baseX:0,baseY:0,
    r:i<8?2.8+Math.random()*2:1+Math.random()*1.6,
    phase:Math.random()*Math.PI*2,speed:.25+Math.random()*.55,color:palette[i%palette.length]
  })).map(n=>(n.baseX=n.x,n.baseY=n.y,n));
  function resize(){const r=stage.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.6);w=Math.max(1,r.width);h=Math.max(1,r.height);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  function point(e){const r=stage.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width;mouse.y=(e.clientY-r.top)/r.height;mouse.active=true}
  stage.addEventListener('pointermove',point);stage.addEventListener('pointerleave',()=>mouse.active=false);
  const io=new IntersectionObserver(e=>{visible=e[0]?.isIntersecting??true},{threshold:.05});io.observe(stage);
  function draw(t){raf=requestAnimationFrame(draw);if(!visible)return;ctx.clearRect(0,0,w,h);const time=t*.001;
    // Aurora fog
    const g=ctx.createRadialGradient(w*.5,h*.5,10,w*.5,h*.5,Math.min(w,h)*.5);g.addColorStop(0,'rgba(77,141,255,.10)');g.addColorStop(.5,'rgba(155,108,255,.035)');g.addColorStop(1,'rgba(4,7,20,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    nodes.forEach((n,i)=>{let bx=n.baseX,by=n.baseY;if(!reduce){bx+=Math.sin(time*n.speed+n.phase)*.012;by+=Math.cos(time*n.speed*.8+n.phase)*.014}if(mouse.active){const dx=bx-mouse.x,dy=by-mouse.y,d=Math.hypot(dx,dy)||1,force=Math.max(0,.18-d)*.15;bx+=dx/d*force;by+=dy/d*force}n.x=bx;n.y=by;});
    ctx.lineWidth=.65;for(let i=0;i<nodes.length;i++){for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],dx=(a.x-b.x)*w,dy=(a.y-b.y)*h,d=Math.hypot(dx,dy);if(d<145){ctx.strokeStyle=`rgba(100,190,255,${(1-d/145)*.18})`;ctx.beginPath();ctx.moveTo(a.x*w,a.y*h);ctx.lineTo(b.x*w,b.y*h);ctx.stroke()}}}
    nodes.forEach((n,i)=>{const x=n.x*w,y=n.y*h;ctx.shadowBlur=i<8?18:10;ctx.shadowColor=n.color;ctx.fillStyle=n.color;ctx.globalAlpha=i<8?.95:.55;ctx.beginPath();ctx.arc(x,y,n.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.shadowBlur=0;if(i<5&&!reduce){ctx.strokeStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(x,y,n.r+6+Math.sin(time*2+n.phase)*2,0,Math.PI*2);ctx.stroke()}});
    // animated packets on selected links
    for(let i=0;i<7;i++){const a=nodes[i],b=nodes[(i*3+9)%nodes.length],p=(time*(.10+i*.006)+i*.13)%1,x=(a.x+(b.x-a.x)*p)*w,y=(a.y+(b.y-a.y)*p)*h;ctx.fillStyle=i%2?'#ff5fcf':'#67ffbd';ctx.shadowBlur=14;ctx.shadowColor=ctx.fillStyle;ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
  }
  resize();addEventListener('resize',resize,{passive:true});requestAnimationFrame(draw);
  // small live readout animation
  const lat=document.querySelector('#fabricLatency'); if(lat&&!reduce)setInterval(()=>lat.textContent=`${14+Math.floor(Math.random()*11)}ms`,2100);
})();
