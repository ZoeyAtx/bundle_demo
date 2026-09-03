(() => {
  const MAX_BUNDLE = 4;
  const products = [...document.querySelectorAll('[data-bundle-product]')];
  const selectedCount = document.getElementById('selectedCount');
  const bundleStatus = document.getElementById('bundleStatus');
  const progressFill = document.getElementById('progressFill');
  const addBundleCart = document.getElementById('addBundleCart');
  const cartCount = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const modal = document.getElementById('demoModal');
  const closeModal = document.getElementById('closeDemoModal');
  const stayOnDemo = document.getElementById('stayOnDemo');

  let cartItems = 0;
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function bundleTotal() {
    return products.reduce((sum, product) => sum + Number(product.querySelector('[data-count]').textContent), 0);
  }

  function updateBundle() {
    const total = bundleTotal();
    selectedCount.textContent = total;
    progressFill.style.width = `${(total / MAX_BUNDLE) * 100}%`;

    if (total === 0) bundleStatus.textContent = 'Zatím není vybráno žádné';
    else if (total < MAX_BUNDLE) bundleStatus.textContent = `Vyberte ještě ${MAX_BUNDLE - total} ${MAX_BUNDLE - total === 1 ? 'balení' : 'balení'}`;
    else bundleStatus.textContent = 'Balíček je připravený';

    addBundleCart.disabled = total !== MAX_BUNDLE;

    products.forEach(product => {
      const count = Number(product.querySelector('[data-count]').textContent);
      product.querySelector('[data-minus]').disabled = count === 0;
      product.querySelector('[data-plus]').disabled = total >= MAX_BUNDLE;
    });
  }

  products.forEach(product => {
    const countEl = product.querySelector('[data-count]');
    product.querySelector('[data-plus]').addEventListener('click', () => {
      if (bundleTotal() >= MAX_BUNDLE) return;
      countEl.textContent = Number(countEl.textContent) + 1;
      updateBundle();
    });
    product.querySelector('[data-minus]').addEventListener('click', () => {
      const current = Number(countEl.textContent);
      if (current <= 0) return;
      countEl.textContent = current - 1;
      updateBundle();
    });
  });

  addBundleCart.addEventListener('click', () => {
    if (bundleTotal() !== MAX_BUNDLE) return;
    cartItems += 1;
    cartCount.textContent = cartItems;
    showToast('Degustační balíček byl přidán do košíku.');
  });

  document.querySelectorAll('[data-quick-add]').forEach(button => {
    button.addEventListener('click', () => {
      cartItems += 1;
      cartCount.textContent = cartItems;
      showToast('Produkt byl přidán do košíku.');
    });
  });

  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(item => item.classList.toggle('active', item === button));
      document.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === target));
    });
  });

  document.querySelectorAll('.thumb').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach(item => item.classList.toggle('active', item === button));
      const main = document.getElementById('mainPhoto');
      const kind = button.dataset.photo;
      if (kind === 'front') {
        main.style.filter = 'none';
        main.style.transform = 'none';
      } else if (kind === 'beans') {
        main.style.filter = 'sepia(.18) contrast(.96)';
      } else {
        main.style.filter = 'brightness(1.03) saturate(.86)';
      }
    });
  });

  function showDemoModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function hideDemoModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    const demoButton = event.target.closest('[data-demo-link]');
    if (demoButton) {
      event.preventDefault();
      showDemoModal();
      return;
    }
    if (link && link.getAttribute('href') === '#demo-link') {
      event.preventDefault();
      showDemoModal();
    }
  });

  document.querySelectorAll('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      showDemoModal();
    });
  });

  closeModal.addEventListener('click', hideDemoModal);
  stayOnDemo.addEventListener('click', hideDemoModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) hideDemoModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) hideDemoModal();
  });

  updateBundle();
})();
