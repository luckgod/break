<template>
    <div style="margin-top: 50px;width: 1200px">

        <div>
            <el-row>
                <el-col :span="24">

                    <el-button
                            type="primary"
                            @click="goBack()">返回
                    </el-button>
                    <span style="font-size: 15px;margin-left: 10px;">新增/编辑优惠套餐</span>
                </el-col>
            </el-row>
            <br>
            <br>
            <el-form :model="form"
                     style="display:inline-block;margin-right: 80px"
                     label-width="150px">
                 <el-form-item label="服务商品类型：">
                    <span>优惠套餐</span>
                </el-form-item>
                <el-form-item label="套餐名称：">
                    <el-input style="width: 300px;" v-model="form.voucherName" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="让利比例：">
                    <el-select v-model="form.rate" style="width: 200px;margin-right: 30px;">
                        <el-option :label="item.text" :value="item.value" v-for="item in proportion"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="套餐价格（元）：">
                    <el-input style="width: 200px;" v-model="form.voucherAmt"></el-input>
                </el-form-item>
                <el-form-item label="总库存：">
                    <el-input style="width: 200px;" v-model="form.voucherNum"></el-input>
                </el-form-item>
                <el-form-item label="每人限购（张）：">
                    <el-input style="width: 200px;" v-model="form.voucherReceLimit"></el-input>
                </el-form-item>
                <el-form-item label="套餐文字介绍：">
                     <el-input style="width: 300px;" v-model="form.voucherRemark"  type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="套餐封面：">
                  <div style="display: inline-block;text-align: center">
                       <we-ui-uploads :images="form.voucherCover"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>  
                                  （建议尺寸：340*340px）
                 </div>            
                </el-form-item>
                <el-form-item label="套餐详情页："  style="width:500px;">
                    <we-ui-uploads :images="form.imgList"
                                   :maxCount="9"
                                   :maxSize="1024*1024"
                                   :isSort="true"
                                   @uploading="uploading2"></we-ui-uploads>
                                  （最多上传150张，建议尺寸：340*340px）
                </el-form-item>
                
                
                <!-- <el-form-item label="">
                   <el-button type="primary" :loading="loading" @click="submitForm()">保存</el-button> 
                </el-form-item> -->
                 
            </el-form>
            <el-form label-width="160px" class="demo-ruleForm" style="display:inline-block;;max-width:600px;vertical-align: top" :model="form" >
                <el-form-item label="套餐有效期：">          
                       <el-date-picker
                          v-model="form.voucherStartTime"
                          type="date"
                          placeholder="开始时间">
                        </el-date-picker>
                        到
                        <el-date-picker
                          v-model="form.voucherEndTime"
                          type="date"
                          placeholder="结束时间">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="不可用日期文案说明：">
                     <el-input style="width: 300px;" v-model="form.voucherNotUseRemark"  type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="每日使用时间："  style="margin-top: 25px;">          
                           <el-time-select
                            placeholder="起始时间"
                            v-model="form.voucherUseStartTime"
                            :picker-options="{
                              start: '00:00',
                              step: '00:15',
                              end: '23:45'
                            }">
                          </el-time-select>
                          <el-time-select
                            placeholder="结束时间"
                            v-model="form.voucherUseEndTime"
                            :picker-options="{
                              start: '00:00',
                              step: '00:15',
                              end: '23:45'
                            }">
                          </el-time-select>
                </el-form-item>
                <el-form-item label="使用规则：">
                     <el-input style="width: 300px;" v-model="form.voucherUseRule"  type="textarea" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="温馨提示：">
                     <el-input style="width: 300px;" v-model="form.voucherReminder"  type="textarea" :rows="3"></el-input>
                </el-form-item>
                
                
            </el-form>

        </div>



    </div>

</template>
<style>

</style>

