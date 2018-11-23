<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;font-size: 15px;">
            <el-col :span="24">              
                    <el-button          
                        type="primary"
                        @click="edit('add')">+新增
                     </el-button>
                     <!-- <span style="font-size: 17px;padding:0 30px;font-weight: bold">开机广告状态：已开启</span>
                     <span style="font-size: 17px;font-weight: bold;">操作：</span><el-button          
                        type="primary"
                        @click="edit('add')">关闭显示
                     </el-button> -->
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
                    prop="imgCode"
                    label="广告序号">
            </el-table-column>
            <el-table-column
                    width="150"
                    label="广告封面">
                    <template scope="scope">
                        <img class="banner" :src="scope.row.imgUrl">
                    </template>
            </el-table-column>
            <el-table-column
                    prop="stayTime"
                    label="停留时间">
            </el-table-column>
            <el-table-column
                    prop="redirectUrl"
                    label="是否跳转">
                    <template scope="scope">
                        <span>{{ scope.row.isRedirect=='1'? '是':'否' }}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="redirectUrl"
                    label="跳转链接">
            </el-table-column>
             <el-table-column
                    prop="redirectUrl"
                    label="状态">
                    <template scope="scope">
                         <span>{{ scope.row.isShow==1? '显示':'不显示'}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    sortable='custom'
                    prop="upd_Time"
                    label="最后编辑时间">
                    <template scope="scope">
                        <span>{{scope.row.updTime}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button
                            size="small"
                            type="primary"
                            @click="edit(scope.row.imgCode)">编辑
                    </el-button>
                    <el-button
                            size="small"
                            :type="scope.row.isShow==1? 'danger':'success'"
                            @click="using(scope.row)">{{scope.row.isShow==1? '禁用':'启用'}}
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
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                table_loading:false,
                hashrefType:['单商品','多商品','链接','品牌','文章'],
                URL:URL,
                desc:'DESC',
                sort:'CRE_TIME'
            }
        },
        created(){
           
        },
        activated() {
            this.fetchData(this.pageInfo.pageNum);
        },
        methods: {
            fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNo = page
                this.dataApi.ajax('selectPageSysAppStartImg', {pageNum: this.pageInfo.pageNum,sort:this.sort,desc:this.desc,pageSize:this.pageInfo.pageSize}, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            edit(id){
              this.$router.push('/official/banner_detail/'+id)
            },
            using(item){
              var type=''
              var state=''
              let data=generateObj(item)
               if (data.isShow=='1') {
                  type='禁用'
                  state='0'
               }else{
                 type='启用'
                 state='1'
               }
               data.isShow=state
               this.$confirm('确定'+type+'?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                   this.dataApi.ajax('editSysAppStartImg',data, res => {
                    if (res.responseType === 'S') {
                       this.showMsg(type+'成功')
                        this.fetchData(this.pageInfo.pageNum)
                    }
                 });
                }).catch(() => {
                           
                });
         },         
            handleCurrentChange(val) {
                this.fetchData(val)
            },
            handleDetele(id){
            this.$confirm('确定删除?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                }).then(() => {
                   this.dataApi.ajax('deleteNewBanner', {bannerId:id}, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('删除成功')
                        this.fetchData(this.pageInfo.pageNo);
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
                     this.desc='ASC'
                }else{
                    this.desc='DESC'
                }
                this.sort=column.prop
                this.fetchData(this.pageInfo.pageNum)
            },
            editOrder(item){
                     if (Math.floor(item.sort) <= 0) {
                        item.sort = item.OldProbability || 0;
                        return false;
                    }
                    if (item.OldProbability == item.sort) return false;
                    if (!isNumber(item.sort)) {
                       this.showMsg('只能输入数字','warning')
                       item.sort=item.OldProbability
                       return false;
                    }
                    if (item.sort > this.pageInfo.totalRows){
                       this.showMsg('排序值不能大于总数','warning')
                       item.sort=item.OldProbability
                       return false;
                    }
                     this.dataApi.ajax('editNewBanner',item, res => {
                        if (res.responseType === 'S') {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.fetchData(this.pageInfo.pageNo)
                        }
                    });
            },
            setOldProbability(item) {
                item.OldProbability = item.sort
            },
        }
    }
</script>
