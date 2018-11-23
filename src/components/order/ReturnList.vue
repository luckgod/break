<template>
    <div class="account" >
        <el-row :span="24" style="margin:26px 0 0;">
              <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="退款单号" value="refundId"></el-option>
                            <el-option label="订单编号" value="orderId"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;" :maxlength="50"></el-input>
                    </el-form-item>
                     <el-form-item label="申请时间">
                        <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime" style="width:180px;"></el-date-picker>
                        到
                        <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime" style="width:180px;"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="formInline.type2" style="width: 120px;" @change="changeType2">
                            <el-option label="商家名称" value="storeName"></el-option>
                            <el-option label="买家名称" value="userName"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name2" style="width: 150px;" :maxlength="50"></el-input>
                    </el-form-item>
                      <el-form-item  label="按退款退货">
                        <el-select v-model="formInline.isRefundGood" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="仅退款" value="1"></el-option>
                                <el-option label="退货退款" value="2"></el-option>
                         </el-select>
                     </el-form-item >
                    <el-button type="primary" @click="fetchData(1)">查询</el-button>
                
                </el-form>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                  <el-tab-pane :label="'全部('+numberObj.totalNumber+')'" name="-1"></el-tab-pane>
                  <el-tab-pane :label="'售后待处理('+numberObj.noHandleNumber+')'" name="'0','4','8'"></el-tab-pane>
                  <el-tab-pane :label="'退款/退货成功('+numberObj.okNumber+')'" name="'1','5'"></el-tab-pane>
                  <el-tab-pane :label="'退款/退货已拒绝('+numberObj.refuseNumer+')'" name="'2','6'"></el-tab-pane>
                </el-tabs>
        </el-row>
        <el-card  v-for="item in pageInfo.dtos" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <div style="display:inline-block;width: 200px;">
               <div>退款单号：{{ item.refundId }}</div>
               <div>退款金额（元）：{{ item.refundAmt }}</div>
            </div>
            <div style="display:inline-block;">
               <div>订单编号：{{ item.orderId }}</div>
               <div>商家：{{ item.storeName }}</div>
            </div>
            <el-button style="float: right;" type="primary" @click="$router.push('/order/return_detail/'+item.refundId)">订单详情</el-button>
            <el-button style="float: right;margin-right: 15px;" type="primary" @click="" v-if="item.refundState==8">退货物流</el-button>
            <el-button style="float: right;margin-right: 15px;" type="primary" @click="editGold(item)">退款说明</el-button>
    <!--         <el-button style="float: right;margin-right: 15px;" type="danger" @click="refuse(item)" v-if="item.refundState==0||item.refundState==4">拒绝</el-button>
            <el-button style="float: right;margin-right: 15px;" type="success" @click="submitForm(item,'通过')" v-if="item.refundState==0||item.refundState==4">通过</el-button>      -->
          </div>
          <div  class="el-table tr">
            <el-table
                :data="item.orderRefundDetailDtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%">
            <el-table-column
                    label="内部编号"
                    prop='detailId'>
            </el-table-column>
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
                        <span>{{findState(item.refundState,orderState)}}</span>
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
                    prop="CRT_TIME" 
                    label="申请时间">
                    <template scope="scope">
                        <span>{{item.refundApplyTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="退款类型"
                    prop='refundsId'>
                    <template scope="scope">
                        <span>{{ item.isRefundGood==1? '仅退款':'退货退款'}}</span>
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

         <!-- 退款说明-->
         <el-dialog title="退款说明" v-model="dialogFormVisible">
            <el-form label-width="120px">
                <el-form-item label="退款说明：" >
                        <span>{{ detailInfo.refundRemark }}</span>
                </el-form-item>
                 <el-form-item label="附加图片：" >
                         <img :src="item" alt="" v-for="item in detailInfo.storeImgDtos" class="img-preview" @click="previewImage(item)" style="margin-right: 10px;">
                         <span v-if="detailInfo.storeImgDtos==''">无</span>
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

        <!-- 拒绝原因-->
         <el-dialog title="拒绝原因" v-model="dialogVisible3">
            <el-form label-width="120px">
                <el-form-item label="拒绝理由：" >
                       <el-input v-model="f.refundRefuseRemark" type="textarea" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary"
                           @click="submitForm(f,'拒绝')">确认</el-button>
            </div>
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
                    type: 'refundId',
                    type2: 'storeName',
                    name:'',
                    name2:'',
                    refundState: '',
                    storeName: '',
                    startTime:'',
                    endTime:'',
                    pageNum:'',
                    pageSize:5,
                    sort:'T1.CRE_TIME',
                    desc:'DESC',
                    refundId:'',
                    userName:'',
                    isRefundGood:'',
                    refundStateList:'',
                    orderId:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize:5,
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
                detailInfo:{
                  refundRemark:'',
                  storeImgDtos:[]
                },
                f:{
                  refundRefuseRemark:'',
                  refundId:'',
                  refundState:''
                },
                orderState:[{text:'仅退款审核中',value:'0'},{text:'仅退款已通过',value:'1'},{text:'仅退款已拒绝',value:'2'},{text:'仅退款撤销',value:'3'},{text:'申请退款退货审核中',value:'4'},{text:'已通过退货退款',value:'5'},{text:'已拒绝退货退款',value:'6'},{text:'已撤销退货退款',value:'7'},{text:'待确认货',value:'8'},{text:'已收到退货',value:'9'}],
                logistics_info:{},
                logisticsList:[],
                numberObj:{
                    totalNumber:0,
                    noHandleNumber:0,
                    okNumber:0,
                    refuseNumer:0
                },
                startTime:'',
                endTime:'',
                 img: {
                    is_preview: false,
                    preview_url: '',
                    image_index: null,
                    preview_images: [],
                    transform:''
                }
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
                this.formInline.refundStateList=this.activeName
                if (this.activeName=='-1') {
                  this.formInline.refundStateList=''
                }
                this.formInline[this.formInline.type]=this.formInline.name
                this.formInline[this.formInline.type2]=this.formInline.name2
                this.dataApi.ajax('selectPageWebRefund',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                          
                    }
                });

            },
             fetchNumber () {
                this.dataApi.ajax('countWebRefund',null, res => {
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
                this.formInline.refundId=''
            },
            changeType2() {
                this.formInline.refundsState=''
                this.formInline.storeName=''
            },
            editGold(item){
               this.dialogFormVisible=true
               this.detailInfo=item
            },
            submitForm(info,type){
                var state=''
                if (type=='通过') {
                    this.$confirm('确定通过?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                          
                          if (info.isRefundGood==1) {
                                 state=1
                          }else{
                            state=5
                         }
                         var data={
                           refundId:info.refundId,
                           refundState:state
                         }
                          this.dataApi.ajax('editRefund',data, res => {
                                if (res.responseType === 'S') {
                                     this.showMsg('通过成功');
                                     this.dialogVisible3=false
                                     this.fetchData(this.pageInfo.pageNum)
                                }
                            });
                      }).catch(() => {
              
                      });
                }else{
                   if (info.isRefundGood==1) {
                       state=2
                   }else{
                      state=6
                   }
                   var data={
                       refundId:info.refundId,
                       refundRefuseRemark:info.refundRefuseRemark,
                       refundState:state
                     }
                   this.dataApi.ajax('editRefund',data, res => {
                        if (res.responseType === 'S') {
                             this.showMsg('拒绝成功');
                             this.dialogVisible3=false
                             this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                }
                 
               
            }, 
            changeLogistics(item){
                this.dialogVisible3=true
                this.form={
                   logisticsCompany:item.logisticsCompany,
                   courierNo:item.courierNo,
                   orderId:item.orderId
                }
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
            },
            refuse(item){
                this.dialogVisible3=true
                this.f={
                  refundRefuseRemark:'',
                  refundId:item.refundId,
                  refundState:item.refundState,
                  isRefundGood:item.isRefundGood
                }    
            }

        }
    }
</script>
