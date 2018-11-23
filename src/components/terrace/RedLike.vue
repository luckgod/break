<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;font-size: 15px;">
            <el-col :span="24">              
                    <el-button          
                        type="primary"
                        @click="edit('add')">+新增
                     </el-button>
                     <!-- <span style="font-size: 17px;padding:0 30px;font-weight: bold">开机广告状态：已开启</span>
                     <span style="font-size: 17px;font-weight: bold;">操作：</span><el-button          
                        type="primary"
                        @click="edit('add')">关闭显示
                     </el-button> -->
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
                    width="80"
                    type="index"
                    label="序号">
            </el-table-column>
            
            <el-table-column
                    prop="issueName"
                    label="点赞内容">
            </el-table-column>
            <el-table-column
                    prop="issueNum"
                    label="排序值">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="点赞图标">
                    <template scope="scope">
                        <img class="banner" :src="scope.row.issueImage">
                    </template>
            </el-table-column>
            <el-table-column
                    prop="updTime"
                    label="最后编辑时间">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button
                            size="small"
                            type="primary"
                            @click="edit(scope.row)">编辑
                    </el-button>
                    <el-button
                            size="small"
                            type="danger"
                            @click="deleteById(scope.row)">删除
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

         <el-dialog title="新增/编辑点赞" v-model="dialogVisible" size="small">
             <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;"> 
                <el-form-item label="点赞图标：" label-width="150px" >
                    <we-ui-uploads :images="form.issueImage"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading" ></we-ui-uploads>
                </el-form-item>
                <el-form-item label="点赞内容：" label-width="150px">
                    <el-input  v-model="form.issueName" style="width: 50%;" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="排序值：" label-width="150px">
                    <el-input  v-model="form.issueNum" style="width: 20%;" ></el-input>
                </el-form-item>
                 
             </el-form>
             <div style="text-align: center">
                 <el-button type="primary" @click="submit" :disabled="!form.issueName" :loading="loading">保 存
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
                    count: 1,
                    dtos:[]
                },
                table_loading:false,
                desc:'DESC',
                sort:'CRE_TIME',
                dialogVisible:false,
                form:{
                    issueState:'1',
                    issueName:'',
                    issueImage:[],
                    issueCode:'',
                    issueNum:''
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
                this.pageInfo.pageNo = page
                this.dataApi.ajax('selectUserVoteIssuePage', {pageNum: this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize}, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            edit(item){
               if (item=='add') {
                   this.form={
                     issueState:'1',
                     issueName:'',
                     issueImage:[],
                     issueNum:''
                   }
               }else{
                   this.form={
                     issueState:item.issueState,
                     issueName:item.issueName,
                     issueImage:[item.issueImage],
                     issueCode:item.issueCode,
                     issueNum:item.issueNum
                   }
               }
               this.dialogVisible=true
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
                this.sort=column.prop
                this.fetchData(this.pageInfo.pageNum)
            },
             uploading(f) {
                 this.loading=true
                 this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                        //console.log(res)
                        if (res.responseType == 'S') {
                            f.images.splice(f.index,1,res.filePath)
                            this.loading=false
                        }
                 });
                
            },
            submit(){
                 if (this.form.issueImage == '') {
                      this.showMsg('请上传图片','warning')
                       return;
                  }
                if (!isNumber(this.form.issueNum)) {
                   this.showMsg('排序值不正确','warning')
                       return; 
                }
                let obj=generateObj(this.form)
                obj.issueImage=obj.issueImage+''

                this.loading=true
               
                if (!obj.issueCode) {
                    this.dataApi.ajax('addUserVoteIssue',obj, res => {
                        if (res.responseType ==='S') {
                              this.showMsg('添加成功')
                              this.loading=false
                              this.dialogVisible=false
                              this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                } else {
                    this.dataApi.ajax('editUserVoteIssue',obj, res => {
                        if (res.responseType === 'S') {
                             this.loading=false
                             this.showMsg('修改成功')
                             this.dialogVisible=false
                             this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                }
            },
            deleteById(item){
                this.confirmDel(() => {
                    item.issueState=2
                    this.dataApi.ajax('editUserVoteIssue',item, res => {
                        //console.log(res)
                        if (res.responseType === 'S') {
                            this.showMsg('删除成功')
                            this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                })
            }
        }
    }
</script>
