/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const confirmOrder = async (orderId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/orders/${orderId}`,
      data:{
        status: 'entregue'
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Ecomenda confirmada com sucesso');
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createOrder = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/orders`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Ecomenda criada com sucesso');
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/orders/${orderId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Ecomenda eliminada com sucesso');
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const purchaseProduct = async (productId, quantity) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/orders/purchase',
      data: {
        productId,
        quantity,
      },
    });

    if (res.status === 200) {
      showAlert('success', 'Compra realizada com sucesso!');
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


