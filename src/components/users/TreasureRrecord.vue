<template>
    <div class="account" style="max-width: 1366px;">
            <el-row :span="24" style="margin:26px 0;">
                 <el-button  @click="$router.push('/user/user_list')" type="primary" >返回</el-button>
            </el-row>
        <div class="padding_bg">
            <div  class="type_list">
                 <span style="cursor: pointer"  @click="$router.replace('/user/user_detail/'+$route.params.id)">用户资料</span>
                 <span class="choosed">财富记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/transaction_detail/'+$route.params.id)">交易明细</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/receive_record/'+$route.params.id)">领取红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/send_detail/'+$route.params.id)">发送红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/agency/'+$route.params.id)">代理记录</span>
           </div>
         <h3><i class="el-icon-document"></i> 财富信息</h3>
         <el-table
                :data="basicInfo"
                border
                stripe
                @sort-change='order'
                style="width: 100%;margin-top:20px;">
            <el-table-column
                    prop="yeepayAmount" 
                    label="现金余额">
                    <template scope="scope">
                        <span>{{ scope.row.yeepayAmount }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="changeDirection" 
                    label="奖励券">
                    <template scope="scope">
                        <span>{{ scope.row.exchangeAmount }}</span>
                       <!--  <span  class="pointer" @click="changeValue(scope.row.exchangeAmount,'奖励券','2')" style="float: right">调账</span> -->
                    </template>
            </el-table-column>
            <el-table-column
                    prop="changeDirection" 
                    label="抵价券">
                    <template scope="scope">
                        <span>{{ scope.row.offsetAmount }}</span>
                        <!-- <span  class="pointer" @click="changeValue(scope.row.offsetAmount,'抵价券','3')"style="float: right">调账</span> -->
                    </template>
            </el-table-column>
            <el-table-column
                    prop="changeDirection" 
                    label="红包股数">
                    <template scope="scope">
                        <span>{{ scope.row.redEnvelopesValue }}</span>
                        <span  class="pointer" @click="changeValue(scope.row.redEnvelopesValue,'红包股数','1')"style="float: right">调账</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="changeDirection" 
                    label="当前掉率">
                    <template scope="scope">
                        <span>{{ scope.row.userRatio }}</span>
                        <!-- <span  class="pointer" style="float: right" @click="changeRate()">调整</span> -->
                    </template>
            </el-table-column>
            <el-table-column
                    prop="changeDirection" 
                    label="操作">
                    <template scope="scope">
               <!--          <span  class="pointer" @click="$router.push('/user/change_record/'+$route.params.id)" >奖励券转化记录</span>
                        <br> -->
                        <span  class="pointer" @click="$router.push('/user/rate_record/'+$route.params.id)">掉率调整记录</span>
                    </template>
            </el-table-column>   
        </el-table>
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <h3><i class="el-icon-date"></i> 财富记录</h3>
            <el-col :span="24" style="margin-top:20px;">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
                        <el-form-item label="财富类型:">
                                <el-select v-model="formInline.type"  style="width: 120px;" @change="selectType()">
                                    <el-option  :label="item.text" :value="item.value" v-for="item in ppeType"></el-option>
                                </el-select>
                                <el-select v-model="formInline.changeType" style="width: 150px;"  @change="fetchData(1)">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option v-for="item in typeList" :label="item.externalName" :value="item.changeType"></el-option>
                                </el-select>
                        </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%"
                v-show="formInline.type=='1'">
                <el-table-column
                        prop="creTime"
                        label="交易时间">
                </el-table-column>
                 <el-table-column 
                       label="变动类型"
                       prop="name">
                </el-table-column>
                 <el-table-column 
                      prop="money"
                      label="金额" >
                      <template scope="scope">
                           <span>{{ scope.row.changeDirection==1? '+':'-' }}{{ scope.row.money }}</span>
                      </template>
                </el-table-column>
                <el-table-column
                        prop="redEnvelopes"
                        label="股数变动" >
                </el-table-column>
                <el-table-column
                        prop="serialNo"
                        label="流水号">
                </el-table-column>
        </el-table>

        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                v-show="formInline.type!='1'"
                style="width: 100%">
            <el-table-column
                    prop="serialNo"
                    label="流水号">
            </el-table-column>
            <el-table-column
                    prop="creTime"
                    label="交易时间">
            </el-table-column>
             <el-table-column 
                   label="变动类型"
                   prop="name">
            </el-table-column>
             <el-table-column 
                  prop="money"
                  label="金额" >
                  <template scope="scope">
                           <span>{{ scope.row.changeDirection==1? '+':'-' }}{{ scope.row.money }}</span>
                      </template>
            </el-table-column>
             <el-table-column
                    prop="serialNo"
                    label="操作">
                    <template scope="scope">
                         <span class="pointer" v-if="scope.row.dtos" @click="checkDetail(scope.row)">详情</span>  
                    </template>
            </el-table-column>
        </el-table>
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
        <!--修改财富信息-->
        <el-dialog title="修改财富信息" v-model="dialogVisible">
            <el-form  :v-model="treasureForm" style="width: 85%;">
                <el-form-item :label="treasureForm.type+':'"
                              label-width="150px">
                    <span>{{treasureForm.value}}</span>
                </el-form-item>
                <el-form-item label="数值:"
                              label-width="150px" >
                     <el-select v-model="type" style="width: 100px;">
                            <el-option label="增加" value="+"></el-option>
                            <el-option label="减少" value="-"></el-option>
                     </el-select>
                    <el-input  v-model="treasureForm.amt" style="width: 150px;" @blur="checkNum(treasureForm.change)"></el-input>
                </el-form-item>
                <el-form-item label="修改后值:" v-if="treasureForm.amt" 
                              label-width="150px">
                    <span v-if="type=='+'">{{Math.round((parseFloat(treasureForm.value)+parseFloat(treasureForm.amt))*10000)/10000}}</span>
                    <span v-else>{{Math.round((parseFloat(treasureForm.value)-parseFloat(treasureForm.amt))*10000)/10000}}</span>
                </el-form-item>
                <el-form-item label="备注:" label-width="150px" >
                    <el-input  v-model="treasureForm.remark" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submitForm" :disabled="!treasureForm.amt">提 交</el-button>
            </div>
        </el-dialog>

        <!--掉率修改-->
        <el-dialog title="掉率修改" v-model="rateDialog" size="tiny" >
            <el-form  style="width: 85%;" label-width="100px">
                <el-form-item label="掉落率:">
                            万分之
                    <el-input  v-model="rateForm.userRatio" style="width: 40%"></el-input>
                </el-form-item>
              <!--   <el-form-item label="启用状态：">
                        <el-radio class="radio" label="1" v-model="rateForm.enableState" style="margin: 0">系统掉率</el-radio>
                        <el-radio class="radio" label="2" v-model="rateForm.enableState">推荐掉率</el-radio>
                        <el-radio class="radio" label="3" v-model="rateForm.enableState">调整掉率</el-radio>
                </el-form-item> -->
                <el-form-item label="开始时间：">
                        <el-date-picker 
                        type="date" 
                        placeholder="开始时间" 
                        v-model="startTime" 
                        :picker-options="pickerOptions1"
                        style="width:200px;">    
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="结束时间：">
                        <el-date-picker 
                        type="date" 
                        placeholder="结束时间" 
                        v-model="endTime" 
                        :picker-options="pickerOptions1"
                        style="width:200px;">    
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input  v-model="rateForm.remark" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rateDialog = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submitRate()" :disabled="!rateForm.userRatio || !startTime || !endTime">提 交</el-button>
            </div>
        </el-dialog>

        <!--详情-->
        <el-dialog title="详情" v-model="detailDialog" size="tiny" >
            <el-form  style="width: 85%;" label-width="100px">
                <el-form-item :label="item.key+':'" v-for="item in detailList">
                       <span style="float:right">{{ item.value }}</span>
                </el-form-item>
              
            </el-form>
        </el-dialog>
    </div>
</template>
<style>

.list_type{
  font-size: 17px;
  margin-top: 30px;
  color: #5E5E5E;
}
.list_type span{
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
</style>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                loading:false,
                formLabelWidth: '100px',
                formInline:{
                    pageNum: 1,
                    pageSize: 10,
                    ppeType:'',
                    userId:'',
                    changeType:'',
                    type:'1',
                    sort:'CRE_TIME',
                    desc:'DESC'
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos: []
                },
                treasureForm:{
                    type:'',
                    value:'',
                    remark:'',
                    amt:0,
                    ppeType:''
                },
                type:'+',
                ppeType:[{text:'红包股记录',value: '1'},{text:'收支明细',value: '2'},{text:'抵价券',value: '3'},{text:'奖励券',value: '4'}],
                typeList:[],
                allList:[],
                basicInfo:[],
                dialogVisible:false,
                rateDialog:false,
                rateForm:{
                  userRatio:'',
                  begTime:'',
                  endTime:'',
                  userCode:'',
                  remark:'',
                  cumuBonus:'',
                  cumuOffset:''
                },
                pickerOptions1: {
                      disabledDate(time) {
                        return time.getTime() < Date.now()-3600 * 1000 * 24;
                      },
                },
                startTime:'',
                endTime:'',
                rateInfo:{
                    ratioBegTime:'',
                    ratioEngTime:'',
                    userRatio:'',
                    cumuBonus:'',
                    cumuOffset:''
                },
                detailDialog:false,
                detailList:[]
            }
        },
        created(){
            this.fetchData(this.pageInfo.pageNum);
            this.fetchInfo();
            this.selectType();
        },
        methods: {
            fetchData (page=1) {   
                this.formInline.userId=this.$route.params.id
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum=page
                this.dataApi.ajax('selectPageBill',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
             fetchInfo () {
                let rid =this.$route.params.id
                this.dataApi.ajax('singleUser', {userId: rid}, res => {
                    if (res.responseType === 'S') {
                         this.basicInfo=[]
                         this.basicInfo.push({
                            yeepayAmount:res.yeepayAmount,
                            exchangeAmount:res.exchangeAmount,
                            offsetAmount:res.offsetAmount,
                            redEnvelopesValue:res.redEnvelopesValue,
                            userRatio:res.userRatio
                         })
                         this.rateInfo={
                            ratioBegTime:res.ratioBegTime,
                            ratioEngTime:res.ratioEngTime,
                            userRatio:res.userRatio,
                            cumuBonus:res.exchangeAmount,
                            cumuOffset:res.offsetAmount

                         }
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val);
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
                this.fetchData(this.pageInfo.pageNum)
            },
            selectType(){

                this.dataApi.ajax('selectBillType',{type:this.formInline.type}, res => {
                    if (res.responseType === 'S') {
                         this.typeList=res.changeTypePojos
                         this.formInline.changeType=''
                         this.fetchData(1)
                    }
                });
            },
            changeValue(value,type,key){
                this.treasureForm={
                    userId:this.$route.params.id,
                    type:type,
                    value:value,
                    amt:'',
                    ppeType:key
                }
                this.dialogVisible=true
            },
            submitForm() {    
                if (!isFloat(this.treasureForm.amt)) {
                  this.showMsg('只能输入数字','warning')
                  return
                }
                var changeDirection=''
                 if (this.type=='-') {
                    if (this.treasureForm.amt>this.treasureForm.value) {
                        this.showMsg('调账不能调为负数','warning')
                        return
                    }
                    changeDirection=2
                  }else{
                     changeDirection=1
                  }
                 var data={
                       amt:this.treasureForm.amt,
                       userId:this.$route.params.id,
                       ppeType:this.treasureForm.ppeType,
                       changeDirection:changeDirection,
                       remark:this.treasureForm.remark
                 }
                   this.loading=true
                    this.dataApi.ajax('addAdjustment',data, res => {
                        if (res.responseType === 'S') {
                             this.showMsg('修改成功')
                             this.fetchInfo()
                             this.fetchData(1)
                        }

                    });
                  this.loading=false
                 this.dialogVisible=false    
                
            },
             checkNum(item){
                if(!item)  return
                if (!isFloat(item)) {
                   this.showMsg('只能输入正数','warning')
                   this.treasureForm.amt=0
                }else{
                   if (item.toString().indexOf('.') > 0 && item.toString().split('.')[1].length > 2) {
                    this.showMsg("只能精确到小数点后两位!","warning")
                    this.treasureForm.amt=0
                    return;
                  }
                     this.treasureForm.amt=Math.abs(item)
                }
                
            },
            submitRate(){
                if (!this.rateForm.userRatio || !isFloat(this.rateForm.userRatio)) {
                    this.$message({
                            type: 'warning',
                            message: '掉落率不正确!'
                     });
                    return false;
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
                if (this.startTime && this.endTime) {
                    this.rateForm.begTime=dateFormat(this.startTime,'y-m-d')
                    this.rateForm.endTime=dateFormat(this.endTime,'y-m-d')
                    if (this.rateForm.begTime>this.rateForm.endTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                    }
                }
                this.loading=true
                this.dataApi.ajax('editUserRatio',this.rateForm, res => {
                        this.showMsg('修改成功')
                        this.loading=false
                        this.rateDialog=false
                        this.fetchInfo()
                 });
            },
            changeRate(){
                this.rateDialog=true
                this.rateForm={
                  userRatio:this.rateInfo.userRatio,
                  begTime:this.rateInfo.ratioBegTime,
                  endTime:this.rateInfo.ratioEngTime,
                  userCode:this.$route.params.id,
                  remark:'',
                  cumuBonus:this.rateInfo.cumuBonus,
                  cumuOffset:this.rateInfo.cumuOffset
                }
                this.startTime=this.rateInfo.ratioBegTime
                this.endTime=this.rateInfo.ratioEngTime
            },
            checkDetail(item){
                 this.detailDialog=true;
                 this.detailList=generateArr(item.dtos);
                 if (item.changeDirection=='1') {
                    this.detailList.unshift({
                        key:'入账金额',
                        value:'+'+item.money
                     });
                 }else{
                    this.detailList.unshift({
                        key:'实付金额',
                        value:'-'+item.money
                     });
                 }
                 this.detailList.push({
                    key:'创建时间',
                    value:item.creTime
                 });
                 this.detailList.push({
                    key:'订单号',
                    value:item.orderId
                 });
            }

        }
    }
</script>
