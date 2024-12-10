/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const singupuser = async (name, email, contact, address, birthDate, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data:{
        name,
        email,
        contact,
        address,
        birthDate,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') showAlert('success', 'cadastrado com sucesso!');
     
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteUser = async (customerId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/users/${customerId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Cliente excluído com sucesso!');
      
      // Remover a linha da tabela correspondente ao cliente excluído
      const row = document.querySelector(`a[data-user-id="${customerId}"]`).closest('tr');
      row.remove();
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Erro ao excluir cliente! Tente novamente.');
  }
};

