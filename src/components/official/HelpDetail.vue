<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-button
                        type="primary"
                        @click="goBack()">返回
                </el-button>

            </el-col>
        </el-row>
        <el-form :model="form" style="background-color: #FFFFFF;padding: 20px 0;" label-width="110px">
            <el-form-item label="图标：" >
                <we-ui-uploads :images="form.helpIcon"
                               :maxCount="1"
                               :maxSize="1024*512"
                               @uploading="uploading"></we-ui-uploads>
            </el-form-item>
            <el-form-item label="标题：">
                      <el-input  v-model="form.helpTitle"   style="width: 50%;"></el-input>
             </el-form-item>
             <el-form-item label="编辑器：" >
                <!-- <vue-editor :content="f.proStatement" @onEditorChange="onEditorChange"  
                    :uploadUrl="uploadUrl"></vue-editor> -->
                    <vue-editor ref="myTextEditor"
                    :content="form.helpContent" @onEditorChange="onEditorChange($event)"></vue-editor>
             </el-form-item>
              <div style="margin-left: 150px;">
                <el-button
                        type="primary"
                        @click="submit()" :disabled="!form.helpTitle" :loading="loading">保 存
                </el-button>
            </div>
          </el-form>     
    </div>
</template>
<style>

</style>
<script>
    export default {
        data() {
            return {
                pageInfo: {
                    pageNo: 1,
                    pageSize: 1,
                    totalRows: 1,
                    rows:[]
                },
                pageInfo2: {
                    pageNo: 1,
                    pageSize: 1,
                    totalRows: 1,
                    rows:[]
                },
                dialogVisible: false,
                table_loading: false,
                tableData: [],
                form: {
                    helpId:'',
                    helpIcon: [],
                    helpTitle:'',
                    helpContent:''
                },
                loading:false
            }
        },
        created(){
            this.fetchData()
        },
        methods: {
            fetchData () {
                let rid =this.$route.params.id
                if ( rid=== 'add') return;
                this.dataApi.ajax('singleSysHelp', {helpId:rid}, res => {
                    if (res.responseType === 'S') {
                        this.form = res.sysHelpPojo
                        this.form.helpIcon = [res.sysHelpPojo.helpIcon]
                    }
                });
            },
            submit(){
                if (this.form.helpIcon == '') {
                      this.showMsg('请上传图片','warning')
                       return;
                  }

                let obj=generateObj(this.form)
                obj.helpIcon=obj.helpIcon+''
                
                this.loading=true
               
                if (!obj.helpId) {
                    this.dataApi.ajax('addSysHelp',obj, res => {
                        if (res.responseType ==='S') {
                              this.showMsg('添加成功')
                              this.goBack()
                        }
                        this.loading=false
                    });
                } else {
                    this.dataApi.ajax('editSysHelp',obj, res => {
                        if (res.responseType === 'S') {
                             this.showMsg('修改成功')
                             this.goBack()
                        }
                        this.loading=false
                    });
                }
               

            },
            uploading(f) {
               this.loading=true;
               this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                    //console.log(res)
                    if (res.responseType == 'S') {
                        f.images.splice(f.index,1,res.filePath)
                        this.loading=false
                    }
                });

            },
             onEditorChange(e) {
                this.form.helpContent = e.html
            }
        }
    }
</script>
