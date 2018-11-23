<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-button type="primary" @click="edit('add')">新增</el-button>
                    <el-form-item label="公司名称">
                        <el-input v-model="formInline.companyName" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="fetchData(1)">查询</el-button>
                     
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
                    type="index"
                    width="80"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="companyName"
                    label="公司名称">
            </el-table-column>
            <el-table-column
                    prop="total_Share"
                    sortable='custom'
                    label="投放股权总数">
                    <template scope="scope">
                         <span>{{ cutNum(scope.row.totalShare,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="已发送股权数量"
                    prop="totalNumber">
            </el-table-column>
            <el-table-column
                    prop="total_Share"
                    label="剩余股权">
                    <template scope="scope">
                         <span>{{ cutNum(scope.row.totalShare-scope.row.totalNumber,4) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="已回购股权数量"
                    prop="exchangeShare">
            </el-table-column>
            <el-table-column
                    label="预计年化收益率"
                    sortable='custom'
                    prop="proit_Rate">
                    <template scope="scope">
                         <span>{{ scope.row.proitRate }}%</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="入驻时间"
                    prop="creTime">
            </el-table-column>
            <el-table-column label="操作" width="190">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row.holdCompanyId)">公司详情
                    </el-button>
                    <el-button type="success" size="small" @click="send(scope.row.holdCompanyId)">发股权
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="paginate">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.pageNum"
                    :page-size="pageInfo.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pageInfo.count"
                    >
            </el-pagination>
        </div>

        <el-dialog title="发股权红包" v-model="redDialog">
            <el-form  :v-model="f" style="width: 85%;"  label-width="150px">
                <el-form-item label="剩余股数：">
                    <span>{{ cutNum(totalShare-totalNumber,4)}}股</span>
                </el-form-item>
                <el-form-item label="单个红包发放股权:"
                              label-width="150px">
                    <el-input  v-model="f.single" style="width: 140px;"></el-input>
                    *股权红包数值最多保留4位小数
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

</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                formInline: {
                    companyName:'',
                    sort:'CRE_TIME',
                    desc:'DESC',
                    pageNum:1,
                    pageSize: 10
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
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
                totalShare:'',
                totalNumber:'',
                province:[],
                city:[],
                area:[],
                areaList:[{ text: '全国', value: '4' },{ text: '市', value: '3' },{ text: '区', value: '2' }],
                loading:false

            }
        },
        created(){

        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
            this.fetchArea(0,'province',1);
        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.dataApi.ajax('selectPageUserHoldCompany', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            handleCurrentChange(val) {
               this.fetchData(val)            
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
            edit(id){
                this.$router.push('/company/edit_company/'+id)
            },
            send(id){
                this.dataApi.ajax('singleUserHoldCompany',{holdCompanyId:id}, res => {
                    if (res.responseType === 'S') {
                          this.totalNumber=res.dto.totalNumber
                          this.totalShare=res.dto.totalShare
                          this.redDialog=true;
                          this.f={
                                storeId:id,
                                single:'',
                                totalNumber:'',
                                totalAmount:'',
                                enveRange:'4',
                                province:'',
                                city:'',
                                area:''
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

        }
    }
</script>
