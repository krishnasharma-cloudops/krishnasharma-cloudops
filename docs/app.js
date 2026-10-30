'use strict';
/* All features work on a static GitHub Pages site — no dependencies, secrets or API keys. */
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const safeStorage = {get(k){try{return sessionStorage.getItem(k)}catch{return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch{}}};

// Cinematic entrance: user controls when content opens. In a no-JavaScript browser,
// <noscript> CSS reveals the main site automatically.
const intro = $('#intro-gate');
const enterButton = $('#enter-portfolio');
function enterPortfolio(){
  if (!intro || intro.classList.contains('exit')) return;
  document.body.classList.remove('intro-active');
  intro.classList.add('exit');
  intro.setAttribute('aria-hidden','true');
  window.setTimeout(()=>{intro.hidden = true; intro.remove();},prefersReduced?20:850);
  window.setTimeout(()=>$('#hero-heading')?.setAttribute('tabindex','-1'),100);
}
enterButton?.addEventListener('click',enterPortfolio);
$('#skip-entrance')?.addEventListener('click',enterPortfolio);
if(intro){document.body.classList.add('intro-active');enterButton?.focus({preventScroll:true});}

// Observable animations never hide content unless IntersectionObserver is available.
const reveal = $$('[data-reveal]');
if('IntersectionObserver' in window && !prefersReduced){
  const observer = new IntersectionObserver((items)=>items.forEach(item=>{
    if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target)}
  }),{threshold:.045,rootMargin:'0px 0px 75px 0px'});
  document.body.classList.add('js-ready');
  reveal.forEach(item=>observer.observe(item));
}else{reveal.forEach(el=>el.classList.add('visible'))}

const meter=$('#scroll-meter');
let pending=false;
function updateMeter(){const max=document.documentElement.scrollHeight-innerHeight; if(meter)meter.style.width=`${max>0?Math.max(0,Math.min(100,scrollY/max*100)):0}%`;pending=false}
window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateMeter)}},{passive:true});
window.addEventListener('resize',updateMeter,{passive:true});updateMeter();
const nav=$('#main-nav'), mobileToggle=$('#mobile-toggle');
function closeMobile(){nav?.classList.remove('open');mobileToggle?.setAttribute('aria-expanded','false');mobileToggle?.setAttribute('aria-label','Open navigation');document.body.classList.remove('mobile-open')}
mobileToggle?.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);mobileToggle.setAttribute('aria-expanded',String(open));mobileToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');document.body.classList.toggle('mobile-open',open)});
$$('#main-nav a').forEach(el=>el.addEventListener('click',closeMobile));
window.addEventListener('resize',()=>{if(innerWidth>900)closeMobile()});
$('#year').textContent=String(new Date().getFullYear());

