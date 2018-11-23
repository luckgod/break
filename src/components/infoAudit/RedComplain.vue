<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="110px">
                        <el-form-item label="发起举报用户:">
                             <el-input v-model="formInline.userName" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="举报内容：">
                            <el-select v-model="formInline.reportSysKey" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.dicValue" :value="item.dicCode"  v-for="item in contentList"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="状态：">
                            <el-select v-model="formInline.reportStat" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="待处理" value="1"></el-option>
                                <el-option label="已处理" value="2"></el-option>
                            </el-select>
                        </el-form-item>                 
                        <el-form-item label="举报时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
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
                    prop="enveCode"
                    label="红包编号">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="发起举报用户">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank" ><span class="pointer">{{ scope.row.userName }}</span></router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="reportValue"
                    label="举报内容">
            </el-table-column>
            <el-table-column
                    prop="cre_time"
                    sortable='custom'
                    label="举报时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="发红包用户">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.distributeUser" target="_blank" ><span class="pointer">{{ scope.row.distributeName }}</span></router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="distribute_Time"
                    label="发放时间">
                <template scope="scope">
                    <span>{{scope.row.distributeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="total_Amount"
                    label="红包金额（元）">
                    <template scope="scope">
                        <span>{{scope.row.totalAmount}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="enveRange"
                    label="红包范围">
                    <template scope="scope">
                        <span>{{findState(scope.row.enveRange,areaList)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="红包状态">
                    <template scope="scope">
                        <span>{{ findState(scope.row.visibleFlag,enableStateArr) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="投诉状态">
                    <template scope="scope">
                        <span>{{ scope.row.reportStat==1? '待处理':'已处理' }}</span>
                    </template>
            </el-table-column>
            <el-table-column label="红包详情">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row.enveCode)">查看</el-button>
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
                    sort:'T1.CRE_TIME',
                    desc:'desc',
                    startTime:'',
                    endTime:'',
                    pageSize:10,
                    userName:'',
                    reportSysKey:'',
                    visibleFlag:'',
                    reportStat:''
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
                enableStateArr: [{ text: '领取完', value: '0' },{ text: '未领取完', value: '1' },{ text: '已过期', value: '2' },{ text: '过期退款中', value: '3' },{ text: '过期退款失败', value: '4' }],
                startTime1:'',
                endTime1:'',
                dialogVisible:false,
                sumMap:{},
                contentList:[]
            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchList()
  
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
                this.dataApi.ajax('selectPageUserReport',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
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
            fetchList() {
                this.dataApi.ajax('selectSysDictionary',{parentCode:'af7952f335a74e3baf63d77fd03f3441'}, res => {
                    if (res.responseType === 'S') {
                         this.contentList=res.dtos
                    }
                });

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
