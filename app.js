(() => {
  const body = document.body;
  const chooser = document.querySelector('.design-control');
  const trigger = document.getElementById('design-trigger');
  const optionPanel = document.getElementById('design-options');
  const currentLabel = document.getElementById('design-current');
  const status = document.getElementById('design-status');
  const designNames = { rota: 'Rota', performance: 'Performance', oficina: 'Oficina' };
  const options = [...document.querySelectorAll('.design-option')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let designSwitchTimer;
  let optionsCloseTimer;

  function setDesign(name, animate = false) {
    if (!designNames[name]) return;
    const apply = () => {
      body.dataset.design = name;
      currentLabel.textContent = designNames[name];
      status.textContent = 'Protótipo · visual ' + designNames[name] + ' · identidade WR E-Bikes';
      options.forEach((option) => {
        const selected = option.dataset.design === name;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      trigger.setAttribute('aria-label', 'Visual atual: ' + designNames[name] + '. Escolher outro design');
    };
    if (!animate || prefersReducedMotion || body.dataset.design === name) {
      apply();
      return;
    }
    window.clearTimeout(designSwitchTimer);
    body.classList.add('design-is-switching');
    designSwitchTimer = window.setTimeout(() => {
      apply();
      window.requestAnimationFrame(() => body.classList.remove('design-is-switching'));
    }, 120);
  }

  function setOptionsOpen(open) {
    window.clearTimeout(optionsCloseTimer);
    trigger.setAttribute('aria-expanded', String(open));
    if (open) {
      optionPanel.hidden = false;
      window.requestAnimationFrame(() => optionPanel.classList.add('is-open'));
      return;
    }
    optionPanel.classList.remove('is-open');
    optionsCloseTimer = window.setTimeout(() => {
      if (trigger.getAttribute('aria-expanded') === 'false') optionPanel.hidden = true;
    }, 210);
  }

  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    setOptionsOpen(!expanded);
  });
  options.forEach((option) => option.addEventListener('click', () => {
    setDesign(option.dataset.design, true);
    setOptionsOpen(false);
    trigger.focus();
  }));
  document.addEventListener('click', (event) => {
    if (!chooser.contains(event.target) && trigger.getAttribute('aria-expanded') === 'true') setOptionsOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      setOptionsOpen(false);
      trigger.focus();
    }
  });

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const cards = [...document.querySelectorAll('.product-card')];
  const search = document.getElementById('model-search');
  const resultCount = document.getElementById('result-count');
  let activeFilter = 'todos';
  function updateCatalog(animate = false) {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = activeFilter === 'todos' || card.dataset.category === activeFilter;
      const matchesSearch = !query || (card.dataset.name + ' ' + card.textContent).toLocaleLowerCase('pt-BR').includes(query);
      const show = matchesCategory && matchesSearch;
      card.dataset.motionTarget = String(show);
      card.getAnimations().forEach((animation) => animation.cancel());
      if (!animate || prefersReducedMotion) {
        card.hidden = !show;
      } else if (show) {
        const wasHidden = card.hidden;
        card.hidden = false;
        if (wasHidden) card.animate([{ opacity: 0, transform: 'translate3d(0,12px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }], { duration: 300, delay: Math.min(visible * 45, 180), easing: 'cubic-bezier(.2,.7,.2,1)' });
      } else if (!card.hidden) {
        const animation = card.animate([{ opacity: 1, transform: 'translate3d(0,0,0)' }, { opacity: 0, transform: 'translate3d(0,8px,0)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
        animation.onfinish = () => { if (card.dataset.motionTarget === 'false') card.hidden = true; };
      }
      if (show) visible += 1;
    });
    resultCount.textContent = visible + ' ' + (visible === 1 ? 'referência' : 'referências');
  }
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    updateCatalog(true);
  }));
  search.addEventListener('input', () => updateCatalog(true));

  document.querySelectorAll('[data-category-link]').forEach((link) => link.addEventListener('click', () => {
    const button = filterButtons.find((item) => item.dataset.filter === link.dataset.categoryLink);
    if (button) button.click();
  }));

  const menuButton = document.querySelector('.mobile-menu');
  const siteNav = document.getElementById('site-nav');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    siteNav.classList.toggle('is-open', !open);
  });
  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  }));

  if (!prefersReducedMotion) {
    document.documentElement.classList.add('motion-ready');
    const revealTargets = [...document.querySelectorAll('main > section:not(.hero), .intro-row, .category-grid, .product-grid')];
    revealTargets.forEach((target) => target.classList.add(target.matches('.category-grid,.product-grid') ? 'motion-stagger' : 'motion-reveal'));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
      revealTargets.forEach((target) => observer.observe(target));
    } else {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
    }
  }

  const toast = document.getElementById('toast');
  const contact = document.getElementById('contact-cta');
  let toastTimer;
  document.querySelectorAll('.product-link, .product-image').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const interest = link.dataset.interest;
    if (!interest) return;
    const message = new URLSearchParams({
      text: 'Olá, vim pelo site da WR E-Bikes. Quero conhecer as opções de ' + interest + '. Pode me orientar?'
    });
    contact.href = 'https://wa.me/5512991419583?' + message.toString();
    toast.textContent = 'Interesse em ' + interest + ' selecionado. O contato está preparado no botão ao final da página.';
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  updateCatalog();
  setDesign(body.dataset.design);
})();
