<template>
    <div class="customer">
        <div class="radius" style="text-align:left;">
             <h4 class="manor_setting_h4">转出参数设置</h4>
             <div class="summarize" style="font-size: 15px;text-align: left">
                  <div>
                    小于
                    <el-input v-model="MinimumFeeAmount" style="width: 120px;" :disabled="showEdit"></el-input>
                    元手续费(元)
                    <el-input v-model="MinimumFee" style="width: 120px;margin-right:20px" :disabled="showEdit"></el-input>
                    转出税率
                    <el-input v-model="TaxRate" style="width: 120px;margin-right:20px" :disabled="showEdit"></el-input>
                    转出周期
                    <el-select v-model="PresentCycle" style="width: 120px;" :disabled="showEdit">
                                <el-option :label="item.text" :value="item.value" v-for="(item,index) in periodList"></el-option>
                    </el-select> 
                    <div v-if="powerShow('转出参数设置')" style="display:inline-block">
                         <el-button type="primary" v-if="showEdit" @click="showEdit=false" >修改</el-button>
                         <el-button type="primary" v-if="!showEdit" @click="submit" :loading="loading">保存</el-button>
                    </div>
                    
                  </div>
                  <div> 
                    用户原始股价值（元）
                    <el-input v-model="PurseSurplusValue" style="width: 100px;margin-right:20px" :disabled="showEdit"></el-input>
                    转出开放时间
                    <el-input v-model="OpeningTime" style="width:280px;" :disabled="true"></el-input>
                     <el-button type="primary"  @click="changeWithdrawTime" size="small" v-if="powerShow('转出参数设置')">修改转出时间</el-button>
                  </div>
             </div>
            <div style="text-align: left;">
               <h4 class="manor_setting_h4" style="margin-right:30px;">APP转出提示</h4>
                <div class="summarize_input">
                      <el-input v-model="contentInfo.textContent"  style="width: 500px;margin-left: 10px" type="textarea" :disabled="showEdit" :rows="3"></el-input>
                </div>
            </div>
            
        </div>
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="按用户名:" >
                                <el-input v-model="formInline.userName" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="按状态：">
                            <el-select v-model="formInline.withdrawStat" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item" :value="index" v-for="(item,index) in enableStateArr"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="按时间：">
                            <el-select v-model="formInline.dateFlag" style="width: 120px;" @change="changeDate">
                                <el-option label="申请日期" value="1"></el-option>
                                <el-option label="到账日期" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" v-if="formInline.dateFlag=='1'">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-form-item label=""  v-if="formInline.dateFlag=='2'">
                            <el-date-picker type="date" placeholder="开始时间" v-model="startTime2" style="width:150px;"></el-date-picker>
                            到
                            <el-date-picker type="date" placeholder="结束时间" v-model="endTime2" style="width:150px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData(1)">查询</el-button> 
                        <el-button type="primary" @click="statistics()">统计</el-button>
                         <el-button type="primary" @click="derive()">导出</el-button>
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
             <el-table-column  width="20" >
              <template scope="scope" >
                  <el-checkbox-group v-model="checked"  @change="handleCheckedCitiesChange" v-if="scope.row.withdrawStat==0 || scope.row.withdrawStat==3">
                      <el-checkbox :label="scope.row"></el-checkbox>
                  </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column
                    prop="cashChangeInfoCode"
                    label="序号">
            </el-table-column> 
            <el-table-column
                    label="用户名"
                    prop="userName">
                    <template scope="scope">
                        <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank" ><span class="pointer">{{ scope.row.userName}}</span></router-link> 
                    </template>
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号">
            </el-table-column>   
            <el-table-column
                    prop="withdraw_Amount"
                    sortable='custom'
                    label="转出金额（元）">
                    <template scope="scope">
                        <span>{{ scope.row.withdrawAmount }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="fee"
                    label="手续费（元）">
            </el-table-column>
            <el-table-column
                    prop="actual_Amount"
                    label="实际到账金额（元）">
                    <template scope="scope">
                        <span>{{ scope.row.actualAmount }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="cash_Change_Value"
                    sortable='custom'
                    label="转出股数">
                    <template scope="scope">
                        <span>{{ scope.row.cashChangeValue }}</span>
                    </template>
            </el-table-column>         
            <el-table-column 
                    prop="withdrawStat" 
                    label="状态" >
                    <template scope="scope">
                            {{enableStateArr[parseInt(scope.row.withdrawStat)]}}
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="cre_Time" 
                    label="申请时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="EXPECTED_DATE"
                    sortable='custom'
                    label="预计到账">
                    <template scope="scope">
                        <span>{{scope.row.expectedDate}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <div v-if="scope.row.withdrawStat=='0'">
                        <el-button type="success" size="small" @click="edit(scope.row.cashChangeInfoCode,'打款')">打款</el-button>
                        <el-button type="danger" size="small"  @click="refuseDilog(scope.row.cashChangeInfoCode)">拒绝</el-button>
                    </div>
                    <span class="pointer" v-if="scope.row.withdrawStat=='2'" @click="dialogVisible4=true;refuseInfo.refusal=scope.row.refusal;show=false">拒绝理由</span>
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
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange" style="margin:20px 20px 0 20px;">全选
        </el-checkbox>
         <el-button type="primary" @click="deliver" :loading="loading2">批量通过
         </el-button>
         <el-button type="primary" @click="refuseDilog('all')" :loading="loading2">批量拒绝
         </el-button>



        <!--转出金额统计-->
        <el-dialog title="转出金额统计" v-model="dialogVisible3" >
            <el-form :inline="true" class="demo-form-inline">
                   <el-form-item label="按用户名:" >
                            <el-input v-model="formInline.userName" style="width: 150px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="按状态：">
                        <el-select v-model="formInline.withdrawStat" style="width: 120px;" :disabled="true">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item" :value="index" v-for="(item,index) in enableStateArr"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="按时间：">
                        <span v-if="formInline.dateFlag!=''">{{ formInline.dateFlag==1? '申请日期':'到账日期' }}</span>
                        <el-form-item label="" v-if="formInline.dateFlag=='1'" >
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                        </el-form-item>
                        <el-form-item label=""  v-if="formInline.dateFlag=='2'">
                            <el-date-picker type="date" placeholder="开始时间" v-model="startTime2" style="width:150px;" :disabled="true"></el-date-picker>
                            到
                            <el-date-picker type="date" placeholder="结束时间" v-model="endTime2" style="width:150px;" :disabled="true"></el-date-picker>
                        </el-form-item>
                    </el-form-item>

            </el-form>
            <hr>
            <div class="sumMap">
                <div class="sumMap_num">
                    {{ sumMap.withdrawAmount }}
                </div>
                <div>
                   转出金额
                </div>
            </div>
             <div class="sumMap">
                <div class="sumMap_num">
                    {{ sumMap.number }}
                </div>
                <div>
                   转出笔数
                </div>
            </div>
            <div class="sumMap">
                <div class="sumMap_num">
                    {{ sumMap.actualAmount }}
                </div>
                <div>
                   实际打款金额
                </div>
            </div>
             <div class="sumMap">
                <div class="sumMap_num">
                    {{ sumMap.fee }}
                </div>
                <div>
                    税费
                </div>
            </div>
        </el-dialog>

        <!--转出开放时间-->
        <el-dialog title="转出开放时间" v-model="dialogVisible2" size="tiny">
              <el-checkbox-group v-model="checkboxGroup" size="mini" disabled>
                  <el-checkbox label="星期一"  border></el-checkbox>
                  <el-checkbox label="星期二"  border></el-checkbox>
                  <el-checkbox label="星期三"  border></el-checkbox>
                  <el-checkbox label="星期四"  border></el-checkbox>
                  <el-checkbox label="星期五"  border></el-checkbox>
                  <el-checkbox label="星期六"  border></el-checkbox>
                  <el-checkbox label="星期日"  border></el-checkbox>
              </el-checkbox-group>
              <el-button type="primary"  :loading="loading" @click="onSubmit">保存</el-button>
        </el-dialog>

        <!--导出-->
        <el-dialog title="导出转出申请" v-model="dialogVisible">
            <el-form label-width="120px">
                <el-form-item label="按用户名:" >
                        <el-input v-model="f.userName" style="width: 150px;"></el-input>
                </el-form-item>
                <el-form-item label="按申请时间:" >
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="f.startTime" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="f.endTime" style="width:180px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="按到账日期:">
                            <el-date-picker type="date" placeholder="开始时间" v-model="f.start" style="width:150px;"></el-date-picker>
                            到
                            <el-date-picker type="date" placeholder="结束时间" v-model="f.end" style="width:150px;"></el-date-picker>
                </el-form-item>
                 <el-form-item label="按状态：" >
                           <el-select v-model="f.withdrawStat" style="width: 150px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item" :value="index" v-for="(item,index) in enableStateArr"></el-option>
                           </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="deriveSubmit" >导出</el-button>
            </div>
        </el-dialog>

        <!-- 拒绝原因-->
         <el-dialog title="拒绝原因" v-model="dialogVisible4">
            <el-form label-width="120px">
                <el-form-item label="拒绝理由：" >
                       <el-input v-model="refuseInfo.refusal" type="textarea" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="show">
                <el-button @click="dialogVisible4 = false">取 消</el-button>
                <el-button type="primary"
                           @click="refuse()">确认</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<style>

.manor_setting_h4{
  display: inline-block;
  vertical-align: top;
  font-weight: bold;
  margin-right: 40px;
  margin-top: 20px;
}
</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                loading:false,
                formInline: {
                    pageNum: 1,
                    pageSize: 10,
                    sort:'CRE_TIME',
                    desc:'desc',
                    startTime:'',
                    endTime:'',
                    arrivalDateStart:'',
                    arrivalDateEnd:'',
                    withdrawTarget:'',
                    userName:'',
                    withdrawStat:'',
                    dateFlag:'',
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                enableStateArr: ['审核中', '已到账', '已拒绝','提交易宝成功','失败'],
                gridData: [],
                checked: [],
                checkAll: false,
                isIndeterminate: true,
                arr: [],
                loading2:false,
                dialogVisible:false,
                dialogVisible2:false,
                dialogVisible3:false,
                dialogVisible4:false,
                refuseInfo:{
                  refusal:'',
                  cashChangeInfoCode:''
                },
                f:{
                  startTime:'',
                  endTime:'',
                  withdrawStat:'',
                  start:'',
                  end:'',
                  userName:''
                },
                startTime1:0,
                endTime1:0,
                startTime2:0,
                endTime2:0,
                refusal:'',
                sumMap:{},
                showEdit:true,
                checkboxGroup:[],
                form:{

                },
                periodList:[{ text: 'T+0', value: '0' },{ text: 'T+1', value: '1' },{ text: 'T+2', value: '2' },{ text: 'T+3', value: '3' },{ text: 'T+4', value: '4' },{ text: 'T+5', value: '5' },{ text: 'T+6', value: '6' },{ text: 'T+7', value: '7' }],
                MinimumFeeAmount:'',              // 小于XX元
                MinimumFee:'',              // 手续费
                TaxRate:'',              // 转出税率
                PresentCycle:'',         // 转出周期
                PurseSurplusValue:'',    // 用户原始股价值
                OpeningTime:'',          // 转出开放时间
                contentInfo:{},
                show:true
            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchArgument();
            this.fetchPrivilege();
  
        },
        methods: {

            fetchData (page = 1) {
                if (this.formInline.dateFlag=='1') {
                     if (this.startTime1 && this.endTime1) {
                    this.formInline.startTime=dateFormat(this.startTime1)
                    this.formInline.endTime=dateFormat(this.endTime1) 
                    if (this.formInline.startTime>this.formInline.endTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.startTime=''
                        this.formInline.endTime=''
                    }
                    if (this.startTime1&&!this.endTime1) {
                         this.$message({
                              type: 'warning',
                              message: '请选择结束时间'
                          });
                         return;
                    }
                    if (!this.startTime1&&this.endTime1) {
                         this.$message({
                              type: 'warning',
                              message: '请选择开始时间'
                          });
                         return;
                    }
                }
                if (this.formInline.dateFlag=='2') {
                     if (this.startTime2 && this.endTime2) {
                    this.formInline.arrivalDateStart=dateFormat(this.startTime2,'y-m-d')
                    this.formInline.arrivalDateEnd=dateFormat(this.endTime2,'y-m-d')
                    if (strToTime(this.startTime2)>strToTime(this.endTime2)) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.arrivalDateStart=''
                        this.formInline.arrivalDateEnd=''
                    }
                    if (this.startTime2&&!this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择结束时间'
                          });
                         return;
                    }
                    if (!this.startTime2&&this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择开始时间'
                          });
                         return;
                    }
                }
                if (this.formInline.dateFlag=='1') {
                   delete this.formInline.arrivalDateStart
                   delete this.formInline.arrivalDateEnd
                }
                if (this.formInline.dateFlag=='2') {
                   delete this.formInline.startTime
                   delete this.formInline.endTime
                }
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.dataApi.ajax('withdrawSelect',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                        this.gridData = res.dtos
                        this.arr = []
                        for (var i = this.gridData.length - 1; i >= 0; i--) {
                               this.arr.push(this.gridData[i])
                              }
                              this.checked=[]
                              this.checkAll = false;
                        }

                });

            },
            fetchPrivilege(){

               //查询城主特权信息
                this.dataApi.ajax('singleSysTextInfo',{textCode:'0000000008'}, res => {
                    if (res.responseType === 'S') {
                        this.contentInfo=res
                    }
                });
            },
            fetchArgument(){
                
                //查询系统参数
                this.dataApi.ajax('sysParamQuery',{
                sysCodes:'MinimumFeeAmount,MinimumFee,TaxRate,PresentCycle,PurseSurplusValue,OpeningTime'}, res => {
                    if (res.responseType === 'S') {
                         for(var k in res.map){
                              this[k]=res.map[k]
                          }
                           //console.log(this.OpeningTime.split(',').join(''))
                          this.OpeningTime=this.convertToChinese(this.OpeningTime.split(',').join(''))
                    }
                });
            },
            handleCurrentChange(val) {
                this.checked=[]
                this.fetchData(val)
            },
            edit(id,type){
                this.$confirm('确定'+type+'?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    var state=''
                    if (type=='打款') {
                       state=1
                    }else{
                       state=2
                    }
                   // var data={
                   //  cashChangeCode:id,
                   //  withdrawStat:state
                   // }
                   this.loading2=true
                       this.dataApi.ajax('examineCashChangeNew',{withdrawStat:state,cashChangeCodeList:[id]}, res => {
                        if (res.responseType === 'S') {
                             this.showMsg(type+'成功')
                              this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                    this.loading2=false
                }).catch(() => {
        
                });
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
            submit(){
                this.loading=true
                this.dataApi.ajax('editSysTextInfo',this.contentInfo, res => {
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功');
                              this.showEdit=true;
                              this.loading=false;
                              this.fetchPrivilege();
                        } 
                    });

                var dtos=[
                     {
                        sysCode:'MinimumFeeAmount',
                        sysKey:'MinimumFeeAmount',
                        sysValue:this.MinimumFeeAmount
                     },
                     {
                        sysCode:'MinimumFee',
                        sysKey:'MinimumFee',
                        sysValue:this.MinimumFee
                     },
                     {
                        sysCode:'TaxRate',
                        sysKey:'TaxRate',
                        sysValue:this.TaxRate
                     },
                     {
                        sysCode:'PresentCycle',
                        sysKey:'PresentCycle',
                        sysValue:this.PresentCycle
                     },
                     {
                        sysCode:'PurseSurplusValue',
                        sysKey:'PurseSurplusValue',
                        sysValue:this.PurseSurplusValue
                     }
                
                 ]
                
                 this.dataApi.ajax('batchEditSysParam',{dtos:JSON.stringify(dtos)}, res => {    
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功');
                              this.loading=false;
                              this.showEdit=true;
                              this.fetchArgument();

                        }
                 });
            },
            derive(){
               this.dialogVisible=true
               this.f={
                  startTime:'',
                  endTime:'',
                  withdrawStat:'',
                  start:'',
                  end:'',
                  userName:''
               }
            },
            deriveSubmit(){
                var startTime=''
                var endTime=''
                var start=''
                var end=''
                if (this.f.startTime && this.f.endTime) {
                    if (this.f.startTime>this.f.endTime) {
                         this.showMsg('开始时间不能大于结束时间','warning');
                         return;
                    }
                    startTime=dateFormat(this.f.startTime);
                    endTime=dateFormat(this.f.endTime);
                }
                if (this.f.startTime&&!this.f.endTime) {
                    this.showMsg('请选择结束时间','warning');
                    return;
                }
                if (!this.f.startTime&&this.f.endTime) {
                    this.showMsg('请选择开始时间','warning');
                    return;
                }

                if (this.f.start && this.f.end) { 
                    if (this.f.start>this.f.end) {
                         this.showMsg('开始时间不能大于结束时间','warning');
                         return;
                    }
                    start=dateFormat(this.f.start,'y-m-d');
                    end=dateFormat(this.f.end,'y-m-d');
                }
                if (this.f.start&&!this.f.end) {
                     this.showMsg('请选择结束时间','warning');
                     return;
                }
                if (!this.f.start&&this.f.end) {
                     this.showMsg('请选择开始时间','warning');
                    return;
                }

                location.href=encodeURI(encodeURI(HOST+"gateWay?trCode=withdrawExport&startTime="+startTime+'&endTime='+endTime+'&withdrawStat='+this.f.withdrawStat+'&arrivalDateStart='+start+'&arrivalDateEnd='+end+'&userName='+this.f.userName))

            },
            onSubmit(){
                this.loading=true;
                var dtos=[
                     {
                        sysCode:'OpeningTime',
                        sysKey:'OpeningTime',
                        sysValue:this.chineseToConvert(this.checkboxGroup.join(''))
                     }
                
                 ]
                 this.dataApi.ajax('batchEditSysParam',{dtos:JSON.stringify(dtos)}, res => {    
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功');
                              this.loading=false;
                              this.dialogVisible2=false;
                              this.fetchArgument();

                        }
                 }); 
            },
            handleCheckedCitiesChange(value) {
                let arr = []
                for (var i = this.arr.length - 1; i >= 0; i--) {
                    for (var j = this.checked.length - 1; j >= 0; j--) {
                        if (arr.indexOf(this.checked[j] === -1) && this.arr[i] === this.checked[j]) {
                            arr.push(this.checked[j])
                        }
                    }
                }
                let checkedCount = arr.length;
                this.checkAll = checkedCount === this.arr.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.arr.length;
            },
            handleCheckAllChange(event) {
                 
                if (event.target.checked == false) {
                    for (var i = this.arr.length - 1; i >= 0; i--) {
                        for (var j = this.checked.length - 1; j >= 0; j--) {
                            if (this.arr.indexOf(this.checked[j]) !== -1) {
                                this.checked.splice(j, 1)
                            }
                        }
                    }

                } else {
                    this.isIndeterminate = false;
                    for (var i = this.gridData.length - 1; i >= 0; i--) {
                        if (this.checked.indexOf(this.arr[i]) === -1) {
                            if (this.arr[i].withdrawStat==0 || this.arr[i].withdrawStat==3) {
                                 this.checked.push(this.arr[i])
                            }
                           
                        }
                    }
                }


            },
            deliver(){
                if (this.checked.length==0) {
                    this.showMsg('请选择需要通过的申请!','warning')
                    return;
                }
                if (this.checked.length>100) {
                    this.showMsg('单次审批数量不能超过100笔!','warning')
                    return;
                }
                this.$confirm('确定通过?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  var dtos=[]
                 
                   for (var i = this.checked.length - 1; i >= 0; i--) {

                       // var obj={
                       //    cashChangeCode:this.checked[i].cashChangeCode,
                       //    withdrawStat:'1'
                       // }                     
                       dtos.push(this.checked[i].cashChangeInfoCode)
                   }
                   this.loading2=true
                   this.dataApi.ajax('examineCashChangeNew',{cashChangeCodeList:dtos,withdrawStat:'1'}, res => {
                        if (res.responseType === 'S') {
                              this.showMsg('通过成功')
                              var arr=[]
                              for (var i = this.gridData.length - 1; i >= 0; i--) {
                                  if (this.gridData[i].withdrawStat==0) {
                                      arr.push(this.gridData[i])
                                  }
                              }
                              if (this.checked.length==arr.length) {
                                 this.pageInfo.pageNum=this.pageInfo.pageNum+1
                              }
                              this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                    this.loading2=false
                }).catch(() => {
        
                });
                
               
             
            },
            changeDate(){
                this.startTime1=""
                this.endTime1=""
                this.startTime2=""
                this.endTime2=""
            },
            refuse(){
                if (this.refuseInfo.cashChangeInfoCode!='') {
                   this.loading2=true
                       this.dataApi.ajax('examineCashChangeNew',{cashChangeCodeList:[this.refuseInfo.cashChangeInfoCode],withdrawStat:'2',refusal:this.refuseInfo.refusal}, res => {
                        if (res.responseType === 'S') {
                              this.showMsg('拒绝成功')
                              this.dialogVisible4=false
                              // var arr=[]
                              // for (var i = this.gridData.length - 1; i >= 0; i--) {
                              //     if (this.gridData[i].withdrawStat==0) {
                              //         arr.push(this.gridData[i])
                              //     }
                              // }
                              // if (this.checked.length==arr.length) {
                              //    this.pageInfo.pageNum=this.pageInfo.pageNum+1
                              // }
                              this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                    this.loading2=false 
                }else{
                   
                   var dtos=[]
                   for (var i = this.checked.length - 1; i >= 0; i--) {                   
                       dtos.push(this.checked[i].cashChangeInfoCode)
                   }
                   this.loading2=true
                       this.dataApi.ajax('examineCashChangeNew',{cashChangeCodeList:dtos,withdrawStat:'2',refusal:this.refuseInfo.refusal}, res => {
                        if (res.responseType === 'S') {
                              this.showMsg('批量拒绝成功')
                              this.dialogVisible4=false
                              var arr=[]
                              for (var i = this.gridData.length - 1; i >= 0; i--) {
                                  if (this.gridData[i].withdrawStat==0) {
                                      arr.push(this.gridData[i])
                                  }
                              }
                              if (this.checked.length==arr.length) {
                                 this.pageInfo.pageNum=this.pageInfo.pageNum+1
                              }
                              this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                    this.loading2=false
                }
                
            },
            refuseDilog(id){
                this.refuseInfo={
                    refusal:'',
                    cashChangeInfoCode:''
                }
                if (id=='all') {
                   if (this.checked.length==0) {
                    this.showMsg('请选择需要拒绝的申请!','warning')
                    return;
                  } 
                  if (this.checked.length>100) {
                      this.showMsg('单次审批数量不能超过100笔!','warning')
                  }
              }else{
                this.refuseInfo.cashChangeInfoCode=id
              }
               this.show=true
               this.dialogVisible4=true
            },
            statistics(){

                if (this.formInline.dateFlag=='1') {
                     if (this.startTime1 && this.endTime1) {
                    this.formInline.startTime=dateFormat(this.startTime1)
                    this.formInline.endTime=dateFormat(this.endTime1) 
                    if (this.formInline.startTime>this.formInline.endTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.startTime=''
                        this.formInline.endTime=''
                    }
                    if (this.startTime1&&!this.endTime1) {
                         this.$message({
                              type: 'warning',
                              message: '请选择结束时间'
                          });
                         return;
                    }
                    if (!this.startTime1&&this.endTime1) {
                         this.$message({
                              type: 'warning',
                              message: '请选择开始时间'
                          });
                         return;
                    }
                }
               if (this.formInline.dateFlag=='2') {
                     if (this.startTime2 && this.endTime2) {
                    this.formInline.arrivalDateStart=dateFormat(this.startTime2,'y-m-d')
                    this.formInline.arrivalDateEnd=dateFormat(this.endTime2,'y-m-d')
                    if (strToTime(this.startTime2)>strToTime(this.endTime2)) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.arrivalDateStart=''
                        this.formInline.arrivalDateEnd=''
                    }
                    if (this.startTime2&&!this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择结束时间'
                          });
                         return;
                    }
                    if (!this.startTime2&&this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择开始时间'
                          });
                         return;
                    }
                }
                if (this.formInline.dateFlag=='1') {
                   delete this.formInline.arrivalDateStart
                   delete this.formInline.arrivalDateEnd
                }
                if (this.formInline.dateFlag=='2') {
                   delete this.formInline.startTime
                   delete this.formInline.endTime
                }
                this.dataApi.ajax('sumWithdrawAccount',this.formInline, res => {
                        if (res.responseType === 'S') {
                             
                             if (res.number==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible3=true
                                 this.sumMap=res
                             }
                        }
                    });
            },
            changeWithdrawTime(){
                this.dialogVisible2=true
                this.checkboxGroup=this.OpeningTime.split(',')

            },
            convertToChinese(num){
                var N = [  
                        "零","星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];  
                var str = num.toString();  
                var len = num.toString().length;  
                var C_Num = [];  
                for(var i = 0; i < len; i++){  
                    C_Num.push(N[str.charAt(i)]);  
                }  
                return C_Num.join(',');  
            },
            chineseToConvert(str){
                 var arr = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
                 for (var i = 0; i < arr.length; i++) {
                    str = str.replace(new RegExp(arr[i], "g"), (i+1));
                 }
                 var reArr=str.split('')
                 var reStr=reArr.sort()
                 return reStr.join(','); 
            } 

        }
    }
</script>
