<template>
    <div class="account">
            <el-row style="margin-top: 15px;padding: 20px 0;">
                <el-col :span="24">              
                        <el-button
                            type="primary"
                            @click="goBack()">返回
                         </el-button>
                </el-col>
            </el-row>
            <el-form :model="ruleForm" ref="ruleForm" style="width: 85%;">
                <el-form-item label="权限组名称:"
                              :label-width="formLabelWidth">
                    <el-input  v-model.trim="ruleForm.powerName"></el-input>
                </el-form-item>
                <el-form-item label="说明:" :label-width="formLabelWidth">
                  <el-input type="textarea" v-model="ruleForm.powerDescript" style="width: 100%;"></el-input>
                </el-form-item>
                <el-form-item label="管理权限："
                                :label-width="formLabelWidth">
                    <!--<el-checkbox-group v-model="ruleForm.group_menu">
                      <el-checkbox :label="item.fatherMenu" name="type" :value="item.menuId" v-for="item in group_menu"></el-checkbox>
                    </el-checkbox-group>-->
                    <el-tree
                            :data="group_menu"
                            show-checkbox
                            node-key="id"
                            :default-expanded-keys="selectKeys"
                            :default-checked-keys="selectKeys"
                            :check-strictly="true"
                            ref="tree"
                            :props="defaultProps">
                    </el-tree>
                  </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"
                           :loading="loading"
                           :disabled="!ruleForm.powerName || !ruleForm.powerDescript"
                           @click="submitForm">保 存</el-button>
            </div>
    </div>
</template>
<style>
    .account .el-dialog--small {
        width: 35%;
    }
</style>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                loading:false,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                ruleForm: {
                    powerCode:'',
                    powerName:'',
                    powerDescript: '',
                    userMenuDtos:[]
                },
                defaultProps: {
                    children: 'childrens',
                    label: 'label'
                },
                group_menu:[],
                selectKeys:[]
            }
        },
        created(){
             this.fetchData()
             this.fetchLabel()
        },
        // activated() {
            
        // },
        mounted(){

        },
        methods: {
            fetchData () {
                if (this.$route.params.id=='add') {
                    return
                }
                this.dataApi.ajax('singlePower',{powerCode:this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                        this.ruleForm=res.userPowerDto
                        this.selectKeys=res.userMenuDtos
    
                        // for (var i = this.group_menu.length - 1; i >= 0; i--) {

                        //     for (var j = this.group_menu[i].childrens.length - 1; j >= 0; j--) {
                                
                        //         if (this.group_menu[i].childrens[j].label=='权限组设置' && id!='AM15026818954720000000004') {
                        //             if (this.ruleForm.menuId.indexOf('权限组设置')==-1) {
                        //                 this.group_menu[i].childrens.splice(j,1)
                        //             }
                                   
                        //         }
                        //     }
                        // }
                    }
                });
            },
            fetchLabel () {
                // var  id = JSON.parse(sessionStorage.getItem('permission')).adminId
                this.dataApi.ajax('selectPowerMenu',null, res => {
                    if (res.responseType === 'S') {
                         this.group_menu = res.childrens
                        // for (var i = this.group_menu.length - 1; i >= 0; i--) {

                        //     for (var j = this.group_menu[i].childrens.length - 1; j >= 0; j--) {
                                
                        //         if (this.group_menu[i].childrens[j].label=='权限组设置' && id!='AM15026818954720000000004') {
                        //             if (this.ruleForm.menuId.indexOf('权限组设置')==-1) {
                        //                 this.group_menu[i].childrens.splice(j,1)
                        //             }
                                   
                        //         }
                        //     }
                        // }
                    }
                });

            },
            submitForm() {
                if (this.$refs.tree.getCheckedKeys().length==0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择权限!'
                    });
                    return;
                }
                this.loading=true
                if (this.ruleForm.powerCode!='') {
                    if (this.selectKeys.sort().toString()==this.$refs.tree.getCheckedKeys().sort().toString()) {
                       delete this.ruleForm.userMenuDtos
                    }else{
                       this.ruleForm.userMenuDtos=this.$refs.tree.getCheckedKeys() 
                    }
                    this.dataApi.ajax('editUserPower',this.ruleForm, res => {
                        if (res.responseType === 'S') {
                            this.showMsg('修改成功')
                            this.loading=false
                            this.$router.push('/set/level')
                        }
                    }); 
                }else{

                   var data={
                      userMenuDtos:this.$refs.tree.getCheckedKeys(),
                      powerDescript:this.ruleForm.powerDescript,
                      powerName:this.ruleForm.powerName
                    }
                    this.dataApi.ajax('addUserPower',data, res => {
                        if (res.responseType === 'S') {
                            this.showMsg('新增成功')
                            this.loading=false
                            this.$router.push('/set/level')
                        }
                    }); 
                }
                
            },
            // resetChecked() {
            //     this.$refs.tree.setCheckedKeys([]);
            // },
            // setCheckedKeys(arr) {
            //     console.log(arr)
            //     this.$refs.tree.setCheckedKeys(arr);
            // }
        }
    }
</script>
