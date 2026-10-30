'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#current-year').textContent = new Date().getFullYear();

// Subtle pointer spotlight is purely decorative and never intercepts input.
if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const spotlight = $('#spotlight');
  document.addEventListener('pointermove', event => {
    spotlight.style.setProperty('--mx', `${event.clientX}px`);
    spotlight.style.setProperty('--my', `${event.clientY}px`);
  }, { passive: true });
}

// Low-cost reading progress.
const progress = $('#reading-bar');
let scrollTicking = false;
function updateProgress() {
  const remaining = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${remaining > 0 ? Math.max(0, Math.min(100, window.scrollY / remaining * 100)) : 0}%`;
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(updateProgress);
  }
}, {passive: true});
window.addEventListener('resize', updateProgress, {passive: true});
updateProgress();

// Reveal on scroll, respect motion preferences and non-supporting browsers.
const revealItems = $$('[data-reveal]');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: .06, rootMargin: '0px 0px 60px 0px'});
  revealItems.forEach(item => revealObserver.observe(item));
} else revealItems.forEach(item => item.classList.add('visible'));

// Mobile navigation.
const toggle = $('#mobile-toggle');
const navLinks = $('#nav-links');
function closeNav() {
  navLinks.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}
toggle.addEventListener('click', () => {
  const open = !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('a', navLinks).forEach(link => link.addEventListener('click', closeNav));
window.addEventListener('resize', () => { if (window.innerWidth > 950) closeNav(); });

// Case studies are grounded in the latest provided two-page resume.
const projectData = [
  {
    label: '01 / CLOUD ARCHITECTURE',
    title: 'Azure Landing Zone & Hub-and-Spoke Architecture',
    lead: 'Designed and deployed Azure Landing Zone infrastructure and Hub-and-Spoke Network Architecture using Terraform-based Infrastructure as Code.',
    points: [
      'Used modular Terraform configurations to structure Azure landing zone and networking resources.',
      'Supported automated Azure infrastructure provisioning and organized cloud network deployments.',
      'Worked with Azure networking concepts including VNets, network security groups, access control and peering.'
    ],
    stack: ['Terraform', 'Microsoft Azure', 'Azure Networking', 'IaC', 'VNet / NSG']
  },
  {
    label: '02 / MULTI-CLOUD IAC',
    title: 'Multi-Cloud Infrastructure Automation',
    lead: 'Automated cloud infrastructure provisioning across Microsoft Azure, AWS, and GCP through HashiCorp Terraform.',
    points: [
      'Developed reusable Terraform modules to support deployments across different cloud environments.',
      'Incorporated remote backend configurations, state management and state locking.',
      'Applied Infrastructure as Code and HCL to maintain repeatable multi-environment infrastructure definitions.'
    ],
    stack: ['Terraform', 'Azure', 'AWS', 'GCP', 'HCL', 'Remote State']
  },
  {
    label: '03 / SECURE DELIVERY',
    title: 'Terraform CI/CD & DevSecOps Automation',
    lead: 'Built Azure DevOps YAML-based CI/CD pipelines to automate Terraform validation, infrastructure planning and deployment workflows.',
    points: [
      'Used Azure DevOps YAML pipelines and GitHub Actions in infrastructure automation workflows.',
      'Incorporated tfsec, TFLint and SonarQube into validation and security analysis practices.',
      'Supported configuration checks, quality analysis, and reviewable infrastructure changes.'
    ],
    stack: ['Azure DevOps', 'GitHub Actions', 'Terraform', 'tfsec', 'TFLint', 'SonarQube', 'Azure Key Vault']
  },
  {
    label: '04 / INTELLIGENT AUTOMATION',
    title: 'AI-Assisted DevOps & Infrastructure Automation',
    lead: 'Used Google Antigravity and AI agents to assist with Terraform development, configuration refinement, infrastructure troubleshooting and pipeline debugging.',
    points: [
      'Leveraged AI assistance to generate and refine Terraform infrastructure configuration.',
      'Used AI agents to help identify infrastructure configuration errors and support troubleshooting workflows.',
      'Applied AI-assisted processes to create, review and debug Azure DevOps YAML pipelines.'
    ],
    stack: ['Google Antigravity', 'AI Agents', 'Terraform', 'Azure DevOps']
  },
  {
    label: '05 / FINOPS',
    title: 'Infrastructure Cost Analysis & FinOps',
    lead: 'Applied infrastructure cost tools to improve visibility into potential Terraform deployment expenses and cloud-native resource costs.',
    points: [
      'Used Infracost to estimate cloud infrastructure costs from Terraform configurations.',
      'Analyzed potential cost implications of infrastructure changes.',
      'Worked with OpenCost for cloud-native cost analysis and infrastructure cost visibility.'
    ],
    stack: ['Infracost', 'OpenCost', 'Terraform', 'FinOps']
  }
];

const projectBackdrop = $('#project-backdrop');
const projectDialog = $('.project-dialog');
const projectClose = $('#dialog-close');
let lastProjectTrigger = null;
function openProject(index, trigger) {
  const data = projectData[index];
  if (!data) return;
  lastProjectTrigger = trigger;
  $('#dialog-kicker').textContent = data.label;
  $('#dialog-title').textContent = data.title;
  $('#dialog-lead').textContent = data.lead;
  const points = $('#dialog-points');
  points.replaceChildren(...data.points.map(point => {
    const li = document.createElement('li');
    li.textContent = point;
    return li;
  }));
  const tags = $('#dialog-tags');
  tags.replaceChildren(...data.stack.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  projectBackdrop.hidden = false;
  document.body.classList.add('dialog-open');
  projectDialog.focus();
}
function closeProject() {
  if (projectBackdrop.hidden) return;
  projectBackdrop.hidden = true;
  document.body.classList.remove('dialog-open');
  lastProjectTrigger?.focus();
}
$$('[data-project]').forEach(item => item.addEventListener('click', () => openProject(Number(item.dataset.project), item)));
projectClose.addEventListener('click', closeProject);
projectBackdrop.addEventListener('click', event => { if (event.target === projectBackdrop) closeProject(); });

// Architecture tabs.
const archNames = {azure: 'azure-network.arch', pipeline: 'secure-pipeline.arch', cloud: 'multicloud-iac.arch'};
$$('.arch-tab').forEach(button => button.addEventListener('click', () => {
  const type = button.dataset.tab;
  $$('.arch-tab').forEach(tab => {
    const active = tab === button;
    tab.classList.toggle('selected', active);
    tab.setAttribute('aria-selected', String(active));
  });
  $$('.arch-panel').forEach(panel => {
    const active = panel.id === `panel-${type}`;
    panel.hidden = !active;
    panel.classList.toggle('selected', active);
  });
  $('#arch-filename').textContent = archNames[type];
}));

// Simulated terminal: representative sequences, not a real execution log.
const terminalExamples = {
  plan: [
    ['cmd', '$ terraform init'],
    ['ok', '✓ Backend configuration initialized'],
    ['', ''],
    ['cmd', '$ terraform fmt -check'],
    ['ok', '✓ Configuration formatting checked'],
    ['', ''],
    ['cmd', '$ terraform validate'],
    ['ok', '✓ Configuration is syntactically valid'],
    ['', ''],
    ['cmd', '$ terraform plan'],
    ['note', '# Review the proposed infrastructure changes'],
    ['key', '→ Human approval before apply']
  ],
  security: [
    ['cmd', '$ tflint'],
    ['note', '# Check Terraform configuration conventions'],
    ['', ''],
    ['cmd', '$ tfsec .'],
    ['note', '# Scan Infrastructure as Code for issues'],
    ['', ''],
    ['cmd', '$ sonar-scanner'],
    ['note', '# Inspect code-quality findings'],
    ['', ''],
    ['ok', '✓ Review the tool findings'],
    ['key', '→ Address identified issues before deployment']
  ],
  cost: [
    ['cmd', '$ terraform plan -out=tfplan'],
    ['note', '# Produce an infrastructure plan'],
    ['', ''],
    ['cmd', '$ infracost breakdown --path .'],
    ['note', '# Estimate cloud resource cost implications'],
    ['', ''],
    ['cmd', '$ infracost diff --path .'],
    ['note', '# Compare possible infrastructure cost changes'],
    ['', ''],
    ['key', '→ Review cost changes alongside technical impact']
  ]
};
function renderTerminal(type) {
  const output = $('#terminal-output');
  output.replaceChildren();
  terminalExamples[type].forEach(([kind, text]) => {
    const node = document.createElement('span');
    if (kind) node.className = kind;
    node.textContent = text + '\n';
    output.appendChild(node);
  });
  $$('.preset').forEach(btn => btn.classList.toggle('active', btn.dataset.run === type));
}
$$('.preset').forEach(btn => btn.addEventListener('click', () => renderTerminal(btn.dataset.run)));
renderTerminal('plan');

// Two-page original PDF preview.
const preview = $('#resume-image');
$$('[data-page]').forEach(button => button.addEventListener('click', () => {
  const page = Number(button.dataset.page);
  if (![1, 2].includes(page)) return;
  $$('.resume-pagination button').forEach(btn => {
    const active = btn === button;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  preview.classList.add('changing');
  const next = `assets/resume-page-${page}.webp`;
  const image = new Image();
  image.onload = () => {
    preview.src = next;
    preview.alt = `Page ${page} of Krishna Sharma's original resume`;
    preview.classList.remove('changing');
  };
  image.onerror = () => preview.classList.remove('changing');
  image.src = next;
}));

