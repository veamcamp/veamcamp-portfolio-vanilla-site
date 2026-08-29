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

  // Reveal on scroll using IntersectionObserver with staggered sequencing
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced){
    const observerOptions = {threshold:0.12};
    const seq = [];
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          // staggered reveal by dataset order
          const el = e.target;
          const delay = parseFloat(el.dataset.revealDelay || 0);
          setTimeout(()=>el.classList.add('in-view'), Math.round(delay * 1000));
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el,i)=>{
      // assign a small progressive delay
      el.dataset.revealDelay = Math.min(0.5, i * 0.06);
      obs.observe(el);
    });
  } else {
    // If reduced motion, show everything
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
  }

  // Parallax subtle interaction on hero visual
  const heroVisual = document.querySelector('.hero-visual .pancake');
  if(heroVisual && !prefersReduced){
    document.addEventListener('mousemove', (e)=>{
      const rect = heroVisual.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      heroVisual.style.transform = `rotate(${dx*6 - 3}deg) translateY(${dy*10}px)`;
    });
    document.addEventListener('mouseleave', ()=>heroVisual.style.transform='rotate(-6deg)');
  }

  // Small nav: smooth scrolling for internal links (already handled by scroll-behavior)
})();