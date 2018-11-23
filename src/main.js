// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueQuillEditor from 'vue-quill-editor'

Vue.use(ElementUI)
Vue.use(VueQuillEditor)

Vue.prototype.dateFormat = dateFormat
Vue.prototype.strToTime = strToTime
Vue.prototype.strLimit = strLimit
Vue.prototype.generateObj = generateObj
Vue.prototype.generateArr = generateArr
Vue.prototype.isIDCard = isIDCard
Vue.prototype.isFloat = isFloat
Vue.prototype.isNumber = isNumber
Vue.prototype.goBack = goBack
Vue.prototype.cutNum = cutNum
Vue.prototype.payWay = payWay
Vue.prototype.identityArray = identityArray
Vue.prototype.merchantType = merchantType


router.afterEach((to, from) => {
    NProgress.done();
});

router.beforeEach(function (to, from, next) {
    NProgress.start();
    next()
    return;
    if (to.fullPath !== '/login') {
        if (!sessionStorage.getItem('permission')) {
            return;
        }
        let permission = JSON.parse(sessionStorage.getItem('permission')).userMenuDtos
        
        if (!permission) return;
        let routes = router.options.routes
        for (let key in routes) {
            if (permission.indexOf(routes[key].name) === -1 && routes[key].name) {
                routes[key].hidden = true;
            } else {
                if (routes[key].isShow) {
                     routes[key].hidden = false;
                }
                
            }
            if (routes[key].children) {
                 for (var i =0;i< routes[key].children.length ; i++) {
                    if (routes[key].children[i].type==1) { 
                        var arr=routes[key].children[i].children
                        for (var j = arr.length - 1; j >= 0; j--) {
                            if (permission.indexOf(arr[j].name) === -1 && arr[j].name) {
                                   arr[j].hidden = true;
                                } else {

                                    if (arr[j].isShow) {
                                        arr[j].hidden = false;
                                    }
                                    
                                }
                        }
                    }else{
                        
                        if (permission.indexOf(routes[key].children[i].name) === -1 && routes[key].children[i].name) {
                           routes[key].children[i].hidden = true;
                           

                        } else {
                            if (routes[key].children[i].isShow) {
                                routes[key].children[i].hidden = false;
                            }                        
                        }
                    }
                    
                }
            }
            
        }

    }
})

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})

Vue.prototype.dataApi = require('./dataApi').default
Vue.prototype.showMsg = function (msg, type = 'success') {
    vm.$message({
        message:msg,
        type:type
    })
}
Vue.prototype.confirmDel = function (func) {
    this.$confirm('你确认要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        func()
    }).catch(() => {

    });
}

Vue.prototype.powerShow = function (name) {
   var permission=''
    if (sessionStorage.getItem('permission')){
       permission = JSON.parse(sessionStorage.getItem('permission')).userMenuDtos
    }else{
       permission=''
    }          
    if (permission.indexOf(name)!=-1) {
      return true
   }
}

Vue.prototype.findWay = function (type) {
     for (var i = payWay.length - 1; i >= 0; i--) {
        if (type==payWay[i].value) {
            return payWay[i].text
        }
     }
}

Vue.prototype.findState = function (state,stateList) {
     for (var i = stateList.length - 1; i >= 0; i--) {
           if (stateList[i].value == state) {
               return stateList[i].text
           }

       }
}

Vue.prototype.findIdentity=function (type){
        for (var i = identityArray.length - 1; i >= 0; i--) {
            if (type==identityArray[i].value) {
                return identityArray[i].text
            }
        }
}
/**
 * css
 */
import 'nprogress/nprogress.css'
import 'assets/css/weui.min.css'
/**
 * js
 */
//import 'jquery'
import 'nprogress'
import 'assets/js/calendar-pro.js'
