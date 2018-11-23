<template>
    <div class="account">
        <el-row :span="24" style="margin:26px 0;">
           
            <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                 <el-button @click="add()" type="primary" class="el-icon-plus"> 新增</el-button>
                <el-form-item label="物流公司:" >
                        <el-input v-model="formInline.logisticsName" style="width: 150px;"></el-input>
                 </el-form-item>

                <el-button type="primary" @click="fetchData(1)">查询</el-button>
                <a class="pointer" style="margin-left: 50px;color: red" href="http://p8erv42o1.bkt.clouddn.com/快递100.doc">下载附件</a>
             
            </el-form>
            <span>备注：新增物流公司，需要对照附件中支持的物流编号以及公司名称，否则添加无效</span>
        </el-row>
        <el-table
                v-loading="table_loading"
                element-table_loading-text="加载中"
                :data="pageInfo.dtos"
                @sort-change='order'
                stripe
                style="width: 100%">
            <el-table-column
                    type="index"
                    width="80"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="logisticsName"
                    label="物流公司">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope" >
                    <el-button
                            size="small"
                            type="primary"
                            @click="accountDetail(scope.row)">编辑
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

        <!--模态框-->
        <el-dialog title="新增/编辑物流公司" v-model="dialogFormVisible">
            <el-form :model="ruleForm" ref="ruleForm" style="width: 85%;">
                <el-form-item label="物流编号:"   :label-width="formLabelWidth">
                    <el-input  v-model.trim="ruleForm.logisticsCom" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="物流公司:"  :label-width="formLabelWidth">
                    <el-input v-model.trim="ruleForm.logisticsName" :maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <span style="margin-left: 50px;">备注：请对应附件，输入物流编号和物理公司</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           :disabled=" !ruleForm.logisticsCom  || !ruleForm.logisticsName"
                           @click="submitForm">提 交
                </el-button>
            </div>
        </el-dialog>
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
                table_loading: false,
                loading: false,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                formInline: {
                     pageNum: 1,
                     pageSize: 10,
                     logisticsName:'',
                     sort:'CRE_TIME',
                     desc:'DESC',
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                ruleForm: {
                    logisticsName: '',
                    logisticsCom: '',
                    logisticsId:''
                },
                validateForm: false,
                status: true,
                disabled: false,
                id:'',
                showEdit:true
            }
        },
        created(){
            
        },
        activated() {
              this.fetchData(this.pageInfo.pageNum);
        },
        mounted(){

        },
        methods: {
             fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = page
                this.dataApi.ajax('selectPageShopLogistics',this.formInline, res => {
                    //console.log(res)
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });
            },
            submitForm() { 
                if (this.ruleForm.logisticsId!= '') {
                    this.loading = true;
                    this.dataApi.ajax('editShopLogistics', this.ruleForm, res => {
                        this.loading = false;
                        if (res.responseType === 'S') {
                            this.showMsg('修改成功')
                             this.dialogFormVisible = false;
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    }); 
                }else{
                    this.loading = true;
                    this.dataApi.ajax('addShopLogistics',this.ruleForm, res => {
                        this.loading = false;
                        if (res.responseType === 'S') {
                            this.showMsg('新增成功')
                            this.dialogFormVisible = false;
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    });  
                }
                
                
            },
            accountDetail(item){
                this.dialogFormVisible = true;
                 this.ruleForm = {
                    logisticsName:item.logisticsName,
                    logisticsCom:item.logisticsCom,
                    logisticsId:item.logisticsId
                }
            },
            handleCurrentChange(val) {
                this.fetchData(val);
            },
            add() {
                this.dialogFormVisible = true
                this.ruleForm = {
                    logisticsName: '',
                    logisticsCom: '',
                    logisticsId:''
                }
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
                this.sort=column.prop.toUpperCase()
                this.fetchData(this.pageInfo.pageNum)
            }

        }
    }
</script>
