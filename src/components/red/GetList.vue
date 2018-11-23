<template>
    <div class="admin-home" style="padding-top: 20px;">
                <div class="radius">
                     <h4 class="red_setting_h4">红包信息设置</h4>
                     <div class="summarize" style="font-size: 15px;text-align: left">
                         <div>
                            平民领到系统红包金额范围（元）
                            <el-input v-model="PersonSysMin" style="width: 120px;" :disabled="showEdit"></el-input>至
                            <el-input v-model="PersonSysMax" style="width: 120px;" :disabled="showEdit"></el-input>
                          </div>
                          <div style="padding-left: 45px">
                            个人红包发送，扣除手续费
                            <el-input v-model="SysGetPer" style="width: 120px;" :disabled="showEdit"></el-input>
                          </div>
                          <div>
                            城主领到系统红包金额范围（元）
                            <el-input v-model="CitySysMin" style="width: 120px;" :disabled="showEdit"></el-input>至
                            <el-input v-model="CitySysMax" style="width: 120px;" :disabled="showEdit"></el-input>
                          </div>
                          <div>
                            新人见面礼红包金额范围（元）
                            <el-input v-model="NewPeopleSysMin" style="width: 120px;" :disabled="showEdit"></el-input>至
                            <el-input v-model="NewPeopleSysMax" style="width: 120px;" :disabled="showEdit"></el-input>
                          </div>
                          <div>
                            连续超过30天未登录，则之后的每一天，该用户的红包股数将减少百分之
                            <el-input v-model="LoginSettings" style="width: 60px;" :disabled="showEdit"></el-input>
                          </div>
                          <div>
                            下一个红包分配时间：
                            <el-button type="primary"  @click="fetchTime()">修改</el-button>
                          </div>
                          
                     </div>
                     
                     <div class="summarize_input" style="text-align: right;vertical-align: top;margin-top: 10px">
                          <div style="height: 56px;">
                              邀请成功获得股数奖励比例
                          </div>
                          <div style="height: 56px;">
                              个人红包有效期                   
                          </div>
                          <div style="height: 56px;">
                              用户抢红包最大范围
                          </div>
                          <div style="height: 56px;">
                              邀请一个人增加抢红包米数
                          </div>
                          <div >
                              个人单个红包金额不低于
                          </div>
                    </div>
                    <div class="summarize_input" style="text-align: left;vertical-align: top">
                          <div>
                              <el-input v-model="PerGetPer"  style="width: 100px;margin-left: 10px" :disabled="showEdit"></el-input>
                          </div>
                          <div>
                              <el-input v-model="RedOverdue"  style="width: 100px;margin-left: 10px" :disabled="showEdit"></el-input>
                              天
                          </div>
                          <div>
                              <el-input v-model="MaximumTerritory"  style="width: 100px;margin-left: 10px" :disabled="showEdit"></el-input>
                              m
                          </div>
                          <div>
                              <el-input v-model="MaximumTerritoryNo"  style="width: 100px;margin-left: 10px" :disabled="showEdit"></el-input>
                              m
                          </div>
                          <div> 
                              <el-input v-model=" enve_min_value"  style="width: 100px;margin-left: 10px" :disabled="showEdit"></el-input>
                              元
                          </div>

                    </div>
                    <div class="summarize_input" style="vertical-align: top;margin-top: 10px;margin-left: 10px" v-if="powerShow('红包参数设置')">
                         <el-button type="primary" v-if="showEdit" @click="showEdit=false">修改</el-button>
                         <el-button type="primary" v-if="!showEdit" @click="submit" :loading="loading">保存</el-button>
                    </div>
                    
                </div>
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
                           <router-link :to="'/user/user_detail/'+scope.row.distributeUser" target="_blank" v-if="scope.row.enveCode!='0'">
                                <span class="pointer">{{ scope.row.userName}}</span>
                           </router-link>
                           <span v-else>{{ scope.row.userName }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="identity"
                        label="领取用户">
                        <template scope="scope">
                           <router-link :to="'/user/user_detail/'+scope.row.receiveUser" target="_blank">
                              <span class="pointer">{{ scope.row.receiveUserName}}</span>
                          </router-link>
                        </template>
                </el-table-column>
                <el-table-column
                        sortable='custom'
                        prop='distribute_Time'
                        label="红包发放时间">
                        <template scope="scope">
                            <span>{{scope.row.distributeTime}}</span>
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
            
            <!--红包领取记录统计-->
            <el-dialog title="红包领取记录统计" v-model="dialogVisible3">
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
                  <el-form-item label="时间：">
                      <el-form-item label="">
                          <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                          到
                          <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                      </el-form-item>
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

            <!--广告时间-->
            <el-dialog title="下一个红包分配时间" v-model="dialogVisible" size="small">
                <div class="allot_time">
                    <div class="sumMap_num">
                         第
                         <el-input value=1 style="width: 80px;" :disabled="true"></el-input>
                         至
                         <el-input v-model="ZeroToTen" style="width: 80px;"></el-input>
                         红包,
                         时间
                         <el-input v-model="ZeroToTenVal" style="width: 80px;"></el-input>分钟
                    </div>
                    <div class="sumMap_num">
                         第
                         <el-input v-model="ZeroToTen" style="width: 80px;" :disabled="true"></el-input>
                         至
                         <el-input v-model="TenToTwenty" min="10" style="width: 80px;"></el-input>
                         红包,
                         时间
                         <el-input v-model="TenToTwentyVal" style="width: 80px;"></el-input>分钟
                    </div>
                    <div class="sumMap_num">
                         第
                         <el-input v-model="TenToTwenty" style="width: 80px;" :disabled="true"></el-input>
                         至
                         <el-input v-model="TwentyToThirty" style="width: 80px;"></el-input>
                         红包,
                         时间
                         <el-input v-model="TwentyToThirtyVal" style="width: 80px;"></el-input>分钟
                    </div>
                     <div class="sumMap_num">
                         第
                         <el-input v-model="TwentyToThirty" style="width: 80px;" :disabled="true"></el-input>
                         至
                         <el-input v-model="ThirtyToForty" style="width: 80px;"></el-input>
                         红包,
                         时间
                         <el-input v-model="ThirtyToFortyVal" style="width: 80px;"></el-input>分钟
                    </div>
                     <div class="sumMap_num">
                         第
                         <el-input v-model="ThirtyToForty" style="width: 80px;" :disabled="true"></el-input>
                         以上,
                         时间
                         <el-input v-model="FortyToFiftyVal" style="width: 80px;"></el-input>分钟
                    </div>
                    <el-button type="primary"  @click="onSubmit()" style="margin-left: 15px" :loading="loading" v-if="powerShow('红包参数设置')">保存</el-button>
                    
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
.allot_time>div{
  margin-bottom: 20px;
  font-size:15px;
}
.allot_time{
  font-size: 15px;
  text-align: center;
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
                loading:false,
                formInline: {
                    pageNum:'',
                    sort:'RECEIVE_TIME',
                    desc:'desc',
                    beginTime:'',
                    endTime:'',
                    pageSize:10,
                    enveTypeFlag:'',
                    userName:'',
                    enveRange:''
                },
                urgentList:[{ text: '系统红包', value: '0' },{ text: '个人普通红包', value: '1' },{ text: '个人大红包', value: '2' },{ text: '个人加密红包', value: '3' },{ text: '商品红包', value: '5' }],
                areaList:[{ text: '全国', value: '0' },{ text: '1km', value: '1' },{ text: '区', value: '2' },{ text: '市', value: '3' }],
                 dialogVisible3:false,
                 dialogVisible:false,
                 startTime1:'',
                 endTime1:'',
                 sumMap:{},
                 showEdit:true,
                 time1:10,
                 time2:20,
                 time3:30,
                 time4:40,
                 moment1:1,
                 moment2:1,
                 moment3:1,
                 moment4:1,
                 moment5:1,
                 PersonSysMin:'',   //平民领到系统红包金额范围,小
                 PersonSysMax:'',   //平民领到系统红包金额范围,大
                 SysGetPer:'',        //扣除手续费
                 CitySysMin:'',     //城主领到系统红包金额范围,小
                 CitySysMax:'',     //城主领到系统红包金额范围，大
                 NewPeopleSysMin:'',     //新人见面礼红包金额范围，小
                 NewPeopleSysMax:'',     //新人见面礼红包金额范围，大
                 PerGetPer:'',   //邀请奖励比例
                 RedOverdue:'',     //个人红包有效期
                 enve_min_value:'',    //个人单个红包最小金额
                 LoginSettings:'',     //30天未登录减少百分比,
                 ZeroToTen:'',         //'第一批时间'
                 ZeroToTenVal:'',         //'第一批时间分钟'
                 TenToTwenty:'',       // '第二批时间'
                 TenToTwentyVal:'',       // '第二批时间分钟'
                 TwentyToThirty:'',    // '第三批时间'
                 TwentyToThirtyVal:'',    // '第三批时间分钟'
                 ThirtyToForty:'',     // '第四批时间'
                 ThirtyToFortyVal:'',     // '第四批时间分钟'
                 FortyToFifty:'',      //'第五批时间'
                 FortyToFiftyVal:'',      //'第五批时间分钟'
                 MaximumTerritory:'',      //'用户抢红包最大范围'
                 MaximumTerritoryNo:'',      //'邀请一个人增加抢红包米数'
            }
        },
        created() {

        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchParam();
  
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
            fetchParam(){
               this.dataApi.ajax('sysParamQuery',{
                sysCodes:'PersonSysCode,SysGetPer,CitySysCoce,PerGetPer,enve_min_value,LoginSettings,RedOverdue,MaximumTerritory,MaximumTerritoryNo,NewPeopleSysCode'}, res => {
                    if (res.responseType === 'S') {
                         for(var k in res.map){
                             if (k.indexOf('PersonSysCode')==0) {
                                this.PersonSysMin=k.split('|')[1]
                                this.PersonSysMax=res.map[k]
                             }else if (k.indexOf('CitySysCoce')==0) {
                                this.CitySysMin=k.split('|')[1]
                                this.CitySysMax=res.map[k]
                             }else if (k.indexOf('NewPeopleSysCode')==0) {
                                this.NewPeopleSysMin=k.split('|')[1]
                                this.NewPeopleSysMax=res.map[k]
                             }else{
                               this[k]=res.map[k]
                             }
                             
                          }
                    }
                });
            },
            fetchTime(){
               this.dialogVisible=true;
               this.dataApi.ajax('sysParamQuery',{
                sysCodes:'ZeroToTen,TenToTwenty,TwentyToThirty,ThirtyToForty,FortyToFifty'}, res => {
                    if (res.responseType === 'S') {
                         for(var k in res.map){
                               this[k.split('|')[0]]=k.split('|')[1]
                               this[k.split('|')[0]+'Val']=res.map[k]
                             
                          }
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
                this.formInline.receiveFlag=1
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
            submit(){  //保存红包信息设置
               
                if (!isNumber(this.RedOverdue)) {
                   this.showMsg('红包有效期不正确','warning');
                   return;
                }
                this.showEdit=true
                var dtos=[
                 {
                    sysCode:'PersonSysCode',
                    sysKey:this.PersonSysMin,
                    sysValue:this.PersonSysMax
                 },
                 {
                    sysCode:'SysGetPer',
                    sysKey:'SysGetPer',
                    sysValue:this.SysGetPer
                 },
                 {
                    sysCode:'CitySysCoce',
                    sysKey:this.CitySysMin,
                    sysValue:this.CitySysMax
                 },
                 {
                    sysCode:'NewPeopleSysCode',
                    sysKey:this.NewPeopleSysMin,
                    sysValue:this.NewPeopleSysMax
                 },
                 {
                    sysCode:'LoginSettings',
                    sysKey:'LoginSettings',
                    sysValue:this.LoginSettings
                 },
                 {
                    sysCode:'RedOverdue',
                    sysKey:'RedOverdue',
                    sysValue:this.RedOverdue
                 },
                 {
                    sysCode:'PerGetPer',
                    sysKey:'PerGetPer',
                    sysValue:this.PerGetPer
                 },
                 {
                    sysCode:'enve_min_value',
                    sysKey:'enve_min_value',
                    sysValue:this.enve_min_value
                 },
                 {
                    sysCode:'MaximumTerritory',
                    sysKey:'MaximumTerritory',
                    sysValue:this.MaximumTerritory
                 },
                 {
                    sysCode:'MaximumTerritoryNo',
                    sysKey:'MaximumTerritoryNo',
                    sysValue:this.MaximumTerritoryNo
                 },
                 ]
                    
                 this.dataApi.ajax('batchEditSysParam',{dtos:JSON.stringify(dtos)}, res => {    
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功')
                              this.loading=false
                              this.showEdit=true
                              this.fetchParam()
                        }
                 });
            },
            onSubmit(){
              if (this.ZeroToTen>this.TenToTwenty) {
                 this.showMsg('时间错误')
              }else if (this.TenToTwenty>this.TwentyToThirty) {
                 this.showMsg('时间错误')
              }else if (this.TwentyToThirty>this.FortyToFifty) {
                  this.showMsg('时间错误')
              }
              this.loading=true
              var dtos=[
                   {
                      sysCode:'ZeroToTen',
                      sysKey:this.ZeroToTen,
                      sysValue:this.ZeroToTenVal
                   },
                   {
                      sysCode:'TenToTwenty',
                      sysKey:this.TenToTwenty,
                      sysValue:this.TenToTwentyVal
                   },
                   {
                      sysCode:'TwentyToThirty',
                      sysKey:this.TwentyToThirty,
                      sysValue:this.TwentyToThirtyVal
                   },
                   {
                      sysCode:'ThirtyToForty',
                      sysKey:this.ThirtyToForty,
                      sysValue:this.ThirtyToFortyVal
                   },
                   {
                      sysCode:'FortyToFifty',
                      sysKey:this.ThirtyToForty,
                      sysValue:this.FortyToFiftyVal
                   }
               ]    
               this.dataApi.ajax('batchEditSysParam',{dtos:JSON.stringify(dtos)}, res => {    
                      if (res.responseType === 'S') {
                            this.showMsg('修改成功');
                            this.loading=false;
                            this.dialogVisible=false;
                      }
               });
            },
            detail(id){
              this.$router.push('/user/red_detail/'+id)
            }

        }
    }
</script>
