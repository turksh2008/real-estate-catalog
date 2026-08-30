/* <property-card :item="item" @open="openModal" />
   One grid card. Sold items render black & white with a corner ribbon. */
(function (w) {
  'use strict';

  w.Vue.component('property-card', {
    mixins: [w.FormatMixin],

    props: {
      item: { type: Object, required: true }
    },

    computed: {
      sold: function () { return this.isSold(this.item); },
      isLand: function () { return this.item.propertyType === 'Land'; }
    },

    methods: {
      open: function () { this.$emit('open', this.item); }
    },

    template: [
      '<div class="property-card" :class="{ \'is-sold-card\': sold }">',
      '  <div v-if="sold" class="card-sold-banner">{{ getStatusBadge(item) }}</div>',
      '',
      '  <property-carousel :images="item.images" @open="open"></property-carousel>',
      '',
      '  <div class="card-content-box" @click="open" style="cursor:pointer;">',
      '    <div>',
      '      <div class="is-flex is-justify-content-space-between is-align-items-center mb-2">',
      '        <span class="tag is-rounded has-text-weight-bold" :class="sold ? \'is-dark\' : \'is-info is-light\'">',
      '          {{ sold ? getStatusText(item) : item.listingType }}',
      '        </span>',
      '        <p class="title is-4 has-text-primary mb-0" :class="{ \'strike-price\': sold }">',
      '          OMR {{ formatPrice(item.price) }}',
      '        </p>',
      '      </div>',
      '      <h3 class="prop-title mt-2">{{ item.title }}</h3>',
      '    </div>',
      '',
      '    <div>',
      '      <p class="prop-location" v-if="item.location">',
      '        <span class="material-icons" style="font-size:16px;color:#0284c7;">place</span>',
      '        <span>{{ item.location }}</span>',
      '      </p>',
      '      <div class="is-flex is-align-items-center pt-3 mt-3" style="border-top:1px solid #f1f5f9;">',
      '        <div class="spec-item" v-if="item.bedrooms && !isLand">',
      '          <span class="material-icons" style="font-size:16px;">king_bed</span> {{ item.bedrooms }} غرف',
      '        </div>',
      '        <div class="spec-item" v-if="item.bathrooms && !isLand">',
      '          <span class="material-icons" style="font-size:16px;">bathtub</span> {{ item.bathrooms }} حمام',
      '        </div>',
      '        <div class="spec-item" v-if="item.landSize">',
      '          <span class="material-icons" style="font-size:16px;">square_foot</span> {{ item.landSize }} م²',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n')
  });
})(window);
