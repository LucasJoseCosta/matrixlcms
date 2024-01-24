const CepLocals = {
  background:document.querySelector("[data-modal-cep-background]"),
  cep:document.querySelector("[data-modal-cep]"),
  opens:document.querySelectorAll("[data-modal-cep-open]"),
  close:document.querySelector("[data-modal-close]"),
  body:document.querySelector("[data-modal-body]"),
  form:document.querySelector("[data-modal-form]"),
  input:document.querySelector("[data-modal-input]"),
  inputError:document.querySelector("[data-modal-input-error]"),
  submit:document.querySelector("[data-modal-submit]"),
  nostore:document.querySelector("[data-modal-nostore]"),
  redirect:document.querySelector("[data-modal-redirect]"),
  response:document.querySelector("[data-modal-response]"),
  reset:document.querySelector("[data-modal-reset]"),
  textEl:document.querySelector("[data-modal-cep-text]"),
  headerEl:document.querySelector("[data-modal-cep-header]"),
  products:document.querySelectorAll("[data-product-cep]"),
  productsEl:document.querySelectorAll("[data-product-box]"),
  //url:"https://matrixlcms.vnda.dev/", // dev api url
  url:"https://matrixlcms.cdn.vnda.com.br/", // prod api url
  //token:"TibBWzM7hj9jFaj8XXBvqUS1", //dev token
  token:"C3W2dawXSWrsSVp4Lf1s6ViG", //prod token
  getLocalForZip: function(zip) {
    const _this=this, {
      submit:submit,
      input:input,
      inputError: inputError,
      form:form,
      url:url,
      token:token,
      nostore:nostore,
      body:body,
    } = this;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const localRequest = new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: `/api/v2/places?warehouse=true`,
                data: { cep: zip },
                dataType: "json",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);

                }
            });
        });
        const viaCepRequest = new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: `https://viacep.com.br/ws/${input.value.replace('-', '')}/json/`,
                data: { cep: zip },
                dataType: "json",
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                }
            })
            .fail((error=> {
              inputError.classList.remove('hidden');
              inputError.classList.add('show');
              submit.innerHTML = "Consultar"; 
            }))
        });

        try {
            submit.innerHTML = "Verificando ..."

            const [responseLocal, responseViaCep] = await Promise.all([localRequest, viaCepRequest]);

            if(responseViaCep.erro) {
              inputError.classList.remove('hidden');
              inputError.classList.add('show');
              submit.innerHTML = "Consultar"
              return;
            } else {
              localStorage.setItem('user_cep', input.value)
              if(inputError.classList.contains('show')){
                  inputError.classList.remove('show');
                  inputError.classList.add('hidden');
              }
            }

            const matchFound = responseLocal.some(local => {
                if (responseViaCep.uf === local.state) {
                    return true;
                } else {
                    return false;
                }
            });

            if(matchFound) {
              localStorage.setItem('hidden-products', false);
              nostore.querySelector("[data-modal-nostore-text]").innerHTML = "Sua região apresenta todos os produtos!"
              body.classList.add('hidden');
              nostore.classList.remove('hidden');
              nostore.classList.add('show');
            } else {
              localStorage.setItem('hidden-products', true);
              nostore.querySelector("[data-modal-nostore-text]").innerHTML = "Alguns produtos não estão disponíveis para o seu CEP. Vamos te mostrar apenas o que conseguimos te entregar!"
              body.classList.add('hidden');
              nostore.classList.remove('hidden');
              nostore.classList.add('show');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
  },
  setAvailableProducts:function() {
    const _this=this, {
      productsEl:productsEl
    } = this;
    const hiddenProduct = localStorage.getItem('hidden-products');
    if(hiddenProduct == 'true'){
      productsEl.forEach(productEl => {
        if(productEl.classList.contains('cromatografia')){
          productEl.classList.add('hidden');
          if(productEl.closest('.swiper-slide')){
            const productSlide = productEl.closest('.swiper-slide');
            productSlide.classList.add('hidden')
          }
        }
      })
    } else {
      productsEl.forEach(productEl => {
        if(productEl.classList.contains('cromatografia')){
          productEl.classList.remove('hidden');
          if(productEl.closest('.swiper-slide')){
            const productSlide = productEl.closest('.swiper-slide');
            productSlide.classList.remove('hidden')
          }
        }
      })
    }
  },
  handleOpen: function() {
    const {
      background:background,
      opens:opens,
      cep: cep,
      body: body,
      headerEl: headerEl,
      close: close
    } = this;
    const userCep = localStorage.getItem('user_cep');
    const hiddenProduct = localStorage.getItem('hidden-products');
    if(!userCep && !hiddenProduct) {
      if(background.classList.contains('hide')){
        background.classList.remove('hide');
      }
      close.classList.add('hidden');
    } else {
      close.classList.remove('hidden');
    }
    if(userCep) {
      headerEl.innerHTML = "Editar CEP"
    }
    opens.length>0&&opens.forEach((open=> {
      open.addEventListener("click",(e=> {
          "stop"!=open.getAttribute("data-modal-cep-add")&&(e.preventDefault(),
          background.classList.contains("hide")&&(background.classList.remove("hide"),
          open.hasAttribute("data-modal-cep-add")&&open.setAttribute("data-modal-cep-add","add")))
          if(userCep){
            if(!body.querySelector('.modal-actual-cep')){
              const cepText = document.createElement("p");
              cepText.classList.add('modal-actual-cep');
              cepText.innerHTML = `CEP atual: <strong>${userCep}</strong>`;
              body.prepend(cepText);
            }
          }
      }))
    }))
  },
  handleClose:function() {
    const {
        close:close,
        cep:cep,
        submit:submit,
        input:input,
        form:form
    }
    =this;
    const userCep = localStorage.getItem('user_cep');
    const hiddenProduct = localStorage.getItem('hidden-products');
    close&&close.addEventListener("click",(e=> {
        e.preventDefault(),
        cep.classList.add("hide"),
        submit.classList.remove("hidden"),
        input.classList.remove("hidden"),
        form.classList.remove("hidden");
        let activeAdd = document.querySelector('[data-modal-cep-add="add"]');
        activeAdd && activeAdd.setAttribute("data-modal-cep-add","");
        if(userCep && hiddenProduct) {
          window.location.reload();
        }
    }))
  },
  inputMask: function () {
    const { input: input } = this;
    input && input.addEventListener("input", (e => {
        var cepValue = e.target.value.replace(/\D/g, "").match(/(\d{0,5})(\d{0,3})/);
        e.target.value = cepValue[2] ? cepValue[1] + "-" + cepValue[2] : cepValue[1];
    }))
  },
  reloadPage: function() {
    const { 
      redirect: redirect,
    } = this;
    redirect.addEventListener('click', () => {
      window.location.reload();
    })
  },
  resetForm: function() {
    const { 
      reset: reset,
      input:input,
      nostore:nostore,
      body:body,
      submit:submit,
    } = this;
    reset.addEventListener('click', () => {
      body.classList.remove('hidden');
      nostore.classList.add('hidden');
      nostore.classList.remove('show');
      input.value = "";
      submit.innerHTML = "Consultar";
      localStorage.removeItem('user_cep');
      localStorage.removeItem('hidden-products')
    })
  },
  init:function() {
    this.inputMask(),
    this.handleOpen(),
    this.handleClose(),
    this.getLocalForZip(),
    this.setAvailableProducts(),
    this.reloadPage(),
    this.resetForm()
  }
}

export default CepLocals;
