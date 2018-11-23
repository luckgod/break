<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">              
                <el-button
                  type="primary"
                  @click="add()">+添加
                </el-button>
            </el-col>
        </el-row>

        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                @sort-change='order'
                element-table_loading-text="加载中"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="dicValue"
                    label="名称">
            </el-table-column> 
            <el-table-column
                    label="内容">
                    <template scope="scope">
                        <span style="color: #128BE5;text-decoration: underline;cursor: pointer;" @click="second(scope.row)">内容</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button
                            size="small"
                            type="primary"
                            @click="detail(scope.row)">编辑
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

        <el-dialog title="新增/编辑自定义内容" v-model="dialogVisible" size="tiny">
             <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;">

                <el-form-item label="名称：" label-width="100px">
                    <el-input auto-complete="off"  v-model="form.dicValue" style="width: 80%;" :maxlength="50"></el-input>
                </el-form-item>
             </el-form>
             <div style="text-align: center">
                 <el-button type="primary" @click="onSubmit()" :disabled="!form.dicValue" :loading="loading">保 存
                 </el-button>
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
                formInline: {
                    pageNum:1,
                    sort:'CRE_TIME',
                    desc:'DESC',
                    pageSize:10,
                    parentCode:0
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos: []
                },
                dialogVisible:false,
                table_loading:false,
                form: {
                  dicCode:'',
                  dicValue:''
                },
                loading:false
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
                this.dataApi.ajax('selectPageSysDictionary',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                       this.pageInfo = res
                    }
                });

            },
            add(){
               this.dialogVisible=true
               this.form={
                  dicValue:'',
               }
            },
            onSubmit() {
              this.loading=true
              if (this.form.dicCode) {
                    this.dataApi.ajax('editSysDictionary',this.form, res => {
                    if (res.responseType === 'S') {
                      this.showMsg('修改成功');
                      this.dialogVisible=false
                      this.fetchData(this.pageInfo.pageNum)
                    }
                    this.loading=false
                });
              }else{
                 this.dataApi.ajax('addSysDictionary',this.form, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('添加成功');
                        this.dialogVisible=false;
                        this.fetchData(this.pageInfo.pageNum);
                    }
                    this.loading=false;
                });
              }
              
            },
            detail(item){
               this.dialogVisible=true
               this.form={
                  dicValue:item.dicValue,
                  dicCode:item.dicCode
               }
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
               this.fetchData(this.pageInfo.pageNum)
            },
            second(item){
                this.$router.push('/terrace/edit_custom?parentCode='+item.dicCode+'&&name='+item.dicValue)
            }
        }
    }
</script>
