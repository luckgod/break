<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="">
                             <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                  <el-option label="买家用户名" value="buyerName"></el-option>
                                  <el-option label="卖家用户名" value="sellerName"></el-option>
                              </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="按主城区域：">
                            <el-select v-model="formInline.province" placeholder="省份" style="width: 120px;"  @change="fetchArea(formInline.province,'city',1)">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in province" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>

                            <el-select v-model="formInline.city" placeholder="市" style="width: 120px;"  @change="fetchArea(formInline.city,'area',2)">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in city" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                            <el-select v-model="formInline.area" placeholder="区" style="width: 120px;" >
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in area" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="交易时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>                  
                        <el-button type="primary" @click="fetchData(1)">查询</el-button> 
                        <el-button type="primary" @click="statistics()">平台收益</el-button> 
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
                    sortable='custom'
                    prop="finish_Time"
                    label="交易时间">
                <template scope="scope">
                    <span>{{scope.row.finishTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="cityName"
                    label="交易主城">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="买家">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.buyerCode" target="_blank" >
                              <span class="pointer">{{ scope.row.buyerName}}</span>
                        </router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="卖家">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.sellerCode" target="_blank"
                        v-if="scope.row.sellerCode!=0">
                              <span class="pointer">{{ scope.row.sellerName}}</span>
                        </router-link>
                       <span v-else>{{ scope.row.sellerName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="prePrice"
                    label="原价（元）">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="现价（元）">
            </el-table-column>
            <el-table-column
                    prop="increment"
                    sortable='custom'
                    label="溢价金额（元）">
            </el-table-column>
            <el-table-column
                    prop="sellerProfit"
                    label="上任城主赚取金额（元）">
            </el-table-column>
            <el-table-column
                    prop="platformProfit"
                    label="平台收益">
            </el-table-column>
            <el-table-column
                    prop="expectNextPrice"
                    label="当前价（下一手价）（元）">
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

        <!--平台收益统计-->
            <el-dialog title="平台收益统计" v-model="dialogVisible">
                <el-form :inline="true" class="demo-form-inline">
                       <el-form-item label="">
                             <el-select v-model="formInline.type" style="width: 120px;" @change="changeType" 
                             :disabled="true">
                                  <el-option label="买家用户名" value="buyerName"></el-option>
                                  <el-option label="卖家用户名" value="sellerName"></el-option>
                              </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="按主城区域：">
                            <el-select v-model="formInline.province" placeholder="省份" style="width: 120px;"  @change="fetchArea(formInline.province,'city',1)" :disabled="true">
                                <el-option v-for="item in province" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                            <el-select v-model="formInline.city" placeholder="市" style="width: 120px;"  @change="fetchArea(formInline.city,'area',2)" :disabled="true">
                                <el-option v-for="item in city" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                            <el-select v-model="formInline.area" placeholder="区" style="width: 120px;" :disabled="true">
                                <el-option v-for="item in area" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="交易时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                        </el-form-item>  
                </el-form>
                <hr>
                <div class="sumMap">
                    <div class="sumMap_num">
                        {{ cutNum(sumMap.platformAllProfit,6) }}
                    </div>
                    <div>
                       平台收益
                    </div>
                </div>
                 <div class="sumMap">
                    <div class="sumMap_num">
                         {{ sumMap.recordCount }}
                    </div>
                    <div>
                       交易笔数
                    </div>
                </div>
                 <div class="sumMap">
                    <div class="sumMap_num">
                         {{ cutNum(sumMap.sellerAllProfit,6) }}
                    </div>
                    <div>
                       卖家收益
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
                    sort:'ORDER_TIME',
                    desc:'desc',
                    pageSize:10,
                    type:'buyerName',
                    province:'',
                    city:'',
                    area:'',
                    leftFinishTime:'',
                    rightFinishTime:'',
                    buyerName:'',
                    sellerName:'',
                    orderStat:'10002',
                    name:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                urgentList:[{ text: '系统红包', value: '系统红包' },{ text: '个人红包', value: '个人红包' },{ text: '个人加密红包', value: '个人加密红包' }],
                areaList:[{ text: '一公里', value: '一公里' },{ text: '全国', value: '全国' },{ text: '全区/县', value: '全区/县' }],
                dialogVisible:false,
                startTime1:'',
                endTime1:'',
                refusal:'',
                sumMap:{
                    platformAllProfit:'',
                    recordCount:'',
                    sellerAllProfit:''

                },
                province:[],
                city:[],
                area:[],
            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchArea(0,'province',1)
  
        },
        methods: {

            fetchData (page = 1) {
                if (this.startTime1 && this.endTime1) {
                    this.formInline.leftFinishTime=dateFormat(this.startTime1)
                    this.formInline.rightFinishTime=dateFormat(this.endTime1) 
                    if (this.formInline.leftFinishTime>this.formInline.rightFinishTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.leftFinishTime=''
                        this.formInline.rightFinishTime=''
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
                this.formInline[this.formInline.type] = this.formInline.name
                if (this.formInline.province!='') {
                    this.formInline.cityNum=this.formInline.province
                }else{
                    this.formInline.cityNum=''
                }
                if (this.formInline.city!=''){
                   this.formInline.cityNum=this.formInline.city
                }
                if (this.formInline.area!=''){
                   this.formInline.cityNum=this.formInline.area
                }

                this.dataApi.ajax('selectPageCityOrder',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            edit(id){
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
                this.fetchData(this.pageInfo.pageNum)
            }, 
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            changeType(){
                this.formInline.buyerName=''
                this.formInline.sellerName=''
            },
            fetchArea(parentCode, type, rank) {
               
                if (parentCode===0 || parentCode>0) {
                    this.dataApi.ajax('selectSysCity', {cityCode: parentCode}, res => {
                        if (res.responseType === 'S') {
                               this[type] = res.dtos
                                if (rank === 1) {
                                    this.formInline.city = ''
                                    this.formInline.area = ''
                                } else if (rank === 2) {
                                    this.formInline.area = ''
                                }
                                return false;
                        }
                    });
                }else{
                    this.formInline.city = ''
                    this.formInline.area = ''
                }

            },
            statistics(){   //统计

                  if (this.startTime1 && this.endTime1) {
                    this.formInline.leftFinishTime=dateFormat(this.startTime1)
                    this.formInline.rightFinishTime=dateFormat(this.endTime1) 
                    if (this.formInline.leftFinishTime>this.formInline.rightFinishTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.leftFinishTime=''
                        this.formInline.rightFinishTime=''
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
                    if (this.formInline.area!='') {
                      this.formInline.cityNum=this.formInline.area
                    }else{
                      this.formInline.cityNum=''
                    }
                this.formInline[this.formInline.type] = this.formInline.name
                 if (this.formInline.province!='') {
                    this.formInline.cityNum=this.formInline.province
                }else{
                    this.formInline.cityNum=''
                }
                if (this.formInline.city!=''){
                   this.formInline.cityNum=this.formInline.city
                }
                if (this.formInline.area!=''){
                   this.formInline.cityNum=this.formInline.area
                }
                this.dataApi.ajax('singleStatistics',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.recordCount==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible=true
                                 this.sumMap=res
                             }
                        } 
                    });
            },

        }
    }
</script>
