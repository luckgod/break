<template>
    <div class="account" >
        <el-row :span="24" style="margin:26px 0 0;">
              <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
                    <el-form-item>
                        <el-select v-model="formInline.type" style="width: 120px;" @change="changeType">
                            <el-option label="用户名" value="userName"></el-option>
                            <el-option label="手机号" value="phone"></el-option>
                        </el-select>
                        <el-input v-model="formInline.name" style="width: 150px;" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item  label="反馈问题点">
                        <el-select v-model="formInline.contact" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.dicValue" :value="item.dicCode" v-for="item in qusList"></el-option>
                         </el-select>
                     </el-form-item >
                    <el-form-item  label="状态" label-width="50px">
                        <el-select v-model="formInline.state" style="width: 120px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未记录" value="1"></el-option>
                                <el-option label="已记录" value="2"></el-option>
                         </el-select>
                     </el-form-item >
                    <el-button type="primary" @click="fetchData()">查询</el-button>
                
                </el-form>
        </el-row>
        <el-card  v-for="item in pageInfo.dtos" style="margin-bottom: 20px;position: relative;">
            <div style="display: inline-block;vertical-align: top;width:7%">
              <img  class="avatar" :src="item.userTopImage" style="width:50px;height: 50px;">
            </div>
            <div style="display: inline-block;">
              <router-link :to="'/user/user_detail/'+item.userId" target="_blank" ><span class="pointer">{{ item.userName }}</span></router-link>
              <div>反馈问题点：{{ item.selectContent }}</div>
              <div>内容补充：{{ item.fillContent }}</div>
              <div>联系方式：{{ item.phone }}</div>
              <div>截图展示：<img :src="val" alt="" v-for="val in item.image" class="img-preview" @click="previewImage(val)" style="margin-right: 10px;">
                         <span v-if="item.image==''">无</span></div>
              
            </div>
            <div style="display: inline-block;margin-right: 20px;float: right">
                <span>{{ item.creTime }}</span>
            </div>
            <div style="position: absolute;bottom: 15px;right: 50px">
                 状态：<el-button type="primary" size="small" v-if="item.state==1" @click="edit(item.feedBackId)">未记录</el-button>
                       <span v-else>已记录</span>
            </div>
        </el-card>
        <div class="paginate">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.pageNum"
                    :page-size="pageInfo.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pageInfo.count">
            </el-pagination>
        </div>


        <div class="weui-gallery" style="display: block;z-index: 9999;" v-show="img.is_preview" >
            <span class="weui-gallery__img" :style="{backgroundImage:img.preview_url,transform:img.transform}" @click="hidePreview"></span>
            <div class="weui-gallery__opr white_pointer">
                <div  class="weui-gallery__del" @click.prevent="rotate()">
                    <img src="../../assets/images/xuanzhuan.png" height="25" width="25">
                    <span class="weui-span_del">旋转</span>
                </div>
            </div>
        </div>


    </div>
</template>
<script>
    export default {
        data() {
            return {
                table_loading:false,
                loading:false,
                formLabelWidth: '100px',
                formInline: {
                    type: 'userName',
                    pageNum:'',
                    pageSize: 5,
                    sort:'CRE_TIME',
                    desc:'DESC',
                    name:'',
                    contact:'',
                    userName:'',
                    phone:'',
                    state:''
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 5,
                    count: 1,
                    dtos: []
                },
                dialogFormVisible:false,
                qusList:[],
                 img: {
                    is_preview: false,
                    preview_url: '',
                    image_index: null,
                    preview_images: [],
                    transform:''
                },
                remark:''
            }
        },
        created(){
            
        },
        activated() {
           this.fetchData(this.pageInfo.pageNum);
           this.fetchList()
            
        },
        mounted(){

        },
        methods: {
            fetchData (page=1) {
                this.table_loading = true;
                this.pageInfo.pageNum = page
                this.formInline.pageNum = page
                this.formInline[this.formInline.type]=this.formInline.name
                this.dataApi.ajax('selectPageUserFeedBack',this.formInline, res => {
                    this.table_loading = false;
                    if (res.responseType === 'S') {
                        this.pageInfo = res
                          
                    }
                });

            },
             fetchList() {
                this.dataApi.ajax('selectSysDictionary',{parentCode:'f5b81110028e4c1bb3ce160138242084'}, res => {
                    if (res.responseType === 'S') {
                         this.qusList=res.dtos
                    }
                });

            },
            handleCurrentChange(val) {
                this.fetchData(val);
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
                this.fetchData(this.pageInfo.pageNum)              
            },
            changeType() {
                this.formInline.userName='';
                this.formInline.phone='';
            },
            previewImage(src) {
                this.img.is_preview = true;
                this.img.preview_url = `url(${src})`;
                this.img.preview_images = this.images;
                this.img.transform = '';
            },
            hidePreview() {
                this.img.is_preview = false;
                this.img.preview_url = null;
                this.img.image_index = null;
                this.img.preview_images = [];
                this.img.transform = '';
            },
             rotate(){
              if (this.img.transform=='') {
                  this.img.transform='rotate(90deg)'
              }else if (this.img.transform=='rotate(90deg)') {
                  this.img.transform='rotate(180deg)'
              }else if (this.img.transform=='rotate(180deg)') {
                  this.img.transform='rotate(270deg)'
              }else if (this.img.transform=='rotate(270deg)') {
                  this.img.transform=''
              }
            },
            edit(id){
                this.$confirm('确定已记录?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                       this.dataApi.ajax('editUserFeedBack',{feedBackId:id}, res => {
                        if (res.responseType === 'S') {
                             this.showMsg('确认成功')
                             this.fetchData(this.pageInfo.pageNum)
                        }
                    });
                }).catch(() => {
        
                });
            },


        }
    }
</script>
