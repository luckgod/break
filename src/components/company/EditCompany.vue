<template>
    <div style="margin-top: 20px;width: 1200px">
        <el-button
                type="primary"
                @click="goBack()">返回
        </el-button>
        <div style="margin-top: 30px">
            <el-form :model="form"
                     style="display:inline-block;vertical-align: top;margin-right: 80px"
                     label-width="150px">
                <el-form-item label="公司名称：">
                    <el-input style="width: 300px;" v-model="form.companyName" ></el-input>
                </el-form-item>
                <el-form-item label="法人姓名：">
                    <el-input style="width: 300px;" v-model="form.legalName"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证：">
                    <el-input style="width: 300px;" v-model="form.legalIdentityCard" :maxlength="18"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input style="width: 300px;" v-model="form.contact"></el-input>
                </el-form-item>
                <el-form-item label="公司电话：">
                    <el-input style="width: 300px;" v-model="form.companyPhone"></el-input>
                </el-form-item>
                <el-form-item label="投放股权总数：">
                    <el-input style="width: 300px;" v-model="form.totalShare"></el-input>
                </el-form-item>
                 <el-form-item label="预计年化收益率：">
                    <el-input style="width: 300px;" v-model="form.proitRate"></el-input>%
                </el-form-item>
                <el-form-item label="">
                   <el-button type="primary" :loading="loading" @click="submitForm()">保存</el-button> 
                </el-form-item>
                 
            </el-form>
            <el-form label-width="120px" class="demo-ruleForm" style="display:inline-block;;max-width:500px" :model="form" >
                <el-form-item label="身份证照片：">
                  <div style="display: inline-block;text-align: center">
                       <we-ui-uploads :images="form.idcardFront"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                                   （身份证正面） 
                  </div>
                  <div style="display: inline-block;text-align: center">
                       <we-ui-uploads :images="form.idcardBack"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                                   （身份证反面） 
                  </div> 
                                  
                </el-form-item>
                <el-form-item label="营业执照：" >
                       <we-ui-uploads :images="form.businessLicense"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                                  
                </el-form-item>
                <el-form-item label="协议：">
                       <we-ui-uploads :images="form.protocol"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                                  
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
                    holdCompanyId:'',
                    companyName:'',
                    legalName:'',
                    legalIdentityCard:'',
                    companyPhone:'',
                    contact:'',
                    idcardFront:[],
                    idcardBack:[],
                    businessLicense: [],
                    protocol: [],
                    totalShare:'',
                    proitRate:''
                }
            }
        },
        created(){
          
           this.fetchData()
            
        },
        activated(){
                
           
            
        },
        methods: {
            fetchData(){
                if (this.$route.params.id=='add') {
                    return;
                }
                this.dataApi.ajax('singleUserHoldCompany',{holdCompanyId:this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                         this.form=res.dto
                         this.form.idcardFront ? this.form.idcardFront=[this.form.idcardFront]:[]
                         this.form.idcardBack ? this.form.idcardBack=[this.form.idcardBack]:[]
                         this.form.businessLicense ? this.form.businessLicense=[this.form.businessLicense]:[]
                         this.form.protocol ? this.form.protocol=[this.form.protocol]:[]
                    }
                });
            },
            submitForm(){
                if (!this.form.companyName) {
                   this.showMsg('请输入公司名称','warning')
                   return;
                } 
                if (!this.form.legalName) {
                   this.showMsg('请输入法人姓名','warning')
                   return;
                } 
                if (!isIDCard(this.form.legalIdentityCard)) {
                   this.showMsg('法人身份证不正确','warning')
                   return;
                }
                if (!this.form.contact) {
                   this.showMsg('请输入联系方式','warning')
                   return;
                }
                if (!this.form.companyPhone) {
                   this.showMsg('请输入公司电话','warning')
                   return;
                } 
                if (!isFloat(this.form.totalShare)) {
                   this.showMsg('投放股权总数不正确','warning')
                   return;
                } 
                if (!isFloat(this.form.proitRate)) {
                   this.showMsg('预计年化收益率不正确','warning')
                   return;
                }
                if (this.form.idcardFront.length==0) {
                   this.showMsg('请上传身份证正面','warning')
                   return;
                } 
                if (this.form.idcardBack.length==0) {
                   this.showMsg('请上传身份证反面','warning')
                   return;
                }  
                 if (this.form.businessLicense.length==0) {
                    this.showMsg('请上传营业执照','warning')
                    return;
                }
                if (this.form.protocol.length==0) {
                    this.showMsg('请上传协议','warning')
                    return;
                }
                let data = generateObj(this.form)

                data.idcardFront=data.idcardFront.toString();
                data.idcardBack=data.idcardBack.toString();
                data.businessLicense=data.businessLicense.toString();
                data.protocol=data.protocol.toString();
                
                this.loading=true

                if (data.holdCompanyId=='') {
                    this.dataApi.ajax('addUserHoldCompany',data, res => {
                        if (res.responseType === 'S') {
                            this.showMsg('新增成功')
                            this.loading=false
                            this.goBack()
                        }
                    }); 
                }else{
                    this.dataApi.ajax('editUserholdCompany',data, res => {
                        if (res.responseType === 'S') {
                            this.showMsg('编辑成功')
                            this.loading=false
                            this.goBack()
                        }
                    }); 
                }
                
                
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
                
            }

        }
    }
</script>
