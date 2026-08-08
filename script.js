const enterBtn=document.querySelector('#enterBtn');const loader=document.querySelector('#loader');const body=document.body;body.classList.add('lock');
enterBtn.addEventListener('click',()=>{loader.classList.add('hidden');body.classList.remove('lock');setTimeout(()=>loader.remove(),1100)});
setTimeout(()=>{if(loader && !loader.classList.contains('hidden')) enterBtn.classList.add('ready')},500);
document.querySelector('#year').textContent=new Date().getFullYear();
const nav=document.querySelector('.nav-wrap');window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));
const cursor=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const modal=document.querySelector('#resumeModal');const openResume=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');body.classList.add('lock')};const closeResume=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');body.classList.remove('lock')};document.querySelectorAll('.resume-trigger').forEach(b=>b.addEventListener('click',openResume));document.querySelector('.modal-close').addEventListener('click',closeResume);document.querySelector('.modal-backdrop').addEventListener('click',closeResume);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeResume()});
// Three.js interactive infrastructure constellation
if(window.THREE){
 const canvas=document.querySelector('#threeCanvas');const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);camera.position.set(0,0,8);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.outputEncoding=THREE.sRGBEncoding;
 const group=new THREE.Group();group.position.x=2.7;scene.add(group);
 const coreMat=new THREE.MeshPhysicalMaterial({color:0x63e6ff,metalness:.4,roughness:.25,transparent:true,opacity:.75,wireframe:true});
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.15,2),coreMat);group.add(core);
 const inner=new THREE.Mesh(new THREE.IcosahedronGeometry(.52,1),new THREE.MeshBasicMaterial({color:0x9b87ff,wireframe:true,transparent:true,opacity:.85}));group.add(inner);
 const nodes=[];const positions=[[2,0.2,0],[-1.7,.8,.4],[.4,1.8,-.2],[-.6,-1.7,.3],[1.35,-1.35,-.2],[.2,-.2,1.8]];
 positions.forEach((p,i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.11,16,16),new THREE.MeshBasicMaterial({color:i%2?0x9b87ff:0x63e6ff}));m.position.set(...p);group.add(m);nodes.push(m)});
 const lineMat=new THREE.LineBasicMaterial({color:0x5f7fc8,transparent:true,opacity:.36});nodes.forEach(n=>{const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),n.position]);group.add(new THREE.Line(g,lineMat))});
 for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.2+i*.34,.008,8,100),new THREE.MeshBasicMaterial({color:i===1?0x9b87ff:0x63e6ff,transparent:true,opacity:.13}));ring.rotation.x=Math.PI/2.4+i*.45;ring.rotation.y=i*.7;group.add(ring)}
 const starGeo=new THREE.BufferGeometry();const pts=[];for(let i=0;i<220;i++){pts.push((Math.random()-.5)*18,(Math.random()-.5)*12,(Math.random()-.5)*10)}starGeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({size:.015,color:0x95bfff,transparent:true,opacity:.45})));
 let mx=0,my=0;window.addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)});
 const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();core.rotation.x=t*.15;core.rotation.y=t*.22;inner.rotation.x=-t*.25;inner.rotation.z=t*.2;group.rotation.y+=(mx*.28-group.rotation.y)*.025;group.rotation.x+=(-my*.18-group.rotation.x)*.025;nodes.forEach((n,i)=>n.scale.setScalar(1+Math.sin(t*2+i)*.12));renderer.render(scene,camera)}animate();
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(innerWidth<900)group.position.x=1.3;else group.position.x=2.7}window.addEventListener('resize',resize);resize();
}
