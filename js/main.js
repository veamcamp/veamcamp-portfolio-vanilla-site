// Basic interactive behaviors: theme toggle, reveal on scroll, year
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');

  // Init year
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme persistence
  const stored = localStorage.getItem('theme');
  if(stored === 'dark') root.setAttribute('data-theme','dark');
  if(stored === 'light') root.removeAttribute('data-theme');

  toggle.addEventListener('click', ()=>{
    const isDark = root.getAttribute('data-theme') === 'dark';
    if(isDark){
      root.removeAttribute('data-theme');
      localStorage.setItem('theme','light');
      toggle.textContent = '🌙';
    } else {
      root.setAttribute('data-theme','dark');
      localStorage.setItem('theme','dark');
      toggle.textContent = '☀️';
    }
  });

  // Reveal on scroll using IntersectionObserver
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting) e.target.classList.add('in-view');
      });
    },{threshold:0.12});

    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  } else {
    // If reduced motion, show everything
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
  }

  // Small nav: smooth scrolling for internal links (already handled by scroll-behavior)
})();