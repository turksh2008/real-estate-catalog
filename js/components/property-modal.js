/* <property-modal :item="activeItem" @close="..." />
   Details dialog. item === null means closed. */
(function (w) {
  'use strict';

  w.Vue.component('property-modal', {
    mixins: [w.FormatMixin],

    props: {
      item: { type: Object, default: null }
    },

    computed: {
      sold: function () { return this.item ? this.isSold(this.item) : false; },
      isLand: function () { return this.item && this.item.propertyType === 'Land'; },
      waLink: function () {
        if (!this.item) return '#';
        return 'https://wa.me/' + w.APP_CONFIG.whatsappNumber +
          '?text=' + encodeURIComponent('مرحباً، أود الاستفسار عن: ' + this.item.title);
      }
    },

    watch: {
      // Lock background scroll while the dialog is open.
      item: function (val) {
        document.documentElement.style.overflow = val ? 'hidden' : '';
      }
    },

    beforeDestroy: function () {
      document.documentElement.style.overflow = '';
    },

    methods: {
      close: function () { this.$emit('close'); }
    },

    template: [
      '<div class="modal" :class="{ \'is-active\': item }">',
      '  <div class="modal-background" @click="close"></div>',
      '  <div class="modal-card" v-if="item" style="max-width:700px;width:92%;">',
      '    <header class="modal-card-head">',
      '      <p class="modal-card-title">{{ item.title }}</p>',
      '      <button class="delete" aria-label="close" @click="close"></button>',
      '    </header>',
      '    <section class="modal-card-body">',
      '      <div style="border-radius:8px;overflow:hidden;" :style="sold ? \'filter:grayscale(100%);\' : \'\'">',
      '        <property-carousel :images="item.images" :tall="true"></property-carousel>',
      '      </div>',
      '      <div class="content mt-4">',
      '        <div class="mb-2">',
      '          <span class="tag is-rounded has-text-weight-bold" :class="sold ? \'is-dark\' : \'is-info is-light\'">',
      '            {{ sold ? getStatusText(item) : item.listingType }}',
      '          </span>',
      '        </div>',
      '        <h3 class="has-text-primary" :class="{ \'strike-price\': sold }">OMR {{ formatPrice(item.price) }}</h3>',
      '        <p v-if="item.location"><strong>الموقع:</strong> {{ item.location }}</p>',
      '        <div class="is-flex is-align-items-center my-3 py-2" style="border-top:1px solid #eee;border-bottom:1px solid #eee;">',
      '          <div class="spec-item" v-if="item.bedrooms && !isLand">',
      '            <span class="material-icons" style="font-size:18px;">king_bed</span> {{ item.bedrooms }} غرف',
      '          </div>',
      '          <div class="spec-item" v-if="item.bathrooms && !isLand">',
      '            <span class="material-icons" style="font-size:18px;">bathtub</span> {{ item.bathrooms }} حمام',
      '          </div>',
      '          <div class="spec-item" v-if="item.landSize">',
      '            <span class="material-icons" style="font-size:18px;">square_foot</span> {{ item.landSize }} م²',
      '          </div>',
      '        </div>',
      '        <template v-if="item.description">',
      '          <p><strong>الوصف:</strong></p>',
      '          <p style="white-space:pre-line;">{{ item.description }}</p>',
      '        </template>',
      '        <div class="mt-5">',
      '          <a :href="waLink" target="_blank" rel="noopener noreferrer" class="button whatsapp-btn is-fullwidth">',
      '            <span class="material-icons ml-1">chat</span> تواصل معنا عبر واتساب',
      '          </a>',
      '        </div>',
      '      </div>',
      '    </section>',
      '  </div>',
      '</div>'
    ].join('\n')
  });
})(window);
