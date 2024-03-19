const LoggedIn = {
  loggedIn: false,
  productsEl: document.querySelectorAll('[data-product-box]'),
  productPage: document.querySelector('[data-section-product'),
  btnLoadMore: document.querySelector('[data-load-more]'),
  getClient: async function () {
    try {
      let response = await fetch('/conta/cliente', {
        headers: {
          accept: 'application/json',
        },
      });
      let client = await response.json();

      if (Object.keys(client).length > 0) {
        console.info('client', client);
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    } catch (error) {
      console.error(`getClient error`, error);
    }
  },
  handleProductsBlocks: function () {
    const { loggedIn, productsEl } = this;
    productsEl.forEach((productEl) => {
      const buyButton = productEl.querySelector('.button-default');
      const description = productEl.querySelector('.description');
      const priceWrapper = productEl.querySelector('[data-product-price]');
      const linkForLogin = productEl.querySelector('[data-login-for-buy]');

      if (loggedIn) {
        if (description && priceWrapper && linkForLogin && buyButton) {
          description.classList.remove('margin-top-auto');
          priceWrapper.classList.remove('hidden');
          linkForLogin.classList.add('hidden');
          buyButton.classList.remove('disabled');
          buyButton.disabled = false;
        }
      } else {
        if (description && priceWrapper && linkForLogin && buyButton) {
          description.classList.add('margin-top-auto');
          priceWrapper.classList.add('hidden');
          linkForLogin.classList.remove('hidden');
          buyButton.classList.add('disabled');
          buyButton.disabled = true;
        }
      }
    });
  },
  handleProductPage: function () {
    const { loggedIn, productPage } = this;
    if (productPage) {
      const addCartWrapper = productPage.querySelector('[data-product-purchase]');
      const quantitySelector = addCartWrapper.querySelector('.quantity-selector');
      const btnAddCart = addCartWrapper.querySelector('.add-to-cart-button ');
      const linkForLogin = productPage.querySelector('[data-product-page-login-for-buy]');

      if (loggedIn) {
        linkForLogin.classList.add('hidden');
        quantitySelector.classList.remove('hidden');
        btnAddCart.classList.remove('width-100');
        btnAddCart.classList.remove('disabled');
        btnAddCart.disabled = false;
      } else {
        linkForLogin.classList.remove('hidden');
        quantitySelector.classList.add('hidden');
        btnAddCart.classList.add('width-100');
        btnAddCart.classList.add('disabled');
        btnAddCart.disabled = true;
      }
    }
  },
  seeMoreHandler: function () {
    const { btnLoadMore } = this;
    btnLoadMore.addEventListener('click', () => {
      console.log('click');
      this.handleProductsBlocks();
    });
  },
  init: async function () {
    await this.getClient();
    this.handleProductsBlocks();
    this.handleProductPage();
    this.seeMoreHandler();
  },
};

export default LoggedIn;
