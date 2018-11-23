<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-button type="primary" @click="edit('add')">+新增</el-button>
                <span style="margin-left: 50px;">按状态：</span>
                 <el-select v-model="formInline.validFlag" style="width: 120px;" >
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已启用" value="1"></el-option>
                            <el-option label="已禁用" value="0"></el-option>
                 </el-select>
                 <el-button type="primary" @click="fetchData(1)">查询</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="adCode"
                    label="广告序号">
            </el-table-column>
            <el-table-column
                    label="广告封面">
                    <template scope="scope">
                        <img class="avatar" :src="scope.row.adImageAddress" style="width: 55px;height: 55px;border-radius: 0;">
                    </template>
            </el-table-column>
            <el-table-column
                    prop="adTitle"
                    label="广告标题">
            </el-table-column>
            <el-table-column
                    prop="adMark"
                    label="广告简介">
            </el-table-column>
            <el-table-column
                    prop="updTime"
                    label="最后编辑时间">
            </el-table-column>
            <el-table-column
                    prop="adLinkAddress"
                    label="跳转链接">
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small"  v-if="scope.row.validFlag==1"
                               @click="changeState(scope.row.adCode,'禁用')">禁用
                    </el-button>
                    <el-button type="success" size="small" v-else
                               @click="changeState(scope.row.adCode,'启用')">启用
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

         <!--新增/编辑系统广告-->
        <el-dialog title="新增/编辑系统广告" v-model="dialogVisible" size="small">
             <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;">
                <el-form-item label="广告封面：" label-width="100px" >
                    <we-ui-uploads :images="form.adImageAddress"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading" ></we-ui-uploads>
                     建议尺寸：630x360
                </el-form-item>
                <el-form-item label="广告标题：" label-width="120px">
                    <el-input  v-model="form.adTitle" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="跳转：" label-width="120px">
                    <el-radio-group v-model="form.isRedirect">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转链接：" label-width="120px">
                    <el-input  v-model="form.adLinkAddress" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="广告简介：" label-width="120px">
                    <el-input type="textarea" v-model="form.adMark" style="width: 80%;"></el-input>
                </el-form-item>             
             </el-form>
             <div style="text-align: center">
                 <el-button type="primary" @click="onSubmit()" :disabled="!form.adTitle" :loading="loading">保 存
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
                title: '用户列表',
                table_loading: false,
                loading:false,
                formInline: {
                    pageNum:'',
                    pageSize: 10,
                    sort:'CRE_TIME',
                    desc:'DESC',
                    validFlag:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                URL:URL,
                dialogVisible:false,
                form:{
                    adTitle:'',
                    adLinkAddress:'',
                    adImageAddress:[],
                    adMark:'',
                    adCode:'',
                    adType:'2',
                    isRedirect:'1'
                }

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
                this.dataApi.ajax('selectPageAdInfo',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });


            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            edit(item){
              this.dialogVisible=true
              if (item=='add') {
                 this.form={
                    adTitle:'',
                    adLinkAddress:'',
                    adImageAddress:[],
                    adMark:'',
                    adCode:'',
                    adType:'2',
                    isRedirect:'1'
                 }
              }else{
                this.form={
                    adTitle:item.adTitle,
                    adLinkAddress:item.adLinkAddress,
                    adImageAddress:[item.adImageAddress],
                    adMark:item.adMark,
                    adCode:item.adCode,
                    adType:'2',
                    isRedirect:''
                }
                if (item.adLinkAddress=='') {
                    this.form.isRedirect='2'
                }else{
                    this.form.isRedirect='1'
                }   
              }
            },
            changeState(id, type){   //启用禁用
                 var state=''
                    if (type=='启用') {
                        state=1
                    }else{
                        state=0
                    }
                this.$confirm('确定'+type+'?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.dataApi.ajax('editAdInfo',{adCode:id,validFlag:state}, res => {
                        this.table_loading = false;
                        if (res.responseType === 'S') {
                           this.showMsg(type+'成功')
                           this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                  
                }).catch(() => {
                          
                });
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
            onSubmit(){
                if (this.form.adImageAddress.length==0) {
                    this.showMsg('请上传广告封面','warning');
                    return;
                }
                if (this.form.isRedirect=='1') {
                     if (this.form.adLinkAddress=='') {
                            this.showMsg('请填写链接','warning');
                            return;
                     }
                    this.form.adLinkAddress=this.form.adLinkAddress
                }else{
                   this.form.adLinkAddress='' 
                }

                var obj=generateObj(this.form);
                obj.adImageAddress=obj.adImageAddress+'';

                if (this.form.adCode=='') {
                   this.dataApi.ajax('addAdInfo',obj, res => {
                        if (res.responseType === 'S') {
                            this.showMsg('新增成功');
                            this.dialogVisible=false;
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    }); 
               }else{  
                  this.dataApi.ajax('editAdInfo',obj, res => {
                        this.table_loading = false;
                        if (res.responseType === 'S') {
                           this.showMsg('修改成功');
                           this.dialogVisible=false;
                           this.fetchData(this.pageInfo.pageNum);
                        }
                  });
               }
                
            }

        }
    }
</script>
