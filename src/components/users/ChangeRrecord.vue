<template>
    <div class="account" style="max-width: 1366px;">
        <el-row :span="24" style="margin:26px 0 40px 0;">
             <el-button  @click="goBack()" type="primary" >返回</el-button>
             <span></span>
        </el-row>
        <div style="text-align: center;width: 80%;margin: auto">
            <el-table
                    :data="basicInfo"
                    border
                    stripe
                    @sort-change='order'
                    style="margin-top:20px;">
                <el-table-column
                        prop="totalCustomOffsetAmount" 
                        label="累计消耗奖励券">
                </el-table-column>
                <el-table-column
                        prop="totalGetOffsetAmount" 
                        label="累计获得抵价券">
                </el-table-column>
            </el-table>  
        </div>
         

        <el-table
                :data="pageInfo.dtos"
                v-loading="table_loading"
                element-table_loading-text="加载中"
                stripe
                @sort-change='order'
                style="width: 100%;margin-top: 50px;">
            <el-table-column
                    width="150"
                    prop="CRE_TIME"
                    sortable='custom'
                    label="转化时间">
                    <template scope="scope">
                        <span>{{scope.row.creTime}}</span>
                    </template>
            </el-table-column>
             <el-table-column
                   prop="exchangeOriginalValue"
                   label="奖励券变动前值" >
            </el-table-column>
            <el-table-column
                   prop="exchangeValue"
                   label="奖励券减少值" >
            </el-table-column>
            <el-table-column
                   prop="exchangeAfterchangeValue"
                   label="奖励券变动后值" >
            </el-table-column>
            <el-table-column
                   prop="targetOriginalValue"
                   label="抵价券变动前值" >
            </el-table-column>
            <el-table-column
                   prop="targetChangeValue"
                   label="抵价券增加值" >
            </el-table-column>
            <el-table-column
                   prop="targetAfterchangeValue"
                   label="抵价券变动后值" >
            </el-table-column>
             <el-table-column 
                  prop="remark"
                  sortable="exchang_Rate"
                  label="当时掉率" >
                  <template scope="scope">
                        <span>百万分之{{scope.row.exchangeRate*10000}}</span>
                   </template>
            </el-table-column>
             <el-table-column
                    prop="serialNo"
                    label="交易流水号">
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
        
        <!--修改财富信息-->
        <el-dialog title="修改财富信息" v-model="dialogVisible">
            <el-form  :v-model="treasureForm" style="width: 85%;">
                <el-form-item :label="treasureForm.type+':'"
                              label-width="150px">
                    <span>{{treasureForm.value}}</span>
                </el-form-item>
                <el-form-item label="数值:"
                              label-width="150px" >
                     <el-select v-model="type" style="width: 100px;">
                            <el-option label="增加" value="+"></el-option>
                            <el-option label="减少" value="-"></el-option>
                     </el-select>
                    <el-input  v-model="treasureForm.amt" style="width: 150px;" @blur="checkNum(treasureForm.change)"></el-input>
                </el-form-item>
                <el-form-item label="修改后值:" v-if="treasureForm.amt" 
                              label-width="150px">
                    <span v-if="type=='+'">{{Math.round((parseFloat(treasureForm.value)+parseFloat(treasureForm.amt))*100)/100}}</span>
                    <span v-else>{{Math.round((parseFloat(treasureForm.value)-parseFloat(treasureForm.amt))*100)/100}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           :loading="loading"
                           @click="submitForm" :disabled="!treasureForm.amt">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>

.list_type{
  font-size: 17px;
  margin-top: 30px;
  color: #5E5E5E;
}
.list_type span{
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
</style>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                loading:false,
                formLabelWidth: '100px',
                formInline:{
                    pageNum: 1,
                    pageSize: 10,
                    ppeType:'',
                    changeDirection:'',
                    userId:'',
                    changeType:'',
                    sort:'CRE_TIME',
                    desc:'DESC'
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    count: 1,
                    dtos: []
                },
                treasureForm:{
                    type:'',
                    value:'',
                    remark:'',
                    amt:0,
                    ppeType:''
                },
                type:'+',
                integralAdd:[{ text:'积分分发',value: '0' },{ text:'消费奖励',value: '1' }, { text:'推荐消费奖励',value: '2' } , {text:'推荐销售奖励',value: '3' } ,{ text:'支付佣金奖励',value: '4' },{ text:'升级创客奖励',value: '5' },{ text:'推荐创客奖励',value: '6' },{ text:'升级代理奖励',value: '7' },{ text:'推荐代理奖励',value: '8' },{ text:'推荐股东奖励',value: '9' },{ text:'系统操作',value: '10' },{ text:'其他奖励',value: '11' },{ text:'系统解冻积分增加',value: '70' },{ text:'积分商城兑换积分增加',value: '71' },{ text:'积分分发积分增加',value: '113' }],
                lightAdd:[{ text:'积分转换光元',value: '14' }, { text:'光元转账',value: '15' } , {text:'光元理财转出',value: '16' } ,{ text:'退货退款',value: '17' },{ text:'系统操作',value: '18' },{ text:'系统冻结系统解冻光元增加',value: '60' },{ text:'提现驳回光元增加',value: '61' },{ text:'当面付收款光元增加',value: '107' }, { text:'光元兑付驳回',value: '109' }],
                lightReduce:[{ text:'光元提现',value: '19' }, { text:'光元转账',value: '20' } , {text:'会员升级',value: '21' } ,{ text:'转入光元理财',value: '22' },{ text:'购买佣金积分',value: '23' },{ text:'商城购物',value: '24' },{ text:'当面付',value: '25' },{ text:'去付款',value: '26' },{ text:'系统操作',value: '27' },{ text:'联盟企业商城光元减少',value: '52' },{ text:'手动充值光元减少',value: '55' },{ text:'提现手续费光元减少',value: '66' },{ text:'系统分润光元减少',value: '67' },{ text:'商城购物光元兑换减少',value: '68' },{ text:'光元兑付减少',value: '108' }],
                cashAdd:[{ text:'充值',value: '28' }, { text:'销售款',value: '29' } , {text:'当面付',value: '30' } ,{ text:'去付款',value: '31' },{ text:'系统操作',value: '32' },{ text:'线下充值',value: '33' },{ text:'商城购物光元兑换现金增加',value: '34' },{ text:'商城购物现金增加',value: '35' },{ text:'物流商品货款到账现金增加',value: '36' },{ text:'服务商品货款到账现金增加',value: '37' },{ text:'提现',value: '38' },{ text:'退款退货',value: '54' },{ text:'手动充值',value: '55' },{ text:'系统解冻现金余额增加',value: '90' },{ text:'提现驳回现金余额增加',value: '98' },{ text:'现金兑付增加',value: '110' },{ text:'现金转账增加',value: '111' }],
                cashReduce:[{ text:'提现',value: '38' }, { text:'支付佣金',value: '39' } , {text:'会员升级',value: '40' } ,{ text:'购买佣金积分',value: '41' },{ text:'商城购物',value: '42' },{ text:'当面付',value: '43' },{ text:'去付款',value: '44' },{ text:'系统操作',value: '45' },{ text:'联盟企业商城',value: '53' },{ text:'提现手续费现金余额减少',value: '96' },{ text:'系统分润现金余额减少',value: '97' },{ text:'光元提现系统余额减少',value: '100' },{ text:'现金兑换系统余额减少',value: '101' },{ text:'支付宝升级创客',value: '105' },{ text:'微信升级创客',value: '106' },{ text:'现金转账减少',value: '112' },{ text:'积分分发现金减少',value: '114' }],
                ppeType:[{text:'奖励券',value: '2'},{text:'抵价券',value: '3'}],
                allList:[],
                basicInfo:[],
                dialogVisible:false
            }
        },
        created(){
            this.fetchData(this.pageInfo.pageNum);
            this.fetchInfo();
        },
        methods: {
            fetchData (page=1) {   
                this.formInline.userId=this.$route.params.id
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum=page
                this.dataApi.ajax('selectExchange',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                    }
                });

            },
             fetchInfo () {
                let rid =this.$route.params.id
                this.dataApi.ajax('getTotalCustomOffset', {userId: rid}, res => {
                    if (res.responseType === 'S') {
                         this.basicInfo=[]
                         this.basicInfo.push({
                            totalCustomOffsetAmount:res.totalCustomOffsetAmount,
                            totalGetOffsetAmount:res.totalGetOffsetAmount
                         })
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val);
            },
            fanhui(){
                history.back(-1)
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
            clean(){
                this.formInline.changeDirection=''
                this.formInline.changeType=''
            },
            clean2(){
                this.formInline.changeType=''
            },
            findData(type){
                    for (var i = this.allList.length - 1; i >= 0; i--) {
                        if (type==this.allList[i].value) {

                            return this.allList[i].text
                        }
                    }
            },
            findPpe(type){
                    for (var i = this.ppeType.length - 1; i >= 0; i--) {
                        if (type==this.ppeType[i].value) {
                            return this.ppeType[i].text
                        }
                    }
            },
            changeValue(value,type,key){
                this.treasureForm={
                    userId:this.$route.params.id,
                    type:type,
                    value:value,
                    amt:'',
                    ppeType:key
                }
                this.dialogVisible=true
            },
            submitForm() {    
                if (!isFloat(this.treasureForm.amt)) {
                  this.showMsg('只能输入数字','warning')
                  return
                }
                var changeDirection=''
                 if (this.type=='-') {
                    if (this.treasureForm.amt>this.treasureForm.value) {
                        this.showMsg('调账不能调为负数','warning')
                        return
                    }
                    changeDirection=2
                  }else{
                     changeDirection=1
                  }
                 var data={
                       amt:this.treasureForm.amt,
                       userId:this.$route.params.id,
                       ppeType:this.treasureForm.ppeType,
                       changeDirection:changeDirection
                 }
                   this.loading=true
                    this.dataApi.ajax('addAdjustment',data, res => {
                        if (res.responseType === 'S') {
                             this.showMsg('修改成功')
                             this.fetchInfo()
                             this.fetchData(1)
                        }

                    });
                  this.loading=false
                 this.dialogVisible=false    
                
            },
             checkNum(item){
                if(!item)  return
                if (!isFloat(item)) {
                   this.showMsg('只能输入正数','warning')
                   this.treasureForm.amt=0
                }else{
                   if (item.toString().indexOf('.') > 0 && item.toString().split('.')[1].length > 2) {
                    this.showMsg("只能精确到小数点后两位!","warning")
                    this.treasureForm.amt=0
                    return;
                  }
                     this.treasureForm.amt=parseFloat(Math.abs(item))
                }
                
            },

        }
    }
</script>
