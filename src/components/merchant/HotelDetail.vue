<template>
    <div style="margin-top: 30px;" class="customer">
        <div>
            <el-row>
                <el-col :span="24">
                    <el-button
                            type="primary"
                            @click="goBack()" style="margin-left: 20px;">返回
                    </el-button>
                    <span style="font-size: 15px;margin-left: 10px;">新增/编辑商品</span>
                </el-col>
            </el-row>
        
            <div>
               <el-form :model="form"
                         style="background-color: #FFFFFF;padding-top:10px;height: 100%;margin-top: 10px;padding-left: 20px;"
                         label-width="150px" label-position='left'>
                    <el-form-item label="服务商品类型：">
                        <span>客房</span>
                    </el-form-item>
                    <el-form-item label="客房名称：">
                        <el-input style="width: 405px;" v-model="form.roomName" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="让利比例：">
                        <el-select v-model="form.roomDefRatio" style="width: 200px;margin-right: 30px;">
                            <el-option :label="item.text" :value="item.value" v-for="item in proportion"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="周日-周四商品价格：" >
                        <span>{{ price1 }}</span>
                    </el-form-item>
                    <el-form-item label="周五-周六商品价格：" style="display:inline-block;">
                        <span>{{ price2 }}</span>
                    </el-form-item>
                   <!--  <el-button
                            type="primary"
                            @click="calendar()" >价格日历
                    </el-button> -->
                    <div id="calendar_box" >
                        <div class="calendar-box demo-box" @click="selectDay($event)"  style="margin-bottom: 30px;" id="calendar-box" v-show="show"></div>
                    </div>
                    <el-form-item label="房型介绍：">
                        <el-input style="width: 405px;" v-model="form.roomDuce"  type="textarea"></el-input>
                    </el-form-item>

                    <el-form-item label="退款规则：">
                        入住日当天
                        <el-select v-model="form.roomConseTime" style="width: 90px;">
                            <el-option :label="item" :value="item" v-for="item in timeList"></el-option>
                        </el-select>
                        点前免费取消，逾期不可取消或退款
                    </el-form-item>
                    <el-form-item label="使用规则：">
                        <el-input style="width: 405px;" v-model="form.roomUseRule"  type="textarea"></el-input>
                    </el-form-item>              
                </el-form>
                <div>
                <el-form label-width="150px" class="demo-ruleForm"  :model="form" label-position='left' style="padding-left: 20px;">
                        <el-form-item label="客房封面图：">
                            <we-ui-uploads :images="form.roomImg"
                                           :maxCount="1"
                                           :maxSize="1024*1024"
                                           @uploading="uploading"></we-ui-uploads>
                            （尺寸:1:1,340*340）
                        </el-form-item>
                        <el-form-item label="客房轮播图：">
                            <we-ui-uploads :images="form.storeImgList"
                                           :maxCount="5"
                                           :maxSize="1024*1024"
                                           :isSort="true"
                                           @uploading="uploading2"></we-ui-uploads>
                            （尺寸:1:1,750*750,最多5张）
                        </el-form-item>
                     <!--    <el-form-item>
                            <el-button type="primary" :loading="loading" @click="submitForm()" >提交</el-button>
                        </el-form-item> -->
                    </el-form> 
                </div>
            </div>
            
        </div>

        <!--修改价格-->
         <el-dialog title="价格" v-model="dialogVisible" size="tiny">
            <el-form  :v-model="info" style="width: 85%;">
                <el-form-item label="日期：" label-width="100px">
                    <span>{{ info.date }}</span>
                </el-form-item>
                <el-form-item label="价格：" label-width="100px">
                    <el-input v-model="info.data"></el-input>
                </el-form-item>
            </el-form>
          <!--   <div slot="footer" class="dialog-footer">
                <el-button type="primary"
                           @click="confirm()">确 定</el-button>
            </div> -->
        </el-dialog>

    </div>

</template>
<style>
    .juxing {
        color: white;
        background-color: #BFD1DE;
        display: inline-block;
        position: relative;
        top: -12px;
        height: 32px;
        line-height: 30px;
        width: 70%;
        text-align: center;
    }

    .jiantou {
        width: 0;
        height: 0;
        border-top: 16px solid transparent;
        border-left: 40px solid #BFD1DE;
        border-bottom: 16px solid transparent;
        display: inline-block;
    }

    .type {
        display: inline-block;
        width: 30%;
    }

    .acitve {
        background-color: #7C93A7;

    }

    .jiantou_active {
        border-left: 40px solid #7C93A7;
    }
    .ht-rili-leftarr{
        background: url(../../assets/images/left-arr.png) left center no-repeat;
        background-size: contain;
    }
    .ht-rili-rightarr{
        background: url(../../assets/images/right-arr.png) left center no-repeat;
        background-size: contain;
    }
