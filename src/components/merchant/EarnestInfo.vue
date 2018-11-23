<template>
    <div style="margin-top: 30px;width: 1200px">

        <div>
            <el-row>
                    <el-col :span="24">
                        <el-button
                                type="primary"
                                @click="goBack()">返回
                        </el-button>
                        <span style="font-size: 15px;margin-left: 10px;">提交认证信息</span>
                    </el-col>
                </el-row>
            <div v-show="firstStep">
                <hr  style="margin-bottom:30px;">
                <h3 style="margin:30px 50px;">第一步：提交认证信息</h3>
                <el-form label-width="150px" class="demo-ruleForm" :model="form1" style="display: inline-block;margin-right: 40px;vertical-align: top;">
                    <el-form-item label="绑定用户ID：">
                            <el-input style="width:150px;" v-model="id" @blur="userName=''" :disabled="disabled1"></el-input>
                            <el-button type="primary"  style="margin-left: 20px;" @click="dialogVisible=true;fetchUser(pageInfo.pageNum)">查询用户id</el-button>
                            <div><span style="color: red;font-size:15px;">*绑定激活后无法修改，请核对无误后再操作</span></div> 
                    </el-form-item>
                    <div style="margin-bottom: 30px;"><span  class="pointer" style="margin-left: 20px;margin-right: 10px;" @click="find()">点击确认用户名：</span><span>{{ userName }}</span></div>
                    <el-form-item label="商家所在区域：">
                       <el-select v-model="form1.province" placeholder="省份" style="width: 120px;"  @change="fetchArea(form1.province,'city',1)" :disabled="disabled1">
                            <el-option v-for="item in province" :label="item.name" :value="item.cityCode"></el-option>
                        </el-select>
                        <el-select v-model="form1.city" placeholder="市" style="width: 120px;"  @change="fetchArea(form1.city,'area',2)" :disabled="disabled1">
                            <el-option v-for="item in city" :label="item.name" :value="item.cityCode"></el-option>
                        </el-select>
                        <el-select v-model="form1.area" placeholder="区" style="width: 120px;" :disabled="disabled1">
                            <el-option v-for="item in area" :label="item.name" :value="item.cityCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店主/经办人姓名：">
                    <el-input style="width: 300px;" v-model="form1.contact"  :disabled="disabled1"></el-input>
                    </el-form-item>
                    <el-form-item label="店主/经办人身份证：">
                        <el-input style="width: 300px;" v-model="form1.idCard" :maxlength="18" :disabled="disabled1"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式：">
                        <el-input style="width: 300px;" v-model="form1.contactNum" :maxlength="11" :disabled="disabled1"></el-input>
                    </el-form-item>
                     <el-button type="primary" @click="checkFirst()" style="margin-left: 150px;">下一步</el-button>
                </el-form>
            </div>
            <div v-show="secondStep">
                <hr  style="margin-bottom:30px;">
                <h3 style="margin:30px 50px;">第二步：上传认证图片</h3>
                <el-form label-width="150px" class="demo-ruleForm"  :model="form2" >
                    <el-form-item label="认证图片：">
                        <div style="display:inline-block;text-align: center">
                            <we-ui-uploads :images="form2.personPhoto"
                                       :maxCount="1"
                                       :maxSize="1024*1024"
                                       @uploading="uploading"></we-ui-uploads>
                          （手持身份证） 
                        </div>
                       <div style="display:inline-block;text-align: center">
                            <we-ui-uploads :images="form2.idcardFront"
                                       :maxCount="1"
                                       :maxSize="1024*1024"
                                       @uploading="uploading"></we-ui-uploads>
                          （身份证正面） 
                        </div>
                        <div style="display:inline-block;text-align: center">
                            <we-ui-uploads :images="form2.idcardBack"
                                       :maxCount="1"
                                       :maxSize="1024*1024"
                                       @uploading="uploading"></we-ui-uploads>
                          （身份证反面） 
                        </div>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="checkSecond()" style="margin-left: 150px;">下一步</el-button>
            </div>
            <div  v-show="thirdStep">
               <!--  <el-row>
                    <el-col :span="24">
                        <el-button
                                type="primary"
                                @click="secondStep=true;thirdStep=false">返回
                        </el-button>
                        <span style="font-size: 15px;margin-left: 10px;">新增/编辑商家</span>
                    </el-col>
                </el-row> -->
                <hr  style="margin-bottom:30px;">
                <h3 style="margin:30px 50px;">第三步：完善商家信息</h3>
                <el-form :model="form3"
                         style="display:inline-block;vertical-align: top;margin-right: 80px"
                         label-width="150px">
                    
                    <el-form-item label="商家名称：">
                        <el-input style="width: 300px;" v-model="form3.storeName" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="门店电话：">
                        <el-input style="width: 300px;" v-model="form3.storePhone" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="门店地址：">
                        <el-input style="width: 300px;" v-model="form3.storeAddress"  type="textarea" :rows="3" :disabled="true"></el-input>
                        <el-button type="primary" @click="selectAddress()" >重新选取地址</el-button>
                    </el-form-item>
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
                    <el-form-item label="商家类型：">
                         <el-select v-model="form3.storeType" style="width: 200px;">
                              <el-option :label="item.text" :value="item.value"
                                         v-for="item in merchantType"></el-option>
                         </el-select>
                    </el-form-item>
                    <el-form-item label="商家分类：">
                         <el-select v-model="form3.businessClass" style="width: 200px;"  @change="selectSort2()"
                                   placeholder="一级分类">
                            <el-option :label="item.classifyName" :value="item.classifyId"
                                       v-for="item in sortList"></el-option>
                        </el-select>
                        <el-select v-model="form3.businessSubclass" style="width: 200px;" placeholder="二级分类" >
                            <el-option :label="item.classifyName" :value="item.classifyId"
                                       v-for="item in secondList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商家简介：">
                         <el-input style="width: 300px;" v-model="form3.introduction"  type="textarea" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                       <el-button type="primary" :loading="loading" @click="submit()">提交审核</el-button> 
                    </el-form-item>
                     
                </el-form>
                <el-form label-width="120px" class="demo-ruleForm" style="display:inline-block;;max-width:500px" :model="form3" >
                    <el-form-item label="认证图片：" label-width="100px">
                        <div style="display:inline-block;text-align: center">
                            <we-ui-uploads :images="form3.businessLicense"
                                       :maxCount="1"
                                       :maxSize="1024*1024"
                                       @uploading="uploading"></we-ui-uploads>
                          （营业执照） 
                        </div>      
                    </el-form-item>

                    <el-form-item label="商家封面图：" label-width="100px">
                      <div style="display: inline-block;text-align: center">
                           <we-ui-uploads :images="form3.storeImg"
                                       :maxCount="1"
                                       :maxSize="1024*1024"
                                       @uploading="uploading"></we-ui-uploads>  
                                       （必传） 
                     </div>             
                    </el-form-item>
                    <el-form-item label="商家简介图：" label-width="100px">
                        <we-ui-uploads :images="form3.storegList"
                                       :maxCount="9"
                                       :maxSize="1024*1024"
                                       :isSort="true"
                                       @uploading="uploading"></we-ui-uploads>
                        （最多上传9张）
                    </el-form-item>
                </el-form>
            </div>
            

        </div>
        
          <el-dialog title="用户列表" v-model="dialogVisible"  size="large">
              <el-row style="margin-top: 15px;padding: 20px 0;">
                <el-col :span="24">
              
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item>
                            <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                <el-option label="用户名" value="userName"></el-option>
                                <el-option label="用户ID" value="userId"></el-option>
                            </el-select>
                            <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="按会员身份:">
                            <el-col :span="18">
                                <el-select v-model="formInline.userIdentity">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in identityArray" :label="item.text" :value="item.value"></el-option>
                                </el-select>
                            </el-col>

                        </el-form-item>
                        <el-form-item label="按状态:">
                            <el-select v-model="formInline.userStat" style="width: 120px;" >
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已启用" value="1"></el-option>
                                <el-option label="已禁用" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="fetchUser(1)">查询</el-button>
                         
                    </el-form>
                </el-col>
            </el-row>

            <el-table
                    :data="pageInfo.dtos"
                    v-loading="table_loading"
                    element-table_loading-text="加载中"
                    stripe
                    @sort-change='order'
                    style="width: 100%">
                <el-table-column
                        prop="userId"
                        label="用户ID">
                </el-table-column>
                <el-table-column
                        label="用户名"
                        prop="userName">
                </el-table-column>
                <el-table-column
                        sortable='custom'
                        label="领红包范围(m)"
                        prop="territorial_Limit">
                        <template scope="scope">
                            <span>{{ scope.row.territorialLimit }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="身份">
                        <template scope="scope">
                             <span>{{ findIdentity(scope.row.userIdentity) }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        sortable='custom'
                        label="拥有主城"
                        prop="territory_Number">
                        <template scope="scope">
                            <span>{{ scope.row.territoryNumber }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        width="140"
                        sortable='custom'
                        prop="cre_Time"
                        label="注册时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template scope="scope">
                        <span>{{scope.row.userStat == 1?'已启用':'已禁用'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginate">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="pageInfo.pageNum"
                        :page-size="pageInfo.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="pageInfo.count"
                        >
                </el-pagination>
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
                form1:{
                   areaNum:'',
                   contact:'',
                   idCard:'',
                   contactNum:'',
                   province:'',
                   city:'',
                   area:'',
                   storeId:'',
                   userId:''
                },
                form2:{
                   personPhoto:[],
                   idcardFront:[],
                   idcardBack:[]
                },
                form3:{
                    storeName:'',
                    storePhone:'',
                    storeAddress:'',
                    businessTime:'',
                    businessClass:'',
                    businessSubclass:'',
                    introduction:'',
                    businessLicense: [],
                    storegList:[],
                    storeImg:[],
                    storeAccu:'',
                    storeDime:'',
                    storeType:'1'
                },
                sortList: [],
                secondList: [],
                startTime:'',
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
                formInline: {
                    type: 'userName',
                    userName:'',
                    userIdentity:'',
                    name:'',
                    userStat:'',
                    sort:'CRE_TIME',
                    desc:'DESC',
                    pageNum:1,
                    pageSize: 10
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                table_loading:false,
                province:[],
                city:[],
                area:[],
                firstStep:true,
                secondStep:false,
                thirdStep:false,
                bankList:[],
                ledgerNo:'',
                stepNo:0,
                disabled1:false
            }
        },
        created(){          
           this.selectSort();
           this.fetchArea(0,'province',1);
        },
        activated(){
             if (sessionStorage.getItem('address')!=null) {
                let info=JSON.parse(sessionStorage.getItem('address'))
                this.form3.storeAddress=decodeURI(info.storeAddress)
                this.form3.areaNum=info.areaNum
                this.form3.storeAccu=info.storeDime
                this.form3.storeDime=info.storeAccu
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
                let info=JSON.parse(sessionStorage.getItem('merchant_basic'))
                       this.form1={
                           areaNum:'',
                           contact:'',
                           contactNum:'',
                           idCard:'',
                           province:'',
                           city:'',
                           area:'',
                           storeId:'',
                           userId:''
                        }
                        this.form2={
                           personPhoto:[],
                           idcardFront:[],
                           idcardBack:[]
                        }
                         this.form3={
                            storeName:info.storeName,
                            storePhone:info.storePhone,
                            storeAddress:info.storeAddress,
                            businessTime:'',
                            businessClass:info.businessClass,
                            businessSubclass:info.businessSubclass,
                            introduction:'',
                            businessLicense: [],
                            storegList:[],
                            storeImg:info.storeImg,
                            storeAccu:info.storeAccu,
                            storeDime:info.storeDime,
                            storeType:'1'
                        }
                        this.show=true
                        this.id=''
                        this.userName=''
                        this.firstStep=true
                        this.secondStep=false
                        this.thirdStep=false
                        this.startTime=''
                        this.endTime=''
            },
            fetchUser(page=1){
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectUser', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });
            },
            changeType(){
                this.formInline.userName=''
                this.formInline.userId=''
            },
            handleCurrentChange(val) {
               this.fetchUser(val)            
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
                this.formInline.sort=column.prop.toUpperCase()
                this.fetchUser(this.pageInfo.pageNum)
            },
            fetchArea(parentCode, type, rank) {
                if (parentCode===0 || parentCode>0) {
                    this.dataApi.ajax('selectSysCity', {cityCode: parentCode}, res => {
                        if (res.responseType === 'S') {
                               this[type] = res.dtos
                                if (rank === 1) {
                                    this.form1.city = ''
                                    this.form1.area = ''
                                } else if (rank === 2) {
                                    this.form1.area = ''
                                }
                                return false;
                        }
                    });
                }else{
                    this.form1.city = ''
                    this.form1.area = ''
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
                    this.form3.businessSubclass= this.form3.businessSubclass
                    this.show=false
                }else{
                    this.form3.businessSubclass ='' 
                }
                this.dataApi.ajax('selectStoreClassify', {parentId: this.form3.businessClass}, res => {
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
                if (!this.id) {
                    this.showMsg('请填写用户id','warning')
                    return
                }
               this.dataApi.ajax('singleUser', {userId: this.id}, res => {
                    if (res.responseType === 'S') {
                         if(res.isRealName==1){
                             this.showMsg('该用户未进行实名认证','warning')
                             this.userName=''
                         }else{
                             this.userName=res.userName
                             this.form1.contactNum=res.phone
                         }

                        
                    }
                });
            },
            submit(){
                 if (!this.form3.storeName) {
                   this.showMsg('请输入商家名称','warning')
                   return;
                } 
                if (!this.form3.storePhone) {
                   this.showMsg('请输入门店电话','warning')
                   return;
                }
                 if (!this.form3.storeAddress) {
                   this.showMsg('请选取门店地址','warning')
                   return;
                }
                 if (!this.startTime|| !this.endTime) {
                   this.showMsg('请输入营业时间','warning')
                   return;
                 }
                if (!this.form3.businessClass|| !this.form3.businessSubclass) {
                   this.showMsg('请选择分类','warning')
                   return;
                 }
                 if (!this.form3.introduction) {
                   this.showMsg('商家简介','warning')
                   return;
                 }
                if (this.form3.businessLicense.length==0) {
                    this.showMsg('请输入请上传营业执照','warning')
                    return false;
                }
                 if (this.form3.storeImg.length==0) {
                    this.showMsg('请上传商家封面图片','warning')
                    return false;
                }

                var data1={
                    storeId:this.$route.params.id,
                    userId:this.id,
                    contactNum:this.form1.contactNum,
                    areaNum:this.form1.area,
                    idCard:this.form1.idCard,
                    contact:this.form1.contact,
                }

                let data2=generateObj(this.form2);
                data2.personPhoto=this.form2.personPhoto+'';
                data2.idcardFront=this.form2.idcardFront+'';
                data2.idcardBack=this.form2.idcardBack+'';

                let data3 = generateObj(this.form3)
                data3.businessLicense=data3.businessLicense.toString()
                data3.storeImg=data3.storeImg.toString()
                data3.businessTime=this.startTime+'-'+this.endTime
                var obj=Object.assign(data1,data2,data3)
                this.loading=true
                this.dataApi.ajax('merchantRegistrationNew',obj, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('提交成功')
                         this.dialogVisible=false
                        this.$router.push('/merchant/merchant_list')
                    }
                    this.loading=false
                  }); 
            },
            checkFirst(){
                if (!this.userName) {
                    this.showMsg('请确认用户','warning')
                    return false;
                }
                if (!this.form1.area) {
                    this.showMsg('请选择商家所在区域','warning')
                    return false;
                }
                if (!this.form1.contact) {
                    this.showMsg('请填写店主/经办人姓名','warning')
                    return false;
                }
                if (!this.form1.idCard) {
                    this.showMsg('请填写店主/经办人身份证','warning')
                    return false;
                }
                if (!this.form1.contactNum) {
                    this.showMsg('请填写联系方式','warning')
                    return false;
                }
                this.firstStep=false;
                this.secondStep=true;

                // this.dataApi.ajax('authStoreUserForBackground', data, res => {
                //     if (res.responseType === 'S') {
                //         this.firstStep=false;
                //         this.secondStep=true;
                //         this.ledgerNo=res.ledgerNo
                //     }
                // }); 

            },
            checkSecond(){
                if (!this.form2.personPhoto) {
                    this.showMsg('请上传手持身份证照','warning')
                    return false;
                };
                if (!this.form2.idcardFront) {
                    this.showMsg('请上传身份证正面照','warning')
                    return false;
                };
                if (!this.form2.idcardBack) {
                    this.showMsg('请上传身份证反面照','warning')
                    return false;
                };
                this.secondStep=false;
                this.thirdStep=true

                // this.dataApi.ajax('authStoreUserImg',data, res => {
                //     if (res.responseType === 'S') {
                //         this.secondStep=false;
                //         this.thirdStep=true
                //         this.form3.idcardFront=data.idcardFront
                //         this.form3.idcardBack=data.idcardBack
                //     }
                // }); 
            }
        }
    }
</script>
