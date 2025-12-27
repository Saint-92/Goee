import { MOTORHOMES_DATA, motorhomesInstances } from './constants.js';
import { Motorhome } from './motorhomes.js';
import { Utils } from './utils.js';

export const MotorhomesModule = {
  init() {
    this.initMotorhomes();
    this.initSharedModals();
    this.initShareMenu();
    this.initResizeHandler();
  },

  initMotorhomes() {
    // Создаем экземпляры для всех автодомов
    Object.keys(MOTORHOMES_DATA).forEach(motorhomeId => {
      motorhomesInstances[motorhomeId] = new Motorhome(motorhomeId);
    });
  },

  initSharedModals() {
    // Calendar modal
    const calendarModal = document.getElementById('calendarModal');
    const calendarClose = document.getElementById('calendarClose');
    const cancelDates = document.getElementById('cancelDates');
    const applyDates = document.getElementById('applyDates');
    
    function closeCalendarModal() {
      calendarModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    
    if (calendarClose) {
      calendarClose.addEventListener('click', closeCalendarModal);
    }
    
    if (cancelDates) {
      cancelDates.addEventListener('click', closeCalendarModal);
    }
    
    if (applyDates) {
      applyDates.addEventListener('click', () => {
        // Используем window.currentActiveMotorhome вместо currentActiveMotorhome
        if (window.currentActiveMotorhome && window.motorhomesFlatpickr) {
          const dates = window.motorhomesFlatpickr.selectedDates;
          
          if (dates.length === 2) {
            window.currentActiveMotorhome.updateDates(dates[0], dates[1]);
            closeCalendarModal();
          } else {
            alert('Please select both start and end dates');
          }
        }
      });
    }
    
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) {
        closeCalendarModal();
      }
    });

    // Booking modal
    const bookingModal = document.getElementById('bookingModal');
    const bookingClose = document.getElementById('bookingClose');
    const bookingForm = document.getElementById('bookingForm');
    
    function closeBookingModal() {
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    
    if (bookingClose) {
      bookingClose.addEventListener('click', closeBookingModal);
    }
    
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
    
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Используем window.currentActiveMotorhome
        if (!window.currentActiveMotorhome) return;
        
        const formData = {
          name: document.getElementById('bookingName').value,
          email: document.getElementById('bookingEmail').value,
          phone: document.getElementById('bookingPhone').value,
          notes: document.getElementById('bookingNotes').value,
          period: document.getElementById('bookingPeriod').textContent,
          price: document.getElementById('bookingPrice').textContent,
          motorhome: window.currentActiveMotorhome.data.name
        };
        
        console.log('Booking submitted:', formData);
        
        alert(`Booking confirmed!\n\nMotorhome: ${formData.motorhome}\nPeriod: ${formData.period}\nTotal: ${formData.price}\n\nWe will contact you at ${formData.email} shortly.`);
        
        closeBookingModal();
        bookingForm.reset();
      });
    }
  },

  initShareMenu() {
    const shareMenu = document.querySelector('.share-menu');
    const shareClose = document.getElementById('shareClose');
    
    if (!shareMenu) return;
    
    // Close share menu
    function closeShareMenu() {
      shareMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
      shareMenuActive = false;
      currentActiveMotorhome = null;
    }
    
    if (shareClose) {
      shareClose.addEventListener('click', closeShareMenu);
    }
    
    shareMenu.addEventListener('click', (e) => {
      if (e.target === shareMenu) {
        this.closeShareMenu();
      }
      
      const action = e.target.closest('[data-action]')?.dataset.action;
      // Используем window.currentActiveMotorhome
      if (action && window.currentActiveMotorhome) {
        this.handleShareAction(action, window.currentActiveMotorhome);
      }
    });

    // Share buttons functionality
    document.addEventListener('click', (e) => {
      if (e.target.closest('.share-button')) {
        const action = e.target.closest('.share-button').dataset.action;
        if (action && currentActiveMotorhome) {
          this.handleShareAction(action, currentActiveMotorhome);
        }
      }
    });
  },

 handleShareAction(action, motorhome) {
    if (!motorhome.shareUrl) motorhome.generateShareUrl();
    
    const url = motorhome.shareUrl;
    const text = motorhome.shareText;
    const title = motorhome.data.name;
    
    switch(action) {
      case 'facebook':
        this.shareToFacebook(url, text);
        break;
      case 'twitter':
        this.shareToTwitter(url, text);
        break;
      case 'whatsapp':
        this.shareToWhatsApp(url, text);
        break;
      case 'telegram':
        this.shareToTelegram(url, text);
        break;
      case 'email':
        this.shareToEmail(url, text, title);
        break;
      case 'copy':
        this.copyToClipboard(url);
        break;
    }
  },

  shareToFacebook(url, text) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    this.closeShareMenu();
  },

  shareToTwitter(url, text) {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    this.closeShareMenu();
  },

  shareToWhatsApp(url, text) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    this.closeShareMenu();
  },

  shareToTelegram(url, text) {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank', 'width=600,height=400');
    this.closeShareMenu();
  },

  shareToEmail(url, text, subject) {
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
    window.location.href = emailUrl;
    this.closeShareMenu();
  },

  copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          Utils.showNotification('Link copied to clipboard!');
          this.closeShareMenu();
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          this.fallbackCopy(text);
        });
    } else {
      this.fallbackCopy(text);
    }
  },

  fallbackCopy(text) {
    const input = document.getElementById('hiddenCopyInput');
    if (!input) return;
    
    input.value = text;
    input.select();
    input.setSelectionRange(0, 99999);
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        Utils.showNotification('Link copied to clipboard!');
        this.closeShareMenu();
      } else {
        Utils.showNotification('Failed to copy. Please copy manually from above.');
      }
    } catch (err) {
      Utils.showNotification('Failed to copy. Please copy manually from above.');
    }
  },

  closeShareMenu() {
    const shareMenu = document.querySelector('.share-menu');
    if (shareMenu) {
      shareMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
      // shareMenuActive не используется
      // shareMenuActive = false;
      window.currentActiveMotorhome = null;
    }
  },

  initResizeHandler() {
    window.addEventListener('resize', () => {
      Object.values(motorhomesInstances).forEach(instance => {
        instance.updateOnResize();
      });
    });
  },

  // Метод для добавления нового автодома
  addMotorhome(motorhomeData) {
    const newId = motorhomeData.id;
    MOTORHOMES_DATA[newId] = motorhomeData;
    motorhomesInstances[newId] = new Motorhome(newId);
  }
};