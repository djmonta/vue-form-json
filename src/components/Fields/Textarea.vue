<template lang="pug">
  textarea.textarea(:id="item.name || item.label | slugify",
                    :name="item.name || item.label | slugify",
                    :class="[{ 'is-danger': !!error }, item.attr && item.attr.class]",
                    v-bind="item.attr",
                    v-model="item.value",
                    :data-vv-name="item.label",
                    :placeholder="item.placeholder",
                    :required="item.isRequired !== false",
                    :minlength="item.minLength || defaultMinLength",
                    :maxlength="item.maxLength || defaultMaxLength",
                    @input="updateValue",
                    @change="updateValue",
                    @blur="updateValue")
</template>

<script>
import fieldsMixin from '@/mixins/fields'

export default {
  name: 'Textarea',
  mixins: [ fieldsMixin ],
  data: () => ({
    value: undefined
  }),
  mounted () {
    this.value = this.item.value
  },
  beforeDestroy () { this.$validator.pause() },
  computed: {
    defaultMinLength () {
      return this.$parent.$parent.defaultMinLength
    },
    defaultMaxLength () {
      return this.$parent.$parent.defaultMaxLength
    }
  }
}
</script>
