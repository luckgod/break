<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="">
                             <el-select v-model="formInline.type" style="width: 110px;" @change="changeType">
                                  <el-option label="用户名" value="userName"></el-option>
                                  <el-option label="用户账号" value="phone"></el-option>
                              </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-select v-model="formInline.reportStat" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="待处理" value="1"></el-option>
                                <el-option label="已处理" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="纠错内容：">
                            <el-select v-model="formInline.reportSysKey" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.dicValue" :value="item.dicCode" v-for="item in contentList"></el-option>
                            </el-select>
                        </el-form-item>                       
                        <el-button type="primary" @click="fetchData(1)">查询</el-button>
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
                    prop="phone"
                    label="用户账号">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="用户名">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank" ><span class="pointer">{{ scope.row.userName }}</span></router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="reportValue"
                    label="纠错内容">
            </el-table-column>
            <el-table-column
                    prop="storeName"
                    label="纠错商家">
            </el-table-column>
            <el-table-column
                    prop="storePhone"
                    label="商家注册号">
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="cre_Time"
                    label="提交时间">
                <template scope="scope">
                    <span>{{scope.row.creTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="状态">
                    <template scope="scope">
                        <span>{{ scope.row.reportStat==1? '待处理':'已处理' }}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="warning" size="small" v-if="scope.row.reportStat==1" @click="check(scope.row.reportId)">待处理</el-button>
                    <el-button type="success" size="small" v-else>处理完成</el-button>
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
                    pageNum:'',
                    sort:'CRE_TIME',
                    desc:'desc',
                    pageSize:10,
                    type:'userName',
                    name:'',
                    reportStat:'',
                    reportSysKey:''

                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                urgentList:[{ text: '系统红包', value: '系统红包' },{ text: '个人红包', value: '个人红包' },{ text: '个人加密红包', value: '个人加密红包' }],
                areaList:[{ text: '全国', value: '0' },{ text: '1km', value: '1' },{ text: '区', value: '2' },{ text: '市', value: '3' }],
                enableStateArr: [{ text: '领取完', value: '0' },{ text: '未领取完', value: '1' },{ text: '已过期', value: '2' }],
                startTime1:'',
                endTime1:'',
                dialogVisible:false,
                contentList:[]
            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchList();
  
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
                this.formInline[this.formInline.type] = this.formInline.name
                this.dataApi.ajax('selectPageStoreReport',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            fetchList() {
                this.dataApi.ajax('selectSysDictionary',{parentCode:'8a444edd735b409397b81e01e9d1f897'}, res => {
                    if (res.responseType === 'S') {
                         this.contentList=res.dtos
                    }
                });

            },
            edit(id){
               this.$router.push('/user/red_detail/'+id)
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
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            changeType(){
                this.formInline.userName=''
                this.formInline.phone=''
            },
            check(id){
                this.$confirm('确定已处理?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                       this.dataApi.ajax('editUserReport',{reportId:id,reportStat:2}, res => {
                        if (res.responseType === 'S') {
                             this.showMsg('处理成功')
                              this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                }).catch(() => {
        
                });
            },

        }
    }
</script>
