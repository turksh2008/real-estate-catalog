/* <property-carousel :images="[...]" :tall="false" @open="..." />
   Swipeable image strip with arrows + dots. Keeps its own index (local state). */
(function (w) {
  'use strict';

  w.Vue.component('property-carousel', {
    props: {
      images: { type: Array, required: true },
      tall: { type: Boolean, default: false }
    },

    data: function () {
      return { index: 0 };
    },

    computed: {
      hasMultiple: function () { return this.images.length > 1; }
    },

    methods: {
      scroll: function (dir) {
        var el = this.$refs.track;
        if (!el) return;
        var step = el.clientWidth;
        var offset = dir === 'next' ? -step : step; // RTL layout
        if (el.scrollBy) el.scrollBy({ left: offset, behavior: 'smooth' });
        else el.scrollLeft += offset;
      },

      // Throttle scroll -> index math to one calc per frame.
      onScroll: function () {
        if (this._raf) return;
        var self = this;
        this._raf = w.requestAnimationFrame(function () {
          self._raf = 0;
          var el = self.$refs.track;
          if (el) self.index = Math.round(Math.abs(el.scrollLeft) / el.clientWidth) || 0;
        });
      },

      onImgError: function (e) {
        if (e.target && e.target.src !== w.PLACEHOLDER_IMG) e.target.src = w.PLACEHOLDER_IMG;
      },

      emitOpen: function () { this.$emit('open'); }
    },

    beforeDestroy: function () {
      if (this._raf) w.cancelAnimationFrame(this._raf);
    },

    template: [
      '<div class="carousel-wrapper">',
      '  <div v-if="hasMultiple" class="swipe-badge">',
      '    <span class="material-icons" style="font-size:14px;">swipe</span><span>سحب</span>',
      '  </div>',
      '  <button v-if="hasMultiple" class="carousel-arrow right" @click.stop="scroll(\'next\')" aria-label="Next">',
      '    <span class="material-icons" style="font-size:18px;">chevron_right</span>',
      '  </button>',
      '  <div class="carousel-container" ref="track" @scroll.passive="onScroll">',
      '    <div v-for="(img, i) in images" :key="i" class="carousel-slide" :class="{ \'is-tall\': tall }" @click="emitOpen" style="cursor:pointer;">',
      '      <img :src="img" loading="lazy" decoding="async" alt="Property image" @error="onImgError">',
      '    </div>',
      '  </div>',
      '  <button v-if="hasMultiple" class="carousel-arrow left" @click.stop="scroll(\'prev\')" aria-label="Previous">',
      '    <span class="material-icons" style="font-size:18px;">chevron_left</span>',
      '  </button>',
      '  <div v-if="hasMultiple" class="carousel-dots">',
      '    <span v-for="(img, i) in images" :key="i" class="dot" :class="{ active: index === i }"></span>',
      '  </div>',
      '</div>'
    ].join('\n')
  });
})(window);
