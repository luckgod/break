<template>
    <div style="margin-top: 30px;width: 1200px">

        <div>
            <el-row>
                <el-col :span="24">

                    <el-button
                            type="primary"
                            @click="$router.push('/merchant/merchant_list')">返回
                    </el-button>
                    <span style="font-size: 15px;margin-left: 10px;">新增/编辑商家</span>
                </el-col>
            </el-row>
            <br>
            <br>
            <el-form :model="form"
                     style="display:inline-block;vertical-align: top;margin-right: 80px"
                     label-width="150px">
               <el-form-item label="商家名称：">
                    <el-input style="width: 300px;" v-model="form.storeName" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="门店电话：">
                    <el-input style="width: 300px;" v-model="form.storePhone" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="门店地址：">
                    <el-input style="width: 300px;" v-model="form.storeAddress"  type="textarea" :rows="3" :disabled="true"></el-input>
                    <el-button type="primary" @click="selectAddress()" >重新选取地址</el-button>
                </el-form-item>

                 <el-form-item label="商家分类：">
                     <el-select v-model="form.businessClass" style="width: 200px;"  @change="selectSort2()"
                               placeholder="一级分类">
                        <el-option :label="item.classifyName" :value="item.classifyId"
                                   v-for="item in sortList"></el-option>
                    </el-select>
                    <el-select v-model="form.businessSubclass" style="width: 200px;" placeholder="二级分类" >
                        <el-option :label="item.classifyName" :value="item.classifyId"
                                   v-for="item in secondList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户封面图：">
                  <div style="display: inline-block;text-align: center">
                       <we-ui-uploads :images="form.storeImg"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                 </div>             
                </el-form-item>
                <el-form-item label="">
                   <el-button type="primary" :loading="loading" @click="submitForm()">保存</el-button> 
                   <el-button type="success" :loading="loading" @click="activate()" v-if="form.actStat==0&$route.params.id!='add'">前去激活</el-button> 
                   <div class="must" style="font-size:15px;margin-top: 20px;">提示：激活前请确认该用户已经进行实名认证</div>
                </el-form-item>
                 
            </el-form>

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
                    storeAddress:'',
                    businessClass:'',
                    businessSubclass:'',
                    storeImg:[],
                    actStat:0,
                    storePhone:''

                },
                sortList: [],
                secondList: [],
                userName:'',
                dialogVisible:false,
                id:'',
                show:'',
                storeImgList:[],
                contactNum:'',
                contact:'',
                cantclick:false,
                msgCode:''
            }
        },
        created(){
          
           this.selectSort()
            
        },
        activated(){
             if (sessionStorage.getItem('address')!=null) {
                let info=JSON.parse(sessionStorage.getItem('address'))
                this.form.storeAddress=decodeURI(info.storeAddress)
                this.form.areaNum=info.areaNum
                this.form.storeAccu=info.storeDime
                this.form.storeDime=info.storeAccu
                sessionStorage.removeItem('address')
            }else if (sessionStorage.getItem('keep')==1) {
               sessionStorage.removeItem('keep')
            }else{
                this.loading=false
                this.fetchData()
            }
           
            
        },
        methods: {
            fetchData(){
                if (this.$route.params.id=='add') {
                    this.form={
                        storeId:'',
                        storeName:'',
                        storeAddress:'',
                        businessClass:'',
                        businessSubclass:'',
                        storeImg:[],
                        actStat:0
                   }
                    return;
                }
                this.dataApi.ajax('singleStoreInfoAndLedgerUser', {storeId: this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                         this.form=res.storeInfoDto
                         this.form.storeImg=[this.form.storeImg]
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
                 // if (!this.startTime|| !this.endTime) {
                 //   this.showMsg('请输入营业时间','warning')
                 //   return;
                 // }
                if (!this.form.businessClass|| !this.form.businessSubclass) {
                   this.showMsg('请选择分类','warning')
                   return;
                 }
                 // if (!this.form.introduction) {
                 //   this.showMsg('商家简介','warning')
                 //   return;
                 // }
                // if (this.form.businessLicense.length==0) {
                //     this.showMsg('请输入请上传营业执照','warning')
                //     return false;
                // }
                // if (this.form.idcardFront.length==0) {
                //     this.showMsg('请上传身份证正面照','warning')
                //     return false;
                // }
                // if (this.form.idcardBack.length==0) {
                //      this.showMsg('请上传身份证反面照','warning')
                //     return false;
                // }
                 if (this.form.storeImg.length==0) {
                    this.showMsg('请上传商家封面图片','warning')
                    return false;
                }
                let data = generateObj(this.form)
                data.storeImg=data.storeImg.toString()
                this.loading=true
                if (this.$route.params.id=='add') {
                    this.dataApi.ajax('addStoreInfo', data, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('新增成功')
                        this.loading=false
                        this.$router.push('/merchant/merchant_list')
                    }
                  });
                }else{
                    this.dataApi.ajax('editStoreInfo', data, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('编辑成功')
                        this.loading=false
                        this.$router.push('/merchant/merchant_list')
                    }
                  }); 
                }
                
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
                sessionStorage.setItem('merchant_basic',JSON.stringify(this.form))
                this.$router.push('/merchant/earnest_info/'+this.$route.params.id)
            }
        }
    }
</script>
