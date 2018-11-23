<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-button type="primary" @click="goBack()">返回</el-button>
                    <el-form-item label="公司筛选:">
                        <el-input v-model="formInline.companyName" style="width: 150px;"></el-input>
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
                    prop="creTime"
                    label="兑换时间">
            </el-table-column>
            <el-table-column
                    label="所属公司"
                    prop="companyName">
            </el-table-column>
            <el-table-column
                    label="回购股权"
                    prop="buyShare">
                    <template scope="scope">
                        <span>{{ cutNum(scope.row.buyShare,4) }}</span>
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

         <!--回购-->
        <el-dialog title="回购" v-model="dialog" size="tiny" >
            <el-form  style="width: 85%;" label-width="100px">
                <el-form-item label="当前可回购股权数量:">
                    <span>111</span>
                </el-form-item>
                <el-form-item label="本次回购数量:">
                    <el-input  v-model="f.number" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submitNum()" :disabled="!f.number">确认</el-button>
            </div>
        </el-dialog>
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
                    companyName: '',
                    sort:'T1.CRE_TIME',
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
                dialog:false,
                f:{
                  number:''
                },
                loading:false
                

            }
        },
        created(){
            this.formInline.userId=this.$route.params.id
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
                this.dataApi.ajax('selectBuyShare',this.formInline, res => {
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
            },
            submitNum(){

            }

        }
    }
</script>
