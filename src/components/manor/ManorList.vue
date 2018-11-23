<template>
    <div class="admin-home" style="padding-top: 20px;">
                <div class="radius" style="text-align: left">
                     <h4 class="manor_setting_h4">主城参数信息</h4>
                     <div class="summarize" style="font-size: 15px;">
                         <div>
                            购买主城金额溢价比例:溢价的
                            <el-input v-model="city_price_up_point" style="width: 120px;" :disabled="showEdit"></el-input>
                          </div>
                          <div style="text-align:left">
                            上一任城主赚取金额：溢价的
                            <el-input v-model="seller_profit_point" style="width: 100px;" :disabled="showEdit"></el-input>
                          </div>
                         
                          <div style="margin-top: 10px;text-align:left">
                               共{{ areaInfo.total }}主城&nbsp;&nbsp;&nbsp;已占领{{ areaInfo.isOwnTotal }}个&nbsp;&nbsp;&nbsp;未占领{{ areaInfo.isNotOwnTotal }}个 
                          </div>
                     </div>
                     
                     <div class="summarize_input" style="text-align: right;vertical-align: top;margin-top: 10px">
                          <div style="height: 50px;text-align:left;">
                              城主个人收益：城内用户收红包股数            
                          </div>
                          <div style="height: 50px;text-align:left;padding: 0">
                              红包排行停留时间：<el-input v-model="LatticeOverdue"  style="width: 100px;margin-left: 10px;" :disabled="showEdit"></el-input> 天              
                          </div>
                          <div style="text-align:left">
                               主城交易默认封顶价：
                               <el-input v-model="city_max_price" style="width: 100px;" :disabled="showEdit"></el-input>
                               元
                          </div>
                    </div>
                    <div class="summarize_input" style="text-align: left;vertical-align: top;margin-left: -20px;">
                          <div>
                              <el-input v-model="CityGetPer"  style="width: 100px;" :disabled="showEdit"></el-input>
                          </div>
                           <div>
                              
                          </div>

                    </div>
                    <div class="summarize_input" style="vertical-align: top;margin-top: 10px;margin-left: 10px" v-if="powerShow('主城参数设置')">
                         <el-button type="primary" v-if="showEdit" @click="showEdit=false">修改</el-button>
                         <el-button type="primary" v-if="!showEdit" @click="submit" :loading="loading">保存</el-button>
                    </div>
                    <div style="text-align: left;">
                       <h4 class="manor_setting_h4" style="margin-right: 0;text-align: center">
                       城主特权信息
                       <div>
                         （APP显示）
                       </div>
                       </h4>
                        <div class="summarize_input">
                              <el-input v-model="contentInfo.textContent"  style="width: 500px;margin-left: 10px" type="textarea" :disabled="showEdit" :rows="3"></el-input>
                        </div>
                        <div style="text-align:left;display: inline-block;vertical-align: top;margin-left: 20px;">
                               主城默认代理价：
                               <el-input v-model="city_agent_price" style="width: 100px;" :disabled="showEdit"></el-input>
                               元
                               <div style="color:red;margin-top: 10px;">提示：未设置的主城代理价和封顶价都取默认值</div>
                        </div>

                    </div>
                    
                    
                </div>
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="按主城区域：">
                            <el-select v-model="formInline.province" placeholder="省份" style="width: 120px;"  @change="fetchArea(formInline.province,'city',1)">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in province" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                            <el-select v-model="formInline.city" placeholder="市" style="width: 120px;"  @change="fetchArea(formInline.city,'area',2)">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in city" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                            <el-select v-model="formInline.area" placeholder="区" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in area" :label="item.name" :value="item.cityCode"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="城主用户名">
                             <el-input v-model="formInline.userName" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="占领情况">
                            <el-select v-model="formInline.isOwn" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已占领" value="1"></el-option>
                                <el-option label="未占领" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="主城状态">
                            <el-select v-model="formInline.isTransfer" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="暂不转让" value="0"></el-option>
                                <el-option label="此城出让" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData()">查询</el-button> 
                </el-form>
                <el-table
                    :data="pageInfo.dtos"
                    v-loading="table_loading"
                    element-table_loading-text="加载中"
                    stripe
                    @sort-change='order'
                    style="width: 100%">
                <el-table-column
                        prop="cityName"
                        label="主城区域">
                </el-table-column>
                <el-table-column
                        prop="identity"
                        label="广告标题">
                        <template scope="scope">
                           <el-button type="primary" size="small" @click="checkDetail(scope.row.userCode)">查看</el-button>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="identity"
                        label="当前城主">
                        <template scope="scope">
                           <router-link :to="'/user/user_detail/'+scope.row.userCode" target="_blank" 
                           v-if="scope.row.userCode!=0">
                              <span class="pointer">{{ scope.row.userName}}</span>
                           </router-link>
                           <span v-else>{{ scope.row.userName }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="userPhone"
                        label="注册手机号">
                </el-table-column>
                <el-table-column
                        prop="city_Price"
                        sortable='custom'
                        label="目前主城价格（元）">
                        <template scope="scope">
                           <span>{{ scope.row.cityPrice }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="agent_Price"
                        sortable='custom'
                        label="主城代理价">
                        <template scope="scope">
                           <span>{{ scope.row.agentPrice==0? '--':scope.row.agentPrice }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        prop="max_Price"
                        sortable='custom'
                        label="主城封顶价">
                        <template scope="scope">
                           <span>{{ scope.row.maxPrice==0? '--':scope.row.maxPrice}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        sortable='custom'
                        prop="CI.UPD_TIME"
                        label="城主更换时间">
                        <template scope="scope">
                           <span>{{ scope.row.updTime }}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        label="占领情况">
                        <template scope="scope">
                            <span>{{scope.row.userCode=='0'? '未占领':'已占领'}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        label="主城状态">
                        <template scope="scope">
                            <span>{{scope.row.isTransfer=='0'? '暂不转让':'此城出让'}}</span>
                        </template>
                </el-table-column>
                <el-table-column label="转让状态">
                    <template scope="scope">
                        <span style="cursor: pointer;"  v-if="scope.row.isTransfer==1"><img src="../../assets/images/on.png"  width="50" height="50" @click="powerOn(scope.row.cityCode,'关闭')"></span>
                        <span style="cursor: pointer;" v-else><img src="../../assets/images/guan.png"  width="50" height="50" @click="powerOn(scope.row.cityCode,'开启')"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商家"
                        sortable='custom'
                        prop="SI.STORE_COUNT">
                        <template scope="scope">
                            <router-link :to="'/merchant/merchant_list?areaNum='+scope.row.cityNum" target="_blank" 
                           v-if="scope.row.userCode!=0">
                              <span class="pointer">{{scope.row.storeCount}}位</span>
                           </router-link>
                        </template>
                </el-table-column>
                <el-table-column label="主城转让按钮">
                    <template scope="scope">
                        <span style="cursor: pointer;"  v-if="scope.row.transferRoot==1"><img src="../../assets/images/on.png"  width="50" height="50" @click="power(scope.row.cityCode,'关闭')"></span>
                        <span style="cursor: pointer;" v-else><img src="../../assets/images/guan.png"  width="50" height="50" @click="power(scope.row.cityCode,'开启')"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="edit(scope.row)">交易记录</el-button>
                        <el-button type="primary" size="small" @click="top(scope.row)">红包排行</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="其他" width="140">
                    <template scope="scope">
                        <span class="pointer" style="color: #FCB78D;" @click="changeAgent(scope.row)">代理价</span>
                        <span class="pointer" style="color: #FCB78D;" @click="changeMax(scope.row)">封顶价</span>
                        <span class="pointer" style="color: #99A7FF;" @click="agencyRecord(scope.row)">代理变更</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态变更记录" width="130">
                    <template scope="scope">
                        <span class="pointer" @click="detail(scope.row)">详情</span>
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
            
           <!--广告详情-->
            <el-dialog title="广告详情" v-model="dialogVisible" size="small">
                 <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;">
                    <el-form-item label="内容：" label-width="120px">
                        <el-input type="textarea" v-model="form.adContent" style="width: 80%;"></el-input>
                    </el-form-item> 
                    <el-form-item label="图片：" label-width="100px" >
                        <we-ui-uploads :images="form.imgUrl"
                                       :maxCount="1"
                                       :maxSize="1024*1024"
                                       @uploading="uploading" ></we-ui-uploads>
                         建议尺寸：630×360px
                    </el-form-item>
                                
                 </el-form>
                 <div style="text-align: center">
                     <el-button type="primary" @click="submitAd()"  :loading="loading">保 存
                     </el-button>
                 </div>
                 
            </el-dialog>

             <!--设置代理价-->
            <el-dialog title="设置代理价" v-model="dialogVisible2" size="tiny">
                 <el-form :model="agent_info" style="background-color: #FFFFFF;padding-top: 20px;">
                    <el-form-item label="主城区域：" label-width="120px">
                        <span>{{ agent_info.area }}</span>
                    </el-form-item> 
                    <el-form-item label="当前代理价：" label-width="120px">
                        <span>{{ agent_info.price }}</span>
                    </el-form-item> 
                    <el-form-item label="新的代理价：" label-width="120px">
                        <el-input v-model="agent_info.agentPrice" style="width:180px"></el-input> 元
                    </el-form-item>             
                 </el-form>
                 <div style="text-align: center">
                     <el-button type="primary" @click="submitAgent()"  :loading="loading">保 存
                     </el-button>
                 </div>  
            </el-dialog>

            <!--设置封顶价-->
            <el-dialog title="设置封顶价" v-model="dialogVisible3" size="tiny">
                 <el-form :model="max_info" style="background-color: #FFFFFF;padding-top: 20px;">
                    <el-form-item label="主城区域：" label-width="120px">
                        <span>{{ max_info.area }}</span>
                    </el-form-item> 
                    <el-form-item label="当前封顶价：" label-width="120px">
                        <span>{{ max_info.price }}</span>
                    </el-form-item> 
                    <el-form-item label="新的封顶价：" label-width="120px">
                        <el-input v-model="max_info.maxPrice" style="width:180px"></el-input> 元
                    </el-form-item>             
                 </el-form>
                 <div style="text-align: center">
                     <el-button type="primary" @click="submitMax()"  :loading="loading">保 存
                     </el-button>
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
.manor_setting_h4{
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
                loading:false,
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos:[]
                },
                formInline: {
                    pageNum: '',
                    sort:'CI.UPD_TIME',
                    desc:'desc',
                    pageSize:10,
                    userName:'',
                    province:'',
                    city:'',
                    area:'',
                    cityNum:'',
                    isOwn:'',
                    isTransfer:''
                },
                urgentList:[{ text: '系统红包', value: '系统红包' },{ text: '个人红包', value: '个人红包' },{ text: '个人加密红包', value: '个人加密红包' }],
                areaList:[{ text: '一公里', value: '一公里' },{ text: '全国', value: '全国' },{ text: '全区/县', value: '全区/县' }],
                sumMap:{},
                showEdit:true,
                province:[],
                city:[],
                area:[],
                form:{
                  imgUrl:[],
                  adContent:'',
                  cityCode:'',
                  imgWidth:'',
                  imgWidth:'',
                  adCode:'',
                  imgCode:''
                },
                dialogVisible:false,
                dialogVisible2:false,
                dialogVisible3:false,
                areaInfo:{},
                textContent:'',
                contentInfo:{},
                city_price_up_point:'',    //购买主城金额溢价比例
                seller_profit_point:'',    //上一任城主赚取金额
                CityGetPer:'',            //城内用户收红包股数
                LatticeOverdue:'',     //红包排行停留时间
                city_max_price:'',    //主城默认封顶金额，单位元
                city_agent_price:'',    //主城默认代理金额，单位元,
                agent_info:{
                    area:'',
                    price:'',
                    agentPrice:'',
                    cityCode:''
                },
                max_info:{
                    area:'',
                    price:'',
                    maxPrice:'',
                    cityCode:''
                }
            }
        },
        created() {

        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchArea(0,'province',1);
            this.fetchArgument();
            this.fetchOccupy();
            this.fetchPrivilege();
  
        },
        methods: {
           fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
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
                this.dataApi.ajax('selectPageCityInfoDetail',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            fetchOccupy(){    //查询主城占领情况
               this.dataApi.ajax('getAllTotal',null, res => {
                    if (res.responseType === 'S') {
                        this.areaInfo=res
                    }
                });
            },
            fetchPrivilege(){   //查询城主特权信息
               this.dataApi.ajax('singleSysTextInfo',{textCode:'0000000007'}, res => {
                    if (res.responseType === 'S') {
                        this.contentInfo=res
                    }
                });
            },
            fetchArgument(){    //查询系统参数
                this.dataApi.ajax('sysParamQuery',{
                sysCodes:'city_price_up_point,seller_profit_point,CityGetPer,LatticeOverdue,city_max_price,city_agent_price'}, res => {
                    if (res.responseType === 'S') {
                         for(var k in res.map){
                              this[k]=res.map[k] 
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
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            submit(){  //保存红包信息设置
                
                this.loading=true
                this.dataApi.ajax('editSysTextInfo',this.contentInfo, res => {
                        if (res.responseType === 'S') {
                              // this.showMsg('修改成功')
                              this.showEdit=true
                              this.loading=false
                              this.fetchPrivilege()
                        } 
                    });

                var dtos=[
                 {
                    sysCode:'city_price_up_point',
                    sysKey:'city_price_up_point',
                    sysValue:this.city_price_up_point
                 },
                 {
                    sysCode:'seller_profit_point',
                    sysKey:'seller_profit_point',
                    sysValue:this.seller_profit_point
                 },
                 {
                    sysCode:'CityGetPer',
                    sysKey:'CityGetPer',
                    sysValue:this.CityGetPer
                 },
                 {
                    sysCode:'LatticeOverdue',
                    sysKey:'LatticeOverdue',
                    sysValue:this.LatticeOverdue
                 },
                 {
                    sysCode:'city_max_price',
                    sysKey:'city_max_price',
                    sysValue:this.city_max_price
                 },
                 {
                    sysCode:'city_agent_price',
                    sysKey:'city_agent_price',
                    sysValue:this.city_agent_price
                 },
                
                 ]
                    
                 this.dataApi.ajax('batchEditSysParam',{dtos:JSON.stringify(dtos)}, res => {    
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功');
                              this.loading=false;
                              this.showEdit=true;
                              this.fetchArgument();

                        }
                 });
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
            uploading(f) {
               this.loading=true
               this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                    if (res.responseType == 'S') {
                        f.images.splice(f.index,1,res.filePath)
                        this.form.imgHeight=res.height
                        this.form.imgWidth=res.width
                        this.loading=false
                    }
                });

            },
            checkDetail(id){
                this.dataApi.ajax('singleCityAdByCityCode',{cityCode:id}, res => {
                    if (res.responseType === 'S') {
                        if (res.isExist==0) {  
                              this.form={
                                  imgUrl:[],
                                  adContent:'',
                                  cityCode:id,
                                  imgHeight:'',
                                  imgWidth:'',
                                  adCode:'',
                                  imgCode:''
                               }
                        }else{
                            this.form={
                                  imgUrl:[res.imgUrl],
                                  adContent:res.adContent,
                                  cityCode:id,
                                  imgHeight:res.imgHeight,
                                  imgWidth:res.imgWidth,
                                  adCode:res.adCode,
                                  imgCode:res.imgCode
                            }
                        }
                        this.dialogVisible=true
                       
                    }
                });
            },
            edit(item){
               this.$router.push('/manor/manor_deal/'+item.cityCode+'?cityName='+item.cityName)
            },
            top(item){
               this.$router.push('/merchant/red_top?cityNum='+item.cityNum+'&cityName='+item.cityName)
            },
            agencyRecord(item){
               this.$router.push('/manor/agency_record/'+item.cityNum+'?cityName='+item.cityName)
            },
            detail(item){
               this.$router.push('/manor/change_record/'+item.cityCode+'?cityName='+item.cityName)
            },
            submitAd(){
              if (this.form.imgUrl.length==0) {
                this.showMsg('请上传广告图片','warning');
                return;
              }
              var obj=generateObj(this.form)
              obj.imgUrl=obj.imgUrl+''
              if (this.form.adCode=='') {
                this.dataApi.ajax('addCityAd',obj, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('修改广告成功')
                        this.dialogVisible=false
                       
                    }
                });
              }else{
                this.dataApi.ajax('editCityAd',obj, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('修改广告成功')
                        this.dialogVisible=false
                       
                    }
                });
              }
            },
            changeAgent(item){
                  this.agent_info={
                       area:item.cityName,
                       price:item.agentPrice,
                       agentPrice:'',
                       cityCode:item.cityCode
                  }
                  this.dialogVisible2=true;
            },
            changeMax(item){
                  this.max_info={
                       area:item.cityName,
                       price:item.maxPrice,
                       maxPrice:'',
                       cityCode:item.cityCode
                  }
                  this.dialogVisible3=true;
            },
            submitAgent(){
                if (fetchNum(this.agent_info.agentPrice)>2) {
                    this.showMsg('代理价格只能精确到分','warning');
                    return;
                 }
                var data={
                    agentPrice:this.agent_info.agentPrice,
                    cityCode:this.agent_info.cityCode
                }
                this.loading=true;
                this.dataApi.ajax('editCityInfo',data, res => {
                    this.loading=false;
                    if (res.responseType === 'S') {
                        this.showMsg('代理价修改成功');
                        this.dialogVisible2=false;
                        this.fetchData(this.pageInfo.pageNum);
                    }
                });
            },
            submitMax(){
                if (fetchNum(this.max_info.maxPrice)>2) {
                    this.showMsg('封顶价只能精确到分','warning');
                    return;
                 }
                var data={
                    maxPrice:this.max_info.maxPrice,
                    cityCode:this.max_info.cityCode
                }
                this.loading=true;
                this.dataApi.ajax('editCityInfo',data, res => {
                    this.loading=false;
                    if (res.responseType === 'S') {
                        this.showMsg('封顶价修改成功');
                        this.dialogVisible3=false;
                        this.fetchData(this.pageInfo.pageNum);
                    }
                });
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
                     this.dataApi.ajax('editCityInfo',{cityCode:id,transferRoot:state}, res => {
                        if (res.responseType === 'S') {
                           this.showMsg(type+'成功')
                           this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                  
                }).catch(() => {
                          
                });
            },
            powerOn(id,type){
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
                     this.dataApi.ajax('editCityIsTransferForPlatform',{cityCode:id}, res => {
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
