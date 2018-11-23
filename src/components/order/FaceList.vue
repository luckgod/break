<template>
    <div class="account" >
        <el-row :span="24" style="margin:26px 0 0;">
            <el-button @click="$router.push('/order/goods_list')">物流商品</el-button>
            <el-button @click="$router.push('/order/discounts_list')">优惠套餐</el-button>
            <el-button @click="$router.push('/order/hotel_list')">酒店订单</el-button>
            <el-button @click="$router.push('/order/voucher_list')">代金券</el-button>
            <el-button type="warning">当面付</el-button>
            <hr>
              <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="订单号" value="transferId"></el-option>
                            <el-option label="支付流水号" value="serialNo"></el-option>
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
                            <el-input v-model="formInline.payUserName" style="width: 150px;"></el-input>
                     </el-form-item>
                     <el-form-item label="商家:" >
                            <el-input v-model="formInline.storeName" style="width: 150px;"></el-input>
                     </el-form-item>
                    <el-button type="primary" @click="fetchData(1)">查询</el-button>
                
                </el-form>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane :label="'全部('+numberObj.countAllNum+')'" name="-1"></el-tab-pane>
                <el-tab-pane :label="'待评价('+numberObj.countNotEvaluateNum+')'" name="1"></el-tab-pane>
                <el-tab-pane :label="'已完成('+numberObj.countFinishNum+')'" name="2"></el-tab-pane>
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
                    prop='transferId'>
            </el-table-column>
            <el-table-column
                    label="支付流水号"
                    prop='serialNo'>
            </el-table-column>
             <el-table-column
                    width="140"
                    label="买家">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.payUserId" target="_blank" >
                              <span class="pointer">{{ scope.row.payUserName}}</span>
                        </router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    label="商家"
                    prop='storeName'>
            </el-table-column>
             <el-table-column
                    prop='exchangeAmount'
                    label="获得奖励券">
            </el-table-column>
            <el-table-column
                    label="订单状态">
                    <template scope="scope">
                        <span>{{findState(scope.row.transferStat,orderState)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="支付方式"
                    prop='refundsId'>
                    <template scope="scope">
                        <span>{{ findWay(scope.row.payType) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="CRT_TIME" 
                    label="下单时间">
                    <template scope="scope">
                        <span>{{scope.row.payTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="订单总价"
                    prop='payAmt'>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="100">
                    <template scope="scope">
                        <span  class="pointer" v-if="scope.row.transferStat=='7'" @click="editGold(scope.row.transferId)">查看评价</span>
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
                    transferId: '',
                    serialNo:'',
                    payType:'',
                    pageNum:'',
                    pageSize: 10,
                    desc:'DESC',
                    sort:'CRE_TIME',
                    payUserName:'',
                    storeName:'',
                    buyBeginTime:'',
                    buyEndTime:'',
                    goodType:0,
                    newStatus:'',
                    type:'transferId',
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
                form:{
                   logisticsCompany:'',
                   courierNo:''
                },
                f:{
                  evaluateImage:[]
                },
                type:'',
                orderState:[{text:'待评价',value:'1'},{text:'已完成',value:'7'}],
                numberObj:{
                    countAllNum:0,
                    countNotEvaluateNum:0,
                    countFinishNum:0
                },
                startTime:'',
                endTime:'',
                img: {
                    is_preview: false,
                    preview_url: '',
                    image_index: null,
                    preview_images: [],
                    transform:''
                },
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
                  this.formInline.buyBeginTime=dateFormat(this.startTime)
                  this.formInline.buyEndTime=dateFormat(this.endTime) 
                  if (this.formInline.buyBeginTime>this.formInline.buyEndTime) {
                       this.$message({
                        type: 'warning',
                        message: '开始时间不能大于结束时间'
                        });
                       return;
                      }
                  }else{
                      this.formInline.buyBeginTime=''
                      this.formInline.buyEndTime=''
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
                this.formInline.newStatus=this.activeName
                if (this.activeName=='-1') {
                  this.formInline.newStatus=''
                }
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPagePayFaceTransferForControl',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                          
                    }
                });

            },
            fetchNumber () {
                this.dataApi.ajax('countPagePayFaceTransfer',{goodType:0}, res => {
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
                this.formInline.transferId=''
                this.formInline.serialNo=''
            },
            editGold(id){
               this.dataApi.ajax('singleShopEvaluatByExample',{orderId:id,stat:1,evaluateType:6}, res => {
                    if (res.responseType === 'S') {
                          this.dialogFormVisible=true
                          this.f=res
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
