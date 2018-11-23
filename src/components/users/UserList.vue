<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="用户名" value="userName"></el-option>
                            <el-option label="用户ID" value="userId"></el-option>
                            <el-option label="手机号" value="phone"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="按会员身份:">
                        <el-col :span="18">
                            <el-select v-model="formInline.userIdentity">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in identityArray" :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-col>

                    </el-form-item>
                    <el-form-item label="按状态:" label-width="60px">
                        <el-select v-model="formInline.userStat" style="width: 120px;" >
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已启用" value="1"></el-option>
                            <el-option label="已禁用" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否代理:">
                        <el-select v-model="formInline.agent" style="width: 120px;" >
                            <el-option label="全部" value=""></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="fetchData(1)">查询</el-button>
                     
                </el-form>
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
                    prop="userId"
                    label="用户ID">
            </el-table-column>
            <el-table-column
                    label="用户名">
                    <template scope="scope">
                       <span  class="pointer" @click="$router.push('/user/user_detail/'+scope.row.userId)">{{ scope.row.userName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="手机号">
                    <template scope="scope">
                       <span>{{ scope.row.phone }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    label="领红包范围(m)"
                    prop="territorial_Limit">
                    <template scope="scope">
                        <span>{{ scope.row.territorialLimit }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="身份">
                    <template scope="scope">
                         <span>{{ findIdentity(scope.row.userIdentity) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="代理">
                    <template scope="scope">
                         <span>{{ scope.row.agent==1? '是':'否'}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    label="拥有主城"
                    prop="territory_Number">
                    <template scope="scope">
                        <span>{{ scope.row.territoryNumber }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    label="代理主城"
                    prop="city_Number">
                    <template scope="scope">
                        <span>{{ scope.row.cityNumber }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    width="140"
                    sortable='custom'
                    prop="cre_Time"
                    label="注册时间">
                <template scope="scope">
                    <span>{{scope.row.creTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="状态">
                <template scope="scope">
                    <span>{{scope.row.userStat == 1?'已启用':'已禁用'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="新增商家权限">
                <template scope="scope">
                    <span style="cursor: pointer;"  v-if="scope.row.businessPower==1"><img src="../../assets/images/on.png"  width="50" height="50" @click="power(scope.row.userId,'关闭')"></span>
                    <span style="cursor: pointer;" v-else><img src="../../assets/images/guan.png"  width="50" height="50" @click="power(scope.row.userId,'开启')"></span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="danger" size="small"
                               v-if="scope.row.userStat==1"
                               @click="quxiao(scope.row.userId,'禁用')">禁用
                    </el-button>
                    <el-button 
                            type="success" 
                            size="small" 
                            v-else
                            @click="quxiao(scope.row.userId,'启用')">启用
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
                    :total="pageInfo.count"
                    >
            </el-pagination>
        </div>
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
                formInline: {
                    type: 'userName',
                    userName:'',
                    phone:'',
                    userIdentity:'',
                    name:'',
                    userStat:'',
                    sort:'CRE_TIME',
                    desc:'DESC',
                    pageNum:1,
                    pageSize: 10,
                    agent:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                arr: [{text:'手机号',value:'手机号'},{text:'用户名',value:'用户名'},{text:'用户ID',value:'用户ID'}],
                

            }
        },
        created(){
            
        },
        activated() {
            //this.fetchData(this.pageInfo.pageNum);
        },
        watch:{
            'formInline.name'(val,oldVal) {
                //console.log(val)
                this.formInline[this.formInline.type] = this.formInline.name
            }
        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectUser', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            changeType(){
                this.formInline.userName=''
                this.formInline.userId=''
                this.formInline.phone=''
            },
            handleCurrentChange(val) {
               this.fetchData(val)            
            },
            quxiao(id, type) {
                    var state=''
                    if (type=='启用') {
                        state=1
                    }else{
                        state=2
                    }
                  this.$confirm('确定'+type+'?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.dataApi.ajax('editUser',{userId:id,userStat:state}, res => {
                        if (res.responseType === 'S') {
                           this.showMsg(type+'成功')
                           this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                  
                }).catch(() => {
                          
                });
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
                this.formInline.sort=column.prop.toUpperCase()
                this.fetchData(this.pageInfo.pageNum)
            },
            power(id,type){
                var state=''
                    if (type=='开启') {
                        state=1
                    }else{
                        state=0
                    }
                  this.$confirm('确定'+type+'?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.dataApi.ajax('editUser',{userId:id,businessPower:state}, res => {
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
