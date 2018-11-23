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
                        <img class="banner" :src="scope.row.goodCover" style="width:120px;" >
                    </div>
                    <div style="display: inline-block;width: 120px;vertical-align: middle;padding: 10px;">{{scope.row.goodName}}</div>
                </template>
                </el-table-column>
                <el-table-column
                        prop="detailId"
                        label="内部订单号">
                </el-table-column>
                <el-table-column
                        label="单价/数量">
                        <template scope="scope">
                            <span>{{ scope.row.goodPrice }}元/{{ scope.row.buyNum }}</span> 
                        </template>
                </el-table-column>
                <el-table-column
                        prop="detailId"
                        label="让利比例">
                        <template scope="scope">
                            <span>{{ scope.row.goodRatio*100 }}%</span> 
                        </template>
                </el-table-column>
                <el-table-column
                        prop="goodSpec"
                        label="规格">
                </el-table-column>
                <el-table-column
                        label="订单状态">
                        <template scope="scope">
                            <span>{{ findState(scope.row.orderStat,orderState)}}</span>
                        </template>
                </el-table-column>
         </el-table>
         <div style="width: 80%;margin: 0 auto;min-width: 1050px;padding-left: 50px" v-if="form.orderStat!=3&form.orderStat!=4&form.orderStat!=9&form.orderStat!=11">
            <ol class="progress-wrap">
                <li class="progress-one">
                    <div class="progress-line"></div>
                    <div class="progress-content">
                        <span class="progress-text" style="top: -30px;left:-20px;">买家下单</span>
                        <span class="progress-number" id="start">1</span>
                        <span class="progress-text">{{ form.orderTime }}</span>
                    </div>
                </li>
                <li class="progress-two">
                    <div class="progress-line"></div>
                    <div class="progress-content">
                        <span class="progress-text" style="top: -30px;left:-20px;">买家付款</span>
                        <span class="progress-number" id="second">2</span>
                        <span class="progress-text">{{ form.orderPayTime }}</span>
                    </div>
                </li>
                <li class="progress-three">
                    <div class="progress-line"></div>
                    <div class="progress-content">
                        <span class="progress-text" style="top: -30px;left:-20px;">商家发货</span>
                        <span class="progress-number" id="third">3</span>
                        <span class="progress-text">{{ firstData.orderDeliverTime }}</span>
                    </div>
                </li>
                <li class="progress-four">
                    <div class="progress-line"></div>
                    <div class="progress-content">
                        <span class="progress-text" style="top: -30px;left:-20px;">买家收货</span>
                        <span class="progress-number" id="end">4</span>
                        <span class="progress-text">{{ firstData.orderTakeTime }}</span>
                    </div>
                </li>
                <li class="progress-five">
                    <div class="progress-content">
                        <span class="progress-text" style="top: -30px;left:-40px;">买家评价订单完成</span>
                        <span class="progress-number" id="five">5</span>
                        <span class="progress-text">{{ firstData.evaluateTime }}</span>
                    </div>
                </li>
            </ol>
        </div>
        <hr>
        <el-form :model="form"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;width: 600px" label-position="right" label-width="140px">
         <h3>支付信息</h3>
                <el-form-item label="订单号：" >
                    <span>{{form.orderId}}</span>
                </el-form-item>
                <el-form-item label="支付方式：" >
                    <span>{{ findWay(form.orderPayType) }}</span>
                </el-form-item>
                <el-form-item label="商品总价（元）：">
                    <span>{{form.orderTotalAmount}}</span>
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
                <el-form-item label="商家：" >
                    <span>{{form.storeName}}</span>
                </el-form-item>
                <el-form-item label="用户申请退款时间：" v-if="form.orderReturnApplyTime">
                    <span>{{form.orderReturnApplyTime}}</span>
                </el-form-item>
                <el-form-item label="退款成功时间：" v-if="form.orderCancelTime">
                    <span>{{form.orderCancelTime}}</span>
                </el-form-item>
                <el-form-item label="取消原因：" v-if="form.orderCancelReason">
                    <span>{{form.orderCancelReason}}</span>
                </el-form-item>
        </el-form>
        <el-form :model="form"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;vertical-align: top" label-position="right" label-width="125px">
         <h3>买家信息</h3>
                <el-form-item label="买家：" >
                    <span>{{form.userName}}</span>
                </el-form-item>
                <el-form-item label="收货人：" >
                    <span>{{form.orderTakeName}}</span>
                </el-form-item>
                <el-form-item label="联系电话："  >
                    <span  >{{form.orderTakePhone}}</span>   
                </el-form-item>   
                <el-form-item label="收货地址：" style="margin-right:50px;">
                    <span >{{form.orderTakeAddress}}</span>   
                </el-form-item>
                <el-form-item label="买家留言:" >
                    <span>{{form.remark}}</span>
                </el-form-item>  
        </el-form>
    </div>

</template>
<style>
.progress-wrap {
    padding: 0px;
    width: 100%;
    height: 100px;
}
 
