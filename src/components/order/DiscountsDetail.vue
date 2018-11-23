<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px"> 
                       <el-button type="primary" @click="goBack()" style="margin-right: 10px;">返回</el-button>
                </el-form>
            </el-col>
        </el-row> 
        <hr>
        <el-table
                  :data="tableData"
                  style="margin-bottom: 20px;">
                  <el-table-column
                    width="300"
                    label="商品">
                <template scope="scope">
                    <div style="display: inline-block;">
                        <img class="banner" :src="scope.row.voucherCover" style="width:120px;" >
                    </div>
                    <div style="display: inline-block;width: 120px;vertical-align: middle;padding: 10px;">{{scope.row.voucherName}}</div>
                </template>
                </el-table-column>
                <el-table-column
                        label="单价/数量">
                        <template scope="scope">
                            <span>{{scope.row.voucherAmt}}/{{ scope.row.buyNum }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        label="商家"
                        prop='storeName'>
                </el-table-column>
                <el-table-column
                        label="订单状态">
                        <template scope="scope">
                            <span>{{findState(scope.row.transferStat,orderState)}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="standardList"
                        label="有效期">
                        <template scope="scope">
                            <span>{{ scope.row.voucherStartTime }}至{{ scope.row.voucherEndTime }}</span>
                        </template>
                </el-table-column>
         </el-table>
        <el-form :model="form"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;width: 600px" label-position="right" label-width="140px">
         <h3>支付信息</h3>
                <el-form-item label="订单号：" >
                    <span>{{form.transferId}}</span>
                </el-form-item>
                <el-form-item label="让利比例比例：" >
                    <span  >{{form.rate*100}}%</span>
                </el-form-item>
                <el-form-item label="支付方式：" >
                    <span>{{findWay(form.payType)}}</span>
                </el-form-item>
                <el-form-item label="商品总价（元）：">
                    <span>{{form.payAmt}}</span>
                </el-form-item>
                <el-form-item label="抵用券抵扣(元) ：">
                    <span>{{form.offsetAmount? form.offsetAmount:0}}</span>
                </el-form-item>
                <el-form-item label="现金支付（元）：">
                    <span>{{form.offsetCash? form.offsetCash:0}}</span>
                </el-form-item>
                <el-form-item label="买家获得奖励券：">
                    <span>{{form.exchangeAmount}}</span>
                </el-form-item>
                <el-form-item label="下单时间：" >
                    <span>{{form.creTime}}</span>
                </el-form-item>
                <el-form-item label="付款时间：" >
                    <span>{{form.payTime}}</span>
                </el-form-item>
                <el-form-item label="用户申请退款时间：" v-if="form.orderReturnApplyTime">
                    <span>{{form.orderReturnApplyTime}}</span>
                </el-form-item>
                <el-form-item label="退款成功时间：" v-if="form.returnTime">
                    <span>{{form.returnTime}}</span>
                </el-form-item>
                <el-form-item label="退款原因：" v-if="form.remark">
                    <span>{{form.remark}}</span>
                </el-form-item>
                <el-form-item label="券使用时间：" >
                    <span>{{form.useTime? form.useTime:'无'}}</span>
                </el-form-item>
                <el-form-item label="券过期时间：" v-if="form.expireTime">
                    <span>{{form.expireTime? form.expireTime:'无'}}</span>
                </el-form-item>
        </el-form>
        <el-form :model="form"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;vertical-align: top" label-position="right" label-width="125px">
         <h3>买家信息</h3>
                <el-form-item label="买家用户名：" >
                    <span>{{form.payUserName}}</span>
                </el-form-item>
                <el-form-item label="联系方式："  >
                    <span  >{{form.phone}}</span>   
                </el-form-item>   
        </el-form>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                formInline: {
                    nickname: '',
                    mobile: '',
                    page: '',
                    type:'',
                    type2:'',
                    change:''
                },
                tableData: [],
                formLabelWidth: '120px',
                form:{
                    orderNumber:'',
                    userName:'',
                    total:0,
                    ebbyYuan:0,
                    cash:0,
                    prints:0
                },
                URL:URL,
                orderState:[{text:'待使用',value:'2'},{text:'待使用',value:'3'},{text:'退款中',value:'5'},{text:'待使用',value:'8'},{text:'待评价',value:'4'},{text:'已完成',value:'7'},{text:'已退款',value:'6'},{text:'待使用',value:'9'},{text:'已过期',value:'10'}],
                showSource:true

            }
        },
        created(){
            this.fetchData()
        },
        methods: {

            fetchData () {
                this.dataApi.ajax('singlePayFaceTransfer',{transferId:this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                           this.tableData[0] = res;
                           this.form = res
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            findState(state){
               for (var i = this.orderState.length - 1; i >= 0; i--) {
                   if (this.orderState[i].value == state) {
                       return this.orderState[i].text
                   }

               }
            },

        }
    }
</script>
