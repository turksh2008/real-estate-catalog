/* <filter-bar :status :type :count @update:status @update:type />
   Stateless: parent owns the selected values. */
(function (w) {
  'use strict';

  w.Vue.component('filter-bar', {
    props: {
      status: { type: String, required: true },
      type: { type: String, required: true },
      count: { type: Number, default: 0 }
    },

    template: [
      '<div class="filter-card mb-5">',
      '  <div class="columns is-vcentered is-mobile is-multiline">',
      '',
      '    <div class="column is-12-mobile is-6-tablet is-5-desktop">',
      '      <label class="label is-small has-text-grey">الحالة:</label>',
      '      <div class="buttons has-addons filter-tabs mb-0">',
      '        <button class="button is-small" :class="{ \'is-dark\': status === \'all\' }" @click="$emit(\'update:status\', \'all\')">الكل</button>',
      '        <button class="button is-small" :class="{ \'is-dark\': status === \'available\' }" @click="$emit(\'update:status\', \'available\')">المتاحة فقط</button>',
      '        <button class="button is-small" :class="{ \'is-dark\': status === \'sold\' }" @click="$emit(\'update:status\', \'sold\')">المباعة / المؤجرة</button>',
      '      </div>',
      '    </div>',
      '',
      '    <div class="column is-12-mobile is-6-tablet is-5-desktop">',
      '      <label class="label is-small has-text-grey">نوع العرض:</label>',
      '      <div class="buttons has-addons filter-tabs mb-0">',
      '        <button class="button is-small" :class="{ \'is-dark\': type === \'all\' }" @click="$emit(\'update:type\', \'all\')">الكل</button>',
      '        <button class="button is-small" :class="{ \'is-dark\': type === \'sale\' }" @click="$emit(\'update:type\', \'sale\')">للبيع</button>',
      '        <button class="button is-small" :class="{ \'is-dark\': type === \'rent\' }" @click="$emit(\'update:type\', \'rent\')">للإيجار</button>',
      '      </div>',
      '    </div>',
      '',
      '    <div class="column is-12-mobile is-12-tablet is-2-desktop has-text-left-desktop">',
      '      <span class="tag is-info is-light is-medium">{{ count }} عقار</span>',
      '    </div>',
      '',
      '  </div>',
      '</div>'
    ].join('\n')
  });
})(window);
