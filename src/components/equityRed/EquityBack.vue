<template>
    <div class="admin-home" style="padding-top: 20px;">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item>
                            <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                <el-option label="用户名" value="userName"></el-option>
                                <el-option label="用户ID" value="userId"></el-option>
                                <el-option label="手机号" value="phone"></el-option>
                            </el-select>
                            <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="公司筛选：">
                            <el-input v-model="formInline.companyName" style="width: 150px;"></el-input>
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
                        prop="creTime"
                        label="回购时间">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号">
                </el-table-column>
                <el-table-column
                        prop="companyName"
                        label="所属公司">
                </el-table-column>
                <el-table-column
                        prop="buyShare"
                        label="回购股权">
                        <template scope="scope">
                            <span>{{ cutNum(scope.row.buyShare,4) }}</span>
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
            
            <!--红包领取记录统计-->
            <el-dialog title="回购记录统计" v-model="dialogVisible3">
            <el-form :inline="true" class="demo-form-inline">
                  <el-form-item>
                      <el-select v-model="formInline.type" style="width: 120px;" @change="changeType" :disabled="true">
                          <el-option label="用户名" value="userName"></el-option>
                          <el-option label="用户ID" value="userId"></el-option>
                          <el-option label="手机号" value="phone"></el-option>
                      </el-select>
                      <el-input v-model="formInline.name" style="width: 150px;" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="公司筛选：">
                      <el-input v-model="formInline.companyName" style="width: 150px;" :disabled="true"></el-input>
                  </el-form-item>

              </el-form>
              <hr>
              <div class="sumMap">
                  <div class="sumMap_num">
                      {{ cutNum(sumMap.totalAmt,4) }}
                  </div>
                  <div>
                     回购股权总数
                  </div>
              </div>
               <div class="sumMap">
                  <div class="sumMap_num">
                       {{ sumMap.totalNumber }}
                  </div>
                  <div>
                     回购个数
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
                    sort:'CRE_TIME',
                    desc:'desc',
                    pageSize:10,
                    userId:'',
                    userName:'',
                    phone:'',
                    type:'userName',
                    name:'',
                    companyName:''
                },
                urgentList:[{ text: '系统红包', value: '0' },{ text: '个人普通红包', value: '1' },{ text: '个人大红包', value: '2' },{ text: '个人加密红包', value: '3' }],
                areaList:[{ text: '全国', value: '0' },{ text: '1km', value: '1' },{ text: '区', value: '2' },{ text: '市', value: '3' }],
                 dialogVisible3:false,
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
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type] = this.formInline.name
                this.dataApi.ajax('selectBuyShare',this.formInline, res => {
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
            statistics(){   
                //统计
                this.formInline[this.formInline.type] = this.formInline.name
                this.dataApi.ajax('countBuyShare',this.formInline, res => {
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
            changeType(){
                this.formInline.userId=''
                this.formInline.phone=''
                this.formInline.userName=''
            },

        }
    }
</script>
