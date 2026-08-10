const enterBtn=document.querySelector('#enterBtn');const loader=document.querySelector('#loader');const body=document.body;body.classList.add('lock');
enterBtn.addEventListener('click',()=>{loader.classList.add('hidden');body.classList.remove('lock');setTimeout(()=>loader.remove(),1100)});
setTimeout(()=>{if(loader && !loader.classList.contains('hidden')) enterBtn.classList.add('ready')},500);
// V7: never trap recruiters behind the intro; it auto-enters after a short cinematic beat.
setTimeout(()=>{if(loader && !loader.classList.contains('hidden')) enterBtn.click()},2800);
document.querySelector('#year').textContent=new Date().getFullYear();
const nav=document.querySelector('.nav-wrap');window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));
const cursor=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const modal=document.querySelector('#resumeModal');const openResume=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');body.classList.add('lock')};const closeResume=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');body.classList.remove('lock')};document.querySelectorAll('.resume-trigger').forEach(b=>b.addEventListener('click',openResume));document.querySelector('.modal-close').addEventListener('click',closeResume);document.querySelector('.modal-backdrop').addEventListener('click',closeResume);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeResume()});
// Three.js cinematic DevOps topology — lightweight enough for GitHub Pages
if(window.THREE){
 const canvas=document.querySelector('#threeCanvas'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(46,innerWidth/innerHeight,.1,100);camera.position.set(0,.1,9);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);
 const world=new THREE.Group();world.position.set(2.7,0,0);scene.add(world);
 const cyan=0x63e6ff,purple=0x9b87ff,blue=0x4f8cff;
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.88,2),new THREE.MeshPhysicalMaterial({color:cyan,metalness:.45,roughness:.22,wireframe:true,transparent:true,opacity:.8}));world.add(core);
 const coreGlow=new THREE.Mesh(new THREE.SphereGeometry(.48,24,24),new THREE.MeshBasicMaterial({color:purple,transparent:true,opacity:.10}));world.add(coreGlow);
 // orbital rings
 [1.65,2.2,2.75].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012,8,120),new THREE.MeshBasicMaterial({color:i===1?purple:cyan,transparent:true,opacity:.18}));ring.rotation.set(1.15+i*.25,.25+i*.45,i*.55);ring.userData.speed=(i%2?-.09:.07)*(i+1);world.add(ring)});
 // cloud / platform nodes + server racks
 const nodes=[],pos=[[-2.3,.85,.25],[2.15,1.0,-.3],[2.3,-1.1,.2],[-2.15,-1.2,-.2],[0,2.15,.15],[.15,-2.15,.3]];
 pos.forEach((p,i)=>{const g=new THREE.Group();g.position.set(...p);const cube=new THREE.Mesh(new THREE.BoxGeometry(.42,.42,.42),new THREE.MeshPhysicalMaterial({color:i%2?purple:cyan,metalness:.6,roughness:.25,transparent:true,opacity:.72,wireframe:i>2}));g.add(cube);const halo=new THREE.Mesh(new THREE.TorusGeometry(.37,.012,8,48),new THREE.MeshBasicMaterial({color:i%2?purple:cyan,transparent:true,opacity:.35}));halo.rotation.x=Math.PI/2;g.add(halo);world.add(g);nodes.push(g);const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),g.position.clone()]),new THREE.LineBasicMaterial({color:blue,transparent:true,opacity:.24}));world.add(line)});
 // mini server rack under the core
 const rack=new THREE.Group();rack.position.set(.1,-1.03,.15);for(let i=0;i<4;i++){const u=new THREE.Mesh(new THREE.BoxGeometry(.95,.14,.48),new THREE.MeshPhysicalMaterial({color:0x13213c,metalness:.7,roughness:.3,transparent:true,opacity:.9}));u.position.y=-i*.18;rack.add(u);for(let j=0;j<3;j++){const led=new THREE.Mesh(new THREE.SphereGeometry(.018,8,8),new THREE.MeshBasicMaterial({color:j===0?cyan:purple}));led.position.set(-.34+j*.11,-i*.18,.25);rack.add(led)}}world.add(rack);
 // travelling deployment packets
 const packets=[];nodes.forEach((n,i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.045,10,10),new THREE.MeshBasicMaterial({color:i%2?purple:cyan}));world.add(m);packets.push({m,to:n.position.clone(),phase:i/6})});
 // star field
 const starGeo=new THREE.BufferGeometry(),pts=[];for(let i=0;i<180;i++)pts.push((Math.random()-.5)*19,(Math.random()-.5)*12,(Math.random()-.5)*12);starGeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({size:.018,color:0x95bfff,transparent:true,opacity:.4})));
 let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});const clock=new THREE.Clock();
 function animate(){requestAnimationFrame(animate);if(document.hidden)return;const t=clock.getElapsedTime();core.rotation.x=t*.18;core.rotation.y=t*.28;coreGlow.scale.setScalar(1.05+Math.sin(t*2)*.09);world.children.forEach(o=>{if(o.geometry&&o.geometry.type==='TorusGeometry'&&o.userData.speed)o.rotation.z+=o.userData.speed*.01});nodes.forEach((n,i)=>{n.rotation.x=t*.18*(i%2?1:-1);n.rotation.y=t*.28;n.position.y=pos[i][1]+Math.sin(t*1.25+i)*.08});packets.forEach((p,i)=>{const q=(t*.19+p.phase)%1;p.m.position.copy(p.to).multiplyScalar(q);p.m.scale.setScalar(.8+Math.sin(q*Math.PI)*1.8)});rack.rotation.y=Math.sin(t*.55)*.12;world.rotation.y+=(mx*.24-world.rotation.y)*.025;world.rotation.x+=(-my*.13-world.rotation.x)*.025;renderer.render(scene,camera)}animate();
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);world.position.x=innerWidth<900?1.25:2.7;world.scale.setScalar(innerWidth<650?.78:1)}addEventListener('resize',resize);resize();
}

