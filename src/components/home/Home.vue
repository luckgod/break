<template>
    <div class="admin-home" style="padding-top: 20px;">
                <div class="radius" style="text-align: left;width: 1000px;">
                     <div class="summarize">
                         <div>
                            <h4 style="text-align: left;display:inline-block;margin-right:50px;font-weight: bold;">红包股价参数信息</h4>
                            当前平台红包股价
                          </div>
                          <div style="text-align: left">
                            平台每发送
                            <el-input v-model="upValue" style="width: 60px;" :disabled="showEdit"></el-input>
                            元红包，红包股价增加
                          </div>
                          <div>
                            平台每提现
                            <el-input v-model="downValue" style="width: 60px;" :disabled="showEdit"></el-input>
                            元红包股，红包股价减少
                          </div>
                     </div> 
                     <div class="summarize_input">
                          <div>
                              <el-input v-model="sharePrices" style="width: 180px;margin-right:50px" :disabled="showEdit"></el-input>
                          
                          </div>
                          <div>
                              <el-input v-model="upAdd"  style="width: 180px;margin-right:50px" :disabled="showEdit"></el-input>
                           
                          </div>
                          <div>
                              <el-input v-model="downAdd"  style="width: 180px;margin-right:50px" :disabled="showEdit"></el-input>
                              
                          </div>
                    </div>
                    <div style="display: inline-block;" v-if="powerShow('红包股价参数调整')">
                        <el-button type="primary" v-if="showEdit" @click="showEdit=false" >修改</el-button>
                        <el-button type="primary" @click="submit()" v-else :loading="loading">保存</el-button> 
                    </div>
                   
                </div>
                <div style="width: 1100px;padding-left: 70px">
                     <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="实时股价信息" name="1"></el-tab-pane>
                        <el-tab-pane label="每日日结股价统计" name="2"></el-tab-pane>
                     </el-tabs>
                </div>
                
                <!--实时股价信息table -->
                <el-table 
                      :data="pageInfo.dtos"
                      v-loading="table_loading"
                      element-table_loading-text="加载中"
                      stripe
                      @sort-change='order'
                      style="width: 100%p;margin-top: 20px;"
                      v-show="activeName==1">
                  <el-table-column
                          sortable='custom'
                          prop="CRE_TIME"
                          label="时间">
                          <template scope="scope">
                              <span>{{scope.row.creTime}}</span>
                          </template>
                  </el-table-column>
                  <el-table-column
                          prop="sharePrices"
                          label="红包股价">
                  </el-table-column>
               </el-table>
               <div class="paginate" v-show="activeName==1">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="pageInfo.pageNum"
                            :page-size="pageInfo.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="pageInfo.count">
                    </el-pagination>
                </div>
               <!--实时股价信息table结束 -->

               <!--每日日结股价统计table -->
                <el-table 
                      :data="pageInfo.dtos"
                      v-loading="table_loading"
                      element-table_loading-text="加载中"
                      stripe
                      @sort-change='order'
                      v-show="activeName==2"
                      style="width: 100%p;margin-top: 20px;">
                  <el-table-column
                          sortable='custom'
                          prop="date_Str"
                          label="时间">
                          <template scope="scope">
                              <span>{{scope.row.dateStr}}</span>
                          </template>
                  </el-table-column>
                  <el-table-column
                          prop="sharePrices"
                          label="红包股价">
                  </el-table-column>
                  <el-table-column
                          prop="totalSharesQuantity"
                          label="平台股数总存量">
                  </el-table-column>
                  <el-table-column
                          prop="totalSharesValue"
                          label="平台红包股价值总存量">
                  </el-table-column>
                  <el-table-column
                          prop="sysSharesQuantity"
                          label="系统红包领取总股数">
                  </el-table-column>
                  <el-table-column
                          prop="sysSharesValue"
                          label="系统红包领取股总价值（元）">
                  </el-table-column>
                   <el-table-column
                          prop="perSharesQuantity"
                          label="个人红包领取总股数">
                  </el-table-column>
                   <el-table-column
                          prop="perSharesValue"
                          label="个人红包领取股总价值（元）">
                  </el-table-column>
              </el-table>
              <div class="paginate" v-show="activeName==2">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="pageInfo.pageNum"
                            :page-size="pageInfo.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="pageInfo.count">
                    </el-pagination>
                </div>
               <!--每日日结股价统计table结束 -->
               
                
    </div>
