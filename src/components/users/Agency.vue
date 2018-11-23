<template>
    <div class="customer">
        <el-row :span="24" style="margin:26px 0;">
             <el-button  @click="$router.push('/user/user_list')" type="primary" >返回</el-button>            
        </el-row>
        <div class="padding_bg">
        <div  class="type_list">
                 <span style="cursor: pointer" @click="$router.replace('/user/user_detail/'+$route.params.id)">用户资料</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/treasure_record/'+$route.params.id)">财富记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/transaction_detail/'+$route.params.id)">交易明细</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/receive_record/'+$route.params.id)">领取红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/send_detail/'+$route.params.id)">发送红包记录</span>
                 <span class="choosed">代理记录</span>
        </div> 
        <el-row style="padding: 20px 0;">
            <el-col :span="24">
                <el-button type="primary" @click="add()">新增代理</el-button> 
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
                    prop="cityName"
                    label="代理主城">
            </el-table-column>
            <el-table-column
                    prop="agentPrice"
                    label="代理金额(元)">
            </el-table-column>
            <el-table-column
                    prop="startTime"
                    label="代理开始时间">
            </el-table-column>
            <el-table-column
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
                        <span class="pointer" @click="deleteById(scope.row.recordId)" v-if="scope.row.stat==1">解约</span>
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
        </div>


        <!--新增代理-->
        <el-dialog title="新增代理" v-model="dialogVisible">
            <el-form  class="demo-form-inline">
                    <el-form-item label="支付金额：">
                         <el-input  v-model="info.agentPrice" style="width: 150px;"></el-input> 元
                    </el-form-item>
                    <el-form-item label="代理主城：">
                         <el-select v-model="info.province" placeholder="省份" style="width: 120px;"  @change="fetchArea(info.province,'city',1)">
                         <el-option v-for="item in province" :label="item.name" :value="item.cityCode"></el-option>
                        </el-select>
                        <el-select v-model="info.city" placeholder="市" style="width: 120px;"  @change="fetchArea(info.city,'area',2)">
                            <el-option v-for="item in city" :label="item.name" :value="item.cityCode"></el-option>
                        </el-select>
                        <el-select v-model="info.area" placeholder="区" style="width: 120px;">
                            <el-option v-for="item in area" :label="item.name" :value="item.cityCode"></el-option>
                        </el-select>
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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submit">提 交</el-button>
            </div>
        </el-dialog>

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
                formInline: {
                    pageNum:1,
                    sort:'CRE_TIME',
                    desc:'desc',
                    pageSize:10,
                    userId:'',
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                dialogVisible:false,
                dialogVisible2:false,
                startTime1:'',
                endTime1:'',
                info:{
                    province:'',
                    city:'',
                    area:'',
                    userId:'',
                    agentPrice:'',
                    startTime:'',
                    endTime:'',
                    cityNum:'',
                    recordId:'',
                    cityName:''
                },
                province:[],
                city:[],
                area:[],
                pickerOptions1: {
                      disabledDate(time) {
                        return time.getTime() < Date.now()-3600 * 1000 * 24;
                      },
                },
            }
        },
        created(){
        
        },
        activated() {
            this.formInline.userId=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
            this.fetchArea(0,'province',1);
  
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
            fetchArea(parentCode, type, rank) {
                if (parentCode===0 || parentCode>0) {
                    this.dataApi.ajax('selectSysCity', {cityCode: parentCode}, res => {
                        if (res.responseType === 'S') {
                               this[type] = res.dtos
                                if (rank === 1) {
                                    this.info.city = ''
                                    this.info.area = ''
                                } else if (rank === 2) {
                                    this.info.area = ''
                                }
                                return false;
                        }
                    });
                }else{
                    this.info.city = ''
                    this.info.area = ''
                }

            },
            add(){
                this.info={
                    userId:this.$route.params.id,
                    agentPrice:'',
                    startTime:'',
                    endTime:'',
                    cityNum:'',
                    province:'',
                    city:'',
                    area:'',
                }
                this.city=[];
                this.area=[];
                this.startTime1='';
                this.endTime1='';
                this.dialogVisible=true
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
 
                if (!this.info.recordId) {
                     if (fetchNum(this.info.agentPrice)>2) {
                        this.showMsg('代理价格只能精确到分','warning');
                        return;
                     }
                     if (this.info.city=='') {
                        this.showMsg('请选择市','warning');
                        return;
                     }
                     if (!this.startTime1||!this.endTime1) {
                            this.showMsg('请选择开始和结束时间','warning')
                            return;
                     }else{
                         if (this.startTime1>this.endTime1) {
                             this.showMsg('开始时间不能大于结束时间','warning')
                             return;
                          }else{
                             this.info.startTime=dateFormat(this.startTime1,'y-m-d')
                             this.info.endTime=dateFormat(this.endTime1,'y-m-d') 
                          }
                     }
                     var data={
                         userId:this.$route.params.id,
                         agentPrice:this.info.agentPrice,
                         startTime:this.info.startTime,
                         endTime:this.info.endTime,
                         cityNum:this.info.area
                     }
                     this.loading=true
                     this.dataApi.ajax('addCityAgentRecord',data, res => {
                        this.loading=false;
                        if (res.responseType === 'S') {
                            this.showMsg('新增成功');
                            this.dialogVisible=false;
                            this.fetchData(this.pageInfo.pageNum);
                        }
                    });
                }else{
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
            },
            deleteById(id){
                this.$confirm('确定解约?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                   this.dataApi.ajax('delCityAgentRecord',{recordId:id}, res => {
                        if (res.responseType === 'S') {
                              this.showMsg('解约成功')
                              this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                }).catch(() => {
        
                });
            }
            

        }
    }
</script>
