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
                 <span class="choosed">领取红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/send_detail/'+$route.params.id)">发送红包记录</span>
                 <span style="cursor: pointer"  @click="$router.replace('/user/agency/'+$route.params.id)">代理记录</span>
        </div> 
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="按红包类型：">
                            <el-select v-model="formInline.enveTypeFlag" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in urgentList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="红包来源：">
                             <el-input v-model="formInline.userName" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="按红包范围：">
                            <el-select v-model="formInline.enveRange" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in areaList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="领取时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData()">查询</el-button> 
                        <el-button type="primary" @click="statistics()">统计</el-button>
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
                    prop="enveCode"
                    label="红包编号">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="红包来源">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.distributeUser" target="_blank" v-if="scope.row.enveCode!='0'"><span class="pointer">{{ scope.row.userName}}</span></router-link>
                       <span v-else>{{ scope.row.userName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop='receive_Time'
                    label="领取时间">
                    <template scope="scope">
                        <span>{{scope.row.receiveTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="红包类型">
                    <template scope="scope">
                        <span>{{findData(scope.row.enveTypeFlag)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="amount"
                    sortable='custom'
                    label="领取金额">
            </el-table-column>
            <el-table-column
                    prop="quantity_Of_Shares"
                    sortable='custom'
                    label="股数">
                    <template scope="scope">
                        <span>{{scope.row.quantityOfShares}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="sharePrices"
                    label="领取时股价">
            </el-table-column>
            <el-table-column
                    prop="enveRange"
                    label="红包范围">
                    <template scope="scope">
                            <span>{{findArea(scope.row.enveRange)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="receiveDetailedArea"
                    label="领取地址">
            </el-table-column>
            <el-table-column label="红包详情" width="80">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="detail(scope.row.enveCode)" v-if="scope.row.enveCode!='0'">查看</el-button>
                    <span v-else>-</span>
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


         <!--提现金额统计-->
        <el-dialog title="领取红包记录统计" v-model="dialogVisible3">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="按红包类型：">
                    <el-select v-model="formInline.enveTypeFlag" style="width: 140px;" :disabled="true">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.text" :value="item.value" v-for="item in urgentList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="红包来源：">
                     <el-input v-model="formInline.userName" style="width: 150px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="按红包范围：">
                    <el-select v-model="formInline.enveRange" style="width: 120px;" :disabled="true">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.text" :value="item.value" v-for="item in areaList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="领取时间：">
                    <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                    到
                    <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                </el-form-item>

            </el-form>
            <hr>
            <div class="sumMap">
                <div class="sumMap_num">
                    {{ sumMap.quantityOfShares }}
                </div>
                <div>
                   红包股数
                </div>
            </div>
             <div class="sumMap">
                <div class="sumMap_num">
                     {{ sumMap.countEnve }}
                </div>
                <div>
                   领取个数
                </div>
            </div>
             <div class="sumMap">
                <div class="sumMap_num">
                     {{ sumMap.amount }}
                </div>
                <div>
                   红包股价值
                </div>
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
                formInline: {
                    pageNum:'',
                    sort:'RECEIVE_TIME',
                    desc:'desc',
                    beginTime:'',
                    endTime:'',
                    pageSize:10,
                    enveTypeFlag:'',
                    userName:'',
                    enveRange:'',
                    receiveFlag:'1'
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                urgentList:[{ text: '系统红包', value: '0' },{ text: '个人普通红包', value: '1' },{ text: '个人大红包', value: '2' },{ text: '个人加密红包', value: '3' },{ text: '商品红包', value: '5' }],
                areaList:[{ text: '全国', value: '0' },{ text: '1km', value: '1' },{ text: '区', value: '2' },{ text: '市', value: '3' }],
                enableStateArr: ['审核中', '已通过', '已拒绝','已挂起'],
                gridData: [],
                checked: [],
                checkAll: false,
                isIndeterminate: true,
                arr: [],
                loading2:false,
                dialogVisible:false,
                dialogVisible2:false,
                dialogVisible3:false,
                f:{
                  arrivalDate:'',
                  startDate:'',
                  honourStat:'',
                  startDateEnd:'',
                  arrivalDateEnd:'',
                  honourType:''
                },
                startTime1:'',
                endTime1:'',
                refusal:'',
                sumMap:{}
            }
        },
        created(){
        
        },
        activated() {
            this.formInline.receiveUser=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
  
        },
        methods: {

            fetchData (page = 1) {
                if (this.startTime1 && this.endTime1) {
                       this.formInline.beginTime=dateFormat(this.startTime1)
                       this.formInline.endTime=dateFormat(this.endTime1) 
                    if (this.formInline.beginTime>this.formInline.endTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.beginTime=''
                        this.formInline.endTime=''
                    }
                    if (this.startTime1&&!this.endTime1) {
                         this.$message({
                              type: 'warning',
                              message: '请选择结束时间'
                          });
                         return;
                    }
                    if (!this.startTime1&&this.endTime1) {
                         this.$message({
                              type: 'warning',
                              message: '请选择开始时间'
                          });
                         return;
                    }
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.dataApi.ajax('selectPageUserEnve',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            detail(id){
               this.$router.push('/user/red_detail/'+id)
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
                this.fetchData(this.pageInfo.pageNo)
            },
            statistics(){   //统计
                 if (this.startTime1 && this.endTime1) {
                       this.formInline.beginTime=dateFormat(this.startTime1)
                       this.formInline.endTime=dateFormat(this.endTime1) 
                  if (this.formInline.beginTime>this.formInline.endTime) {
                       this.$message({
                        type: 'warning',
                        message: '开始时间不能大于结束时间'
                        });
                       return;
                      }
                  }else{
                      this.formInline.beginTime=''
                      this.formInline.endTime=''
                  }
                  if (this.startTime1&&!this.endTime1) {
                       this.$message({
                            type: 'warning',
                            message: '请选择结束时间'
                        });
                       return;
                  }
                  if (!this.startTime1&&this.endTime1) {
                       this.$message({
                            type: 'warning',
                            message: '请选择开始时间'
                        });
                       return;
                  }
                this.dataApi.ajax('sumEnveSys',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.countEnve==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible3=true
                                 this.sumMap=res
                             }
                        } 
                    });
            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            findData(type){
                    for (var i = this.urgentList.length - 1; i >= 0; i--) {
                        if (type==this.urgentList[i].value) {
                            return this.urgentList[i].text
                        }
                    }
            },
            findArea(type){
                    for (var i = this.areaList.length - 1; i >= 0; i--) {
                        if (type==this.areaList[i].value) {
                            return this.areaList[i].text
                        }
                    }
            },

        }
    }
</script>