// Case studies use only the experience and project categories in the supplied CV.
const cases={
 landing:{id:'01 / CLOUD ARCHITECTURE',name:'Azure Landing Zone & Hub-and-Spoke Network',intro:'Designed and deployed Azure Landing Zone infrastructure and hub-and-spoke network architecture with modular Terraform. This project centers on structured, repeatable Azure networking foundations.',tags:['Microsoft Azure','Terraform','Cloud Networking','Infrastructure as Code'],approach:['Structure Azure foundational infrastructure as reusable Terraform configurations.','Model hub-and-spoke networking patterns to organize shared connectivity and spoke environments.','Use Terraform-driven provisioning to maintain repeatable, reviewable infrastructure configurations.'],focus:'Azure Landing Zones, Terraform modules, VNet peering, network security considerations and lifecycle management.'},
 multi:{id:'02 / MULTI-CLOUD',name:'Multi-Cloud Infrastructure Automation',intro:'Provisioned cloud infrastructure across Microsoft Azure, AWS and GCP with HashiCorp Terraform, using reusable configurations and state management patterns.',tags:['Terraform','Azure','AWS','Google Cloud','HCL'],approach:['Use Terraform modules to reduce duplicated configuration across environments.','Work with remote backend configuration, state management and state locking patterns.','Automate infrastructure provisioning and organize multi-environment IaC workflows.'],focus:'Reusable modules, Terraform backends, workspaces, state management and cloud provisioning.'},
 pipeline:{id:'03 / SECURE DELIVERY',name:'Terraform CI/CD & DevSecOps Automation',intro:'Developed Azure DevOps YAML pipelines for Terraform validation, planning and deployment, with DevSecOps scanning and code quality checks.',tags:['Azure DevOps','GitHub Actions','Terraform','tfsec','TFLint','SonarQube','Azure Key Vault'],approach:['Automate Terraform validation, plan and infrastructure deployment stages using YAML pipelines.','Incorporate tfsec, TFLint and SonarQube checks for security, configuration hygiene and static analysis.','Keep infrastructure changes reviewable within Git-based deployment workflows.'],focus:'Shift-left infrastructure security, reviewable delivery, automated validation and CI/CD troubleshooting.'},
 ai:{id:'04 / AI-ASSISTED AUTOMATION',name:'AI-Assisted DevOps & Infrastructure Automation',intro:'Worked with Google Antigravity and AI agents to assist Terraform code generation, configuration refinement, troubleshooting and CI/CD pipeline debugging.',tags:['Google Antigravity','AI Agents','Terraform','Azure DevOps'],approach:['Use AI assistance for drafting and refining Infrastructure as Code configurations.','Investigate Terraform errors and troubleshoot deployment issues with agent-assisted workflows.','Support the creation, review and debugging of Azure DevOps YAML pipelines.'],focus:'Human-reviewed AI assistance for practical engineering productivity—not autonomous production claims.'},
 finops:{id:'05 / COST INTELLIGENCE',name:'Infrastructure Cost Analysis & FinOps',intro:'Applied Infracost to estimate cloud infrastructure costs from Terraform definitions, and worked with OpenCost for cloud-native cost visibility.',tags:['Infracost','OpenCost','Terraform','FinOps'],approach:['Review infrastructure cost implications before changes are applied.','Use Infracost estimates alongside Terraform configuration review.','Explore OpenCost for cost analysis and cloud-native infrastructure visibility.'],focus:'Cost estimation, transparent change review and cloud infrastructure cost awareness.'}
};
const projectModal=$('#project-modal'), modalContent=$('#modal-content');let previousFocus=null;
$$('[data-project]').forEach(card=>card.addEventListener('click',()=>{
 const info=cases[card.dataset.project];if(!info||!projectModal)return;
 previousFocus=document.activeElement;
 modalContent.replaceChildren();
 const section=document.createElement('div');section.className='modal-nr';section.textContent=info.id;
 const title=document.createElement('h2');title.id='case-title';title.textContent=info.name;
 const intro=document.createElement('p');intro.textContent=info.intro;
 const tags=document.createElement('div');tags.className='case-tags';info.tags.forEach(t=>{const chip=document.createElement('span');chip.textContent=t;tags.append(chip)});
 const h3=document.createElement('h3');h3.textContent='ENGINEERING APPROACH';
 const ul=document.createElement('ul');info.approach.forEach(item=>{const li=document.createElement('li');li.textContent=item;ul.append(li)});
 const h4=document.createElement('h3');h4.textContent='TECHNICAL FOCUS';const detail=document.createElement('p');detail.textContent=info.focus;
 modalContent.append(section,title,intro,tags,h3,ul,h4,detail);projectModal.showModal();document.body.classList.add('modal-open');
}));
function closeCase(){if(!projectModal?.open)return;projectModal.close();document.body.classList.remove('modal-open');previousFocus?.focus()}
$('#modal-close')?.addEventListener('click',closeCase);
projectModal?.addEventListener('close',()=>{document.body.classList.remove('modal-open')});
projectModal?.addEventListener('click',ev=>{if(ev.target===projectModal)closeCase()});
$$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
 const category=btn.dataset.filter;$$('[data-filter]').forEach(chip=>{const active=chip===btn;chip.classList.toggle('active',active);chip.setAttribute('aria-pressed',String(active))});
 $$('[data-project]').forEach(card=>{card.hidden=category!=='all'&&!card.dataset.category.split(/\s+/).includes(category)});
}));

