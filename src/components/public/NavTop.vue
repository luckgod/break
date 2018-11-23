<template>
    <div class="nav-top">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router theme="dark">
            <el-menu-item index="1" class="nav-top_left">麦家鸿包管理后台</el-menu-item>
    <!--         <el-menu-item v-for="(item,index) in $router.options.routes" v-if="!item.hidden" :index="item.path">
                {{item.name}}
            </el-menu-item> -->
            <el-submenu index="10">
                <template slot="title">{{account}}</template>
                <el-menu-item index="10-1" @click="exit()">退出登录</el-menu-item>
            </el-submenu>
        </el-menu>
        <div class="line"></div>
    </div>
</template>
<style>
    .el-menu--horizontal li.el-submenu {
        float: right;
    }

    .nav-top .el-menu-item, .el-submenu__title {
        color: #fff;
    }

    .nav-top .el-menu-item:hover {
        color: #fff;
    }

    .nav-top .el-submenu__title {
        color: #fff;
    }

    .nav-top .el-submenu__title:hover {
        color: #000;
    }

</style>
<script>
    export default {
        data() {
            return {
                account: '我的工作台',
                activeIndex:'/home'
            }
        },
        created() {

            if (sessionStorage.getItem('permission')) {
                if (JSON.parse(sessionStorage.getItem('permission')).adminName!=null) {
                      this.account=JSON.parse(sessionStorage.getItem('permission')).adminName
                }
           
              }
            // this.fetchData()
            // this.reloadPage()
        },
        methods: {
            handleSelect(key, keyPath) {
                //console.log(key, keyPath);
                // if ('10-1' == key) {
                //     this.dataApi.ajax('common/logout', null, res => {
                //         if (res.code === 0) {
                //             this.showMsg('退出登录成功！')
                //         }
                //     })

                // }
            },
            exit() {
                  var id=JSON.parse(sessionStorage.getItem('permission')).adminCode;
                  this.dataApi.ajax('adminLoginOut', {adminCode:id}, res => {
                        if (res.responseType === 'S') {
                            this.showMsg('退出登录成功！') 
                            location.reload()
                            this.$router.push('/login')
                            sessionStorage.removeItem('permission')
                            
                        }
                    })

                
            }
        }
    }
</script>