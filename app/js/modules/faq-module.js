export const FAQModule = {
  init() {
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
    this.initKeyboardNavigation(faqItems, hiddenItems);
  },

  initKeyboardNavigation(faqItems, hiddenItems) {
    document.addEventListener('keydown', function(e) {
      const activeItem = document.querySelector('.faq__item.active');
      const allVisibleItems = document.querySelectorAll('.faq__item:not(.hidden)');
      
      if (!activeItem) return;
      
      const currentIndex = Array.from(allVisibleItems).indexOf(activeItem);
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < allVisibleItems.length - 1) {
            FAQModule.toggleItem(allVisibleItems[currentIndex + 1]);
            allVisibleItems[currentIndex + 1].focus();
          }
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            FAQModule.toggleItem(allVisibleItems[currentIndex - 1]);
            allVisibleItems[currentIndex - 1].focus();
          }
          break;
          
        case 'Home':
          e.preventDefault();
          FAQModule.toggleItem(allVisibleItems[0]);
          allVisibleItems[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          FAQModule.toggleItem(allVisibleItems[allVisibleItems.length - 1]);
          allVisibleItems[allVisibleItems.length - 1].focus();
          break;
          
        case 'Escape':
          FAQModule.closeAllItems();
          break;
      }
    });
  },

  closeAllItems() {
    document.querySelectorAll('.faq__item').forEach(item => item.classList.remove('active'));
  },

  toggleItem(item) {
    const isActive = item.classList.contains('active');
    
    this.closeAllItems();
    
    if (!isActive) {
      item.classList.add('active');
    }
  },
};