// script.js

// Cria o modal
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = '<img src="" alt="Imagem ampliada">';
document.body.appendChild(modal);

const modalImg = modal.querySelector('img');

// Ao clicar em qualquer imagem da galeria
document.querySelectorAll('.fotos img').forEach(img => {
  img.addEventListener('click', () => {
    modalImg.src = img.src;
    modal.classList.add('active');
  });
});

// Ao clicar no modal, fecha a imagem
modal.addEventListener('click', () => {
  modal.classList.remove('active');
});
