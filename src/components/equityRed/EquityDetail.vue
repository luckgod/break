<template>
    <div class="admin-home" style="padding-top: 20px;">
                <el-button  @click="goBack()" type="primary" >返回</el-button> 
                <br>
                <div class="radius" style="text-align:left;">
                     
                     <div style="display:inline-block;width: 40%">
                        <el-form :model="basicForm" :inline="false" label-width="110px">
                                <h3 style="padding-bottom: 20px">股权红包详情</h3>
                                <el-form-item label="股权红包信息："  class="no_bottom">
                                  <span>共{{ basicForm.totalAmount }}股份,已领取{{ basicForm.receverNum }}/{{ basicForm.totalNumber }}<br>待领取股权{{ basicForm.noUserAmt }}股</span>
                                </el-form-item>
                                <el-form-item label="红包发送范围："   class="no_bottom">
                                  <span>{{ basicForm.detailedArea }}</span>
                                </el-form-item>
                                
                         </el-form>
                    </div>
                    <div style="display:inline-block;width:48%;vertical-align: top;margin-top: 43px">
                        <el-form :model="basicForm" :inline="false" label-width="180px">
                                <el-form-item label="发放时间："   class="no_bottom">
                                   <span>{{ basicForm.distributeTime}}</span>
                                </el-form-item>
                                <el-form-item label="过期时间："   class="no_bottom">
                                   <span>{{ basicForm.expriTime}}</span>
                                </el-form-item>
                                <el-form-item label="过期股数："  class="no_bottom">
                                   <span>{{ basicForm.visibleFlag=='2'? basicForm.noUserAmt:'0'}}</span>
                                </el-form-item>                   
                         </el-form>

                    </div>   
                </div>


                <h3>领取详情</h3>
                <!--领取详情table-->
                <el-table 
                      :data="pageInfo.dtos"
                      v-loading="table_loading"
                      element-table_loading-text="加载中"
                      stripe
                      @sort-change='order'
                      style="width: 100%p;margin-top: 20px;"
                      v-show="activeName==1">
                  <el-table-column
                    type="index"
                    width="50">
                  </el-table-column>
                  <el-table-column
                          prop="receiveUser"
                          label="用户ID">
                  </el-table-column>
                  <el-table-column
                          prop="receiveUserName"
                          label="领取用户">
                  </el-table-column>
                  <el-table-column
                          prop="amount"
                          sortable='custom'
                          label="领取股权">
                          <template scope="scope">
                               <span>{{ cutNum(scope.row.amount,4) }}</span>
                          </template>
                  </el-table-column>
                  <el-table-column
                          prop="receive_Time"
                          sortable='custom'
                          label="领取时间">
                          <template scope="scope">
                              <span>{{ scope.row.receiveTime }}</span>
                          </template>
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
                          :total="pageInfo.count"
                          >
                  </el-pagination>
              </div>
               <!--领取详情table结束-->

            
                
    </div>
</template>
<style> 
.summarize{
  display:inline-block;
  text-align: right;
  font-size: 20px;
  margin-right: 30px;
}
.summarize div{
  padding:5px 0;
}
.summarize_input{
   display:inline-block;
}
.summarize_input div{
  padding:5px 0;
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
    export default{
        data(){
            return{
                account:'系统管理员',
                activeName: '1',
                table_loading:false,
                basicForm:{
                  enveImageAddress:[],
                  enveContent:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth:'150px',
                formInline:{},
                urgentList:[{ text: '系统红包', value: '0' },{ text: '个人普通红包', value: '1' },{ text: '个人大红包', value: '2' },{ text: '个人加密红包', value: '3' }],
                areaList:[{ text: '全国', value: '4' },{ text: '市', value: '3' },{ text: '区', value: '2' }],
                sort:'T1.RECEIVE_TIME',
                desc:'DESC',
                changeDate:'',
                showEdit:false,
                tableData:[]
            }
        },
        created() {
           this.fetchData();
           this.fetchList(this.pageInfo.pageNum);
        },
        methods: {
            fetchData () {
                
                 this.dataApi.ajax('selectShareEnve',{perEnveCode:this.$route.params.id}, res => {
                        if (res.responseType === 'S') {
                            this.basicForm=res
                        }
                 });
            },
            fetchList(page=1){
              this.pageInfo.pageNum=page
              this.table_loading = true;
              this.dataApi.ajax('selectReceiveShare',{pageNum:this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize,sort:this.sort,desc:this.desc,enveCode:this.$route.params.id}, res => {    
                      if (res.responseType === 'S') {
                          this.table_loading = false;
                          this.pageInfo=res
                      }
               });
                
            },
            handleClick(tab, event) {
                this.sort='T1.CRE_TIME'
                if (this.activeName=='1') {
                   this.fetchList(1)
                }
                if (this.activeName=='2') {
                   this.fetchList(1)
                }
                if (this.activeName=='3') {
                   this.fetchList(1)
                }
                if (this.activeName=='4') {
                   this.fetchList(1)
                }

            },
            order(column){
                if (!column.order) {
                    return;
                }
                 if (column.order=='ascending') {
                     this.desc='ASC'
                }else{
                    this.desc='DESC'
                }
                this.sort=column.prop.toUpperCase()
                this.fetchList(this.pageInfo.pageNum)
            },
            deleteById(id){

                this.$confirm('确定删除?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.dataApi.ajax('delUserLeaving',{leavingCode:id}, res => {
                        this.table_loading = false;
                        if (res.responseType === 'S') {
                           this.showMsg('删除成功')
                           this.fetchList(this.pageInfo.pageNum)
                        }
                    });
                  
                }).catch(() => {
                          
                });
            },
            handleCurrentChange(val) {
               this.fetchList(val)            
            }
        }
    }
</script>
