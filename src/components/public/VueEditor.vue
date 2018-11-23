<template>
  <div id="vue_editor">
    <editor ref="myTextEditor"
            :fileName="'myFile'"
            :uploadUrl="uploadUrl"
            :content="content"
            @onEditorChange="onEditorChange($event)"></editor>
    <!-- <div v-html="content"></div> -->
  </div>
</template>

<script>
import editor from './Quilleditor.vue'
export default {
  name: 'vue_editor',
  
  data(){
    return {
      /*测试上传图片的接口，返回结构为{url:''}*/
      uploadUrl:URL+'/enve/FileUploadNotify/upload'
    }
  },
  components: {
    editor
  },
  props: {
            content: {
                type: String
            },
            editorOption: {
                type: Object
            }
  },
  methods:{
      onEditorChange({ editor, html, text }){

          this.$emit('onEditorChange', { editor, html, text })
       },
  }
}
</script>

<style>
</style>