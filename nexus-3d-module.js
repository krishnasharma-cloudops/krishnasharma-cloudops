// V15 Quantum Cloud Nexus — dedicated procedural Three.js 3D model.
(()=>{
 const canvas=document.querySelector('#nexusCanvas'); if(!canvas||!window.THREE)return;
 const stage=canvas.closest('.nexus-stage');
 let renderer; try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch(e){return}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65)); renderer.outputEncoding=THREE.sRGBEncoding;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,3.1,11);
 const root=new THREE.Group();scene.add(root);
 scene.add(new THREE.HemisphereLight(0x8bbcff,0x02040a,.72));
 const p1=new THREE.PointLight(0x48f7ff,1.8,26);p1.position.set(3.5,6,6);scene.add(p1);
 const p2=new THREE.PointLight(0xa479ff,1.15,24);p2.position.set(-5,3,-4);scene.add(p2);
 const p3=new THREE.PointLight(0xff74d8,.55,18);p3.position.set(4,-1,-3);scene.add(p3);
 const palette={cyan:0x48f7ff,purple:0x9b87ff,pink:0xff7ae6,green:0x62f5a6,blue:0x4f8cff};
 const model=new THREE.Group();root.add(model);
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.12,2),new THREE.MeshPhysicalMaterial({color:palette.cyan,metalness:.52,roughness:.08,transparent:true,opacity:.88,emissive:0x0b3040,emissiveIntensity:.65}));model.add(core);
 const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.42,1),new THREE.MeshBasicMaterial({color:palette.purple,wireframe:true,transparent:true,opacity:.22}));model.add(wire);
 [1.72,2.08,2.42].forEach((r,i)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r,.024,10,100),new THREE.MeshBasicMaterial({color:[palette.cyan,palette.purple,palette.pink][i],transparent:true,opacity:.38}));t.rotation.set(Math.PI/(2.2+i*.18),.42+i*.68,.18+i*.46);model.add(t)});
 for(let i=-3;i<=3;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.16,12),new THREE.MeshStandardMaterial({color:i%2?palette.blue:palette.cyan,metalness:.72,roughness:.18,emissive:i%2?0x071c38:0x06303b,emissiveIntensity:.5}));m.position.y=i*.35;model.add(m)}
 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.6,.22,32),new THREE.MeshStandardMaterial({color:0x071224,metalness:.84,roughness:.25}));pedestal.position.y=-2.05;model.add(pedestal);
 const floorRing=new THREE.Mesh(new THREE.TorusGeometry(2.35,.035,8,100),new THREE.MeshBasicMaterial({color:palette.cyan,transparent:true,opacity:.35}));floorRing.rotation.x=Math.PI/2;floorRing.position.y=-1.92;model.add(floorRing);
 const systems=[
   {name:'AZURE',color:palette.cyan,a:0},{name:'AWS',color:palette.purple,a:Math.PI/4},{name:'GCP',color:palette.blue,a:Math.PI/2},{name:'K8S',color:palette.green,a:Math.PI*3/4},
   {name:'TERRAFORM',color:palette.purple,a:Math.PI},{name:'CI/CD',color:palette.pink,a:Math.PI*1.25},{name:'LLM',color:palette.cyan,a:Math.PI*1.5},{name:'MCP',color:palette.green,a:Math.PI*1.75}
 ];
 const nodes=[],packets=[];
 systems.forEach((s,idx)=>{
   const radius=4.15,x=Math.cos(s.a)*radius,z=Math.sin(s.a)*radius;
   const g=new THREE.Group();g.position.set(x,Math.sin(idx*.9)*.48,z);g.userData={name:s.name};
   g.add(new THREE.Mesh(new THREE.DodecahedronGeometry(.46,0),new THREE.MeshPhysicalMaterial({color:s.color,metalness:.52,roughness:.15,transparent:true,opacity:.86,emissive:s.color,emissiveIntensity:.17})));
   g.add(new THREE.Mesh(new THREE.OctahedronGeometry(.7,0),new THREE.MeshBasicMaterial({color:s.color,wireframe:true,transparent:true,opacity:.22})));
   const halo=new THREE.Mesh(new THREE.TorusGeometry(.78,.018,8,64),new THREE.MeshBasicMaterial({color:s.color,transparent:true,opacity:.42}));halo.rotation.x=Math.PI/2;g.add(halo);
   model.add(g);nodes.push(g);
   const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0,0),new THREE.Vector3(x*.5,1.2+idx%2*.55,z*.5),new THREE.Vector3(x,g.position.y,z));
   model.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(38)),new THREE.LineBasicMaterial({color:s.color,transparent:true,opacity:.23})));
   for(let k=0;k<2;k++){const dot=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),new THREE.MeshBasicMaterial({color:s.color}));model.add(dot);packets.push({mesh:dot,curve,phase:(idx*2+k)/18})}
 });
 const shield=new THREE.Mesh(new THREE.SphereGeometry(3.12,28,20),new THREE.MeshBasicMaterial({color:palette.green,wireframe:true,transparent:true,opacity:.045}));model.add(shield);
 const stars=[];for(let i=0;i<330;i++)stars.push((Math.random()-.5)*22,(Math.random()-.5)*12,(Math.random()-.5)*22);const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({size:.024,color:0xb9d8ff,transparent:true,opacity:.3})));
 let mode='devsecops',auto=true,drag=false,lx=0,ly=0,rx=.06,ry=.14,zoom=1,visible=false;
 const modeData={devsecops:{core:'DEVSECOPS',cam:[0,3.1,11],shield:.13,speed:.22},cloud:{core:'MULTI-CLOUD',cam:[7.1,4.6,8.8],shield:.04,speed:.28},ai:{core:'AI + MCP',cam:[-6.8,3.5,8.6],shield:.07,speed:.36},delivery:{core:'CODE → CLOUD',cam:[0,6.8,9],shield:.055,speed:.48}};
 let camGoal=new THREE.Vector3(...modeData.devsecops.cam);
 function setMode(m){
   mode=m;const d=modeData[m]||modeData.devsecops;camGoal.set(...d.cam);shield.material.opacity=d.shield;
   const cl=document.querySelector('#nexusCoreLabel');if(cl)cl.textContent=d.core;
   const tr=document.querySelector('#nexusTraffic');if(tr)tr.textContent=m==='delivery'?'FAST':'LIVE';
   const sc=document.querySelector('#nexusSecurity');if(sc)sc.textContent=m==='devsecops'?'ENFORCED':'PASS';
   document.querySelectorAll('.nexus-mode').forEach(b=>b.classList.toggle('active',b.dataset.nexus===m));
   nodes.forEach(n=>{const focus=(m==='cloud'&&['AZURE','AWS','GCP'].includes(n.userData.name))||(m==='ai'&&['LLM','MCP'].includes(n.userData.name))||(m==='delivery'&&['TERRAFORM','CI/CD','K8S'].includes(n.userData.name))||m==='devsecops';n.scale.setScalar(focus?1.16:.82);n.children[0].material.emissiveIntensity=focus?.68:.12});
 }
 document.querySelectorAll('.nexus-mode').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.nexus)));
 document.querySelector('#nexusFocus')?.addEventListener('click',()=>{camGoal.set(...modeData[mode].cam);rx=.06;ry=.14;zoom=1});
 document.querySelector('#nexusRotate')?.addEventListener('click',e=>{auto=!auto;e.currentTarget.textContent=`Auto rotate: ${auto?'ON':'OFF'}`});
 canvas.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture?.(e.pointerId)});
 canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
 canvas.addEventListener('pointermove',e=>{if(!drag)return;ry+=(e.clientX-lx)*.006;rx+=(e.clientY-ly)*.0045;rx=Math.max(-.42,Math.min(.42,rx));lx=e.clientX;ly=e.clientY});
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.76,Math.min(1.28,zoom+Math.sign(e.deltaY)*.045))},{passive:false});
 function fit(){const r=stage.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}fit();new ResizeObserver(fit).observe(stage);
 new IntersectionObserver(es=>visible=es.some(e=>e.isIntersecting),{rootMargin:'180px'}).observe(stage);
 const clock=new THREE.Clock(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function tick(){requestAnimationFrame(tick);if(!visible||document.hidden)return;const t=clock.getElapsedTime(),d=modeData[mode];if(auto&&!drag&&!reduced)ry+=.0012;
   root.rotation.x+=(rx-root.rotation.x)*.035;root.rotation.y+=(ry-root.rotation.y)*.035;
   camera.position.x+=(camGoal.x*zoom-camera.position.x)*.04;camera.position.y+=(camGoal.y*zoom-camera.position.y)*.04;camera.position.z+=(camGoal.z*zoom-camera.position.z)*.04;camera.lookAt(0,0,0);
   core.rotation.x=t*.24;core.rotation.y=t*.38;wire.rotation.x=-t*.18;wire.rotation.y=t*.23;shield.rotation.y=-t*.055;
   nodes.forEach((n,i)=>{n.rotation.y=t*.25*(i%2?1:-1);n.children[2].rotation.z=t*.22*(i%2?1:-1);n.position.y=Math.sin(t*.8+i)*.14+Math.sin(i*.9)*.48});
   packets.forEach(p=>{const q=(t*d.speed+p.phase)%1;p.mesh.position.copy(p.curve.getPoint(q));p.mesh.scale.setScalar(.7+Math.sin(q*Math.PI)*1.25)});
   renderer.render(scene,camera)
 }tick();setMode('devsecops');
})();
