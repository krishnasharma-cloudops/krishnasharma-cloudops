'use strict';
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const entry = $('#entry');
  const header = $('.header');
  const main = $('main');
  const footer = $('.footer');
  const launch = $('#chat-launcher');
  let entryOpen = false;
  function setEntry(active) {
    entryOpen = active;
    document.body.classList.toggle('scroll-lock', active);
    for (const el of [header,main,footer,launch]) if (el) el.inert = active;
    entry.setAttribute('aria-hidden', String(!active));
  }
  function dismissEntry(){
    if(!entryOpen)return;
    entry.classList.add('gone');
    setEntry(false);
    setTimeout(() => entry.classList.add('hidden-start'),reduceMotion?0:750);
    window.scrollTo({top:0,behavior:'instant'});
    setTimeout(() => $('.brand')?.focus({preventScroll:true}),reduceMotion?5:580);
  }
  const shouldShowIntro = !location.hash && !new URLSearchParams(location.search).has('preview');
  if(shouldShowIntro) setEntry(true);
  else{entry.classList.add('hidden-start');setEntry(false);}
  $('#entry-enter')?.addEventListener('click',dismissEntry);
  $('#entry-skip')?.addEventListener('click',dismissEntry);
  $('#replay-intro')?.addEventListener('click',()=>{
    entry.classList.remove('hidden-start');entry.classList.remove('gone');
    window.scrollTo({top:0,behavior:'instant'});setEntry(true);
    $('#entry-enter')?.focus({preventScroll:true});
  });
  document.addEventListener('keydown',e => {if(entryOpen && e.key==='Escape')dismissEntry();});
  entry.addEventListener('keydown',e=>{if(!entryOpen || e.key!=='Tab')return;
    const focusable = $$('#entry button');if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
  });
  // nav
  const menuButton=$('#menu-button'),nav=$('#nav');
  menuButton?.addEventListener('click',()=>{
    const open=menuButton.getAttribute('aria-expanded')!=='true';
    nav.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
  });
  $$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}});
  // Page progress and year
  const progress=$('#scrollbar');let scrolling=false;
  function drawProgress(){const height=document.documentElement.scrollHeight-innerHeight;progress.style.width=(height>0?scrollY/height*100:0).toFixed(2)+'%';scrolling=false;}
  addEventListener('scroll',()=>{if(!scrolling){scrolling=true;requestAnimationFrame(drawProgress);}}, {passive:true});
  addEventListener('resize',drawProgress,{passive:true});drawProgress();
  $('#year').textContent=String(new Date().getFullYear());
  // Copy email
  const copyButton=$('#copy-email');
  copyButton?.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText('krishna.sharma.cloud.ops@gmail.com');copyButton.textContent='COPIED ✓';}
    catch{copyButton.textContent='EMAIL IN CONTACT LINK';}
    setTimeout(()=>copyButton.textContent='COPY EMAIL ⧉',2200);
  });
  // Resume gallery
  const resumeImg=$('#resume-img');
  $$('[data-page]').forEach(b=>b.addEventListener('click',()=>{
    const page=Number(b.dataset.page);if(page!==1&&page!==2)return;
    $$('[data-page]').forEach(x=>{const selected=x===b;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected));});
    resumeImg.classList.add('fading');
    const img=new Image();img.onload=()=>{resumeImg.src=img.src;resumeImg.alt=`Page ${page} of Krishna Sharma resume`;resumeImg.classList.remove('fading');};
    img.onerror=()=>resumeImg.classList.remove('fading');
    img.src=`assets/resume-${page}.webp`;
  }));
  // Optional subtle reveal
  if('IntersectionObserver' in window&&!reduceMotion){
    const targets=$$('.capability,.project,.experience-item,.process-step,.insight');
    targets.forEach(el=>el.dataset.animate='');
    const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('appeared');observer.unobserve(e.target);}}},{threshold:.08,rootMargin:'0px 0px 20px 0px'});
    targets.forEach(el=>observer.observe(el));
  }
  // PROJECT CASE STUDIES — scope and methods based on resume. No fabricated metrics.
  const cases = {
    azure:{title:'Azure Landing Zone & Hub-and-Spoke',meta:'01 / CLOUD ARCHITECTURE · TERRAFORM + MICROSOFT AZURE',lead:'Using modular Infrastructure as Code to structure an Azure landing-zone foundation and a hub-and-spoke network topology.',steps:[
      'Structure the Azure foundation into reusable Terraform configurations and environment-focused components.',
      'Provision the hub and spoke virtual network layout using Terraform-managed Azure networking resources.',
      'Account for VNet peering and network segmentation with NSGs, along with access-control practices such as RBAC.',
      'Keep configuration changes reviewable and repeatable through Terraform state management and IaC validation.'
    ],tags:['Terraform','Azure','Landing Zones','Hub-and-Spoke','VNet','NSG','Peering','HCL'],result:'A structured, modular approach to Azure infrastructure provisioning and network architecture. Project scope is documented in the resume.'},
    multicloud:{title:'Multi-Cloud Infrastructure Automation',meta:'02 / MULTI-CLOUD · AZURE + AWS + GCP',lead:'Terraform-managed cloud resources across three providers, with reusable modules and state-handling practices for consistent provisioning.',steps:[
      'Define reusable Terraform modules and parameterized infrastructure configurations.',
      'Adapt provider configurations and environment inputs for Azure, AWS and Google Cloud Platform.',
      'Configure remote backends, state locking and workspaces as part of repeatable environment management.',
      'Use plan/review practices to help understand infrastructure changes before deployment.'
    ],tags:['Terraform','Azure','AWS','GCP','Modules','Backends','State locking','Workspaces'],result:'A cross-cloud IaC approach designed around reuse, clearer state management and repeatable provisioning.'},
    pipeline:{title:'Terraform CI/CD & DevSecOps Automation',meta:'03 / DEVSECOPS · AZURE DEVOPS + GITHUB ACTIONS',lead:'Infrastructure-oriented YAML workflows connecting validation, security checks, plan review and deployment automation.',steps:[
      'Create and maintain YAML pipeline steps for Terraform initialization, configuration validation and planning.',
      'Use TFLint for Terraform linting and tfsec for infrastructure-as-code security analysis.',
      'Apply SonarQube code-quality analysis and include secret-management considerations such as Azure Key Vault.',
      'Use Git-based workflows and reviewable plans to support controlled infrastructure change.'
    ],tags:['Azure DevOps','GitHub Actions','Terraform','YAML','tfsec','TFLint','SonarQube','Key Vault'],result:'A shift-left, automation-focused approach to repeatable infrastructure checks and delivery. Exact production gates are not asserted.'},
    ai:{title:'AI-Assisted DevOps & Infrastructure Automation',meta:'04 / AI-ASSISTED ENGINEERING · GOOGLE ANTIGRAVITY',lead:'Using Google Antigravity and AI agents to assist with code creation, configuration reviews and infrastructure troubleshooting.',steps:[
      'Use AI assistance to draft or refine Terraform code and IaC structures for review.',
      'Inspect Terraform errors and use agent-assisted diagnosis to narrow down configuration problems.',
      'Generate, review and debug Azure DevOps YAML pipeline configurations with AI-assisted workflows.',
      'Retain human validation, security checks and review before using generated changes.'
    ],tags:['Google Antigravity','AI Agents','Terraform','Azure DevOps','YAML','Troubleshooting'],result:'Faster iteration on infrastructure and pipeline tasks with AI as an assistant, not a replacement for engineering judgment.'},
    finops:{title:'Infrastructure Cost Analysis & FinOps',meta:'05 / FINOPS · INFRACOST + OPENCOST',lead:'Making infrastructure cost implications more visible during planning and cloud-native resource analysis.',steps:[
      'Use Infracost alongside Terraform to estimate the cost impact of planned infrastructure.',
      'Review cost estimates as part of engineering decisions before infrastructure changes.',
      'Use OpenCost to explore cloud-native resource costs and cost visibility.',
      'Connect estimated cost information with the broader goal of accountable infrastructure delivery.'
    ],tags:['Infracost','OpenCost','Terraform','FinOps','Cloud cost analysis'],result:'Visibility into potential infrastructure expenditure and cloud-native resource costs. No savings percentage is claimed.'}
  };
  const modal=$('#project-modal'),backdrop=$('#modal-backdrop');let currentCase='azure',returnFocus=null;
  const caseIds=Object.keys(cases);
  function renderCase(key){
    const data=cases[key];if(!data)return;currentCase=key;
    $('#modal-title').textContent=data.title;$('#modal-meta').textContent=data.meta;$('#modal-lead').textContent=data.lead;
    $('#modal-steps').replaceChildren(...data.steps.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
    $('#modal-tags').replaceChildren(...data.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
    $('#modal-result').textContent=data.result;
    $('.modal-scroll').scrollTop=0;
  }
  function openCase(key){
    returnFocus=document.activeElement;renderCase(key);
    backdrop.hidden=false;modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
    $('#modal-close').focus();
  }
  function closeCase(){
    modal.hidden=true;backdrop.hidden=true;modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');
    returnFocus?.focus?.();
  }
  $$('[data-project]').forEach(b=>b.addEventListener('click',()=>openCase(b.dataset.project)));
  $('#modal-close').addEventListener('click',closeCase);backdrop.addEventListener('click',closeCase);
  $('#modal-next').addEventListener('click',()=>renderCase(caseIds[(caseIds.indexOf(currentCase)+1)%caseIds.length]));
  document.addEventListener('keydown',e=>{
    if(modal.hidden)return;
    if(e.key==='Escape'){e.preventDefault();closeCase();}
    if(e.key==='Tab'){
      const focusable=[...modal.querySelectorAll('button,a[href]')].filter(el=>!el.disabled);
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  // Architecture patterns
  const patterns = {
    landing:{label:'ARCHITECTURE PATTERN 01',title:'Azure hub-and-spoke networking',description:'A shared hub network supports connectivity and common services, while separate spokes keep workloads organized. Terraform modules make the structure repeatable.',points:['Reusable module boundaries for networking resources','VNet peering, NSGs, RBAC and Key Vault considerations','State-backed changes reviewed through an IaC workflow'],top:'AZURE / LANDING ZONE',hub:['☁','HUB VNET','SHARED SERVICES'],child:[['SPOKE / APP','WORKLOAD'],['SPOKE / DATA','DATA TIER']],bottom:'TERRAFORM MODULES · REMOTE STATE'},
    security:{label:'DELIVERY PATTERN 02',title:'Security-first Terraform pipeline',description:'A representative delivery sequence connects Git-based changes with Terraform validation, security analysis, plan review and a controlled deployment step.',points:['Validate Terraform configurations and pipeline YAML','Use TFLint, tfsec and SonarQube-informed checks','Review the Terraform plan before controlled apply'],top:'AZURE DEVOPS / GITHUB ACTIONS',hub:['⇄','CI / CD','AUTOMATED CHECKS'],child:[['VALIDATE','FMT · INIT · CHECK'],['SECURITY','TFSEC · TFLINT']],bottom:'PLAN → REVIEW → APPLY'},
    multi:{label:'PLATFORM PATTERN 03',title:'Reusable multi-cloud modules',description:'A single Terraform workflow can organize provider-specific resources while sharing design conventions and repeatable modules across Azure, AWS and GCP.',points:['Separate environment inputs from reusable module logic','Configure appropriate backends and state locking','Plan infrastructure changes across providers'],top:'TERRAFORM / MULTI-CLOUD',hub:['◈','MODULES','REUSABLE IaC'],child:[['AZURE / AWS','PROVIDERS'],['GCP / STATE','ENVIRONMENT']],bottom:'REMOTE BACKEND · WORKSPACES'}
  };
  function switchArch(key){const p=patterns[key];if(!p)return;
    $$('[data-arch]').forEach(b=>{const selected=b.dataset.arch===key;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
    $('#arch-label').textContent=p.label;$('#arch-title').textContent=p.title;$('#arch-description').textContent=p.description;
    $('#arch-points').replaceChildren(...p.points.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
    const visual=$('#arch-visual');visual.querySelector('.diag-top').textContent=p.top;visual.querySelector('.diag-hub span').textContent=p.hub[0];visual.querySelector('.diag-hub b').textContent=p.hub[1];visual.querySelector('.diag-hub small').textContent=p.hub[2];
    visual.querySelectorAll('.diag-row>div').forEach((d,i)=>{d.querySelector('b').textContent=p.child[i][0];d.querySelector('small').textContent=p.child[i][1];});
    visual.querySelector('.diag-bottom').textContent=p.bottom;
  }
  $$('[data-arch]').forEach(b=>{b.addEventListener('click',()=>switchArch(b.dataset.arch));b.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('[data-arch]');let index=tabs.indexOf(b);
    index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    switchArch(tabs[index].dataset.arch);tabs[index].focus();
  });});
})();
