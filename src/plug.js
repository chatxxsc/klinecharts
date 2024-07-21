import { text, priceLine } from './utils/drawText.js';

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if (typeof window.xxscfig === 'function' && typeof window.xxscoverlay === 'function') {
      window.xxscfig(text);
      window.xxscoverlay(priceLine);
    } else {
      console.error('window.xxscfig or window.xxscoverlay is not defined');
    }
  }, 3000); // 延迟 5 秒
});