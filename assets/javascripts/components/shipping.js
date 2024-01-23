import { formatMoney, urlencodeFormData } from '../components/utilities';

const Shipping = {
  handleShipping: async function (form) {

    // primeiramente, pegamos o sku e a quantidade de itens do produto em questão. essas informacões devem ser dinamicas com o formulário de compra, já que o sku e a quantidade interferem no peso do produto e com isso no valor do frete.
    const sku = document.querySelector('[data-product-box] [name="sku"]').value;
    const quantity = document.querySelector(
      '[data-product-box] [name="quantity"]'
    ).value;

    // depois pegamos o cep fornecido no input do formulário de calculo de frete. e damos um replace para caso o valor seja informado com -, ele seja removido.
    const zip = form.querySelector('.input').value.replace('-', '');
    const buttonSubmit = form.querySelector('.action');

    // aqui verificamos se o cep contém menos ou mais 8 caractéres e enviamos uma mensagem de erro avisando que o formato do frete é inválido
    if (zip.length != 8) {
      form.classList.add('error');
      form.querySelector('.msg-error').classList.add('-visible');
      form.querySelector('.msg-error').innerHTML = 'Formato de CEP inválido';
    } else {

      // caso o frete seja válido, montamos as informacoes em FormData
      const formData = new FormData();

      formData.set('sku', sku);
      formData.set('quantity', quantity);
      formData.set('zip', zip);

      // essa verificacão é feita para que se o usuário clique várias vezes no botão antes da requisicão terminar, não faca requisicões duplicadas
      if (!form.classList.contains('-sending')) {
        form.classList.remove('-error');
        form.classList.add('-sending');
        buttonSubmit.classList.add('-sending');

        try {

          // aqui fazermos a requisicão para o endpoint /frete_produto enviando sku, quantity e zip 
          const response = await fetch('/frete_produto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencodeFormData(formData),
          });

          const data = await response.json();

          if (data.error) {
            
            // aqui é definido o comportamento caso não seja encontrado condicões de frete disponíveis no momento
            console.error('Ocorreu um erro ao consultar o frete');
            console.error(data.error);

            form.classList.add('error');
            form.querySelector('.msg-error').classList.add('-visible');
            form.querySelector('.msg-error').innerHTML =
              'Ocorreu um erro ao calcular o frete, favor verifique seu cep.';

            setTimeout(function () {
              form.classList.remove('-error');
              form.querySelector('.msg-error').classList.remove('-visible');
              buttonSubmit.classList.remove('-sending');
            }, 3500);
          } else {

            // aqui é denifido o comportamento caso seja encontrado forma de entrega disponível
            const methods = JSON.parse(data.methods);
            const address = data.address_details;

            let result = `<h4 class="street">${address.street_name}, ${address.neighborhood} - ${address.city}/${address.state}</h4>`;

            result += '<ul class="shipping-list">';

            methods.forEach((method) => {
              let price = method.price;
              price = price == 0 ? 'Grátis' : formatMoney(price);

              result += `
                <li class="shipping-list-item">
                  <div class="method">
                    <p class="type">${method.name}</p>
                    <p class="price">${price}</p>
                  </div>
                  <span class="prazo">${method.description}</span>
                </li>
              `;
            });

            result += '</ul>';

            document.querySelector('[data-list-shipping]').innerHTML = result;
          }
        } catch (error) {

          //define comportamento caso a requisicão falhe.
          console.error('Erro ao enviar dados para consulta de frete');
          console.error(error);
          form.classList.add('error');
          form.querySelector('.msg-error').classList.add('-visible');
          form.querySelector('.msg-error').innerHTML =
            'Ocorreu um erro ao calcular o frete, favor verifique seu cep.';
          buttonSubmit.classList.remove('-sending');
        }

        form.classList.remove('-sending');
        buttonSubmit.classList.remove('-sending');
      }
    }
  },
  init: function () {
    const _this = this;
    const form = document.querySelector('[name="shipping-form"]');
    const inputValue = form.querySelector('.input');

    inputValue.addEventListener('input', (event) => {
      
      // cria a máscara de frete para que o input fique mais intuitivo e previna erros do usuário
      const x = event.target.value
        .replace(/\D/g, '')
        .match(/(\d{0,5})(\d{0,3})/);
      event.target.value = !x[2] ? x[1] : x[1] + '-' + x[2];
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      _this.handleShipping(form);
    });
  },
};

export default Shipping;