// V2 motion polish: scroll progress, card spotlight/tilt, typing loop
const progressBar=document.querySelector('.page-progress span');
window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;progressBar.style.transform=`scaleX(${h>0?scrollY/h:0})`},{passive:true});

const motionCards=document.querySelectorAll('.skill-card,.project-card,.timeline-card');
motionCards.forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(innerWidth<900)return;
    const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    card.style.setProperty('--mx',`${x}px`);card.style.setProperty('--my',`${y}px`);
    const rx=((y/r.height)-.5)*-5,ry=((x/r.width)-.5)*7;
    card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});

const typeTarget=document.querySelector('#typeText');
if(typeTarget){
 const words=['Terraform','Kubernetes','CI/CD','Automation'];let wi=0,ci=0,deleting=false;
 const tick=()=>{const word=words[wi];typeTarget.textContent=word.slice(0,ci);if(!deleting&&ci<word.length){ci++;setTimeout(tick,90)}else if(!deleting){deleting=true;setTimeout(tick,1200)}else if(ci>0){ci--;setTimeout(tick,45)}else{deleting=false;wi=(wi+1)%words.length;setTimeout(tick,250)}};tick();
}

// V3: active navigation, counters, magnetic buttons and cinematic parallax
const sections=[...document.querySelectorAll('main section[id]')];
const navAnchors=[...document.querySelectorAll('.nav-links a')];
const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navAnchors.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}})},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>navObserver.observe(s));

const countEls=document.querySelectorAll('[data-count]');
const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||entry.target.dataset.done)return;entry.target.dataset.done='1';const target=parseFloat(entry.target.dataset.count);let start=0;const t0=performance.now();function frame(now){const p=Math.min((now-t0)/1100,1),v=target*(1-Math.pow(1-p,3));entry.target.textContent=(Number.isInteger(target)?Math.round(v):v.toFixed(1))+(target===3.5?'+':'');if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}),{threshold:.6});countEls.forEach(el=>countObserver.observe(el));

document.querySelectorAll('.btn').forEach(btn=>{btn.addEventListener('pointermove',e=>{if(innerWidth<900)return;const r=btn.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.12;btn.style.transform=`translate(${x}px,${y}px) translateY(-2px)`});btn.addEventListener('pointerleave',()=>btn.style.transform='')});

window.addEventListener('scroll',()=>{const y=scrollY;document.querySelectorAll('.aurora').forEach((el,i)=>el.style.transform=`translate3d(0,${y*(i?-.035:.025)}px,0)`);},{passive:true});

