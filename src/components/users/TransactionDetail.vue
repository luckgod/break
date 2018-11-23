<template>
    <div class="customer">
        <el-row :span="24" style="margin:26px 0;">
             <el-button  @click="$router.push('/user/user_list')" type="primary" >返回</el-button>            
        </el-row>
        <div class="padding_bg">
        <div  class="type_list">
                 <span style="cursor: pointer" @click="$router.replace('/user/user_detail/'+$route.params.id)">用户资料</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/treasure_record/'+$route.params.id)">财富记录</span>
                 <span class="choosed">交易明细</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/receive_record/'+$route.params.id)">领取红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/send_detail/'+$route.params.id)">发送红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/agency/'+$route.params.id)">代理记录</span>
        </div> 
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="按交易类型：">
                            <el-select v-model="formInline.richChangeType" style="width: 150px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in urgentList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="交易时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData()">查询</el-button> 
                        <el-button type="primary" @click="statistics()">统计</el-button>
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
                    sortable='custom'
                    prop="cre_Time"
                    label="交易时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="交易类型">
                    <template scope="scope">
                        <span>{{findData(scope.row.richChangeType)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="preChangeValue"
                    label="变动前股数">
            </el-table-column>
            <el-table-column
                    prop="changeValue"
                    label="变动股数">
            </el-table-column>
            <el-table-column
                    prop="after_Change_Value"
                    sortable='custom'
                    label="变动后股数">
                    <template scope="scope">
                        <span>{{ scope.row.afterChangeValue }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="变动红包股价值（元）">
                    <template scope="scope">
                        <span>{{ cutNum(scope.row.redEnvelopesValue*scope.row.changeValue,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="serialNumber"
                    label="流水号">
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


        <!--交易明细统计-->
            <el-dialog title="交易明细统计" v-model="dialogVisible">
                <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="交易类型：">
                            <el-select v-model="formInline.richChangeType" style="width: 140px;" :disabled="true">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in urgentList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="交易时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                        </el-form-item>
                </el-form>
                <hr>
                <div class="sumMap">
                    <div class="sumMap_num">
                        {{ sumMap.redEnvelopesValue }}
                    </div>
                    <div>
                       红包股数
                    </div>
                </div>
                 <div class="sumMap">
                    <div class="sumMap_num">
                         {{ sumMap.transactionNumber }}
                    </div>
                    <div>
                       累计交易条数
                    </div>
                </div>
                 <div class="sumMap">
                    <div class="sumMap_num">
                         {{ cutNum(sumMap.redValue,4) }}
                    </div>
                    <div>
                       红包股价值
                    </div>
                </div>
                 <div class="sumMap">
                    <div class="sumMap_num">
                         {{ sumMap.sharePrices }}
                    </div>
                    <div>
                       当前红包股价
                    </div>
                </div>
            </el-dialog>
    </div>

</template>
<style>
.sumMap{
    width:49%;
    display: inline-block;
    text-align: center;
    font-size: 20px;
}
.sumMap_num{
    font-weight: bold;
    font-size: 25px
}
</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                formInline: {
                    pageNum:1,
                    sort:'CRE_TIME',
                    desc:'desc',
                    startTime:'',
                    endTime:'',
                    pageSize:10,
                    richChangeType:'',
                    type:'userName',
                    name:'',
                    userId:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                urgentList:[{ text: '城主主城收益', value: '1' },{ text: '领取红包', value: '2' },{ text: '邀请奖励', value: '3' },{ text: '提现', value: '4' },{ text: '提现手续费', value: '5' },{ text: '主城转让收益', value: '7' },{ text: '城主返还本金', value: '8' }],
                enableStateArr: ['审核中', '已通过', '已拒绝','已挂起'],
                dialogVisible:false,
                startTime1:'',
                endTime1:'',
                sumMap:{
                  redValue:''
                }
            }
        },
        created(){
        
        },
        activated() {
            this.formInline.userId=this.$route.params.id
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
                this.formInline[this.formInline.type] = this.formInline.name
                this.dataApi.ajax('selectRich',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            edit(id){
               this.$router.push('/user/cash_detail/'+id)
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
                 this.dataApi.ajax('countStock',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.transactionNumber==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible=true
                                 this.sumMap=res
                             }
                        } 
                    });
            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            findData(type){
                    for (var i = this.urgentList.length - 1; i >= 0; i--) {
                        if (type==this.urgentList[i].value) {
                            return this.urgentList[i].text
                        }
                    }
            },
            changeType(){
                this.formInline.userName=''
                this.formInline.sourceUserName=''
            },
            

        }
    }
</script>
