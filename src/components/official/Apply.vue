<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                 <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item  label="状态：" label-width="80px">
                        <el-select v-model="formInline.stat" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="待处理" value="1"></el-option>
                                <el-option label="已处理" value="2"></el-option>
                         </el-select>
                     </el-form-item >
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
                    prop="userName"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    label="注册手机号"
                    prop="phone">
            </el-table-column>
            <el-table-column
                    label="客户姓名"
                    prop="enrollName">
            </el-table-column>
            <el-table-column
                    label="联系方式"
                    prop="enrollPhone">
            </el-table-column>
            <el-table-column
                    label="报名时间"
                    prop="creTime">
            </el-table-column>
            <el-table-column
                    label="操作"
                    prop="creTime">
                    <template scope="scope">
                        <el-button type="warning" size="small" @click="deal(scope.row.enrollId)" v-if="scope.row.stat==1">待处理</el-button>
                        <el-button type="success" size="small" v-else>已处理</el-button>
                    </template>
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
                    pageNum:1,
                    pageSize: 10,
                    stat:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
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
                this.dataApi.ajax('selectPageUserAgentEnroll', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            changeType(){
                this.formInline.userName=''
                this.formInline.userId=''
                this.formInline.phone=''
            },
            handleCurrentChange(val) {
               this.fetchData(val)            
            },
            deal(id) {
                  this.$confirm('确定处理?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.dataApi.ajax('editUserAgentEnroll',{enrollId:id}, res => {
                        this.table_loading = false;
                        if (res.responseType === 'S') {
                           this.showMsg('处理成功')
                           this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                  
                }).catch(() => {
                          
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
            }

        }
    }
</script>
