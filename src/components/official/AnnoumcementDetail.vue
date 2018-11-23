<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">              
                
                    <el-button
                        type="primary"
                        @click="fanhui()">返回
                     </el-button>
            
            </el-col>
        </el-row>

        <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;height: 100%">

                <el-form-item label="标题：" label-width="150px">
                    <el-input  v-model="form.noticeTitle" style="width: 40%;"></el-input>
                </el-form-item>
                <el-form-item label="副标题：" label-width="150px">
                    <el-input  v-model="form.secTitle" style="width: 40%;"></el-input>
                </el-form-item>
                <el-form-item label="文章内容：" label-width="150px">
                     <vue-editor :content="form.content" @onEditorChange="onEditorChange" style="width: 80%;"></vue-editor>
                 </el-form-item>
                 <el-form-item style="text-align: left;margin-top: 30px;margin-left: 150px;">
                     <el-button type="primary" :loading="loading" @click="submitForm" :disabled="!form.noticeTitle || !form.secTitle || !form.content">提交</el-button>
                     <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
                 </el-form-item>
        </el-form>
  
    </div>
</template>
<style>

</style>
<script>
    export default {
        data() {
            return {
                loading:false,
                form:{
                    noticeCode:'',
                    noticeTitle:'',
                    secTitle:'',
                    content:''
                },
                typeList:[],
                time:[],

            }
        },
        created(){
            this.fetchData();
        },
        methods: {     
            fanhui(){
                history.back(-1)
            },
            fetchData() {
                let rid =this.$route.params.id
                if ( rid=== 'add') return;
                this.dataApi.ajax('singleSysNotice', {noticeCode: rid}, res => {
                    //console.log(res)
                    if (res.responseType === 'S') {
                        this.form = res
                    }
                });
                
            },
            submitForm() {
                this.loading=true
                if (!this.form.noticeCode) {
                    this.dataApi.ajax('addSysNotice', this.form, res => {
                        //console.log(res)
                        if (res.responseType === 'S') {
                            this.showMsg('添加成功')
                            this.loading=false
                            this.$router.replace('/official/annoumcement')
                        }
                    });
                } else {
                    this.dataApi.ajax('editSysNotice', this.form, res => {
                        //console.log(res)
                        if (res.responseType === 'S') {
                            this.showMsg('修改成功')
                            this.loading=false
                            this.$router.replace('/official/annoumcement')
                        }
                    });
                }
            },
            onEditorChange(e) {
                this.form.content = e.html
            }
        }
    }
</script>
