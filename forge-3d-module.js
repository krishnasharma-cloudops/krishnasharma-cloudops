// V13 Synapse Forge — procedural Three.js model; static-hosting / GitHub Pages friendly.
(()=>{
  const canvas=document.querySelector('#forgeCanvas'); if(!canvas) return;
  const stage=canvas.closest('.forge-stage');
  if(!window.THREE){stage?.classList.add('webgl-fallback');return;}
  let renderer; try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch(e){stage?.classList.add('webgl-fallback');return;}
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(44,1,.1,120); camera.position.set(0,1.6,10.4);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.65)); renderer.outputEncoding=THREE.sRGBEncoding;
  const root=new THREE.Group(); scene.add(root);
  const C={cyan:0x48f7ff,violet:0x7c63ff,pink:0xff7ae6,green:0x7cffc4,amber:0xffbb66,blue:0x4b91ff,dark:0x071023};
  scene.add(new THREE.AmbientLight(0x8db7ff,.36));
  const key=new THREE.PointLight(C.cyan,2.0,30); key.position.set(4,7,5); scene.add(key);
  const rim=new THREE.PointLight(C.pink,1.25,26); rim.position.set(-6,2,-4); scene.add(rim);

  // Procedural reactor tower: a unique "technical" 3D object rather than a brand logo.
  const reactor=new THREE.Group(); root.add(reactor);
  const baseMat=new THREE.MeshStandardMaterial({color:0x10244c,metalness:.78,roughness:.25,emissive:0x041326,emissiveIntensity:.5});
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.15,.45,8),baseMat); base.position.y=-1.75; reactor.add(base);
  for(let i=0;i<5;i++){
    const deck=new THREE.Mesh(new THREE.CylinderGeometry(1.22+i*.06,1.35+i*.06,.28,8),new THREE.MeshStandardMaterial({color:i%2?0x15265b:0x0e3153,metalness:.68,roughness:.22,emissive:i%2?0x120b34:0x031d26,emissiveIntensity:.7}));
    deck.position.y=-1.2+i*.54; deck.rotation.y=i*.2; reactor.add(deck);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.48+i*.035,.035,8,80),new THREE.MeshBasicMaterial({color:i%2?C.violet:C.cyan,transparent:true,opacity:.42})); ring.position.y=deck.position.y; ring.rotation.x=Math.PI/2; reactor.add(ring);
  }
  const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.82,1),new THREE.MeshPhysicalMaterial({color:C.cyan,emissive:0x0a4c66,emissiveIntensity:1.2,metalness:.35,roughness:.08,transparent:true,opacity:.92})); crystal.position.y=1.25; reactor.add(crystal);
  const crystalWire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,1),new THREE.MeshBasicMaterial({color:C.pink,wireframe:true,transparent:true,opacity:.34})); crystalWire.position.copy(crystal.position); reactor.add(crystalWire);
  [1.7,2.3,3.1].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.018,7,120),new THREE.MeshBasicMaterial({color:[C.cyan,C.violet,C.pink][i],transparent:true,opacity:.23}));ring.rotation.set(1.12+i*.25,.38+i*.5,.2+i*.35);ring.position.y=.3;root.add(ring)});

  const modules=[
    {name:'LLM',color:C.cyan,geo:()=>new THREE.IcosahedronGeometry(.42,1)},
    {name:'MCP',color:C.violet,geo:()=>new THREE.BoxGeometry(.68,.68,.68)},
    {name:'AG',color:C.pink,geo:()=>new THREE.OctahedronGeometry(.48)},
    {name:'SEC',color:C.green,geo:()=>new THREE.DodecahedronGeometry(.43)},
    {name:'TF',color:C.blue,geo:()=>new THREE.TetrahedronGeometry(.48)},
    {name:'K8',color:C.amber,geo:()=>new THREE.CylinderGeometry(.42,.42,.42,6)}
  ];
  const sats=[];
  modules.forEach((m,i)=>{const g=new THREE.Group();const mesh=new THREE.Mesh(m.geo(),new THREE.MeshStandardMaterial({color:m.color,metalness:.62,roughness:.18,emissive:m.color,emissiveIntensity:.15}));g.add(mesh);const halo=new THREE.Mesh(new THREE.TorusGeometry(.68,.016,6,64),new THREE.MeshBasicMaterial({color:m.color,transparent:true,opacity:.36}));halo.rotation.x=Math.PI/2;g.add(halo);g.userData={a:i/modules.length*Math.PI*2,r:3.35+(i%2)*.55,key:m.name.toLowerCase(),base:m.color};root.add(g);sats.push(g)});
  const links=sats.map(()=>{const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineDashedMaterial({color:C.blue,transparent:true,opacity:.22,dashSize:.15,gapSize:.09}));line.computeLineDistances();root.add(line);return line});
  const shield=new THREE.Mesh(new THREE.SphereGeometry(4.65,28,18),new THREE.MeshBasicMaterial({color:C.green,wireframe:true,transparent:true,opacity:.045,side:THREE.DoubleSide}));root.add(shield);
  const packets=[];for(let i=0;i<36;i++){const q=new THREE.Mesh(new THREE.SphereGeometry(.035,6,6),new THREE.MeshBasicMaterial({color:i%7===0?C.pink:(i%5===0?C.green:C.cyan)}));q.userData={target:i%sats.length,phase:i/36};root.add(q);packets.push(q)}
  const pts=[];for(let i=0;i<320;i++)pts.push((Math.random()-.5)*20,(Math.random()-.5)*12,(Math.random()-.5)*20);const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(pg,new THREE.PointsMaterial({size:.025,color:0xa6caff,transparent:true,opacity:.28})));

  let mode='ai',drag=false,lastX=0,lastY=0,targetRX=.05,targetRY=-.22,rx=.05,ry=-.22,zoom=1,visible=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const modes={
    ai:{label:'LLM CORE',log:'llm.core → infrastructure context synchronized',speed:.24,shield:.055,key:'llm'},
    mcp:{label:'MCP TOOL BRIDGE',log:'mcp.bridge → tools + context channels connected',speed:.31,shield:.075,key:'mcp'},
    ag:{label:'ANTIGRAVITY',log:'antigravity.ai → assisted DevOps workflow active',speed:.37,shield:.065,key:'ag'},
    sec:{label:'DEVSECOPS SHIELD',log:'security.mesh → SAST + secrets + vulnerability scan',speed:.18,shield:.22,key:'sec'}
  };
  function setMode(m){mode=m;const p=modes[m]||modes.ai;document.querySelector('#forgeLayer').textContent=p.label;document.querySelector('#forgeLog').textContent=p.log;shield.material.opacity=p.shield;document.querySelectorAll('.forge-tool').forEach(b=>b.classList.toggle('active',b.dataset.forge===m));sats.forEach(s=>{s.children[0].material.emissiveIntensity=s.userData.key===p.key?.7:.12;s.scale.setScalar(s.userData.key===p.key?1.23:1)});document.querySelector('#forgeState').innerHTML='<i></i> '+(m==='sec'?'SCANNING':'SYNCHRONIZED')}
  document.querySelectorAll('.forge-tool').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.forge)));
  function fit(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix()}fit();new ResizeObserver(fit).observe(stage);
  canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);canvas.addEventListener('pointermove',e=>{if(!drag)return;targetRY+=(e.clientX-lastX)*.008;targetRX+=(e.clientY-lastY)*.006;targetRX=Math.max(-.68,Math.min(.68,targetRX));lastX=e.clientX;lastY=e.clientY});canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.78,Math.min(1.28,zoom+Math.sign(e.deltaY)*.05))},{passive:false});
  new IntersectionObserver(es=>visible=es.some(e=>e.isIntersecting),{rootMargin:'220px'}).observe(stage);const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);if(!visible||document.hidden)return;const t=clock.getElapsedTime(),p=modes[mode];if(!drag&&!reduced)targetRY+=.0008;rx+=(targetRX-rx)*.045;ry+=(targetRY-ry)*.045;root.rotation.set(rx,ry,0);camera.position.z+=(10.4*zoom-camera.position.z)*.05;reactor.rotation.y=t*.16;crystal.rotation.y=-t*.75;crystal.rotation.x=t*.25;crystalWire.rotation.y=t*.42;crystalWire.scale.setScalar(1+Math.sin(t*2.4)*.055);shield.rotation.y=-t*.07;
    sats.forEach((s,i)=>{const a=s.userData.a+t*p.speed*(i%2?1:-1);s.position.set(Math.cos(a)*s.userData.r,Math.sin(t*.72+i)*.72+.15,Math.sin(a)*s.userData.r);s.rotation.x=t*.22+i;s.rotation.y=-t*.35;links[i].geometry.setFromPoints([new THREE.Vector3(0,.4,0),s.position.clone()]);links[i].computeLineDistances()});
    packets.forEach(q=>{const target=sats[q.userData.target].position,phase=(t*(p.speed*.82)+q.userData.phase)%1;q.position.copy(target).multiplyScalar(phase);q.position.y+=.35*(1-phase);q.scale.setScalar(.7+Math.sin(phase*Math.PI)*1.6)});
    if(mode==='sec')shield.material.color.setHex(Math.sin(t*4)>0?C.green:C.pink);else shield.material.color.setHex(C.green);renderer.render(scene,camera)}
  animate();setMode('ai');
})();