// V4: mobile nav, scroll-linked depth, spotlight cards, reduced-motion friendly details
const mobileMenu=document.querySelector('.mobile-menu');
const navLinksWrap=document.querySelector('.nav-links');
if(mobileMenu&&navLinksWrap){mobileMenu.addEventListener('click',()=>{const open=navLinksWrap.classList.toggle('open');mobileMenu.classList.toggle('open',open);mobileMenu.setAttribute('aria-expanded',String(open))});navLinksWrap.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinksWrap.classList.remove('open');mobileMenu.classList.remove('open');mobileMenu.setAttribute('aria-expanded','false')}));}

document.querySelectorAll('.impact-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)}));

const depthTargets=[...document.querySelectorAll('.cloud-command,.hero-orbit-ui')];
window.addEventListener('pointermove',e=>{if(innerWidth<900||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);depthTargets.forEach((el,i)=>{const d=i?8:14;el.style.translate=`${x*d}px ${y*d}px`})});

// V5: GitHub Pages performance polish + lazy resume + visibility-aware 3D
const resumeFrame=document.querySelector('#resumeModal iframe[data-src]');
document.querySelectorAll('.resume-trigger').forEach(btn=>btn.addEventListener('click',()=>{if(resumeFrame&&!resumeFrame.src)resumeFrame.src=resumeFrame.dataset.src;},{once:true}));

// Pause purely decorative animated surfaces when the tab is hidden.
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('tab-hidden',document.hidden));

