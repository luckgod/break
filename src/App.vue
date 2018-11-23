<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  #app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size:15px;
    margin:0;
    padding:0;
  }
  body{
    margin: 0;
  }
  .panel-right{
    background: #fff !important;
  }
  a {
    text-decoration:none;
  }
  .paginate{
    margin:20px 0;
    float: right;
  }
  #nprogress div.spinner {
    top: 5px;
    right: 5px;
  }
  .h2-title{
    padding: 0px 20px;
    font-size: 1.8em;
    font-weight: bold;
    margin: 20px 0;
  }
  .note-editor.note-frame.codeview .note-editing-area .note-codable{
    display: block !important;
  }
  .CodeMirror, .cm-s-default{
    height: 0 !important;
  }
  .note-editor.note-frame.fullscreen{
    margin: 0;
    bottom: 0;
  }
  .el-message-box__input > .el-input {
    width: 100%;
  }
  .avatar {
    height: 40px;
    background-size: cover;
    width:40px;
    background-repeat: no-repeat;
    border-radius: 100%;
    background-position: center center;
    display: inline-block;
  }
  .banner {
    width: 100%;
    margin: 10px 0;
  }
  #app .el-table .cell {
    line-height:initial;
  }
  .content-right {
    background-color: rgb(255, 255, 255);
    padding: 20px 5px;
    margin: 20px 0px;
  }
  .img-preview {
    height: 80px;
    background-size: cover;
    width: 80px;
    background-repeat: no-repeat;
    background-position: center center;
    display: inline-block;
    margin: 5px 0;
  }
  #app .el-table .cell{
    text-align: center;
  }
  .pointer{
    color: #128BE5;
    text-decoration: underline;
    cursor: pointer;
  }
  .ql-editor{
    min-height: 300px;
  }
 .list_type{
  font-size: 17px;
  margin-top: 30px;
  color: #5E5E5E;
  }
  .list_type span{
    width: auto;
    display: inline-block;
    height: 35px;
    margin-right: 30px;
  }
  .choosed{
  border-bottom: 3px solid #20A0FF;
  font-weight: bold;
}
.el-time-panel{
  width: 150px
}
.radius{
   width:1200px;
   height: auto;
   border:1px solid #BFCBD9;
   border-radius: 15px;
   text-align: center;
   margin:20px 80px 30px 0;
   padding: 20px 30px;
   font-size: 16px;
 /*  font-weight: bold;*/
   display: inline-block;
}
.type_list{
  font-size: 17px;
  margin-top: 30px;
  color: #5E5E5E;
}
.type_list span{
  width: auto;
  display: inline-block;
  height: 35px;
  margin-right: 30px;
}
.choosed{
  border-bottom: 3px solid #20A0FF;
  font-weight: bold;
}
.padding_bg{
   padding:0 50px;
}
.summarize{
  display:inline-block;
  text-align: right;
  font-size: 20px;
  margin-right: 30px;
}
.summarize div{
  padding:5px 0;
}
.summarize_input{
   display:inline-block;
}
.summarize_input div{
  padding:5px 0;
}
.sumMap{
    width:49%;
    display: inline-block;
    text-align: center;
    font-size: 20px;
}
.sumMap_num{
    font-weight: bold;
    font-size: 25px
}
.must{
  color: red;
  font-size:18px;
}
.white_pointer{
    cursor: pointer;
}
.pre_img{
   position: absolute;
   left:0;
   cursor:pointer;
   top: 50%;
}
.next_img{
   position: absolute;
   right:0;
   cursor:pointer;
   top: 50%;
}
</style>