// Quick command / section navigation (Ctrl/Cmd+K).
const jumpItems = [
  ['Home / intro', '#top'], ['About Krishna', '#about'],
  ['Projects / case studies', '#work'], ['Architecture explorer', '#architecture'],
  ['Technology expertise', '#expertise'], ['Terraform workflow', '#workflow'],
  ['Professional experience', '#journey'], ['Resume / download', '#resume'],
  ['Contact / email', '#contact']
];
const commandBackdrop = $('#command-backdrop');
const commandInput = $('#command-input');
let lastCommandTrigger = null;
function renderCommandResults(query = '') {
  const filtered = jumpItems.filter(item => item[0].toLowerCase().includes(query.toLowerCase().trim()));
  const list = $('#command-results');
  list.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No matching sections. Try "projects", "resume", or "contact".';
    list.appendChild(empty);
    return;
  }
  filtered.forEach(([title, hash]) => {
    const button = document.createElement('button');
    button.type = 'button';
    const label = document.createElement('span');
    label.textContent = title;
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    button.append(label, arrow);
    button.addEventListener('click', () => {
      closeCommand();
      $(hash)?.scrollIntoView({behavior: reducedMotion ? 'instant' : 'smooth'});
      if (window.history?.replaceState) history.replaceState(null, '', hash);
    });
    list.appendChild(button);
  });
}
function openCommand(trigger) {
  if (!projectBackdrop.hidden) closeProject();
  lastCommandTrigger = trigger || $('#command-launch');
  commandBackdrop.hidden = false;
  commandInput.value = '';
  document.body.classList.add('dialog-open');
  renderCommandResults();
  commandInput.focus();
}
function closeCommand() {
  if (commandBackdrop.hidden) return;
  commandBackdrop.hidden = true;
  document.body.classList.remove('dialog-open');
  lastCommandTrigger?.focus();
}
$('#command-launch').addEventListener('click', event => openCommand(event.currentTarget));
commandInput.addEventListener('input', () => renderCommandResults(commandInput.value));
commandBackdrop.addEventListener('click', event => { if (event.target === commandBackdrop) closeCommand(); });
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    commandBackdrop.hidden ? openCommand() : closeCommand();
  }
  if (event.key === 'Escape') {
    closeProject(); closeCommand(); closeNav(); closeChat();
  }
  if (event.key === 'Tab' && !projectBackdrop.hidden) {
    const active = document.activeElement;
    const allowed = $$('a, button', projectDialog);
    if (allowed.length && (event.shiftKey && active === allowed[0] || !event.shiftKey && active === allowed[allowed.length - 1])) {
      event.preventDefault();
      (event.shiftKey ? allowed[allowed.length - 1] : allowed[0]).focus();
    }
  }
});