// V14: multi-region interactive 3D cloud platform. Procedural, zero-build, GitHub Pages friendly.
(()=>{
 const canvas=document.querySelector('#cloudLabCanvas'); if(!canvas) return;
 const wrap=canvas.closest('.lab-stage-wrap');
 if(!window.THREE){wrap?.classList.add('webgl-fallback');return;}
 let renderer; try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch(e){wrap?.classList.add('webgl-fallback');return;}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,100); camera.position.set(8.8,6.2,11.8);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); renderer.outputEncoding=THREE.sRGBEncoding;
 const root=new THREE.Group();scene.add(root);
 const C={cyan:0x48f7ff,purple:0x9b87ff,pink:0xff7ae6,blue:0x4f8cff,green:0x62f5a6,amber:0xffcf70,dark:0x07101f,steel:0x142039};
 scene.add(new THREE.HemisphereLight(0xa2c9ff,0x02040b,.82));
 const key=new THREE.PointLight(C.cyan,1.6,30);key.position.set(3,8,6);scene.add(key);
 const rim=new THREE.PointLight(C.purple,1.25,28);rim.position.set(-7,4,-5);scene.add(rim);
 const warm=new THREE.PointLight(C.pink,.55,22);warm.position.set(5,2,-6);scene.add(warm);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(8.3,80),new THREE.MeshStandardMaterial({color:0x050a15,metalness:.76,roughness:.68,transparent:true,opacity:.76}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.3;root.add(floor);
 const grid=new THREE.GridHelper(16,24,C.blue,0x182640);grid.position.y=-2.26;grid.material.transparent=true;grid.material.opacity=.22;root.add(grid);

 // central orchestration core
 const core=new THREE.Group();root.add(core);
 const coreMesh=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05,1),new THREE.MeshPhysicalMaterial({color:C.cyan,metalness:.42,roughness:.12,transparent:true,opacity:.88,wireframe:true,emissive:0x0a3445,emissiveIntensity:.55}));core.add(coreMesh);
 const coreInner=new THREE.Mesh(new THREE.SphereGeometry(.56,28,28),new THREE.MeshBasicMaterial({color:C.purple,transparent:true,opacity:.18}));core.add(coreInner);
 [1.28,1.62,2.02].forEach((r,i)=>{const tor=new THREE.Mesh(new THREE.TorusGeometry(r,.022,8,96),new THREE.MeshBasicMaterial({color:[C.cyan,C.purple,C.pink][i],transparent:true,opacity:.36}));tor.rotation.set(Math.PI/(2.5+i*.22),i*.75,.45+i*.35);core.add(tor)});

 const regions=[
  {key:'india',code:'IN-CENTRAL-1',label:'INDIA',p:[0,.25,0],color:C.cyan,lat:'18ms'},
  {key:'us',code:'US-EAST-1',label:'US EAST',p:[-5.3,.1,-1.2],color:C.purple,lat:'84ms'},
  {key:'europe',code:'EU-WEST-1',label:'EUROPE',p:[-2.8,1.75,-4.3],color:C.blue,lat:'61ms'},
  {key:'asia',code:'AP-SOUTH-1',label:'APAC',p:[5.0,.2,1.0],color:C.green,lat:'48ms'},
  {key:'global',code:'GLOBAL-MESH',label:'GLOBAL',p:[2.7,1.9,-4.0],color:C.pink,lat:'36ms'}
 ];
 const regionGroups={},regionLinks=[],regionPackets=[];
 function rack(parent,x,z,accent,scale=.82){
   const g=new THREE.Group();g.position.set(x,-.9,z);g.scale.setScalar(scale);
   for(let y=0;y<5;y++){const u=new THREE.Mesh(new THREE.BoxGeometry(1.1,.18,.7),new THREE.MeshStandardMaterial({color:C.steel,metalness:.8,roughness:.26,emissive:0x030814,emissiveIntensity:.35}));u.position.y=y*.23;g.add(u);
     for(let j=0;j<3;j++){const led=new THREE.Mesh(new THREE.SphereGeometry(.026,7,7),new THREE.MeshBasicMaterial({color:j===0?accent:C.green}));led.position.set(-.38+j*.15,y*.23,.37);g.add(led)}}
   const shell=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.28,1.45,.86)),new THREE.LineBasicMaterial({color:accent,transparent:true,opacity:.35}));shell.position.y=.45;g.add(shell);parent.add(g);return g;
 }
 regions.forEach((r,idx)=>{
   const g=new THREE.Group();g.position.set(...r.p);g.userData={key:r.key,base:r.p.slice(),color:r.color};
   const platform=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.8,.18,12),new THREE.MeshStandardMaterial({color:0x0c1730,metalness:.78,roughness:.3,emissive:r.color,emissiveIntensity:.035}));platform.position.y=-1.42;g.add(platform);
   const ring=new THREE.Mesh(new THREE.TorusGeometry(1.62,.025,8,84),new THREE.MeshBasicMaterial({color:r.color,transparent:true,opacity:.42}));ring.rotation.x=Math.PI/2;ring.position.y=-1.3;g.add(ring);
   rack(g,-.65,.28,r.color,.58); rack(g,.68,.15,r.color,.58);
   const beacon=new THREE.Mesh(idx===0?new THREE.DodecahedronGeometry(.44,1):new THREE.OctahedronGeometry(.4,0),new THREE.MeshPhysicalMaterial({color:r.color,metalness:.45,roughness:.15,transparent:true,opacity:.92,emissive:r.color,emissiveIntensity:.22}));beacon.position.y=.65;g.add(beacon);g.userData.beacon=beacon;
   const halo=new THREE.Mesh(new THREE.TorusGeometry(.72,.018,8,70),new THREE.MeshBasicMaterial({color:r.color,transparent:true,opacity:.4}));halo.rotation.x=Math.PI/2;halo.position.y=.65;g.add(halo);g.userData.halo=halo;
   // pods
   for(let k=0;k<6;k++){const a=k/6*Math.PI*2;const pod=new THREE.Mesh(new THREE.BoxGeometry(.13,.13,.13),new THREE.MeshStandardMaterial({color:k%3?C.cyan:C.green,emissive:k%3?0x0b2a38:0x143b2a,emissiveIntensity:.6}));pod.userData={a,idx:k};g.add(pod)}
   root.add(g);regionGroups[r.key]=g;
   if(idx>0){const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...regions[0].p),new THREE.Vector3(...r.p)]),new THREE.LineDashedMaterial({color:r.color,transparent:true,opacity:.34,dashSize:.18,gapSize:.11}));line.computeLineDistances();root.add(line);regionLinks.push(line)}
 });
 // global mesh arcs between edge regions
 for(let i=1;i<regions.length;i++)for(let j=i+1;j<regions.length;j++){if((i+j)%2===0){const a=new THREE.Vector3(...regions[i].p),b=new THREE.Vector3(...regions[j].p),mid=a.clone().lerp(b,.5);mid.y+=1.5;const curve=new THREE.QuadraticBezierCurve3(a,mid,b);const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(28)),new THREE.LineBasicMaterial({color:C.blue,transparent:true,opacity:.12}));root.add(ln)}}
 // inter-region data packets
 for(let r=1;r<regions.length;r++)for(let k=0;k<4;k++){const m=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),new THREE.MeshBasicMaterial({color:regions[r].color}));root.add(m);regionPackets.push({mesh:m,to:new THREE.Vector3(...regions[r].p),phase:(r*4+k)/18})}
 // backdrop particles
 const pos=[];for(let i=0;i<420;i++)pos.push((Math.random()-.5)*22,(Math.random()-.5)*11,(Math.random()-.5)*22);const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));scene.add(new THREE.Points(pg,new THREE.PointsMaterial({size:.025,color:0xb2d0ff,transparent:true,opacity:.34})));

 let activeRegion='india',labMode='architecture',autoRotate=true,drag=false,lastX=0,lastY=0,targetRX=.08,targetRY=-.18,zoom=1;
 let cameraGoal=new THREE.Vector3(8.8,6.2,11.8),lookGoal=new THREE.Vector3(0,0,0);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const regionMeta={india:{cam:[6.2,4.4,8.2],look:[0,0,0]},us:{cam:[-10,4.1,4.5],look:regions[1].p},europe:{cam:[-7.7,5.7,-7.2],look:regions[2].p},asia:{cam:[10.2,4.3,4.5],look:regions[3].p},global:{cam:[7.7,6.1,-8.0],look:regions[4].p}};
 function selectRegion(key,focus=true){
   activeRegion=key; const r=regions.find(x=>x.key===key)||regions[0],meta=regionMeta[key]||regionMeta.india;
   document.querySelectorAll('.region-pill').forEach(b=>b.classList.toggle('active',b.dataset.region===key));
   const el=document.querySelector('#labRegion');if(el)el.textContent=r.code;
   const lat=document.querySelector('#labLatency');if(lat)lat.textContent=r.lat;
   Object.values(regionGroups).forEach(g=>{const on=g.userData.key===key;g.scale.setScalar(on?1.18:.9);g.userData.beacon.material.emissiveIntensity=on?.8:.2;g.userData.halo.material.opacity=on?.72:.27});
   if(focus){cameraGoal.set(...meta.cam);lookGoal.set(...meta.look)}
 }
 document.querySelectorAll('.region-pill').forEach(b=>b.addEventListener('click',()=>selectRegion(b.dataset.region,true)));
 document.querySelector('#labFocus')?.addEventListener('click',()=>selectRegion(activeRegion,true));
 window.addEventListener('lab-mode-change',e=>{labMode=e.detail.mode;if(labMode==='pipeline'){zoom=.92}else if(labMode==='security'){zoom=1.02}else zoom=1});
 function fit(){const r=wrap.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}fit();new ResizeObserver(fit).observe(wrap);
 canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});
 canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
 canvas.addEventListener('pointermove',e=>{if(!drag)return;targetRY+=(e.clientX-lastX)*.006;targetRX+=(e.clientY-lastY)*.0045;targetRX=Math.max(-.45,Math.min(.45,targetRX));lastX=e.clientX;lastY=e.clientY});
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.76,Math.min(1.28,zoom+Math.sign(e.deltaY)*.045))},{passive:false});
 document.querySelector('#labRotate')?.addEventListener('click',e=>{autoRotate=!autoRotate;e.currentTarget.textContent=`Auto rotate: ${autoRotate?'ON':'OFF'}`});
 document.querySelector('#labReset')?.addEventListener('click',()=>{targetRX=.08;targetRY=-.18;zoom=1;cameraGoal.set(8.8,6.2,11.8);lookGoal.set(0,0,0);selectRegion('india',false)});
 let visible=false;new IntersectionObserver(es=>visible=es.some(e=>e.isIntersecting),{rootMargin:'220px'}).observe(wrap);const clock=new THREE.Clock();
 const camLook=new THREE.Vector3();
 function loop(){requestAnimationFrame(loop);if(!visible||document.hidden)return;const t=clock.getElapsedTime();if(autoRotate&&!drag&&!reduced)targetRY+=.0007;
   root.rotation.x+=(targetRX-root.rotation.x)*.035;root.rotation.y+=(targetRY-root.rotation.y)*.035;
   camera.position.x+=(cameraGoal.x*zoom-camera.position.x)*.035;camera.position.y+=(cameraGoal.y*zoom-camera.position.y)*.035;camera.position.z+=(cameraGoal.z*zoom-camera.position.z)*.035;camLook.lerp(lookGoal,.05);camera.lookAt(camLook);
   coreMesh.rotation.x=t*(labMode==='pipeline'?.5:.28);coreMesh.rotation.y=t*(labMode==='security'?.65:.42);coreInner.scale.setScalar(1+Math.sin(t*2.4)*.12);
   regions.forEach((r,idx)=>{const g=regionGroups[r.key];g.userData.beacon.rotation.x=t*.35*(idx%2?1:-1);g.userData.beacon.rotation.y=t*.55;g.userData.halo.rotation.z=t*.18*(idx%2?1:-1);const children=g.children.slice(4);children.forEach((p,k)=>{if(!p.userData||p.userData.a===undefined)return;const a=p.userData.a+t*(labMode==='pipeline'?.7:.38);p.position.set(Math.cos(a)*1.05,-.2+Math.sin(t*1.4+k)*.12,Math.sin(a)*1.05)})});
   regionPackets.forEach(p=>{const speed=labMode==='pipeline'?.34:(labMode==='security'?.14:.2),q=(t*speed+p.phase)%1;p.mesh.position.copy(p.to).multiplyScalar(q);p.mesh.position.y+=Math.sin(q*Math.PI)*1.15;p.mesh.scale.setScalar(.6+Math.sin(q*Math.PI)*1.8)});
   renderer.render(scene,camera)
 }loop();selectRegion('india',false);
})();


