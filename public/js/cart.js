/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const addToCart = async (product, quantity) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/carts/add-to-cart',
      data: {
        products: [
          {
            product,
            quantity: Number(quantity) // Converte para número caso necessário
          }
        ]
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Acessório adicionado no carinho');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const getMyCart = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/carts',
      data
    });

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteFromProduct = async (cartId, productId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/carts/cartId/${cartId}/products/${productId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Acessório eliminado do carinho');
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateCartQuantity = async (productId, quantity) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/carts/update`, // Substitua pela URL da sua API
      data: {
        productId,
        quantity
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Carrinho atualizado com sucesso!');
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    }
  } catch (err) {
    showAlert('error', 'Erro ao atualizar o carrinho. Tente novamente.');
  }
};