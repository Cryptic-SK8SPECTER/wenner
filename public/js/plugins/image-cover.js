class PhotoSubmission {
  constructor() {
    const inputs = document.querySelectorAll('.js-photo_submit-input');

    inputs.forEach((input) => {
      input.addEventListener('change', (e) => this.uploadImage(e));
    });
  }

  uploadImage(event) {
    const fileInput = event.target;
    const uploadBtn = fileInput.closest('.photo_submit');
    const deleteBtn = uploadBtn.querySelector('.js-photo_delete-btn');

    const file = fileInput.files[0];

    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      uploadBtn.style.backgroundImage = `url('${e.target.result}')`;
      uploadBtn.classList.add('photo_submit--image');
      fileInput.setAttribute('disabled', 'disabled');
    };

    reader.readAsDataURL(file);

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.resetImage(fileInput, uploadBtn);
      });
    } else {
      console.warn('Botão de exclusão não encontrado!');
    }
  }

  resetImage(fileInput, uploadBtn) {
    uploadBtn.style.backgroundImage = '';
    uploadBtn.classList.remove('photo_submit--image');
    setTimeout(() => {
      fileInput.removeAttribute('disabled');
      fileInput.value = ''; // Limpa o arquivo selecionado
    }, 200);
  }
}

// Inicializa a classe após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  new PhotoSubmission();
});
