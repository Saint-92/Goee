import { MOTORHOMES_DATA } from './constants.js';
import { Utils } from './utils.js';
import { currentActiveMotorhome } from './constants.js'; 

export class Motorhome {
  constructor(motorhomeId) {
    this.id = motorhomeId;
    this.data = MOTORHOMES_DATA[motorhomeId];
    this.selectedDates = {
      start: new Date(2025, 10, 29),
      end: new Date(2025, 11, 13)
    };
    this.swiper = null;
    this.lightbox = null;
    this.shareUrl = '';
    this.shareText = '';
    
    this.init();
  }

  init() {
    this.createHTML();
    this.initSwiper();
    this.initLightbox();
    this.initTabs();
    this.initEventListeners();
    this.updatePrices();
    this.updateSelectedPeriod();
    this.applyUrlParams();
  }

  createHTML() {
    const container = document.getElementById('motorhomesContainer');
    if (!container) return;

    const motorhomeHTML = `
      <div class="motorhomes__item" id="motorhome-${this.id}">
        <div class="motorhomes__left">
          <div class="motorhomes__header">
            <div class="motorhomes__header--item">
              <span class="motorhomes__left--model">${this.data.model}</span>
              <h3 class="motorhomes__left--title">${this.data.name}</h3>
            </div>
            <div class="motorhomes__header--item">
              <ul class="motorhomes__rating">
                ${this.generateStarsHTML()}
              </ul>
              <button class="motorhomes__share" data-motorhome-id="${this.id}">
                <svg class="motorhomes__share--icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8.46505 11.2931C9.59805 10.1601 11.5741 10.1601 12.7071 11.2931L13.4141 12.0001L14.8281 10.5861L14.1211 9.87906C13.1781 8.93506 11.9221 8.41406 10.5861 8.41406C9.25005 8.41406 7.99405 8.93506 7.05105 9.87906L4.92905 12.0001C3.99384 12.939 3.46875 14.2103 3.46875 15.5356C3.46875 16.8608 3.99384 18.1321 4.92905 19.0711C5.39283 19.5357 5.9439 19.9041 6.55058 20.155C7.15725 20.4059 7.80755 20.5344 8.46405 20.5331C9.12073 20.5345 9.77122 20.4061 10.3781 20.1552C10.9849 19.9043 11.5362 19.5359 12.0001 19.0711L12.7071 18.3641L11.2931 16.9501L10.5861 17.6571C10.0225 18.2181 9.25973 18.533 8.46455 18.533C7.66938 18.533 6.90658 18.2181 6.34305 17.6571C5.78156 17.0938 5.46626 16.3309 5.46626 15.5356C5.46626 14.7402 5.78156 13.9773 6.34305 13.4141L8.46505 11.2931Z" fill="#2E2F36"/>
                  <path d="M11.9999 4.92899L11.2929 5.63599L12.7069 7.04999L13.4139 6.34299C13.9774 5.78198 14.7402 5.46702 15.5354 5.46702C16.3305 5.46702 17.0933 5.78198 17.6569 6.34299C18.2184 6.90626 18.5337 7.66916 18.5337 8.46449C18.5337 9.25983 18.2184 10.0227 17.6569 10.586L15.5349 12.707C14.4019 13.84 12.4259 13.84 11.2929 12.707L10.5859 12L9.17188 13.414L9.87887 14.121C10.8219 15.065 12.0779 15.586 13.4139 15.586C14.7499 15.586 16.0059 15.065 16.9489 14.121L19.0709 12C20.0061 11.061 20.5312 9.78975 20.5312 8.46449C20.5312 7.13924 20.0061 5.86797 19.0709 4.92899C18.1324 3.9928 16.861 3.46704 15.5354 3.46704C14.2098 3.46704 12.9383 3.9928 11.9999 4.92899Z" fill="#2E2F36"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="motorhomes__slider">
            <div class="swiper motorhomes-swiper" id="swiper-${this.id}">
              <div class="swiper-wrapper">
                ${this.generateSlidesHTML()}
              </div>
              
              <button class="lightbox-toggle" data-motorhome-id="${this.id}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white"/>
                </svg>
              </button>
              
              <div class="swiper-pagination" id="pagination-${this.id}"></div>
            </div>
            
            <div class="motorhomes__slider--bottom">
              <div class="motorhomes__nav">
                <button class="motorhomes__prev" data-motorhome-id="${this.id}">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="motorhomes__next" data-motorhome-id="${this.id}">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="motorhomes__right">
          ${this.generateTabsHTML()}
          ${this.generateTabContentHTML()}
          
          <div class="motorhomes-form">
            <div class="motorhomes-form--top">
              <div class="motorhomes-form--item">
                <span class="period-desc">Per day:</span>
                <div class="price">
                  <span class="price-old">€${this.data.discountPricePerDay}</span>
                  <span class="price-new" id="dailyPrice-${this.id}">€${this.data.pricePerDay}</span>
                </div>
              </div>
              <div class="motorhomes-form--item">
                <span class="period-desc">Total price:</span>
                <div class="price">
                  <span class="price-old" id="oldTotalPrice-${this.id}">€2100</span>
                  <span class="price-new" id="totalPrice-${this.id}">€1880</span>
                </div>
              </div>
            </div>
            
            <div class="motorhomes-form--bottom">
              <button class="motorhomes-form--btn" data-motorhome-id="${this.id}">
                <span class="motorhomes-form-period" id="selectedPeriod-${this.id}">29 NOV - 13 DEC 2025 (14 DAYS)</span>
              </button>
              <button class="motorhomes-form--btn" data-motorhome-id="${this.id}">book now</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', motorhomeHTML);
  }

  generateStarsHTML() {
    let starsHTML = '';
    for (let i = 0; i < this.data.rating; i++) {
      starsHTML += `
        <li>
          <svg class="motorhomes__rating--star" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0L13.09 6.26L20 7.27L15 12.14L16.18 19.02L10 15.77L3.82 19.02L5 12.14L0 7.27L6.91 6.26L10 0Z" fill="#A5E600"/>
          </svg>
        </li>
      `;
    }
    return starsHTML;
  }

  generateSlidesHTML() {
    return this.data.images.map((image, index) => `
      <div class="swiper-slide">
        <a href="${image.src}" data-lightbox="motorhomes-gallery-${this.id}" data-title="${image.alt}">
          <img src="${image.src}" alt="${image.alt}" class="swiper-image" loading="lazy">
        </a>
      </div>
    `).join('');
  }

  generateTabsHTML() {
    if (this.id === 'adria-s75-sl-2023') {
      return `
        <nav class="motorhomes-tabs">
          <ul class="motorhomes-tabs--list">
            <li class="motorhomes-tabs--item">
              <button class="motorhomes-tabs--btn active" data-tab="description-${this.id}">Description</button>
            </li>
            <li class="motorhomes-tabs--item">
              <button class="motorhomes-tabs--btn" data-tab="overview-${this.id}">Overview</button>
            </li>
            <li class="motorhomes-tabs--item">
              <button class="motorhomes-tabs--btn" data-tab="specifications-${this.id}">Specifications</button>
            </li>
          </ul>
        </nav>
      `;
    } else {
      return `
        <nav class="motorhomes-tabs">
          <ul class="motorhomes-tabs--list">
            <li class="motorhomes-tabs--item">
              <button class="motorhomes-tabs--btn active" data-tab="description-${this.id}">Description</button>
            </li>
            <li class="motorhomes-tabs--item">
              <button class="motorhomes-tabs--btn" data-tab="features-${this.id}">Features</button>
            </li>
            <li class="motorhomes-tabs--item">
              <button class="motorhomes-tabs--btn" data-tab="specifications-${this.id}">Specifications</button>
            </li>
          </ul>
        </nav>
      `;
    }
  }

  generateTabContentHTML() {
    if (this.id === 'adria-s75-sl-2023') {
      return `
        <div class="motorhomes-content active" id="description-${this.id}">
          <div class="motorhomes-data--item">
            <p class="motorhomes-data--desc main-desc">"6 proper beds, no van crampedness, no need to rebuild every night — just B license and go!"</p>
            <p class="motorhomes-data--desc">${this.data.description}</p>
            <div class="motorhomes-icons">
              ${this.data.icons.map(icon => `
                <div class="motorhomes-icons--item">
                  <img src="${icon.src}" alt="${icon.alt}" class="motorhomes-icons--img">
                  <span class="motorhomes-icons--desc">${icon.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="motorhomes-content" id="overview-${this.id}">
          <div class="motorhomes-data--item">
            <h4 class="motorhomes-data--title">Driving & Tech</h4>
            <table>
              <thead>
                <tr>
                  <td>Parameter</td>
                  <td>Data</td>
                </tr>
              </thead>
              <tbody>
                ${this.data.specifications.driving.map(spec => `
                  <tr>
                    <td>${spec.parameter}</td>
                    <td>${spec.value}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="motorhomes-content" id="specifications-${this.id}">
          <div class="motorhomes-data--item">
            <h4 class="motorhomes-data--title">Technical Specifications</h4>
            <table>
              <thead>
                <tr>
                  <td>Parameter</td>
                  <td>Data</td>
                </tr>
              </thead>
              <tbody>
                ${this.data.specifications.technical.map(spec => `
                  <tr>
                    <td>${spec.parameter}</td>
                    <td>${spec.value}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="motorhomes-content active" id="description-${this.id}">
          <div class="motorhomes-data--item">
            <p class="motorhomes-data--desc main-desc">The perfect combination of German engineering and modern comfort. Ideal for long journeys.</p>
            <p class="motorhomes-data--desc">${this.data.description}</p>
            <div class="motorhomes-icons">
              ${this.data.icons.map(icon => `
                <div class="motorhomes-icons--item">
                  <img src="${icon.src}" alt="${icon.alt}" class="motorhomes-icons--img">
                  <span class="motorhomes-icons--desc">${icon.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="motorhomes-content" id="features-${this.id}">
          <div class="motorhomes-data--item">
            <h4 class="motorhomes-data--title">Features</h4>
            <ul>
              ${this.data.specifications.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="motorhomes-content" id="specifications-${this.id}">
          <div class="motorhomes-data--item">
            <h4 class="motorhomes-data--title">Technical Specifications</h4>
            <table>
              <thead>
                <tr>
                  <td>Parameter</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                ${this.data.specifications.technical.map(spec => `
                  <tr>
                    <td>${spec.parameter}</td>
                    <td>${spec.value}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  }

  initSwiper() {
    const swiperElement = document.getElementById(`swiper-${this.id}`);
    if (!swiperElement) return;

    this.swiper = new Swiper(swiperElement, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      pagination: {
        el: `#pagination-${this.id}`,
        clickable: true,
        dynamicBullets: true,
      },
      navigation: false,
      speed: 500,
      on: {
        init: () => {
          this.updateNavigationButtons();
        },
        slideChange: () => {
          this.updateNavigationButtons();
        }
      }
    });
  }

  initLightbox() {
    this.lightbox = new SimpleLightbox(`[data-lightbox="motorhomes-gallery-${this.id}"]`, {
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
  }

  initTabs() {
    const tabButtons = document.querySelectorAll(`#motorhome-${this.id} .motorhomes-tabs--btn`);
    const tabContents = document.querySelectorAll(`#motorhome-${this.id} .motorhomes-content`);
    
    tabButtons.forEach(button => {
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

  initEventListeners() {
    // Share button
    const shareButton = document.querySelector(`#motorhome-${this.id} .motorhomes__share`);
    if (shareButton) {
      shareButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleShare();
      });
    }

    // Lightbox toggle
    const lightboxToggle = document.querySelector(`#motorhome-${this.id} .lightbox-toggle`);
    if (lightboxToggle) {
      lightboxToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openLightbox();
      });
    }

    // Navigation buttons
    const prevButton = document.querySelector(`#motorhome-${this.id} .motorhomes__prev`);
    const nextButton = document.querySelector(`#motorhome-${this.id} .motorhomes__next`);
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (this.swiper) this.swiper.slidePrev();
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (this.swiper) this.swiper.slideNext();
      });
    }

    // Calendar button
    const calendarButton = document.querySelector(`#motorhome-${this.id} .motorhomes-form--btn:first-child`);
    if (calendarButton) {
      calendarButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCalendar();
      });
    }

    // Book now button
    const bookNowButton = document.querySelector(`#motorhome-${this.id} .motorhomes-form--btn:last-child`);
    if (bookNowButton) {
      bookNowButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.openBookingModal();
      });
    }