<script>
    export default {
        data() {
            return {
                loading: false,
                form: {
                    voucherName:'',
                    voucherType:'2',
                    voucherNum:0,
                    voucherStartTime:'',
                    voucherEndTime:'',
                    voucherReceLimit:0,
                    voucherAmt:'',
                    rate:'0.08',
                    voucherRemark:'',
                    voucherCover:[],
                    imgList:[],
                    voucherStat:'1',
                    voucherNotUseRemark:'',
                    voucherUseStartTime:'',
                    voucherUseEndTime:'',
                    voucherUseRule:'',
                    voucherReminder:'',
                    isReturn:0

                },
                sortList: [],
                secondList: [],
                startTime1:'',
                startTime2:'',
                endTime1:'',
                endTime2:'',
                userName:'',
                dialogVisible:false,
                id:'',
                show:'',
                 proportion:[{text: '0%', value: '0'},{text: '4%', value: '0.04'}, 
                {text: '6%',value: '0.06'}, {text: '8%',value: '0.08'},
                {text: '10%', value: '0.1'}, {text: '12%', value: '0.12'}, 
                {text: '14%',value: '0.14'},{text: '16%',value: '0.16'}],
                storeId:'',
                imgList:[]
            }
        },
        created(){

            this.fetchData()
            
        },
        activated(){
            
           
            
        },
        methods: {
            fetchData(){
                if (this.$route.params.id==0) {
                    return;
                }
                this.dataApi.ajax('singlePackage', {voucherId: this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                          this.form=res
                          this.form.voucherCover = [this.form.voucherCover]
                          this.imgList=generateArr(res.imgList)
                           for (var i = this.form.imgList.length - 1; i >= 0; i--) {
                              this.form.imgList[i]=[this.form.imgList[i].imgUrl]
                           }

                    }
                });
            },
            submitForm(){

                if (!this.form.voucherName) {
                   this.showMsg('请输入套餐名称','warning')
                   return;
                }
                 if (!isFloat(this.form.voucherAmt)) {
                   this.showMsg('套餐价格不正确','warning')
                   return;
                }
                if (!isNumber(this.form.voucherNum)) {
                   this.showMsg('套餐库存不正确','warning')
                   return;
                }
                if (!isNumber(this.form.voucherReceLimit)) {
                   this.showMsg('每人限购张数不正确','warning')
                   return;
                }
                if (this.form.voucherCover.length==0) {
                    this.showMsg('请上传套餐封面','warning')
                    return;
                }
                if (this.form.imgList.length==0) {
                    this.showMsg('请上传套餐详情页','warning')
                    return;
                }
                 if (!this.form.voucherStartTime|| !this.form.voucherEndTime) {
                   this.showMsg('请选择套餐有效期','warning')
                   return;
                 }
                  if (dateFormat(this.form.voucherStartTime,'y-m-d')>dateFormat(this.form.voucherEndTime,'y-m-d')) {
                   this.showMsg('套餐有效期不正确','warning')
                   return;
                 }
                  if (!this.form.voucherUseStartTime|| !this.form.voucherUseEndTime) {
                   this.showMsg('请选择每日使用时间','warning')
                   return;
                 }

                let data = generateObj(this.form)
                data.voucherStartTime=dateFormat(data.voucherStartTime,'y-m-d')
                data.voucherEndTime=dateFormat(data.voucherEndTime,'y-m-d')
                data.voucherCover=data.voucherCover+''
                var imgList=[]
                for (var i = data.imgList.length - 1; i >= 0; i--) {  
                    for (var j = this.imgList.length - 1; j >= 0; j--) { 
                        //console.log(this.imgList[j],data.imgList[i])
                        if (this.imgList[j].imgUrl==data.imgList[i]) {
                           
                             imgList.push(this.imgList[j])
                             break;
                        }
                    }     
                }
                data.imgList=imgList.reverse()

                this.loading=true
                if (this.$route.params.id==0) {
                    this.dataApi.ajax('addPayStoreVoucher', data, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('新增成功')
                        this.$router.push('/serve/combos_list')
                    }
                    this.loading=false
                  });
                }else{
                    this.dataApi.ajax('editPayStoreVoucher', data, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('编辑成功')
                        this.$router.push('/serve/combos_list')
                    }
                    this.loading=false
                  }); 
                }
                
            },
            uploading(f) {
                 this.loading=true
                 this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                        //console.log(res)
                        if (res.responseType == 'S') {
                            f.images.splice(f.index,1,res.filePath)
                            this.loading=false
                        }
                 }); 
            },
            uploading2(f) {
                 this.loading=true
                 this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                        //console.log(res)
                        if (res.responseType == 'S') {
                            f.images.splice(f.index,1,res.filePath)
                            this.imgList.push(
                            {
                                imgHeight:res.height,
                                imgUrl:res.filePath,
                                imgWidth:res.width
                            })
                            this.loading=false
                        }
                 }); 
            }
        }
    }
</script>
