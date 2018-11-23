<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-button  @click="goBack()" type="primary" >返回</el-button>
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
                    prop="userEnveCode"
                    label="红包编号">
            </el-table-column>
            <el-table-column
                    prop="quantityOfShares"
                    label="红包股数">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="红包股价值">
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

</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                formInline: {
                    pageNum: '',
                    sort:'T1.CRE_TIME',
                    desc:'DESC',
                    pageSize: 10,
                    receiveUser:'',
                    distributeUser:'0',
                    receiveFlag:'0'
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos: []
                },
                formLabelWidth: '120px'

            }
        },
        created(){
        
        },
        activated() {
            this.formInline.receiveUser=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
        },
        methods: {

            fetchData (page = 1) {
                
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = page             
                this.dataApi.ajax('selectPageSysEnve',this.formInline, res => {
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
                 this.fetchData(this.pageInfo.pageNum)
            }

        }
    }
</script>
