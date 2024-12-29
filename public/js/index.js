/* eslint-disable */
import { login, logout } from './login';
import { forgotPassword } from './forgot-password';
import { addNewProduct, deleteProduct } from './product';
import { updateSettings, resetPassword } from './updateSettings';
import { singupuser, deleteUser } from './user';
import { addToCart, getMyCart, updateCartQuantity, deleteFromProduct } from './cart';
import {  deleteOrder, createOrder, confirmOrder, purchaseProduct } from './order';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const forgotPasswordForm = document.querySelector('.form--forgot-password');
const ResetPasswordForm = document.querySelector('.form--reset-password');
const logOutBtns = document.querySelectorAll('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form-signup-user-data');
const cartForm = document.querySelector('.add-to-cart');
const onClickChebout = document.querySelector('.checkout');
const btnCreateOrder = document.querySelector('.btn-create-order');
const deleteFromCart = document.querySelectorAll('.delete-from-cart');
const decreaseBtns = document.querySelectorAll('.decrease');
const increaseBtns = document.querySelectorAll('.increase');
const deleteBtns = document.querySelectorAll('.btn-delete-product');
const deleteOrderBtns = document.querySelectorAll('.btn-order-list');
const confirmOrderBtns = document.querySelectorAll('.btn-confirm-order');
const deleteUserBtns = document.querySelectorAll('.btn-delete-user');
const buyBtns = document.querySelectorAll('.buy-btn');
const productSubmitForm = document.getElementById('submitAll');
// Inicializar Uppy e configurar o Dashboard

document.addEventListener('DOMContentLoaded', () => {
  // Adicionar evento de submissão no botão
  if (productSubmitForm) {
    productSubmitForm.addEventListener('click', async e => {
      e.preventDefault();

      // Cria um FormData consolidando os dados dos formulários
      const formData = new FormData();

      // Coleta os dados do primeiro formulário
      const form1 = document.querySelector('.form-product-data-part-I');
      if (form1) {
        formData.append(
          'imageCover',
          document.getElementById('imageCover').files[0]
        );
        formData.append('name', form1.querySelector('#name').value);
        formData.append(
          'description',
          form1.querySelector('#description').value
        );
        formData.append(
          'stockQuantity',
          form1.querySelector('#stockQuantity').value
        );
        formData.append('price', form1.querySelector('#price').value);
      }

      // Coleta os dados do segundo formulário
      const form2 = document.getElementById('form2');
      if (form2) {
        formData.append('category', form2.querySelector('#category').value);
        formData.append('gender', form2.querySelector('#gender').value);
        formData.append('sizes', form2.querySelector('#sizes').value);

        formData.append(
          'statusDiscount',
          form2.querySelector('#statusDiscountSelect').value
        );

        const priceDiscount = form2.querySelector('#priceDiscount').value;
        if (priceDiscount) {
          formData.append('priceDiscount', priceDiscount);
        }
        const selectedColors = JSON.parse(
          form2.querySelector('#selectedColorsInput').value
        );
        formData.append('colors', selectedColors);
      }

      // Coleta os arquivos carregados no Uppy
      const form3 = document.getElementById('pc-uppy-1');
      if (form3 && window.uppy1) {
        const uppyFiles = window.uppy1.getFiles(); // Use a instância global
        uppyFiles.forEach(file => {
          formData.append('images', file.data); // Adiciona cada arquivo carregado ao FormData
        });
      }

      // Exibir os dados no console para verificar
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(
            `${key}: ${value.name} (${value.type}, ${value.size} bytes)`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      });

      // Envia os dados para o servidor
      await addNewProduct(formData);
    });
  }
});

// DELEGATION
if (ResetPasswordForm)
  ResetPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const token = document.getElementById('token').value;
    resetPassword(token, password, passwordConfirm);
  });

if (forgotPasswordForm)
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

// if (logOutBtn) logOutBtn.addEventListener('click', logout);
if (logOutBtns) {
  logOutBtns.forEach(logOutBtn => {
    logOutBtn.addEventListener('click', () => {
      logout();
    });
  });
}

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('contact', document.getElementById('contact').value);
    form.append('birthDate', document.getElementById('birthDate').value);
    form.append('address', document.getElementById('address').value);
    form.append('photo', document.getElementById('uplfile').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const address = document.getElementById('address').value;
    const birthDate = document.getElementById('birthDate').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    singupuser(
      name,
      email,
      contact,
      address,
      birthDate,
      password,
      passwordConfirm
    );
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent =
      'Atualizando...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent =
      'Atualizar Senha';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (cartForm)
  cartForm.addEventListener('submit', e => {
    e.preventDefault();

    const quantity = document.getElementById('number').value;
    const product = document.getElementById('productId').value;

    console.log('Carrinho: ', product, quantity);
    addToCart(product, quantity);
  });

if (onClickChebout){
  onClickChebout.addEventListener('click', e => {
    getMyCart();
  });
}
if (deleteFromCart) {
  deleteFromCart.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const cartId = button.getAttribute('data-cart-id');
      const productId = button.getAttribute('data-product-id');

      console.log('os ids ', cartId, ' ', productId);

      deleteFromProduct(cartId, productId);
    });
  });
}

if (decreaseBtns) {
  // Função para reduzir a quantidade
  decreaseBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const productId = e.target
        .closest('button')
        .getAttribute('data-product-id');
      const input = e.target.closest('.btn-group').querySelector('input');
      let quantity = parseInt(input.value, 10);

      // Atualiza o valor no input
      input.value = quantity;

      // Atualiza a quantidade no banco de dados
      updateCartQuantity(productId, quantity);
    });
  });
}

if (increaseBtns) {
  // Função para aumentar a quantidade
  increaseBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const productId = e.target
        .closest('button')
        .getAttribute('data-product-id');
      const input = e.target.closest('.btn-group').querySelector('input');
      let quantity = parseInt(input.value, 10);

      // Atualiza o valor no input
      input.value = quantity;

      // Atualiza a quantidade no banco de dados
      updateCartQuantity(productId, quantity);
    });
  });
}

if (deleteBtns) {
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const productId = e.target
        .closest('a')
        .getAttribute('data-productlist-id');
      console.log('Product ID:', productId); // Verifique o ID do produto no console
      deleteProduct(productId);
    });
  });
}

if (deleteOrderBtns) {
  deleteOrderBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const orderId = e.target
        .closest('a')
        .getAttribute('data-orderlist-id');
      deleteOrder(orderId);
    });
  });
}

if (confirmOrderBtns) {
  confirmOrderBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const orderId = e.target
        .closest('a')
        .getAttribute('data-order-id');
        confirmOrder(orderId);
    });
  });
}

if (deleteUserBtns) {
  deleteUserBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const customerId = e.target.closest('a').getAttribute('data-user-id');
      console.log('Customer ID:', customerId); 
      deleteUser(customerId);
    });
  });
}

if (btnCreateOrder){
  btnCreateOrder.addEventListener('click', e => {
    createOrder();
  });
} 

if (buyBtns.length > 0) {
  buyBtns.forEach(buyBtn => {
    buyBtn.addEventListener('click', e => {
      e.preventDefault();
      const quantity = document.getElementById('number').value;
      const product = document.getElementById('productId').value;
      purchaseProduct(product, quantity);
    });
  });
}