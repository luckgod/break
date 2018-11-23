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
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="'拥有的主城('+getNum+')'" name="1"></el-tab-pane>
                    <el-tab-pane :label="'卖出的主城('+sellNum+')'" name="2"></el-tab-pane>
                 </el-tabs>
            </el-col>
        </el-row>

        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                v-show="activeName==1"
                style="width: 100%">
            <el-table-column
                    prop="cityName"
                    label="主城区域">
            </el-table-column>
            <el-table-column
                    prop="adju_Ratio"
                    label="广告标题">
                    <template scope="scope">
                       <el-button type="primary" size="small" @click="checkDetail(scope.row.userCode)">查看</el-button>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="cityPrice"
                    label="目前主城价格">
            </el-table-column>
             <el-table-column
                    prop="updTime"
                    label="城主更换时间">
            </el-table-column>
             <el-table-column label="主城交易记录" width="150">
                <template scope="scope">
                    <el-button 
                            type="primary" 
                            size="small" 
                            @click="check(scope.row)">查看
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

        <!--卖出主城table-->
        <el-table
                :data="pageInfo2.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                v-show="activeName==2"
                style="width: 100%">
            <el-table-column
                    prop="cityName"
                    label="主城区域">
            </el-table-column>
            <el-table-column
                    prop="prePrice"
                    label="购买价格">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="卖出价格">
            </el-table-column>
             <el-table-column
                    prop="finishTime"
                    label="卖出时间">
            </el-table-column
            ><el-table-column
                    prop="sellerProfit"
                    label="转让收益">
            </el-table-column>
             <el-table-column label="主城交易记录" width="150">
                <template scope="scope">
                    <el-button 
                            type="primary" 
                            size="small" 
                            @click="check(scope.row)">查看
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
                    userCode:''
                },
                formInline2: {
                    sellerCode:'',
                    pageNum:1,
                    pageSize:10,
                    sort:'FINISH_TIME',
                    desc:'desc'
                },
                pageInfo2: {
                    pageNum: 1,
                    pageSize: 1,
                    count: 1,
                    dtos:[]
                },
                formLabelWidth: '120px',
                rateDialog: false,
                loading:false,
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
                activeName: '1',
                getNum:0,
                sellNum:0

            }
        },
        created(){

        },
        activated() {
            this.formInline.userCode=this.$route.params.id
            this.formInline2.sellerCode=this.$route.params.id
            this.fetchData(this.pageInfo.pageNum);
            this.fetchData2(this.pageInfo2.pageNum);
        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                if (this.formInline.area!='') {
                    this.formInline.cityNum=this.formInline.area
                }else{
                  this.formInline.cityNum=''
                }
                this.dataApi.ajax('selectPageCityInfoDetail', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                        this.getNum=res.count
                    }
                });

            },
             fetchData2 (page = 1) {
                this.table_loading = true;
                this.pageInfo2.pageNum = page
                this.formInline2.pageNum = this.pageInfo2.pageNum
                this.dataApi.ajax('selectPageCityOrder',this.formInline2, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo2 = res
                        this.sellNum = res.count
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
            edit(id){
                this.$router.push('/user/user_detail/' + id)
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
                this.fetchData(this.pageInfo.pageNo)
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
             uploading(f) {
               this.loading=true
               this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                    if (res.responseType == 'S') {
                        f.images.splice(f.index,1,res.filePath)
                        this.loading=false
                        this.form.imgHeight=res.height
                        this.form.imgWidth=res.width
                    }
                });

            },
            check(item){
               this.$router.push('/manor/manor_deal/'+item.cityCode+'?cityName='+item.cityName)
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
            handleClick(tab, event) {
                if (this.activeName=='1') {
                   this.fetchData(1)
                }
                if (this.activeName=='2') {
                   this.fetchData2(1)
                }

            }

        }
    }
</script>