</template>
<style> 
.summarize{
  display:inline-block;
  text-align: right;
  font-size: 16px;
  margin-right: 30px;
}
.summarize div{
  padding:5px 0;
}
.summarize_input{
   display:inline-block;
}
.summarize_input div{
  padding:5px 0;
}
.el-tabs__item{
     font-size:18px !important;
     font-weight: bold;
}
.el-tabs__header{
  border-bottom:none;
}
</style>
<script>
    export default{
        data(){
            return{
                account:'系统管理员',
                activeName: '1',
                table_loading:false,
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                sort:'CRE_TIME',
                desc:'DESC',
                sharePrices:'',
                upValue:'',
                upAdd:'',
                downValue:'',
                downAdd:'',
                showEdit:true,
                loading:false
            }
        },
        created() {
           this.fetchData ();
           this.fetchData2 ();
           this.fetchList(this.pageInfo.pageNum);
        },
        methods: {
            fetchData () {
                 this.dataApi.ajax('singleSharePrices',null, res => {  
                 // console.log(res)
                        if (res.responseType ==='S') {
                            this.sharePrices=res.sharePrices
                        }
                 });


            },
            fetchData2(){
                this.dataApi.ajax('sysParamQuery',{sysCodes:'upEnveCode,downEnveCode'}, res => {  
                 //console.log(1)    
                        if (res.responseType === 'S') {
                            for(var k in res.map){
                               if (k.indexOf('upEnveCode')==0) {
                                  this.upValue=k.split('|')[1]
                                  this.upAdd=res.map[k]
                               }
                               if(k.indexOf('downEnveCode')==0){
                                  this.downValue=k.split('|')[1]
                                  this.downAdd=res.map[k]
                               }
                            }
                          
                        }
                 });
            },
            fetchList(page=1){
              if (this.activeName==1) {
                  this.table_loading = true;
                  this.pageInfo.pageNum=page;
                  this.dataApi.ajax('selectSharePrices',{pageNum:this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize,sort:this.sort,desc:this.desc}, res => {  
                   //console.log(2)    
                        if (res.responseType === 'S') {
                            this.table_loading = false;
                            this.pageInfo=res
                        }
                 });
              }else if (this.activeName==2) {
                 this.table_loading = true;
                 this.pageInfo.pageNum=page;
                  this.dataApi.ajax('selectPageDailyShareInfo',{pageNum:this.pageInfo.pageNum,pageSize:this.pageInfo.pageSize,sort:this.sort,desc:this.desc}, res => { 
                  //console.log(3)     
                        if (res.responseType === 'S') {
                            this.table_loading = false;
                            this.pageInfo=res
                        }
                 });
              }
                
            },
            handleClick(tab, event) {
                if (this.activeName=='1') {
                   this.fetchList(1)
                }
                if (this.activeName=='2') {
                   this.fetchList(1)
                }

            },
            handleCurrentChange(val) {
               this.fetchList(val)            
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
                this.sort=column.prop.toUpperCase()
                this.fetchList(this.pageInfo.pageNum)
            },
            submit(){
                 this.loading=true
                 this.dataApi.ajax('editSharePrices',{sharePrices:this.sharePrices}, res => {    
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功')
                              this.loading=false
                              this.showEdit=true
                        }
                 });
                 var dtos=[
                 {
                    sysCode:'upEnveCode',
                    sysKey:this.upValue,
                    sysValue:this.upAdd
                 },
                 {
                    sysCode:'downEnveCode',
                    sysKey:this.downValue,
                    sysValue:this.downAdd
                 },
                 ]
                    
                 this.dataApi.ajax('batchEditSysParam',{dtos:JSON.stringify(dtos)}, res => {    
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功')
                              this.loading=false
                              this.showEdit=true
                        }
                 });
            }
        }
    }
</script>
