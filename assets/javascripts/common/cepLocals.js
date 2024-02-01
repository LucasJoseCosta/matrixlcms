const CepLocals = {
  background: document.querySelector('[data-modal-cep-background]'),
  cep: document.querySelector('[data-modal-cep]'),
  opens: document.querySelectorAll('[data-modal-cep-open]'),
  close: document.querySelector('[data-modal-close]'),
  body: document.querySelector('[data-modal-body]'),
  form: document.querySelector('[data-modal-form]'),
  input: document.querySelector('[data-modal-input]'),
  inputError: document.querySelector('[data-modal-input-error]'),
  submit: document.querySelector('[data-modal-submit]'),
  nostore: document.querySelector('[data-modal-nostore]'),
  redirect: document.querySelector('[data-modal-redirect]'),
  response: document.querySelector('[data-modal-response]'),
  reset: document.querySelector('[data-modal-reset]'),
  textEl: document.querySelector('[data-modal-cep-text]'),
  headerEl: document.querySelector('[data-modal-cep-header]'),
  products: document.querySelectorAll('[data-product-cep]'),
  productsEl: document.querySelectorAll('[data-product-box]'),
  getLocalForZip: function () {
    const _this = this,
      { input: input, form: form, submit: submit, inputError: inputError, body: body, nostore: nostore } = this;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const zip = input.value;
      const zipFormated = zip.replace('-', '');

      let data = new FormData(e.target);
      data.set('zip', zipFormated);
      let url = '/cep/choose-local';

      submit.innerHTML = 'Verificando ...';

      fetch(url, {
        method: 'POST',
        body: data,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          localStorage.setItem('user_cep', input.value);

          if (json.serves) {
            localStorage.setItem('hidden-products', false);
            nostore.querySelector('[data-modal-nostore-text]').innerHTML = 'Sua região apresenta todos os produtos!';
            body.classList.add('hidden');
            nostore.classList.remove('hidden');
            nostore.classList.add('show');
          } else {
            localStorage.setItem('hidden-products', true);
            nostore.querySelector('[data-modal-nostore-text]').innerHTML =
              'Alguns produtos não estão disponíveis para o seu CEP. Vamos te mostrar apenas o que conseguimos te entregar!';
            body.classList.add('hidden');
            nostore.classList.remove('hidden');
            nostore.classList.add('show');
          }
        })
        .catch(function (error) {
          console.log('error', error);
        });
    });
  },
  setAvailableProducts: function () {
    const _this = this,
      { productsEl: productsEl } = this;
    const hiddenProduct = localStorage.getItem('hidden-products');
    if (hiddenProduct == 'true') {
      productsEl.forEach((productEl) => {
        if (productEl.classList.contains('waters')) {
          productEl.classList.add('hidden');
          if (productEl.closest('.swiper-slide')) {
            const productSlide = productEl.closest('.swiper-slide');
            productSlide.classList.add('hidden');
          }
        }
      });
    } else {
      productsEl.forEach((productEl) => {
        if (productEl.classList.contains('waters')) {
          productEl.classList.remove('hidden');
          if (productEl.closest('.swiper-slide')) {
            const productSlide = productEl.closest('.swiper-slide');
            productSlide.classList.remove('hidden');
          }
        }
      });
    }
  },
  handleOpen: function () {
    const { background: background, opens: opens, cep: cep, body: body, headerEl: headerEl, close: close } = this;
    const userCep = localStorage.getItem('user_cep');
    const hiddenProduct = localStorage.getItem('hidden-products');
    if (!userCep || !hiddenProduct) {
      if (background.classList.contains('hide')) {
        background.classList.remove('hide');
      }
      close.classList.add('hidden');
    } else {
      close.classList.remove('hidden');
    }
    if (userCep) {
      headerEl.innerHTML = 'Editar CEP';
    }
    opens.length > 0 &&
      opens.forEach((open) => {
        open.addEventListener('click', (e) => {
          'stop' != open.getAttribute('data-modal-cep-add') &&
            (e.preventDefault(),
            background.classList.contains('hide') &&
              (background.classList.remove('hide'),
              open.hasAttribute('data-modal-cep-add') && open.setAttribute('data-modal-cep-add', 'add')));
          if (userCep) {
            if (!body.querySelector('.modal-actual-cep')) {
              const cepText = document.createElement('p');
              cepText.classList.add('modal-actual-cep');
              cepText.innerHTML = `CEP atual: <strong>${userCep}</strong>`;
              body.prepend(cepText);
            }
          }
        });
      });
  },
  handleClose: function () {
    const { close: close, cep: cep, submit: submit, input: input, form: form } = this;
    const userCep = localStorage.getItem('user_cep');
    const hiddenProduct = localStorage.getItem('hidden-products');
    close &&
      close.addEventListener('click', (e) => {
        e.preventDefault(),
          cep.classList.add('hide'),
          submit.classList.remove('hidden'),
          input.classList.remove('hidden'),
          form.classList.remove('hidden');
        let activeAdd = document.querySelector('[data-modal-cep-add="add"]');
        activeAdd && activeAdd.setAttribute('data-modal-cep-add', '');
        if (userCep && hiddenProduct) {
          window.location.reload();
        }
      });
  },
  inputMask: function () {
    const { input: input } = this;
    input &&
      input.addEventListener('input', (e) => {
        var cepValue = e.target.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
        e.target.value = cepValue[2] ? cepValue[1] + '-' + cepValue[2] : cepValue[1];
      });
  },
  reloadPage: function () {
    const { redirect: redirect } = this;
    redirect.addEventListener('click', () => {
      window.location.reload();
    });
  },
  resetForm: function () {
    const { reset: reset, input: input, nostore: nostore, body: body, submit: submit } = this;
    reset.addEventListener('click', () => {
      body.classList.remove('hidden');
      nostore.classList.add('hidden');
      nostore.classList.remove('show');
      input.value = '';
      submit.innerHTML = 'Consultar';
      localStorage.removeItem('user_cep');
      localStorage.removeItem('hidden-products');
    });
  },
  init: function () {
    this.getLocalForZip(),
      this.inputMask(),
      this.handleOpen(),
      this.handleClose(),
      this.setAvailableProducts(),
      this.reloadPage(),
      this.resetForm();
  },
};

export default CepLocals;
