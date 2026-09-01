/* Root component: owns state, wires the pieces together, mounts on #app. */
(function (w) {
  'use strict';

  var Vue = w.Vue;
  Vue.config.productionTip = false;
  Vue.config.devtools = false;

  Vue.component('app-root', {
    data: function () {
      return {
        properties: Object.freeze([]),
        activeItem: null,
        loading: true,
        error: null,
        selectedStatus: 'all',
        selectedType: 'all',
        waNumber: w.APP_CONFIG.whatsappNumber
      };
    },

    computed: {
      filteredProperties: function () {
        var status = this.selectedStatus;
        var type = this.selectedType;
        var isSold = w.PropertyFormat.isSold;

        return this.properties.filter(function (item) {
          var sold = isSold(item);
          if (status === 'available' && sold) return false;
          if (status === 'sold' && !sold) return false;

          var lt = String(item.listingType || '').toLowerCase();
          if (type === 'sale' && !/sale|بيع/.test(lt)) return false;
          if (type === 'rent' && !/rent|إيجار|ايجار/.test(lt)) return false;
          return true;
        });
      }
    },

    methods: {
      load: function () {
        var self = this;
        this.loading = true;
        this.error = null;

        w.PropertyAPI.fetchProperties().then(function (list) {
          self.properties = Object.freeze(list);
          self.loading = false;
        }, function (err) {
          console.error('Failed to load properties:', err);
          self.properties = Object.freeze([]);
          self.loading = false;
          self.error = (err && err.name === 'AbortError')
            ? 'انتهت مهلة الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مجدداً.'
            : 'تعذّر تحميل العقارات حالياً. يرجى المحاولة مرة أخرى.';
        });
      },
      resetFilters: function () {
        this.selectedStatus = 'all';
        this.selectedType = 'all';
      },
      openModal: function (item) { this.activeItem = item; },
      closeModal: function () { this.activeItem = null; }
    },

    mounted: function () { this.load(); },

    template: [
      '<div>',
      '  <section class="hero hero-bg is-small">',
      '    <div class="hero-body"><div class="container">',
      '      <div class="is-flex is-justify-content-space-between is-align-items-center">',
      '        <div>',
      '          <h1 class="title has-text-white is-size-3 mb-1">',
      '            <span class="material-icons" style="vertical-align:middle;">domain</span> اوتاد',
      '          </h1>',
      '          <h2 class="subtitle has-text-grey-light is-size-6 mt-1">تصفح العقارات المتاحة</h2>',
      '        </div>',
      '        <a :href="\'https://wa.me/\' + waNumber" target="_blank" rel="noopener noreferrer" class="button whatsapp-btn is-rounded">',
      '          <span class="material-icons ml-1" style="font-size:20px;">chat</span><span>تواصل معنا</span>',
      '        </a>',
      '      </div>',
      '    </div></div>',
      '  </section>',
      '',
      '  <section class="section py-5"><div class="container">',
      '',
      '    <filter-bar v-if="!loading && !error"',
      '      :status="selectedStatus" :type="selectedType" :count="filteredProperties.length"',
      '      @update:status="selectedStatus = $event" @update:type="selectedType = $event"></filter-bar>',
      '',
      '    <div v-if="loading" class="has-text-centered py-6">',
      '      <button class="button is-loading is-large is-white" style="border:none;" aria-label="Loading"></button>',
      '      <p class="has-text-grey mt-2">جاري تحميل العقارات...</p>',
      '    </div>',
      '',
      '    <div v-else-if="error" class="has-text-centered py-6">',
      '      <span class="material-icons has-text-danger" style="font-size:48px;">wifi_off</span>',
      '      <p class="is-size-5 has-text-grey mt-2">{{ error }}</p>',
      '      <button class="button is-small is-dark mt-3" @click="load">إعادة المحاولة</button>',
      '    </div>',
      '',
      '    <div v-else-if="filteredProperties.length === 0" class="has-text-centered py-6">',
      '      <span class="material-icons has-text-grey-light" style="font-size:48px;">search_off</span>',
      '      <p class="is-size-5 has-text-grey mt-2">لا توجد عقارات تطابق خيارات التصفية الحالية.</p>',
      '      <button class="button is-small is-light mt-3" @click="resetFilters">إعادة ضبط التصفية</button>',
      '    </div>',
      '',
      '    <div v-else class="columns is-multiline">',
      '      <div v-for="item in filteredProperties" :key="item._key" class="column is-12-mobile is-6-tablet is-4-desktop card-col">',
      '        <property-card :item="item" @open="openModal"></property-card>',
      '      </div>',
      '    </div>',
      '',
      '  </div></section>',
      '',
      '  <property-modal :item="activeItem" @close="closeModal"></property-modal>',
      '</div>'
    ].join('\n')
  });

  new Vue({
    el: '#app',
    template: '<app-root></app-root>'
  });
})(window);
