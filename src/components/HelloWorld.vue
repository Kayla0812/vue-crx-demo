<template>
  <div>
    <div>
      <p>{{ defaultText }}</p>
      <img :src="src"/>
      <el-button type="primary" @click.stop="refresh">Go To</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      src: ''
    }
  },
  methods: {
    refresh () {
      chrome.tabs.create({
        url: 'https://waplus.io/'
      })
    }
  },
  mounted () {
    let url = chrome.extension.getURL("icons/wap.jpg")
    this.src = url;
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  }
}
</script>

<style lang="stylus" scoped>
  $font-size = 28px
  div
    font-size $font-size
    color #000
    text-align center
  img 
    width 300px
    height 200px
    display block
    margin 0px auto
</style>
