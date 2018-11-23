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
                    <el-tab-pane :label="'普通商城'" name="1"></el-tab-pane>
                    <el-tab-pane :label="'代金券'" name="2"></el-tab-pane>
                 </el-tabs>
            </el-col>
        </el-row>

        <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px" v-show="activeName==1">
            <el-form-item label="商品名称:">
                <el-input v-model="formInline.goodName" style="width: 150px;" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="按状态：">
                <el-select v-model="formInline.goodState" style="width: 120px;" >
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已上架" value="2" ></el-option>
                    <el-option label="商家下架" value="3" ></el-option>
                    <el-option label="官方下架" value="6" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="按分类：">
                <el-select v-model="formInline.goodOneCate" style="width: 150px;"  @change="selectSort2()"
                       placeholder="一级分类">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.cateName" :value="item.cateId"
                           v-for="item in sortList"></el-option>
                </el-select>
                <el-select v-model="formInline.goodTwoCate" style="width: 150px;" placeholder="二级分类" v-if="formInline.goodOneCate">
                       <el-option label="全部" value=""></el-option>
                       <el-option :label="item.cateName" :value="item.cateId"
                               v-for="item in secondList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否启用优惠价：" label-width="130px">
                <el-select v-model="formInline.goodIsDiscount" style="width: 120px;" >
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已启用" value="1" ></el-option>
                    <el-option label="未启用" value="2" ></el-option>
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
                    type="index"
                    width="80"
                    label="序号">
            </el-table-column>
            <el-table-column
                    width="215"
                    label="商品">
                <template scope="scope">
                    <div style="display: inline-block;">
                        <img class="banner" :src="scope.row.goodCover" style="width:55px;">
                    </div>
                    <div style="display: inline-block;width: 120px;vertical-align: middle;padding: 10px;">{{scope.row.goodName}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="DIS_PRICE"
                    label="分类">
                    <template scope="scope">
                        <span>{{ scope.row.goodOneCateName }} - {{ scope.row.goodTwoCateName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="good_Price"
                    sortable='custom'
                    label="起售价（元）">
                    <template scope="scope">
                        <span>{{ scope.row.goodPrice }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="T1.good_Discount_Price"
                    label="优惠价（元）">
                    <template scope="scope">
                        <span v-if="scope.row.goodIsDiscount==1">{{ scope.row.goodDiscountPrice }}</span>
                        <span v-else>未启用</span>
                    </template>
            </el-table-column>
            <el-table-column
                     prop="good_Ratio"
                    label="让利比例">
                    <template scope="scope">
                          <span>{{ scope.row.goodRatio*100 }}%</span>
                    </template>
            </el-table-column>
            <el-table-column
                     prop="sales"
                     label="销量">
            </el-table-column>
            <el-table-column
                    prop="stock"
                    label="库存">
            </el-table-column>
            <el-table-column
                    prop="cre_Time"
                    sortable='custom'
                    label="上架时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="stock"
                    label="评价">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="check(scope.row.goodId)">查看</el-button>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="goodDetail(scope.row.goodId)">查看</el-button>
                    <el-button type="danger" size="small"
                               @click="handleDelete(scope.row,'下架')" v-if="scope.row.goodState==2">下架
                    </el-button>
                    <el-button type="success" size="small"
                               @click="handleDelete(scope.row,'上架')" v-else>上架
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

        <el-dialog title="查看评价" v-model="dialogVisible"  size="large">
            <el-table
                    :data="pageInfo3.dtos"
                    element-table_loading-text="加载中"
                    stripe
                    v-loading="table_loading2"
                    style="width: 100%">
<!--                 <el-table-column
                        prop="userId"
                        label="买家">
                </el-table-column> -->
                <el-table-column
                        label="用户名"
                        prop="userName">
                </el-table-column>
                <el-table-column
                        label="星级评分"
                        prop="userName">
                        <template scope="scope">
                            <span>{{ scope.row.evaluateStar }}星</span>
                        </template>
                </el-table-column>
                <el-table-column
                        label="评价内容"
                        prop="evaluateContent">
                </el-table-column>
                <el-table-column
                        label="图片"
                        prop="territorial_Limit">
                        <template scope="scope">
                                <img :src="item" alt="" v-for="item in scope.row.evaluateImage" class="img-preview" @click="previewImage(item)" style="margin-right: 10px;width:60px;height: 60px;">
                                <span v-if="scope.row.evaluateImage==''">无</span>
                        </template>
                </el-table-column>
                <el-table-column
                        label="评价时间"
                        prop="evaluateTime">
                </el-table-column>
            </el-table>
            <div class="paginate">
                <el-pagination
                        @current-change="handleCurrentChange2"
                        :current-page="pageInfo3.pageNum"
                        :page-size="pageInfo3.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="pageInfo3.count"
                        >
                </el-pagination>
            </div>
             
        </el-dialog>  

        <div class="weui-gallery" style="display: block;z-index: 9999;" v-show="img.is_preview" >
            <span class="weui-gallery__img" :style="{backgroundImage:img.preview_url,transform:img.transform}" @click="hidePreview"></span>
            <div class="weui-gallery__opr white_pointer">
                <div  class="weui-gallery__del" @click.prevent="rotate()">
                    <img src="../../assets/images/xuanzhuan.png" height="25" width="25">
                    <span class="weui-span_del">旋转</span>
                </div>
            </div>
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
                table_loading2: false,
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos:[]
                },
                formInline: {
                    goodsName:'',
                    goodOneCate:'',
                    goodTwoCate:'',
                    goodState:'',
                    storeId:'',
                    pageNum:1,
                    pageSize:10,
                    sort:'T1.CRE_TIME',
                    desc:'DESC',
                    goodIsDiscount:''
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
                pageInfo3: {
                    pageNum: 1,
                    pageSize: 5,
                    count: 1,
                    dtos: []
                },
                formLabelWidth: '120px',
                loading:false,
                dialogVisible:false,
                activeName: '1',
                sortList:[],
                secondList:[],
                showSort:false,
                storeId:'',
                statList:[{ text: '商家禁用', value: '0' },{ text: '已启用', value: '1' },{ text: '平台禁用', value: '2' }],
                dialogVisible:false,
                id:'',
                 img: {
                    is_preview: false,
                    preview_url: '',
                    image_index: null,
                    preview_images: [],
                    transform:''
                }

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
                this.dataApi.ajax('selectPageStoreGood',this.formInline, res => {
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
            handleCurrentChange2(val) {
                this.fetchData3(val)          
            },
            goodDetail(id){
                this.$router.push('/merchant/goods_detail/' + id)
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
                var state=''
                if (item.goodState==2) {
                    state=6
                }else{
                    state=2
                }

                this.$confirm('确认'+type+'?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.dataApi.ajax('editStoreGood',{
                        storeGoodDto:{
                           goodId:item.goodId,
                           goodState:state,
                           storeId:item.storeId
                         }
                  }, res => {
                            if (res.responseType === 'S') {
                                this.showMsg(type+'成功!')
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
            check(id){
                this.id=id
                this.fetchData3(1)
                this.dialogVisible=true
            },
            fetchData3(page = 1) {
                this.table_loading2 = true;
                this.pageInfo3.pageNum = page
                this.dataApi.ajax('selectPageShopEvaluat',{
                    pageNum:this.pageInfo3.pageNum,
                    pageSize:this.pageInfo3.pageSize,
                    sort:'T1.CRE_TIME',
                    desc:'DESC',
                    goodId:this.id,
                    evaluateType:1
                }, res => {
                    this.table_loading2 = false;
                    if (res.responseType === 'S') {
                       this.pageInfo3=res
                    }
                });


            },
             previewImage(src) {
                this.img.is_preview = true;
                this.img.preview_url = `url(${src})`;
                this.img.preview_images = this.images;
                this.img.transform = '';
            },
            hidePreview() {
                this.img.is_preview = false;
                this.img.preview_url = null;
                this.img.image_index = null;
                this.img.preview_images = [];
                this.img.transform = '';
            },
             rotate(){
              if (this.img.transform=='') {
                  this.img.transform='rotate(90deg)'
              }else if (this.img.transform=='rotate(90deg)') {
                  this.img.transform='rotate(180deg)'
              }else if (this.img.transform=='rotate(180deg)') {
                  this.img.transform='rotate(270deg)'
              }else if (this.img.transform=='rotate(270deg)') {
                  this.img.transform=''
              }
            }

        }
    }
</script>
