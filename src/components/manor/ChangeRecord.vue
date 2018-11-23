<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <h3><el-button type="primary" @click="goBack()">返回</el-button>&nbsp;&nbsp;{{ areaTitle }}状态变更记录</h3>
                </el-form>
            </el-col>
        </el-row>

        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="userId"
                    label="用户ID">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="操作员">
            </el-table-column>
            <el-table-column
                    prop="changeComment"
                    label="变更状态">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="变更时间">
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
                loading:false,
                dialogVisible2:false,
                formInline: {
                    pageNum:'',
                    sort:'CRE_TIME',
                    desc:'desc',
                    pageSize:10,
                    cityNum:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos: []
                },
                info:{
                    agentPrice:'',
                    startTime:'',
                    endTime:'',
                    recordId:'',
                    cityName:''
                },
                formLabelWidth: '120px',
                startTime1:'',
                endTime1:'',
                areaTitle:''
            }
        },
        created(){
            let urlPram = getRequestParam(location.hash)
            // this.id = urlPram.id
            this.areaTitle = decodeURI(urlPram.cityName)
            this.formInline.cityCode=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
        },
        methods: {

            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.dataApi.ajax('selectPageCityEditRecord',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val)
            }

        }
    }
</script>
