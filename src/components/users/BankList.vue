<template>
    <div class="customer">
       <el-button  @click="goBack()" type="primary" style="margin-top: 20px;margin-bottom: 20px;">返回</el-button>
        <el-table
                :data="tableData"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="bankName"
                    label="开户银行名称">
            </el-table-column>
            <el-table-column
                    prop="cardNo"
                    label="银行卡号">
            </el-table-column>          
        </el-table>
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
                pageInfo: {
                    pageNo: 1,
                    pageSize: 1,
                    totalRows: 1,
                    rows: []
                },
                tableData:[],
                formLabelWidth: '120px',
                null:[],
                show:false


            }
        },
        created(){
            this.fetchData();
        },
        methods: {

            fetchData (page = 1) {
                this.table_loading = true;
                this.dataApi.ajax('selectCardList',{userId:this.$route.params.id}, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.tableData = res.dtos
                    }
                });

            }

        }
    }
</script>