const diagrams={
 azure:{description:'Conceptual Azure hub-and-spoke foundation: Terraform provisions structured cloud networking and common Azure resources. This diagram is explanatory, not an exported production topology.',html:`<div class="arch-graphic"><div class="diagram-row"><div class="diagram-box warm"><strong>Terraform modules</strong><span>IaC provisioning</span></div><span class="diagram-arrow">→</span><div class="diagram-box cool"><strong>Azure foundation</strong><span>Resource groups · RBAC</span></div></div><div class="diagram-sep">↓ HUB-AND-SPOKE MODEL ↓</div><div class="diagram-row"><div class="diagram-box cool"><strong>Hub VNet</strong><span>Shared connectivity</span></div><span class="diagram-arrow">↔</span><div class="diagram-box"><strong>Spoke VNet A</strong><span>Application network</span></div><span class="diagram-arrow">↔</span><div class="diagram-box"><strong>Spoke VNet B</strong><span>Workload network</span></div></div><div class="diagram-sep">NSGs · VNet peering · Key Vault / Security</div></div>`},
 pipeline:{description:'Illustrative Terraform delivery pipeline using Azure DevOps or GitHub Actions, validation, security scanning, planning and review before deployment.',html:`<div class="arch-graphic"><div class="diagram-row"><div class="diagram-box"><strong>Git + IaC</strong><span>Terraform source</span></div><span class="diagram-arrow">→</span><div class="diagram-box warm"><strong>CI/CD Pipeline</strong><span>Azure DevOps / Actions</span></div></div><div class="diagram-sep">↓ CHECKS + REVIEW ↓</div><div class="diagram-row"><div class="diagram-box cool"><strong>Validate</strong><span>fmt · validate · TFLint</span></div><span class="diagram-arrow">→</span><div class="diagram-box cool"><strong>Security</strong><span>tfsec · SonarQube</span></div><span class="diagram-arrow">→</span><div class="diagram-box warm"><strong>Plan + review</strong><span>Terraform plan</span></div></div><div class="diagram-sep">↓ APPROVED APPLY → CLOUD INFRASTRUCTURE</div></div>`},
 clouds:{description:'Reusable Terraform Infrastructure as Code workflow applied across Azure, AWS and GCP. Remote backend/state details depend on each environment.',html:`<div class="arch-graphic"><div class="diagram-row"><div class="diagram-box warm"><strong>Terraform modules</strong><span>Common IaC patterns</span></div><span class="diagram-arrow">↔</span><div class="diagram-box cool"><strong>State + backends</strong><span>Remote state · locking</span></div></div><div class="diagram-sep">↓ PROVIDERS / ENVIRONMENTS ↓</div><div class="diagram-row"><div class="diagram-box green"><strong>Microsoft Azure</strong><span>Primary cloud</span></div><div class="diagram-box"><strong>AWS</strong><span>Infrastructure</span></div><div class="diagram-box"><strong>Google Cloud</strong><span>Infrastructure</span></div></div><div class="diagram-sep">REPEATABLE · MODULAR · REVIEWABLE</div></div>`}
};
const archDisplay=$('#arch-display'),archDescription=$('#arch-description');
function showDiagram(key){const data=diagrams[key];if(!data)return;archDisplay.innerHTML=data.html;archDescription.textContent=data.description;$$('[data-arch]').forEach(tab=>{const active=tab.dataset.arch===key;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active))});$('#arch-panel').setAttribute('aria-labelledby',`tab-${key==='clouds'?'clouds':key}`)}
$$('[data-arch]').forEach(btn=>btn.addEventListener('click',()=>showDiagram(btn.dataset.arch)));showDiagram('azure');

