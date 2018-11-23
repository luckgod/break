<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
          
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="用户名" value="userNickName"></el-option>
                            <el-option label="用户ID" value="userId"></el-option>
                            <el-option label="注册手机号" value="userMobile"></el-option>
                            <el-option label="真实姓名" value="userName"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;"></el-input>
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
                    width="120"
                    label="用户ID">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="用户名">
                    <template scope="scope">
                        <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank" ><span class="pointer">{{ scope.row.userName}}</span></router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="realName"
                    label="真实姓名">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="注册手机号">
            </el-table-column>
            <el-table-column
                    prop="cumu_Offset"
                    sortable='custom'
                    label="累计掉落抵用券">
                    <template scope="scope">
                       <span>{{ scope.row.cumuOffset }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="cumu_Bonus"
                    sortable='custom'
                    label="账目累计奖励券">
                    <template scope="scope">
                       <span>{{ scope.row.cumuBonus }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="cumu_Value"
                    sortable='custom'
                    label="真实累计奖励券">
                    <template scope="scope">
                       <span>{{ scope.row.cumuValue }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="dyna_Ratio"
                    sortable='custom'
                    label="计算掉落率(万分之)">
                    <template scope="scope">
                       <span>{{ scope.row.dynaRatio}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="adju_Ratio"
                    sortable='custom'
                    label="调整掉落率(万分之)">
                    <template scope="scope">
                       <span>{{ scope.row.adjuRatio}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="掉率生效时间"
                    width="200px">
                    <template scope="scope">
                       {{ scope.row.begTime }}<span v-if="scope.row.begTime">至</span>{{ scope.row.endTime }}
                    </template>
            </el-table-column>
            <el-table-column
                    prop="pay_In_Ratio"
                    sortable='custom'
                    label="回本率">
                    <template scope="scope">
                       <span>{{ scope.row.payInRatio }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="pay_In_Ratio"
                    label="操作">
                    <template scope="scope">
                        <el-button type="primary" @click="changeRate(scope.row)" size="small" v-if="powerShow('修改掉落率')">修改掉落率</el-button>
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

        <!--掉率修改-->
        <el-dialog title="掉率修改" v-model="rateDialog" size="tiny" >
            <el-form  style="width: 85%;" label-width="100px">
                <el-form-item label="掉落率:">
                            万分之
                    <el-input  v-model="rateForm.userRatio" style="width: 40%"></el-input>
                </el-form-item>
              <!--   <el-form-item label="启用状态：">
                        <el-radio class="radio" label="1" v-model="rateForm.enableState" style="margin: 0">系统掉率</el-radio>
                        <el-radio class="radio" label="2" v-model="rateForm.enableState">推荐掉率</el-radio>
                        <el-radio class="radio" label="3" v-model="rateForm.enableState">调整掉率</el-radio>
                </el-form-item> -->
                <el-form-item label="开始时间：">
                        <el-date-picker 
                        type="date" 
                        placeholder="开始时间" 
                        v-model="startTime" 
                        :picker-options="pickerOptions1"
                        style="width:200px;">    
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="结束时间：">
                        <el-date-picker 
                        type="date" 
                        placeholder="结束时间" 
                        v-model="endTime" 
                        :picker-options="pickerOptions1"
                        style="width:200px;">    
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input  v-model="rateForm.remark" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rateDialog = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submitRate()" :disabled="!rateForm.userRatio || !startTime || !endTime">提 交</el-button>
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
                formInline: {
                    type: 'userNickName',
                    userMobile: '',
                    userNickName: '',
                    userName:'',
                    userId:'',
                    name:'',
                    sort:'PAY_IN_RATIO',
                    desc:'DESC',
                    pageNum:1,
                    pageSize:10
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos: []
                },
                formLabelWidth: '120px',
                rateDialog: false,
                loading:false,
                rateForm:{
                  userRatio:'',
                  startTime:'',
                  endTime:'',
                  userCode:'',
                  remark:'',
                },
                pickerOptions1: {
                      disabledDate(time) {
                        return time.getTime() < Date.now()-3600 * 1000 * 24;
                      },
                },
                startTime:'',
                endTime:''

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
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageRatio', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                       this.pageInfo = res
                    }
                });

            },
            changeType(){
                this.formInline.userNickName=''
                this.formInline.userId=''
                this.formInline.userMobile=''
                this.formInline.userName=''
            },
            handleCurrentChange(val) {
               this.fetchData(val)            
            },
            edit(id){
                this.$router.push('/user/user_detail/' + id)
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
            changeRate(item){
                this.rateDialog=true
                this.rateForm={
                  userRatio:item.adjuRatio,
                  begTime:item.begTime,
                  endTime:item.endTime,
                  userCode:item.userId,
                  remark:'',
                }
                this.startTime=item.begTime
                this.endTime=item.endTime
            },
            submitRate(){
                if (!this.rateForm.userRatio || !isFloat(this.rateForm.userRatio)) {
                    this.$message({
                            type: 'warning',
                            message: '掉落率不正确!'
                     });
                    return false;
                }
                if (this.startTime && this.endTime) {
                    this.rateForm.begTime=dateFormat(this.startTime,'y-m-d')
                    this.rateForm.endTime=dateFormat(this.endTime,'y-m-d')
                    if (this.rateForm.begTime>this.rateForm.endTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                    }
                }
                if (this.startTime&&!this.endTime) {
                     this.$message({
                          type: 'warning',
                          message: '请选择结束时间'
                      });
                     return;
                }
                if (!this.startTime&&this.endTime) {
                     this.$message({
                          type: 'warning',
                          message: '请选择开始时间'
                      });
                     return;
                }
                this.loading=true
                this.dataApi.ajax('editUserRatio',this.rateForm, res => {
                        this.showMsg('修改成功')
                        this.loading=false
                        this.rateDialog=false
                        this.fetchData(1)

                 });
            }

        }
    }
</script>
