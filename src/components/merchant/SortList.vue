<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">              
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
                    <el-button
                        type="primary"
                        @click="add()">+添加
                     </el-button>

                    <el-form-item label="分类名称">
                        <el-col :span="18">
                            <el-input v-model="formInline.classifyName" :maxlength="50"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-button type="primary" @click="fetchData(1)">查询</el-button>
                </el-form>
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
                    prop="classifyName"
                    label="名称">
            </el-table-column> 
            
            <el-table-column
                    label="排序值"
                    sortable='custom'>
                    <template scope="scope">
                        <el-input  v-model="scope.row.sortValue" style="width: 100px;"  @blur="editOrder(scope.row,$event)" @focus="setOldProbability(scope.row)"></el-input>
                    </template>
            </el-table-column>
            <el-table-column
                    label="二级分类">
                    <template scope="scope">
                        <span style="color: #128BE5;text-decoration: underline;cursor: pointer;" @click="second(scope.row)">二级分类</span>
                    </template>
            </el-table-column>
            <el-table-column
                    width="170"
                    label="创建时间">
                    <template scope="scope">
                        <span>{{dateFormat(scope.row.crtTime,'y-m-d h:i')}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button
                            size="small"
                            type="primary"
                            @click="detail(scope.row)">编辑
                    </el-button>
                     <el-button type="danger" size="small"  v-if="scope.row.isShow==1"
                               @click="handleDelete(scope.row,'禁用')">禁用
                    </el-button>
                    <el-button type="success" size="small" v-else
                               @click="handleDelete(scope.row,'启用')">启用
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
        <el-dialog title="新增/编辑商家分类" v-model="dialogVisible" size="tiny">
             <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;">

                <el-form-item label="商家分类：" label-width="100px">
                    <el-input auto-complete="off"  v-model="form.classifyName" style="width: 80%;" :maxlength="50"></el-input>
                </el-form-item>
             </el-form>
             <div style="text-align: center">
                 <el-button type="primary" @click="onSubmit()" :disabled="!form.classifyName" :loading="loading">保 存
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
                    classifyName:'',
                    pageNum:1,
                    sort:'CRT_TIME',
                    desc:'DESC',
                    pageSize:10,
                    parentId:0
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
                  classifyName:'',
                  classifyId:''
                },
                URL:URL,
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
                this.dataApi.ajax('selectPageStoreClassify',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                       this.pageInfo = res
                    }
                });

            },
            add(){
               this.dialogVisible=true
               this.form={
                  classifyName:'',
               }
            },
            onSubmit() {
              var _this=this
              let obj=generateObj(this.form)
              this.loading=true
              if (obj.classifyId) {
                    this.dataApi.ajax('editStoreClassify',obj, res => {
                    if (res.responseType === 'S') {
                      this.$message({
                        type: 'success',
                        message: '修改成功!'
                      });
                      this.loading=false
                       _this.dialogVisible=false
                       _this.fetchData(_this.pageInfo.pageNum)
                    }
                });
              }else{
                 this.dataApi.ajax('addStoreClassify',obj, res => {
                    if (res.responseType === 'S') {
                      _this.$message({
                        type: 'success',
                        message: '添加成功!'
                      });
                      this.loading=false
                       _this.dialogVisible=false
                       _this.fetchData(_this.pageInfo.pageNum)
                    }
                });
              }
              
            },
            editOrder(item){
              if (Math.floor(item.sortValue) <= 0) {
                    item.sortValue = item.OldProbability || 0;
                    return false;
                }
                if (item.OldProbability == item.sortValue) return false;
                if (!isNumber(item.sortValue)) {
                   this.showMsg('只能输入数字','warning')
                   item.sortValue=item.OldProbability
                   return false;
                }
                // if (item.sortValue > this.pageInfo.totalRows){
                //    this.showMsg('排序值不能大于总数','warning')
                //    item.sortValue=item.OldProbability
                //    return false;
                // }

                 var data={
                  classifyId:item.classifyId,
                  sortValue:item.sortValue
                 }
                 console.log(data)
                 this.dataApi.ajax('editStoreClassify',data, res => {
                        if (res.responseType === 'S') {
                          this.$message({
                            type: 'success',
                            message: '修改成功!'
                          });
                           this.fetchData(this.pageInfo.pageNum)
                        }
                  });
            },
            detail(item){
               this.dialogVisible=true
               this.form={
                  classifyName:item.classifyName,
                  classifyId:item.classifyId
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
            handleDelete(item,type){
                var state=''
                if (item.isShow==1) {
                    state=0
                }else{
                    state=1
                }

                this.$confirm('确认'+type+'?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.dataApi.ajax('editStoreClassify',{classifyId:item.classifyId,isShow:state}, res => {
                            if (res.responseType === 'S') {
                                this.showMsg(type+'成功')
                                this.fetchData(this.pageInfo.pageNum)
                            }
                        });
                    }).catch(() => {
                              
                    });
            },
            second(item){
                this.$router.push('/merchant/second_list?parentId='+item.classifyId+'&&name='+item.classifyName)
            },
            setOldProbability(item) {
               item.OldProbability = item.sortValue
            },
        }
    }
</script>
