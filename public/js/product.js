/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const addNewProduct = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/products',
      data
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Acessório cadastrado com sucesso!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/products/${productId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Produto excluído com sucesso!');
      
      // Remover a linha da tabela correspondente ao produto excluído
      const row = document.querySelector(`a[data-productlist-id="${productId}"]`).closest('tr');
      row.remove();
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Erro ao excluir produto! Tente novamente.');
  }
};
