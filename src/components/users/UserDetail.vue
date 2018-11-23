<template>
    <div class="account">

        <el-row :span="24" style="margin:26px 0;">
             <el-button  @click="$router.push('/user/user_list')" type="primary" >返回</el-button>
            
        </el-row>
        <div class="padding_bg">
            <div  class="type_list">
                 <span class="choosed">用户资料</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/treasure_record/'+$route.params.id)">财富记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/transaction_detail/'+$route.params.id)">交易明细</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/receive_record/'+$route.params.id)">领取红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/send_detail/'+$route.params.id)">发送红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/agency/'+$route.params.id)">代理记录</span>
           </div> 
            <div  class="user_radius" >
                  <div style="float: left">
                    <we-ui-uploads :images="basicForm.headPortrait"
                                             :maxCount="1"
                                             :maxSize="1024*1024"
                                             @uploading="uploading"></we-ui-uploads>
                  </div>
                  <div style="display:inline-block;width: 30%;vertical-align:top;">
                      <el-form :model="basicForm" :inline="false" :label-width="formLabelWidth">
                              <el-form-item label="用户名："   class="no_bottom">
                                <el-input v-model="basicForm.userName" :maxlength="30" @blur="submit(basicForm.userName,'userName')" @focus="setOld(basicForm.userName)"></el-input>
                              </el-form-item>
                            <!--   <el-form-item label="微信号："  class="no_bottom">
                                <span>{{ basicForm.openId }}</span>
                              </el-form-item> -->
                              <el-form-item label="用户ID："  class="no_bottom">
                                <span>{{ basicForm.userId }}</span>
                              </el-form-item>
                              <el-form-item label="推荐人ID："   class="no_bottom">
                                <el-input v-model="basicForm.fatherId" :maxlength="30" @blur="submit(basicForm.fatherId,'fatherId')" @focus="setOld(basicForm.fatherId)"></el-input>
                              </el-form-item>
                              <el-form-item label="真实姓名："  class="no_bottom">
                                <span>{{ basicForm.realName? basicForm.realName:'未认证'}}</span>
                              </el-form-item>
                              <el-form-item label="身份证号："  class="no_bottom">
                                <span>{{ basicForm.idNumber? basicForm.idNumber:'未认证' }}</span>
                              </el-form-item>
                       </el-form>
                  </div>
                   <div style="display:inline-block;width: 25%">
                     <el-form :model="basicForm" :inline="false" :label-width="formLabelWidth">
                              <el-form-item label="性别："  class="no_bottom">
                                <span v-if="basicForm.sex">{{ basicForm.sex==1?  '女':'男'}}</span>
                                <span v-else>未设置</span>
                              </el-form-item>
                              <el-form-item label="年龄："  class="no_bottom">
                                <span>{{ basicForm.age?  basicForm.age:'未设置'}}</span>
                              </el-form-item>
                              <el-form-item label="行业："  class="no_bottom">
                                <span>{{ basicForm.industry?  basicForm.industry:'未设置'}}</span>
                              </el-form-item>
                              <el-form-item label="职业："  class="no_bottom">
                                <span>{{ basicForm.occupation?  basicForm.occupation:'未设置'}}</span>
                              </el-form-item>
                              <el-form-item label="所在地："  class="no_bottom">
                                <span>{{ basicForm.location?  basicForm.location:'未设置'}}</span>
                              </el-form-item>
                       </el-form>
                  </div>  
                   <div style="display:inline-block;width: 25%;vertical-align: top">
                      <el-form :model="basicForm" :inline="false" label-width="180px">
                              <el-form-item label="拥有主城个数："  class="no_bottom">
                                 <span class="pointer" @click="$router.push('/user/area_list/'+$route.params.id)">{{ basicForm.territoryNumber }}个</span>
                              </el-form-item>
                              <el-form-item label="当前待领取系统红包："  class="no_bottom">
                                 <span class="pointer" @click="$router.push('/user/to_receive/'+$route.params.id)">{{ basicForm.systemEnve }}个</span>
                              </el-form-item>
                              <el-form-item label="当前待领取个人红包："   class="no_bottom">
                                 <span>{{ basicForm.personalEnve }}</span>个
                              </el-form-item>
                              <el-form-item label="新增商家："  class="no_bottom">
                                  <router-link :to="'/merchant/merchant_list?crtUser='+basicForm.userId" target="_blank">
                                      <span class="pointer">{{basicForm.store}}位</span>
                                   </router-link>
                              </el-form-item>
                       </el-form>
                  </div>          
            </div>
            <div  class="user_radius" >
                  <div style="display:inline-block;width: 30%;vertical-align:top;">
                      <el-form :model="basicForm" :inline="false" :label-width="formLabelWidth">
                              <el-form-item label="上一级用户："   class="no_bottom">
                                <div  style="display: inline-block" v-if="pojos[0]">
                                    <img   class="avatar" :src="pojos[0].headPortrait">
                                    <router-link :to="'/user/user_detail/'+pojos[0].userId" target="_blank" ><span class="pointer" style="padding: 0 15px;">{{ pojos[0].userName }}</span></router-link>
                                     <span>{{ pojos[0].phone }}</span>
                                </div>
                                <div v-else style="display: inline-block;">无</div>
                              </el-form-item>
                              <el-form-item label="上二级用户："   class="no_bottom">
                                <div  style="display: inline-block" v-if="pojos[1]">
                                    <img   class="avatar" :src="pojos[1].headPortrait">
                                    <router-link :to="'/user/user_detail/'+pojos[1].userId" target="_blank" ><span class="pointer" style="padding: 0 15px;">{{ pojos[1].userName }}</span></router-link>
                                    <span>{{ pojos[1].phone }}</span>
                                </div>
                                <div v-else style="display: inline-block;">无</div>
                              </el-form-item> 
                       </el-form>
                  </div>
                   <div style="display:inline-block;width: 30%">
                      <el-form :model="basicForm" :inline="false" label-width="180px">                 
                              <el-form-item label="我的下级："  class="no_bottom">
                                 <span class="pointer"  @click="$router.push('/user/subordinate_list/'+$route.params.id)">{{ basicForm.fatheNnumber }}位</span>
                              </el-form-item>
                              <el-form-item label="提现账户："  class="no_bottom">
                                 <span class="pointer"  @click="$router.push('/user/bank_list/'+$route.params.id)">{{ basicForm.cardNumber }}个</span>
                              </el-form-item>                        
                       </el-form>
                  </div>  
                  <div style="display:inline-block;width: 30%">
                      <el-form :model="basicForm" :inline="false" label-width="180px">                 
                              <el-form-item label="贡献股数："  class="no_bottom">
                                 <span>{{ basicForm.souceAmt }}股</span>
                              </el-form-item>
                              <el-form-item label="累计影响人数："  class="no_bottom">
                                 <span>{{ basicForm.influenceNumber }}</span>个
                              </el-form-item>                        
                       </el-form>
                  </div>          
            </div>
             <div class="user_radius mall_radius">
                  <el-card class="box-card" style="display:inline-block;width: 40%;margin-right: 50px">
                    <div  class="text item underline">
                      当前红包股数<span>{{ basicForm.redEnvelopesValue }}</span>
                    </div>
                    <div  class="text item underline">
                      当前红包股价值<span>{{ basicForm.amt }}</span>
                    </div>
                    <div  class="text item underline">
                      当前红包股价<span>{{ basicForm.sharePrice }}</span>
                    </div>
                  </el-card>
                  <el-card class="box-card" style="display:inline-block;width: 40%;">
                    <div  class="text item underline">
                      个人红包发放(元)<span>{{ basicForm.totalEnveAmount }}</span>
                    </div>
                    <div  class="text item underline">
                      已提现总金额(元)<span>{{ basicForm.account }}</span>
                    </div>
                    <div  class="text item underline">
                      审核中提现金额(元)<span>{{ basicForm.examine }}</span>
                    </div>
                  </el-card>
              </div>
        </div>
        

        
    </div>
