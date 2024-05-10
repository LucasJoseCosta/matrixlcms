// Insira esse arquivo em javascripts/pages

import Swiper, { Navigation, Pagination, Lazy, Autoplay } from 'swiper';
import InfinityScroll from '../components/infinityScroll';
Swiper.use([Navigation, Pagination, Lazy, Autoplay]);

const Blog = {
  // Percorre as categorias existentes nos posts e insere em tela
  setCategories: async function () {
    const { handleBlogCategories } = Blog;

    const url = new URL(window.location.pathname, window.location.origin)
    url.searchParams.set('fetch', 'all')

    const response = await fetch(url);
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const script = doc.querySelector('[data-script-blog]');

    if (!script) return

    const newScript = document.createElement('script');
    newScript.innerText = script.innerText;
    document.body.appendChild(newScript);

    // Busca categorias dos posts capturados no fetch
    const categories = [];
    window._posts.forEach(post => {
      if (post.categories && post.categories.length > 0) {
        post.categories.forEach(category => {
          if (!categories.includes(category)) categories.push(category)
        })
      }
    })

    if (categories.length === 0) return
    
    const currentCategory = new URLSearchParams(window.location.search).get('categories');

    // Monta categorias na tela
    categories.forEach(category => {
      const linkEl = document.createElement('a')
      linkEl.classList.add('category');
      linkEl.innerText = category

      let url = `${window.location.origin}${window.location.pathname}?categories=${category}`
      if (currentCategory === category) {
        url = `${window.location.origin}${window.location.pathname}`
        linkEl.classList.add('-selected')
      }

      linkEl.setAttribute('href', url);
      linkEl.setAttribute('aria-label', `Acessar os posts da categoria ${category}`);

      document.querySelector('nav.categories').appendChild(linkEl);
    })

    // Rolagem para a categoria selecionada no mobile 
    window.mobile <= 991 && handleBlogCategories();

  },

  // Rolagem horizontal até a  categoria selecionada, no mobile
  handleBlogCategories: function () {
    const categoriesContainer = document.querySelector("nav.categories");

    if (categoriesContainer) {
      const buttons = categoriesContainer.querySelectorAll('.category');
      buttons.length > 0 && buttons.forEach(button => {
        if (button.classList.contains('-selected')) {
          categoriesContainer.scrollTo({
            top: 0,
            left: button.offsetLeft - 50,
            behavior: "smooth",
          });
        }
      })
    }
   
  },

  // Carrossel de posts relacionados
  setRelatedPosts: function () {
    const blogRelatedPosts = document.querySelector('[data-related-posts]');

    if (blogRelatedPosts) {
      const carousel = blogRelatedPosts.querySelector('.swiper');
      const pagination = blogRelatedPosts.querySelector('.swiper-pagination');
      const next = blogRelatedPosts.querySelector('.swiper-button-next');
      const prev = blogRelatedPosts.querySelector('.swiper-button-prev');

      new Swiper(carousel, {
        slidesPerView: 2,
        spaceBetween: 8,
        watchOverflow: true,
        pagination: {
          el: pagination,
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
            navigation: {
              nextEl: next,
              prevEl: prev,
            },
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 16,
          }
        }
      });
    }

  },

  init: function () {
    const { setCategories, setRelatedPosts } = Blog;

    setCategories();
    setRelatedPosts();

    // Retirar ou comentar se não for utilizado
    InfinityScroll.init();
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Blog.init();
})
