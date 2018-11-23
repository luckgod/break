<template>
    <div class="customer">

        <el-row style="margin-top: 15px;">
            <el-col :span="24">              
                <el-form :inline="true"  class="demo-form-inline" label-width="80px">
                    <el-button  @click="goBack()" type="primary" >返回</el-button>
                    <el-button  @click="add()" type="primary" >新增</el-button>
                </el-form>
            </el-col>
            
        </el-row>
        <hr>
        <div style="margin-bottom: 20px;">一级内容：{{decodeURI(name)}}</div>
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
                 <el-button type="primary" @click="onSubmit()" :disabled="!form.dicValue">保 存
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
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    totalRows: 1,
                    rows: []
                },
                dialogVisible:false,
                table_loading:false,
                form: {
                  parentCode:'',
                  dicCode:'',
                  dicValue:''
                },
                parentCode:'',
                name:'',
                URL:URL,
                status:true,
                sort:'CRE_TIME',
                desc:'DESC',

            }
        },
        created(){
            let urlPram = getRequestParam(location.hash)
            this.name=urlPram.name
            this.parentCode=urlPram.parentCode
            this.form.parentCode=this.parentCode
            this.fetchData(this.pageInfo.pageNum);
        },
        activated() {
              

        },
        methods: {
            fetchData (page = 1) {
                
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.dataApi.ajax('selectPageSysDictionary',{pageNum:this.pageInfo.pageNum,parentCode:this.parentCode,sort:this.sort,desc:this.desc,pageSize:this.pageInfo.pageSize}, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            add(){
               this.status=true
               this.dialogVisible=true
               this.form={
                  dicValue:'',
                  parentCode:this.parentCode
               }
            },
            onSubmit() {
              if (this.status==false) {
                  this.dataApi.ajax('editSysDictionary',this.form, res => {
                    if (res.responseType === 'S') {
                          this.$message({
                            type: 'success',
                            message: '修改成功!'
                         });
                          this.dialogVisible=false
                          this.fetchData(this.pageInfo.pageNum)
                    }
                });
              }else{
                this.dataApi.ajax('addSysDictionary',this.form, res => {
                    if (res.responseType === 'S') {
                          this.$message({
                            type: 'success',
                            message: '新增成功!'
                         });
                          this.dialogVisible=false
                          this.fetchData(this.pageInfo.pageNum)
                    }
                });
              }
              
            },
            detail(item){
              this.status=false
               this.dialogVisible=true
               this.form={
                  dicCode:item.dicCode,
                  dicValue:item.dicValue
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
