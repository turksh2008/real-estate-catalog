/* Global configuration + shared constants.
   Change the Google Apps Script URL / WhatsApp number here only. */
(function (w) {
  'use strict';

  w.APP_CONFIG = {
    webAppUrl: 'https://script.google.com/macros/s/AKfycbz0QPRz1P_Q_pNHLS3fSlcLg_SvWAbWpIXLYnvgTq2bHAUkA0r0ImVwbb8vpVUXRlI8CQ/exec',
    whatsappNumber: '96894249942',
    requestTimeoutMs: 15000,
    maxAttempts: 3
  };

  // Inline SVG placeholder — no external request, works offline.
  w.PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="230">' +
    '<rect width="400" height="230" fill="#e2e8f0"/>' +
    '<text x="50%" y="50%" fill="#94a3b8" font-family="sans-serif" font-size="18" ' +
    'text-anchor="middle" dominant-baseline="middle">لا توجد صورة</text></svg>'
  );
})(window);