const demos={
 terraform:['$ terraform fmt -check','Formatting check complete.','$ terraform init','Initializing the backend...','Terraform initialized.','$ terraform validate','Success! Configuration is valid.','$ terraform plan','Plan: review infrastructure changes before apply.','✓ Conceptual workflow complete.'],
 security:['$ tflint','Inspecting Terraform configuration...','✓ Lint checks reviewed.','$ tfsec .','Scanning infrastructure as code...','✓ Security findings reviewed.','$ sonar-scanner','Analyzing source quality...','✓ Security-first workflow demo complete.'],
 finops:['$ infracost breakdown --path .','Reading Terraform resource definitions...','Estimating infrastructure cost impact...','✓ Review estimated cloud spending.','$ opencost --overview','Cloud-native cost visibility pattern.','✓ Conceptual FinOps workflow complete.']
};
let demoTimers=[];
function startDemo(key){demoTimers.forEach(clearTimeout);demoTimers=[];$$('[data-demo]').forEach(btn=>{const selected=btn.dataset.demo===key;btn.classList.toggle('active',selected);btn.setAttribute('aria-pressed',String(selected))});const out=$('#terminal-output');if(!out)return;out.textContent='';(demos[key]||[]).forEach((line,i)=>{if(prefersReduced){out.textContent+=(i?'\n':'')+line}else{const timer=setTimeout(()=>{out.textContent+=(i?'\n':'')+line},i*250);demoTimers.push(timer)}})}
$$('[data-demo]').forEach(btn=>btn.addEventListener('click',()=>startDemo(btn.dataset.demo)));$('#replay-demo')?.addEventListener('click',()=>startDemo($('.lab-btn.active')?.dataset.demo||'terraform'));startDemo('terraform');

