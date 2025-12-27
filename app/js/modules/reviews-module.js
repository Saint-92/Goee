export const ReviewsModule = {
  init() {
    const reviewsSlider = document.querySelector('.reviews-slider');
    if (!reviewsSlider) return;
    
    const swiper = new Swiper(reviewsSlider, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: false,
      navigation: {
        nextEl: '#reviewsNext',
        prevEl: '#reviewsPrev',
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 10 },
        992: { slidesPerView: 3, spaceBetween: 10 },
      },
    });
    
    function updateCounter() {
      let slidesPerView;
      if (window.innerWidth < 768) {
        slidesPerView = 1; 
      } else if (window.innerWidth < 992) {
        slidesPerView = 2; 
      } else {
        slidesPerView = 3; 
      }
      
      const current = swiper.realIndex + 1;
      const total = Math.max(swiper.slides.length - slidesPerView + 1, 1);
      
      const currentSlideEl = document.getElementById('currentSlide');
      const totalSlidesEl = document.getElementById('totalSlides');
      
      if (currentSlideEl) currentSlideEl.textContent = current;
      if (totalSlidesEl) totalSlidesEl.textContent = total;

      const paginationContainer = document.getElementById('reviewsPagination');
      if (!paginationContainer) return;

      paginationContainer.innerHTML = '';
      
      for (let i = 0; i < total; i++) {
        const bullet = document.createElement('div');
        bullet.className = 'reviews__pagination--bullet' + (i === swiper.realIndex ? ' active' : '');
        bullet.setAttribute('data-index', i);
        bullet.setAttribute('aria-label', `Go to review ${i + 1}`);
        
        bullet.addEventListener('click', () => swiper.slideTo(i));
        paginationContainer.appendChild(bullet);
      }
    }
    
    function updatePagination() {
      const bullets = document.querySelectorAll('.reviews__pagination--bullet');
      const activeIndex = swiper.realIndex;
      
      bullets.forEach((bullet, index) => {
        if (index === activeIndex) {
          bullet.classList.add('active');
        } else {
          bullet.classList.remove('active');
        }
      });
    }
    
    function handleResize() {
      updateCounter();
    }
    
    // Инициализация
    updateCounter();
    
    swiper.on('slideChange', function() {
      let slidesPerView;
      if (window.innerWidth < 768) {
        slidesPerView = 1;
      } else if (window.innerWidth < 992) {
        slidesPerView = 2;
      } else {
        slidesPerView = 3;
      }
      
      const current = swiper.realIndex + 1;
      const total = Math.max(swiper.slides.length - slidesPerView + 1, 1);
      
      const currentSlideEl = document.getElementById('currentSlide');
      const totalSlidesEl = document.getElementById('totalSlides');
      
      if (currentSlideEl) currentSlideEl.textContent = current;
      if (totalSlidesEl) totalSlidesEl.textContent = total;
      
      updatePagination();
    });
    
    window.addEventListener('resize', handleResize);
  },
};