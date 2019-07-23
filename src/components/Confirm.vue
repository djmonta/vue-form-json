<template lang="pug">
  div.field.confirm.p-5.pt-10.mx-auto
    div.box
      h2.title.is-5.has-text-info お申し込み内容確認
      p.is-8.mb-2 以下の内容で登録いたします。
      .w-full.flex.flex-wrap.border-blue-100.mb-1(v-for="(formObj, index) in confirmValues", :key="index")
        div(v-if="index !== undefined && index !== 'undefined' && index !== 'version'", class="w-1/4 mr-3 bg-blue-100 p-2")
          label.font-bold(v-if="index !== 'undefined'", v-html="$sanitize(index)")

        div.self-center(v-if="formObj !== undefined && typeof(formObj) !== 'object' && index !== 'version'", class="w-2/3")
          p(v-html="$sanitize(formObj)")

        div.self-center(v-else-if="Array.isArray(formObj) && index == '納品可能時間'", v-for="(val, k) in formObj")
          span(v-if="val !== undefined", v-html="$sanitize(val)")

        div.self-center(v-else-if="typeof(formObj) === 'object'", v-for="(value, key) in formObj")
          div.for-loop(v-if="index !== '広告掲載同意書'")
            label(v-html="key.isNaN ? key : ''")
            span(v-if="value == true && key == 'holiday'", v-html="'定休日'")
            span(v-else-if="value !== undefined && value !== false", v-html="$sanitize(value)")

          div.for-loop.w-full(v-else, v-html="$sanitize('- '+value)", class="p-1 text-s agreement")

    p.is-8.text-center.mx-auto 以上の内容でよろしければ、「送信」ボタンを押して、登録を完了してください。
    .field.form-footer.is-grouped.is-opposed.mt-5
      input.button(:value="'修正'", @click="back", readonly="true")
      input.button.is-info(@click="postMethod",
                              :value="'送信'",
                              readonly="true")
</template>

<script>
import mergeAll from 'ramda/src/mergeAll'
import sanitizeHTML from 'sanitize-html'
Vue.prototype.$sanitize = sanitizeHTML

export default {
  name: 'Confirm',
  props: {
    dataSet: Array,
    position: {}
  },
  data: () => ({
    confirmValues: {}
  }),
  mounted () {
    this.dataSet[1] = { ...this.dataSet[1], ...this.position }
    this.confirmValues = mergeAll(this.dataSet)
  },
  methods: {
    back () {
      this.$parent.backStep()
    },
    postMethod () {
      let params = new FormData()
      params = this.confirmValues
      axios.post('/api/inquery/', params).then(response => {
        if (response.status == 200) {
          // TODO: 「送信しました」的画面？
          this.$parent.forcesUpdate()
        } else {
          console.log(response) // TODO: delete this line
        }
      })
    }
  }
}
</script>

<style scoped>
.confirm {
  max-width: 50rem;
}
p {
  white-space: pre-wrap;
}
.for-loop span:last-child {
  margin-right: 1rem
}
</style>
