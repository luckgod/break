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
                    prop="userName"
                    label="用户名">
                    <template scope="scope">
                       <span  class="pointer" @click="$router.push('/user/user_detail/'+scope.row.sourceId)">{{ scope.row.userName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="注册手机号">
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="bind_Time"
                    label="邀请时间">
                    <template scope="scope">
                        <span>{{scope.row.bindTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="changeValue"
                    label="贡献总股数">
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
                    type: 'userName',
                    userName:'',
                    userIdentity:'',
                    name:'',
                    userStat:'',
                    sort:'BIND_TIME',
                    desc:'DESC',
                    pageNum:1,
                    pageSize: 10,
                    userId:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                arr: [{text:'手机号',value:'手机号'},{text:'用户名',value:'用户名'},{text:'用户ID',value:'用户ID'}],
                identityArray: [{text:'城主',value:'2'},{text:'平民',value:'1'}]

            }
        },
        created(){
        
        },
        activated() {
            this.formInline.userId=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
        },
        methods: {

            fetchData (page = 1) {
  
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('queryBySouceId', this.formInline, res => {
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
                this.formInline.sort=column.prop.toUpperCase()
                this.fetchData(this.pageInfo.pageNum)
            }

        }
    }
</script>
