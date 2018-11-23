<template>
    <div class="customer">
        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                        <h3><el-button type="primary" @click="goBack()">返回</el-button>&nbsp;&nbsp;{{ areaTitle }}交易记录</h3>
                        <br>
                        <el-form-item label="">
                             <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                                  <el-option label="买家用户名" value="buyerName"></el-option>
                                  <el-option label="卖家用户名" value="sellerName"></el-option>
                              </el-select>
                             <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                        </el-form-item>                    
                        <el-button type="primary" @click="fetchData()">查询</el-button> 
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
                    name:'',
                    cityCode:'',
                    sellerName:'',
                    buyerName:'',
                    orderStat:'10002'
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos: []
                },
                formLabelWidth: '120px',
                urgentList:[{ text: '系统红包', value: '系统红包' },{ text: '个人红包', value: '个人红包' },{ text: '个人加密红包', value: '个人加密红包' }],
                areaList:[{ text: '一公里', value: '一公里' },{ text: '全国', value: '全国' },{ text: '全区/县', value: '全区/县' }],
                enableStateArr: ['审核中', '已通过', '已拒绝','已挂起'],
                startTime1:0,
                endTime1:0,
                startTime2:0,
                endTime2:0,
                refusal:'',
                sumMap:{},
                areaTitle:''
            }
        },
        created(){
            let urlPram = getRequestParam(location.hash)
            // this.id = urlPram.id
            this.areaTitle = decodeURI(urlPram.cityName)
            this.formInline.cityCode=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
        },
        methods: {

            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type] = this.formInline.name
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

        }
    }
</script>
