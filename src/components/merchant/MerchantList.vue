<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">

                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="120px">
                    <el-button type="primary" @click="$router.push('/merchant/nonactivated/add')">+新增</el-button>
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="按商家名称" value="storeName"></el-option>
                            <el-option label="按用户ID" value="userId"></el-option>
                            <el-option label="按用户名" value="userName"></el-option>
                            <el-option label="按注册手机号" value="contactNum"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="按分类：">
                        <el-select v-model="formInline.businessClass" style="width: 150px;"  @change="selectSort2()"
                               placeholder="一级分类">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.classifyName" :value="item.classifyId"
                                   v-for="item in sortList"></el-option>
                        </el-select>
                        <el-select v-model="formInline.businessSubclass" style="width: 150px;" placeholder="二级分类" v-if="formInline.businessClass">
                               <el-option label="全部" value=""></el-option>
                               <el-option :label="item.classifyName" :value="item.classifyId"
                                       v-for="item in secondList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="按商家状态：">
                        <el-select v-model="formInline.storeStat" style="width: 120px;" >
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已上架" value="1" ></el-option>
                            <el-option label="已下架" value="0" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="激活状态：">
                        <el-select v-model="formInline.actStat" style="width: 120px;" >
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item.text" :value="item.value"
                                   v-for="item in stateList"></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="按商家类型：">
                        <el-select v-model="formInline.storeType" style="width: 120px;" >
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item.text" :value="item.value" v-for="item in merchantType"></el-option>
                        </el-select>
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
                    prop="storeName"
                    label="商家名称">
            </el-table-column>
            <el-table-column
                    prop="userId"
                    label="用户ID">
            </el-table-column>
            <el-table-column
                    label="账号用户名">
                    <template scope="scope">
                        <router-link :to="'/user/user_detail/'+scope.row.userId" target="_blank">
                            <span class="pointer">{{ scope.row.userName}}</span>
                        </router-link>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="contactNum"
                    label="注册手机号">
            </el-table-column>
             <el-table-column
                    prop="contactNum"
                    label="商家类型">
                    <template scope="scope">
                        <span>{{ findState(scope.row.storeType,merchantType) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="DIS_PRICE"
                    label="分类">
                    <template scope="scope">
                        <span>{{ scope.row.classifyName }} - {{ scope.row.subClassifyName }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                     prop="actStat"
                    label="激活状态">
                    <template scope="scope">
                        <span>{{ findState(scope.row.actStat,stateList) }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    label="商家状态 ">
                    <template scope="scope">
                        <span>{{scope.row.storeStat==1? '已上架':'已下架'}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small"  v-if="scope.row.storeStat==1"
                               @click="handleDelete(scope.row,'下架')">下架
                    </el-button>
                    <el-button type="success" size="small" v-else
                               @click="handleDelete(scope.row,'上架')">上架
                    </el-button> 
                     <el-button type="primary" size="small" @click="shop(scope.row)">店内商品</el-button>
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
                    pageNum:1,
                    pageSize: 10,
                    sort:'CRT_TIME',
                    desc:'DESC',
                    actStat:'',
                    storeName:'',
                    userId:'',
                    userName:'',
                    businessClass:'',
                    businessSubclass:'',
                    type:'storeName',
                    name:'',
                    storeStat:'',
                    contactNum:'',
                    storeType:'',
                    areaNum:''

                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos: []
                },
                formLabelWidth: '120px',
                sortList:[],
                secondList:[],
                thirdList:[],
                URL:URL,
                flag2:'',
                corner:'',
                brandList:[],
                stateList:[{ text: '未激活', value: '0' },{ text: '已拒绝', value: '1' },{ text: '审核中', value: '2' },{ text: '激活', value: '3' }]

            }
        },
        created(){

        },
        activated() {
            let urlPram = getRequestParam(location.hash)
            if (urlPram) {
                this.formInline.areaNum=urlPram.areaNum
                this.formInline.crtUser=urlPram.crtUser
            }else{
                this.formInline.areaNum=''
                this.formInline.crtUser=''
            }
            this.fetchData(this.pageInfo.pageNum);
            this.selectSort()
        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageStoreInfo',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });


            },
            fetchList(){
               this.dataApi.ajax('MallGoodClassifyControl/selectOneList',null, res => {
                    if (res.responseType === 0) {
                        this.sortList = res.goodsClassifyPojos
                    }
                });
            },
            changeType() {
                this.formInline.storeName=''
                this.formInline.userId=''
                this.formInline.userName=''
                this.formInline.contactNum=''
            },
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            edit(item){
                if (item.actStat!=3) {
                   this.$router.push('/merchant/nonactivated/' + item.storeId) 
                }else{
                   this.$router.push('/merchant/nactivated/' + item.storeId) 
                }
                
            },
            selectSort(){
                this.dataApi.ajax('selectStoreClassify', {parentId:0}, res => {
                    //console.log(res)
                    if (res.responseType === 'S') {
                       this.sortList = res.dtos
                    }
                });

            },
            selectSort2(){
                this.formInline.businessSubclass = ''
                this.dataApi.ajax('selectStoreClassify', {parentId: this.formInline.businessClass}, res => {
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
                      this.dataApi.ajax('enabledStoreInfo',{storeId:item.storeId}, res => {
                            if (res.responseType === 'S') {
                                this.showMsg(type+'成功')
                                this.fetchData(this.pageInfo.pageNum)
                            }
                        });
                    }).catch(() => {
                              
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
            shop(item){
               if (item.storeType==1) {
                   this.$router.push('/merchant/goods_list/'+item.storeId)
               }else if(item.storeType==2){
                   this.$router.push('/merchant/combo_list/'+item.storeId)
               }else{
                   this.$router.push('/merchant/hotel_list/'+item.storeId)
               }
            }

        }
    }
</script>