    // Image click to open lightbox
    document.querySelectorAll(`#motorhome-${this.id} .swiper-slide img`).forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openLightbox();
      });
    });
  }

  updateNavigationButtons() {
    if (!this.swiper) return;
    
    const prevButton = document.querySelector(`#motorhome-${this.id} .motorhomes__prev`);
    const nextButton = document.querySelector(`#motorhome-${this.id} .motorhomes__next`);
    
    if (prevButton) {
      if (this.swiper.isBeginning) {
        prevButton.classList.add('swiper-button-disabled');
      } else {
        prevButton.classList.remove('swiper-button-disabled');
      }
    }
    
    if (nextButton) {
      if (this.swiper.isEnd) {
        nextButton.classList.add('swiper-button-disabled');
      } else {
        nextButton.classList.remove('swiper-button-disabled');
      }
    }
  }

  updatePrices() {
    const days = Utils.calculateDays(this.selectedDates.start, this.selectedDates.end);
    const totalWithoutDiscount = this.data.pricePerDay * days;
    const totalWithDiscount = Math.round(totalWithoutDiscount * this.data.discount);
    
    const dailyPriceElement = document.getElementById(`dailyPrice-${this.id}`);
    const oldTotalPriceElement = document.getElementById(`oldTotalPrice-${this.id}`);
    const totalPriceElement = document.getElementById(`totalPrice-${this.id}`);
    
    if (dailyPriceElement) dailyPriceElement.textContent = `€${this.data.pricePerDay}`;
    if (oldTotalPriceElement) oldTotalPriceElement.textContent = `€${Math.round(totalWithoutDiscount)}`;
    if (totalPriceElement) totalPriceElement.textContent = `€${totalWithDiscount}`;
  }

  updateSelectedPeriod() {
    const periodElement = document.getElementById(`selectedPeriod-${this.id}`);
    if (!periodElement) return;
    
    const days = Utils.calculateDays(this.selectedDates.start, this.selectedDates.end);
    const periodText = `${Utils.formatDate(this.selectedDates.start)} - ${Utils.formatDate(this.selectedDates.end)} (${days} DAYS)`;
    periodElement.textContent = periodText;
  }

  handleShare() {
    this.generateShareUrl();
    
    if (navigator.share) {
      navigator.share({
        title: this.data.name,
        text: `Check out the ${this.data.name} motorhome! Available from ${Utils.formatDate(this.selectedDates.start)} to ${Utils.formatDate(this.selectedDates.end)}.`,
        url: this.shareUrl,
      }).catch(error => {
        if (error.name !== 'AbortError') {
          this.openShareMenu();
        }
      });
    } else {
      this.openShareMenu();
    }
  }

  generateShareUrl() {
    const startDateStr = Utils.formatDateForURL(this.selectedDates.start);
    const endDateStr = Utils.formatDateForURL(this.selectedDates.end);
    
    const url = new URL(window.location.origin + window.location.pathname);
    url.hash = `#motorhome-${this.id}`;
    url.searchParams.set('motorhome', this.id);
    url.searchParams.set('start_date', startDateStr);
    url.searchParams.set('end_date', endDateStr);
    
    this.shareUrl = url.toString();
    this.shareText = `Check out the ${this.data.name} motorhome! Available from ${Utils.formatDate(this.selectedDates.start)} to ${Utils.formatDate(this.selectedDates.end)}.`;
    
    return this.shareUrl;
  }

  openShareMenu() {
    window.currentActiveMotorhome = this;
    
    const shareUrlDisplay = document.getElementById('shareUrlDisplay');
    
    if (shareUrlDisplay) {
      shareUrlDisplay.textContent = this.shareUrl;
    }
    
    document.querySelector('.share-menu').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openLightbox() {
    if (!this.swiper || !this.lightbox) return;
    
    const currentIndex = this.swiper.realIndex;
    const galleryElements = document.querySelectorAll(`[data-lightbox="motorhomes-gallery-${this.id}"]`);
    
    if (galleryElements.length > 0 && galleryElements[currentIndex]) {
      galleryElements[currentIndex].click();
    }
  }

  openCalendar() {
    window.currentActiveMotorhome = this;
    const calendarModal = document.getElementById('calendarModal');
    const datepicker = document.getElementById('datepicker');
    
    if (!calendarModal || !datepicker) return;
    
    // Initialize Flatpickr if not already initialized
    if (!window.motorhomesFlatpickr) {
      window.motorhomesFlatpickr = flatpickr(datepicker, {
        mode: "range",
        dateFormat: "d M Y",
        minDate: "today",
        defaultDate: [this.selectedDates.start, this.selectedDates.end],
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            this.selectedDates.start = selectedDates[0];
            this.selectedDates.end = selectedDates[1];
          }
        },
      });
    } else {
      window.motorhomesFlatpickr.setDate([this.selectedDates.start, this.selectedDates.end], true);
    }
    
    calendarModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openBookingModal() {
    window.currentActiveMotorhome = this;
    const bookingModal = document.getElementById('bookingModal');
    const bookingTitle = document.getElementById('bookingMotorhomeTitle');
    const bookingPeriod = document.getElementById('bookingPeriod');
    const bookingPrice = document.getElementById('bookingPrice');
    
    if (!bookingModal) return;  
    
    if (bookingTitle) {
      bookingTitle.textContent = `Book ${this.data.name}`;
    }
    
    if (bookingPeriod) {
      const days = Utils.calculateDays(this.selectedDates.start, this.selectedDates.end);
      bookingPeriod.textContent = `${Utils.formatDate(this.selectedDates.start)} - ${Utils.formatDate(this.selectedDates.end)} (${days} DAYS)`;
    }
    
    if (bookingPrice) {
      const days = Utils.calculateDays(this.selectedDates.start, this.selectedDates.end);
      const totalWithDiscount = Math.round(this.data.pricePerDay * days * this.data.discount);
      bookingPrice.textContent = `€${totalWithDiscount}`;
    }
    
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  updateDates(startDate, endDate) {
    this.selectedDates.start = startDate;
    this.selectedDates.end = endDate;
    this.updateSelectedPeriod();
    this.updatePrices();
    this.updateUrlWithDates(startDate, endDate);
  }

  updateUrlWithDates(startDate, endDate) {
    const startDateStr = Utils.formatDateForURL(startDate);
    const endDateStr = Utils.formatDateForURL(endDate);
    
    const url = new URL(window.location.origin + window.location.pathname);
    url.hash = `#motorhome-${this.id}`;
    url.searchParams.set('motorhome', this.id);
    url.searchParams.set('start_date', startDateStr);
    url.searchParams.set('end_date', endDateStr);
    
    window.history.pushState({}, '', url.toString());
  }

  applyUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const motorhomeId = urlParams.get('motorhome');
    const startDateParam = urlParams.get('start_date');
    const endDateParam = urlParams.get('end_date');
    
    if (motorhomeId && motorhomeId === this.id) {
      if (startDateParam && endDateParam) {
        try {
          const startDate = Utils.parseDateFromURL(startDateParam);
          const endDate = Utils.parseDateFromURL(endDateParam);
          
          if (startDate && endDate && startDate <= endDate) {
            this.updateDates(startDate, endDate);
            
            setTimeout(() => {
              const motorhomeElement = document.getElementById(`motorhome-${this.id}`);
              if (motorhomeElement) {
                motorhomeElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 500);
          }
        } catch (error) {
          console.error(`Error parsing dates from URL for ${this.id}:`, error);
        }
      }
    }
  }

  updateOnResize() {
    if (this.swiper) {
      this.swiper.update();
    }
  }
}