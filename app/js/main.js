// Импорт модулей
import { Utils } from './modules/utils.js';
import { MotorhomesModule } from './modules/motorhomes-module.js';
import { RoutesModule } from './modules/routes-module.js';
import { ReviewsModule } from './modules/reviews-module.js';
import { FAQModule } from './modules/faq-module.js';
import { swipers, motorhomesInstances } from './modules/constants.js';

// Главная инициализация
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing all modules...');
  
  // Инициализация общих утилит
  Utils.initSmoothScroll();
  Utils.initHeaderScroll();
  
  // Инициализация модулей
  MotorhomesModule.init();
  RoutesModule.init();
  ReviewsModule.init();
  FAQModule.init();
  
  // Обработчики ресайза
  window.addEventListener('resize', () => {
    if (swipers.norway) {
      swipers.norway.update();
    }
    if (swipers.austria) {
      swipers.austria.update();
    }
  });
  
  // Экспорт для глобального использования
  window.MotorhomesModule = MotorhomesModule;
  window.motorhomesInstances = motorhomesInstances;
  
  console.log('All modules initialized successfully');
});