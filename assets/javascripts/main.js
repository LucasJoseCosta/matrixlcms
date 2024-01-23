import CartDrawer from './common/cartDrawer';
import Footer from './common/footer';
import Header from './common/header';
import MenuMobile from './common/menuMobile';
import Popup from './components/popup';
import Webforms from './common/webforms';
import ProductPurchase from './components/productPurchase.js';
import { NewsletterComponent, PriceComponent } from './components/vndaComponents.js';
import CepLocals from './common/cepLocals.js';

let threshold = 700;
if (window.innerWidth < 768) threshold = 400

window.lazyLoadOptions = {
  elements_selector: ".lazy",
  threshold,
  callback_loaded: (el) => {
    const element = el.closest('.MagicZoom');
    if (element && element.id) {
      MagicZoom && MagicZoom.refresh(element.id);
    }
  },
};

window.addEventListener("LazyLoad::Initialized", event => {
  window.lazyLoadInstance = event.detail.instance
}, { passive: true });

// ==========================================
// Inicialização
// ==========================================
console.log(
  '%cVnda - Tecnologia em Ecommerce',
  'color: #f88d5b; font-size: 15px; font-family: "Verdana", sans-serif; font-weight: bold;'
);

window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 992) {
    MenuMobile.init(); 
  }
  CepLocals.init();
  CartDrawer.init();
  Header.init();
  Footer.init();
  PriceComponent.init();
  Popup.init();
  Webforms.init();
  NewsletterComponent.init();
  ProductPurchase.init();
});
