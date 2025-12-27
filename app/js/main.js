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

 // ========== МОТОРХОМЫ ==========
        const motorhomesData = {
            images: [
                {
                    id: 1,
                    src: '../images/Adria.jpg',
                    alt: 'Adria S75 SL 2023 Exterior',
                },
                {
                    id: 2,
                    src: '../images/main-2.jpeg',
                    alt: 'Adria S75 SL 2023 Interior',
                },
                {
                    id: 3,
                    src: '../images/main-3.jpeg',
                    alt: 'Adria S75 SL 2023 Kitchen',
                },
                {
                    id: 4,
                    src: '../images/main-4.jpeg',
                    alt: 'Adria S75 SL 2023 Bedroom',
                },
            ],
            selectedDates: {
                start: new Date(2025, 10, 29),
                end: new Date(2025, 11, 13),
            },
            pricePerDay: 149,
            currentImageIndex: 0,
            lightbox: null,
            swiper: null,
            shareUrl: ''
        };

        // Инициализация всех компонентов
        function initMotorhomes() {
            initSwiper();
            initLightbox();
            initCalendar();
            initShareButton();
            updatePrices();
            initTabs();
            updateSelectedPeriod();
            initCustomNavigation();
            initBookingModal();
            initShareMenu();
        }

        // Генерация URL для шаринга
        function generateShareUrl() {
            const shareButton = document.getElementById('shareButton');
            const motorhomeId = shareButton?.getAttribute('data-motorhome-id') || 'adria-s75-sl-2023';
            const startDate = motorhomesData.selectedDates.start;
            const endDate = motorhomesData.selectedDates.end;
            
            const startDateStr = formatDateForURL(startDate);
            const endDateStr = formatDateForURL(endDate);
            
            const url = new URL(window.location.origin + window.location.pathname);
            url.hash = `#motorhome-${motorhomeId}`;
            url.searchParams.set('motorhome', motorhomeId);
            url.searchParams.set('start_date', startDateStr);
            url.searchParams.set('end_date', endDateStr);
            
            motorhomesData.shareUrl = url.toString();
            return motorhomesData.shareUrl;
        }

        // Инициализация кнопки Share с меню шаринга
        function initShareButton() {
            const shareButton = document.getElementById('shareButton');
            
            if (!shareButton) return;
            
            shareButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const shareUrl = generateShareUrl();
                const shareText = `Check out the Adria S75 SL 2023 motorhome! Available from ${formatDate(motorhomesData.selectedDates.start)} to ${formatDate(motorhomesData.selectedDates.end)}.`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Adria S75 SL 2023 Motorhome',
                        text: shareText,
                        url: shareUrl,
                    })
                    .then(() => console.log('Shared successfully'))
                    .catch(error => {
                        if (error.name !== 'AbortError') {
                            openShareMenu(shareUrl, shareText);
                        }
                    });
                } else {
                    openShareMenu(shareUrl, shareText);
                }
            });
            
            applyUrlParams();
        }

        // Инициализация меню шаринга
        function initShareMenu() {
            const shareMenu = document.createElement('div');
            shareMenu.className = 'share-menu';
            shareMenu.innerHTML = `
                <div class="share-content">
                    <h3 class="share-title">Share Motorhome</h3>
                    <div class="share-buttons">
                        <button class="share-button facebook" data-action="facebook">
                            <svg class="share-button-icon" viewBox="0 0 24 24">
                                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                            </svg>
                            <span class="share-button-text">Facebook</span>
                        </button>
                        <button class="share-button twitter" data-action="twitter">
                            <svg class="share-button-icon" viewBox="0 0 24 24">
                                <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                            </svg>
                            <span class="share-button-text">Twitter</span>
                        </button>
                        <button class="share-button whatsapp" data-action="whatsapp">
                            <svg class="share-button-icon" viewBox="0 0 24 24">
                                <path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"/>
                            </svg>
                            <span class="share-button-text">WhatsApp</span>
                        </button>
                        <button class="share-button telegram" data-action="telegram">
                            <svg class="share-button-icon" viewBox="0 0 24 24">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            <span class="share-button-text">Telegram</span>
                        </button>
                        <button class="share-button email" data-action="email">
                            <svg class="share-button-icon" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            <span class="share-button-text">Email</span>
                        </button>
                        <button class="share-button copy-link" data-action="copy">
                            <svg class="share-button-icon" viewBox="0 0 24 24">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                            <span class="share-button-text">Copy Link</span>
                        </button>
                    </div>
                    <div class="share-url" id="shareUrlDisplay"></div>
                    <button class="share-close" id="shareClose">Close</button>
                </div>
            `;
            
            document.body.appendChild(shareMenu);
            
            shareMenu.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]')?.dataset.action;
                if (action) {
                    handleShareAction(action);
                }
                
                if (e.target.id === 'shareClose' || e.target === shareMenu) {
                    closeShareMenu();
                }
            });
        }

        // Открытие меню шаринга
        function openShareMenu(url, text) {
            const shareMenu = document.querySelector('.share-menu');
            const shareUrlDisplay = document.getElementById('shareUrlDisplay');
            
            if (shareMenu && shareUrlDisplay) {
                shareUrlDisplay.textContent = url;
                shareMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                motorhomesData.shareUrl = url;
                motorhomesData.shareText = text;
            }
        }

        // Закрытие меню шаринга
        function closeShareMenu() {
            const shareMenu = document.querySelector('.share-menu');
            if (shareMenu) {
                shareMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }

        // Обработка действий шаринга
        function handleShareAction(action) {
            const url = motorhomesData.shareUrl;
            const text = motorhomesData.shareText || 'Check out this amazing motorhome!';
            const title = 'Adria S75 SL 2023 Motorhome';
            
            switch(action) {
                case 'facebook':
                    shareToFacebook(url, text);
                    break;
                case 'twitter':
                    shareToTwitter(url, text);
                    break;
                case 'whatsapp':
                    shareToWhatsApp(url, text);
                    break;
                case 'telegram':
                    shareToTelegram(url, text);
                    break;
                case 'email':
                    shareToEmail(url, text, title);
                    break;
                case 'copy':
                    copyToClipboard(url);
                    break;
            }
        }

        // Шаринг в Facebook
        function shareToFacebook(url, text) {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        }

        // Шаринг в Twitter
        function shareToTwitter(url, text) {
            const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
        }

        // Шаринг в WhatsApp
        function shareToWhatsApp(url, text) {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            window.open(whatsappUrl, '_blank');
        }

        // Шаринг в Telegram
        function shareToTelegram(url, text) {
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            window.open(telegramUrl, '_blank', 'width=600,height=400');
        }

        // Шаринг по Email
        function shareToEmail(url, text, subject) {
            const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
            window.location.href = emailUrl;
        }

        // Копирование ссылки в буфер обмена
        function copyToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        showNotification('Link copied to clipboard!');
                        closeShareMenu();
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        fallbackCopy(text);
                    });
            } else {
                fallbackCopy(text);
            }
        }

        // Fallback метод копирования
        function fallbackCopy(text) {
            const input = document.getElementById('hiddenCopyInput');
            if (!input) return;
            
            input.value = text;
            input.select();
            input.setSelectionRange(0, 99999);
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showNotification('Link copied to clipboard!');
                    closeShareMenu();
                } else {
                    showNotification('Failed to copy. Please copy manually from above.');
                }
            } catch (err) {
                showNotification('Failed to copy. Please copy manually from above.');
            }
        }

        // Показать уведомление
        function showNotification(message) {
            let notification = document.getElementById('copy-notification');
            
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'copy-notification';
                document.body.appendChild(notification);
            }
            
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Инициализация Swiper
        function initSwiper() {
            const swiperWrapper = document.querySelector('.motorhomes-swiper .swiper-wrapper');
            
            if (!swiperWrapper) {
                console.error('Swiper wrapper not found');
                return;
            }
            
            swiperWrapper.innerHTML = '';
            
            motorhomesData.images.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.alt;
                img.className = 'swiper-image';
                img.loading = 'lazy';
                
                const link = document.createElement('a');
                link.href = image.src;
                link.setAttribute('data-lightbox', 'motorhomes-gallery');
                link.setAttribute('data-title', image.alt);
                
                link.appendChild(img);
                slide.appendChild(link);
                swiperWrapper.appendChild(slide);
            });
            
            motorhomesData.swiper = new Swiper('.motorhomes-swiper', {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                navigation: false,
                speed: 500,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                on: {
                    slideChange: function() {
                        motorhomesData.currentImageIndex = this.realIndex;
                    },
                    init: function() {
                        console.log('Swiper initialized with custom navigation');
                    }
                }
            });
        }

        // Инициализация кастомной навигации
        function initCustomNavigation() {
            const prevBtn = document.getElementById('motorhomesPrev');
            const nextBtn = document.getElementById('motorhomesNext');
            
            if (prevBtn && motorhomesData.swiper) {
                prevBtn.addEventListener('click', () => {
                    motorhomesData.swiper.slidePrev();
                });
                
                if (motorhomesData.swiper.isBeginning && !motorhomesData.swiper.params.loop) {
                    prevBtn.classList.add('swiper-button-disabled');
                }
            }
            
            if (nextBtn && motorhomesData.swiper) {
                nextBtn.addEventListener('click', () => {
                    motorhomesData.swiper.slideNext();
                });
                
                if (motorhomesData.swiper.isEnd && !motorhomesData.swiper.params.loop) {
                    nextBtn.classList.add('swiper-button-disabled');
                }
            }
            
            if (motorhomesData.swiper) {
                motorhomesData.swiper.on('slideChange', function() {
                    if (prevBtn && nextBtn) {
                        if (this.isBeginning && !this.params.loop) {
                            prevBtn.classList.add('swiper-button-disabled');
                        } else {
                            prevBtn.classList.remove('swiper-button-disabled');
                        }
                        
                        if (this.isEnd && !this.params.loop) {
                            nextBtn.classList.add('swiper-button-disabled');
                        } else {
                            nextBtn.classList.remove('swiper-button-disabled');
                        }
                    }
                });
            }
        }

        // Инициализация SimpleLightbox
        function initLightbox() {
            console.log('Initializing SimpleLightbox...');
            
            motorhomesData.lightbox = new SimpleLightbox('[data-lightbox="motorhomes-gallery"]', {
                captions: true,
                captionsData: 'title',
                captionPosition: 'bottom',
                close: true,
                nav: true,
                navText: ['‹', '›'],
                history: false,
                alertError: true,
                docClose: true,
                disableScroll: true,
                scrollZoom: false,
                animationSpeed: 300,
                widthRatio: 0.9,
                heightRatio: 0.9,
                scaleImageToRatio: true,
                disableRightClick: false,
                uniqueImages: true,
                fileExt: false,
            });
            
            console.log('SimpleLightbox initialized:', motorhomesData.lightbox);
            
            const lightboxToggle = document.getElementById('lightboxToggle');
            if (lightboxToggle) {
                lightboxToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Lightbox toggle clicked');
                    
                    const currentIndex = motorhomesData.swiper ? motorhomesData.swiper.realIndex : 0;
                    
                    try {
                        const galleryElements = document.querySelectorAll('[data-lightbox="motorhomes-gallery"]');
                        
                        if (galleryElements.length > 0 && galleryElements[currentIndex]) {
                            galleryElements[currentIndex].click();
                            console.log('Opened lightbox at index:', currentIndex);
                        }
                    } catch (error) {
                        console.error('Error opening lightbox:', error);
                    }
                });
            }
            
            document.querySelectorAll('.swiper-slide img').forEach((img) => {
                img.style.cursor = 'pointer';
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const link = img.closest('a');
                    if (link && motorhomesData.lightbox) {
                        link.click();
                    }
                });
            });
        }

        // Форматирование даты для URL (YYYY-MM-DD)
        function formatDateForURL(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        }

        // Применение параметров из URL
        function applyUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const motorhomeId = urlParams.get('motorhome');
            const startDateParam = urlParams.get('start_date');
            const endDateParam = urlParams.get('end_date');
            
            if (motorhomeId && motorhomeId === 'adria-s75-sl-2023') {
                if (startDateParam && endDateParam) {
                    try {
                        const startDate = parseDateFromURL(startDateParam);
                        const endDate = parseDateFromURL(endDateParam);
                        
                        if (startDate && endDate && startDate <= endDate) {
                            motorhomesData.selectedDates.start = startDate;
                            motorhomesData.selectedDates.end = endDate;
                            
                            updateSelectedPeriod();
                            updatePrices();
                            
                            setTimeout(() => {
                                const motorhomeElement = document.getElementById(`motorhome-${motorhomeId}`);
                                if (motorhomeElement) {
                                    motorhomeElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }, 500);
                            
                            console.log('Applied dates from URL:', startDate, endDate);
                        }
                    } catch (error) {
                        console.error('Error parsing dates from URL:', error);
                    }
                }
            }
        }

        // Парсинг даты из URL
        function parseDateFromURL(dateStr) {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                
                return new Date(year, month, day);
            }
            return null;
        }

        // Инициализация календаря
        function initCalendar() {
            const calendarModal = document.getElementById('calendarModal');
            const openCalendar = document.getElementById('openCalendar');
            const calendarClose = document.getElementById('calendarClose');
            const cancelDates = document.getElementById('cancelDates');
            const applyDates = document.getElementById('applyDates');
            const datepicker = document.getElementById('datepicker');
            
            if (!openCalendar || !datepicker) {
                console.error('Calendar elements not found');
                return;
            }
            
            let flatpickrInstance = null;
            
            try {
                flatpickrInstance = flatpickr(datepicker, {
                    mode: "range",
                    dateFormat: "d M Y",
                    minDate: "today",
                    defaultDate: [
                        motorhomesData.selectedDates.start,
                        motorhomesData.selectedDates.end
                    ],
                    onChange: function(selectedDates) {
                        if (selectedDates.length === 2) {
                            motorhomesData.selectedDates.start = selectedDates[0];
                            motorhomesData.selectedDates.end = selectedDates[1];
                        }
                    },
                });
                
                console.log('Flatpickr initialized successfully');
            } catch (error) {
                console.error('Error initializing Flatpickr:', error);
            }
            
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
                if (flatpickrInstance) {
                    const dates = flatpickrInstance.selectedDates;
                    
                    if (dates.length === 2) {
                        motorhomesData.selectedDates.start = dates[0];
                        motorhomesData.selectedDates.end = dates[1];
                        updateSelectedPeriod();
                        updatePrices();
                        closeCalendarModal();
                        
                        updateUrlWithDates(dates[0], dates[1]);
                    } else {
                        alert('Please select both start and end dates');
                    }
                }
            });
            
            calendarModal?.addEventListener('click', (e) => {
                if (e.target === calendarModal) {
                    closeCalendarModal();
                }
            });
        }

        // Обновление URL с датами
        function updateUrlWithDates(startDate, endDate) {
            const shareButton = document.getElementById('shareButton');
            const motorhomeId = shareButton?.getAttribute('data-motorhome-id') || 'adria-s75-sl-2023';
            const startDateStr = formatDateForURL(startDate);
            const endDateStr = formatDateForURL(endDate);
            
            const url = new URL(window.location.origin + window.location.pathname);
            url.hash = `#motorhome-${motorhomeId}`;
            url.searchParams.set('motorhome', motorhomeId);
            url.searchParams.set('start_date', startDateStr);
            url.searchParams.set('end_date', endDateStr);
            
            window.history.pushState({}, '', url.toString());
        }

        // Обновление отображаемого периода
        function updateSelectedPeriod() {
            const periodElement = document.getElementById('selectedPeriod');
            const bookingPeriodElement = document.getElementById('bookingPeriod');
            
            if (!periodElement) {
                console.error('Period element not found');
                return;
            }
            
            const start = motorhomesData.selectedDates.start;
            const end = motorhomesData.selectedDates.end;
            
            const startFormatted = formatDate(start);
            const endFormatted = formatDate(end);
            
            const timeDiff = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            
            const periodText = `${startFormatted} - ${endFormatted} (${diffDays} DAYS)`;
            periodElement.textContent = periodText;
            
            if (bookingPeriodElement) {
                bookingPeriodElement.textContent = periodText;
            }
        }

        // Форматирование даты для отображения
        function formatDate(date) {
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            
            return `${day} ${month} ${year}`;
        }

        // Обновление цен
        function updatePrices() {
            const dailyPriceElement = document.getElementById('dailyPrice');
            const totalPriceElement = document.getElementById('totalPrice');
            const oldTotalPriceElement = document.getElementById('oldTotalPrice');
            const bookingPriceElement = document.getElementById('bookingPrice');
            
            if (!dailyPriceElement || !totalPriceElement || !oldTotalPriceElement) {
                console.error('Price elements not found');
                return;
            }
            
            const start = motorhomesData.selectedDates.start;
            const end = motorhomesData.selectedDates.end;
            
            const timeDiff = Math.abs(end.getTime() - start.getTime());
            const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            
            const dailyPrice = motorhomesData.pricePerDay;
            const totalWithoutDiscount = dailyPrice * numberOfDays;
            const totalWithDiscount = Math.round(totalWithoutDiscount * 0.9);
            
            dailyPriceElement.textContent = `€${dailyPrice}`;
            oldTotalPriceElement.textContent = `€${Math.round(totalWithoutDiscount)}`;
            totalPriceElement.textContent = `€${totalWithDiscount}`;
            
            if (bookingPriceElement) {
                bookingPriceElement.textContent = `€${totalWithDiscount}`;
            }
        }

        // Инициализация табов
        function initTabs() {
            const tabButtons = document.querySelectorAll('.motorhomes-tabs--btn');
            const tabContents = document.querySelectorAll('.motorhomes-content');
            
            if (tabButtons.length === 0) {
                console.log('No tabs found');
                return;
            }
            
            tabButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    button.classList.add('active');
                    
                    const tabContent = document.getElementById(tabId);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                });
            });
        }

        // Инициализация попапа Book Now
        function initBookingModal() {
            const bookingModal = document.getElementById('bookingModal');
            const bookingClose = document.getElementById('bookingClose');
            const bookNowButton = document.getElementById('bookNowButton');
            const bookingForm = document.getElementById('bookingForm');
            
            if (!bookNowButton || !bookingModal) return;
            
            bookNowButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                updateBookingInfo();
                
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            function closeBookingModal() {
                bookingModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            bookingClose?.addEventListener('click', closeBookingModal);
            
            bookingModal.addEventListener('click', (e) => {
                if (e.target === bookingModal) {
                    closeBookingModal();
                }
            });
            
            if (bookingForm) {
                bookingForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const formData = {
                        name: document.getElementById('bookingName').value,
                        email: document.getElementById('bookingEmail').value,
                        phone: document.getElementById('bookingPhone').value,
                        notes: document.getElementById('bookingNotes').value,
                        period: document.getElementById('bookingPeriod').textContent,
                        price: document.getElementById('bookingPrice').textContent,
                        motorhome: 'Adria S75 SL 2023'
                    };
                    
                    console.log('Booking submitted:', formData);
                    
                    alert(`Booking confirmed!\n\nPeriod: ${formData.period}\nTotal: ${formData.price}\n\nWe will contact you at ${formData.email} shortly.`);
                    
                    closeBookingModal();
                    
                    bookingForm.reset();
                });
            }
        }

        // Обновление информации в попапе бронирования
        function updateBookingInfo() {
            const bookingPeriodElement = document.getElementById('bookingPeriod');
            const bookingPriceElement = document.getElementById('bookingPrice');
            
            if (bookingPeriodElement) {
                bookingPeriodElement.textContent = document.getElementById('selectedPeriod').textContent;
            }
            
            if (bookingPriceElement) {
                bookingPriceElement.textContent = document.getElementById('totalPrice').textContent;
            }
        }

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing motorhomes...');
            initMotorhomes();
        });

        // Переинициализация при изменении размера окна
        window.addEventListener('resize', () => {
            if (motorhomesData.swiper) {
                motorhomesData.swiper.update();
            }
        });

        console.log('Motorhomes script loaded');


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
  
  // Правильно добавляем обработчик ресайза
  window.addEventListener('resize', handleResize);
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