<template>
    <div style="margin-top: 50px;">

        <div v-if="show">
            <el-row>
                <el-col :span="24">

                    <el-button
                            type="primary"
                            @click="goBack()">返回
                    </el-button>
                    <span style="font-size: 15px;margin-left: 10px;">新增/编辑商品</span>
                </el-col>
            </el-row>
            <div class="type" style="margin-left: 30px;margin-top: 40px;">
                <div class="juxing acitve">商品基本信息</div>
                <div class="jiantou jiantou_active"></div>
            </div>
            <div class="type">
                <div class="juxing">商品详细信息</div>
                <div class="jiantou"></div>
            </div>
            <el-form :model="form"
                     style="background-color: #FFFFFF;padding-top:10px;height: 100%;margin-top: 10px;padding-left: 10px;"
                     label-width="150px">
                <el-form-item label="商品分类：">
                     <el-select v-model="form.storeGoodDto.goodOneCate" style="width: 200px;"  @change="selectSort2() " 
                           placeholder="一级分类"  :disabled="true">
                    <el-option :label="item.cateName" :value="item.cateId"
                               v-for="item in sortList"></el-option>
                    </el-select>
                    <el-select v-model="form.storeGoodDto.goodTwoCate" style="width: 200px;" placeholder="二级分类" :disabled="true">
                        <el-option :label="item.cateName" :value="item.cateId"
                                   v-for="item in secondList" ></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="商品名称：">
                    <el-input style="width: 405px;" v-model="form.storeGoodDto.goodName" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="起售价（元）：">
                    <el-input style="width: 200px;" v-model="form.storeGoodDto.goodPrice" ></el-input>
                </el-form-item>
                <el-form-item label="优惠价（元）：">
                    <el-input style="width: 200px;" v-model="form.storeGoodDto.goodDiscountPrice" ></el-input>
                </el-form-item>
                 <el-form-item label="启用优惠价：">
                        <el-radio class="radio" label="1" v-model="form.storeGoodDto.goodIsDiscount" style="margin: 0">启用</el-radio>
                        <el-radio class="radio" label="2" v-model="form.storeGoodDto.goodIsDiscount">不启用</el-radio>
                </el-form-item>
                <el-form-item label="让利比例：">
                    <el-select v-model="form.storeGoodDto.goodRatio" style="width: 200px;margin-right: 30px;">
                        <el-option :label="item.text" :value="item.value" v-for="item in proportion"></el-option>
                    </el-select>
                </el-form-item>
                <hr>
                <!-- <el-form-item label="商品规格：">
                    <el-select v-model="sku_spec" style="width: 200px;" @change="select()">
                        <el-option :value="item" :label="item.spuName" v-for="item in sku_spec_array"></el-option>
                    </el-select>
                    <button class="btn btn-primary"@click.prevent="addSize()">前往新增规格</button>
                </el-form-item>
                <div style="clear: both;padding-top: 15px;"></div>
                <div class="form-group" v-for="(item, index) in option_array" style="clear: both;" @change="generate">
                    <label style="font-weight: bold;font-size: 16px;">{{item.spuName}}：</label>
                    <div>
                        <el-checkbox-group style="display: inline-block;" v-model="item.type_tag">
                            <el-checkbox :label="val.spuName"
                                         v-for="val in item.goodSpuWebSecDtos" ></el-checkbox>
                        </el-checkbox-group>
                        <button class="btn btn-default btn-sm" style="margin-left: 15px;"
                                @click.prevent="delOption(index)" >删除
                        </button>
                    </div>
                </div> -->

                <!-- <button class="btn btn-primary" @click.prevent="generate">点击此处生成商品规格表</button> -->
                <div class="box-body no-padding" style="clear: both;padding-top: 15px;">
                    <label style="font-size: 18px;">商品规格</label>
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th>缩略图</th>
                            <th v-for="item in option_array">
                                {{item.spuName}}
                            </th>
                            <th>价格</th>
                            <th>库存</th>
                            <th>让利比例</th>
                        </tr>
                        </thead>
                        <tbody class="spec-table">

                        <tr v-for="(item,index) in form.goodSkuWebDtos">
                            <td style="width: 100px;">
                                    <we-ui-uploads :images="item.skuIcon"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>   
                      
                                   
                                
                            </td>
                            <td v-for="val in item.goodSkuWebSecDtos">
                                {{val.spuName}}
                            </td>
                            <td>
                               <!--  <el-input style="width: 100px;" type="text" v-model="item.price" @blur="item.price=parseFloat(Math.abs(item.price))"></el-input> -->
                                <el-input style="width: 100px;" type="text" v-model="item.skuPrice" @blur="checkNum(item)" :maxlength="8"></el-input>
                            </td>
                            <td>
                                <el-input style="width: 100px;" type="text" v-model="item.skuStock" @blur="checkNum2(item)"></el-input>
                            </td>
                            <td>
                                <el-select v-model="item.skuRatio"   style="width: 100px;">
                                    <el-option :label="item.text" :value="item.value"
                                               v-for="item in proportion"></el-option>{{ item.text }}
                                </el-select>
                            </td>
                            <!-- <td>
                                <el-button
                                size="small"
                                type="danger"
                                @click.native.prevent="deleteRow(index, form.standardInfoIdPojos)">删除</el-button>
                            </td> -->
                            <!--<td><input type="text" v-model="item.sku_stock"></td>-->
                        </tr>

                        </tbody>
                    </table>
                </div>
                <!-- /.table -->
              <!--   <el-form-item label="总库存：">
                    <span>{{ countAll() }}</span>
                </el-form-item> -->
                <el-form-item label="运费设置：">
                        <el-radio class="radio" label="1" v-model="form.storeGoodDto.goodIsFree" style="margin: 0">包邮</el-radio>
                      <!--   <el-radio class="radio" label="2" v-model="form.freightState">不包邮</el-radio> -->
                </el-form-item>
                 <el-form-item label="商品状态：">
                        <el-radio class="radio" label="2" v-model="form.storeGoodDto.goodState" style="margin: 0">立即上架</el-radio>
                        <!-- <el-radio class="radio" label="2" v-model="form.normalState">禁用</el-radio> -->
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="nextStep()" >下一步</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div v-if="!show">
            <el-row>
                <el-col :span="24">

                    <el-button
                            type="primary"
                            @click="show=true">返回
                    </el-button>
                    <span style="font-size: 15px;margin-left: 10px;">新增/编辑商品</span>
                </el-col>
            </el-row>
            <div class="type" style="margin-left: 30px;margin-top: 40px;">
                <div class="juxing ">商品基本信息</div>
                <div class="jiantou "></div>
            </div>
            <div class="type">
                <div class="juxing acitve">商品详细信息</div>
                <div class="jiantou jiantou_active"></div>
            </div>
            <el-form label-width="120px" class="demo-ruleForm" style="width: 90%;" :model="form">
                <el-form-item label="商品缩略图：" label-width="100px">
                    <we-ui-uploads :images="form.storeGoodDto.goodCover"
                                   :maxCount="1"
                                   :maxSize="1024*1024"
                                   @uploading="uploading"></we-ui-uploads>
                    （尺寸:1:1,340*340）
                </el-form-item>
                <el-form-item label="商品轮播图：" label-width="100px">
                    <we-ui-uploads :images="form.storeImgDtos"
                                   :maxCount="5"
                                   :maxSize="1024*1024"
                                   :isSort="true"
                                   @uploading="uploading2"></we-ui-uploads>
                    （尺寸:1:1,750*750,最多5张）
                </el-form-item>
                <el-form-item label="商品详情：" label-width="100px">
                    <we-ui-uploads :images="form.storeImgDtoList"
                                   :maxCount="150"
                                   :maxSize="1024*1024"
                                   :isSort="true"
                                   @uploading="uploading3"></we-ui-uploads>
                    （最多150张）
                </el-form-item>
               <!--  <el-form-item label="商品详情：">
                    <vue-editor :content="form.details" @onEditorChange="onEditorChange"></vue-editor>
                </el-form-item> -->

                <!-- <el-form-item>
                    <el-button type="primary" :loading="loading" @click="submitForm()">提交</el-button>
                </el-form-item> -->
            </el-form>
        </div>

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
        left:4px;
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
     td .weui-cell{
        padding: 0;
    }

     .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, 
     .table>thead>tr>th{
        vertical-align: middle;
     }
