'use strict';
/* Krishna AI — portfolio knowledge assistant.
   Works without keys or network services. For optional live generative AI,
   configure site-config.js to point to the supplied secure Cloudflare Worker. */
(() => {
  const launcher = document.getElementById('assistant-launcher');
  const panel = document.getElementById('assistant-panel');
  const close = document.getElementById('assistant-close');
  const log = document.getElementById('assistant-messages');
  const input = document.getElementById('assistant-input');
  const form = document.getElementById('assistant-form');
  const send = form.querySelector('button[type="submit"]');
  const suggestions = document.getElementById('assistant-suggestions');
  const modeIndicator = document.getElementById('assistant-mode');
  const disclaimer = document.getElementById('assistant-disclaimer');
  const config = window.KRISHNA_SITE_CONFIG || {};
  const liveEndpoint = typeof config.aiEndpoint === 'string' && /^https:\/\//i.test(config.aiEndpoint) ? config.aiEndpoint : '';
  if (liveEndpoint) {
    modeIndicator.textContent = 'Live AI · resume grounded';
    disclaimer.textContent = 'Live AI may make mistakes · Messages are sent to the configured AI service';
  }

  const articles = [
    {
      id: 'terraform',
      terms: ['terraform','iac','infrastructure as code','hcl','remote state','state locking','backend','workspace','module','for_each','count','terraform import','state management','provisioning'],
      answer: 'Terraform is Krishna’s strongest technical area. He has worked with reusable modules, remote backends, state management and locking, workspaces, resource import, dynamic blocks, and infrastructure lifecycle operations. He has used Terraform for Azure infrastructure, multi-cloud provisioning, and CI/CD-driven infrastructure deployments.',
      link: {text:'Explore Terraform projects ↗', href:'#work'}
    },
    {
      id: 'azure',
      terms: ['azure','landing zone','hub and spoke','hub-and-spoke','network','vnet','virtual network','peering','nsg','rbac','key vault','security group','cloud architecture'],
      answer: 'Krishna’s primary cloud platform is Microsoft Azure. His resume documents Azure Landing Zone implementations, hub-and-spoke networking, Azure Virtual Machines, VNets, NSGs, Storage, Key Vault, RBAC and VNet Peering. His highlighted Azure project uses modular Terraform configurations to support structured cloud infrastructure deployment.',
      link: {text:'View Azure architecture project ↗', href:'#work'}
    },
    {
      id: 'devsecops',
      terms: ['devsecops','secure','security','scan','tfsec','tflint','sonarqube','shift left','quality','lint','key vault','vulnerabilit','code analysis'],
      answer: 'His DevSecOps work includes Terraform security analysis with tfsec, Terraform linting/configuration checks with TFLint, and code-quality analysis with SonarQube. He has integrated these practices into infrastructure-oriented CI/CD workflows. His portfolio does not claim unverified security certifications or production audit outcomes.',
      link: {text:'See security-first delivery ↗', href:'#workflow-heading'}
    },
    {
      id: 'ai',
      terms: ['artificial intelligence','antigravity','agent','ai','generative','prompt','automation assistant','ai assisted','troubleshoot','code generation','debug'],
      answer: 'Krishna has practical exposure to Google Antigravity and AI agents for Terraform code generation and refinement, infrastructure error investigation, agent-assisted tasks, and debugging Azure DevOps YAML pipelines. His profile frames this as AI-assisted DevOps engineering—not as machine-learning model development.',
      link: {text:'Explore AI-assisted project ↗', href:'#work'}
    },
    {
      id: 'cicd',
      terms: ['ci/cd','cicd','pipeline','github action','azure devops','deployment','continuous integration','continuous deployment','yaml','release','build','automate deploy'],
      answer: 'Krishna has worked with Azure DevOps YAML pipelines and GitHub Actions for Terraform validation, planning, and deployment automation. He has also applied tfsec, TFLint and SonarQube checks as part of DevSecOps-oriented workflows. The animated delivery terminal on this website is an illustrative workflow rather than a claim about a specific production environment.',
      link: {text:'View the CI/CD workflow ↗', href:'#workflow-heading'}
    },
    {
      id: 'cloud',
      terms: ['multi cloud','multicloud','multi-cloud','aws','gcp','google cloud','amazon web services','three cloud','cloud platforms','providers'],
      answer: 'He has worked with three cloud platforms: Microsoft Azure (primary), AWS, and Google Cloud Platform (GCP). His multi-cloud Terraform project covers automated provisioning, reusable modules, environment-specific configurations, remote backend management, and state locking.',
      link: {text:'See the multi-cloud project ↗', href:'#work'}
    },
    {
      id: 'cost',
      terms: ['finops','cost','budget','infracost','opencost','optimization','pricing','estimate','spend'],
      answer: 'Krishna has used Infracost to estimate the cost implications of Terraform-managed infrastructure, and OpenCost for cloud-native resource cost analysis and cost visibility. The resume does not specify verified savings percentages, so this portfolio does not invent them.',
      link: {text:'Explore FinOps project ↗', href:'#work'}
    },
    {
      id: 'experience',
      terms: ['experience','internship','intern','davin','insider','company','companies','work history','worked','months','year','job'],
      answer: 'Krishna has 15 months of hands-on internship experience. At DevOps Insider (June 2025–June 2026), he worked as a DevOps & DevSecOps Intern across Terraform, multi-cloud, Azure architecture, DevSecOps, FinOps and AI-assisted workflows. At Davin Technologies (July–October 2026), he worked as a DevOps Intern on Terraform, Azure DevOps pipelines, infrastructure validation and security tooling.',
      link: {text:'View professional experience ↗', href:'#experience'}
    },
    {
      id: 'skills',
      terms: ['skills','stack','technologies','tools','languages','linux','ubuntu','bash','python','powershell','java','c++','basic','programming'],
      answer: 'His core stack includes advanced Terraform and HCL, Microsoft Azure, AWS, GCP, Azure DevOps, GitHub Actions, Git, YAML, tfsec, TFLint, SonarQube, Infracost, OpenCost, and Google Antigravity. He also lists foundational knowledge of Linux/Ubuntu CLI, SSH, basic networking, Python, Java, C++, Bash and PowerShell.',
      link: {text:'Explore the engineering toolkit ↗', href:'#expertise'}
    },
    {
      id: 'education',
      terms: ['education','university','college','b.tech','btech','graduation','degree','computer science','isbm'],
      answer: 'Krishna is pursuing a Bachelor of Technology (B.Tech) in Computer Science from ISBM University, Chhattisgarh, with expected graduation in July 2027. His site avoids claiming completed qualifications that are still in progress.',
      link: {text:'See experience and education ↗', href:'#experience'}
    },
    {
      id: 'projects',
      terms: ['projects','portfolio','case study','built','build','showcase','five','project'],
      answer: 'Five project areas are showcased here: (1) Azure Landing Zone and Hub-and-Spoke Architecture, (2) Multi-Cloud Infrastructure Automation, (3) Terraform CI/CD and DevSecOps Automation, (4) AI-Assisted DevOps and Infrastructure Automation, and (5) Infrastructure Cost Analysis and FinOps. Detailed implementation files are not claimed to be public unless linked.',
      link: {text:'Browse featured work ↗', href:'#work'}
    },
    {
      id: 'resume',
      terms: ['resume','cv','pdf','download','document','reference','reference pdf','hire','hiring','recruiter'],
      answer: 'You can view both pages of Krishna’s latest resume in the Resume section, open the original PDF, or download a copy. The resume documents internship experience, detailed skills, five projects, and B.Tech education.',
      link: {text:'Open resume showcase ↗', href:'#resume'}
    },
    {
      id: 'contact',
      terms: ['contact','email','connect','reach','message','linkedin','github','opportunity','available'],
      answer: 'You can contact Krishna through the website’s Contact section, or connect via his GitHub and LinkedIn profiles. His public portfolio includes a resume link. For job opportunities, the best next step is to contact him directly.',
      link: {text:'Contact Krishna ↗', href:'#contact'}
    }
  ];
  const history = [];
  let lastArticle = null;
  let isBusy = false;
  let previousFocus = null;

  function openAssistant() {
    previousFocus = document.activeElement;
    panel.classList.add('open');
    document.body.classList.add('assistant-open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    input.focus({preventScroll:true});
  }
  function closeAssistant() {
    panel.classList.remove('open');
    document.body.classList.remove('assistant-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    if (previousFocus?.focus) previousFocus.focus({preventScroll:true});
  }
  launcher.addEventListener('click', () => panel.classList.contains('open') ? closeAssistant() : openAssistant());
  close.addEventListener('click', closeAssistant);
  document.querySelectorAll('[data-open-ai]').forEach((el)=>el.addEventListener('click',openAssistant));
  document.addEventListener('keydown', e => {if(e.key === 'Escape' && panel.classList.contains('open')) closeAssistant();});

  function addMessage(role, text, link = null) {
    const container=document.createElement('div');
    container.className=`assistant-message ${role === 'user' ? 'from-user' : 'from-bot'}`;
    if (role !== 'user') {
      const avatar=document.createElement('div');avatar.className='message-avatar';avatar.textContent='✦';container.append(avatar);
    }
    const content=document.createElement('div');content.className='message-content';
    const caption=document.createElement('span');caption.className='message-caption';caption.textContent=role === 'user' ? 'YOU' : 'KRISHNA AI · PORTFOLIO';
    const paragraph=document.createElement('p');paragraph.textContent=text;
    content.append(caption,paragraph);
    if(link && /^#[\w-]+$/.test(link.href)){
      const a=document.createElement('a');a.className='message-link';a.href=link.href;a.textContent=link.text;
      a.addEventListener('click',()=>closeAssistant());content.append(a);
    }
    container.append(content);log.append(container);
    log.scrollTop=log.scrollHeight;
    return container;
  }
  function chooseAnswer(query) {
    const normalized=query.toLowerCase().replace(/[^a-z0-9+#\-\/ ]+/g,' ').replace(/\s+/g,' ').trim();
    if (/\b(hi|hello|hey|namaste|namaskar)\b/.test(normalized) && normalized.split(' ').length <=4) return {answer:'Hey! 👋 I’m Krishna’s portfolio guide. Ask me about Terraform, Azure Landing Zones, DevSecOps security, AI agents, projects, or the resume.'};
    const terms=normalized.split(' ').filter(w=>w.length>2);
    const ranked=articles.map(item => {
      let score=0;
      item.terms.forEach(term=>{
        if(normalized.includes(term)) score+=term.includes(' ')? 5:3;
        if(!normalized.includes(term) && term.includes(' ')) {
          const tok=term.split(' ');if(tok.every(t=>terms.includes(t))) score+=2;
        }
      });
      // General FAQs lean into the question's central noun.
      if(item.id==='experience' && /how long|how much experience|how many months/.test(normalized)) score+=10;
      if(item.id==='resume' && /download|view cv|show cv/.test(normalized)) score+=8;
      if(item.id==='contact' && /reach|email|connect/.test(normalized)) score+=8;
      if(item.id==='projects' && /what did|which project|show projects/.test(normalized)) score+=6;
      if(item.id==='cloud' && /how many clouds|cloud provider/.test(normalized)) score+=6;
      return {item,score};
    }).sort((a,b)=>b.score-a.score);
    if (ranked[0].score >=3) {lastArticle=ranked[0].item;return ranked[0].item;}
    if(lastArticle && /^(and|what about|more|tell me more|explain|how|why)\b/.test(normalized)) return lastArticle;
    return {answer:'I can answer questions grounded in Krishna’s published resume—his Terraform work, Azure architecture, DevSecOps practices, AI-assisted workflows, internship experience, and projects. Try asking something specific, like “How does Krishna use Terraform?” or “Show the resume.”'};
  }

  function indicateTyping() {
    const node=addMessage('bot','Thinking through the portfolio…');
    node.setAttribute('aria-label','Assistant is preparing a response');
    return node;
  }
  async function askLive(messages) {
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),13000);
    try{
      const res=await fetch(liveEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:messages.slice(-6)}),signal:controller.signal});
      if(!res.ok) throw new Error(`Service ${res.status}`);
      const data=await res.json();
      if(typeof data.reply!=='string'||!data.reply.trim())throw new Error('Empty response');
      return data.reply.slice(0,1400);
    }finally{clearTimeout(timeout);}
  }
  async function ask(text){
    const question=text.trim().slice(0,450);
    if(!question||isBusy)return;
    isBusy=true;send.disabled=true;input.value='';
    suggestions.hidden=true;addMessage('user',question);
    history.push({role:'user',content:question});
    const typing=indicateTyping();
    let result;
    try{
      if(liveEndpoint){
        const answer=await askLive(history);
        result={answer};
      }else{
        await new Promise(resolve=>setTimeout(resolve,220));
        result=chooseAnswer(question);
      }
    }catch(err){
      const fallback=chooseAnswer(question);
      result={answer:`Live AI is unavailable right now, so here's a resume-grounded answer:\n\n${fallback.answer}`,link:fallback.link};
    }
    typing.remove();
    addMessage('bot',result.answer,result.link);
    history.push({role:'assistant',content:result.answer});
    if(history.length>8)history.splice(0,history.length-8);
    suggestions.hidden=false;isBusy=false;send.disabled=false;input.focus({preventScroll:true});
  }
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
  suggestions.addEventListener('click',e=>{
    const button=e.target.closest('button[data-question]');
    if(button)ask(button.dataset.question);
  });
})();
