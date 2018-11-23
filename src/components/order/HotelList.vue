<template>
    <div class="account" >
        <el-row :span="24" style="margin:26px 0 0;">
            <el-button @click="$router.push('/order/goods_list')">物流商品</el-button>
            <el-button @click="$router.push('/order/discounts_list')">优惠套餐</el-button>
            <el-button type="warning">酒店订单</el-button>
            <el-button @click="$router.push('/order/voucher_list')">代金券</el-button>
            <el-button @click="$router.push('/order/face_list')">当面付</el-button>
            <hr>
            
              <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="订单号" value="orderId"></el-option>
                            <el-option label="支付流水号" value="orderPaySerial"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item  label="支付方式">
                        <el-select v-model="formInline.payType" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in payWay"></el-option>
                         </el-select>
                     </el-form-item >
                     <el-form-item label="下单时间">
                        <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime" style="width:180px;"></el-date-picker>
                        到
                        <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime" style="width:180px;"></el-date-picker>
                    </el-form-item>
                     <el-form-item label="买家用户名:" >
                            <el-input v-model="formInline.buyerName" style="width: 150px;"></el-input>
                     </el-form-item>
                     <el-form-item label="客房名称:" >
                            <el-input v-model="formInline.roomName" style="width: 150px;"></el-input>
                     </el-form-item>
                    <el-button type="primary" @click="fetchData(1)">查询</el-button>
                
                </el-form>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane :label="'全部('+numberObj.total+')'" name="-1"></el-tab-pane>
                <el-tab-pane :label="'待付款('+numberObj.order+')'" name="10001"></el-tab-pane>
                <el-tab-pane :label="'商家待确认('+numberObj.storeConfirm+')'" name="10002"></el-tab-pane>
                <el-tab-pane :label="'用户待确认('+numberObj.pay+')'" name="10003"></el-tab-pane>
                <el-tab-pane :label="'待评价('+numberObj.userConfirm+')'" name="10004"></el-tab-pane>
                <el-tab-pane :label="'已完成('+numberObj.orderFinish+')'" name="10005"></el-tab-pane>
                <el-tab-pane :label="'用户取消('+numberObj.userCancel+')'" name="20001"></el-tab-pane>
                <el-tab-pane :label="'用户退款中('+numberObj.userRefund+')'" name="30001"></el-tab-pane>
                <el-tab-pane :label="'商户退款中('+numberObj.storeRefund+')'" name="30002"></el-tab-pane>
                <el-tab-pane :label="'用户退款成功('+numberObj.userRefundSuccess+')'" name="30003"></el-tab-pane>
                <el-tab-pane :label="'商户退款成功('+numberObj.storeRefundSuccess+')'" name="30004"></el-tab-pane>
                <el-tab-pane :label="'自动取消('+numberObj.systemCancel+')'" name="20002"></el-tab-pane>
              </el-tabs>
        </el-row>
        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%">
            <el-table-column
                    label="订单号"
                    prop='orderId'>
            </el-table-column>
            <el-table-column
                    label="支付流水号"
                    prop='orderPaySerial'>
            </el-table-column>
            <el-table-column
                    width="215"
                    label="客房名称">
                <template scope="scope">
                    <div style="display: inline-block;">
                        <img class="banner" :src="scope.row.roomImg" style="width:55px;">
                    </div>
                    <div style="display: inline-block;width: 120px;vertical-align: middle;padding: 10px;">{{scope.row.roomName}}</div>
                </template>
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
                    label="买家">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank" >
                              <span class="pointer">{{ scope.row.buyerName}}</span>
                        </router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    label="商家"
                    prop='storeName'>
            </el-table-column>
            <el-table-column
                    label="支付方式">
                    <template scope="scope">
                        <span>{{findWay(scope.row.payType)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="订单状态"
                    prop='orderStat'>
                    <template scope="scope">
                        <span>{{ findState(scope.row.orderStat,orderState)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="orderTime" 
                    label="下单时间">
            </el-table-column>
            <el-table-column
                    label="订单总价"
                    prop='orderPrice'>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="100">
                    <template scope="scope">
                        <span  class="pointer" v-if="scope.row.orderStat=='10005'" @click="editGold(scope.row.orderId)">查看评价</span>
                        <span  class="pointer"  @click="$router.push('/order/hotel_detail/'+scope.row.orderId)">订单详情</span>
                        <span  class="pointer" @click="dialogFormVisible2=true;remark=scope.row.refundReason"  v-if="scope.row.orderStat=='30001'||scope.row.orderStat=='30003'">退款原因</span>
                        <span  class="pointer" @click="dialogFormVisible2=true;remark=scope.row.cancelReason"  v-if="scope.row.orderStat=='20001'">取消原因</span>
                    </template>
            </el-table-column>
        </el-table>
        <div class="paginate">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.pageNum"
                    :page-size="pageInfo.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pageInfo.count">
            </el-pagination>
        </div>

         <!-- 查看评价-->
         <el-dialog title="查看评价" v-model="dialogFormVisible">
            <el-form label-width="120px">
                <el-form-item label="评价时间：" >
                        <span>{{ f.evaluateTime }}</span>
                </el-form-item>
                <el-form-item label="评价星级：" >
                        <span>{{ f.evaluateStar }}星</span>
                </el-form-item>
                <el-form-item label="评价内容：" >
                        <span>{{ f.evaluateContent }}</span>
                </el-form-item>
                 <el-form-item label="图片：" >
                         <img :src="item" alt="" v-for="item in f.evaluateImage" class="img-preview" @click="previewImage(item)" style="margin-right: 10px;">
                         <span v-if="f.evaluateImage==''">无</span>
                </el-form-item>
            </el-form>
        </el-dialog>
        <div class="weui-gallery" style="display: block;z-index: 9999;" v-show="img.is_preview" >
            <span class="weui-gallery__img" :style="{backgroundImage:img.preview_url,transform:img.transform}" @click="hidePreview"></span>
            <div class="weui-gallery__opr white_pointer">
                <div  class="weui-gallery__del" @click.prevent="rotate()">
                    <img src="../../assets/images/xuanzhuan.png" height="25" width="25">
                    <span class="weui-span_del">旋转</span>
                </div>
            </div>
        </div>

        <!-- 退款原因-->
         <el-dialog title="退款/取消原因" v-model="dialogFormVisible2">
            <el-form label-width="120px">
                <el-form-item label="原因：" >
                        <span>{{ remark }}</span>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>
<style>

.type{
  font-size: 17px;
  margin-top: 30px;
  color: #5E5E5E;
}
.type span{
  width: auto;
  display: inline-block;
  height: 35px;
  margin-right: 30px;
}
.choosed{
  border-bottom: 3px solid #20A0FF;
  font-weight: bold;
}
.el-table-filter__list{
     height: auto;
    max-height: 200px;
    overflow: scroll;
}
.box-comments {
    background: #f7f7f7;
}
.box-comments .comment-text {
    margin-left: 40px;
    color: #555;
}
.box-comments .username {
    color: #444;
    display: block;
    font-weight: 600;
}
.box-comments .box-comment {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}
.is_new_express {
    color: #fff;
    background: #c9302c;
    line-height: 30px;
    font-size: 1rem;
    padding-left: 3px;
    float: left;
    width: 30px!important;
    height: 30px!important;
}
.box-footer {
    border-bottom-left-radius: 3px;
    border-top: 1px solid #f4f4f4;
    padding: 10px;
}
 .el-tabs__item{
     font-size:18px !important;
     font-weight: bold;
  }
</style>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                loading:false,
                loading2:false,
                formLabelWidth: '100px',
                formInline: {
                    orderId: '',
                    orderPaySerial:'',
                    payType:'',
                    pageNum:'',
                    pageSize:10,
                    desc:'DESC',
                    sort:'ORDER_TIME',
                    buyerName:'',
                    minOrderTime:'',
                    maxOrderTime:'',
                    roomName:'',
                    orderStat:'',
                    type:'orderId',
                    name:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize:10,
                    count: 1,
                    dtos: []
                },
                activeName:'-1',
                dialogVisible:false,
                dialogVisible2:false,
                dialogVisible3:false,
                dialogFormVisible:false,
                dialogFormVisible2:false,
                form:{
                   logisticsCompany:'',
                   courierNo:''
                },
                f:{
                  evaluateImage:[]
                },
                orderState:[{text:'待付款',value:'10001'},{text:'商户待确认',value:'10002'},{text:'用户待确认',value:'10003'},{text:'待评价',value:'10004'},{text:'已完成',value:'10005'},{text:'用户取消',value:'20001'},{text:'用户退款中',value:'30001'},{text:'商户退款中',value:'30002'},{text:'用户退款成功',value:'30003'},{text:'商户退款成功',value:'30004'},{text:'自动取消',value:'20002'}],
                numberObj:{
                    total:0,
                    order:0,
                    storeConfirm:0,
                    pay:0,
                    userConfirm:0,
                    orderFinish:0,
                    userCancel:0,
                    userRefund:0,
                    storeRefund:0,
                    systemCancel:0,
                    userRefundSuccess:0,
                    storeRefundSuccess:0
                },
                startTime:'',
                endTime:'',
                detail:{
                   post_img:[],
                   remark:''
                 },
                 img: {
                    is_preview: false,
                    preview_url: '',
                    image_index: null,
                    preview_images: [],
                    transform:''
                },
                remark:''
            }
        },
        created(){
            
        },
        activated() {
            this.fetchNumber()
            this.fetchData(this.pageInfo.pageNum);
            
        },
        mounted(){

        },
        methods: {
            fetchData (page=1) {
               if (this.startTime && this.endTime) {
                  this.formInline.minOrderTime=dateFormat(this.startTime)
                  this.formInline.maxOrderTime=dateFormat(this.endTime) 
                  if (this.formInline.startTime>this.formInline.endTime) {
                       this.$message({
                        type: 'warning',
                        message: '开始时间不能大于结束时间'
                        });
                       return;
                      }
                  }else{
                      this.formInline.minOrderTime=''
                      this.formInline.maxOrderTime=''
                  }
                  if (this.startTime&&!this.endTime) {
                       this.$message({
                            type: 'warning',
                            message: '请选择结束时间'
                        });
                       return;
                  }
                  if (!this.startTime&&this.endTime) {
                       this.$message({
                            type: 'warning',
                            message: '请选择开始时间'
                        });
                       return;
                  }
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = page
                this.formInline.orderStat=this.activeName
                if (this.activeName=='-1') {
                  this.formInline.orderStat=''
                }
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageShopHotelOrder',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                          
                    }
                });

            },
             fetchNumber () {
                this.dataApi.ajax('selectShopHotelOrderStatCount',null, res => {
                    if (res.responseType === 'S') {
                          //this.company_list=res.data
                          this.numberObj=res
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchNumber()
                this.fetchData(val);
            },
            handleClick(tab) {
                this.fetchNumber()
                this.fetchData(1)
                
            },
            order(column){
                if (!column.order) {
                    return;
                }
                if (column.order=='ascending') {
                     this.formInline.desc='ASC'
                }else{
                    this.formInline.desc='DESC'
                } 
                this.fetchData(this.pageInfo.pageNum)
               
            },
            changeType() {
                this.formInline.orderId=''
                this.formInline.orderPaySerial=''
            },
            sendOut(){
              var arr=[]
               for (var i = this.checked.length - 1; i >= 0; i--) {
                   arr[i]={
                       orderId:this.checked[i].orderId,
                       userId:this.checked[i].userId,
                       phone:this.checked[i].phone,
                       logisticsCompany:this.form.logisticsCompany,
                       courierNo:this.form.courierNo,
                       goodsName:this.checked[i].goodsName
                   }
               }
               this.loading2=true
                   this.dataApi.ajax('MallOrderControl/deliverBatch',{orderIdList:JSON.stringify(arr)}, res => {
                    if (res.responseType === 0) {
                         this.$message({
                            type: 'success',
                            message: '发货成功!'
                          });
                         for (var i = this.checked.length - 1; i >= 0; i--) {
                               if (this.checked[i].isRemind==1) {
                                    this.dataApi.ajax('MallOrderControl/remindOrder',
                                        {orderId:this.checked[i].orderId}, res => {

                                     });
                               }
                          }
                          this.loading2=false
                         this.dialogVisible=false
                         this.fetchData(this.pageInfo.pageNo)
                    }
                });
            },
            editGold(id){
               this.dataApi.ajax('singleShopEvaluatByExample',{orderId:id,stat:1,evaluateType:3}, res => {
                    if (res.responseType === 'S') {
                          this.dialogFormVisible=true
                          this.f=res
                    }
                });
            },
            submitForm(){
                this.f.ebbyYuan=this.ebbyYuan
                this.f.cash=this.cash
                this.dataApi.ajax('MallOrderListControl/EditOrderPrice',this.f, res => {
                    if (res.responseType === 0) {
                         this.$message({
                            type: 'success',
                            message: '修改成功!'
                          });
                         this.dialogFormVisible=false
                         this.fetchData(this.pageInfo.pageNo)
                    }
                });
            },
            reminder(id){
                 this.$confirm('请及时前去发货', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.dataApi.ajax('MallOrderControl/remindOrder',{orderId:id}, res => {
                    if (res.responseType === 0) {
                         this.$message({
                            type: 'success',
                            message: '处理成功!'
                          });
                         this.fetchData(this.pageInfo.pageNo)
                    }
                 });
                }).catch(() => {
                           
                });
               
            },
            returnDetail(item){
                var arr=[]
                for (var i = item.mallNewRefundPojos.length - 1; i >= 0; i--) {
                    arr[i]=item.mallNewRefundPojos[i].refundsId
                }
                this.$router.push('/mall/return_detail/'+arr+'?exampleId='+item.exampleId)
            },
            logistics(item){
                this.logisticsList=[]
                this.logistics_info.logisticsCompany=item.logisticsCompany
                this.logistics_info.courierNo=item.courierNo
                this.dialogVisible2=true
                this.dataApi.ajax('LogisticsControl/logisticsQuery',{logisticsName:item.logisticsCompany,logisticsNo:item.courierNo}, res => {
                    if (res.responseType === 0) {
                         this.logisticsList=res.data
                    }
                 });
            },
            changeLogistics(item){
                this.dialogVisible3=true
                this.form={
                   logisticsCompany:item.logisticsCompany,
                   courierNo:item.courierNo,
                   orderId:item.orderId
                }
            },
            submitLogistic(){
                this.dataApi.ajax('MallOrderControl/editOrderInfo',{logisticsCompany:this.form.logisticsCompany,courierNo:this.form.courierNo,orderId:this.form.orderId}, res => {
                    if (res.responseType === 0) {
                         this.fetchData(this.pageInfo.pageNo)
                         this.dialogVisible3=false
                         this.showMsg('修改成功')
                    }
                 });
            },
            previewImage(src) {
                this.img.is_preview = true;
                this.img.preview_url = `url(${src})`;
                this.img.preview_images = this.images;
                this.img.transform = '';
            },
            hidePreview() {
                this.img.is_preview = false;
                this.img.preview_url = null;
                this.img.image_index = null;
                this.img.preview_images = [];
                this.img.transform = '';
            },
             rotate(){
              if (this.img.transform=='') {
                  this.img.transform='rotate(90deg)'
              }else if (this.img.transform=='rotate(90deg)') {
                  this.img.transform='rotate(180deg)'
              }else if (this.img.transform=='rotate(180deg)') {
                  this.img.transform='rotate(270deg)'
              }else if (this.img.transform=='rotate(270deg)') {
                  this.img.transform=''
              }
            }

        }
    }
</script>
