<template>
    <div class="about-us">
        <el-row :span="24" style="background-color: #fff;padding: 20px 5px;margin: 20px 0;">
                 <el-button
                        type="primary"
                        @click="goBack()" style="margin-left: 50px;margin-bottom: 20px;">返回
                     </el-button>
                <el-form label-width="120px" class="demo-ruleForm" style="width: 90%;">

                    <el-form-item :label="title" label-width="130px">
                        <!-- <vue-editor :content="f.proStatement" @onEditorChange="onEditorChange"  
                            :uploadUrl="uploadUrl"></vue-editor> -->
                            <vue-editor ref="myTextEditor"
                            :content="f.textContent" @onEditorChange="onEditorChange($event)"></vue-editor>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="submitForm()">保存</el-button>
                        <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
                    </el-form-item>
                </el-form>
        </el-row>
    </div>
</template>
<style>

</style>
<script>
    export default {
        data() {
            return {
                f: {
                    textContent: '',
                    textCode:''
                },
                title:'',
                loading:false,
                id:0
            }
        },
        created(){
            let urlPram = getRequestParam(location.hash)
            this.id = urlPram.id
            this.title = decodeURI(urlPram.title)
            this.fetchData()
        },
        methods: {
            fetchData() {
                this.dataApi.ajax('singleSysTextInfo',{textCode:this.id}, res => {
                    if (res.responseType === 'S') {
                        this.f = res
                    }
                });
            },
            submitForm() {
                this.dataApi.ajax('editSysTextInfo',this.f, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('修改成功')
                    }
                });
            },
            onEditorChange(e) {
                this.f.textContent = e.html
            }
        }
    }
</script>
