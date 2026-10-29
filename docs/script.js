'use strict';


const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progressBar = document.getElementById('scroll-progress');
let scrollScheduled = false;
function syncScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
  progressBar.style.width = `${percent}%`;
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) { window.requestAnimationFrame(syncScroll); scrollScheduled = true; }
}, {passive:true});
window.addEventListener('resize', syncScroll, {passive:true});
syncScroll();

const revealNodes = document.querySelectorAll('[data-reveal]');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  }, {threshold:0.09, rootMargin:'0px 0px 25px 0px'});
  revealNodes.forEach((node) => observer.observe(node));
} else revealNodes.forEach((node) => node.classList.add('visible'));

const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-links');
function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 670) closeMenu(); }, {passive:true});

const copyButton = document.getElementById('copy-mail');
const defaultText = copyButton.innerHTML;
let resetTimer;
copyButton.addEventListener('click', async () => {
  const value = copyButton.dataset.email;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(value);
    copyButton.textContent = 'Email copied ✓';
  } catch (_error) {
    copyButton.textContent = 'Select email to copy';
    window.location.href = `mailto:${value}`;
  }
  window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => {copyButton.innerHTML = defaultText;}, 2300);
});

document.getElementById('year').textContent = String(new Date().getFullYear());

// Resume gallery (rendered from the attached reference PDF).
const resumePreview = document.getElementById('resume-preview');
const resumeButtons = document.querySelectorAll('[data-resume-page]');
resumeButtons.forEach((button) => button.addEventListener('click', () => {
  const page = Number(button.dataset.resumePage);
  if (![1,2].includes(page) || !resumePreview) return;
  resumeButtons.forEach((item) => {
    const current = item === button;
    item.classList.toggle('active', current);
    item.setAttribute('aria-pressed', String(current));
  });
  resumePreview.classList.add('loading');
  const next = `assets/resume-page-${page}.png`;
  const prefetch = new Image();
  prefetch.onload = () => {
    resumePreview.src = next;
    resumePreview.alt = `Page ${page} of Krishna Sharma's DevOps and DevSecOps resume`;
    resumePreview.classList.remove('loading');
  };
  prefetch.onerror = () => resumePreview.classList.remove('loading');
  prefetch.src = next;
}));
