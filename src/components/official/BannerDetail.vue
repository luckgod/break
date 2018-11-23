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

        <el-form :model="form" style="background-color: #FFFFFF;padding: 20px 0;">
            <el-form-item label="图片：" label-width="150px">
                <we-ui-uploads :images="form.imgUrl"
                               :maxCount="1"
                               :maxSize="1024*512"
                               @uploading="uploading"></we-ui-uploads>
            </el-form-item>
            <el-form-item label="跳转：" label-width="150px">
                <el-radio-group v-model="form.isRedirect">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
             <el-form-item label="链接：" label-width="150px">
                      <el-input auto-complete="off" v-model="form.redirectUrl"   style="width: 50%;"></el-input>
             </el-form-item>
             <el-form-item label="停留时间(秒)：" label-width="150px">
                      <el-input auto-complete="off" v-model="form.stayTime"   style="width: 50%;"></el-input>
             </el-form-item>
              <div style="margin-left: 150px;">
                <el-button
                        type="primary"
                        @click="submit()" :disabled="!form.stayTime" :loading="loading">保 存
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
                    imgCode:'',
                    imgUrl: [],
                    isRedirect:'0',
                    redirectUrl:'',
                    stayTime:'',
                    isShow:'1'
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
                this.dataApi.ajax('singleSysAppStartImg', {imgCode: rid}, res => {
                    if (res.responseType === 'S') {
                        this.form = res
                        this.form.imgUrl = [res.imgUrl]
                    }
                });
            },
            submit(){
                if (this.form.imgUrl == '') {
                      this.showMsg('请上传图片','warning')
                       return;
                  }

                let obj=generateObj(this.form)
                obj.imgUrl=obj.imgUrl+''

                this.loading=true
               
                if (!obj.imgCode) {
                    this.dataApi.ajax('addSysAppStartImg',obj, res => {
                        if (res.responseType ==='S') {
                              this.showMsg('添加成功')
                              this.loading=false
                              this.$router.push('/official/banner')
                        }
                    });
                } else {
                    this.dataApi.ajax('editSysAppStartImg',obj, res => {
                        if (res.responseType === 'S') {
                             this.loading=false
                             this.showMsg('修改成功')
                             this.$router.push('/official/banner')
                        }
                    });
                }
               

            },
            handleCurrentChange(val) {

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

            }
        }
    }
</script>
