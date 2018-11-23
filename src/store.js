import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        auth:false,
        admin_info:{
            admin_id: '',
            admin_token: ''
        }
    },
    mutations: {
        login (state, info) {
            state.admin_info = info;
            state.auth = true;
        },
        adminInfo(state) {
            console.log(state.admin_info)
        },
        logout(state) {
            state.admin_info = null;
            state.auth = false;
        }
    }
})