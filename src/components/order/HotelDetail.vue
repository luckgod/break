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
                            <img class="banner" :src="scope.row.roomImg" style="width:120px;" >
                        </div>
                        <div style="display: inline-block;width: 120px;vertical-align: middle;padding: 10px;">{{scope.row.roomName}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商家"
                        prop='storeName'>
                </el-table-column>
                <el-table-column
                        label="房间数"
                        prop='roomBuyNum'>
                </el-table-column>
                 <el-table-column
                        label="住几晚"
                        prop='roomCheckDays'>
                </el-table-column>
                <el-table-column
                        label="订单状态"
                        prop='orderStat'>
                        <template scope="scope">
                            <span>{{ findState(scope.row.orderStat,orderState)}}</span>
                        </template>
                </el-table-column>
         </el-table>
        <el-form :model="form"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;width: 600px" label-position="right" label-width="125px">
                <h3>买家信息</h3>
                <el-form-item label="订房用户：" >
                    <span>{{form.buyerName}}</span>
                </el-form-item>
                <el-form-item label="入住人：" >
                    <span>{{form.contactName}}</span>
                </el-form-item>
                <el-form-item label="联系方式："  >
                    <span  >{{form.contactPhone}}</span>   
                </el-form-item>   
                <el-form-item label="入住时间：">
                    <div>入住：{{form.checkBegTime}}</div>
                    <div>离店：{{ form.checkEndTime }}</div> 
                </el-form-item>
                <el-form-item label="预计到店：">
                    <span >{{form.expectTime}}之前</span>   
                </el-form-item>
                <el-form-item label="实际入住：">
                    <span >{{form.takeTime? form.takeTime:'暂无'}}</span>   
                </el-form-item>    
        </el-form>
        <el-form :model="form"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;vertical-align: top"  label-position="right" label-width="125px">
         
                <h3>支付信息</h3>
                <el-form-item label="订单号：" >
                    <span>{{form.orderId}}</span>
                </el-form-item>
                <el-form-item label="让利比例比例：" >
                    <span  >{{form.roomRate*100}}%</span>
                </el-form-item>
                <el-form-item label="支付方式：" >
                    <span>{{findWay(form.payType)}}</span>
                </el-form-item>
                <el-form-item label="商品总价（元）：">
                    <span>{{form.orderPrice}}</span>
                </el-form-item>
                <el-form-item label="抵用券抵扣(元) ：">
                    <span>{{form.offsetPrice}}</span>
                </el-form-item>
                <el-form-item label="买家获得奖励券：">
                    <span>{{form.exchangeAmount}}</span>
                </el-form-item>
                <el-form-item label="下单时间：" >
                    <span>{{form.orderTime}}</span>
                </el-form-item>
                <el-form-item label="付款时间：" >
                    <span>{{form.payTime}}</span>
                </el-form-item>
                <el-form-item label="用户取消时间：" v-if="form.cancelTime">
                    <span>{{form.cancelTime}}</span>
                </el-form-item>
                <el-form-item label="取消原因：" v-if="form.cancelReason">
                    <span>{{form.cancelReason}}</span>
                </el-form-item>
                <el-form-item label="申请退款时间：" v-if="form.refundTime">
                    <span>{{form.refundTime}}</span>
                </el-form-item>
                <el-form-item label="退款成功时间：" v-if="form.refundFinishTime">
                    <span>{{form.refundFinishTime}}</span>
                </el-form-item>
                <el-form-item label="退款原因：" v-if="form.refundReason">
                    <span>{{form.refundReason}}</span>
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
                orderState:[{text:'待付款',value:'10001'},{text:'商户待确认',value:'10002'},{text:'用户待确认',value:'10003'},{text:'待评价',value:'10004'},{text:'已完成',value:'10005'},{text:'用户取消',value:'20001'},{text:'用户退款中',value:'30001'},{text:'商户退款中',value:'30002'},{text:'用户退款成功',value:'30003'},{text:'商户退款成功',value:'30004'},{text:'自动取消',value:'20002'}],
                showSource:true

            }
        },
        created(){
           this.fetchData()
        },
        methods: {

            fetchData () {
                this.dataApi.ajax('singleShopHotelOrder',{orderId:this.$route.params.id}, res => {
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
