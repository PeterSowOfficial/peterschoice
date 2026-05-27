/**
 * petersow.com — Language Switcher
 * Supports: EN · TH · ZH
 * Usage: add data-en="..." data-th="..." data-zh="..." to any element
 * Lang preference saved to localStorage
 */

const LANGS = {
  en: { label: 'EN', flag: '🇬🇧' },
  th: { label: 'TH', flag: '🇹🇭' },
  zh: { label: 'ZH', flag: '🇨🇳' },
};

let currentLang = localStorage.getItem('ps_lang') || 'th';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('ps_lang', lang);

  // Update all translatable elements (skip .no-translate and their descendants)
  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.closest('.no-translate')) return;
    const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else {
      el.innerHTML = text;
    }
  });

  // Handle blog post .post-lang blocks (show/hide by data-lang attribute)
  document.querySelectorAll('.post-lang').forEach(el => {
    el.style.display = el.dataset.lang === lang ? '' : 'none';
  });

  // Update active state on toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

  // Notify other scripts (e.g. blog content switcher)
  window.dispatchEvent(new CustomEvent('ps-lang-change', { detail: { lang } }));
}

function buildToggle() {
  const style = document.createElement('style');
  style.textContent = [
    '.lang-widget{position:fixed;bottom:1.5rem;right:1.5rem;z-index:999}',
    '.lang-toggle{display:flex;flex-direction:column;gap:0;border:1px solid rgba(191,155,48,.5);overflow:hidden}',
    '.lang-btn{display:flex;align-items:center;justify-content:center;background:rgba(8,8,8,.92);border:none;border-bottom:1px solid rgba(191,155,48,.2);cursor:pointer;padding:8px 10px;transition:background .2s;}',
    '.lang-btn:last-child{border-bottom:none}',
    '.lang-btn:hover{background:rgba(191,155,48,.12)}',
    '.lang-btn.active{background:rgba(191,155,48,.2)}',
    '.lang-flag{font-size:18px;display:block;line-height:1}',
  ].join('');
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.className = 'lang-widget';
  widget.innerHTML = [
    '<div class="lang-toggle">',
    Object.entries(LANGS).map(([code, info]) =>
      '<button class="lang-btn' + (currentLang === code ? ' active' : '') + '" data-lang="' + code + '" title="' + info.label + '"><span class="lang-flag">' + info.flag + '</span></button>'
    ).join(''),
    '</div>',
  ].join('');

  widget.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  document.body.appendChild(widget);
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  buildToggle();
  applyLang(currentLang);
});
