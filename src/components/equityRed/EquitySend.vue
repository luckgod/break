<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <el-button type="primary" @click="send()">发股权</el-button>
                        <el-form-item label="所属公司：">
                             <el-input v-model="formInline.companyName" style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="红包状态：">
                            <el-select v-model="formInline.visibleFlag" style="width: 140px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.text" :value="item.value" v-for="item in enableStateArr"></el-option>
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

        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%">
            <el-table-column
                    prop="perEnveCode"
                    label="红包编号">
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
                    prop="companyName"
                    label="所属公司">
            </el-table-column>
            <el-table-column
                    prop="identity"
                    label="红包状态">
                    <template scope="scope">
                        <span>{{ findState(scope.row.visibleFlag,enableStateArr) }}</span>
                    </template>
            </el-table-column>
             <el-table-column
                    prop="enveRange"
                    label="股权红包范围">
                    <template scope="scope">
                        <span>{{scope.row.detailedArea}}</span>
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
      
         <!--股权红包发送统计-->
        <el-dialog title="股权红包发送统计" v-model="dialogVisible">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="所属公司：">
                             <el-input v-model="formInline.name" style="width: 150px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="红包状态：">
                    <el-select v-model="formInline.visibleFlag" style="width: 140px;" :disabled="true">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.text" :value="item.value" v-for="item in enableStateArr"></el-option>
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
                    {{ cutNum(sumMap.quantityOfShares,4) }}
                </div>
                <div>
                   红包发放股权
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
        </el-dialog>

        <el-dialog title="发股权红包" v-model="redDialog">
            <el-form  :v-model="f" style="width: 85%;"  label-width="150px">
                <el-form-item label="选择公司">
                    <el-select v-model="f.storeId" style="width: 250px;" @change="checkDetail(f.storeId)">
                        <el-option :label="item.companyName" :value="item.holdCompanyId" v-for="item in companyList" ></el-option>
                    </el-select>
                    <span v-if="f.storeId">*剩余{{ cutNum(totalShare-totalNumber,4)}}股</span>
                </el-form-item>
                <el-form-item label="单个红包发放股权:"
                              label-width="150px">
                    <el-input  v-model="f.single" style="width: 140px;"></el-input> *股权红包数值最多保留4位小数
                </el-form-item>
                <el-form-item label="发放红包个数:"
                              label-width="150px">
                    <el-input  v-model="f.totalNumber" style="width: 140px;"></el-input>
                </el-form-item>
                <el-form-item label="本次发放总股权:"
                              label-width="150px">
                    {{ f.single*f.totalNumber }}股
                </el-form-item>
                <el-form-item label="红包范围：">
                    <el-select v-model="f.enveRange" style="width: 140px;">
                        <el-option :label="item.text" :value="item.value" v-for="item in areaList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if="f.enveRange!='4'">
                   <el-select v-model="f.province" placeholder="省份" style="width: 120px;"  @change="fetchArea(f.province,'city',1)">
                        <el-option v-for="item in province" :label="item.name" :value="item.cityCode"></el-option>
                    </el-select>
                    <el-select v-model="f.city" placeholder="市" style="width: 120px;"  @change="fetchArea(f.city,'area',2)">
                        <el-option v-for="item in city" :label="item.name" :value="item.cityCode"></el-option>
                    </el-select>
                    <el-select v-model="f.area" placeholder="区" style="width: 120px;" v-if="f.enveRange=='2'">
                        <el-option v-for="item in area" :label="item.name" :value="item.cityCode"></el-option>
                    </el-select>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="redDialog = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submitForm">提 交</el-button>
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
                    sort:'CRE_TIME',
                    desc:'desc',
                    beginTime:'',
                    endTime:'',
                    pageSize:10,
                    companyName:'',
                    visibleFlag:'',
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                areaList:[{ text: '全国', value: '4' },{ text: '市', value: '3' },{ text: '区', value: '2' }],
                enableStateArr: [{ text: '领取完', value: '0' },{ text: '未领取完', value: '1' },{ text: '已过期', value: '2' },{ text: '过期退款中', value: '3' },{ text: '过期退款失败', value: '4' }],
                startTime1:'',
                endTime1:'',
                dialogVisible:false,
                sumMap:{
                    quantityOfShares:0,
                    countEnve:0
                },
                redDialog:false,
                f:{
                    storeId:'',
                    single:'',
                    totalNumber:'',
                    totalAmount:'',
                    enveRange:'4',
                    province:'',
                    city:'',
                    area:''
                },
                loading:false,
                companyList:[],
                totalShare:'',
                totalNumber:'',
                province:[],
                city:[],
                area:[],
            }
        },
        created(){
        
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchList()
            this.fetchArea(0,'province',1);
  
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
                this.dataApi.ajax('selectDisShare',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            edit(id){
               this.$router.push('/equityRed/equity_detail/'+id)
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
            fetchList(){
                 this.dataApi.ajax('selectUserHoldCompany',null, res => {
                    if (res.responseType === 'S') {
                         this.companyList = res.userHoldCompanyDtos
                    }
                });
            },
            fetchArea(parentCode, type, rank) {
                if (parentCode===0 || parentCode>0) {
                    this.dataApi.ajax('selectSysCity', {cityCode: parentCode}, res => {
                        if (res.responseType === 'S') {
                               this[type] = res.dtos
                                if (rank === 1) {
                                    this.f.city = ''
                                    this.f.area = ''
                                } else if (rank === 2) {
                                    this.f.area = ''
                                }
                                return false;
                        }
                    });
                }else{
                    this.f.city = ''
                    this.f.area = ''
                }

            },
            changeType(){
                this.formInline.userName=''
                this.formInline.perEnveCode=''
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
                this.dataApi.ajax('countShareEnve',this.formInline, res => {
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
            submitForm(){
                 if (!this.f.storeId) {
                    this.showMsg('请选择公司','warning');
                    return
                 }
                 if (!isFloat(this.f.single)) {
                    this.showMsg('单个红包发放股权不正确','warning');
                    return
                 }
                 if (fetchNum(this.f.single)>4) {
                    this.showMsg('单个红包发放股权小数点不能超过4位','warning');
                    return
                 }
                 if (!isNumber(this.f.totalNumber)) {
                    this.showMsg('发放红包个数不正确','warning');
                    return
                 }
                 var data={
                    storeId:this.f.storeId,
                    totalNumber:this.f.totalNumber,
                    totalAmount:this.f.single*this.f.totalNumber,
                    enveRange:this.f.enveRange
                 }
                 if (this.f.enveRange=='3') {
                    if (this.f.city=='') {
                        this.showMsg('请选择市','warning');
                        return;
                    }else{
                        data.creArea=this.f.city
                    }
                 }
                 if (this.f.enveRange=='2') {
                    if (this.f.area=='') {
                        this.showMsg('请选择区','warning');
                        return;
                    }else{
                        data.creArea=this.f.area
                    }
                 }
                 this.dataApi.ajax('addPerShareEnve',data, res => {
                    if (res.responseType === 'S') {
                          this.showMsg('发送成功');
                          this.redDialog=false;
                          this.fetchData(this.pageInfo.pageNum);
                    } 
                });
            },
            checkDetail(id){
                this.dataApi.ajax('singleUserHoldCompany',{holdCompanyId:id}, res => {
                    if (res.responseType === 'S') {
                          this.totalNumber=res.dto.totalNumber
                          this.totalShare=res.dto.totalShare
                    }  
                });
            },
            send(){
                this.redDialog=true;
                this.f={
                    storeId:'',
                    single:'',
                    totalNumber:'',
                    totalAmount:'',
                    enveRange:'4',
                    province:'',
                    city:'',
                    area:''
                }
            }

        }
    }
</script>
