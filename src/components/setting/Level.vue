<template>
    <div class="account">
        <el-row :span="24" style="margin:26px 0;">
            <el-button  @click="add()" type="primary" class="el-icon-plus" v-if="powerShow('编辑和删除权限组信息')"> 新增</el-button>
        </el-row>
        <el-table
                v-loading="table_loading"
                element-table_loading-text="加载中"
                :data="pageInfo.dtos"
                stripe
                @sort-change='order'
                style="width: 100%">
            <el-table-column
                    prop="powerName"
                    label="权限组名称">
            </el-table-column>
            <el-table-column
                    prop="powerDescript"
                    label="说明">
            </el-table-column>
            <el-table-column
                    prop="cre_Time"
                    sortable='custom'
                    label="时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="150" v-if="powerShow('编辑和删除权限组信息')">
                <template scope="scope" >
                    <div>
                        <el-button
                            size="small"
                            type="primary"
                            @click="edit(scope.row)">编辑</el-button>
                       <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.row.powerCode)">删除</el-button>
                    </div>
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
    .account .el-dialog--small {
        width: 35%;
    }
</style>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                loading:false,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                formInline:{},
                pageInfo: {
                    pageNum:1,
                    pageSize:10,
                    count: 1,
                    dtos:[]
                },
                ruleForm: {
                    group_id:'',
                    menuName:'',
                    descript: '',
                    menuId:[],
                    selectKeys:[]
                },
                defaultProps: {
                    children: 'childrens',
                    label: 'label'
                },
                group_menu:[],
                sort:'CRE_TIME',
                desc:'DESC'
            }
        },
        created(){
           
        },
        activated() {
             this.fetchData(this.pageInfo.pageNum)
        },
        mounted(){

        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.dataApi.ajax('selectPagePower',{pageNum:this.pageInfo.pageNum,sort:this.sort,desc:this.desc,pageSize:this.pageInfo.pageSize}, res => {
                    //console.log(res)
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            add(){
                this.$router.push('/set/level_details/add')
            },
            edit(item) {
                this.$router.push('/set/level_details/'+item.powerCode)
                
            },
            handleDelete(id) {
                this.confirmDel(()=>{
                    this.dataApi.ajax('deletePower',{powerCode:id}, res => {
                        if (res.responseType === 'S') {
                            this.showMsg('删除成功')
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    });
                })
                // this.$confirm('你确认要删除吗?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     this.dataApi.ajax('deletePower',{groupId:id}, res => {
                //     if (res.responseType === 'S') {
                //          this.$message({
                //             type: 'success',
                //             message: '删除成功!'
                //           });
                //         this.fetchData(this.pageInfo.pageNum);
                //     }
                // });
                // }).catch(() => {

                // })

            },
            handleCurrentChange(val) {
                this.fetchData(val);
            },
            order(column){
                if (!column.order) {
                    return;
                }
                if (column.order=='ascending') {
                     this.desc='ASC'
                }else{
                    this.desc='DESC'
                }
                this.fetchData(this.pageInfo.pageNum)
            }
        }
    }
</script>
