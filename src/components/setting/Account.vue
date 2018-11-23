<template>
    <div class="account">
        <el-row :span="24" style="margin:26px 0;">
            <el-button @click="add()" type="primary" class="el-icon-plus" v-if="powerShow('编辑和删除账号信息')"> 新增</el-button>
        </el-row>
        <el-table
                v-loading="table_loading"
                element-table_loading-text="加载中"
                :data="pageInfo.dtos"
                @sort-change='order'
                stripe
                style="width: 100%">
            <el-table-column
                    prop="acctno"
                    label="账号">
            </el-table-column>
            <el-table-column
                    prop="adminName"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="cantant"
                    label="联系方式">
            </el-table-column>
            <el-table-column
                    prop="powerName"
                    label="所属权限组">
                    <template scope="scope">
                        <span v-for="item in scope.row.userPowerDtos">{{ item.powerName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="cre_Time"
                    label="时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="150" v-if="powerShow('编辑和删除账号信息')">
                <template scope="scope" >
                    <el-button
                            size="small"
                            type="primary"
                            @click="accountDetail(scope.row)">编辑
                    </el-button>
                    <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.row.adminCode)">删除
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
        <el-dialog title="编辑账号" v-model="dialogFormVisible">
            <el-form :model="ruleForm" ref="ruleForm" style="width: 85%;">
                <el-form-item label="账号:"
                              prop="acctno"
                              :label-width="formLabelWidth">
                    <el-input  v-model.trim="ruleForm.acctno" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="密码:"
                              prop="password"
                              :label-width="formLabelWidth">
                    <el-input type="password" v-model.trim="ruleForm.adminPwd" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="姓名:"
                              prop="name"
                              :label-width="formLabelWidth">
                    <el-input v-model.trim="ruleForm.adminName" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="联系方式:"
                              prop="tel"
                              :label-width="formLabelWidth">
                    <el-input v-model.trim="ruleForm.cantant" :maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="权限组:" :label-width="formLabelWidth">
                    <el-select v-model="ruleForm.powerCodeList">
                        <el-option :label="item.powerName" :value="item.powerCode"
                                   v-for="item in group_menu"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           :disabled=" !ruleForm.acctno  || !ruleForm.adminName || !ruleForm.cantant"
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
                formInline: {},
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                ruleForm: {
                    acctno: '',
                    adminPwd: '',
                    adminName: '',
                    cantant: '',
                    adminCode:'',
                    powerCodeList:[]
                },
                group_menu:[],
                validateForm: false,
                status: true,
                disabled: false,
                id:'',
                sort:'CRE_TIME',
                desc:'DESC',
                showEdit:true
            }
        },
        created(){
            
        },
        activated() {
              this.fetchList()
              this.fetchData(this.pageInfo.pageNum);
        },
        mounted(){

        },
        methods: {
             fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.dataApi.ajax('selectAdmin', {pageNum: this.pageInfo.pageNum,sort:this.sort,desc:this.desc,pageSize:this.pageInfo.pageSize}, res => {
                    //console.log(res)
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });
            },
            submitForm() { 
               this.ruleForm.powerCodeList=[this.ruleForm.powerCodeList]
                if (this.ruleForm.adminCode!= '') {
                    this.ruleForm.adminPwd=this.encrypt(this.ruleForm.adminPwd)
                    this.loading = true;
                    this.dataApi.ajax('editAdmin', this.ruleForm, res => {
                        this.loading = false;
                        if (res.responseType === 'S') {
                            this.showMsg('修改成功')
                           
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    }); 
                }else{
                    if (this.ruleForm.adminPwd=='') {
                        this.$message({
                                type: 'warning',
                                message: '请输入密码!'
                         });
                        return;
                    }
                    this.ruleForm.adminPwd=this.encrypt(this.ruleForm.adminPwd)
                    this.loading = true;
                    this.dataApi.ajax('addAdmin', this.ruleForm, res => {
                        this.loading = false;
                        if (res.responseType === 'S') {
                            this.showMsg('新增成功')
                            this.dialogFormVisible = false;
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    });  
                }
                 this.dialogFormVisible = false;
                
            },
            accountDetail(item){
                var powerCodeList=''
                if (item.userPowerDtos) {
                     for (var i = 0;i<item.userPowerDtos.length;i++) {
                        powerCodeList=item.userPowerDtos[i].powerCode
                    }
                }else{
                   powerCodeList='' 
                }
               
                this.dialogFormVisible = true;
                 this.ruleForm = {
                    acctno:item.acctno,
                    adminPwd:'',
                    adminName:item.adminName,
                    cantant:item.cantant,
                    adminCode:item.adminCode,
                    powerCodeList:powerCodeList
                }
            },
            handleDelete(id) {
                this.$confirm('你确认要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dataApi.ajax('editAdmin',{adminCode:id,adminStat:2}, res => {
                        this.loading = false;
                        if (res.responseType === 'S') {
                            this.showMsg('删除成功')
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    }); 

                }).catch(() => {

                })

            },
            handleCurrentChange(val) {
                this.fetchData(val);
            },
            add() {
                this.dialogFormVisible = true
                this.ruleForm = {
                    acctno: '',
                    adminPwd: '',
                    adminName: '',
                    cantant: '',
                    adminCode:'',
                    powerCodeList:[]
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
            },
            encrypt(str) {
                var code = 956132157;
                var result=''
                for (var i = 0; i < str.length; i++) {//遍历字符数组
                     result += (str.charCodeAt(i) ^ code);//对每个数组元素进行异或运算，异或的值可以自己选择
                }
                return result;
            },
            fetchList(){
                this.dataApi.ajax('selectUserPower',null, res => {                    
                    if (res.responseType === 'S') {
                        this.group_menu = res.userPowerDtos
                    }
                });
            },

        }
    }
</script>
