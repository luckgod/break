<template>
    <div class="account">
        <el-row :span="24" style="margin:26px 0;">
            <el-table
                v-loading="table_loading"
                element-table_loading-text="加载中"
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="number"
                    width="200"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button
                            size="small"
                            type="primary"
                            @click="detail(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-row>
    </div>
</template>
<style>

</style>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                tableData: [
                   {number:1,name:'商城banner图'},{number:2,name:'运营位1'},{number:3,name:'运营位2'},{number:4,name:'运营位3'}
                ]
            }
        },
        created(){
            //this.fetchData();
        },
        mounted(){

        },
        methods: {
            detail(item) {
                if (item.number==1) {
                   this.$router.push('/official/mall_banner')
                }else{
                     this.$router.push('/official/operation/'+(item.number-1))
                } 
            },
        }
    }
</script>