</style>

<script>
    export default {
        data() {
            return {
                loading: false,
                form: {        
                    storeImgDtos:[],
                    storeImgDtoList:[],
                    goodSkuWebDtos:[],
                    goodSpuWebDtos:[],
                    storeGoodDto:{
                        storeId:'',
                        goodId:'',
                        goodName:'',
                        goodOneCate:'',
                        goodTwoCate:'',
                        goodPrice:'',
                        goodDiscountPrice:'',
                        goodIsDiscount:'1',
                        goodRatio:0.08,
                        goodIsFree:'1',
                        goodIsStock:'1',
                        goodState:'2',
                        goodCover:[]
                    }
                   
                },
                sortList: [],
                secondList: [],
                carriageList: [],
                proportion: [{text: '0%', value: 0},{text: '4%', value: 0.04},{text: '6%', value: 0.06}, 
                {text: '8%',value: 0.08}, {text: '10%',value: 0.1},
                {text: '12%', value: 0.12}, {text: '14%', value: 0.14}, 
                {text: '16%',value: 0.16}],
                sku_spec_array: [],
                sku_spec:'',
                option_array: [],
                type_tag: '1',
                show: true,
                flag:false,
                flag2:false,
                URL:URL,
                brandList:[],
                storeId:'',
                storeImgDtos:[],
                storeImgDtoList:[],
                imgDetailList:[],
                show_sed:''
            }
        },
        created(){
            this.selectSort()
        },
        activated() {
            this.storeId=JSON.parse(sessionStorage.getItem('permission')).storeId
            this.fetchStandard()
            if(sessionStorage.getItem('keep')==1) {
               sessionStorage.removeItem('keep')
            }else{
                 this.option_array=[]
                 this.storeImgDtos=[]
                 this.storeImgDtoList=[]
                 this.form={        
                    storeImgDtos:[],
                    storeImgDtoList:[],
                    goodSkuWebDtos:[],
                    goodSpuWebDtos:[],
                    storeGoodDto:{
                        storeId:'',
                        goodId:'',
                        goodName:'',
                        goodOneCate:'',
                        goodTwoCate:'',
                        goodPrice:'',
                        goodDiscountPrice:'',
                        goodIsDiscount:'1',
                        goodRatio:0.08,
                        goodIsFree:'1',
                        goodIsStock:'1',
                        goodState:'2',
                        goodCover:[]
                    }
                   
                 }
                 this.show=true
                 this.fetchData()
            }
           
           
        },
        // watch:{
        //     'form.storeImgDtos'(val,oldVal) {
        //         console.log(val,oldVal)
        //         // this.formInline[this.formInline.type] = this.formInline.name
        //     }
        // },
        methods: {
            fetchData(){
                if (this.$route.params.id==0) {
                    this.form={        
                        storeImgDtos:[],
                        storeImgDtoList:[],
                        goodSkuWebDtos:[],
                        goodSpuWebDtos:[],
                        storeGoodDto:{
                            storeId:this.storeId,
                            goodId:'',
                            goodName:'',
                            goodOneCate:'',
                            goodTwoCate:'',
                            goodPrice:'',
                            goodDiscountPrice:'',
                            goodIsDiscount:'1',
                            goodRatio:0.08,
                            goodIsFree:'1',
                            goodIsStock:'1',
                            goodState:'2',
                            goodCover:[]
                        }
                        
                       
                    }
                   
                    return;
                }
                this.dataApi.ajax('singleStoreGood', {goodId: this.$route.params.id}, res => {
                    if (res.responseType === 'S') {
                        this.option_array=[]
                        this.form=res
                        for (var k in this.form.goodSkuWebDtos) {
                            this.form.goodSkuWebDtos[k].skuIcon=[ this.form.goodSkuWebDtos[k].skuIcon]
                        }
                         for (var k in res.goodSpuWebDtos) {
                               var arr=[]
                               for (var j in res.goodSpuWebDtos[k].goodSpuWebSecDtos) {
                                   arr.push(res.goodSpuWebDtos[k].goodSpuWebSecDtos[j].spuName)
                               }
                                this.option_array.push({
                                    spuName:res.goodSpuWebDtos[k].spuName,
                                    spuId:res.goodSpuWebDtos[k].spuId,
                                    goodSpuWebSecDtos:res.goodSpuWebDtos[k].goodSpuWebSecDtos,
                                    type_tag:arr
                               })                       
                         }
                        this.storeImgDtos=generateArr(res.storeImgDtos)
                        this.storeImgDtoList=generateArr(res.storeImgDtoList)
                        this.form.storeGoodDto.goodCover = [this.form.storeGoodDto.goodCover]
                        for (var i = this.form.storeImgDtos.length - 1; i >= 0; i--) {
                            this.form.storeImgDtos[i]=[this.form.storeImgDtos[i].imgUrl]
                        }
                        for (var i = this.form.storeImgDtoList.length - 1; i >= 0; i--) {
                            this.form.storeImgDtoList[i]=[this.form.storeImgDtoList[i].imgUrl]
                        }
                        this.show_sed=true
                        
                    }
                });
            },
            submitForm(){
                
                if (this.form.storeGoodDto.goodCover.length==0) {
                    this.$message({
                            type: 'warning',
                            message: '请上传商品缩略图!'
                     });
                    return false;
                }
                
                if (this.form.storeImgDtos.length==0) {
                    this.$message({
                            type: 'warning',
                            message: '请上传商品轮播图!'
                     });
                    return false;
                }

                if (this.form.storeImgDtoList.length==0) {
                    this.$message({
                            type: 'warning',
                            message: '请上传商品详情!'
                     });
                    return false;
                }

                let data = generateObj(this.form)

                //删除没有选中的规格属性
                data.goodSpuWebDtos=this.option_array
                for (var i = this.option_array.length - 1; i >= 0; i--) {
                    var arr=[]
                    
                   for (var j = this.option_array[i].type_tag.length - 1; j >= 0; j--) {
                        for (var k = this.option_array[i].goodSpuWebSecDtos.length - 1; k >= 0; k--) {                     
                            if (this.option_array[i].goodSpuWebSecDtos[k].spuName==this.option_array[i].type_tag[j])
                            { 
                                arr.push(this.option_array[i].goodSpuWebSecDtos[k])
                            }
                        }
                   }
                  
                   this.option_array[i].goodSpuWebSecDtos=arr
                }

                let storeGoodDto = generateObj(this.form.storeGoodDto)
                storeGoodDto.goodCover=storeGoodDto.goodCover+''
                data.storeGoodDto=storeGoodDto
                for (var i = data.goodSkuWebDtos.length - 1; i >= 0; i--) {
                    data.goodSkuWebDtos[i].skuIcon=data.goodSkuWebDtos[i].skuIcon+''
                }

                //获取storeImgDtos图片列表的长宽
                var storeImgDtos=[]
                for (var i = data.storeImgDtos.length - 1; i >= 0; i--) {  
                    for (var j = this.storeImgDtos.length - 1; j >= 0; j--) { 
                        if (this.storeImgDtos[j].imgUrl==data.storeImgDtos[i]) {
                             storeImgDtos.push(this.storeImgDtos[j])
                             break;
                        }
                    }     
                }
                data.storeImgDtos=storeImgDtos.reverse()

                 //获取storeImgDtoList图片列表的长宽
                var storeImgDtoList=[]
                for (var i = data.storeImgDtoList.length - 1; i >= 0; i--) {
                     
                    for (var j = this.storeImgDtoList.length - 1; j >= 0; j--) {
                        if (this.storeImgDtoList[j].imgUrl==data.storeImgDtoList[i]) {
                             storeImgDtoList.push(this.storeImgDtoList[j])
                              break;
                             
                        }
                    }     
                }
                data.storeImgDtoList=storeImgDtoList.reverse()
                this.loading=true
                if (this.$route.params.id==0) {
                    this.dataApi.ajax('addStoreGood', data, res => {
                    if (res.responseType === 'S') {
                        this.showMsg('新增成功')
                        this.loading=false
                        this.goBack()
                        //this.$router.push('/mall/self_support')
                    }
                  });
                }else{
                    this.dataApi.ajax('editStoreGood', data, res => {
                    if (res.responseType === 'S') {
                        this.$message({
                            type: 'success',
                            message: '编辑成功!'
                        });
                        this.loading=false
                        this.goBack()
                        //this.$router.push('/mall/self_support')
                    }
                  }); 
                }
                
            },
            fetchStandard(){
                this.dataApi.ajax('selectShopSpuList',null, res => {
                    if (res.responseType === 'S') {
                        this.sku_spec_array = res.shopSpuPojos
                    }
                });
            },
            delOption(index) {
                this.option_array.splice(index, 1)
                this.generate()
            },
            generate() {
                var option_array = this.option_array;
                var spec_array = this.form.goodSkuWebDtos = [];
                if (option_array.length <= 0)
                    return false;

                var select = [];
                for (var i in option_array) {
                    if (option_array[i].type_tag.length > 0) {
                        select.push(option_array[i].type_tag);
                    } else {
                        return false;
                    }

                }
                var ret = this.doExchange(select)
                for (var i = 0; i < ret.length; i++) {
                    var proObj = {};
                    var retArr = ret[i].split('|');
                    proObj['goodSkuWebSecDtos'] = [];
                    for (var y = 0; y < retArr.length; y++) {
                        proObj['goodSkuWebSecDtos'].push({spuName:retArr[y]})

                    }
                    
                    proObj['skuIcon'] = [];
                    proObj['skuPrice'] = 0;
                    proObj['skuStock'] = 0;
                    proObj['skuRatio'] = 0.08;

                    spec_array.push(proObj);
                }
            },
            doExchange(doubleArrays) {

                var len = doubleArrays.length;

                if (len >= 2) {
                    var len1 = doubleArrays[0].length;
                    var len2 = doubleArrays[1].length;
                    var newLen = len1 * len2;
                    var temp = new Array(newLen);
                    var index = 0;

                    for (var i = 0; i < len1; i++) {
                        for (var j = 0; j < len2; j++) {
                            temp[index] = doubleArrays[0][i] + '|' + doubleArrays[1][j];
                            index++;
                        }
                    }

                    var newArray = new Array(len - 1);
                    for (var i = 2; i < len; i++) {
                        newArray[i - 1] = doubleArrays[i];
                    }
                    newArray[0] = temp;
                    return this.doExchange(newArray);

                } else {
                    return doubleArrays[0];
                }
            },
            select(){
                if (!this.sku_spec.spuId) {
                    return false;
                }
 
                var arr = this.option_array;
                for (var i in arr) {
                    if (arr[i].spuName === this.sku_spec.spuName) {
                        this.sku_spec=''
                        return false;
                    }
                }
                if (arr.length >= 5) {
                    return false;
                }

                this.dataApi.ajax('selectShopSpuList', {spuId:this.sku_spec.spuId}, res => {
                    //console.log(res.standardTagPojos)
                    if (res.responseType === 'S') {
                        this.option_array.push({
                            spuName:this.sku_spec.spuName,
                            spuId:this.sku_spec.spuId,
                            goodSpuWebSecDtos: res.shopSpuPojos,
                            type_tag: [],
                        })
                        this.generate()
                        this.sku_spec=''
                    }
                });

            },
            selectSort(){
                this.dataApi.ajax('selectGoodCate',{cateState:'1'}, res => {
                    if (res.responseType === 'S') {
                       this.sortList = res.dtos
                    }
                });

            },
            selectSort2(){
                if (this.show_sed) {
                    this.form.storeGoodDto.goodTwoCate= this.form.storeGoodDto.goodTwoCate
                    this.show_sed=false
                }else{
                    this.form.storeGoodDto.goodTwoCate ='' 
                }
                this.dataApi.ajax('selectGoodCate', {cateId:this.form.storeGoodDto.goodOneCate,cateState:'1'}, res => {
                    //console.log(res)
                    if (res.responseType === 'S') {
                        this.secondList = res.dtos
                    }
                });
                

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
                            this.storeImgDtos.push(
                            {
                                imgHeight:res.height,
                                imgUrl:res.filePath,
                                imgWidth:res.width
                            })
                            this.loading=false
                        }
                 }); 
            },
            uploading3(f) {
                 this.loading=true
                 this.dataApi.upload('FileUploadNotify/upload', f.file, res => {
                        //console.log(res)
                        if (res.responseType == 'S') {
                            f.images.splice(f.index,1,res.filePath)
                            this.storeImgDtoList.push(
                            {
                                imgHeight:res.height,
                                imgUrl:res.filePath,
                                imgWidth:res.width
                            })
                            this.loading=false
                        }
                 }); 
            },
            addSize(){
                sessionStorage.setItem('keep','1')
                this.$router.push('/mall/size_list')
            },
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            nextStep(){
                if (!this.form.storeGoodDto.goodTwoCate) {
                    this.$message({
                            type: 'warning',
                            message: '请选择分类!'
                     });
                    return false;
                }
                if (!this.form.storeGoodDto.goodName) {
                    this.$message({
                            type: 'warning',
                            message: '请填写商品名称!'
                     });
                    return false;
                }
                 if (!this.form.storeGoodDto.goodPrice || !isFloat(this.form.storeGoodDto.goodPrice)) {
                    this.$message({
                            type: 'warning',
                            message: '商品起售价不正确!'
                     });
                    return false;
                }
                if (!this.form.storeGoodDto.goodDiscountPrice || !isFloat(this.form.storeGoodDto.goodDiscountPrice)) {
                    this.$message({
                            type: 'warning',
                            message: '商品优惠价不正确!'
                     });
                    return false;
                }
                if (parseFloat(this.form.storeGoodDto.goodDiscountPrice)>parseFloat(this.form.storeGoodDto.goodPrice)){
                    this.$message({
                            type: 'warning',
                            message: '商品现价不能大于原价!'
                     });
                    return false;
                }
              
              if (this.option_array.length==0) {
                    this.$message({
                            type: 'warning',
                            message: '请至少选择一种规格!'
                     });
                    return false;
                }
                if (this.form.goodSkuWebDtos.length==0) {
                    this.$message({
                            type: 'warning',
                            message: '请选择规格属性!'
                     });
                    return false;
                }
              for (var i = this.form.goodSkuWebDtos.length - 1; i >= 0; i--) {
                  if(this.form.goodSkuWebDtos[i].skuIcon.length==0){
                     this.$message({
                            type: 'warning',
                            message: '请上传缩略图!'
                      });
                     return
                  }
              }


              this.show=false
            },
            countAll(){
                var all=0
                for (var i = this.form.standardInfoIdPojos.length - 1; i >= 0; i--) {
                  all=all+parseInt(this.form.standardInfoIdPojos[i].stock)

                }
                return all;
            },
            checkNum(item){
                if (!isFloat(item.skuPrice)) {
                   this.showMsg('价格只能输入正数','warning')
                   item.skuPrice=0
                }else{
                     item.skuPrice=parseFloat(Math.abs(item.skuPrice))
                }
                
            },
            checkNum2(item){
                if (!isNumber(item.skuStock)) {
                   this.showMsg('库存只能输入正整数','warning')
                   item.skuStock=0
                }else{
                     item.skuStock=parseFloat(Math.abs(item.skuStock))
                }
            }
        }
    }
</script>
