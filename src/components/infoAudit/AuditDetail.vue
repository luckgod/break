<template>
    <div style="margin-top: 30px;width: 1360px">

        <div>
            <el-row>
                <el-col :span="24">

                    <el-button
                            type="primary"
                            @click="goBack()">返回
                    </el-button>
                    <span style="font-size: 15px;margin-left: 10px;">商家入驻审核</span>
                </el-col>
            </el-row>
            <br>
            <br>
            <el-form :model="form"
                     style="display:inline-block;vertical-align: top;margin-right: 80px"
                     label-width="150px">
                <el-form-item label="商家名称：">
                     <!-- <el-input style="width: 300px;" v-model="form.storeName" :maxlength="50"></el-input> -->
                     <span>{{ form.storeName }}</span>
                </el-form-item>
                <el-form-item label="店主/经办人姓名：">
                     <span>{{ form.contact }}</span>
                </el-form-item>
                 <el-form-item label="店主/经办人身份证：">
                     <span>{{ form.idCard }}</span>
                </el-form-item>
                <el-form-item label="联系方式：">
                     <span>{{ form.contactNum }}</span>
                </el-form-item>
                <el-form-item label="门店电话：">
                    <!-- <el-input style="width: 300px;" v-model="form.storePhone" :maxlength="50"></el-input> -->
                    <span>{{ form.storePhone }}</span>
                </el-form-item>
                <el-form-item label="门店地址：">
                    <!-- <el-input style="width: 300px;" v-model="form.storeAddress"  type="textarea" :rows="3" :disabled="true"></el-input>
                    <el-button type="primary" @click="selectAddress()" v-if="form.actStat==3">重新选取地址</el-button> -->
                    <span>{{ form.storeAddress }}</span>
                </el-form-item>
                <el-form-item label="商家营业时间：" label-width="150px" style="margin-top: 25px;">          
                           <!-- <el-time-select
                            placeholder="起始时间"
                            v-model="startTime"
                            :picker-options="{
                              start: '00:00',
                              step: '00:15',
                              end: '23:45'
                            }">
                          </el-time-select>
                          <el-time-select
                            placeholder="结束时间"
                            v-model="endTime"
                            :picker-options="{
                              start: '00:00',
                              step: '00:15',
                              end: '23:45'
                            }">
                          </el-time-select> -->
                        <span>{{ form.businessTime }}</span>
                </el-form-item>
                <el-form-item label="商家类型：">
                     <span>{{ form.storeTypeName }}</span>
                </el-form-item>
                <el-form-item label="商家分类：">
                    <!--  <el-select v-model="form.businessClass" style="width: 200px;"  @change="selectSort2()"
                           placeholder="一级分类">
                        <el-option :label="item.classifyName" :value="item.classifyId"
                                   v-for="item in sortList"></el-option>
                    </el-select>
                    <el-select v-model="form.businessSubclass" style="width: 200px;" placeholder="二级分类" >
                        <el-option :label="item.classifyName" :value="item.classifyId"
                                   v-for="item in secondList"></el-option>
                    </el-select> -->
                    <span>{{ form.classifyName }} - {{ form.subClassifyName }}</span>
                </el-form-item>
                
                <el-form-item label="商家简介：">
                     <el-input style="width: 300px;" v-model="form.introduction"  type="textarea" :rows="5" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="审核时间：" v-if="form.finishTime">
                     <span>{{ form.finishTime }}</span>
                </el-form-item>
                <el-form-item label="审核状态：">
                     <span>{{ findState(form.applyStat,stateList)}}</span>
                </el-form-item>
                 <el-form-item label="平台拒绝理由：">
                     <el-input style="width: 300px;" v-model="refuseReason" ></el-input>
                </el-form-item>
                <el-form-item label=""  >
                   <el-button type="danger" :loading="loading" @click="audit('拒绝')" v-if="form.applyStat==0">拒绝</el-button> 
                   <el-button type="success" :loading="loading" @click="audit('通过')"  v-if="form.applyStat==0">通过</el-button> 
                    <el-button type="success" :loading="loading" @click="$router.push('/merchant/renactivated/'+$route.params.id)" v-if="form.applyStat==7">重新提交审核</el-button> 
                </el-form-item>
                 
            </el-form>
            <el-form  label-width="100px" class="demo-ruleForm" style="display:inline-block;max-width:600px" :model="form" >
                <el-form-item label="认证图片：">
                    <div style="display:inline-block;text-align: center">
                       <div>
                           <img :src="qualificateImgMap.PERSON_PHOTO" alt=""  class="img-preview" @click="previewIdCard(qualificateImgMap.PERSON_PHOTO,0)" style="margin-right: 10px;" > 
                        </div> 
                        （手持身份证正面）
                    </div>      
                    <div style="display:inline-block;text-align: center">
                        <div>
                           <img :src="qualificateImgMap.ID_CARD_FRONT" alt=""  class="img-preview" @click="previewIdCard(qualificateImgMap.ID_CARD_FRONT,1)" style="margin-right: 10px;" > 
                        </div> 
                      （身份证正面） 
                    </div>
                    <div style="display:inline-block;text-align: center">
                        <div>
                           <img :src="qualificateImgMap.ID_CARD_BACK" alt=""  class="img-preview" @click="previewIdCard(qualificateImgMap.ID_CARD_BACK,2)" style="margin-right: 10px;" > 
                        </div> 
                      （身份证反面） 
                    </div>
                    <br>
                    <div style="width: 115px;text-align: center">
                        <div style="margin-left: 10px;">
                           <img :src="qualificateImgMap.businessLicense" alt=""  class="img-preview" @click="previewIdCard(qualificateImgMap.businessLicense,3)" style="margin-right: 10px;" > 
                        </div> 
                        （营业执照） 
                    </div>
                     
                </el-form-item>
                <el-form-item label="商家封面图：">
                  <!-- <div style="display: inline-block;text-align: center">
                       <we-ui-uploads :images="form.storeImg"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                                   （必传） 
                 </div> -->
                 <div style="margin-left: 10px;">
                   <img :src="form.storeImg" alt=""  class="img-preview" @click="previewImage(form.storeImg)" style="margin-right: 10px;" > 
                </div>           
                </el-form-item>
                <el-form-item label="商家简介图：">
                    <!-- <we-ui-uploads :images="form.storeImgList"
                                   :maxCount="9"
                                   :maxSize="1024*1024"
                                   :isSort="true"
                                   @uploading="uploading2"></we-ui-uploads>
                    （最多上传9张） -->
                    <div style="margin-left: 10px;">
                        <img :src="item" alt=""  class="img-preview" @click="previewImage(item)" style="margin-right: 10px;" v-for="item in form.storegList"> 
                    </div>
                    
                </el-form-item>
            </el-form>

        </div>



        <div class="weui-gallery" style="display: block;z-index: 9999;" v-show="img.is_preview" >
            <span class="weui-gallery__img" :style="{backgroundImage:img.preview_url,transform:img.transform}" @click="hidePreview"></span>
            <div class="pre_img" v-if="img.preview_images.length>1" @click="preImg()">
                 <img src="../../assets/images/left.png" height="50" width="50">
             </div>
             <div class="next_img" v-if="img.preview_images.length>1" @click="nextImg()">
                 <img src="../../assets/images/right.png" height="50" width="50">
             </div>
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
                    businessLicense:'',
                    idcardFront: [],
                    idcardBack: [],
                    storeImgList:[],
                    storeImg:[],
                    storeType:'1',
                    actStat:0

                },
                sortList: [],
                secondList: [],
                startTime:'',
                typeList:[{text:'物流商超',value:'1'},{text:'服务行业',value:'2'},{text:'酒店',value:'3'}],
                stateList:[{text:'审核中',value:'0'},{text:'通过',value:'6'},{text:'拒绝',value:'7'}],
                endTime:'',
                userName:'',
                dialogVisible:false,
                id:'',
                show:'',
                storeImgList:[],
                contactNum:'',
                contact:'',
                cantclick:false,
                msgCode:'',
                img: {
                    is_preview: false,
                    preview_url: '',
                    image_index: null,
                    preview_images: [],
                    transform:''
                },
                yibaoInfo:{

                },
                qualificateImgMap:{

                },
                refuseReason:''
            }
        },
        created(){
            this.fetchData()
        },
        activated(){
            //  if (sessionStorage.getItem('address')!=null) {
            //     let info=JSON.parse(sessionStorage.getItem('address'))
            //     this.form.storeAddress=decodeURI(info.storeAddress)
            //     this.form.areaNum=info.areaNum
            //     this.form.storeAccu=info.storeDime
            //     this.form.storeDime=info.storeAccu
            //     sessionStorage.removeItem('address')
            // }else if (sessionStorage.getItem('keep')==1) {
            //    sessionStorage.removeItem('keep')
            // }else{
            //     this.loading=false
            //     this.fetchData()
            // }
           
            
        },
        methods: {
            fetchData(){
                this.dataApi.ajax('getStoreApplyActivation', {applyId: this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                         this.form=res
                         this.form.storeImg=[this.form.storeImg]
                         if (this.form.businessTime!='') {
                            this.startTime=this.form.businessTime.split('-')[0]
                            this.endTime=this.form.businessTime.split('-')[1] 
                         }
                         this.qualificateImgMap={
                              PERSON_PHOTO:res.personPhoto,
                              ID_CARD_FRONT:res.idcardFront,
                              ID_CARD_BACK:res.idcardBack,
                              businessLicense:res.businessLicense
                         }
                         this.refuseReason=res.refuseReason
                         this.show=true


                    }
                });
            },
            submitForm(){
                if (!this.form.storeName) {
                   this.showMsg('请输入商家名称','warning')
                   return;
                } 
                // if (!this.form.storePhone) {
                //    this.showMsg('请输入门店电话','warning')
                //    return;
                // }
                 if (!this.form.storeAddress) {
                   this.showMsg('请选取门店地址','warning')
                   return;
                }
                 if (!this.startTime|| !this.endTime) {
                   this.showMsg('请输入营业时间','warning')
                   return;
                 }
                if (!this.form.businessClass|| !this.form.businessSubclass) {
                   this.showMsg('请选择分类','warning')
                   return;
                 }
                 // if (!this.form.introduction) {
                 //   this.showMsg('商家简介','warning')
                 //   return;
                 // }
                if (this.form.businessLicense.length==0) {
                    this.showMsg('请输入请上传营业执照','warning')
                    return false;
                }
                 if (this.form.storeImg.length==0) {
                    this.showMsg('请上传商家封面图片','warning')
                    return false;
                }
                let data = generateObj(this.form)
                data.businessLicense=data.businessLicense.toString()
                data.storeImg=data.storeImg.toString()
                var storeImgList=[]
                for (var i = data.storeImgList.length - 1; i >= 0; i--) {  
                    for (var j = this.storeImgList.length - 1; j >= 0; j--) { 
                        if (this.storeImgList[j].imgUrl==data.storeImgList[i]) {
                             storeImgList.push(this.storeImgList[j])
                             break;
                        }
                    }     
                }
                data.storeImgList=storeImgList.reverse()
                data.businessTime=this.startTime+'-'+this.endTime 
                this.loading=true
                 this.dataApi.ajax('editStoreInfo', data, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('保存成功')
                        this.loading=false
                        this.$router.push('/merchant/merchant_list')
                    }
                  });
                
            },
            selectSort(){
                this.dataApi.ajax('selectStoreClassify', {parentId:0}, res => {
                    if (res.responseType === 'S') {
                       this.sortList = res.dtos
                    }
                });

            },
            selectSort2(){
                if (this.show) {
                    this.form.businessSubclass= this.form.businessSubclass
                    this.show=false
                }else{
                    this.form.businessSubclass ='' 
                }
                this.dataApi.ajax('selectStoreClassify', {parentId: this.form.businessClass}, res => {
                    //console.log(res)
                    if (res.responseType === 'S') {
                        this.secondList = res.dtos
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
            selectAddress(){
                this.$router.push('/merchant/map')
                sessionStorage.setItem('keep','1')
            },
            activate(){
                this.dialogVisible=true
            },
            find(){
               this.dataApi.ajax('singleUser', {userId: this.id}, res => {
                    if (res.responseType === 'S') {
                         this.userName=res.userName
                    }
                });
            },
             findSort(type){
                    for (var i = this.typeList.length - 1; i >= 0; i--) {
                        if (type==this.typeList[i].value) {

                            return this.typeList[i].text
                        }
                    }
            },
            previewImage(src) {
                this.img.is_preview = true;
                this.img.preview_url = `url(${src})`;
                this.img.preview_images = [src];
                this.img.transform = '';
            },
            previewIdCard(src,index){
                var arr=[]
                for (var key in this.qualificateImgMap) {
                   arr[0]=this.qualificateImgMap['PERSON_PHOTO']
                   arr[1]=this.qualificateImgMap['ID_CARD_FRONT']
                   arr[2]=this.qualificateImgMap['ID_CARD_BACK']
                   arr[3]=this.qualificateImgMap['businessLicense']
                }
                this.img.is_preview = true;
                this.img.preview_url = `url(${src})`;
                this.img.preview_images = arr;
                this.img.transform = '';
                this.img.image_index=index

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
            nextImg(){
                this.img.transform='';
                if (this.img.image_index+1==this.img.preview_images.length) {
                    this.img.preview_url = `url(${this.img.preview_images[0]})`;
                    this.img.image_index = 0;
                }else{
                    this.img.preview_url = `url(${this.img.preview_images[this.img.image_index+1]})`;
                    this.img.image_index = this.img.image_index+1;

                }
            },
            preImg(){
                this.img.transform='';
                if (this.img.image_index==0) {
                    this.img.preview_url = `url(${this.img.preview_images[this.img.preview_images.length-1]})`;
                    this.img.image_index = this.img.preview_images.length-1;
                }else{
                    this.img.preview_url = `url(${this.img.preview_images[this.img.image_index-1]})`;
                    this.img.image_index = this.img.image_index-1;

                }
            },
            audit(type){
               var state=''
                if (type=='通过') {
                  state=6
                }else{
                  if (this.refuseReason=='') {
                    this.showMsg('请填写拒绝理由','warning');
                    return
                  }
                  state=7
                }
                 this.$confirm('确定'+type+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {

                     var data={
                       applyId:this.$route.params.id,
                       applyStat:state,
                       refuseReason:this.refuseReason
                     }
                      this.dataApi.ajax('businessAudit',data, res => {
                            if (res.responseType === 'S') {
                                 this.showMsg(type+'成功');
                                 this.goBack()
                            }
                        });
                  }).catch(() => {
          
                  });
            },
            refuse(){
                 if (this.refuseReason=='') {
                    this.showMsg('请填写拒绝理由','warning');
                    return
                  }
                 this.$confirm('确定拒绝?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {

                     var data={
                       applyId:this.$route.params.id,
                       applyStat:'7',
                       refuseReason:this.refuseReason
                     }
                      this.dataApi.ajax('platformPreliminaryTrialEnd',data, res => {
                            if (res.responseType === 'S') {
                                 this.showMsg('拒绝成功');
                                 this.goBack()
                            }
                        });
                  }).catch(() => {
          
                  });
            }
        }
    }
</script>