</template>
<style>
.no_bottom{
  margin-bottom: 5px;
  text-align: left;
}
.no_bottom input{
  width: 180px;
}
.user_radius{
   width:1100px;
   height: auto;
   border:1px solid #BFCBD9;
   border-radius: 15px;
   text-align: center;
   margin:20px 0 30px 0;
   padding: 20px 30px;
   font-size: 16px;
   font-weight: bold;
   display: inline-block;
}
.mall_radius{
   border: none;
   min-width:1300px;
   font-size: 18px;
   padding:0;
   text-align:left;
}
.mall_radius .item{
  margin-bottom: 15px
}
.underline{
  border-bottom: 1px solid #797979;
  margin-top: 30px;
  padding-bottom: 10px;
  color: #595959;
  font-size: 15px
}
.underline span{
  float: right;
  font-size:25px;
  color: black;
  margin-right: 25px;
}
</style>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                loading:false,
                formLabelWidth: '100px',
                basicForm:{
                    headPortrait:[],
                    ppeInfoPojo:{},
                    ppeLimitPojo:{}
                },
                oldForm:{

                },
                changeDate:'',
                pojos:{}
            }
        },
        created(){
             this.fetchData()      
        },
        mounted(){

        },
        methods: {
            fetchData () {
                let rid =this.$route.params.id
                this.dataApi.ajax('singleUser', {userId: rid}, res => {
                    if (res.responseType === 'S') {
                         this.basicForm = res
                         res.headPortrait? this.basicForm.headPortrait=[res.headPortrait]:this.basicForm.headPortrait=[]
                         this.pojos = res.pojos || {}
                    }
                });

            },
            uploading(f) {
               this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                    //console.log(res)
                    if (res.responseType == 'S') {
                        f.images.splice(f.index,1,res.filePath)
                        this.submit(res.filePath,'headPortrait')
                    }
                });

            },
            submit(obj,type){
               if (obj==this.changeDate) {
                   return
               }
               this.dataApi.ajax('editUser',{[type]:obj,userId:this.basicForm.userId}, res => {
                        if (res.responseType === 'S') {
                             this.showMsg('修改成功')
                             this.fetchData()
                        }else{
                             this.fetchData()
                        }

                 });
            },
            setOld(item) {
                this.changeDate = item
            },
        }
    }
</script>
