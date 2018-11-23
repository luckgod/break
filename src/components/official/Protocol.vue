<template>
    <div class="account">
        <el-row :span="24" style="margin:26px 0;">
             <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="规则管理" name="arr2"></el-tab-pane>
                <el-tab-pane label="协议管理" name="arr3"></el-tab-pane>
                <el-tab-pane label="名词简述" name="arr1"></el-tab-pane>
            </el-tabs>
            <el-table
                v-loading="table_loading"
                element-table_loading-text="加载中"
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="number"
                    width="200"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button
                            size="small"
                            type="primary"
                            @click="detail(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-row>

        <!--模态框-->
        <el-dialog title="编辑文案" v-model="dialogFormVisible">
            <el-form :model="form" ref="ruleForm" >
                <el-form-item label="标题:">
                    <span>{{ form.textTitle }}</span>
                </el-form-item>
                <el-form-item label="内容:">
                    <el-input type="textarea" v-model="form.textContent" :rows="3" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           :disabled=" !form.textContent"
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
                table_loading:false,
                tableData:[],
                arr1:[{number:'0000000011',name:'招商图文'},{number:'0000000014',name:'关于我们'},{number:'0000000015',name:'奖励券'},{number:'0000000016',name:'抵价券'},{number:'0000000020',name:'个人认证支持的银行卡'},{number:'0000000022',name:'股权认领'},{number:'0000000024',name:'股权红包介绍'},{number:'0000000025',name:'代理认证弹窗提示'},{number:'0000000026',name:'代理认证流程'}],
                arr2:[{number:'0000000000',name:'红包股玩法说明'},{number:'0000000001',name:'邀请好友奖励规则'},{number:'0000000002',name:'加密红包规则'},{number:'0000000005',name:'平台客服'},{number:'0000000010',name:'红包排行榜解释'},{number:'0000000017',name:'余额充值提示'},{number:'0000000018',name:'当面付说明'},{number:'0000000019',name:'个人认证提示语'},{number:'0000000023',name:'城主特权介绍'}],
                arr3:[{number:'0000000003',name:'个人红包发送协议'},{number:'0000000004',name:'个人红包平台免责条款'},{number:'0000000006',name:'用户登录注册协议'},{number:'0000000009',name:'app审核隐私政策'},{number:'0000000012',name:'商家入驻协议'},{number:'0000000013',name:'城主协议'},{number:'0000000027',name:'商品红包发送协议'}],
                pageInfo: {
                    pageNo: 1,
                    pageSize: 1,
                    totalRows: 1,
                    rows: []
                },
                dialogFormVisible:false,
                form:{
                    textContent:'',
                    textCode:'',
                    textTitle:''
                },
                loading:false,
                activeName:'arr2'
            }
        },
        activated(){
            //this.fetchData();
            this.tableData=this[this.activeName]
        },
        mounted(){

        },
        methods: {
            fetchData (id) {
                this.dataApi.ajax('singleSysTextInfo',{textCode:id}, res => {
                    if (res.responseType === 'S') {
                        this.form = res
                    }
                });
            },
            detail(item) {
                if (item.number=='0000000000') {
                   this.fetchData(item.number)
                   this.dialogFormVisible=true
                }else if (item.number=='0000000001') {
                    this.fetchData(item.number)
                    this.dialogFormVisible=true
                }else if (item.number=='0000000002') {
                    this.fetchData(item.number)
                    this.dialogFormVisible=true
                }else if (item.number=='0000000013') {
                    this.fetchData(item.number)
                    this.dialogFormVisible=true
                }else if (item.number=='0000000017') {
                    this.fetchData(item.number)
                    this.dialogFormVisible=true
                }else if (item.number=='0000000019') {
                    this.fetchData(item.number)
                    this.dialogFormVisible=true
                }else if (item.number=='0000000024') {
                    this.fetchData(item.number)
                    this.dialogFormVisible=true
                }else if (item.number=='0000000025') {
                    this.fetchData(item.number)
                    this.dialogFormVisible=true
                }else{
                     this.$router.push('/official/protocoldetail?id='+item.number+'&title='+item.name)
                } 
            },
            submitForm(){
                this.dataApi.ajax('editSysTextInfo',this.form, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('修改成功')
                        this.dialogFormVisible=false
                    }
                });
            },
            handleClick(tab, event) {
                this.tableData=this[this.activeName]
            }
        }
    }
</script>
