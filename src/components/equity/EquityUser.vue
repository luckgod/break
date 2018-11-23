<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="用户名" value="userName"></el-option>
                            <el-option label="用户ID" value="userId"></el-option>
                            <el-option label="手机号" value="phone"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;"></el-input>
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
                    prop="userId"
                    label="用户ID">
            </el-table-column>
            <el-table-column
                    label="用户名"
                    prop="userName">
            </el-table-column>
            <el-table-column
                    label="手机号">
                    <template scope="scope">
                       <span>{{ scope.row.phone }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="当前持有股权总数(股)"
                    sortable='custom'
                    prop="T2.total_Share">
                    <template scope="scope">
                        <span>{{ cutNum(scope.row.totalShare,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="已回购股权(股)"
                    sortable='custom'
                    prop="T2.buy_Back_Share">
                    <template scope="scope">
                        <span>{{ cutNum(scope.row.buyBackShare,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="190">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="$router.push('/equity/equity_detail/'+scope.row.userId)">股权详情
                    </el-button>
                    <el-button type="primary" size="small" @click="$router.push('/equity/buyback/'+scope.row.userId)">回购记录
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
                    type: 'userName',
                    userName:'',
                    phone:'',
                    userIdentity:'',
                    name:'',
                    userStat:'',
                    sort:'CRE_TIME',
                    desc:'DESC',
                    pageNum:1,
                    pageSize: 10
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
        watch:{
            'formInline.name'(val,oldVal) {
                //console.log(val)
                this.formInline[this.formInline.type] = this.formInline.name
            }
        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectShareUser', this.formInline, res => {
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
            quxiao(id, type) {
                    var state=''
                    if (type=='启用') {
                        state=1
                    }else{
                        state=2
                    }
                  this.$confirm('确定'+type+'?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.dataApi.ajax('editUser',{userId:id,userStat:state}, res => {
                        this.table_loading = false;
                        if (res.responseType === 'S') {
                           this.showMsg(type+'成功')
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
