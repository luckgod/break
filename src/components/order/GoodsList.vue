<template>
    <div class="account" >
        <el-row :span="24" style="margin:26px 0 0;">
            <el-button type="warning">物流商品</el-button>
            <el-button @click="$router.push('/order/discounts_list')">优惠套餐</el-button>
            <el-button @click="$router.push('/order/hotel_list')">酒店订单</el-button>
            <el-button @click="$router.push('/order/voucher_list')">代金券</el-button>
            <el-button @click="$router.push('/order/face_list')">当面付</el-button>
            <hr>
            
              <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="订单号" value="orderId"></el-option>
                            <el-option label="支付流水号" value="serialNo"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item  label="支付方式">
                        <el-select v-model="formInline.orderPayType" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in payWay"></el-option>
                         </el-select>
                     </el-form-item >
                     <el-form-item label="下单时间">
                        <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime" style="width:180px;"></el-date-picker>
                        到
                        <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime" style="width:180px;"></el-date-picker>
                    </el-form-item>
                    <el-form-item  label="催单" label-width="50px">
                        <el-select v-model="formInline.orderIsRemind" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="被催单" value="1"></el-option>
                         </el-select>
                     </el-form-item >
                     <el-form-item label="买家用户名:" >
                            <el-input v-model="formInline.userName" style="width: 150px;"></el-input>
                     </el-form-item>
                     <el-form-item label="商家:" >
                            <el-input v-model="formInline.storeName" style="width: 150px;"></el-input>
                     </el-form-item>
                     <el-form-item label="商品名称:" >
                            <el-input v-model="formInline.goodName" style="width: 150px;"></el-input>
                     </el-form-item>
                    <el-button type="primary" @click="fetchData()">查询</el-button>
                
                </el-form>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane :label="'全部('+numberObj.totalNumber+')'" name="0"></el-tab-pane>
                <el-tab-pane :label="'待付款('+numberObj.notPayNumber+')'" name="1"></el-tab-pane>
                <el-tab-pane :label="'待发货('+numberObj.notReceiveNumber+')'" name="2"></el-tab-pane>
                <el-tab-pane :label="'待收货('+numberObj.receiveNumber+')'" name="4"></el-tab-pane>
                <el-tab-pane :label="'待评价('+numberObj.praiseNumber+')'" name="5"></el-tab-pane>
                <el-tab-pane :label="'已完成('+numberObj.okNumber+')'" name="6"></el-tab-pane>
                <el-tab-pane :label="'用户取消('+numberObj.userCancelNumber+')'" name="3"></el-tab-pane>
                <el-tab-pane :label="'系统取消('+numberObj.sysCancelNumber+')'" name="7"></el-tab-pane>
                <el-tab-pane :label="'退款中('+numberObj.returnNumber+')'" name="11"></el-tab-pane>
              </el-tabs>
        </el-row>
        <el-card  v-for="item in pageInfo.dtos" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <div style="display:inline-block;width: 400px">
               <div>订单号：{{ item.orderId }}</div>
               <div>支付流水号：{{ item.serialNo }}</div>
            </div>
            <div style="display:inline-block;width: 300px">
               <div>支付方式：{{ findWay(item.orderPayType) }}</div>
               <div>商家名称：{{ item.storeName }}</div>
            </div>
            <div style="display:inline-block;">
               <div>订单总价：{{ item.orderTotalAmount}}元</div>
               <!-- <div>买家：{{ item.storeName }}</div> -->
            </div>
            <el-button style="float: right;margin-left: 20px" type="primary" @click="$router.push('/order/goods_detail/'+item.orderId+'?type=1')" v-if="item.shopOrderDetailDtos.length>1&&item.orderStat!=6">订单详情</el-button>
            <el-button style="float: right;" type="warning" v-if="item.orderIsRemind==1">被催单</el-button>
            <el-button style="float: right;" type="primary" v-if="item.orderStat==6 || item.orderStat==7 || item.orderStat==8 || item.orderStat==10" @click="$router.push('/order/logistics_detail/'+item.orderId)">查看物流</el-button>
            <el-button style="float: right;" type="primary" v-if="item.orderStat==3||item.orderStat==11||item.orderStat==9" @click="dialogFormVisible2=true;remark=item.orderCancelReason">取消原因</el-button>
          </div>
          <div  class="el-table tr">
            <el-table
                :data="item.shopOrderDetailDtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                style="width: 100%">
            <el-table-column
                    width="215"
                    label="商品">
                <template scope="scope">
                    <div style="display: inline-block;">
                        <img class="banner" :src="scope.row.goodCover" style="width:55px;">
                    </div>
                    <div style="display: inline-block;width: 120px;vertical-align: middle;padding: 10px;">{{scope.row.goodName}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    label="内部订单号"
                    prop='detailId'>
            </el-table-column>
            <el-table-column
                    label="单价/数量">
                    <template scope="scope">
                        <span>{{scope.row.goodPrice}}/{{ scope.row.buyNum }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="规格"
                    prop='goodSpec'>
            </el-table-column>
            <el-table-column
                    label="订单状态">
                    <template scope="scope">
                        <span>{{findState(scope.row.orderStat,orderState)}}</span>
                    </template>
            </el-table-column>
             <el-table-column
                    label="买家">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+item.userId" target="_blank" >
                              <span class="pointer">{{ item.userName}}</span>
                        </router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="orderPlaceTime" 
                    label="下单时间">
            </el-table-column>
           <!--  <el-table-column
                    label="订单总价"
                    prop='orderTotalAmount'>
                    <template scope="scope">
                        <span>{{item.orderTotalAmount}}</span>
                    </template>
            </el-table-column> -->
            <el-table-column
                    label="操作"
                    width="100">
                    <template scope="scope">
                        <span  class="pointer" v-if="item.shopOrderDetailDtos.length==1 || item.orderStat==6" @click="$router.push('/order/goods_detail/'+scope.row.detailId+'?type=2')">订单详情</span>
                        <span  class="pointer" v-if="scope.row.orderStat==6" @click="editGold(scope.row.detailId)">查看评价</span>
                    </template>
            </el-table-column>
        </el-table>
          </div>
        </el-card>
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


        <!-- 物流信息 -->
        <el-dialog title="物流信息" v-model="dialogVisible2" size="small">
             <div class="modal-body">
                 <div class="form-group">
                     <span>快递公司：{{ logistics_info.logisticsCompany }}</span>
                 </div> 
                 <div class="form-group">
                     <div class="input-group">
                     <span>物流单号：{{ logistics_info.courierNo }}</span>
                     </div>
                 </div>
                  <div class="box-footer box-comments" style="height: 350px; overflow: auto;">
                      <div class="box-comment" v-for="(item,index) in logisticsList">
                          <span class="img-circle img-sm is_new_express" v-if="index==0">最新</span> 
                          <div class="comment-text" >
                               <div class="username">
                                  <span v-if="index==0" style="color: rgb(201, 48, 44)">
                                     {{ item.time }}
                                  </span>
                                  <span v-else>{{ item.time }}</span>
                                </div>
                                <span v-if="index==0" style="color: rgb(201, 48, 44)">
                                    {{ item.context }}
                                </span>
                                <span v-else>{{ item.context }}</span>
                          </div>
                      </div>
                  </div>
              </div>

        </el-dialog>

        <!-- 退款原因-->
         <el-dialog title="退款原因" v-model="dialogFormVisible2">
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
                    type: 'orderId',
                    orderId: '',
                    serialNo:'',
                    orderPayType:'',
                    pageNum:'',
                    pageSize: 5,
                    desc:'DESC',
                    orderIsRemind:'',
                    userName:'',
                    storeName:'',
                    goodName:'',
                    startTime:'',
                    endTime:'',
                    name:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 5,
                    count: 1,
                    dtos: []
                },
                activeName:'0',
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
                orderState:[{text:'待付款',value:'1'},{text:'取消',value:'2'},{text:'待发货',value:'3'},{text:'待收货',value:'4'},{text:'待评价',value:'5'},{text:'已完成',value:'6'}],
                logisticsList:[],
                logistics_info:{},
                company_list:[],
                showSource:false,
                numberObj:{
                    totalNumber:0,
                    notPayNumber:0,
                    notReceiveNumber:0,
                    receiveNumber:0,
                    praiseNumber:0,
                    userCancelNumber:0,
                    sysCancelNumber:0,
                    okNumber:0,
                    returnNumber:0
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
                  this.formInline.startTime=dateFormat(this.startTime)
                  this.formInline.endTime=dateFormat(this.endTime) 
                  if (this.formInline.startTime>this.formInline.endTime) {
                       this.$message({
                        type: 'warning',
                        message: '开始时间不能大于结束时间'
                        });
                       return;
                      }
                  }else{
                      this.formInline.startTime=''
                      this.formInline.endTime=''
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
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageWebShopOrder',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                          
                    }
                });

            },
             fetchNumber () {
                this.dataApi.ajax('countWebShopOrder',null, res => {
                    if (res.responseType === 'S') {
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
                this.formInline.serialNo=''
            },
            deliver(item){
                this.checked=[]
                this.checked.push(item)
                this.dialogVisible=true
                this.form={
                   logisticsCompany:'',
                   courierNo:''
                }
                
            },
            editGold(id){
               this.dataApi.ajax('singleShopEvaluatByExample',{orderId:id,stat:1,evaluateType:1}, res => {
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
