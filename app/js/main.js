document.addEventListener('DOMContentLoaded', function() {
  // ========== ОБЩИЕ ФУНКЦИИ ==========
  
  // Плавная прокрутка для якорей
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Изменение хедера при скролле
  const header = document.getElementById('header');
  let lastScrollTop = 0;

  if (header) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 1) {
        header.classList.add('white');
      } else {
        header.classList.remove('white');
      }
      
      lastScrollTop = scrollTop;
    });
  }

  // Форматирование даты (общая функция)
  window.formatDate = function(date) {
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // ========== МОТОРХОМЫ ==========
  const motorhomesData = {
    images: [
      {
        id: 1,
        main: 'images/Adria.jpg',
        thumbnail: 'images/thumb-1.jpg',
        alt: 'Adria S75 SL 2023 Exterior',
      },
      {
        id: 2,
        main: 'images/main-2.jpeg',
        thumbnail: 'images/thumb-2.jpg',
        alt: 'Adria S75 SL 2023 Living Area',
      },
      {
        id: 3,
        main: 'images/main-3.jpeg',
        thumbnail: 'images/thumb-3.jpg',
        alt: 'Adria S75 SL 2023 Kitchen',
      },
      {
        id: 4,
        main: 'images/main-4.jpeg',
        thumbnail: 'images/thumb-4.jpg',
        alt: 'Adria S75 SL 2023 Bedroom',
      },
      {
        id: 5,
        main: 'images/main-5.jpeg',
        thumbnail: 'images/thumb-5.jpg',
        alt: 'Adria S75 SL 2023 Bathroom',
      },
      {
        id: 6,
        main: 'images/main-6.jpeg',
        thumbnail: 'images/thumb-6.jpg',
        alt: 'Adria S75 SL 2023 Dashboard',
      },
      {
        id: 7,
        main: 'images/main-7.jpeg',
        thumbnail: 'images/thumb-7.jpg',
        alt: 'Adria S75 SL 2023 Storage',
      },
      {
        id: 8,
        main: 'images/main-8.jpeg',
        thumbnail: 'images/thumb-8.jpg',
        alt: 'Adria S75 SL 2023 Exterior Back',
      },
    ],
    selectedDates: {
      start: new Date(2025, 10, 29),
      end: new Date(2025, 11, 13),
    },
    currentImageIndex: 0
  };

  function initMotorhomes() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailList = document.getElementById('thumbnailList');
    
    if (!mainImage || !thumbnailList) return;
    
    // Устанавливаем первое изображение
    if (motorhomesData.images.length > 0) {
      mainImage.src = motorhomesData.images[0].main;
      mainImage.alt = motorhomesData.images[0].alt;
    }
    
    // Создаем миниатюры
    motorhomesData.images.forEach((image, index) => {
      const li = document.createElement('li');
      li.className = 'motorhomes__nav--item' + (index === 0 ? ' active' : '');
      li.setAttribute('data-index', index);
      
      const button = document.createElement('button');
      button.className = 'motorhomes__nav--btn';
      button.setAttribute('aria-label', `View image ${index + 1}`);
      
      const img = document.createElement('img');
      img.src = image.thumbnail;
      img.alt = image.alt;
      img.className = 'motorhomes__nav--img';
      
      button.appendChild(img);
      li.appendChild(button);
      thumbnailList.appendChild(li);
      
      button.addEventListener('click', () => changeMotorhomeImage(index));
    });
    
    // Обработчик клика на главное изображение
    mainImage.addEventListener('click', () => openLightbox(motorhomesData.currentImageIndex));
    
    // Инициализация табов
    initMotorhomeTabs();
    
    // Инициализация лайтбокса
    initLightbox();
    
    // Инициализация календаря
    initCalendar();
    
    // Обновление отображаемого периода
    updateSelectedPeriod();
    
    // Обработчики кнопок
    document.querySelectorAll('.motorhomes-buttons--btn').forEach((button) => {
      button.addEventListener('click', function() {
        const buttonText = this.textContent.trim().toLowerCase();
        
        if (buttonText === 'get in touch') {
          alert('Contact form will open here. You selected period: ' + 
                document.getElementById('selectedPeriod').textContent);
        } else if (buttonText === 'book now') {
          const isAgreed = document.getElementById('agreeTerms')?.checked;
          
          if (isAgreed) {
            alert('Booking confirmed for period: ' + 
                  document.getElementById('selectedPeriod').textContent);
          } else {
            alert('Please agree to the rental terms and privacy policy');
          }
        }
      });
    });
  }

  function changeMotorhomeImage(index) {
    if (index < 0 || index >= motorhomesData.images.length) return;
    
    motorhomesData.currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    
    mainImage.src = motorhomesData.images[index].main;
    mainImage.alt = motorhomesData.images[index].alt;
    
    document.querySelectorAll('.motorhomes__nav--item').forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  function initMotorhomeTabs() {
    const tabButtons = document.querySelectorAll('.motorhomes-tabs--btn');
    const tabContents = document.querySelectorAll('.motorhomes-content');
    
    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabId)?.classList.add('active');
      });
    });
  }

  function initLightbox() {
    const lightboxToggle = document.getElementById('lightboxToggle');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!lightboxToggle || !lightbox) return;
    
    lightboxToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(motorhomesData.currentImageIndex);
    });
    
    function openLightbox(index) {
      motorhomesData.currentImageIndex = index;
      lightboxImage.src = motorhomesData.images[index].main;
      lightboxImage.alt = motorhomesData.images[index].alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    
    function navigateLightbox(direction) {
      let newIndex = motorhomesData.currentImageIndex + direction;
      
      if (newIndex < 0) {
        newIndex = motorhomesData.images.length - 1;
      } else if (newIndex >= motorhomesData.images.length) {
        newIndex = 0;
      }
      
      openLightbox(newIndex);
    }
    
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext?.addEventListener('click', () => navigateLightbox(1));
    
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape': closeLightbox(); break;
        case 'ArrowLeft': navigateLightbox(-1); break;
        case 'ArrowRight': navigateLightbox(1); break;
      }
    });
  }

  function initCalendar() {
    const calendarModal = document.getElementById('calendarModal');
    const openCalendar = document.getElementById('openCalendar');
    const calendarClose = document.getElementById('calendarClose');
    const cancelDates = document.getElementById('cancelDates');
    const applyDates = document.getElementById('applyDates');
    const datepicker = document.getElementById('datepicker');
    
    if (!calendarModal || !openCalendar) return;
    
    const flatpickrInstance = flatpickr(datepicker, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      minDate: 'today',
      defaultDate: [motorhomesData.selectedDates.start, motorhomesData.selectedDates.end],
      onChange: function(selectedDates) {
        if (selectedDates.length === 2) {
          motorhomesData.selectedDates.start = selectedDates[0];
          motorhomesData.selectedDates.end = selectedDates[1];
        }
      },
    });
    
    openCalendar.addEventListener('click', () => {
      calendarModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    function closeCalendarModal() {
      calendarModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    
    calendarClose?.addEventListener('click', closeCalendarModal);
    cancelDates?.addEventListener('click', closeCalendarModal);
    
    applyDates?.addEventListener('click', () => {
      const dates = flatpickrInstance.selectedDates;
      
      if (dates.length === 2) {
        motorhomesData.selectedDates.start = dates[0];
        motorhomesData.selectedDates.end = dates[1];
        updateSelectedPeriod();
        closeCalendarModal();
      } else {
        alert('Please select a date range');
      }
    });
    
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) closeCalendarModal();
    });
  }

  function updateSelectedPeriod() {
    const periodElement = document.getElementById('selectedPeriod');
    
    if (periodElement && motorhomesData.selectedDates.start && motorhomesData.selectedDates.end) {
      const startDate = motorhomesData.selectedDates.start;
      const endDate = motorhomesData.selectedDates.end;
      
      const startFormatted = formatDate(startDate);
      const endFormatted = formatDate(endDate);
      
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      periodElement.textContent = `${startFormatted} - ${endFormatted} (${diffDays} DAYS)`;
    }
  }

  // ========== МАРШРУТЫ ==========
  const routesData = {
    norway: {
      map: 'norway-map',
      markers: 'norway-markers',
      title: 'The Grand Voyager: From Fjords to the Arctic',
      description: "This epic route will take you from the heart of the Norwegian fjords to the harsh beauty of the Arctic Circle, revealing all of Norway's contrasts. Perfect for those who want to see the most impressive sights in one trip.",
      days: '14-16 days',
      distance: '~2200 - 2500 km',
    },
    austria: {
      map: 'austria-map',
      markers: 'austria-markers',
      title: 'Alpine Adventure: Austrian Mountain Odyssey',
      description: 'Discover the majestic Austrian Alps on this breathtaking route through snow-capped peaks, crystal-clear lakes, and charming mountain villages. Experience the best of Austrian culture and natural beauty.',
      days: '10-12 days',
      distance: '~1200 - 1500 km',
    },
  };

  let swipers = {};
  let currentRoute = 'norway';

  function initRoutes() {
    // Инициализация Swiper слайдеров
    const norwaySlider = document.querySelector('#route-1 .swiper');
    const austriaSlider = document.querySelector('#route-2 .swiper');
    
    if (norwaySlider) {
      swipers.norway = new Swiper(norwaySlider, {
        direction: 'horizontal',
        loop: false,
        pagination: {
          el: '#route-1 .swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '#route-1 .swiper-button-next',
          prevEl: '#route-1 .swiper-button-prev',
        },
      });
      
      swipers.norway.on('slideChange', function() {
        highlightMarker('norway', this.activeIndex);
      });
    }
    
    if (austriaSlider) {
      swipers.austria = new Swiper(austriaSlider, {
        direction: 'horizontal',
        loop: false,
        pagination: {
          el: '#route-2 .swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '#route-2 .swiper-button-next',
          prevEl: '#route-2 .swiper-button-prev',
        },
      });
      
      swipers.austria.on('slideChange', function() {
        highlightMarker('austria', this.activeIndex);
      });
    }
    
    // Инициализация маркеров
    initMarkers();
    
    // Инициализация наведения на слайды
    initSlideHover();
    
    // Обработчики событий для кнопок вкладок
    document.querySelectorAll('.routes-tabs--btn').forEach((btn) => {
      btn.addEventListener('click', function() {
        const routeId = this.dataset.route;
        switchRoute(routeId);
      });
    });
  }

  function highlightMarker(routeId, slideIndex) {
    const markersContainer = document.getElementById(`${routeId}-markers`);
    if (!markersContainer) return;
    
    const markers = markersContainer.querySelectorAll('.marker');
    const popups = markersContainer.querySelectorAll('.marker-popup');
    
    markers.forEach(marker => marker.classList.remove('active'));
    popups.forEach(popup => popup.classList.remove('show'));
    
    const dayNumber = slideIndex + 1;
    const marker = markersContainer.querySelector(`.marker[data-day="${dayNumber}"]`);
    const popup = markersContainer.querySelector(`#popup-${dayNumber}-${routeId}`);
    
    if (marker) {
      marker.classList.add('active');
    }
    
    if (popup) {
      const markerTop = marker.offsetTop;
      const markerLeft = marker.offsetLeft;
      
      popup.style.top = `${markerTop - popup.offsetHeight - 10}px`;
      popup.style.left = `${markerLeft}px`;
      popup.classList.add('show');
      
      setTimeout(() => {
        popup.classList.remove('show');
      }, 3000);
    }
  }

  function switchRoute(routeId) {
    document.querySelectorAll('.routes-tabs--btn').forEach((btn) => {
      btn.classList.remove('active');
      if (btn.dataset.route === routeId) btn.classList.add('active');
    });
    
    document.querySelectorAll('.routes__item').forEach((item) => {
      item.classList.remove('active');
    });
    
    if (routeId === 'norway') {
      document.getElementById('route-1')?.classList.add('active');
    } else {
      document.getElementById('route-2')?.classList.add('active');
    }
    
    updateMap(routeId);
    
    if (swipers[routeId]) {
      swipers[routeId].slideTo(0);
    }
    
    currentRoute = routeId;
  }

  function updateMap(routeId) {
    document.querySelectorAll('.map-image').forEach(img => img.classList.remove('active'));
    document.querySelectorAll('.markers-container').forEach(container => container.classList.remove('active'));
    document.querySelectorAll('.route-line').forEach(line => line.classList.remove('active'));
    
    const route = routesData[routeId];
    document.getElementById(route.map)?.classList.add('active');
    document.getElementById(route.markers)?.classList.add('active');
    
    const routeLine = document.querySelector(`#${route.markers} .route-line`);
    if (routeLine) routeLine.classList.add('active');
  }

  function initMarkers() {
    ['norway', 'austria'].forEach((routeId) => {
      const markersContainer = document.getElementById(`${routeId}-markers`);
      if (!markersContainer) return;
      
      const markers = markersContainer.querySelectorAll('.marker');
      const popups = markersContainer.querySelectorAll('.marker-popup');
      
      markers.forEach((marker) => {
        const dayNumber = marker.getAttribute('data-day');
        const popup = markersContainer.querySelector(`#popup-${dayNumber}-${routeId}`);
        
        marker.addEventListener('mouseenter', function() {
          this.classList.add('active');
          
          if (popup) {
            const markerTop = this.offsetTop;
            const markerLeft = this.offsetLeft;
            
            popup.style.top = `${markerTop - popup.offsetHeight - 10}px`;
            popup.style.left = `${markerLeft}px`;
            popup.classList.add('show');
          }
          
          if (currentRoute === routeId && swipers[routeId]) {
            swipers[routeId].slideTo(parseInt(dayNumber) - 1);
          }
        });
        
        marker.addEventListener('mouseleave', function() {
          this.classList.remove('active');
          if (popup) popup.classList.remove('show');
        });
        
        marker.addEventListener('click', function() {
          if (currentRoute === routeId && swipers[routeId]) {
            swipers[routeId].slideTo(parseInt(dayNumber) - 1);
          }
        });
      });
    });
  }

  function initSlideHover() {
    document.querySelectorAll('.swiper-slide').forEach((slide, index) => {
      slide.addEventListener('mouseenter', function() {
        const activeRoute = document.querySelector('.routes__item.active')?.id;
        const routeId = activeRoute === 'route-1' ? 'norway' : 'austria';
        
        const markersContainer = document.getElementById(`${routeId}-markers`);
        if (!markersContainer) return;
        
        const markers = markersContainer.querySelectorAll('.marker');
        const popups = markersContainer.querySelectorAll('.marker-popup');
        
        markers.forEach(marker => marker.classList.remove('active'));
        popups.forEach(popup => popup.classList.remove('show'));
        
        const dayNumber = index + 1;
        const marker = markersContainer.querySelector(`.marker[data-day="${dayNumber}"]`);
        const popup = markersContainer.querySelector(`#popup-${dayNumber}-${routeId}`);
        
        if (marker) {
          marker.classList.add('active');
        }
        
        if (popup) {
          const markerTop = marker.offsetTop;
          const markerLeft = marker.offsetLeft;
          
          popup.style.top = `${markerTop - popup.offsetHeight - 10}px`;
          popup.style.left = `${markerLeft}px`;
          popup.classList.add('show');
        }
      });
      
      slide.addEventListener('mouseleave', function() {
        const activeRoute = document.querySelector('.routes__item.active')?.id;
        const routeId = activeRoute === 'route-1' ? 'norway' : 'austria';
        
        const markersContainer = document.getElementById(`${routeId}-markers`);
        if (!markersContainer) return;
        
        const markers = markersContainer.querySelectorAll('.marker');
        const popups = markersContainer.querySelectorAll('.marker-popup');
        
        markers.forEach(marker => marker.classList.remove('active'));
        popups.forEach(popup => popup.classList.remove('show'));
      });
    });
  }

  // ========== ОТЗЫВЫ ==========
  function initReviews() {
    const reviewsSlider = document.querySelector('.reviews-slider');
    if (!reviewsSlider) return;
    
    const swiper = new Swiper(reviewsSlider, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      navigation: {
        nextEl: '#reviewsNext',
        prevEl: '#reviewsPrev',
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        992: { slidesPerView: 3, spaceBetween: 20 },
      },
    });
    
    function updateCounter() {
      const current = swiper.realIndex + 1;
      const total = swiper.slides.length;
      
      const currentSlideEl = document.getElementById('currentSlide');
      const totalSlidesEl = document.getElementById('totalSlides');
      
      if (currentSlideEl) currentSlideEl.textContent = current;
      if (totalSlidesEl) totalSlidesEl.textContent = total;
    }
    
    function createPagination() {
      const paginationContainer = document.getElementById('reviewsPagination');
      if (!paginationContainer) return;
      
      const totalSlides = swiper.slides.length;
      paginationContainer.innerHTML = '';
      
      for (let i = 0; i < totalSlides; i++) {
        const bullet = document.createElement('div');
        bullet.className = 'reviews__pagination--bullet' + (i === 0 ? ' active' : '');
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
    
    updateCounter();
    createPagination();
    
    swiper.on('slideChange', function() {
      updateCounter();
      updatePagination();
    });
    
    window.addEventListener('resize', updateCounter);
  }

  // ========== FAQ ==========
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    const faqMoreBtn = document.getElementById('faqMore');
    const hiddenItems = document.querySelectorAll('.faq__item.hidden');
    
    if (faqItems.length === 0) return;
    
    let isExpanded = false;
    
    function closeAllItems() {
      faqItems.forEach(item => item.classList.remove('active'));
    }
    
    function toggleItem(item) {
      const isActive = item.classList.contains('active');
      
      closeAllItems();
      
      if (!isActive) {
        item.classList.add('active');
      }
    }
    
    faqItems.forEach(item => {
      item.addEventListener('click', function(e) {
        if (e.target === faqMoreBtn) return;
        toggleItem(this);
      });
    });
    
    if (faqMoreBtn && hiddenItems.length > 0) {
      faqMoreBtn.addEventListener('click', function() {
        if (!isExpanded) {
          hiddenItems.forEach(item => {
            item.classList.remove('hidden');
            item.classList.add('show');
          });
          
          this.textContent = 'Show less';
          isExpanded = true;
        } else {
          hiddenItems.forEach(item => {
            item.classList.add('hidden');
            item.classList.remove('show');
            item.classList.remove('active');
          });
          
          this.textContent = 'View more';
          isExpanded = false;
          
          document.getElementById('faq')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    }
    
    // Инициализация - первый вопрос открыт
    faqItems[0]?.classList.add('active');
    
    // Обработка клавиатуры для доступности
    document.addEventListener('keydown', function(e) {
      const activeItem = document.querySelector('.faq__item.active');
      const allVisibleItems = document.querySelectorAll('.faq__item:not(.hidden)');
      
      if (!activeItem) return;
      
      const currentIndex = Array.from(allVisibleItems).indexOf(activeItem);
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < allVisibleItems.length - 1) {
            toggleItem(allVisibleItems[currentIndex + 1]);
            allVisibleItems[currentIndex + 1].focus();
          }
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            toggleItem(allVisibleItems[currentIndex - 1]);
            allVisibleItems[currentIndex - 1].focus();
          }
          break;
          
        case 'Home':
          e.preventDefault();
          toggleItem(allVisibleItems[0]);
          allVisibleItems[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          toggleItem(allVisibleItems[allVisibleItems.length - 1]);
          allVisibleItems[allVisibleItems.length - 1].focus();
          break;
          
        case 'Escape':
          closeAllItems();
          break;
      }
    });
  }

  // ========== ИНИЦИАЛИЗАЦИЯ ВСЕХ КОМПОНЕНТОВ ==========
  initMotorhomes();
  initRoutes();
  initReviews();
  initFAQ();
});