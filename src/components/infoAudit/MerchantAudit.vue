<template>
    <div class="customer">

        <el-row style="margin-top: 15px;padding: 20px 0;">
            <el-col :span="24">
          
                <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item label="按商家名称:">
                         <el-input v-model="formInline.storeName" style="width: 150px;" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="按状态:">
                         <el-select v-model="formInline.applyStat" style="width: 120px;" >
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item.text" :value="item.value"
                                   v-for="item in stateList"></el-option>
                        </el-select>
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
                    width="80"
                    type="index"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="storeName"
                    label="商家名称">
            </el-table-column>
            <el-table-column
                    prop="contact"
                    label="联系人">
            </el-table-column>
            <el-table-column
                    prop="contactNum"
                    label="联系方式">
            </el-table-column>
            <el-table-column
                    width="140"
                    sortable='custom'
                    prop="apply_Time"
                    label="申请时间">
                <template scope="scope">
                    <span>{{scope.row.applyTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="审核状态">
                <template scope="scope">
                    <span>{{findState(scope.row.applyStat,stateList)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row.applyId)">查看详情</el-button>
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
                    storeName:'',
                    applyStat:'',
                    sort:'CRT_TIME',
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
                stateList:[{ text: '审核中', value: '0' },{ text: '通过', value: '6' },{ text: '拒绝', value: '7' }]

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
                this.pageInfo.pageNum = page
                this.formInline.pageNum = this.pageInfo.pageNum
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageStoreApplyActivationNew', this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
            handleCurrentChange(val) {
               this.fetchData(val)            
            },
            edit(id) {
                 this.$router.push('/infoAudit/audit_detail/' + id)
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
            }

        }
    }
</script>
