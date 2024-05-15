// Insira esse arquivo em javascripts/components
import ProductPurchase from '../components/productPurchase';
import LoggedIn from '../common/loggedIn';

const InfinityScroll = {
  params: window._pagination,
  priceProds: {
    selector: '[data-update-price]',
    attr: 'update-price',
  },
  elementsWrapper: document.querySelectorAll('.section-list-products, .blog')[0],
  elementWrapper: document.querySelectorAll('.list-products, .list-posts')[0],
  element: '',
  button: document.querySelector('[data-load-more]'),

  stopLoading: function () {
    const button = this.button;

    if (button != null) button.parentElement.removeChild(button);
  },

  setCurrentPage: function (_number) {
    const totalPages = this.params.totalPages;

    if (_number <= totalPages) {
      this.params.currentPage = _number;

      if (this.params.currentPage >= totalPages) this.stopLoading();

      if (_number < totalPages) return (this.params.nextUrl = this.params.pages[_number].url);
    }
  },

  setScript: function (script) {
    const newScript = document.createElement('script');
    newScript.innerText = script.innerText;
    return document.body.appendChild(newScript);
  },

  loadElements: async function () {
    const nextUrl = this.params.nextUrl;
    const response = await fetch(nextUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    // Busca por scripts para compra rápida
    const scripts = doc.querySelectorAll('[data-product-variants]');
    scripts.length > 0 && scripts.forEach((script) => this.setScript(script));

    return doc.querySelectorAll('.product-block, .post-block');
  },

  updatePrice: function () {
    if (window.Vnda.Component.Price) window.Vnda.Component.Price.update();
  },

  getNextPage: async function () {
    const currentPage = this.params.currentPage;
    const wrapper = this.elementWrapper;
    const elementWrapper = this.elementWrapper;
    const button = this.button;

    if (!wrapper.classList.contains('-searching')) {
      wrapper.classList.add('-searching');
      button.classList.add('-searching');

      const newElements = await this.loadElements();

      newElements.forEach((element) => elementWrapper.appendChild(element));

      this.setCurrentPage(currentPage + 1);

      if (document.querySelector('.product-block')) {
        ProductPurchase.init(true);
        this.updatePrice(currentPage + 1);
      }

      window.lazyLoadInstance && window.lazyLoadInstance.update();

      wrapper.classList.remove('-searching');
      button.classList.remove('-searching');
    }

    LoggedIn.init();
  },

  updateBlogPagination: function () {
    let infoToReplace = 'blog?';

    if (window.location.href.includes('categories=')) {
      const categoryParams = window.location.href.split('blog?')[1];
      infoToReplace = `blog?${categoryParams}&`;
    }

    this.params = JSON.parse(
      JSON.stringify(this.params).replaceAll('cockpit?', infoToReplace).replaceAll('cockpit', 'blog')
    );
  },

  init: function () {
    const params = this.params;
    const button = this.button;

    if (typeof params != 'undefined') {
      //Atualiza URLs da paginação do blog
      window.location.href.includes('m/blog') && this.updateBlogPagination();

      if (button != null) {
        button.addEventListener(
          'click',
          () => {
            this.getNextPage();
          },
          { passive: true }
        );
      }
    }
  },
};

export default InfinityScroll;
