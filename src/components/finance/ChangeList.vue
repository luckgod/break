<template>
    <div class="admin-home" style="padding-top: 20px;">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="120px">        
                        <el-form-item label="">
                            <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                <el-option label="用户名" value="userName"></el-option>
                                <el-option label="关联账户名" value="sourceUserName"></el-option>
                            </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="股数变动类型：">
                            <el-select v-model="formInline.richType"  style="width: 120px;" @change="selectType()">
                                <el-option  :label="item.text" :value="item.value" v-for="item in ppeType"></el-option>
                            </el-select>
                            <el-select v-model="formInline.richChangeType" style="width: 150px;">
                                <el-option  label="全部" value=""></el-option>
                                <el-option v-for="item in typeList" :label="item.externalName" :value="item.changeType"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="交易时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData(1)">查询</el-button> 
                        <el-button type="primary" @click="statistics()">统计</el-button>
                </el-form>
                <el-table
                    :data="pageInfo.dtos"
                    v-loading="table_loading"
                    element-table_loading-text="加载中"
                    stripe
                    @sort-change='order'
                    style="width: 100%">
                <el-table-column
                        prop="creTime"
                        label="交易时间">
                </el-table-column>
                <el-table-column
                        prop="identity"
                        label="用户名">
                        <template scope="scope">
                           <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank" v-if="scope.row.userId!=0"><span class="pointer">{{ scope.row.userName }}</span></router-link>
                           <span  v-else>{{ scope.row.userName }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="identity"
                        label="奖励关联账号">
                        <template scope="scope">
                           <router-link :to="'/user/user_detail/'+scope.row.sourceId" target="_blank"><span class="pointer">{{ scope.row.sourceUserName }}</span></router-link>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="变动类型">
                </el-table-column>
                <el-table-column
                        prop="changeValue"
                        label="变动金额">
                </el-table-column>
                <el-table-column
                        label="红包股数变动"
                        prop="redEnvelopes">
                </el-table-column>
                <el-table-column
                        prop="serialNumber"
                        label="流水号">
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
            
            <!--交易明细统计-->
            <el-dialog title="交易明细统计" v-model="dialogVisible">
                <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="">
                            <el-select v-model="formInline.type" style="width: 120px;" @change="changeType" :disabled="true">
                                <el-option label="用户名" value="userName"></el-option>
                                <el-option label="关联账户名" value="sourceUserName"></el-option>
                            </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="股数变动类型：">
                            <el-select v-model="formInline.richType"  style="width: 120px;" @change="selectType()" :disabled="true">
                                <el-option  :label="item.text" :value="item.value" v-for="item in ppeType"></el-option>
                            </el-select>
                            <el-select v-model="formInline.richChangeType" style="width: 150px;" :disabled="true">
                                <el-option  label="全部" value=""></el-option>
                                <el-option v-for="item in typeList" :label="item.externalName" :value="item.changeType"></el-option>
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
                        {{ sumMap.redEnvelopesValue }}
                    </div>
                    <div>
                       变动金额
                    </div>
                </div>
                 <div class="sumMap">
                    <div class="sumMap_num">
                         {{ sumMap.transactionNumber }}
                    </div>
                    <div>
                       累计交易条数
                    </div>
                </div>
            </el-dialog>
                
    </div>
</template>
<style> 

.el-tabs__item{
     font-size:18px !important;
     font-weight: bold;
}
.el-tabs__header{
  border-bottom:none;
}
.red_setting_h4{
  display: inline-block;
  vertical-align: top;
  font-weight: bold;
  margin-right: 40px;
  margin-top: 20px;
}
</style>
<script>
    export default{
        data(){
            return{
                table_loading:false,
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formInline: {
                    pageNum:1,
                    sort:'CRE_TIME',
                    desc:'desc',
                    startTime:'',
                    endTime:'',
                    pageSize:10,
                    richChangeType:'',
                    richType:'1',
                    type:'userName',
                    name:''
                },
                urgentList:[{ text: '城主主城收益', value: '1' },{ text: '领取红包', value: '2' },{ text: '邀请奖励', value: '3' },{ text: '提现', value: '4' },{ text: '提现手续费', value: '5' },{ text: '系统收益', value: '6' },{ text: '主城转让收益', value: '7' },{ text: '城主返还本金', value: '8' },{ text: '个人红包', value: '9' },{ text: '发红包', value: '10' },{ text: '提现驳回', value: '11' },{ text: '手续费返还', value: '12' },{ text: '过期退款', value: '13' }],
                areaList:[{ text: '一公里', value: '一公里' },{ text: '全国', value: '全国' },{ text: '全区/县', value: '全区/县' }],
                 ppeType:[{text:'红包股记录',value: '1'},{text:'收支明细',value: '2'},{text:'抵价券',value: '3'},{text:'奖励券',value: '4'}],
                 typeList:[],
                 dialogVisible:false,
                 startTime1:'',
                 endTime1:'',
                 sumMap:{
                  redValue:''
                 },
                 showEdit:true
            }
        },
        created() {

        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.selectType();
        },
        methods: {
           fetchData (page = 1) {
                  if (this.startTime1 && this.endTime1) {
                     this.formInline.startTime=dateFormat(this.startTime1)
                     this.formInline.endTime=dateFormat(this.endTime1) 
                  if (this.formInline.startTime>this.formInline.endTime) {
                       this.$message({
                        type: 'warning',
                        message: '开始时间不能大于结束时间'
                        });
                       return;
                      }
                  }else{
                      this.formInline.startTime=''
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
                this.formInline[this.formInline.type] = this.formInline.name
                this.dataApi.ajax('selectRich',this.formInline, res => {
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
            statistics(){   //统计

                  if (this.startTime1 && this.endTime1) {
                    this.formInline.startTime=strToTime(this.startTime1)
                    this.formInline.endTime=strToTime(this.endTime1) 
                    if (this.formInline.startTime>this.formInline.endTime) {
                         this.$message({
                          type: 'warning',
                          message: '开始时间不能大于结束时间'
                          });
                         return;
                        }
                    }else{
                        this.formInline.startTime=''
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
                    this.formInline[this.formInline.type] = this.formInline.name
                this.dataApi.ajax('countStock',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.transactionNumber==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible=true
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
            submit(){  //保存红包信息设置
                this.showEdit=true
            },
            changeType(){
                this.formInline.userName=''
                this.formInline.sourceUserName=''
            },
            selectType(){
                this.dataApi.ajax('selectBillType',{type:this.formInline.richType}, res => {
                    if (res.responseType === 'S') {
                         this.typeList=res.changeTypePojos
                         this.formInline.richChangeType=''
                    }
                });
            },

        }
    }
</script>
