<template>
    <div class="admin-home" style="padding-top: 20px;">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="领取用户：">
                             <el-input v-model="formInline.receiveUserName" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="领取时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData()">查询</el-button> 
                        <el-button type="primary" @click="statistics()">统计</el-button>
                </el-form>
                <el-table
                    :data="pageInfo.dtos"
                    v-loading="table_loading"
                    element-table_loading-text="加载中"
                    stripe
                    @sort-change='order'
                    style="width: 100%">
                <el-table-column
                        prop="enveCode"
                        label="股权红包编号">
                </el-table-column>
                <el-table-column
                        prop="receiveUserName"
                        label="领取用户">
                </el-table-column>
                <el-table-column
                        sortable='custom'
                        prop='distribute_Time'
                        label="股权发放时间">
                        <template scope="scope">
                            <span>{{scope.row.distributeTime}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        sortable='custom'
                        prop='receive_Time'
                        label="领取时间">
                        <template scope="scope">
                            <span>{{scope.row.receiveTime}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="companyName"
                        label="所属公司">
                </el-table-column>
                <el-table-column
                        prop="amount"
                        label="领取股权">
                        <template scope="scope">
                            <span>{{cutNum(scope.row.amount,4)}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="detailedArea"
                        label="股权红包范围">
                </el-table-column>
                <el-table-column
                        prop="receiveDetailedArea"
                        label="领取地址">
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
            
            <!--红包领取记录统计-->
            <el-dialog title="红包领取记录统计" v-model="dialogVisible3">
            <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="领取用户：">
                       <el-input v-model="formInline.receiveUserName" style="width: 150px;" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="领取时间：">
                      <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                      到
                      <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                  </el-form-item>

              </el-form>
              <hr>
              <div class="sumMap">
                  <div class="sumMap_num">
                      {{ cutNum(sumMap.totalAmt,4) }}
                  </div>
                  <div>
                     领取股权总数
                  </div>
              </div>
               <div class="sumMap">
                  <div class="sumMap_num">
                       {{ sumMap.totalNumber }}
                  </div>
                  <div>
                     领取个数
                  </div>
              </div>
          </el-dialog>
                
    </div>
</template>
<style> 

.el-tabs__item{
     font-size:18px !important;
     font-weight: bold;
}
.el-tabs__header{
  border-bottom:none;
}
.red_setting_h4{
  display: inline-block;
  vertical-align: top;
  font-weight: bold;
  margin-right: 40px;
  margin-top: 20px;
}
.allot_time>div{
  margin-bottom: 20px;
  font-size:15px;
}
.allot_time{
  font-size: 15px;
  text-align: center;
}
</style>
<script>
    export default{
        data(){
            return{
                table_loading:false,
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                loading:false,
                formInline: {
                    pageNum:'',
                    sort:'RECEIVE_TIME',
                    desc:'desc',
                    beginTime:'',
                    endTime:'',
                    pageSize:10,
                    receiveUserName:'',
                },
                urgentList:[{ text: '系统红包', value: '0' },{ text: '个人普通红包', value: '1' },{ text: '个人大红包', value: '2' },{ text: '个人加密红包', value: '3' }],
                areaList:[{ text: '全国', value: '0' },{ text: '1km', value: '1' },{ text: '区', value: '2' },{ text: '市', value: '3' }],
                 dialogVisible3:false,
                 dialogVisible:false,
                 startTime1:'',
                 endTime1:'',
                 sumMap:{
                   totalAmt:0,
                   totalNumber:0
                 }
            }
        },
        created() {

        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
  
        },
        methods: {
           fetchData (page = 1) {
                    if (this.startTime1 && this.endTime1) {
                       this.formInline.beginTime=dateFormat(this.startTime1)
                       this.formInline.endTime=dateFormat(this.endTime1) 
                    if (this.formInline.beginTime>this.formInline.endTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.beginTime=''
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
                this.dataApi.ajax('selectReceiveShare',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
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
            statistics(){   //统计

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
                this.dataApi.ajax('countReceiveShare',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.countEnve==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible3=true
                                 this.sumMap=res
                             }
                        } 
                    });
            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            detail(id){
              this.$router.push('/user/red_detail/'+id)
            }

        }
    }
</script>
