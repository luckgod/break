<template>

  <el-row :gutter="10" class="ele-panel">
    <el-col :span="24" style="padding: 0;position: fixed;z-index: 99;">
      <nav-top></nav-top>
    </el-col>
    <div class="panel-center el-col el-col-24" >
      <el-col :xs="8" :sm="6" :md="8" :lg="6"><nav-left></nav-left></el-col>
      <el-col :xs="8" :sm="6" :md="8" :lg="18" >
        <section class="panel-right" >
          <div class="grid-content" >

            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ $route.matched[0].name }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
            </el-breadcrumb>

            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </div>
        </section>
      </el-col>
    </div>

  </el-row>

</template>
<style>
  .ele-panel{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right:0;
    margin: 0 !important;
  }
  .panel-center{
    background: #324057;
    /*position: absolute;
    bottom: 0;
    top: 60px;*/
    position: relative;
    min-height: 100%;
    top:0;
    padding-top:60px;
  }
  .panel-right{
    background: #f1f2f7;
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    left: 190px;
    overflow-y: auto;
    padding: 80px 20px 0 20px;
  }
  .refresh{
    width: 50px;
  }
</style>
<script>
  export default{
    data(){
      return{
        msg:'hello vue'
      }
    },
    components:{

    }
  }
</script>
