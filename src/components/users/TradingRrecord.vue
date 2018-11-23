<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-button  @click="goBack()" type="primary" >返回</el-button>
            </el-col>
        </el-row>

       <el-table
                :data="pageInfo.rows"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%">
            <el-table-column
                    sortable='custom'
                    label="交易时间">
                <template scope="scope">
                    <span>{{dateFormat(scope.row.crtTime)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="140"
                    label="买家">
                    <template scope="scope">
                       <span  class="pointer" @click="$router.push('/user/user_detail/'+scope.row.userId)">{{ scope.row.phone }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    width="140"
                    label="卖家">
                    <template scope="scope">
                       <span  class="pointer" @click="$router.push('/user/user_detail/'+scope.row.userId)">{{ scope.row.phone }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="原价（元）">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="现价（元）">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="溢价金额（元）">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="上任城主赚取金额（元）">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="平台收益">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="当前价（下一手价）（元）">
            </el-table-column>
        </el-table>
        <div class="paginate">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.pageNo"
                    :page-size="pageInfo.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pageInfo.totalRows">
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
                    userName: '',
                    phone: '',
                    pageNo: '',
                    type:'phone',
                    userId:'',
                    identity:'',
                    sort:'CRT_TIME',
                    desc:'ASC'
                },
                pageInfo: {
                    pageNo: 1,
                    pageSize: 1,
                    totalRows: 1,
                    rows: []
                },
                formLabelWidth: '120px'

            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNo);
        },
        methods: {

            fetchData (page = 1) {
                
                this.table_loading = true;
                this.pageInfo.pageNo = page
                this.formInline.pageNo = page
                this.formInline[this.formInline.type]=this.formInline.name
                this.formInline.userId=this.$route.params.id
                this.dataApi.ajax('queryByPage',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res.page
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            order(column){
                if (!column.order) {
                    return;
                }partner
                 if (column.order=='ascending') {
                     this.formInline.desc='ASC'
                }else{
                    this.formInline.desc='DESC'
                }
                this.formInline.sort=column.prop.toUpperCase()
                this.fetchData(this.pageInfo.pageNo)
            }

        }
    }
</script>
