<template>
    <div class="bg">
        <div style="position: absolute;color: white;top:35%;left: 20%;">
            <div style="font-size: 2.3vw;">麦家鸿包后台管理系统</div>
            <div style="font-size: 1.5vw;margin-top: 18%">M+ red bonus</div>
            <div style="font-size: 1.5vw;">Background management system</div>
        </div>
        <el-card class="box-card login_card">
            <el-form :model="adminInfo" :rules="rules2" ref="adminInfo"  class="demo-ruleForm login_form">
                <el-form-item label="" prop="account_number">
                    <el-input type="text" v-model.trim="adminInfo.phone" :maxlength="32" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input type="password" v-model.trim="adminInfo.password"  :maxlength="32" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="adminInfo.code" :maxlength="6"  style="width: 75%" placeholder="验证码"></el-input> 
                    <el-button  id="code" @click="getcode()" :disabled="cantclick == true" size="small" style="display: inline-block;height:4.8vh">获取验证码</el-button> 
                </el-form-item>
                <el-form-item>
                    <!-- <el-button type="primary" @click="submitForm('adminInfo')" :loading="loading" style="width: 100%;">登录</el-button> -->
                    <div class="bt" @click="submitForm('adminInfo')" :loading="loading">登 录</div>
                    <!--<el-button type="default" @click="resetForm('adminInfo')">重置</el-button>-->
                </el-form-item>
            </el-form>
        </el-card> 
    </div>
    
</template>
<style>

.el-form-item__label {
    text-align: center;
}

.bg{
    background: url(../../assets/images/bg2.png);
    background-repeat: no-repeat;
    background-size: 100% 90%;
    height: 100vh;

}
.login_form input{
    height:5vh;
    border: 1px solid #E7EAF1;
}
.bt{

    background:url(../../assets/images/btbg.png);
    background-size: 100% 100%;
    color: white;
    text-align: center;
    font-size: 16px;
    height:6vh;
    line-height: 5vh;
    cursor: pointer;
}
.login_card{
    width:23%;
    position: absolute;
    right:20%;
    top: 32%;
    height: 45%;
    border-radius: 0;
    box-shadow:0 8px 18px 0 rgba(0,0,0,.12), 0 0 20px 0 rgba(0,0,0,.04);
    padding-top: 2vh;
    min-width: 386px;
    max-height: 320px;
}


</style>
<script>
    export default {
        data() {
            return {
                loading: false,
                //imgSrc:HOST+'admin/common/captcha',
                adminInfo: {
                    phone: '',
                    password: '',
                    // imgCode:'',
                    headUserId:'',
                    code:''
                },
                rules2: {
                    phone: [
                        {required: true, message:'请填写账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message:'请填写密码', trigger: 'blur'}
                    ]

                },
                cantclick:false
            };
        },
        created() {
            document.addEventListener('keydown', this.keyDownLogin)
        },
        mounted() {

        },
        destroyed() {
            document.removeEventListener('keydown', this.keyDownLogin)
        },
        methods: {
            keyDownLogin(e) {
                if (!e) {
                    e = window.event;
                }
                if ((e.keyCode || e.which) === 13) {
                    this.submitForm('adminInfo');
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }

                    this.login();

                });
            },
            // resetForm(formName) {
            //     this.$refs[formName].resetFields();
            // },
            login() {
                 if (!this.adminInfo.phone) {
                     this.$message({
                          message: '请输入管理员账号',
                          type: 'warning'
                        });
                    return;
                }
                if (!this.adminInfo.code) {
                     this.$message({
                          message: '验证码不能为空',
                          type: 'warning'
                        });
                    return;
                }
                var pswd=this.encrypt(this.adminInfo.password);
                this.dataApi.ajax('adminLogin',{
                    acctno:this.adminInfo.phone,
                    adminPwd:pswd,
                    code:this.adminInfo.code
                }, res => {
                    if (res.responseType === 'S') {
                         this.showMsg('登录成功')
                         sessionStorage.setItem('permission',JSON.stringify(res))
                         this.$router.replace('/home')
                    } 
                })
                
            },
            // code(e){
            //     e.target.src = this.imgSrc+'?'+ new Date().getTime()
            // }
             encrypt(str) {
                var code = 956132157;
                var result=''
                for (var i = 0; i < str.length; i++) {//遍历字符数组
                     result += (str.charCodeAt(i) ^ code);//对每个数组元素进行异或运算，异或的值可以自己选择
                }
                return result;
            },
            getcode(){
                if (!this.adminInfo.phone) {
                     this.$message({
                          message: '请输入管理员账号',
                          type: 'warning'
                        });
                    return;
                }
                var _this=this
                var data={
                        acctno:this.adminInfo.phone
                    }
                this.dataApi.ajax('sendAdminMsg',data, res => {
                    if (res.responseType === 'S') {
                         
                         var i = 60;
                            var Code=document.getElementById("code");
                            var timer = setInterval(function(){
                                if(i== 0){
                                    Code.innerText="获取验证码"
                                    // Code.style.backgroundColor='#0AC0EF';
                                    
                                    clearInterval(timer)
                                    _this.cantclick=false
                                   
                                }else{
                                   Code.innerText=Math.floor(i)+'秒';
                                    --i;
                                    Code.style.width='80px';
                                    _this.cantclick=true;
                                }
                            },1000);
                    } 
               })
                
                    

            },
        }
    }
</script>