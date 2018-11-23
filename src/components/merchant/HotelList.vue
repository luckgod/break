<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
                <el-button  @click="goBack()" type="primary" >返回</el-button>
               <!--  <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="按账号" value="phone"></el-option>
                            <el-option label="按真实姓名" value="realName"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="fetchData()">查询</el-button>
                     
                </el-form> -->
                <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px;">
                    <el-tab-pane :label="'服务商城'" name="1"></el-tab-pane>
                    <el-tab-pane :label="'代金券'" name="2"></el-tab-pane>
                 </el-tabs>
            </el-col>
        </el-row>

        <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px" v-show="activeName==1">
            <el-form-item label="按客房名称:">
                <el-input v-model="formInline.roomName" style="width: 150px;" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="按状态：">
                <el-select v-model="formInline.roomState" style="width: 120px;" >
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="item.text" :value="item.value" v-for="item in statList"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="fetchData(1)">查询</el-button>
        
        </el-form>
        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                v-show="activeName==1"
                style="width: 100%">
             <el-table-column
                    width="80"
                    type="index"
                    label="序号">
            </el-table-column>
            <el-table-column
                    label="图片">
                    <template scope="scope">
                        <img class="avatar" :src="scope.row.roomImg" style="width: 55px;height: 55px;border-radius: 0;">
                    </template>
            </el-table-column>
            <el-table-column
                    prop="roomName"
                    label="客房名称">
            </el-table-column>
            <el-table-column
                    label="排序值"
                    prop="room_Sort"
                    width="115"
                    sortable='custom'>
                    <template scope="scope">
                        <span>{{ scope.row.roomSort }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="stt_Price"
                    sortable='custom'
                    label="周日-周四价格">
                    <template scope="scope">
                        <span>{{ scope.row.sttPrice }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="fts_Price"
                    sortable='custom'
                    label="周五-周六价格">
                    <template scope="scope">
                        <span>{{ scope.row.ftsPrice }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="hotel_Room_Ratio"
                    label="让利比例">
                    <template scope="scope">
                        <span>{{ scope.row.roomDefRatio*100 }}%</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="normalState"
                    label="状态">
                    <template scope="scope">
                        <span>{{statList[scope.row.roomState].text}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="hotelDetail(scope.row.roomId)">查看</el-button>
                    <el-button type="danger" size="small"  v-if="scope.row.roomState==1"
                               @click="handleDelete(scope.row,'禁用')">禁用
                    </el-button>
                    <el-button type="success" size="small" v-else
                               @click="handleDelete(scope.row,'启用')">启用
                    </el-button> 
                </template>
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

        <!--代金券table-->
        <el-form :inline="true" :model="formInline2" class="demo-form-inline" label-width="120px" v-show="activeName==2">
            <el-form-item label="按代金券名称:">
                <el-input v-model="formInline2.voucherName" style="width: 150px;" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="按状态：">
                <el-select v-model="formInline2.voucherStat" style="width: 120px;" >
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="item.text" :value="item.value" v-for="item in statList"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="fetchData2(1)">查询</el-button>
        
        </el-form>
        <el-table
                :data="pageInfo2.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order2'
                v-show="activeName==2"
                style="width: 100%">
            <el-table-column
                    type="index"
                    width="80"
                    label="序号">
            </el-table-column>
            <el-table-column
                    label="封面">
                    <template scope="scope">
                        <img class="avatar" :src="scope.row.voucherCover" style="width: 55px;height: 55px;border-radius: 0;">
                    </template>
            </el-table-column>
            <el-table-column
                    prop="voucherName"
                    label="代金券名称">
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="voucher_Amt"
                    label="价格">
                    <template scope="scope">
                        <span>{{ scope.row.voucherAmt }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="voucherSunNum"
                    label="销量">
            </el-table-column>
            <el-table-column
                    prop="voucherNum"
                    label="库存">
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    label="有效期">
                    <template scope="scope">
                        <span>{{ scope.row.voucherStartTime }}-{{ scope.row.voucherEndTime }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="normalState"
                    label="状态">
                    <template scope="scope">
                        <span>{{statList[scope.row.voucherStat].text}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="voucherDetail(scope.row.voucherId)">查看</el-button>
                    <el-button type="danger" size="small"  v-if="scope.row.voucherStat==1"
                               @click="handleDelete2(scope.row,'禁用')">禁用
                    </el-button>
                    <el-button type="success" size="small" v-else
                               @click="handleDelete2(scope.row,'启用')">启用
                    </el-button> 
                </template>
            </el-table-column>
        </el-table>
        <div class="paginate" v-show="activeName==2">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo2.pageNum"
                    :page-size="pageInfo2.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pageInfo2.count"
                    >
            </el-pagination>
        </div>

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
</style>
<script>
    export default {
        data() {
            return {
                title: '用户列表',
                table_loading: false,
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos:[]
                },
                formInline: {
                    pageNo:1,
                    pageSize: 10,
                    sort:'CRE_TIME',
                    desc:'DESC',
                    roomState:'',
                    roomName:'',
                    storeId:''
                },
                formInline2: {
                    pageNum:1,
                    sort:'VOUCHER_AMT',
                    desc:'DESC',
                    pageSize:10,
                    storeId:'',
                    voucherType:'1',
                    voucherName:'',
                    voucherStat:'',
                    storeId:''
                },
                pageInfo2: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                loading:false,
                dialogVisible:false,
                activeName: '1',
                sortList:[],
                secondList:[],
                showSort:false,
                storeId:'',
                statList:[{ text: '商家禁用', value: '0' },{ text: '已启用', value: '1' },{ text: '平台禁用', value: '2' }]

            }
        },
        created(){
            this.formInline.storeId=this.$route.params.id
            this.formInline2.storeId=this.$route.params.id
            this.storeId=this.$route.params.id
            this.selectSort()
            this.fetchData(this.pageInfo.pageNum);
        },
        activated() {
            
        },
        methods: {
            fetchData (page = 1) {
                 this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.dataApi.ajax('selectPageStoreHotelRoom',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
             fetchData2 (page = 1) {
                this.table_loading = true;
                this.pageInfo2.pageNum = page
                this.formInline2.pageNum = this.pageInfo2.pageNum
                this.dataApi.ajax('selectPagePayStoreVoucher',this.formInline2, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S'){
                        this.pageInfo2 = res
                    }
                });

            },
            changeType(){
                this.formInline.phone=''
                this.formInline.realName=''
            },
            handleCurrentChange(val) {
               
                if (this.activeName=='1') {
                   this.fetchData(val)
                }
                if (this.activeName=='2') {
                   this.fetchData2(val)
                }          
            },
            hotelDetail(id){
                this.$router.push('/merchant/hotel_detail/' + id)
            },
            voucherDetail(id){
                this.$router.push('/merchant/voucher_detail/' + id)
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
            order2(column){
                if (!column.order) {
                    return;
                }
                 if (column.order=='ascending') {
                     this.formInline2.desc='ASC'
                }else{
                    this.formInline2.desc='DESC'
                }
                this.formInline2.sort=column.prop.toUpperCase()
                this.fetchData2(this.pageInfo2.pageNum)
            },
            check(item){
               this.$router.push('/manor/manor_deal/'+item.cityCode+'?cityName='+item.cityName)
            },
            handleClick(tab, event) {
                if (this.activeName=='1') {
                   this.fetchData(1)
                }
                if (this.activeName=='2') {
                   this.fetchData2(1)
                }

            },
            selectSort(){
                this.dataApi.ajax('selectGoodCate',{cateState:'1',storeId:this.storeId}, res => {
                    //console.log(res)
                    if (res.responseType === 'S') {
                       this.sortList = res.dtos
                    }
                });

            },
            selectSort2(){
                this.formInline.goodTwoCate = ''
                this.dataApi.ajax('selectGoodCate', {cateId:this.formInline.goodOneCate,cateState:'1',storeId:this.storeId}, res => {
                    //console.log(res)
                    if (res.responseType === 'S') {
                        this.secondList = res.dtos
                    }
                });

            },
             handleDelete(item,type){
                 this.$confirm('确认'+type+'?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.dataApi.ajax('enableStoreHotelRoom',{roomId:item.roomId}, res => {
                            if (res.responseType === 'S') {
                                this.$message({
                                    type: 'success',
                                    message: type+'成功!'
                                });
                                this.fetchData(this.pageInfo.pageNum)
                            }
                        });
                    }).catch(() => {
                              
                    });
            },
             handleDelete2(item,type){
                var state=''
                state=item.voucherStat==1? 2:1
                this.$confirm('确认'+type+'?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.dataApi.ajax('editPayStoreVoucher',{voucherStat:state,voucherId:item.voucherId}, res => {
                            if (res.responseType === 'S') {
                                this.$message({
                                    type: 'success',
                                    message: type+'成功!'
                                });
                                this.fetchData2(this.pageInfo2.pageNum)
                            }
                        });
                    }).catch(() => {
                              
                    });
            },

        }
    }
</script>