// V8: scene-mode cockpit + premium card spotlight. No build step, no extra assets.
(()=>{
  const modeButtons=[...document.querySelectorAll('.lab-mode')];
  const label=document.querySelector('#labModeLabel'), reps=document.querySelector('#labReplicas'), latency=document.querySelector('#labLatency');
  const presets={architecture:{label:'ARCH',replicas:'24',latency:'42ms'},pipeline:{label:'SHIP',replicas:'18',latency:'31ms'},security:{label:'ZERO-TRUST',replicas:'24',latency:'47ms'}};
  modeButtons.forEach(btn=>btn.addEventListener('click',()=>{
    modeButtons.forEach(b=>b.classList.toggle('active',b===btn));
    const mode=btn.dataset.labMode; document.documentElement.dataset.labMode=mode;
    const p=presets[mode]||presets.architecture;
    if(label) label.textContent=p.label; if(reps) reps.textContent=p.replicas; if(latency) latency.textContent=p.latency;
    window.dispatchEvent(new CustomEvent('lab-mode-change',{detail:{mode}}));
  }));
  document.querySelectorAll('.project-card,.skill-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)}));
})();

// V9 — scroll-reactive mission control + tiny runtime telemetry. Static-host friendly.
(()=>{
  const section=document.querySelector('#mission-control'), globe=document.querySelector('.holo-globe');
  if(section&&globe&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const update=()=>{const r=section.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(innerHeight/2-(r.top+r.height/2))/innerHeight));globe.style.setProperty('filter',`drop-shadow(0 ${18+p*12}px 45px rgba(50,120,230,.16))`);globe.style.rotate=`${p*3}deg`;};
    addEventListener('scroll',update,{passive:true});update();
  }
  const title=document.title;
  document.addEventListener('visibilitychange',()=>{document.title=document.hidden?'Pipeline paused · Krishna Sharma':title});
})();

