import { currentActiveMotorhome } from './constants.js';

export const Utils = {
  // Плавная прокрутка для якорей
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  },

  // Изменение хедера при скролле
  initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

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
  },

  // Форматирование даты для отображения
  formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  },

  formatDateForURL(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  parseDateFromURL(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  },

  showNotification(message) {
    const notification = document.getElementById('copy-notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  },

  calculateDays(startDate, endDate) {
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }
};