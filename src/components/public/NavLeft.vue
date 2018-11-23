<template>
    <aside style="width:180px;">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect" theme="dark" unique-opened router>
            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden && !item.type">
                <el-submenu :index="index+''">
                    <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
                    <el-menu-item v-for="child in item.children" :index="child.path" v-if="!child.hidden">
                    {{child.name}}
                    <el-badge :value="agentEnrollNum" :max="99" class="item" style="float: right;border-color:none" v-if="child.name=='代理报名'">
                 </el-badge>
                    </el-menu-item>
                </el-submenu>
                <!--<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>-->
            </template>
            <el-menu-item v-else-if="!item.hidden && item.type == 1" :index="item.children[0].path"><i :class="item.icon"></i>{{item.name}}</el-menu-item>
        </el-menu>
           
    </aside>

</template>
<style>
.el-badge__content{
  border: none !important;
  top:0;
}
.el-menu-item{
  white-space: normal !important;
}
</style>
<script>
    export default {
        data() {
          return {
              nav:[],
              agentEnrollNum:0
          }
        },
        created() {
            // console.log(this.$route.fullPath)
             this.fetchNav(this.$route)
             this.fetchData()
             setInterval(this.fetchData,1000*300)
        },
        watch:{
            '$route'(to,from) {
                this.fetchNav(to)
                this.fetchData()
            }
        },
        methods: {
            fetchNav(to) {
                let routes = this.$router.options.routes;
                for (let key in routes) {
                    if (to.fullPath.indexOf(routes[key].path) !== -1) {
                        this.nav = routes[key].children
                    }
                }
            },
            fetchData () {
                this.dataApi.ajax('selectRedPoint',null, res => {
                    if (res.responseType === 'S') {
                        this.agentEnrollNum=res.agentEnrollNum
                    }
                });

            },
            handleOpen(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleSelect(key, keyPath) {

            }

        }
    }
</script>

<style scoped>
    @font-face {
        font-family: 'iconfont';  /* project id 655872 */
        src: url('//at.alicdn.com/t/font_655872_zu1kggr0fu8r529.eot');
        src: url('//at.alicdn.com/t/font_655872_zu1kggr0fu8r529.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_655872_zu1kggr0fu8r529.woff') format('woff'),
        url('//at.alicdn.com/t/font_655872_zu1kggr0fu8r529.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_655872_zu1kggr0fu8r529.svg#iconfont') format('svg');
      }
    .iconfont {
        margin-right: 15px;
    }
</style>