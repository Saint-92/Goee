import { ROUTES_DATA, swipers, currentRoute } from './constants.js';

export const RoutesModule = {
  init() {
    this.initSwipers();
    this.initMarkers();
    this.initSlideHover();
    this.initTabHandlers();
  },

  // Инициализация Swiper слайдеров
  initSwipers() {
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
        RoutesModule.highlightMarker('norway', this.activeIndex);
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
        RoutesModule.highlightMarker('austria', this.activeIndex);
      });
    }
  },

  // Подсветка маркера
  highlightMarker(routeId, slideIndex) {
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
  },

  // Инициализация обработчиков вкладок
  initTabHandlers() {
    document.querySelectorAll('.routes-tabs--btn').forEach((btn) => {
      btn.addEventListener('click', function() {
        const routeId = this.dataset.route;
        RoutesModule.switchRoute(routeId);
      });
    });
  },

  // Переключение маршрута
  switchRoute(routeId) {
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
    
    this.updateMap(routeId);
    
    if (swipers[routeId]) {
      swipers[routeId].slideTo(0);
    }
    
    currentRoute = routeId;
  },

  // Обновление карты
  updateMap(routeId) {
    document.querySelectorAll('.map-image').forEach(img => img.classList.remove('active'));
    document.querySelectorAll('.markers-container').forEach(container => container.classList.remove('active'));
    document.querySelectorAll('.route-line').forEach(line => line.classList.remove('active'));
    
    const route = ROUTES_DATA[routeId];
    document.getElementById(route.map)?.classList.add('active');
    document.getElementById(route.markers)?.classList.add('active');
    
    const routeLine = document.querySelector(`#${route.markers} .route-line`);
    if (routeLine) routeLine.classList.add('active');
  },

  // Инициализация маркеров
  initMarkers() {
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
  },

  // Инициализация наведения на слайды
  initSlideHover() {
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
  },
};