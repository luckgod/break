<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-form-item label="">
                             <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                  <el-option label="领取用户" value="receiveUserName"></el-option>
                                  <el-option label="红包编号" value="userEnveCode"></el-option>
                              </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="红包状态：">
                            <el-select v-model="formInline.receiveFlag" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in enableStateArr"></el-option>
                            </el-select>
                        </el-form-item>                  
                        <el-form-item label="发放时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="领取时间：">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime2" style="width:180px;"></el-date-picker>
                            到
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime2" style="width:180px;"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" @click="fetchData(1)">查询</el-button> 
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
                    prop="userEnveCode"
                    label="红包编号">
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="receive_Time"
                    label="领取时间">
                <template scope="scope">
                    <span>{{scope.row.receiveTime}}</span>
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
                    prop="quantityOfShares"
                    label="发放股数">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="红包股价值">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="系统广告">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="edit(scope.row.adCode)">查看</el-button>
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
                    prop="identity"
                    label="红包状态">
                    <template scope="scope">
                        <span>{{ findState(scope.row.receiveFlag) }}</span>
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



         <!--新增/编辑系统广告-->
        <el-dialog title="新增/编辑系统广告" v-model="dialogVisible" size="small">
             <el-form :model="form" style="background-color: #FFFFFF;padding-top: 20px;">
                <el-form-item label="广告封面：" label-width="100px" >
                    <we-ui-uploads :images="form.adImageAddress"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading" ></we-ui-uploads>
                     建议尺寸：630×360px
                </el-form-item>
                <el-form-item label="广告标题：" label-width="120px">
                    <el-input  v-model="form.adTitle" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接：" label-width="120px">
                    <el-input  v-model="form.adLinkAddress" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="广告简介：" label-width="120px">
                    <el-input type="textarea" v-model="form.adMark" style="width: 80%;"></el-input>
                </el-form-item>             
             </el-form>
             <div style="text-align: center">
                 <el-button type="primary" @click="onSubmit()" :disabled="!form.adTitle" :loading="loading">保 存
                 </el-button>
             </div>
             
        </el-dialog>

        <!--个人红包发送统计-->
        <el-dialog title="系统红包发送统计" v-model="dialogVisible2">
            <el-form :inline="true" class="demo-form-inline">
                 <el-form-item label="">
                     <el-select v-model="formInline.type" style="width: 120px;" @change="changeType" :disabled="true">
                          <el-option label="领取用户" value="receiveUserName"></el-option>
                          <el-option label="红包编号" value="userEnveCode"></el-option>
                      </el-select>
                     <el-input v-model="formInline.name" style="width: 150px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="红包状态：">
                    <el-select v-model="formInline.receiveFlag" style="width: 140px;" :disabled="true">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.text" :value="item.value" v-for="item in enableStateArr"></el-option>
                    </el-select>
                </el-form-item>                  
                <el-form-item label="发放时间：">
                    <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime1" style="width:180px;" :disabled="true"></el-date-picker>
                    到
                    <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime1" style="width:180px;" :disabled="true"></el-date-picker>
                </el-form-item>
                <el-form-item label="领取时间：">
                    <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime2" style="width:180px;" :disabled="true"></el-date-picker>
                    到
                    <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime2" style="width:180px;" :disabled="true"></el-date-picker>
                </el-form-item>
            </el-form>
            <hr>
            <div class="sumMap">
                <div class="sumMap_num">
                    {{ sumMap.quantityOfShares }}
                </div>
                <div>
                   系统红包发放股数
                </div>
            </div>
             <div class="sumMap">
                <div class="sumMap_num">
                     {{ sumMap.countEnve }}
                </div>
                <div>
                   发放个数
                </div>
            </div>
             <div class="sumMap">
                <div class="sumMap_num">
                     {{ sumMap.amount }}
                </div>
                <div>
                   系统红包发放金额
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
                loading:false,
                formInline: {
                    pageNum: '',
                    pageSize: 10,
                    sort:'CRE_TIME',
                    desc:'desc',
                    distributeBeginTime:'',
                    distributeEndTime:'',
                    dateFlag:'',
                    pageSize:10,
                    beginTime:'',
                    endTime:'',
                    type:'receiveUserName',
                    distributeUser:'0',
                    receiveFlag:'',
                    receiveUserName:'',
                    userEnveCode:''
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
                form:{
                  adImageAddress:[],
                  adTitle:'',
                  adLinkAddress:'',
                  adMark:'',
                  perEnveCode:'',
                  adType:'2',
                  width:'',
                  height:''
                },
                enableStateArr: [{ text: '未领取', value: '0' },{ text: '已领取', value: '1' }],
                startTime1:'',
                endTime1:'',
                startTime2:'',
                endTime2:'',
                refusal:'',
                sumMap:{}
            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
  
        },
        methods: {

            fetchData (page = 1) {
                 //发放时间
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

                 //领取时间
                 if (this.startTime2 && this.endTime2) {
                    this.formInline.beginTime=dateFormat(this.startTime2)
                    this.formInline.endTime=dateFormat(this.endTime2)
                    if (strToTime(this.startTime2)>strToTime(this.endTime2)) {
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
                    if (this.startTime2&&!this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择结束时间'
                          });
                         return;
                    }
                    if (!this.startTime2&&this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择开始时间'
                          });
                         return;
                    }
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageSysEnve',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            edit(id){
                
                this.dataApi.ajax('selectAdInfo',{adCode:id}, res => {
                    if (res.responseType === 'S') {
                         this.form = res.adInfoDto
                         this.form.adImageAddress=[res.adInfoDto.adImageAddress]
                         this.dialogVisible=true
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
            changeType(){
                this.formInline.receiveUserName=''
                this.formInline.userEnveCode=''
            },
            uploading(f) {
               this.loading=true
               this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                    //console.log(res)
                    if (res.responseType == 'S') {
                        f.images.splice(f.index,1,res.filePath)
                        this.loading=false
                    }
                });

            },
            onSubmit(){
                if (this.form.adImageAddress.length==0) {
                    this.showMsg('请上传广告封面','warning');
                    return;
                }
                  var obj=generateObj(this.form)
                  obj.adImageAddress=obj.adImageAddress+''
                  this.dataApi.ajax('editAdInfo',obj, res => {
                        if (res.responseType === 'S') {
                           this.showMsg('修改成功');
                           this.dialogVisible=false;
                           this.fetchData(this.pageInfo.pageNum);
                        }
                  });
            },
            findState(type){
                    for (var i = this.enableStateArr.length - 1; i >= 0; i--) {
                        if (type==this.enableStateArr[i].value) {
                            return this.enableStateArr[i].text
                        }
                    }
            },
            statistics(){   //统计

               //发放时间
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

                 //领取时间
                 if (this.startTime2 && this.endTime2) {
                    this.formInline.beginTime=dateFormat(this.startTime2)
                    this.formInline.endTime=dateFormat(this.endTime2)
                    if (strToTime(this.startTime2)>strToTime(this.endTime2)) {
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
                    if (this.startTime2&&!this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择结束时间'
                          });
                         return;
                    }
                    if (!this.startTime2&&this.endTime2) {
                         this.$message({
                              type: 'warning',
                              message: '请选择开始时间'
                          });
                         return;
                    }
                    this.formInline[this.formInline.type] = this.formInline.name
                this.dataApi.ajax('sumEnveSys',this.formInline, res => {
                        if (res.responseType === 'S') {
                              if (res.countEnve==0) {
                                 this.showMsg('没有符合数据','warning')
                             }else{
                                 this.dialogVisible2=true
                                 this.sumMap=res
                             }
                        } 
                    });
            },

        }
    }
</script>
