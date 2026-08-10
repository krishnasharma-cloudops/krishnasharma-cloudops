// V14 Krishna AI Copilot — advanced local, resume-grounded assistant for GitHub Pages.
(()=>{
  const panel=document.querySelector('#portfolioBot'),toggle=document.querySelector('#botToggle'),close=document.querySelector('#botClose'),
        form=document.querySelector('#botForm'),input=document.querySelector('#botInput'),messages=document.querySelector('#botMessages'),
        status=document.querySelector('#botStatusText');
  if(!panel||!toggle||!form||!input||!messages)return;

  const KB={
    profile:"Krishna Sharma is a DevSecOps Engineer focused on Cloud & AI Automation with 3.5+ years of experience across Microsoft Azure, AWS and GCP. His portfolio combines Infrastructure as Code, CI/CD, Kubernetes, security automation and AI-assisted DevOps.",
    devsecops:"DevSecOps strengths include secure CI/CD, infrastructure security scanning, SAST, secret scanning, vulnerability detection, RBAC/IAM, Microsoft Entra ID, OAuth 2.0, Azure Policy, Defender for Cloud and security automation.",
    ai:"AI tooling in the resume includes Large Language Models (LLMs), Generative AI, Prompt Engineering, AI coding assistants, Antigravity, MCP, LLM tool integration and AI-assisted DevOps workflows.",
    antigravity:"Antigravity is listed as an AI developer tool / AI coding assistant in Krishna's resume. The portfolio positions it inside AI-assisted DevOps workflows for analysis, scripting, documentation and developer productivity.",
    llm:"Krishna uses LLM-assisted workflows for Terraform configuration analysis, YAML pipeline generation, troubleshooting, scripting, technical documentation and infrastructure automation.",
    mcp:"MCP (Model Context Protocol) is explored as a bridge that lets LLM-based tools connect with DevOps workflows, external tools and infrastructure context.",
    cloud:"Cloud experience spans Microsoft Azure, AWS and GCP. Azure work includes VMs, VNets, subnets, NSGs, Load Balancer, App Services, SQL Database, Storage, Key Vault, Bastion, Firewall and Azure Monitor.",
    terraform:"Terraform is a core IaC skill: HCL, reusable modules, remote backends, state management, workspaces and state locking, used for repeatable cloud provisioning.",
    kubernetes:"Container work includes Docker, Kubernetes, AKS/EKS and registry workflows with ACR/ECR. The portfolio emphasizes containerized deployment and orchestration.",
    cicd:"CI/CD experience includes Azure DevOps Pipelines, GitHub Actions, YAML pipelines and automated build, test and deployment across Development, QA, UAT, IAT and Production.",
    monitoring:"Monitoring and logging tools include Prometheus, Grafana, Azure Monitor, Log Analytics, CloudWatch, CloudTrail and Application Insights.",
    networking:"Networking experience includes VNets, subnets, NSGs, Load Balancers, VNet Peering, VPN Gateway, DNS and Hub-and-Spoke architecture.",
    experience:"Current resume: DevOps Engineer at One Click Insurer Web Aggregator Pvt. Ltd. from June 2024 to Present. Earlier: Azadpay Technology Pvt. Ltd., Cloud Engineer from March 2023 to June 2024, with progression through Associate Cloud Engineer and Senior Cloud Engineer.",
    projects:"Key projects: Cloud Infrastructure Automation using Terraform; CI/CD Pipeline Automation; Docker & Kubernetes Containerization; Secure Cloud Networking & Identity Management; and AI-Powered DevSecOps & LLM Automation.",
    aiProject:"The AI-Powered DevSecOps & LLM Automation project uses LLMs, AI tools, MCP, Python, Terraform, Azure DevOps, GitHub Actions, YAML and DevSecOps. It focuses on infrastructure analysis, CI/CD troubleshooting, automation, documentation and reducing repetitive operational work.",
    contact:"Email: krishna.sharma.cloud.ops@gmail.com. LinkedIn and GitHub are available from the portfolio navigation/contact area and resume.",
    education:"Bachelor of Technology in Computer Science (B.Tech-CS), ISBM University, 2019–2023."
  };

  const interview=[
    "How would you design a secure Terraform workflow with remote state, state locking and secret scanning?",
    "Explain a multi-stage Azure DevOps or GitHub Actions pipeline from build to production.",
    "How would you troubleshoot a Kubernetes deployment that is healthy in staging but failing in production?",
    "How do RBAC, Microsoft Entra ID, managed identities and Key Vault fit together?",
    "Where can LLM + MCP improve DevOps workflows without giving AI unsafe infrastructure access?"
  ];

  function intent(q){
    const t=q.toLowerCase();
    if(/30 second|recruiter|summary|introduce|about krishna|profile/.test(t))return 'summary';
    if(/interview|question|prepare/.test(t))return 'interview';
    if(/strongest|best project|project highlight/.test(t))return 'bestProjects';
    if(/compare.*devsec|devsec.*ai|ai.*devsec/.test(t))return 'compare';
    if(/antigravity|anti gravity/.test(t))return 'antigravity';
    if(/mcp|model context/.test(t))return 'mcp';
    if(/llm|generative|prompt/.test(t))return 'llm';
    if(/devsec|sast|secret|vulnerab|security/.test(t))return 'devsecops';
    if(/terraform|iac|infrastructure as code/.test(t))return 'terraform';
    if(/kubernetes|docker|aks|eks|container/.test(t))return 'kubernetes';
    if(/pipeline|ci\/cd|github action|azure devops/.test(t))return 'cicd';
    if(/monitor|grafana|prometheus|cloudwatch|logging/.test(t))return 'monitoring';
    if(/network|vnet|subnet|hub|peering|vpn/.test(t))return 'networking';
    if(/azure|aws|gcp|multi.?cloud|cloud/.test(t))return 'cloud';
    if(/experience|company|job|work|role/.test(t))return 'experience';
    if(/project/.test(t))return 'projects';
    if(/education|degree|university/.test(t))return 'education';
    if(/contact|email|linkedin|github/.test(t))return 'contact';
    if(/resume|cv/.test(t))return 'resume';
    return 'fallback';
  }

  function answer(q){
    const i=intent(q);
    if(i==='summary')return `${KB.profile} He is strongest at connecting Terraform-based cloud automation, CI/CD, Kubernetes and security controls, with emerging AI-assisted workflows using LLMs and MCP.`;
    if(i==='interview')return "Here are five portfolio-relevant interview questions:\n• "+interview.join("\n• ");
    if(i==='bestProjects')return `The strongest story is the combination of ${KB.projects} The most differentiated project is AI-Powered DevSecOps & LLM Automation because it connects AI tooling with real Terraform/YAML/CI-CD troubleshooting and automation.`;
    if(i==='compare')return `DevSecOps side: ${KB.devsecops}\n\nAI side: ${KB.ai}\n\nThe bridge between them is AI-assisted analysis of Terraform/YAML, troubleshooting and MCP-based tool integration — while security controls still govern access and delivery.`;
    if(i==='resume')return "You can open the PDF resume from the Resume button in the navigation or hero section. I can also summarize any section of the resume here.";
    if(KB[i])return KB[i];
    return "I can answer resume-grounded questions about Krishna's DevSecOps work, Azure/AWS/GCP, Terraform, Kubernetes, CI/CD, security, observability, LLM, MCP, Antigravity, projects, experience, education and contact details. Try asking: “Give me a recruiter summary” or “How does LLM + MCP fit into DevSecOps?”";
  }

  function addMessage(text,user=false){
    const d=document.createElement('div');d.className='bot-msg '+(user?'bot-user':'bot-ai');
    text.split('\n').forEach((line,idx)=>{if(idx)d.appendChild(document.createElement('br'));d.appendChild(document.createTextNode(line))});
    messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d;
  }
  function thinking(){
    const d=document.createElement('div');d.className='bot-msg bot-ai bot-thinking';d.innerHTML='<i></i><i></i><i></i><span>Analyzing portfolio knowledge…</span>';messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d;
  }
  function ask(q){
    q=q.trim();if(!q)return;addMessage(q,true);input.value='';status&&(status.textContent='RETRIEVING RESUME-GROUNDED CONTEXT…');const th=thinking();
    setTimeout(()=>{th.remove();addMessage(answer(q));status&&(status.textContent='KNOWLEDGE GRAPH READY · LOCAL / GITHUB PAGES SAFE')},360);
  }
  function open(){panel.classList.add('open');panel.setAttribute('aria-hidden','false');setTimeout(()=>input.focus(),100)}
  function hide(){panel.classList.remove('open');panel.setAttribute('aria-hidden','true')}
  toggle.addEventListener('click',()=>panel.classList.contains('open')?hide():open());close?.addEventListener('click',hide);
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value)});
  document.querySelectorAll('.bot-quick button').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.q||b.textContent)));
  document.querySelectorAll('[data-bot-action]').forEach(b=>b.addEventListener('click',()=>{
    const a=b.dataset.botAction;
    if(a==='resume'){document.querySelector('.resume-trigger')?.click();hide();return}
    document.querySelector('#'+a)?.scrollIntoView({behavior:'smooth',block:'start'});hide();
  }));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
})();
