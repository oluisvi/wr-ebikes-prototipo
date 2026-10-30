(() => {
  const body = document.body;
  const chooser = document.querySelector('.design-control');
  const trigger = document.getElementById('design-trigger');
  const optionPanel = document.getElementById('design-options');
  const currentLabel = document.getElementById('design-current');
  const status = document.getElementById('design-status');
  const designNames = { rota: 'Rota', performance: 'Performance', oficina: 'Oficina' };
  const options = [...document.querySelectorAll('.design-option')];

  function setDesign(name) {
    if (!designNames[name]) return;
    body.dataset.design = name;
    currentLabel.textContent = designNames[name];
    status.textContent = 'Protótipo · visual ' + designNames[name] + ' · identidade WR E-Bikes';
    options.forEach((option) => {
      const selected = option.dataset.design === name;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    trigger.setAttribute('aria-label', 'Visual atual: ' + designNames[name] + '. Escolher outro design');
  }

  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    optionPanel.hidden = expanded;
  });
  options.forEach((option) => option.addEventListener('click', () => {
    setDesign(option.dataset.design);
    trigger.setAttribute('aria-expanded', 'false');
    optionPanel.hidden = true;
    trigger.focus();
  }));
  document.addEventListener('click', (event) => {
    if (!chooser.contains(event.target)) {
      trigger.setAttribute('aria-expanded', 'false');
      optionPanel.hidden = true;
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      trigger.setAttribute('aria-expanded', 'false');
      optionPanel.hidden = true;
      trigger.focus();
    }
  });

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const cards = [...document.querySelectorAll('.product-card')];
  const search = document.getElementById('model-search');
  const resultCount = document.getElementById('result-count');
  let activeFilter = 'todos';
  function updateCatalog() {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = activeFilter === 'todos' || card.dataset.category === activeFilter;
      const matchesSearch = !query || (card.dataset.name + ' ' + card.textContent).toLocaleLowerCase('pt-BR').includes(query);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
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
    updateCatalog();
  }));
  search.addEventListener('input', updateCatalog);

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
  setDesign(body.dataset.design);
})();
