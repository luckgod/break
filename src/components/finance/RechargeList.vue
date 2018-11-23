<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item>
                                <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                    <el-option label="按用户ID" value="userId"></el-option>
                                    <el-option label="按用户名" value="userName"></el-option>
                                </el-select>
                                <el-input v-model="formInline.name" style="width: 150px;" :maxlength="256"></el-input>            
                        </el-form-item>
                        <el-form-item label="按充值类型:">
                               <el-select v-model="formInline.rechargeType"  style="width: 120px;">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option  label="支付宝" value="1"></el-option>
                                    <el-option  label="微信" value="2"></el-option>      
                                 </el-select>
                        </el-form-item>
                        <el-form-item label="按用途:">
                               <el-select v-model="formInline.purpose"  style="width: 120px;">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option  label="购买主城" value="1"></el-option>
                                    <el-option  label="支付红包" value="2"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData()">查询</el-button> 
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
            <el-table-column
                    prop="rechargeCode"
                    label="充值单号">
            </el-table-column>
            <el-table-column
                    label="用户名">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank"><span class="pointer">{{ scope.row.userName }}</span></router-link>
                    </template>
            </el-table-column>
             <el-table-column
                    prop="userId"
                    label="用户ID">
            </el-table-column>
            <el-table-column
                    prop="amt"
                    sortable='custom'
                    label="充值数值（元）">
                  <!--   <template scope="scope">
                        <span v-if="scope.row.rechargeType==1">{{ scope.row.amt}}</span>
                        <span v-else>{{ scope.row.amt/100}}</span>
                    </template> -->
            </el-table-column>
            <el-table-column
                    label="充值类型">
                    <template scope="scope">
                        <span>{{scope.row.rechargeType==1? '支付宝':'微信'}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="用途"
                    prop="purpose">
            </el-table-column>
            <el-table-column
                    width="170"
                    sortable='custom'
                    prop="T1.CRE_TIME"
                    label="时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column 
                    label="状态">
                    <template scope="scope">
                        <span>结算完成</span>
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
        <!--充值记录统计-->
        <el-dialog title="充值记录统计" v-model="dialogVisible">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px" >
                    <el-form-item>
                            <el-select v-model="formInline.type" style="width: 120px;" @change="changeType" :disabled="true">
                                <el-option label="按用户ID" value="userId"></el-option>
                                <el-option label="按用户名" value="userName"></el-option>
                            </el-select>
                            <el-input v-model="formInline.name" style="width: 150px;"  :disabled="true"></el-input>            
                    </el-form-item>
                    <el-form-item label="按充值类型:">
                           <el-select v-model="formInline.rechargeType"  style="width: 120px;" :disabled="true">
                                <el-option  label="全部" value=""></el-option>
                                <el-option  label="个人发红包" value="1"></el-option>
                                <el-option  label="购买城主" value="2"></el-option>      
                             </el-select>
                    </el-form-item>
                    <el-form-item label="按状态:">
                           <el-select v-model="formInline.rechargeStat"  style="width: 120px;" :disabled="true">
                                <el-option  label="全部" value=""></el-option>
                                <el-option  label="结算中" value="0"></el-option>
                                <el-option  label="结算完成" value="1"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="时间：">
                        <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                        到
                        <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                    </el-form-item>
             </el-form>
              <hr>
              <div class="sumMap">
                  <div class="sumMap_num">
                      {{ sumMap.sumAmt }}
                  </div>
                  <div>
                     金额
                  </div>
              </div>
               <div class="sumMap">
                  <div class="sumMap_num">
                       {{ sumMap.total }}
                  </div>
                  <div>
                     笔数
                  </div>
              </div>
        </el-dialog>

        <!--导出-->
        <el-dialog title="导出充值记录" v-model="dialogVisible2">
            <el-form label-width="120px">
                <el-form-item label="按时间:" >
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="f.startTime" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="f.endTime" style="width:180px;"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary"
                           @click="deriveSubmit" >导出</el-button>
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
                title: '用户列表',
                table_loading: false,
                formInline: {
                    userName:'',
                    userId:'',
                    pageNum: 1,
                    pageSize: 10,
                    type:'userName',
                    purpose:'',
                    rechargeType:'', 
                    sort:'T1.CRE_TIME',
                    desc:'DESC',
                    startTime:'',
                    endTime:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos: []
                },
                formLabelWidth: '120px',
                dialogVisible:false,
                sumMap:{},
                dialogVisible2:false,
                f:{
                  startTime:'',
                  endTime:''
                },
                startTime1:'',
                endTime1:'',
            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
  
        },
        methods: {

            fetchData (page = 1) {

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
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageUserRecharge', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val)
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
            changeType(){
                this.formInline.userName=''
                this.formInline.userId=''
            },
            statistics(){
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
                    this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectStatistics',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.total==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible=true
                                 this.sumMap=res
                             }
                        } 
                    });
            },
             derive(){
               this.dialogVisible2=true
               this.f={
                  startTime:'',
                  endTime:'',
               }
            },
            deriveSubmit(){
                var startTime=''
                var endTime=''
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

                location.href=encodeURI(encodeURI(HOST+"gateWay?trCode=reportUserRecharge&startTime="+startTime+'&endTime='+endTime))
            },

        }
    }
</script>
