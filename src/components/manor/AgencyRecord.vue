<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <h3><el-button type="primary" @click="goBack()">返回</el-button>&nbsp;&nbsp;{{ areaTitle }}代理记录</h3>
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
                    prop="identity"
                    label="当前代理用户名">
                    <template scope="scope">
                        <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank" >
                              <span class="pointer">{{ scope.row.userName}}</span>
                        </router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="userPhone"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="agentPrice"
                    label="代理金额(元)">
            </el-table-column>
            <el-table-column
                    prop="effectTime"
                    label="代理变更时间">
            </el-table-column>
            <el-table-column
                    prop="increment"
                    label="代理有效期">
                    <template scope="scope">
                        <span>{{scope.row.startTime}}~{{scope.row.endTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="serialNo"
                    label="操作">
                    <template scope="scope">
                        <span class="pointer" @click="edit(scope.row)">修改有效期</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="expiredTime"
                    label="代理失效时间">
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
      
        <!--修改有效期-->
        <el-dialog title="修改有效期" v-model="dialogVisible2">
            <el-form  class="demo-form-inline">
                    <el-form-item label="支付金额：">
                         <span>{{ info.agentPrice }}元</span>
                    </el-form-item>
                    <el-form-item label="代理主城：">
                         <span>{{ info.cityName }}</span>
                    </el-form-item>
                    <el-form-item label="代理有效期：">
                        <el-date-picker
                          v-model="startTime1"
                          type="date"
                          placeholder="开始时间"
                          :picker-options="pickerOptions1">
                        </el-date-picker>
                        到
                        <el-date-picker
                          v-model="endTime1"
                          type="date"
                          placeholder="结束时间"
                          :picker-options="pickerOptions1">
                        </el-date-picker>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submit">提 交</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<style>
.sumMap{
    width:49%;
    display: inline-block;
    text-align: center;
    font-size: 20px;
}
.sumMap_num{
    font-weight: bold;
    font-size: 25px
}
</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                loading:false,
                dialogVisible2:false,
                formInline: {
                    pageNum:'',
                    sort:'CRE_TIME',
                    desc:'desc',
                    pageSize:10,
                    cityNum:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos: []
                },
                info:{
                    agentPrice:'',
                    startTime:'',
                    endTime:'',
                    recordId:'',
                    cityName:''
                },
                formLabelWidth: '120px',
                startTime1:'',
                endTime1:'',
                areaTitle:'',
                pickerOptions1: {
                      disabledDate(time) {
                        return time.getTime() < Date.now()-3600 * 1000 * 24;
                      },
                },
            }
        },
        created(){
            let urlPram = getRequestParam(location.hash)
            // this.id = urlPram.id
            this.areaTitle = decodeURI(urlPram.cityName)
            this.formInline.cityNum=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
        },
        methods: {

            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.dataApi.ajax('selectPageCityAgentRecord',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
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
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            edit(item){
                this.info={
                    recordId:item.recordId,
                    agentPrice:item.agentPrice,
                    cityName:item.cityName,
                    startTime:'',
                    endTime:''
                }
                this.startTime1=item.startTime;
                this.endTime1=item.endTime;
                this.dialogVisible2=true
            },
            submit() {
 
                   if (!this.startTime1||!this.endTime1) {
                            this.showMsg('请选择开始和结束时间','warning')
                            return;
                     }else{
                         this.info.startTime=dateFormat(this.startTime1,'y-m-d')
                         this.info.endTime=dateFormat(this.endTime1,'y-m-d') 
                         if (this.info.startTime>this.info.endTime) {
                             this.showMsg('开始时间不能大于结束时间','warning')
                             return;
                          }
                     }
                    var data={
                        startTime:this.info.startTime,
                        endTime:this.info.endTime,
                        recordId:this.info.recordId
                    }
                    this.loading=true
                    this.dataApi.ajax('editCityAgentRecord',data, res => {
                        this.loading=false
                        if (res.responseType === 'S') {
                            this.showMsg('修改成功');
                            this.dialogVisible2=false;
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    }); 
            }

        }
    }
</script>
