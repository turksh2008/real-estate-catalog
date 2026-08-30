/* Pure presentation helpers (no Vue, no DOM).
   Exposed as PropertyFormat and as FormatMixin for use inside templates. */
(function (w) {
  'use strict';

  var AVAILABLE = ['available', 'active', 'متاح', 'متوفر', 'نشط'];

  function statusOf(item) {
    return String((item && item.status) || '').trim().toLowerCase();
  }

  var Format = {
    formatPrice: function (val) {
      if (val === null || val === undefined || String(val).trim() === '') return '—';
      var num = Number(String(val).replace(/[^0-9.\-]/g, ''));
      return isNaN(num) ? String(val) : num.toLocaleString('en-US');
    },

    // Any status that isn't "available" (or blank) counts as sold / rented / reserved.
    isSold: function (item) {
      var v = statusOf(item);
      return v !== '' && AVAILABLE.indexOf(v) === -1;
    },

    // Arabic label shown in the card / modal tag.
    getStatusText: function (item) {
      var v = statusOf(item);
      if (v === '' || AVAILABLE.indexOf(v) !== -1) return 'متاح';
      if (/rent|مؤجر|إيجار|ايجار/.test(v)) return 'تم التأجير';
      if (/reserv|محجوز|حجز/.test(v)) return 'محجوز';
      return 'تم البيع';
    },

    // Short uppercase word on the grayscale corner ribbon.
    getStatusBadge: function (item) {
      var v = statusOf(item);
      if (/rent|مؤجر|إيجار|ايجار/.test(v)) return 'RENTED';
      if (/reserv|محجوز|حجز/.test(v)) return 'RESERVED';
      return 'SOLD';
    }
  };

  w.PropertyFormat = Format;

  w.FormatMixin = {
    methods: {
      formatPrice: Format.formatPrice,
      isSold: Format.isSold,
      getStatusText: Format.getStatusText,
      getStatusBadge: Format.getStatusBadge
    }
  };
})(window);
