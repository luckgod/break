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
        <div style="margin-bottom: 20px;">商家分类：{{decodeURI(name)}}</div>
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
                    prop="sort_Value"
                    sortable='custom'>
                    <template scope="scope">
                        <el-input  v-model="scope.row.sortValue" style="width: 100px;"  @blur="editOrder(scope.row,$event)" @focus="setOldProbability(scope.row)"></el-input>
                    </template>
            </el-table-column>
            
            <el-table-column
                    prop="cre_Time"
                    width="170"
                    sortable='custom'
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
        <el-dialog title="新增/编辑二级分类" v-model="dialogVisible" size="tiny">
             <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;">

                <el-form-item label="商家分类：" label-width="100px">
                    <el-input auto-complete="off"  v-model="form.classifyName" style="width: 80%;" :maxlength="50"></el-input>
                </el-form-item>               
             </el-form>
             <div style="text-align: center">
                 <el-button type="primary" @click="onSubmit()" :disabled="!form.classifyName">保 存
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
                  parentId:'',
                  classifyId:'',
                  classifyName:''
                },
                parentId:'',
                name:'',
                URL:URL,
                status:true,
                sort:'CRT_TIME',
                desc:'ASC',

            }
        },
        created(){
            
        },
        activated() {
              let urlPram = getRequestParam(location.hash)
              this.name=urlPram.name
              this.parentId=urlPram.parentId
              this.form.parentId=this.parentId
              this.fetchData(this.pageInfo.pageNum);

        },
        methods: {
            fetchData (page = 1) {
                
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.dataApi.ajax('selectPageStoreClassify',{pageNum:this.pageInfo.pageNum,parentId:this.parentId,sort:this.sort,desc:this.desc,pageSize:this.pageInfo.pageSize}, res => {
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
                  classifyName:'',
                  parentId:this.parentId
               }
            },
            onSubmit() {
              let obj=generateObj(this.form)
              if (this.status==false) {
                  this.dataApi.ajax('editStoreClassify',obj, res => {
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
                this.dataApi.ajax('addStoreClassify',obj, res => {
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
            setOldProbability(item) {
                item.OldProbability = item.sortValue
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
              this.status=false
               this.dialogVisible=true
               this.form={
                  classifyId:item.classifyId,
                  classifyName:item.classifyName
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
            }
        }
    }
</script>
