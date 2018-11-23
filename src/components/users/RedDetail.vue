<template>
    <div class="admin-home" style="padding-top: 20px;">
                <el-button  @click="goBack()" type="primary" >返回</el-button> 
                <br>
                <div class="radius" style="text-align:left;">
                     
                     <div style="display:inline-block;width: 40%">
                        <el-form :model="basicForm" :inline="false" label-width="110px">
                                <h3 style="padding-bottom: 20px">红包详情</h3>
                                <el-form-item label="发红包用户："   class="no_bottom">
                                  <span>{{ basicForm.distributeUserName }}</span>
                                </el-form-item>
                                <el-form-item label="红包信息："  class="no_bottom">
                                  <span>共{{ basicForm.totalAmount }}元，已领取{{ basicForm.receiveNumber }}/{{ basicForm.totalNumber }}<br>待领取金额{{ basicForm.unreceivedAmount }}元</span>
                                </el-form-item>
                                <el-form-item label="服务费："  class="no_bottom">
                                  <span>{{ basicForm.rate*100 }}%</span>
                                </el-form-item>
                                <el-form-item label="红包发送范围："   class="no_bottom">
                                  <span>{{ findState(basicForm.enveRange,areaList) }}</span>
                                </el-form-item>
                                <el-form-item label="红包发起点："   class="no_bottom">
                                  <span>{{ basicForm.detailedArea }}</span>
                                </el-form-item>
                                
                         </el-form>
                    </div>
                    <div style="display:inline-block;width:48%;vertical-align: top;margin-top: 50px;">
                        <el-form :model="basicForm" :inline="false" label-width="180px">
                                <el-form-item label="红包类型："   class="no_bottom">
                                   <span>{{ findState(basicForm.enveType,urgentList) }}</span>
                                </el-form-item>
                                <el-form-item label="发放时间："   class="no_bottom">
                                   <span>{{ basicForm.creTime }}</span>
                                </el-form-item>
                                <el-form-item label="有效期："  class="no_bottom">
                                   <span>{{ basicForm.validTime }}</span>
                                </el-form-item>
                                <el-form-item label="图片："  class="no_bottom" v-if="basicForm.enveType!='5'">
                                   <we-ui-uploads :images="basicForm.enveImageAddress"
                                             :maxCount="1"
                                             :maxSize="1024*1024"
                                             @uploading="uploading"></we-ui-uploads>
                                </el-form-item>
                                <el-form-item label="广告内容："   class="no_bottom"  v-if="basicForm.enveType!='5'">
                                    <el-input type="textarea" v-model="basicForm.enveContent" :rows="3" :disabled="
                                   !showEdit" style="width: 300px;"></el-input>
                                   <el-button type="primary" @click="showEdit=true" v-if="!showEdit" style="vertical-align: top">修改</el-button>
                                   <el-button type="primary" @click="submit(basicForm.enveContent,'enveContent')" v-if="showEdit" style="vertical-align: top">保存</el-button>
                                </el-form-item>
                                <el-form-item label="商品信息："  class="no_bottom" v-if="basicForm.enveType=='5'">
                                   <div style="display: inline-block;vertical-align: top;margin-top: 10px;margin-right: 10px">
                                      <img :src="basicForm.dto.commodityImg" width="100">
                                   </div>
                                   <div style="display: inline-block;">
                                       <div class="pointer" style="width:250px;display: inline-block" @click="jump(basicForm.dto.commodityType,basicForm.dto.commodityId)">{{ basicForm.dto.commodityName }}</div>
                                       <div>原价：{{ basicForm.dto.price }}&nbsp;&nbsp;&nbsp;&nbsp;已售{{ basicForm.dto.commoditySales }}件</div>
                                       <div v-if="basicForm.discountPrice">现价：{{ basicForm.discountPrice }}(可获得{{ basicForm.dto.exchangeAmount }}奖励券)</div>
                                       <!-- 商品类型1-物流商超2-服务行业3-酒店 4-代金券 -->
                                   </div>
                                </el-form-item>                   
                         </el-form>

                    </div>   
                </div>
                <div style="width: 1100px;padding-left: 70px">
                     <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="领取详情" name="1"></el-tab-pane>
                        <el-tab-pane label="留言信息" name="2"></el-tab-pane>
                        <el-tab-pane label="点赞记录" name="3"></el-tab-pane>
                        <el-tab-pane label="点赞统计" name="4"></el-tab-pane>
                     </el-tabs>
                </div>
                <!--领取详情table-->
                <el-table 
                      :data="pageInfo.dtos"
                      v-loading="table_loading"
                      element-table_loading-text="加载中"
                      stripe
                      @sort-change='order'
                      style="width: 100%p;margin-top: 20px;"
                      v-show="activeName==1">
                  <el-table-column
                    type="index"
                    width="50">
                  </el-table-column>
                  <el-table-column
                          prop="receiveUser"
                          label="用户ID">
                  </el-table-column>
                  <el-table-column
                          prop="bannerName"
                          label="领取用户">
                          <template scope="scope">
                              <router-link :to="'/user/user_detail/'+scope.row.receiveUser" target="_blank">
                                  <span class="pointer">{{ scope.row.receiveUserName}}</span>
                              </router-link>
                          </template>
                  </el-table-column>
                  <el-table-column
                          prop="amount"
                          sortable='custom'
                          label="红包金额（元）">
                  </el-table-column>
                  <el-table-column
                          prop="quantityOfShares"
                          label="红包股数">
                  </el-table-column>
                  <el-table-column
                          prop="receive_Time"
                          sortable='custom'
                          label="领取时间">
                          <template scope="scope">
                              <span>{{ scope.row.receiveTime }}</span>
                          </template>
                  </el-table-column>
                  <el-table-column
                          prop="sharePrices"
                          label="当时股价">
                  </el-table-column>
                  <el-table-column
                          prop="receiveDetailedArea"
                          label="领取地址">
                  </el-table-column>
               </el-table>
               <div class="paginate" v-show="activeName==1">
                  <el-pagination
                          @current-change="handleCurrentChange"
                          :current-page="pageInfo.pageNum"
                          :page-size="pageInfo.pageSize"
                          layout="total, prev, pager, next, jumper"
                          :total="pageInfo.count"
                          >
                  </el-pagination>
              </div>
               <!--领取详情table结束-->

               <!--留言信息table -->
                <el-table 
                      :data="pageInfo.dtos"
                      v-loading="table_loading"
                      element-table_loading-text="加载中"
                      stripe
                      @sort-change='order'
                      v-show="activeName==2"
                      style="width: 100%p;margin-top: 20px;">
                  <el-table-column
                          prop="leavingCode"
                          label="留言序号">
                  </el-table-column>
                  <el-table-column
                          prop="CRE_TIME"
                          label="用户">
                           <template scope="scope">
                              <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank">
                                  <span class="pointer">{{ scope.row.userName}}</span>
                              </router-link>
                          </template>
                  </el-table-column>
                  <el-table-column
                          sortable='custom'
                          prop="CRE_TIME"
                          label="留言时间">
                          <template scope="scope">
                              <span>{{scope.row.creTime}}</span>
                          </template>
                  </el-table-column>
                  <el-table-column
                          width="150"
                          prop="leavingContent"
                          label="留言内容">
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                      <template scope="scope">
                          <el-button type="danger" size="small"
                                     @click="deleteById(scope.row.leavingCode)">删除
                          </el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div class="paginate" v-show="activeName==2">
                  <el-pagination
                          @current-change="handleCurrentChange"
                          :current-page="pageInfo.pageNum"
                          :page-size="pageInfo.pageSize"
                          layout="total, prev, pager, next, jumper"
                          :total="pageInfo.count"
                          >
                  </el-pagination>
              </div>
               <!--留言信息table结束 -->
               
               <!--点赞记录table -->
                <el-table 
                      :data="pageInfo.dtos"
                      v-loading="table_loading"
                      element-table_loading-text="加载中"
                      stripe
                      v-show="activeName==3"
                      style="width: 100%p;margin-top: 20px;">
                  <el-table-column
                          prop="userCode"
                          label="用户ID">
                  </el-table-column>
                  <el-table-column
                          prop="userName"
                          label="点赞用户">
                           <template scope="scope">
                              <router-link :to="'/user/user_detail/'+scope.row.userCode" target="_blank">
                                  <span class="pointer">{{ scope.row.userName}}</span>
                              </router-link>
                          </template>
                  </el-table-column>
                  <el-table-column
                          label="用户手机号"
                          prop="userMobile">
                  </el-table-column>
                  <el-table-column
                          width="100"
                          label="点赞图片">
                          <template scope="scope">
                              <img class="banner" :src="scope.row.issueImage">
                          </template>
                  </el-table-column>
                  <el-table-column
                          prop="issueName"
                          label="点赞内容">
                  </el-table-column>
                  <el-table-column
                          prop="voteTime"
                          label="点赞时间">
                  </el-table-column>
              </el-table>
              <div class="paginate" v-show="activeName==3">
                  <el-pagination
                          @current-change="handleCurrentChange"
                          :current-page="pageInfo.pageNum"
                          :page-size="pageInfo.pageSize"
                          layout="total, prev, pager, next, jumper"
                          :total="pageInfo.count"
                          >
                  </el-pagination>
              </div>
               <!--点赞记录table结束 -->

               <!--点赞统计table -->
                <el-table 
                      :data="tableData"
                      v-loading="table_loading"
                      element-table_loading-text="加载中"
                      stripe
                      v-show="activeName==4"
                      style="width: 100%p;margin-top: 20px;">
                  <el-table-column
                          width="100"
                          label="图片">
                          <template scope="scope">
                              <img class="banner" :src="scope.row.issueImage">
                          </template>
                  </el-table-column>
                  <el-table-column
                          prop="issueName"
                          label="点赞内容">
                  </el-table-column>
                  <el-table-column
                          prop="issueCount"
                          label="统计人数">
                  </el-table-column>
                  <el-table-column
                          prop="issueRatio"
                          label="占比">
                           <template scope="scope">
                              <span>{{ scope.row.issueRatio*100 }}%</span>
                          </template>
                  </el-table-column>
              </el-table>
               <!--点赞统计table结束 -->
                
    </div>