// Contact copy: clipboard only when permitted; no tracking.
const copyButton = $('#copy-email');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('krishna.sharma.cloud.ops@gmail.com');
    copyButton.textContent = 'Email copied ✓';
  } catch {
    copyButton.textContent = 'Use email link below ↗';
  }
  window.setTimeout(() => {copyButton.innerHTML = 'Copy email <span>⧉</span>';}, 2500);
});

// Local FAQ assistant: no network calls, no external API, no private user data persistence.
const chatTrigger = $('#chat-trigger');
const chatPanel = $('#chat-panel');
const chatInput = $('#chat-input');
function openChat() {
  chatPanel.hidden = false;
  chatTrigger.setAttribute('aria-expanded', 'true');
  chatInput.focus();
}
function closeChat() {
  if (chatPanel.hidden) return;
  chatPanel.hidden = true;
  chatTrigger.setAttribute('aria-expanded', 'false');
  chatTrigger.focus();
}
chatTrigger.addEventListener('click', () => chatPanel.hidden ? openChat() : closeChat());
$('#chat-close').addEventListener('click', closeChat);
const qa = [
  {words: ['contact', 'email', 'phone', 'call', 'linkedin', 'reach', 'hire', 'connect'], reply: 'You can contact Krishna at krishna.sharma.cloud.ops@gmail.com or +91 93682 19108. His LinkedIn is linkedin.com/in/krishna-sharma-42110229a/ and GitHub is github.com/krishnasharma-cloudops. The Contact section has direct links.'},
  {words: ['terraform', 'iac', 'infrastructure as code', 'hcl', 'module', 'state', 'backend'], reply: 'Terraform is Krishna’s core specialization. His resume covers reusable modules, remote state, state locking, backend configurations, workspaces, lifecycle management and multi-environment provisioning across Azure, AWS and GCP.'},
  {words: ['azure', 'landing zone', 'hub', 'spoke', 'vnet', 'network', 'cloud architect'], reply: 'Krishna has worked with Microsoft Azure Landing Zones, Hub-and-Spoke Network Architecture, VNets, NSGs, RBAC, Key Vault and VNet peering. His Azure Landing Zone project uses modular Terraform configurations for structured cloud network deployment.'},
  {words: ['security', 'devsecops', 'tfsec', 'tflint', 'sonarqube', 'scan'], reply: 'Krishna’s DevSecOps toolkit includes tfsec, TFLint and SonarQube. In his internship projects he applied security scanning, Terraform validation and static code quality checks to infrastructure workflows.'},
  {words: ['pipeline', 'ci/cd', 'cicd', 'github actions', 'devops', 'yaml', 'deployment'], reply: 'Krishna has worked with Azure DevOps YAML pipelines and GitHub Actions for Terraform infrastructure validation, planning and deployment workflows. He also uses Git and review-first IaC practices.'},
  {words: ['ai', 'agent', 'antigravity', 'artificial intelligence', 'automation intelligence'], reply: 'Krishna uses Google Antigravity and AI agents to assist Terraform code generation, configuration refinement, infrastructure troubleshooting and Azure DevOps YAML pipeline debugging. AI supports the engineer’s review—it does not replace verification.'},
  {words: ['finops', 'infracost', 'opencost', 'cost', 'budget'], reply: 'For infrastructure cost analysis, Krishna has used Infracost to estimate costs from Terraform configurations and OpenCost to examine cloud-native cost visibility.'},
  {words: ['experience', 'internship', 'davin', 'insider', 'company', 'worked'], reply: 'Krishna has 15 months of internship experience: DevOps & DevSecOps Intern at DevOps Insider (June 2025–June 2026) and DevOps Intern at Davin Technologies (July–October 2026).'},
  {words: ['project', 'portfolio', 'build', 'work sample'], reply: 'His five resume-reported projects are: Azure Landing Zone & Hub-and-Spoke Architecture; Multi-Cloud Infrastructure Automation; Terraform CI/CD & DevSecOps Automation; AI-Assisted DevOps; and Infrastructure Cost Analysis & FinOps. Open any project card for its details.'},
  {words: ['resume', 'cv', 'pdf', 'download'], reply: 'Open the Resume section to view both pages or download Krishna’s source resume PDF. The original document is included in this portfolio.'},
  {words: ['education', 'degree', 'college', 'university', 'graduate', '2027'], reply: 'Krishna is pursuing a B.Tech in Computer Science at ISBM University, Chhattisgarh. His expected graduation is July 2027.'},
  {words: ['linux', 'python', 'java', 'bash', 'powershell', 'programming'], reply: 'His foundation skills include Linux CLI, basic SSH/networking, Bash, PowerShell, Python, Java and C++. Terraform and Azure are his strongest technical focus areas.'},
  {words: ['aws', 'gcp', 'multi cloud'], reply: 'Krishna has worked with Terraform provisioning across Microsoft Azure, AWS and Google Cloud Platform. His resume reports reusable modules, remote state and multi-environment IaC patterns.'}
];
function getAnswer(question) {
  const lower = question.toLowerCase().trim();
  if (!lower) return 'Ask me about Terraform, Azure, projects, experience, resume or contact details.';
  let highest = 0, answer = '';
  qa.forEach(entry => {
    let score = 0;
    entry.words.forEach(word => { if (lower.includes(word)) score += word.length > 7 ? 2 : 1; });
    if (score > highest) { highest = score; answer = entry.reply; }
  });
  if (answer) return answer;
  return 'I’m a resume-based portfolio guide, not a general-purpose generative AI. Try asking about Terraform, Azure, CI/CD, DevSecOps, AI-assisted automation, projects, experience, resume, or contact details.';
}
function postMessage(content, role) {
  const element = document.createElement('div');
  element.className = `chat-line ${role}`;
  element.textContent = content;
  $('#chat-messages').appendChild(element);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
}
function submitQuestion(text) {
  const question = String(text).trim().slice(0, 320);
  if (!question) return;
  if (chatPanel.hidden) openChat();
  postMessage(question, 'user');
  postMessage(getAnswer(question), 'bot');
  chatInput.value = '';
}
$('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  submitQuestion(chatInput.value);
});
$$('[data-question]').forEach(button => button.addEventListener('click', () => submitQuestion(button.dataset.question)));
