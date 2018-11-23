<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-button type="primary" @click="edit('add')">新增</el-button>
                    <el-form-item label="按名称：">
                        <el-col :span="18">
                            <el-input v-model="formInline.noticeTitle"></el-input>
                        </el-col>
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
                style="width: 100%">

            <el-table-column
                    prop="noticeCode"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="noticeTitle"
                    label="公告名称">
            </el-table-column>
            <el-table-column
                    prop="secTitle"
                    label="副标题">
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button
                            size="small"
                            type="success" @click="handleSend(scope.row)">推送
                    </el-button>
                    <el-button
                            size="small"
                            type="primary" @click="edit(scope.row.noticeCode)">编辑
                    </el-button>
                    <el-button
                            size="small"
                            type="danger" @click="handleDelete(scope.row.noticeCode)">删除
                    </el-button>
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
    .type {
        font-size: 17px;
        margin-top: 30px;
        color: #5E5E5E;
    }

    .type span {
        width: auto;
        display: inline-block;
        height: 35px;
        margin-right: 30px;
    }

    .choosed {
        border-bottom: 3px solid #20A0FF;
        font-weight: bold;
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
                    pageSize: 10,
                    sort:'CRE_TIME',
                    desc:'DESC',
                    noticeTitle:''
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
            this.fetchData(this.pageInfo.pageNum);
        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.dataApi.ajax('selectPageSysNotice', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            handleDelete(id) {
                this.confirmDel(() => {
                    this.dataApi.ajax('delSysNotice', {noticeCode: id}, res => {
                        //console.log(res)
                        if (res.responseType === 'S') {
                            this.showMsg('删除成功')
                            this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                })
            },
            edit(id){
                this.$router.push('/official/annoumcement_detail/' + id)
            },
            handleSend(item) {
                this.$confirm('确定推送给所有用户?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     // content = content.replace(/(\n)/g, "");  
                     // content = content.replace(/(\t)/g, "");  
                     // content = content.replace(/(\r)/g, "");  
                     // content = content.replace(/<\/?[^>]*>/g, "");   
                     // content = content.replace(/\s*/g, "");  
                   this.dataApi.ajax('pushAll', {message:item.secTitle,title:item.noticeTitle}, res => {
                        //console.log(res)
                        if (res.responseType === 'S') {
                            this.showMsg('推送成功')
                            this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                }).catch(() => {
                           
                });
            },

        }
    }
</script>
