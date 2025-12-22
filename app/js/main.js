document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
});

const header = document.getElementById('header');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 1) {
        header.classList.add('white');
    } else {
        header.classList.remove('white');
    }
    
    lastScrollTop = scrollTop;
});

// Вычисляем точную длину пути
const path = document.getElementById('drawing-line');
const length = path.getTotalLength();

// Устанавливаем CSS свойства
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;

// Запускаем анимацию
path.animate([
    { strokeDashoffset: length },
    { strokeDashoffset: 0 }
], {
    duration: 5000,
    easing: 'ease-in-out',
    fill: 'forwards'
});
