<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0 0;">
            <el-col :span="24">
                       <el-button type="primary" @click="back()" style="margin-right: 10px;">返回</el-button>
                       <span>退款/退货详情</span>
            </el-col>
        </el-row>
        <hr>
        <div>
        <el-table
                  :data="tableData"
                  style="margin-bottom: 20px;">
                  <el-table-column
                    width="300"
                    label="商品">
                <template scope="scope">
                    <div style="display: inline-block;">
                        <img class="banner" :src="scope.row.goodCover" style="width:80px;" >
                    </div>
                    <div style="display: inline-block;width: 120px;vertical-align: middle;padding: 10px;">{{scope.row.goodName}}</div>
                </template>
                </el-table-column>
                <el-table-column
                        label="单价/数量">
                        <template scope="scope">
                            <span>{{ scope.row.goodPrice }}元/{{ scope.row.buyNum }}</span> 
                        </template>
                </el-table-column>
                <el-table-column
                        prop="goodSpec"
                        label="规格">
                </el-table-column>
                <el-table-column
                        label="订单状态">
                        <template scope="scope">
                            <span>{{ findState(goodForm.refundState,orderState) }}</span>
                        </template>
                </el-table-column>
         </el-table>
         <el-form :model="goodForm"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;width: 600px" label-position="right" label-width="125px">
         <h3>支付信息</h3>
                <el-form-item label="订单编号："  style="width: 300px;">
                    <span>{{goodForm.orderId}}</span>   
                </el-form-item>  
                <el-form-item label="退款编号："  style="width: 300px;">
                    <span>{{ goodForm.refundId }}</span>   
                </el-form-item>
                 <el-form-item label="退款类型：" >
                    <span>{{ goodForm.isRefundGood==1? '仅退款':'退货退款'}}</span> 
                </el-form-item>
                <el-form-item label="退款金额(元)：" >
                    <span >{{goodForm.refundAmt}}元</span>   
                </el-form-item>
                 <el-form-item label="退款说明：" >
                    <span>{{goodForm.refundRemark}}</span>   
                </el-form-item>
                <el-form-item label="附加图片：">
                        <div style="width:700px">
                            <!-- <div style="float: left;margin-right:20px;clear: both;" v-for="item in mallNewRefundPojos2.iconUrl">
                               <img :src="URL+item" width="120px;" >
                            </div> -->
                             <img :src="item" alt="" v-for="item in goodForm.storeImgDtos" class="img-preview" @click="previewImage(item)" style="margin-right: 10px;">
                             <span v-if="goodForm.storeImgDtos==''">无</span>
                        </div>      
                </el-form-item>
                <el-form-item label="退款申请时间：" >
                    <span>{{goodForm.refundApplyTime}}</span>
                </el-form-item>
                <el-form-item label="退款通过时间：" v-if="goodForm.refundAdoptTime">
                    <span>{{goodForm.refundAdoptTime}}</span>
                </el-form-item>
                <el-form-item label="拒绝原因：" v-if="goodForm.refundRefuseRemark">
                    <span>{{goodForm.refundRefuseRemark}}</span>
                </el-form-item>
                <el-form-item label="商家：" >
                    <span>{{goodForm.storeName}}</span>
                </el-form-item>
                
        </el-form>
        <el-form :model="form"  style="background-color: #FFFFFF;padding: 10px 0;margin-left: 50px;display:inline-block;vertical-align: top" label-position="right" label-width="125px">
         <h3>买家信息</h3>
                <el-form-item label="买家：" >
                    <span>{{form.orderId}}</span>
                </el-form-item>
                <el-form-item label="收货人：" >
                    <span>{{form.orderTakeName}}</span>
                </el-form-item>
                <el-form-item label="联系方式："  >
                    <span>{{form.orderTakePhone}}</span>   
                </el-form-item>
                <el-form-item label="收货地址："  >
                    <span>{{form.orderTakeAddress}}</span>   
                </el-form-item>      
                <el-form-item label="买家留言：">
                    <span >{{form.remark}}</span>   
                </el-form-item>
                 <el-form-item label="下单时间：">
                    <span >{{form.creTime}}</span>   
                </el-form-item>
                 <el-form-item label="付款时间：">
                    <span >{{form.orderPayTime}}</span>   
                </el-form-item>
        </el-form>

        </div>

        <!--查看图片-->
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
.ogistics{
    margin-left: 45px;
    margin-bottom: 30px;
}
</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                loading:false,
                table_loading: false,
                pageInfo: {
                    currentPage: 1,
                    pageSize: 1,
                    total: 1
                },
                tableData: [],
                formLabelWidth: '120px',
                form:{
                    mobile:'',
                    name:'',
                    address:'',
                    sales:'',
                    amount:'',
                    gold:''
                },
                goodForm:{

                },
                URL:URL,
                orderState:[{text:'仅退款审核中',value:'0'},{text:'仅退款已通过',value:'1'},{text:'仅退款已拒绝',value:'2'},{text:'仅退款撤销',value:'3'},{text:'申请退款退货审核中',value:'4'},{text:'已通过退货退款',value:'5'},{text:'已拒绝退货退款',value:'6'},{text:'已撤销退货退款',value:'7'},{text:'待确认货',value:'8'},{text:'已收到退货',value:'9'}],
                id:[],
                mallNewRefundPojos:[],
                mallNewRefundPojos2:{},
                exampleId:'',
                mallShellPojo:{},
                mallOrderPojo:{},
                 img: {
                    is_preview: false,
                    preview_url: '',
                    image_index: null,
                    preview_images: [],
                    transform:''
                },
                detail:{
                   post_img:[],
                   remark:''
                 },


            }
        },
        created(){
             this.fetchData ()
        },
        methods: {

             fetchData () {

                this.dataApi.ajax('selectOrderRefund',{refundId:this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                         this.tableData=res.shopOrderRefundDto.orderRefundDetailDtos
                         this.goodForm=res.shopOrderRefundDto
                         this.form=res.shopOrderDto
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            back(){
                history.back(-1)
            },
            affirm(){
               this.$confirm('确定收到退货?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.loading=true
                    this.dataApi.ajax('MallOrderControl/editRefund',{refundsState:9,refundsId:JSON.stringify(this.id)}, res => {
                    this.table_loading = false;
                    if (res.responseType === 0) {
                        this.$message({
                            type: 'success',
                            message: '确认收到退货成功!'
                          });
                        this.loading=false
                        this.fetchData()
                    }
                   });
                  
                }).catch(() => {
                           
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
