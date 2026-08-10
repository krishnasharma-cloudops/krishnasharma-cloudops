// V15 GitHub Pages UX: visual modes + command palette.
(()=>{
 const body=document.body,visualToggle=document.querySelector('#visualToggle'),visualMenu=document.querySelector('#visualMenu');
 const visualOptions=[...document.querySelectorAll('.visual-option')];
 function setVisual(v){body.dataset.visual=v;visualOptions.forEach(b=>b.classList.toggle('active',b.dataset.visual===v))}
 visualToggle?.addEventListener('click',()=>{const isOpen=!visualMenu.hidden;visualMenu.hidden=isOpen;visualToggle.setAttribute('aria-expanded',String(!isOpen))});
 visualOptions.forEach(b=>b.addEventListener('click',()=>{setVisual(b.dataset.visual);visualMenu.hidden=true;visualToggle?.setAttribute('aria-expanded','false')}));
 document.addEventListener('click',e=>{if(visualMenu&&!visualMenu.hidden&&!e.target.closest('.visual-toolbar')){visualMenu.hidden=true;visualToggle?.setAttribute('aria-expanded','false')}});
 const palette=document.querySelector('#commandPalette'),input=document.querySelector('#commandInput'),list=document.querySelector('#commandList');
 if(palette&&input&&list){
   let items=[...list.querySelectorAll('button')],visibleItems=items,active=0;
   const update=()=>visibleItems.forEach((b,i)=>b.classList.toggle('command-active',i===active));
   const open=()=>{palette.classList.add('open');palette.setAttribute('aria-hidden','false');input.value='';items.forEach(b=>b.hidden=false);visibleItems=items;active=0;update();setTimeout(()=>input.focus(),30)};
   const close=()=>{palette.classList.remove('open');palette.setAttribute('aria-hidden','true')};
   const run=b=>{if(!b)return;const target=b.dataset.commandTarget,ai=b.dataset.commandAi;if(target){document.querySelector('#'+target)?.scrollIntoView({behavior:'smooth',block:'start'});close()}if(ai){document.querySelector('#botToggle')?.click();setTimeout(()=>document.querySelector('.bot-quick button[data-q="'+ai+'"]')?.click(),160);close()}};
   document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette.classList.contains('open')?close():open();return}if(!palette.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowDown'){e.preventDefault();active=(active+1)%Math.max(1,visibleItems.length);update()}if(e.key==='ArrowUp'){e.preventDefault();active=(active-1+Math.max(1,visibleItems.length))%Math.max(1,visibleItems.length);update()}if(e.key==='Enter')run(visibleItems[active])});
   palette.querySelector('.command-backdrop')?.addEventListener('click',close);items.forEach(b=>b.addEventListener('click',()=>run(b)));
   input.addEventListener('input',()=>{const q=input.value.toLowerCase().trim();items.forEach(b=>b.hidden=!!(q&&!b.textContent.toLowerCase().includes(q)));visibleItems=items.filter(b=>!b.hidden);active=0;update()});
 }
 document.addEventListener('visibilitychange',()=>body.classList.toggle('page-hidden',document.hidden));
})();
