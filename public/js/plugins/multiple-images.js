const imagesMap = new Map(); // Store images for each gallery

//---> Get Images
const imgSelectorFun = (inputImgs, gForm, showTo) => {
  const imagesData = imagesMap.get(showTo) || []; // Get existing images or initialize an empty array
  let image = inputImgs.files;

  for (let i = 0; i < image.length; i++) {
    imagesData.push({
      name: image[i].name,
      url: URL.createObjectURL(image[i]),
      file: image[i]
    });
  }
  imagesMap.set(showTo, imagesData); // Save the images data for this gallery

  gForm.reset();
  document.querySelector(`${showTo}`).innerHTML = showImgFun(
    imagesData,
    showTo
  );
};

//---> Show Images
const showImgFun = (yimages, showTo) => {
  let image = '';
  if (yimages.length > 0) {
    yimages.forEach((ele, i) => {
      image += `<div class="col img-card">
        <img src="${ele.url}">
        <span onclick="deleteImgFun(${i}, '${showTo}')">
          <i class="fas fa-window-close"></i>
        </span>
      </div>`;
    });
    return image;
  } else {
    return `<div>
             <h6 class="empty-hd"><i class="fas fa-images"></i> <br>
                        Nenhuma imagem de produto foi carregada</h6>
            </div>`;
  }
};

//---> Delete Image
const deleteImgFun = (i, showTo) => {
  const imagesData = imagesMap.get(showTo); // Get the images for this gallery
  imagesData.splice(i, 1); // Modify the array
  imagesMap.set(showTo, imagesData); // Update the Map with modified images
  document.querySelector(`${showTo}`).innerHTML = showImgFun(
    imagesData,
    showTo
  );
};

// ==========================csdffbfgfgbgbfe
let galleryForm = document.querySelectorAll('.gallery-form');
galleryForm.forEach(gForm => {
  let uploadImgBtn = gForm.querySelector('button');
  let inputImgs = gForm.querySelector('input');
  let showTo = gForm.getAttribute('showAt');

  uploadImgBtn.addEventListener('click', () => inputImgs.click());

  inputImgs.addEventListener('change', event =>
    imgSelectorFun(event.target, gForm, showTo)
  );
});
