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
                    prop="companyName"
                    label="所属公司">
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    label="预计年化收益率"
                    prop="proit_Rate">
                    <template scope="scope">
                        <span>{{ scope.row.proitRate }}%</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="当前持有股权"
                    prop="totalShare">
                    <template scope="scope">
                        <span>{{ cutNum(scope.row.totalShare,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="已回购股权"
                    prop="buyBackShare">
                    <template scope="scope">
                        <span>{{ cutNum(scope.row.buyBackShare,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="未回购股权"
                    prop="share">
                    <template scope="scope">
                        <span>{{ cutNum(scope.row.share,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="190">
                <template scope="scope">
                    <el-button 
                            type="primary" 
                            size="small" @click="buyBack(scope.row)">点击回购
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

         <!--回购-->
        <el-dialog title="回购" v-model="dialog" size="tiny" >
            <el-form  style="width: 85%;" label-width="150px">
                <el-form-item label="当前可回购股权数量:">
                    <span>{{ f.number }}</span>
                </el-form-item>
                <el-form-item label="本次回购数量:">
                    <el-input  v-model="f.share" ></el-input>
                    *回购数量最多保留4位小数
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submitNum()" :disabled="!f.share || f.share==0">确认</el-button>
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
                    companyName:'',
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
                  number:'',
                  share:'',
                  userId:'',
                  holdCompanyId:''
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
                this.dataApi.ajax('selectUserShareList', this.formInline, res => {
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
                if(!isFloat(this.f.share)){
                    this.showMsg('回购数量不正确','warning');
                    return
                }
                if (fetchNum(this.f.share)>4) {
                    this.showMsg('回购数量小数点不能超过4位','warning');
                    return
                 }
                if(this.f.share>this.f.number){
                    this.showMsg('可回购股权不足','warning');
                    return
                }
                this.dataApi.ajax('buyShare',this.f, res => {
                        if (res.responseType === 'S') {
                           this.showMsg('回购成功');
                           this.dialog=false;
                           this.fetchData(this.pageInfo.pageNum)
                        }
                });
            },
            buyBack(item){
                this.f={
                     share:'',
                     number:item.share,
                     userId:item.userId,
                     holdCompanyId:item.holdCompanyId
                }
                this.dialog=true
            }

        }
    }
</script>
