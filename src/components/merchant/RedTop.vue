<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <h3><el-button type="primary" @click="goBack()">返回</el-button>&nbsp;&nbsp;{{ areaTitle }}红包排行</h3>
                        <br>
                        <el-form-item label="">
                             <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                  <el-option label="发红包用户" value="userName"></el-option>
                                  <el-option label="红包编号" value="perEnveCode"></el-option>
                              </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="红包状态：">
                            <el-select v-model="formInline.visibleFlag" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in enableStateArr"></el-option>
                            </el-select>
                        </el-form-item>                    
                        <el-form-item label="按身份：">
                            <el-select v-model="formInline.userIdentity"  style="width: 150px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in identityArray" :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发放时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData(1)">查询</el-button>
                        <el-button type="primary" @click="statistics()">统计</el-button>
                </el-form>
            </el-col>
        </el-row>
 
        <div style="width: 1100px;padding-bottom: 20px">
             <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="当前主城排行榜" name="1"></el-tab-pane>
                <el-tab-pane label="主城历史排行榜" name="2"></el-tab-pane>
             </el-tabs>
        </div>
        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%">
            <el-table-column
                    type="index"
                    width="70"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="perEnveCode"
                    label="红包编号">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="发红包用户">
                    <template scope="scope">
                       <router-link :to="'/user/user_detail/'+scope.row.distributeUser" target="_blank" >
                              <span class="pointer">{{ scope.row.userName}}</span>
                        </router-link>
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
                    sortable='custom'
                    prop="distribute_Time"
                    label="发放时间">
                <template scope="scope">
                    <span>{{scope.row.distributeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="total_Amount"
                    sortable='custom'
                    label="红包金额（元）">
                    <template scope="scope">
                        <span>{{scope.row.totalAmount}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="enveRange"
                    label="红包范围">
                    <template scope="scope">
                        <span>{{findState(scope.row.enveRange,areaList)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="红包状态">
                    <template scope="scope">
                        <span>{{ findState(scope.row.visibleFlag,enableStateArr) }}({{ scope.row.receverNum }}/{{ scope.row.totalNumber }})</span>
                    </template>
            </el-table-column>
            <el-table-column label="红包详情">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row.perEnveCode)">查看</el-button>
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

         <!--排行统计-->
        <el-dialog title="红包排行统计" v-model="dialogVisible">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="">
                     <el-select v-model="formInline.type" style="width: 120px;" @change="changeType" :disabled="true">
                          <el-option label="发红包用户" value="userName"></el-option>
                          <el-option label="红包编号" value="perEnveCode"></el-option>
                      </el-select>
                     <el-input v-model="formInline.name" style="width: 150px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="红包状态：">
                    <el-select v-model="formInline.visibleFlag" style="width: 140px;" :disabled="true">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.text" :value="item.value" v-for="item in enableStateArr"></el-option>
                    </el-select>
                </el-form-item>                    
                <el-form-item label="按身份：">
                    <el-select v-model="formInline.userIdentity"  style="width: 150px;" :disabled="true">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in identityArray" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发放时间：">
                    <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                    到
                    <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                </el-form-item>
            </el-form>
            <hr>
            <div class="sumMap">
                <div class="sumMap_num">
                    {{ sumMap.amount }}
                </div>
                <div>
                   发送红包总金额
                </div>
            </div>
             <div class="sumMap">
                <div class="sumMap_num">
                     {{ sumMap.countEnve }}
                </div>
                <div>
                   发送红包记录
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
.el-tabs__item{
     font-size:18px !important;
     font-weight: bold;
}
.el-tabs__header{
  border-bottom:none;
}
</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                activeName: '1',
                formInline: {
                    pageNum:'',
                    sort:'CRE_TIME',
                    desc:'desc',
                    distributeBeginTime:'',
                    distributeEndTime:'',
                    dateFlag:'',
                    pageSize:10,
                    type:'userName',
                    perEnveCode:'',
                    userName:'',
                    visibleFlag:'',
                    payType:'',
                    userIdentity:'',
                    searchType:'1'
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                urgentList:[{ text: '系统红包', value: '系统红包' },{ text: '个人红包', value: '个人红包' },{ text: '个人加密红包', value: '个人加密红包' }],
                areaList:[{ text: '全国', value: '0' },{ text: '1km', value: '1' },{ text: '区', value: '2' },{ text: '市', value: '3' }],
                enableStateArr: [{ text: '领取完', value: '0' },{ text: '未领取完', value: '1' },{ text: '已过期', value: '2' },{ text: '过期退款中', value: '3' },{ text: '过期退款失败', value: '4' }],
                identityArray: [{text:'平民',value:'1'},{text:'城主',value:'2'},{text:'商家',value:'4'},{text:'商家城主',value:'5'},{text:'游客',value:'9'}],
                startTime1:'',
                endTime1:'',
                dialogVisible:false,
                sumMap:{},
                areaTitle:''
            }
        },
        created(){
        
        },
        activated() {

            let urlPram = getRequestParam(location.hash)
            this.areaTitle = decodeURI(urlPram.cityName)
            this.formInline.cityNum=urlPram.cityNum
            this.fetchData(this.pageInfo.pageNum);
  
        },
        methods: {

            fetchData (page = 1) {
                if (this.activeName=='1') {
                    this.formInline.searchType='1'
                }
                if (this.activeName=='2') {
                    this.formInline.searchType='2'
                }
                  if (this.startTime1 && this.endTime1) {
                    this.formInline.distributeBeginTime=dateFormat(this.startTime1)
                    this.formInline.distributeEndTime=dateFormat(this.endTime1) 
                    if (this.formInline.distributeBeginTime>this.formInline.distributeEndTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.distributeBeginTime=''
                        this.formInline.distributeEndTime=''
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
                this.dataApi.ajax('selectPageLatticeForControl',this.formInline, res => {
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
                this.formInline.userName=''
                this.formInline.perEnveCode=''
            },
            statistics(){   //统计

                  if (this.activeName=='1') {
                    this.formInline.searchType='1'
                  }
                  if (this.activeName=='2') {
                    this.formInline.searchType='2'
                  }
                  if (this.startTime1 && this.endTime1) {
                    this.formInline.distributeBeginTime=dateFormat(this.startTime1)
                    this.formInline.distributeEndTime=dateFormat(this.endTime1) 
                    if (this.formInline.distributeBeginTime>this.formInline.distributeEndTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.distributeBeginTime=''
                        this.formInline.distributeEndTime=''
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
                    this.formInline[this.formInline.type] = this.formInline.name
                    this.dataApi.ajax('sumLattice',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.countEnve==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible=true
                                 this.sumMap=res
                             }
                        } 
                    });
            },
            handleClick(tab, event) {
                if (this.activeName=='1') {
                    this.fetchData(1)
                }
                if (this.activeName=='2') {
                   this.fetchData(1)
                }

            },

        }
    }
</script>
