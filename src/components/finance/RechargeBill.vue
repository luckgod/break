<template>
    <div class="account">
        <div class="padding_bg">
            <div style="margin-top:30px">
                     <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="全部" name="1"></el-tab-pane>
                   <!--      <el-tab-pane label="对账记录" name="2"></el-tab-pane>
                        <el-tab-pane label="当前对账结果" name="3"></el-tab-pane> -->
                     </el-tabs>
            </div>
            <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="120px">
                        <el-form-item label="">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>      
                        <el-form-item label="充值单号：">
                             <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="充值方式：">
                            <el-select v-model="formInline.honourType" style="width: 100px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="微信" value=""></el-option>
                                <el-option label="支付宝" value=""></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="充值类型：">
                            <el-select v-model="formInline.honourType" style="width: 110px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="发红包" value=""></el-option>
                                <el-option label="购买城主" value=""></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对账状态：">
                            <el-select v-model="formInline.honourType" style="width: 100px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未对账" value=""></el-option>
                                <el-option label="已对账" value=""></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData()">查询</el-button> 
                        <el-button type="primary" >导出</el-button>
            </el-form>
            <div style="border:1px solid #BFCBD9;width: 680px;padding:10px 20px;font-size: 18px;margin-bottom: 20px">
              <span style="font-weight:bold">充值笔数:</span><span style="color: red;">100000</span>   
              <span style="font-weight:bold;margin-left: 50px;">本地充值金额:</span><span style="color: red;">20000</span>
      <!--         <el-button type="primary" style="margin-left: 180px">导入账单</el-button> -->
            </div>
            <el-table
                :data="pageInfo.rows"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%">
            <el-table-column
                    prop="identity"
                    label="本地充值单号">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="时间">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="用户名">
                    <template scope="scope">
                       <span  class="pointer" @click="$router.push('/user/user_detail/'+scope.row.userId)">{{ scope.row.userName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="identity"
                    label="本地充值金额（元）">
            </el-table-column>
            <el-table-column
                    label="充值方式">
                    <template scope="scope">
                        <span>{{urgentList[scope.row.changeType]}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="充值类型">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="对账状态">
            </el-table-column>
        </el-table>
        <div class="paginate">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.pageNo"
                    :page-size="pageInfo.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pageInfo.totalRows">
            </el-pagination>
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
.el-tabs__item{
     font-size:18px !important;
     font-weight: bold;
}
.el-tabs__header{
  border-bottom:none;
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
                activeName: '1',
                formInline:{

                },
                startTime1:0,
                endTime1:0,
                pageInfo: {
                    pageNo: 1,
                    pageSize: 1,
                    totalRows: 1,
                    rows:[]
                },
            }
        },
        created(){
            // var permission=JSON.parse(sessionStorage.getItem('permission')).custAdminDto.menuId
            // if (permission.indexOf('用户列表')==-1) {
            //     history.back(-1)
            //     return;
            // }
            // if (permission.indexOf('财富信息')==-1) {
            //     this.show_ppe=false
            // }
            // if (JSON.parse(sessionStorage.getItem('permission')).adminId=='AM15047682485100000000080' || JSON.parse(sessionStorage.getItem('permission')).adminId=='AM15026818954720000000004') {
            //   this.show_yzm=false
            // }else{
            //   this.show_yzm=true
            // }
            // this.fetchData()      
            // this.fetchArea(0, 'province')
        },
        activated() {
            this.activeName='1'
  
        },
        mounted(){

        },
        methods: {
            fetchData () {
                let rid =this.$route.params.id
                if ( rid=== 'add') return;
                this.dataApi.ajax('UserControl/selectByUserId', {userId: rid}, res => {
                    if (res.responseType === 0) {
                        this.basicForm = res.userPojo
                        this.map = res.map || {}
                        this.memberMap = res.memberMap || {}
                        this.agentMap = res.agentMap || {}
                        this.countMap = res.countMap
                        this.basicForm.headPortrait = [this.URL+res.userPojo.headPortrait]
                        this.identity = this.basicForm.identity
                        this.fatherId=res.userPojo.fatherId
                        this.countAccount=res.countAccount
                        sessionStorage.setItem('user_phone',this.basicForm.phone)
                    }
                });

            },
             uploading(f) {    
                 //f.images.push(f.base64)
                this.dataApi.upload('file/upload', f.file, res => {
                    //console.log(res)
                    if (res.responseType === 0) {
                          f.images.splice(f.index,1,this.URL+res.fileName)
                    }
                });      
            },
            submit(){
               if (this.fatherId==this.basicForm.fatherId) {
                   this.basicForm.fatherId=''
               }
               let obj = generateObj(this.basicForm)
               var headPortrait = new String(obj.headPortrait)
               obj.headPortrait=headPortrait.replace(this.URL,'')
               var data={
                   phone:obj.phone,
                   sex:obj.sex,
                   birthday:obj.birthday,
                   headPortrait:obj.headPortrait,
                   userName:obj.userName,
                   cardNumber:obj.cardNumber,
                   email:obj.email,
                   fatherId:obj.fatherId,
                   realName:obj.realName,
                   userId:obj.userId
               }
        
               if (data.cardNumber) {
                 if (!isIDCard(data.cardNumber)) {
                   this.$message({
                        message: '输入的身份证不正确',
                        type: 'warning'
                    });
                   return
                 }
               }
               this.dataApi.ajax('UserControl/updateUserByAdmin',data, res => {
                        if (res.responseType === 0) {
                             this.showMsg('修改成功')
                             this.fetchData()
                        }

                 });
            },
            handleClick(tab, event) {
                if (this.activeName=='1') {
                   //this.$router.push('/mall/sort_banners')
                }
                if (this.activeName=='2') {
                   this.$router.push('/finance/checking_record')
                }

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
                this.fetchData(this.pageInfo.pageNo)
            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
        }
    }
</script>