</style>

<script>
    export default {
        data() {
            return {
                loading: false,
                form: {
                   roomId:0,
                   userId:'',
                   roomCode:'1',
                   roomName:'',
                   sttPrice:'',
                   ftsPrice:'',
                   roomConseTime:'',
                   roomDuce:'',
                   roomImg:[],
                   roomUseRule:'', 
                   roomConseTime:'', 
                   roomPriceList:[],
                   storeImgList:[],
                   roomDefRatio:0.08

                },
                sortList: [],
                secondList: [],
                supplierList: [],
                carriageList: [],
                proportion: [{text: '0%', value: 0},{text: '4%', value: 0.04},{text: '6%', value: 0.06}, 
                {text: '8%',value: 0.08}, {text: '10%',value: 0.1},
                {text: '12%', value: 0.12}, {text: '14%', value: 0.14}, 
                {text: '16%',value: 0.16}],
                timeList:[],
                sku_spec_array: [],
                sku_spec:{},
                option_array: [],
                type_tag: '1',
                show: false,
                flag:false,
                URL:URL,
                calendarList:[],
                price1:'',
                price2:'',
                dialogVisible:false,
                info:{
                 data:'',
                 date:''
                },
                changedDay:[],
                storeImgList:[]
            }
        },
        created(){
            for (var i = 23; i >= 0; i--) {
                this.timeList[i]=i
            }
            this.fetchData()
           //this.fetchCalendar('100','100')

        },
        methods: {
            fetchData(){
                if (this.$route.params.id==0) {
                    this.form.userId=JSON.parse(sessionStorage.getItem('permission')).adminCode
                    return;
                }
                this.dataApi.ajax('singleStoreHotelRoom', {roomId: this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                         this.form = res
                         this.form.roomImg = [res.roomImg]
                         this.price1=this.form.sttPrice
                         this.price2=this.form.ftsPrice
                         this.storeImgList=generateArr(res.storeImgList)
                         for (var i = this.form.storeImgList.length - 1; i >= 0; i--) {
                            this.form.storeImgList[i]=[this.form.storeImgList[i].imgUrl]
                         }
                         for (var i = 0;i<res.roomPriceList.length; i++) {
                            this.calendarList.push({
                                 date:res.roomPriceList[i].roomDate,
                                 data:res.roomPriceList[i].roomPrice
                            })
                            
                           } 
                            $("#calendar-box").remove();
                            $('#calendar_box').append('<div class="calendar-box demo-box" @click="selectDay($event)"  style="margin-bottom: 30px;" id="calendar-box"></div>')
                            $("#calendar-box").click(()=>{
                                this.selectDay()
                            })
                          this.createCalender()   
                          this.show=true
                    }
                });
            },
            submitForm(){
                if (!this.form.roomName) {
                    this.showMsg('请输入客房名称','warning')
                   return;
                }
                if (!this.price1) {
                    this.showMsg('请输入周日-周四商品价格','warning')
                   return;
                }
                if (!this.price2) {
                    this.showMsg('请输入周五-周六商品价格','warning')
                   return;
                }
                if (!this.form.roomDuce) {
                    this.showMsg('请输入房型介绍','warning')
                   return;
                }
                if (!this.form.roomConseTime) {
                    this.showMsg('请选择最晚取消时间','warning')
                   return;
                }
                if (!this.form.roomUseRule) {
                    this.showMsg('请输入使用规则','warning')
                   return;
                }
               if (this.form.roomImg.length==0) {
                   this.$message({
                        type: 'warning',
                        message: '请上传封面!'
                      });
                   return;
               }
               if (this.form.storeImgList.length==0) {
                   this.$message({
                        type: 'warning',
                        message: '请上传轮播图!'
                      });
                   return;
               }

               this.fetchCalendar()
               
                var priceList=[]
                for (var i = 0;i<this.calendarList.length; i++) {
                    priceList.push({
                        roomDate:this.calendarList[i].date,
                        roomPrice:this.calendarList[i].data
                    })
                }
                let data = generateObj(this.form)
                var roomImg = new String(data.roomImg)
                data.roomImg=roomImg+''
                
                var storeImgList=[]
                for (var i = 0;i<data.storeImgList.length;i++) {  
                    for (var j=0;j< this.storeImgList.length;j++) { 

                        if (this.storeImgList[j].imgUrl==data.storeImgList[i]) {
                             storeImgList.push(this.storeImgList[j])
                             break;
                        }
                    }     
                }
                data.storeImgList=storeImgList

                data.sttPrice=this.price1
                data.ftsPrice=this.price2
                data.roomPriceList=priceList
                
               
               
               this.loading=true
                if (data.roomId==0) {
                    this.dataApi.ajax('addStoreHotelRoom', data, res => {
                    if (res.responseType === 'S') {
                        this.$message({
                            type: 'success',
                            message: '新增成功!'
                        });
                        this.loading=false
                        this.$router.push('/serve/hotel_list')
                    }
                  });
                }else{
                    this.dataApi.ajax('editStoreHotelRoom',data, res => {
                    if (res.responseType === 'S') {
                        this.$message({
                            type: 'success',
                            message: '编辑成功!'
                        });
                        this.loading=false
                       this.$router.push('/serve/hotel_list')
                    }
                  }); 
                }
                
            },
            delOption(index) {
                this.option_array.splice(index, 1)
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
                            this.storeImgList.push(
                            {
                                imgHeight:res.height,
                                imgUrl:res.filePath,
                                imgWidth:res.width
                            })
                            this.loading=false
                        }
                 });
                
            },
            selectDay(){

                var data = $('.calendar-box').calendarGetActive();
                if (!data.date) {
                    return;
                }
                var arr=data.date.split('-')
                if (arr[1]<10) {
                    arr[1]='0'+arr[1]
                }
                if (arr[2]<10) {
                    arr[2]='0'+arr[2]
                }
                var str=arr.join('-')

                this.info={
                    date:str,
                    data:data.money
                }
                this.dialogVisible=true

            },
            calendar(){
                if (!this.price1 || !isFloat(this.price1)) {
                     this.$message({
                            type: 'warning',
                            message: '周日-周四价格不正确!'
                        });
                     this.price1=0
                     return;
                }
                if (!this.price2 || !isFloat(this.price2)) {
                     this.$message({
                            type: 'warning',
                            message: '周五-周六价格不正确!'
                        });
                     this.price2=0
                     return;
                }
                if (this.show) {
                    this.show=false
                }else{
                    this.show=true
                }
                this.fetchCalendar()
                if ($("#calendar-box").length > 0) {
                    $("#calendar-box").remove();
                } else {
                    $('#calendar_box').append('<div class="calendar-box demo-box" @click="selectDay($event)"  style="margin-bottom: 30px;" id="calendar-box"></div>')
                    $("#calendar-box").click(()=>{
                        this.selectDay()
                    })
                }
                this.createCalender()             
            },
            fetchCalendar(){
                var today=new Date(new Date().setDate(1)-24*60*60*1000)
                var obj={
                   date:today,
                   data:this.price1
                }
                for (var i = 0; i < 365; i++) {
                    var price = ''
                    if (obj.date.getDay()==4 || obj.date.getDay()==5) {
                        price=this.price2
                    }else{
                        price=this.price1
                    }
                   this.calendarList[i]={
                     date:obj.date.setDate(obj.date.getDate()+1),
                     data:price
                   }
                }
                for (var i = this.calendarList.length - 1; i >= 0; i--) {
                    if (this.changedDay.length>0) {
                        for (var j = this.changedDay.length - 1; j >= 0; j--) {
                            if(dateFormat(this.calendarList[i].date,'y-m-d')==this.changedDay[j].date) {
                                  this.calendarList[i].data=this.changedDay[j].data
                            }
                        }
                    }
                    

                }
                for (var i = this.calendarList.length - 1; i >= 0; i--) {
                  this.calendarList[i].date=dateFormat(this.calendarList[i].date,'y-m-d')
                } 
            },
            createCalender(){
                $('.calendar-box').calendar({
                    ele : '.demo-box', //依附
                    title : '价格日历',
                 // beginDate : '2017-07-07',
                 // endDate : '2017-12-04',
                    data :this.calendarList
                });
            },
            hidden(){
                this.changedDay=[]
                $("#calendar-box").remove();
                this.show=false
            },
            confirm(){
                if (!this.info.data|| !isFloat(this.info.data)) {
                     this.$message({
                            type: 'warning',
                            message: '价格不正确!'
                        });
                     return;
                }
                 if (this.changedDay.length>0) {

                    let num;
                    for (var i = this.changedDay.length - 1; i >= 0; i--) {
                         if (this.changedDay[i].roomDate==this.info.date) {
                             num = i;
                        }
                    }
                    if (num >= 0) {
                        this.changedDay[num].roomDiscountPrice=this.info.data
                    } else {
                        this.changedDay.push(this.info)
                    }
                 }else{
                    this.changedDay.push(this.info)
                 }

                 this.dialogVisible=false
                 this.show=false
                 $("#calendar-box").remove();
                 this.calendar()

                
            }
        }
    }
</script>
