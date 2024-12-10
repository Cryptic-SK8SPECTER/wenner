document.addEventListener('DOMContentLoaded', () => {
  const colors = [];
  const colorPicker = document.getElementById('colorPicker');
  const selectedColors = document.getElementById('selectedColors');
  const selectedColorsInput = document.getElementById('selectedColorsInput');
  const addColorButton = document.getElementById('addColor');

  if (
    !colorPicker ||
    !selectedColors ||
    !selectedColorsInput ||
    !addColorButton
  ) {
    console.error('Algum elemento necessário não foi encontrado no DOM.');
    return;
  }

  addColorButton.addEventListener('click', () => {
    const selectedColor = colorPicker.value;
    if (!colors.includes(selectedColor)) {
      colors.push(selectedColor);
      updateFormInput();
      displayColors();
    } else {
      alert('Esta cor já foi selecionada!');
    }
  });

  function displayColors() {
    selectedColors.innerHTML =
      '<h6 class="text-muted">Cores Selecionadas:</h6>';
    colors.forEach((color, index) => {
      const colorBox = document.createElement('div');
      colorBox.className = 'color-box';
      colorBox.style.backgroundColor = color;
      colorBox.title = `Clique para remover: ${color}`;

      // Adiciona evento de clique para remover a cor
      colorBox.addEventListener('click', () => {
        removeColor(index);
      });

      selectedColors.appendChild(colorBox);
    });
  }

  function removeColor(index) {
    colors.splice(index, 1); // Remove a cor do array
    updateFormInput(); // Atualiza o input oculto
    displayColors(); // Atualiza a exibição
  }

  function updateFormInput() {
    selectedColorsInput.value = JSON.stringify(colors); // Armazena as cores como JSON no input
  }
});