.progress-wrap li {
    margin-top: 30px;
    list-style: none;
    float: left;
    width: 200px;
    height: 30px;
    position: relative;
}
 
.progress-wrap .progress-line {
    background-color: #b9b9b9;
    position: absolute;
    height: 8px;
    width: 100%;
    top: 13px;
    margin-left: 2px;
    transition: background-color 2s linear;
    -moz-transition: background-color 2s linear;
    -webkit-transition: background-color 2s linear;
    -o-transition: background-color 2s linear;
}
 
.progress-wrap .progress-content {
    position: absolute;
    text-align: center;
}
 
.progress-wrap .progress-content .progress-number {
    display: inline-block;
    *zoom:1;
    position: absolute;
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    border-radius: 50%;
    border: 2px solid rgba(224,224,224,1);
    font-family: tahoma;
    font-weight: bold;
    font-size: 16px;
    background-color: #b9b9b9;
    box-shadow: 1px 1px 2px rgba(0,0,0,.2) inset;
    cursor: pointer;
}
 
.progress-wrap .progress-content .progress-text {
    position: absolute;
    font-size: 15px;
    width: 200px;
    text-align: left;
    top: 42px;
    left: -40px;
    color: black;
    font-weight: bold;
}
</style>
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
                orderState:[{text:'待付款',value:'1'},{text:'取消',value:'2'},{text:'待发货',value:'3'},{text:'待收货',value:'4'},{text:'待评价',value:'5'},{text:'已完成',value:'6'}],
                payWay:[{text:'抵用券',value:'1'},{text:'现金支付',value:'2'},{text:'混合支付',value:'3'}],
                showSource:true,
                firstData:{}

            }
        },
        created(){
           this.fetchData()
        },
        mounted(){
           $(function() {
                var currentColor = '#3c3';
                var unfinishedColor = '#b9b9b9';
                var finishedColor = '#3c3';
         
                $('#start').click(function() {
                    $(this)
                    .css('background-color', currentColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
         
                    $('#second')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
         
                    $('#third')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
         
                    $('#end')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)

                    $('#five')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
                })
         
                $('#second').click(function() {
                    $(this)
                    .css('background-color', currentColor)

                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
         
                    $('#start')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', currentColor)
         
                    $('#third')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
         
                    $('#end')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)

                    $('#five')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
                })
         
                $('#third').click(function() {
                    $(this)
                    .css('background-color', currentColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
         
                    $('#start')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', finishedColor)
         
                    $('#second')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', currentColor)
         
                    $('#end')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)

                    $('#five')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
                })
         
                $('#end').click(function() {
                    $(this)
                    .css('background-color', currentColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)
         
                    $('#start')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', finishedColor)
         
                    $('#second')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', finishedColor)
         
                    $('#third')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', currentColor)

                    $('#five')
                    .css('background-color', unfinishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', unfinishedColor)

                })

                $('#five').click(function() {
                    $(this)
                    .css('background-color', currentColor)

         
                    $('#start')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', finishedColor)
         
                    $('#second')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', finishedColor)
         
                    $('#third')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', finishedColor)

                    $('#end')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', finishedColor)

                    $('#five')
                    .css('background-color', finishedColor)
                    .parent('div').prev('div.progress-line').css('background-color', currentColor)
                })
            })
        },
        methods: {

            fetchData () {
                if (this.$route.query.type==1) {
                     this.dataApi.ajax('singleShopOrder',{orderId:this.$route.params.id}, res => {
                        if (res.responseType === 'S') {
                               this.tableData = res.shopOrderDto.shopOrderDetailDtos;
                               this.form = res.shopOrderDto
                               this.firstData=res.shopOrderDto.shopOrderDetailDtos[0]
                               if (this.form.orderStat==1) {
                                  $('#start').click()
                               }else if (this.form.orderStat==2) {
                                  $('#second').click()
                               }else if (this.form.orderStat==6) {
                                  $('#second').click()
                               }else if (this.form.orderStat==7) {
                                   $('#third').click()
                               }else if (this.form.orderStat==8) {
                                   $('#end').click()
                               }else if (this.form.orderStat==10) {
                                   $('#five').click()
                               }
                               
                        }
                    });
                }else{
                    this.dataApi.ajax('singleShopOrderDetail',{detailId:this.$route.params.id}, res => {
                        if (res.responseType === 'S') {
                               this.tableData[0] = res.shopOrderDetailDto;
                               this.form = res.shopOrderDto
                               this.firstData=res.shopOrderDetailDto
                               if (this.form.orderStat==1) {
                                  $('#start').click()
                               }else if (this.form.orderStat==6) {
                                  $('#second').click()
                               }else if (this.form.orderStat==2) {
                                  $('#second').click()
                               }else if (this.form.orderStat==7) {
                                   $('#third').click()
                               }else if (this.form.orderStat==8) {
                                   $('#end').click()
                               }else if (this.form.orderStat==10) {
                                   $('#five').click()
                               }
                        }
                    });
                }
                

            },
            handleCurrentChange(val) {
                this.fetchData(val)
            }

        }
    }
</script>
ZL