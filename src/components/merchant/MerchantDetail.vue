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
               <div style="display: inline-block;width: 147px;text-align: right;color: #48576a;padding: 11px 9px 25px 0;font-weight: 600;">
                 <span class="must">*</span>
                 <span>商家名称：</span>
               </div>
                <el-input style="width: 300px;" v-model="form.storeName" :maxlength="50"></el-input>
                <el-form-item label="门店电话：">
                    <el-input style="width: 300px;" v-model="form.storePhone" :maxlength="50"></el-input>
                </el-form-item>
                <div style="display: inline-block;width: 147px;text-align: right;color: #48576a;padding: 11px 9px 25px 0;font-weight: 600;vertical-align: top;">
                 <span class="must">*</span>
                 <span>门店地址：</span>
                </div>
                <el-input style="width: 300px;" v-model="form.storeAddress"  type="textarea" :rows="3" :disabled="true"></el-input>
                <el-button type="primary" @click="selectAddress()" >重新选取地址</el-button>

                <el-form-item label="商家营业时间：" label-width="150px" style="margin-top: 25px;">          
                           <el-time-select
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
                          </el-time-select>
                </el-form-item>
                 <el-form-item label="当面付让利比例：" v-if="form.actStat==3">
                     <span>{{form.storeRebate *100}}%</span>
                </el-form-item>
                <el-form-item label="商家类型：">
                     <el-select v-model="form.storeType" style="width: 200px;" :disabled="form.actStat!=0">
                          <el-option :label="item.text" :value="item.value"
                                     v-for="item in typeList"></el-option>
                     </el-select>
                </el-form-item>
                <div style="display: inline-block;width: 147px;text-align: right;color: #48576a;padding: 11px 9px 35px 0;font-weight: 600;">
                     <span class="must">*</span>
                     <span>商家分类：</span>
                </div>
                <el-select v-model="form.businessClass" style="width: 200px;"  @change="selectSort2()"
                           placeholder="一级分类">
                    <el-option :label="item.classifyName" :value="item.classifyId"
                               v-for="item in sortList"></el-option>
                </el-select>
                <el-select v-model="form.businessSubclass" style="width: 200px;" placeholder="二级分类" >
                    <el-option :label="item.classifyName" :value="item.classifyId"
                               v-for="item in secondList"></el-option>
                </el-select>
                <el-form-item label="商家简介：">
                     <el-input style="width: 300px;" v-model="form.introduction"  type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="">
                   <el-button type="primary" :loading="loading" @click="submitForm()">保存</el-button> 
                   <el-button type="success" :loading="loading" @click="activate()" v-if="form.actStat==0">激活</el-button> 
                </el-form-item>
                 
            </el-form>
            <el-form label-width="120px" class="demo-ruleForm" style="display:inline-block;;max-width:500px" :model="form" >
                <el-form-item label="认证图片：" label-width="100px">
                    <div style="display:inline-block;text-align: center">
                        <we-ui-uploads :images="form.businessLicense"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>
                      （营业执照） 
                    </div>
                   <div style="display:inline-block;text-align: center">
                        <we-ui-uploads :images="form.idcardFront"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>
                      （身份证正面） 
                    </div>
                    <div style="display:inline-block;text-align: center">
                        <we-ui-uploads :images="form.idcardBack"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>
                      （身份证反面） 
                    </div>
                    
                </el-form-item>

                <el-form-item label="商家封面图：" label-width="100px">
                  <div style="display: inline-block;text-align: center">
                       <we-ui-uploads :images="form.storeImg"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                                   （必传） 
                 </div>             
                </el-form-item>
                <el-form-item label="商家简介图：" label-width="100px">
                    <we-ui-uploads :images="form.storeImgList"
                                   :maxCount="9"
                                   :maxSize="1024*1024"
                                   :isSort="true"
                                   @uploading="uploading2"></we-ui-uploads>
                    （最多上传9张）
                </el-form-item>
            </el-form>

        </div>
        
          <el-dialog title="激活" v-model="dialogVisible" size="tiny" style="min-width: 400px">
              <el-form label-width="110px">
                  <el-form-item label="联系人：">
                        <el-input style="width:150px;" v-model="contact"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话：">
                        <el-input style="width:150px;" v-model="contactNum" :maxlength="11"></el-input>
                        <br>
                        <span style="color: red;font-size:15px;">联系方式为商家后台账号,请谨慎填写</span>
                  </el-form-item>
                  <el-form-item label="验证码:">
                        <el-input v-model="msgCode" :maxlength="6"  style="width: 130px;"></el-input> 
                        <el-button  id="code" @click="getcode()" :disabled="cantclick == true" size="small" style="display: inline-block;height:36px;">验证码</el-button> 
                    </el-form-item>           
                  <el-form-item label="绑定用户ID：">
                        <el-input style="width:150px;" v-model="id"></el-input>
                        <el-button type="primary" @click="find()" style="margin-left: 20px;" :disabled="!id">查询</el-button>
                  </el-form-item>             
                  <el-form-item label="用户名：" >
                        <span>{{userName}}</span>
                  </el-form-item>
            </el-form>
            <div style="text-align: center"><span style="color: red;font-size:15px;margin-left: 5px;">*绑定激活后无法修改，请核对无误后再操作</span></div>
            
             <br>
             <div style="text-align: center">
                 <el-button type="primary" @click="submit" :disabled="!userName|| !contact || !contactNum || !msgCode" :loading="loading">保 存
                 </el-button>
             </div>
             
        </el-dialog>   


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
                    storeImgList:[],
                    storeImg:[],
                    storeType:'1',
                    actStat:0

                },
                sortList: [],
                secondList: [],
                startTime:'',
                typeList:[{text:'物流商超',value:'1'},{text:'服务行业',value:'2'},{text:'酒店',value:'3'}],
                endTime:'',
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
                    storeImgList:[],
                    actStat:0,
                    storeType:'1',
                   }
                    return;
                }
                this.dataApi.ajax('singleStoreInfo', {storeId: this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                         this.form=res
                         this.form.businessLicense ? this.form.businessLicense=[this.form.businessLicense]:this.form.businessLicense=[]
                         this.form.idcardFront ? this.form.idcardFront=[this.form.idcardFront]:this.form.idcardFront=[]
                         this.form.idcardBack ? this.form.idcardBack=[this.form.idcardBack]:this.form.idcardBack=[]
                         this.form.storeImg=[this.form.storeImg]
                         this.storeImgList=generateArr(res.storeImgList)
                         for (var i = this.form.storeImgList.length - 1; i >= 0; i--) {
                            this.form.storeImgList[i]=[this.form.storeImgList[i].imgUrl]
                         }
                         this.startTime=this.form.businessTime.split('-')[0]
                         this.endTime=this.form.businessTime.split('-')[1]
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
                data.businessLicense=data.businessLicense.toString()
                data.idcardFront=data.idcardFront.toString()
                data.idcardBack=data.idcardBack.toString()
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
             uploading2(f) {
                 this.loading=true
                 this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                        //console.log(res)
                        if (res.responseType == 'S') {
                            f.images.splice(f.index,1,res.filePath)
                            this.storeImgList.push(
                            {
                                imgHeight:res.height,
                                imgUrl:res.filePath,
                                imgWidth:res.width
                            })
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
            submit(){
                 if (!this.form.storeName) {
                   this.showMsg('请输入商家名称','warning')
                   return;
                } 
                if (!this.form.storePhone) {
                   this.showMsg('请输入门店电话','warning')
                   return;
                }
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
                 if (!this.form.introduction) {
                   this.showMsg('商家简介','warning')
                   return;
                 }
                if (this.form.businessLicense.length==0) {
                    this.showMsg('请输入请上传营业执照','warning')
                    return false;
                }
                if (this.form.idcardFront.length==0) {
                    this.showMsg('请上传身份证正面照','warning')
                    return false;
                }
                if (this.form.idcardBack.length==0) {
                     this.showMsg('请上传身份证反面照','warning')
                    return false;
                }
                 if (this.form.storeImg.length==0) {
                    this.showMsg('请上传商家封面图片','warning')
                    return false;
                }
                let data = generateObj(this.form)
                data.userId=this.id
                data.contact=this.contact
                data.contactNum=this.contactNum
                data.msgCode=this.msgCode
                data.businessLicense=data.businessLicense.toString()
                data.idcardFront=data.idcardFront.toString()
                data.idcardBack=data.idcardBack.toString()
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
                this.dataApi.ajax('activateStoreInfo', data, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('激活成功')
                         this.dialogVisible=false
                        this.$router.push('/merchant/merchant_list')
                    }
                    this.loading=false
                  }); 
            },
             findSort(type){
                    for (var i = this.typeList.length - 1; i >= 0; i--) {
                        if (type==this.typeList[i].value) {

                            return this.typeList[i].text
                        }
                    }
            },
            getcode(){
                if (!this.contactNum) {
                     this.showMsg('请输入手机号','warning')
                    return;
                }
                var _this=this
                var data={
                        phone:this.contactNum,
                        yzm:this.contactNum
                 }
                this.dataApi.ajax('sendActStoreMsg',data, res => {
                    if (res.responseType === 'S') {
                         
                         var i = 60;
                            var Code=document.getElementById("code");
                            var timer = setInterval(function(){
                                if(i== 0){
                                    Code.innerText="验证码"
                                    // Code.style.backgroundColor='#0AC0EF';
                                    // Code.style.color='white'
                                    clearInterval(timer)
                                    _this.cantclick=false
                                   
                                }else{
                                   Code.innerText=Math.floor(i)+'秒';
                                    --i;
                                    _this.cantclick=true;
                                }
                            },1000);
                    } 
               })
                
                    

            },
        }
    }
</script>