// Resume preview: use the exact source PDF bundled with site.
$$('[data-resume-page]').forEach(btn=>btn.addEventListener('click',()=>{const n=btn.dataset.resumePage;const img=$('#resume-image');if(!img||!['1','2'].includes(n))return;img.src=`assets/resume-${n}.webp`;img.alt=`Page ${n} of Krishna Sharma's resume`;$('#page-count').textContent=`0${n} / 02`;$$('[data-resume-page]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))})}));
$('#copy-email')?.addEventListener('click',async ev=>{const el=ev.currentTarget;try{await navigator.clipboard.writeText('krishna.sharma.cloud.ops@gmail.com');el.textContent='Copied! ✓';setTimeout(()=>{el.innerHTML='Copy email address <span>⧉</span>'},2300)}catch{el.textContent='krishna.sharma.cloud.ops@gmail.com'}});

// Ctrl+K navigation, searchable sections; no third-party APIs.
const commandModal=$('#command-modal');const destinations=[['Profile','about'],['Projects','projects'],['Architecture','architecture'],['Workflow Lab','lab'],['Skills & Expertise','expertise'],['Experience','experience'],['Resume PDF','resume'],['Contact','contact']];
function renderCommands(query=''){const root=$('#command-results');root.replaceChildren();destinations.filter(([title])=>title.toLowerCase().includes(query.toLowerCase())).forEach(([title,target])=>{const btn=document.createElement('button');btn.type='button';btn.textContent=`↗  ${title}`;btn.addEventListener('click',()=>{commandModal.close();document.getElementById(target)?.scrollIntoView({behavior:prefersReduced?'instant':'smooth'});});root.append(btn)});if(!root.childElementCount){const p=document.createElement('p');p.textContent='No matching sections';root.append(p)}}
function openCommands(){renderCommands();commandModal.showModal();$('#command-search').value='';$('#command-search').focus()}
$('#command-open')?.addEventListener('click',openCommands);$('#command-close')?.addEventListener('click',()=>commandModal.close());$('#command-search')?.addEventListener('input',ev=>renderCommands(ev.target.value));
window.addEventListener('keydown',ev=>{if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){ev.preventDefault();if(!intro||intro.classList.contains('exit')){if(commandModal.open){commandModal.close()}else openCommands()}}if(ev.key==='Escape'){closeMobile();if(intro&&!intro.classList.contains('exit'))enterPortfolio()}});

// Portfolio answer guide: deterministic, resume-grounded; intentionally not live LLM.
const assistantPanel=$('#assistant-panel');
function toggleAssistant(force){const on=typeof force==='boolean'?force:!assistantPanel.classList.contains('open');assistantPanel.classList.toggle('open',on);assistantPanel.setAttribute('aria-hidden',String(!on));$('#assistant-launcher').setAttribute('aria-expanded',String(on));if(on)$('#assistant-input').focus()}
$('#assistant-launcher')?.addEventListener('click',()=>toggleAssistant());$('#assistant-close')?.addEventListener('click',()=>toggleAssistant(false));
const answerPatterns=[
 {rx:/terraform|iac|module|state|backend|workspace|infrastructure as code/,reply:'Krishna’s strongest skill is advanced HashiCorp Terraform. His resume covers reusable modules, HCL, remote state, backend configuration, state locking, workspaces, infrastructure lifecycle management and multi-environment provisioning.'},
 {rx:/azure|landing|hub|spoke|network|vnet|cloud architecture/,reply:'Krishna worked on Azure Landing Zones and hub-and-spoke network architecture using modular Terraform configurations. His Azure skills include VNets, NSGs, RBAC, Key Vault, storage, VNet peering and virtual machines.'},
 {rx:/aws|gcp|multi.cloud|google cloud/,reply:'His multi-cloud Infrastructure as Code work spans Microsoft Azure (primary), AWS and Google Cloud Platform, using reusable Terraform modules and remote state management patterns.'},
 {rx:/ci.?cd|pipeline|actions|devops|deploy|yaml/,reply:'Krishna has worked with Azure DevOps YAML pipelines and GitHub Actions to support Terraform validation, infrastructure planning and deployment. He also uses Git-based configuration management.'},
 {rx:/security|devsecops|scan|tfsec|lint|sonarqube/,reply:'Krishna uses tfsec, TFLint and SonarQube for infrastructure security scanning, configuration checks and static code quality analysis. He follows a shift-left security approach.'},
 {rx:/ai|agent|antigravity|intelligent|automation/,reply:'Krishna uses Google Antigravity and AI agents to assist Terraform code generation, infrastructure troubleshooting, configuration refinement, task automation and Azure DevOps YAML debugging. These are AI-assisted workflows with human technical review.'},
 {rx:/finops|cost|infracost|opencost|budget/,reply:'His FinOps experience includes using Infracost to estimate cost implications from Terraform infrastructure and OpenCost for cloud-native cost visibility.'},
 {rx:/intern|experience|work|davin|insider|career/,reply:'Krishna completed 15 months of internships: DevOps & DevSecOps Intern at DevOps Insider (June 2025–June 2026), and DevOps Intern at Davin Technologies (July–October 2026). Work included IaC, cloud networks, CI/CD, security and AI-assisted workflows.'},
 {rx:/educat|college|degree|university|graduate/,reply:'Krishna is pursuing a B.Tech in Computer Science at ISBM University in Chhattisgarh. His resume lists expected graduation in July 2027.'},
 {rx:/project|build|case study|portfolio/,reply:'Explore five project areas: Azure Landing Zone & Hub-Spoke Architecture, Multi-Cloud Infrastructure Automation, Terraform CI/CD & DevSecOps, AI-Assisted DevOps Automation, and Infrastructure Cost Analysis & FinOps. Each project card has a detailed case study.'},
 {rx:/resume|cv|download/,reply:'Use the Resume section to preview both pages and download Krishna’s original two-page PDF. The download link is in the Resume section of this page.'},
 {rx:/contact|email|phone|number|linkedin|github|reach|hire/,reply:'Contact Krishna: +91 93682 19108 · krishna.sharma.cloud.ops@gmail.com · LinkedIn: linkedin.com/in/krishna-sharma-42110229a/ · GitHub: github.com/krishnasharma-cloudops. Direct links are in the Contact section.'}
];
function botAnswer(q){const lower=q.toLowerCase();return answerPatterns.find(x=>x.rx.test(lower))?.reply||'I can help with Krishna’s Terraform, Azure, multi-cloud, CI/CD, DevSecOps, FinOps, AI automation, internships, projects, resume and contact details. Try asking about one of these topics.'}
function addBubble(text,who){const root=$('#assistant-feed');const p=document.createElement('div');p.className=`chat-bubble ${who}`;p.textContent=text;root.append(p);root.scrollTop=root.scrollHeight}
function askQuestion(q){const value=q.trim();if(!value)return;addBubble(value,'user');addBubble(botAnswer(value),'bot')}
$$('[data-question]').forEach(btn=>btn.addEventListener('click',()=>askQuestion(btn.dataset.question)));
$('#assistant-form')?.addEventListener('submit',ev=>{ev.preventDefault();const input=$('#assistant-input');askQuestion(input.value);input.value='';input.focus()});
