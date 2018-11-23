import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import NavLeft from 'components/public/NavLeft.vue'
import NavTop from 'components/public/NavTop.vue'
import WeUiUploads from 'components/public/WeUiUploads.vue'
import VueEditor from 'components/public/VueEditor.vue'
Vue.component('nav-left', NavLeft)
Vue.component('nav-top', NavTop)
Vue.component('we-ui-uploads', WeUiUploads)
Vue.component('vue-editor', VueEditor)

const Admin = resolve => require(['components/Index.vue'], resolve)
export default new Router({
    routes: [
        {
            path: '/404',
            component: resolve => require(['components/404.vue'], resolve),
            name: '404',
            hidden: true
        },
        // {
        //     path: '/',
        //     name: '主页',
        //     redirect: '/home',
        //     hidden: true
        // },
        {
            path: '/login',
            component: resolve => require(['components/auth/Login.vue'], resolve),
            name: '登录',
            hidden: true
        },
        {
            path: '/',
            component: Admin,
            name: '平台概况',
            icon: 'iconfont icon-summary',//图标样式class
            type:1,
            children:[
                {
                    path: '/home',
                    component: resolve => require(['components/home/Home.vue'], resolve),
                    name:'home',
                    hidden: true,
                    meta: { keepAlive: true },
                }
            ]
        },
        {
            path: '/user',
            component: Admin,
            name: '用户管理',
            hidden: false,
            icon: 'iconfont icon-yonghu',//图标样式class
            children: [
                {
                    path: '/user/user_list',
                    component: resolve => require(['components/users/UserList.vue'], resolve),
                    name:'用户列表',
                    meta: { keepAlive: true },
                },
                {    
                    path: '/user/user_detail/:id',
                    component: resolve => require(['components/users/UserDetail.vue'], resolve),
                    name:'用户详情',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/user/subordinate_list/:id',
                    component: resolve => require(['components/users/SubordinateList.vue'], resolve),
                    name:'下级列表',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/bank_list/:id',
                    component: resolve => require(['components/users/BankList.vue'], resolve),
                    name:'提现账户',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/area_list/:id',
                    component: resolve => require(['components/users/AreaList.vue'], resolve),
                    name:'拥有主城个数',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/trading_record/:id',
                    component: resolve => require(['components/users/TradingRrecord.vue'], resolve),
                    name:'交易记录',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/treasure_record/:id',
                    component: resolve => require(['components/users/TreasureRrecord.vue'], resolve),
                    name:'个人财富记录',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/user/change_record/:id',
                    component: resolve => require(['components/users/ChangeRrecord.vue'], resolve),
                    name:'奖励券转化记录',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/user/rate_record/:id',
                    component: resolve => require(['components/users/RateRrecord.vue'], resolve),
                    name:'掉率调整记录',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/user/to_receive/:id',
                    component: resolve => require(['components/users/ToReceive.vue'], resolve),
                    name:'待领取红包列表',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/transaction_detail/:id',
                    component: resolve => require(['components/users/TransactionDetail.vue'], resolve),
                    name:'交易明细',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/receive_record/:id',
                    component: resolve => require(['components/users/ReceiveRecord.vue'], resolve),
                    name:'领取红包记录',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/red_detail/:id',
                    component: resolve => require(['components/users/RedDetail.vue'], resolve),
                    name:'红包详情',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },          
                {
                    path: '/user/send_detail/:id',
                    component: resolve => require(['components/users/SendDetail.vue'], resolve),
                    name:'发送红包记录',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/agency/:id',
                    component: resolve => require(['components/users/Agency.vue'], resolve),
                    name:'代理记录',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/user/download',
                    component: resolve => require(['components/users/download.vue'], resolve),
                    name:'用户增长量'
                },
                
            ]
        },
        {
            path: '/equity',
            component: Admin,
            name: '股权用户',
            hidden: false,
            icon: 'iconfont icon-yonghu1',//图标样式class
            type:1,
            children: [
                 {
                    path: '/equity/equity_user',
                    component: resolve => require(['components/equity/EquityUser.vue'], resolve),
                    name:'股权用户列表',
                    meta: { keepAlive: true },
                },
                 {
                    path: '/equity/equity_detail/:id',
                    component: resolve => require(['components/equity/EquityDetail.vue'], resolve),
                    name:'股权详情',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/equity/buyback/:id',
                    component: resolve => require(['components/equity/Buyback.vue'], resolve),
                    name:'回购记录',
                    hidden: true,
                    isShow:false
                },
            ]
        },
        {
            path: '/rate',
            component: Admin,
            name: '掉率统计',
            hidden: false,
            icon: 'iconfont icon-qushi',//图标样式class
            type:1,
            children: [
                 {
                    path: '/rate/rate_list',
                    component: resolve => require(['components/rate/RateList.vue'], resolve),
                    name:'掉率统计列表',
                    meta: { keepAlive: true },
                },
            ]
        },
        {
            path: '/merchant',
            component: Admin,
            name: '商家管理',
            hidden: false,
            icon: 'iconfont icon-mall',//图标样式class
            children: [
               {
                    path: '/merchant/sort_list',
                    component: resolve => require(['components/merchant/SortList.vue'], resolve),
                    name:'商家分类',
                    meta: { keepAlive: true },
                },
                {
                    path: '/merchant/second_list',
                    component: resolve => require(['components/merchant/SecondList.vue'], resolve),
                    name:'二级分类',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/merchant/red_top',
                    component: resolve => require(['components/merchant/RedTop.vue'], resolve),
                    name:'红包排行',
                    hidden: true,
                    meta: { keepAlive: true },
                    isShow:false
                },
                {
                    path: '/merchant/merchant_list',
                    component: resolve => require(['components/merchant/MerchantList.vue'], resolve),
                    name:'商家列表',
                    meta: { keepAlive: true },
                },
                {
                    path: '/merchant/nonactivated/:id',
                    component: resolve => require(['components/merchant/Nonactivated.vue'], resolve),
                    name:'新增/编辑商家',
                    meta: { keepAlive: true },
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/nactivated/:id',
                    component: resolve => require(['components/merchant/Nactivated.vue'], resolve),
                    name:'商家详情',
                    meta: { keepAlive: true },
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/earnest_info/:id',
                    component: resolve => require(['components/merchant/EarnestInfo.vue'], resolve),
                    name:'提交认证信息',
                    meta: { keepAlive: true },
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/renactivated/:id',
                    component: resolve => require(['components/merchant/Renactivated.vue'], resolve),
                    name:'重新提交认证信息',
                    meta: { keepAlive: true },
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/voucher_detail/:id',
                    component: resolve => require(['components/merchant/VoucherDetail.vue'], resolve),
                    name:'商家代金券详情',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/map',
                    component: resolve => require(['components/merchant/Map.vue'], resolve),
                    name:'地图',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/goods_list/:id',
                    component: resolve => require(['components/merchant/GoodsList.vue'], resolve),
                    name:'普通商品',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/goods_detail/:id',
                    component: resolve => require(['components/merchant/GoodsDetail.vue'], resolve),
                    name:'普通商品详情',
                    meta: { keepAlive: true },
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/combo_list/:id',
                    component: resolve => require(['components/merchant/ComboList.vue'], resolve),
                    name:'商家优惠套餐',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/combo_detail/:id',
                    component: resolve => require(['components/merchant/ComboDeatil.vue'], resolve),
                    name:'商家优惠套餐详情',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/hotel_list/:id',
                    component: resolve => require(['components/merchant/HotelList.vue'], resolve),
                    name:'客房列表',
                    hidden: true,
                    isShow:false
                },
                {
                    path: '/merchant/hotel_detail/:id',
                    component: resolve => require(['components/merchant/HotelDetail.vue'], resolve),
                    name:'客房详情',
                    hidden: true,
                    isShow:false
                }
                
            ]
        },
        {
            path: 'company',
            component: Admin,
            name: '股权公司',
            hidden: false,
            icon: 'iconfont icon-gongsiyewu',//图标样式class
            type:1,
            children: [
                 {
                    path: '/company/equity_company',
                    component: resolve => require(['components/company/EquityCompany.vue'], resolve),
                    name:'股权公司列表',
                    meta: { keepAlive: true },
                },
                {
                    path: '/company/edit_company/:id',
                    component: resolve => require(['components/company/EditCompany.vue'], resolve),
                    name:'新增/编辑股权公司',
                    hidden: true,
                    isShow:false
                }
            ]
        },
        {
            path: '/red',
            component: Admin,
            name: '红包模块',
            hidden: false,
            icon: 'iconfont icon-gb',//图标样式class
            children: [
                {
                    path: '/red/get_list',
                    component: resolve => require(['components/red/GetList.vue'], resolve),
                    name:'红包领取记录',
                    meta: { keepAlive: true },
                },
                {
                    path: '/red/send_list',
                    component: resolve => require(['components/red/SendList.vue'], resolve),
                    name:'个人红包发送',
                    meta: { keepAlive: true },
                },
                {
                    path: '/red/system_send',
                    component: resolve => require(['components/red/SystemSend.vue'], resolve),
                    name:'系统红包发送',
                    meta: { keepAlive: true },
                },
                {
                    path: '/red/advertising_library',
                    component: resolve => require(['components/red/AdvertisingLibrary.vue'], resolve),
                    name:'系统广告库',
                    meta: { keepAlive: true },
                },
                
            ]
        },
        {
            path: 'equityRed',
            component: Admin,
            name: '股权红包',
            hidden: false,
            icon: 'iconfont icon-hongbao',//图标样式class
            children: [
                 {
                    path: '/equityRed/equity_send',
                    component: resolve => require(['components/equityRed/EquitySend.vue'], resolve),
                    name:'股权发送记录',
                    meta: { keepAlive: true },
                },
                {
                    path: '/equityRed/equity_detail/:id',
                    component: resolve => require(['components/equityRed/EquityDetail.vue'], resolve),
                    name:'股权红包详情',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/equityRed/equity_get',
                    component: resolve => require(['components/equityRed/EquityGet.vue'], resolve),
                    name:'股权领取记录',
                    meta: { keepAlive: true },
                },
                {
                    path: '/equityRed/equity_back',
                    component: resolve => require(['components/equityRed/EquityBack.vue'], resolve),
                    name:'股权回购记录',
                    meta: { keepAlive: true },
                },
            ]
        },
        {
            path: '/manor',
            component: Admin,
            name: '主城管理',
            hidden: false,
            icon: 'iconfont icon-gongsi1',//图标样式class
            children: [
                {
                    path: '/manor/manor_list',
                    component: resolve => require(['components/manor/ManorList.vue'], resolve),
                    name:'主城列表',
                    meta: { keepAlive: true },
                },
                {
                    path: '/manor/manor_deal/:id',
                    component: resolve => require(['components/manor/ManorDeal.vue'], resolve),
                    name:'主城交易记录',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/manor/agency_record/:id',
                    component: resolve => require(['components/manor/AgencyRecord.vue'], resolve),
                    name:'代理变更记录',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/manor/change_record/:id',
                    component: resolve => require(['components/manor/ChangeRecord.vue'], resolve),
                    name:'状态变更记录',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/manor/deal_lobby',
                    component: resolve => require(['components/manor/DealLobby.vue'], resolve),
                    name:'主城交易大厅',
                    meta: { keepAlive: true },
                }
                
            ]
        },
        {
            path: '/order',
            component: Admin,
            name: '订单管理',
            hidden: false,
            icon: 'iconfont icon-dingdan-',//图标样式class
            children: [
                {
                    path: '/order/goods_list',
                    component: resolve => require(['components/order/GoodsList.vue'], resolve),
                    name:'订单列表',
                    meta: { keepAlive: true },
                },
                {
                    path: '/order/goods_detail/:id',
                    component: resolve => require(['components/order/GoodsDetail.vue'], resolve),
                    name:'商品订单详情',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/logistics_detail/:id',
                    component: resolve => require(['components/order/LogisticsDetail.vue'], resolve),
                    name:'物流详情',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/discounts_list',
                    component: resolve => require(['components/order/DiscountsList.vue'], resolve),
                    name:'订单优惠套餐',
                    meta: { keepAlive: true },
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/discounts_detail/:id',
                    component: resolve => require(['components/order/DiscountsDetail.vue'], resolve),
                    name:'订单优惠套餐详情',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/hotel_list',
                    component: resolve => require(['components/order/HotelList.vue'], resolve),
                    name:'酒店订单',
                    meta: { keepAlive: true },
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/hotel_detail/:id',
                    component: resolve => require(['components/order/HotelDetail.vue'], resolve),
                    name:'酒店详情',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/voucher_list',
                    component: resolve => require(['components/order/VoucherList.vue'], resolve),
                    name:'代金券',
                    meta: { keepAlive: true },
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/voucher_detail/:id',
                    component: resolve => require(['components/order/VoucherDetail.vue'], resolve),
                    name:'订单代金券详情',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/face_list',
                    component: resolve => require(['components/order/FaceList.vue'], resolve),
                    name:'当面付',
                    meta: { keepAlive: true },
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/order/return_list',
                    component: resolve => require(['components/order/ReturnList.vue'], resolve),
                    name:'售后退款',
                    meta: { keepAlive: true },
                },
                {
                    path: '/order/return_detail/:id',
                    component: resolve => require(['components/order/ReturnDetail.vue'], resolve),
                    name:'售后退款详情',
                    hidden:true,
                    isShow:false
                },
                
            ]
        },
        {
            path: '/withdraw',
            component: Admin,
            name: '红包股转出',
            hidden: false,
            type:1,
            icon: 'iconfont icon-jisuanqi',//图标样式class
            children: [
                {
                    path: '/withdraw/withdraw_list',
                    component: resolve => require(['components/withdraw/WithdrawList.vue'], resolve),
                    name:'提现',
                    meta: { keepAlive: true },
                }
                
            ]
        },
         {
            path: '/infoAudit',
            component: Admin,
            name: '信息审核',
            hidden: false,
            icon: 'iconfont icon-shenhe',//图标样式class
            children: [
                {
                    path: '/infoAudit/merchant_audit',
                    component: resolve => require(['components/infoAudit/MerchantAudit.vue'], resolve),
                    name:'商家审核',
                    meta: { keepAlive: true },
                },
                {
                    path: '/infoAudit/audit_detail/:id',
                    component: resolve => require(['components/infoAudit/AuditDetail.vue'], resolve),
                    name:'商家审核详情',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/infoAudit/history/:id',
                    component: resolve => require(['components/infoAudit/History.vue'], resolve),
                    name:'以往认证信息',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/infoAudit/red_complain',
                    component: resolve => require(['components/infoAudit/RedComplain.vue'], resolve),
                    name:'红包投诉',
                    meta: { keepAlive: true },
                },
                {
                    path: '/infoAudit/company_error',
                    component: resolve => require(['components/infoAudit/CompanyError.vue'], resolve),
                    name:'商家信息纠错',
                    meta: { keepAlive: true },
                },
                
            ]
        },
        {
            path: '/finance',
            component: Admin,
            name: '财务中心',
            hidden: false,
            icon: 'iconfont icon-zhiweiguanli',//图标样式class
            children: [
                {
                    path: '/finance/change_list',
                    component: resolve => require(['components/finance/ChangeList.vue'], resolve),
                    name:'财富变动记录',
                    meta: { keepAlive: true }
                },
                {
                    path: '/finance/account_balance',
                    component: resolve => require(['components/finance/AccountBalance.vue'], resolve),
                    name:'账户余额'
                },
                {
                    path: '/finance/treasure_list',
                    component: resolve => require(['components/finance/TreasureList.vue'], resolve),
                    name:'股数调账记录',
                    meta: { keepAlive: true }
                },
                {
                    path: '/finance/recharge_list',
                    component: resolve => require(['components/finance/RechargeList.vue'], resolve),
                    name:'充值记录',
                    meta: { keepAlive: true }
                },
                // {
                //     path: '/finance/recharge_bill',
                //     component: resolve => require(['components/finance/RechargeBill.vue'], resolve),
                //     name:'充值对账单',
                //     meta: { keepAlive: true },
                // },
                {
                    path: '/finance/checking_record',
                    component: resolve => require(['components/finance/CheckingRecord.vue'], resolve),
                    name:'对账记录',
                    meta: { keepAlive: true },
                    hidden:true,
                    isShow:false
                }
                
            ]
        },
        {
            path: '/official',
            component: Admin,
            name: '运营管理',
            hidden: false,
            icon: 'iconfont icon-yunying',//图标样式class
            children: [
                {
                    path: '/official/apply',
                    component: resolve => require(['components/official/Apply.vue'], resolve),
                    name:'代理报名',
                    meta: { keepAlive: true }
                },
                {
                    path: '/official/annoumcement',
                    component: resolve => require(['components/official/Annoumcement.vue'], resolve),
                    name:'系统公告',
                    meta: { keepAlive: true }
                },
                {
                    path: '/official/annoumcement_detail/:id',
                    component: resolve => require(['components/official/AnnoumcementDetail.vue'], resolve),
                    name:'新增/编辑公告',
                    hidden:true, 
                    isShow:false
                },
                {
                    path: '/official/feedback',
                    component: resolve => require(['components/official/Feedback.vue'], resolve),
                    name:'意见反馈',
                    meta: { keepAlive: true }
                },
                {
                    path: '/official/protocol',
                    component: resolve => require(['components/official/Protocol.vue'], resolve),
                    meta: { keepAlive: true },
                    name:'规则文案'
                },
                {
                    path: '/official/protocoldetail',
                    component: resolve => require(['components/official/ProtocolDetail.vue'], resolve),
                    name:'编辑规则文案',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/official/banner',
                    component: resolve => require(['components/official/Banner.vue'], resolve),
                    name:'开机广告',
                    meta: { keepAlive: true }
                },
                {
                    path: '/official/banner_detail/:id',
                    component: resolve => require(['components/official/BannerDetail.vue'], resolve),
                    name:'新增/编辑开机广告',
                    hidden:true,
                    isShow:false
                },
                {
                    path: '/official/help',
                    component: resolve => require(['components/official/Help.vue'], resolve),
                    name:'帮助中心',
                    meta: { keepAlive: true }
                },
                {
                    path: '/official/help_detail/:id',
                    component: resolve => require(['components/official/HelpDetail.vue'], resolve),
                    name:'新增/编辑帮助中心',
                    hidden:true,
                    isShow:false
                },
                
                
                
            ]
        },
        {
            path: '/terrace',
            component: Admin,
            name: '平台设置',
            hidden: false,
            icon: 'iconfont icon-set',//图标样式class
            children: [
                {
                    path: '/terrace/logistics_company',
                    component: resolve => require(['components/terrace/LogisticsCompany.vue'], resolve),
                    name:'物流公司',
                    meta: { keepAlive: true }
                },
                {
                    path: '/terrace/red_like',
                    component: resolve => require(['components/terrace/RedLike.vue'], resolve),
                    name:'红包点赞设置',
                    meta: { keepAlive: true }
                },
                {
                    path: '/terrace/custom',
                    component: resolve => require(['components/terrace/Custom.vue'], resolve),
                    name:'自定义内容',
                    meta: { keepAlive: true }
                },
                {
                    path: '/terrace/edit_custom',
                    component: resolve => require(['components/terrace/EditCustom.vue'], resolve),
                    name:'新增/编辑自定义内容',
                    hidden:true,
                    isShow:false
                },
                // {
                //     path: '/terrace/financial',
                //     component: resolve => require(['components/terrace/Financial.vue'], resolve),
                //     name:'金融设置',
                //     meta: { keepAlive: true }
                // }
            ]
        },
        {
            path: '/set',
            component: Admin,
            name: '管理员列表',
            hidden: false,
            icon: 'iconfont icon-icon',//图标样式class
            children: [
                {
                    path: '/set/Account',
                    component: resolve => require(['components/setting/Account.vue'], resolve),
                    name:'账号列表',
                    meta: { keepAlive: true }
                },
                {
                    path: '/set/level',
                    component: resolve => require(['components/setting/Level.vue'], resolve),
                    name:'权限组信息',
                    meta: { keepAlive: true }
                },
                {
                    path: '/set/level_details/:id',
                    component: resolve => require(['components/setting/LevelDetails.vue'], resolve),
                    name:'新增/编辑权限组',
                    hidden: true,
                    isShow:false
                }
            ]
        },
        {
            path: '*',
            hidden: true,
            name:'*',
            redirect: { path: '/login' }
        }
    ]
})
