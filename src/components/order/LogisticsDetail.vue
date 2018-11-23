<template>
    <div class="account">
        <el-row :span="24" style="margin:26px 0;">
            <el-button @click="goBack()" type="primary">返回</el-button>
            <h3>共{{ pageInfo.dtos.length }}个包裹</h3>
        </el-row>
        <el-card  v-for="item in pageInfo.dtos" style="margin-bottom: 20px;">
            <div slot="header" class="clearfix">
                {{ item.orderLogicCompany }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.orderLogicNumber }}
                <el-button style="float: right;" type="primary" @click="logistics(item)">查看物流</el-button>
            </div>
            <div v-for="val in item.orderLogisticsDtos" class="imgList">
               <img class="banner" :src="val.goodCover" style="width:55px;">
               <div>{{ val.goodName }}</div>
            </div> 
            
        </el-card>


        <!-- 物流信息 -->
        <el-dialog title="物流信息" v-model="dialogFormVisible" size="small">
             <div class="modal-body">
                 <div class="form-group">
                     <span>快递公司：{{ logistics_info.orderLogicCompany }}</span>
                 </div> 
                 <div class="form-group">
                     <div class="input-group">
                     <span>物流单号：{{ logistics_info.orderLogicNumber }}</span>
                     </div>
                 </div>
                  <div class="box-footer box-comments" style="height: 350px; overflow: auto;">
                      <div class="box-comment" v-for="(item,index) in logisticsList">
                          <span class="img-circle img-sm is_new_express" v-if="index==0">最新</span> 
                          <div class="comment-text" >
                               <div class="username">
                                  <span v-if="index==0" style="color: rgb(201, 48, 44)">
                                     {{ item.time }}
                                  </span>
                                  <span v-else>{{ item.time }}</span>
                                </div>
                                <span v-if="index==0" style="color: rgb(201, 48, 44)">
                                    {{ item.context }}
                                </span>
                                <span v-else>{{ item.context }}</span>
                          </div>
                      </div>
                  </div>
              </div>

        </el-dialog>
    </div>
</template>
<style>
.imgList{
  display: inline-block;
  text-align: center;
  margin-right: 40px;
  width: 200px;
}
.type{
  font-size: 17px;
  margin-top: 30px;
  color: #5E5E5E;
}
.type span{
  width: auto;
  display: inline-block;
  height: 35px;
  margin-right: 30px;
}
.choosed{
  border-bottom: 3px solid #20A0FF;
  font-weight: bold;
}
.el-table-filter__list{
     height: auto;
    max-height: 200px;
    overflow: scroll;
}
.box-comments {
    background: #f7f7f7;
}
.box-comments .comment-text {
    margin-left: 40px;
    color: #555;
}
.box-comments .username {
    color: #444;
    display: block;
    font-weight: 600;
}
.box-comments .box-comment {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}
.is_new_express {
    color: #fff;
    background: #c9302c;
    line-height: 30px;
    font-size: 1rem;
    padding-left: 3px;
    float: left;
    width: 30px!important;
    height: 30px!important;
}
.box-footer {
    border-bottom-left-radius: 3px;
    border-top: 1px solid #f4f4f4;
    padding: 10px;
}
 .el-tabs__item{
     font-size:18px !important;
     font-weight: bold;
  }
</style>
<script>
    export default {
        data() {
            return {
                table_loading: false,
                loading: false,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                formInline: {},
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos:[]
                },
                logisticsList:[],
                logistics_info:{}
            }
        },
        created(){
            this.fetchData();
        },
        methods: {
             fetchData (page = 1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.dataApi.ajax('logisticsQuery',{orderId:this.$route.params.id}, res => {
                    //console.log(res)
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });
            },
            logistics(item){
                this.logisticsList=item.data
                this.logistics_info.orderLogicCompany=item.orderLogicCompany
                this.logistics_info.orderLogicNumber=item.orderLogicNumber
                this.dialogFormVisible=true
            }

        }
    }
</script>