// V10 — interactive 3D cloud digital twin. Zero-build and GitHub Pages friendly.
(()=>{
  const canvas=document.querySelector('#twinCanvas'); if(!canvas) return;
  const wrap=canvas.closest('.twin-stage-wrap');
  if(!window.THREE){wrap?.classList.add('webgl-fallback');return;}
  let renderer; try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch(e){wrap?.classList.add('webgl-fallback');return;}
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,80);camera.position.set(8.6,6.4,10.8);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.outputEncoding=THREE.sRGBEncoding;
  const root=new THREE.Group(); scene.add(root);
  const C={cyan:0x63e6ff,purple:0x9b87ff,green:0x62f5a6,amber:0xffcf70,blue:0x4f8cff,dark:0x07101f,steel:0x122039};
  scene.add(new THREE.HemisphereLight(0x91c7ff,0x02040a,.68));
  const key=new THREE.PointLight(C.cyan,1.25,28);key.position.set(4,8,5);scene.add(key);
  const rim=new THREE.PointLight(C.purple,.9,25);rim.position.set(-7,4,-4);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(7.5,72),new THREE.MeshStandardMaterial({color:0x050914,metalness:.78,roughness:.68,transparent:true,opacity:.78}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.2;root.add(floor);
  const grid=new THREE.GridHelper(14,22,C.blue,0x17243e);grid.position.y=-2.16;grid.material.transparent=true;grid.material.opacity=.2;root.add(grid);
  // platform towers
  const towers=[]; function tower(x,z,h=1.9,accent=C.cyan){const g=new THREE.Group();g.position.set(x,-1.25,z);for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(1.18,.18,.8),new THREE.MeshStandardMaterial({color:C.steel,metalness:.78,roughness:.28}));m.position.y=i*.24;g.add(m);for(let j=0;j<3;j++){const led=new THREE.Mesh(new THREE.SphereGeometry(.026,7,7),new THREE.MeshBasicMaterial({color:j?C.green:accent}));led.position.set(-.42+j*.16,i*.24,.42);g.add(led)}}const shell=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4,h,1)),new THREE.LineBasicMaterial({color:accent,transparent:true,opacity:.3}));shell.position.y=.7;g.add(shell);root.add(g);towers.push(g);return g}
  tower(-3.4,-2.2,1.9,C.cyan);tower(3.4,-2.2,1.9,C.purple);tower(-3.4,2.2,1.9,C.purple);tower(3.4,2.2,1.9,C.cyan);
  // central orchestration core
  const core=new THREE.Group();root.add(core);const coreMesh=new THREE.Mesh(new THREE.IcosahedronGeometry(.95,1),new THREE.MeshPhysicalMaterial({color:C.cyan,metalness:.42,roughness:.2,transparent:true,opacity:.78,wireframe:true}));core.add(coreMesh);const coreInner=new THREE.Mesh(new THREE.SphereGeometry(.5,24,24),new THREE.MeshBasicMaterial({color:C.purple,transparent:true,opacity:.14}));core.add(coreInner);
  [1.25,1.55,1.9].forEach((r,i)=>{const tor=new THREE.Mesh(new THREE.TorusGeometry(r,.015,8,90),new THREE.MeshBasicMaterial({color:i===1?C.purple:C.cyan,transparent:true,opacity:.25}));tor.rotation.set(Math.PI/(2.4+i*.3),i*.8,.2+i*.6);core.add(tor)});
  // service layers around core
  const nodePositions=[[-5,.3,0],[5,.3,0],[0,.55,-4.8],[0,.55,4.8],[-2.8,2.4,-2.8],[2.8,2.4,2.8]];
  const nodes=[];nodePositions.forEach((p,i)=>{const g=new THREE.Group();g.position.set(...p);const geo=i<2?new THREE.OctahedronGeometry(.42,0):i<4?new THREE.DodecahedronGeometry(.36,0):new THREE.BoxGeometry(.48,.48,.48);const mat=new THREE.MeshPhysicalMaterial({color:i%3===0?C.cyan:(i%3===1?C.purple:C.green),metalness:.45,roughness:.18,transparent:true,opacity:.82,wireframe:i>=4});const m=new THREE.Mesh(geo,mat);g.add(m);const h=new THREE.Mesh(new THREE.TorusGeometry(.58,.012,8,50),new THREE.MeshBasicMaterial({color:mat.color,transparent:true,opacity:.3}));h.rotation.x=Math.PI/2;g.add(h);root.add(g);nodes.push(g);const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(...p)]),new THREE.LineDashedMaterial({color:C.blue,transparent:true,opacity:.28,dashSize:.17,gapSize:.11}));ln.computeLineDistances();root.add(ln)});
  // security perimeter
  const perimeter=[];for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const p=new THREE.Mesh(new THREE.BoxGeometry(.10,.38,.10),new THREE.MeshBasicMaterial({color:C.amber,transparent:true,opacity:.35}));p.position.set(Math.cos(a)*5.9,-1.92,Math.sin(a)*5.9);p.rotation.y=-a;root.add(p);perimeter.push(p)}
  // traffic particles
  const packets=[];nodes.forEach((n,i)=>{for(let k=0;k<3;k++){const p=new THREE.Mesh(new THREE.SphereGeometry(.05,8,8),new THREE.MeshBasicMaterial({color:i%2?C.purple:C.cyan}));root.add(p);packets.push({m:p,to:n.position.clone(),phase:(i*3+k)/18})}});
  // k8s workload ring
  const pods=[];for(let i=0;i<14;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.17,.17,.17),new THREE.MeshStandardMaterial({color:i%4===0?C.green:C.cyan,metalness:.25,roughness:.35,emissive:i%4===0?0x143b2a:0x0b2a38,emissiveIntensity:.5}));p.userData.a=i/14*Math.PI*2;root.add(p);pods.push(p)}
  // subtle stars
  const starPos=[];for(let i=0;i<220;i++)starPos.push((Math.random()-.5)*18,(Math.random()-.5)*9,(Math.random()-.5)*18);const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({size:.022,color:0xa8c4ef,transparent:true,opacity:.28})));
  let mode='platform',drag=false,lastX=0,lastY=0,targetRX=.12,targetRY=-.28,zoom=1,visible=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const presets={platform:{ry:-.28,rx:.12,zoom:1,traffic:'12.8k',state:'HEALTHY'},network:{ry:.46,rx:.04,zoom:.92,traffic:'18.4k',state:'ROUTING'},security:{ry:-.78,rx:.3,zoom:1.05,traffic:'9.7k',state:'ENFORCED'}};
  function setMode(m){mode=m;const p=presets[m]||presets.platform;targetRY=p.ry;targetRX=p.rx;zoom=p.zoom;document.querySelector('#twinTraffic').textContent=p.traffic;document.querySelector('#twinState').textContent=p.state;document.querySelectorAll('.twin-mode').forEach(b=>b.classList.toggle('active',b.dataset.twin===m));perimeter.forEach(x=>x.material.opacity=m==='security'?.8:.22);nodes.forEach((n,i)=>n.children[0].material.opacity=m==='network'?.98:.78)}
  document.querySelectorAll('.twin-mode').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.twin)));
  document.querySelector('#twinReset')?.addEventListener('click',()=>setMode('platform'));
  function fit(){const r=wrap.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}fit();new ResizeObserver(fit).observe(wrap);
  canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);canvas.addEventListener('pointermove',e=>{if(!drag)return;targetRY+=(e.clientX-lastX)*.008;targetRX+=(e.clientY-lastY)*.006;targetRX=Math.max(-.62,Math.min(.62,targetRX));lastX=e.clientX;lastY=e.clientY});canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.78,Math.min(1.25,zoom+Math.sign(e.deltaY)*.05))},{passive:false});
  new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting)},{rootMargin:'220px'}).observe(wrap);const clock=new THREE.Clock();
  function loop(){requestAnimationFrame(loop);if(!visible||document.hidden)return;const t=clock.getElapsedTime();if(!drag&&!reduced)targetRY+=mode==='network'?.0014:.0008;root.rotation.x+=(targetRX-root.rotation.x)*.045;root.rotation.y+=(targetRY-root.rotation.y)*.045;camera.position.z+=(10.8*zoom-camera.position.z)*.05;coreMesh.rotation.x=t*(mode==='security'?.5:.28);coreMesh.rotation.y=t*(mode==='network'?.72:.42);coreInner.scale.setScalar(1+Math.sin(t*2.3)*.12);towers.forEach((r,i)=>r.position.y=-1.25+Math.sin(t*.72+i)*.035);nodes.forEach((n,i)=>{n.rotation.y=t*.34*(i%2?1:-1);n.rotation.x=t*.17;n.position.y=nodePositions[i][1]+Math.sin(t*1.25+i)*.1});packets.forEach((p,i)=>{const speed=mode==='network'?.32:(mode==='security'?.12:.2),q=(t*speed+p.phase)%1;p.m.position.copy(p.to).multiplyScalar(q);p.m.scale.setScalar(.65+Math.sin(q*Math.PI)*1.3)});pods.forEach((p,i)=>{const a=p.userData.a+t*(mode==='network'?.52:.32);p.position.set(Math.cos(a)*1.86,Math.sin(t*1.4+i)*.14-.16,Math.sin(a)*1.86);p.rotation.x=t;p.rotation.y=-t*.65});renderer.render(scene,camera)}loop();
})();