</template>
<style> 
.summarize{
  display:inline-block;
  text-align: right;
  font-size: 20px;
  margin-right: 30px;
}
.summarize div{
  padding:5px 0;
}
.summarize_input{
   display:inline-block;
}
.summarize_input div{
  padding:5px 0;
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
    export default{
        data(){
            return{
                account:'系统管理员',
                activeName: '1',
                table_loading:false,
                basicForm:{
                  enveImageAddress:[],
                  enveContent:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth:'150px',
                formInline:{},
                urgentList:[{ text: '系统红包', value: '0' },{ text: '个人普通红包', value: '1' },{ text: '个人大红包', value: '2' },{ text: '个人加密红包', value: '3' },{ text: '商品红包', value: '5' }],
                areaList:[{ text: '全国', value: '0' },{ text: '1km', value: '1' },{ text: '区', value: '2' },{ text: '市', value: '3' }],
                sort:'T1.CRE_TIME',
                desc:'DESC',
                changeDate:'',
                showEdit:false,
                tableData:[]
            }
        },
        created() {
           
        },
        activated() {
            this.fetchData();
            this.fetchList(this.pageInfo.pageNum);
        },
        methods: {
            fetchData () {
                
                 this.dataApi.ajax('singlePerEnveInfo',{userEnveCode:this.$route.params.id}, res => {
                        if (res.responseType === 'S') {
                            this.basicForm=res
                            this.basicForm.enveImageAddress=[res.enveImageAddress]
                        }
                 });
            },
            fetchList(page=1){
              this.pageInfo.pageNum=page
              if (this.activeName==1) {
                  this.table_loading = true;
                  this.dataApi.ajax('selectPageUserEnve',{pageNum:this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize,sort:this.sort,desc:this.desc,enveCode:this.$route.params.id}, res => {    
                        if (res.responseType === 'S') {
                            this.table_loading = false;
                            this.pageInfo=res
                        }
                 });
              }else if (this.activeName==2) {
                  this.table_loading = true;
                  this.dataApi.ajax('selectPageUserLeaving',{pageNum:this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize,sort:this.sort,desc:this.desc,enveCode:this.$route.params.id}, res => {    
                        if (res.responseType === 'S') {
                            this.table_loading = false;
                            this.pageInfo=res
                        }
                 });
              }else if(this.activeName==3) {
                  this.table_loading = true;
                  this.dataApi.ajax('selectUserVoteRecord',{pageNum:this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize,preEnveCode:this.$route.params.id}, res => {    
                    if (res.responseType === 'S') {
                            this.table_loading = false;
                            this.pageInfo=res
                        }
                 });
              } else if(this.activeName==4) {
                  this.table_loading = true;
                  this.dataApi.ajax('selectUserVoteCount',{preEnveCode:this.$route.params.id}, res => {    
                    if (res.responseType === 'S') {
                            this.table_loading = false;
                            this.tableData=res.dtoList
                        }
                 });
              }
                
            },
            handleClick(tab, event) {
                this.sort='T1.CRE_TIME'
                if (this.activeName=='1') {
                   this.fetchList(1)
                }
                if (this.activeName=='2') {
                   this.fetchList(1)
                }
                if (this.activeName=='3') {
                   this.fetchList(1)
                }
                if (this.activeName=='4') {
                   this.fetchList(1)
                }

            },
            uploading(f) {
               this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                    //console.log(res)
                    if (res.responseType == 'S') {
                        f.images.splice(f.index,1,res.filePath)
                        this.submit(res.filePath,'enveImageAddress')
                    }
                });

            },
            order(column){
                if (!column.order) {
                    return;
                }
                 if (column.order=='ascending') {
                     this.desc='ASC'
                }else{
                    this.desc='DESC'
                }
                this.sort=column.prop.toUpperCase()
                this.fetchList(this.pageInfo.pageNum)
            },
            deleteById(id){

                this.$confirm('确定删除?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                     this.dataApi.ajax('delUserLeaving',{leavingCode:id}, res => {
                        this.table_loading = false;
                        if (res.responseType === 'S') {
                           this.showMsg('删除成功')
                           this.fetchList(this.pageInfo.pageNum)
                        }
                    });
                  
                }).catch(() => {
                          
                });
            },
            handleCurrentChange(val) {
               this.fetchList(val)            
            },
            submit(obj,type){
               if (type=='enveContent') {
                  this.showEdit=false
               }
               this.dataApi.ajax('editPerEnve',{[type]:obj,perEnveCode:this.$route.params.id}, res => {
                        if (res.responseType == 'S') {
                             this.showMsg('修改成功')
                             this.fetchData()
                        }else{
                             this.fetchData()
                        }

                 });
            },
            jump(type,id){
               if (type==1) {
                  this.$router.push('/merchant/goods_detail/'+id)
               }else if (type==2) {
                  this.$router.push('/merchant/combo_detail/'+id)
               }else if (type==3) {
                  this.$router.push('/merchant/hotel_detail/'+id)
               }else if (type==4) {
                  this.$router.push('/merchant/voucher_detail/'+id)
               }
            }
        }
    }
</script>
