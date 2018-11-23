<template>
    <div style="margin-top: 30px;width: 1200px;">

        <div>
            <el-row>
                <el-col :span="24">

                    <el-button
                            type="primary"
                            @click="goBack()">返回
                    </el-button>
                    <span style="font-size: 15px;margin-left: 10px;">以往认证消息</span>
                </el-col>
            </el-row>
            <div v-for="item in pageInfo.dtos" style="display: inline-block;width:90%;margin-top:20px;">
            <el-form :model="form"
                     style="display:inline-block;vertical-align: top;margin-right: 80px;max-width:400px"
                     label-width="150px">
                 <el-form-item label="申请时间：">
                     <span>{{ form.applyTime }}</span>
                </el-form-item>
                <el-form-item label="易宝处理时间：">
                     <span>{{ form.finishTime }}</span>
                </el-form-item>
                <el-form-item label="平台处理时间：">
                     <span>{{ form.finishTime }}</span>
                </el-form-item>
                <el-form-item label="商家名称：">
                     <span>{{ form.storeName }}</span>
                </el-form-item>
                 <el-form-item label="门店电话：">
                    <span>{{ form.storePhone }}</span>
                </el-form-item>
                <el-form-item label="门店地址：">
                     <span>{{ form.storeAddress }}</span>
                </el-form-item>
                <el-form-item label="商家营业时间：" label-width="150px">          
                      <span>{{ form.businessTime }}</span>
                </el-form-item>
                <el-form-item label="商家类型：">
                     <span>{{findSort(form.storeType)}}</span>
                </el-form-item>
                <el-form-item label="商品分类：">
                    <span>{{ form.businessClass }}-{{ form.businessSubclass }}</span>
                </el-form-item>
                <el-form-item label="商家简介：">
                     <span>{{ form.introduction }}</span>
                </el-form-item>
                <el-form-item label="申请状态：">
                     <span>{{ findState(form.applyStat) }}</span>
                </el-form-item>
                <el-form-item label="易宝拒绝理由：" >
                     <span>{{ form.refuseReason }}</span>
                </el-form-item>
                <el-form-item label="平台拒绝理由：" >
                     <span>{{ form.refuseReason }}</span>
                </el-form-item>
                 
            </el-form>
            <el-form label-width="120px" class="demo-ruleForm" style="display:inline-block;max-width:500px" :model="form" >
                <el-form-item label="认证图片：" label-width="100px">
                    <div style="display:inline-block">
                       <div>
                           <img :src="form.businessLicense" alt=""  class="img-preview" @click="previewImage(form.businessLicense)" style="margin-right: 10px;" > 
                       </div> 
                      （营业执照） 
                    </div>
                   <div style="display:inline-block;text-align: center">
                        <div>
                           <img :src="form.idcardFront" alt=""  class="img-preview" @click="previewImage(form.idcardFront)" style="margin-right: 10px;" > 
                       </div> 
                      （身份证正面） 
                    </div>
                    <div style="display:inline-block;text-align: center">
                       <div>
                           <img :src="form.idcardBack" alt=""  class="img-preview" @click="previewImage(form.idcardBack)" style="margin-right: 10px;" > 
                       </div> 
                      （身份证反面） 
                    </div>
                    
                </el-form-item>
                <el-form-item label="商家封面图：" label-width="100px">
                    <div>
                           <img :src="form.storeImg" alt=""  class="img-preview" @click="previewImage(form.storeImg)" style="margin-right: 10px;" > 
                       </div> 
                </el-form-item>
                <el-form-item label="商家简介图：" label-width="100px">
                    <div >
                        <img :src="item" alt="" v-for="item in form.imgStrs" class="img-preview" @click="previewImage(item)" style="margin-right: 10px;" > 
                    </div>
                     
                </el-form-item>

            </el-form>
            </div>
            <div class="paginate">
              <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page="pageInfo.pageNum"
                      :page-size="pageInfo.pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="pageInfo.count">
              </el-pagination>
            </div>
        </div>
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

</style>

<script>
    export default {
        data() {
            return {
                loading: false,
                form: {
                    storeId:'',
                    storeName:'',
                    storePhone:'',
                    storeAddress:'',
                    businessTime:'',
                    businessClass:'',
                    businessSubclass:'',
                    introduction:'',
                    businessLicense: [],
                    idcardFront: [],
                    idcardBack: [],
                    storeImg: [],
                    imgStrs:[]

                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos: []
                },
                sortList: [],
                secondList: [],
                show: true,
                flag:false,
                flag2:false,
                URL:URL,
                stateList:[{ text: '审核中', value: '0' },{ text: '审核拒绝', value: '1' },{ text: '审核通过', value: '2' }],
                typeList:[{text:'物流商超',value:'1'},{text:'服务行业',value:'2'},{text:'酒店',value:'3'}],
                detail:{
                   post_img:[],
                   post_id:'',
                   deleted_at:''
                 },
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
            // this.fetchData(1)
        },
        methods: {
            fetchData(page=1){
                this.pageInfo.pageNum=page
                this.dataApi.ajax('selectStoreApplyActivationBefore', {userId: this.$route.params.id,pageNum:this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize,sort:'CRT_TIME',desc:'DESC'}, res => {
                    if (res.responseType === 'S') {
                         this.pageInfo=res
                         this.form=res.dtos[0]
                         this.form.imgStrs=[]
                         for (var k in this.form.storeImgList) {
                         
                            this.form.imgStrs.push(this.form.storeImgList[k].imgUrl)
                         }
                    }
                });
            },
            uploading(f) {
                 this.loading=true
                 this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                        //console.log(res)
                        if (res.responseType == 'S') {
                            f.images.splice(f.index,1,res.filePath)
                            this.loading=false
                        }
                 });
                
            },
            findState(type){
                    for (var i = this.stateList.length - 1; i >= 0; i--) {
                        if (type==this.stateList[i].value) {
                            return this.stateList[i].text
                        }
                    }
            },
            handleCurrentChange(val) {
                this.fetchData(val)
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
            findSort(type){
                    for (var i = this.typeList.length - 1; i >= 0; i--) {
                        if (type==this.typeList[i].value) {

                            return this.typeList[i].text
                        }
                    }
            }
        }
    }
</script>
