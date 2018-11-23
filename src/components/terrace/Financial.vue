<template>
    <div class="customer distribution">
        <div>
            <div class="level">买家</div>
            <div style="width:130px;display: inline-block;text-align: center;">
                <div>
                    <el-input style="width:60px;" v-model="reward_point_buyer_upper1"></el-input>
                    %
                </div>
                <img src="../../assets/images/jiantou.png" width="120">
            </div>
            <div class="level">买家上一级</div>
            <div style="width:130px;display: inline-block;text-align: center">
                <div>
                    <el-input style="width:60px;" v-model="reward_point_buyer_upper2"></el-input>
                    %
                </div>
                <img src="../../assets/images/jiantou.png" width="120">
            </div>
            <div class="level">买家上二级</div>
<!--             <div style="width:130px;display: inline-block;text-align: center">
                <div>
                    <el-input style="width:60px;" v-model="f.XTwo2Thrid"></el-input>
                    %
                </div>
                <img src="../../assets/images/jiantou.png" width="120">
            </div>
            <div class="level">上三级创客会员</div> -->
        </div>

        <div style="margin-top: 100px;">
            <div class="level">商家</div>
            <div style="width:130px;display: inline-block;text-align: center;">
                <div>
                    <el-input style="width:60px;" v-model="reward_point_seller_upper1"></el-input>
                    %
                </div>
                <img src="../../assets/images/jiantou.png" width="120">
            </div>
            <div class="level">商家上一级</div>
            <div style="width:130px;display: inline-block;text-align: center">
                <div>
                    <el-input style="width:60px;" v-model="reward_point_seller_upper2"></el-input>
                    %
                </div>
                <img src="../../assets/images/jiantou.png" width="120">
            </div>
            <div class="level">商家上二级</div>
<!--             <div style="width:130px;display: inline-block;text-align: center">
                <div>
                    <el-input style="width:60px;" v-model="f.QTwo2Third"></el-input>
                    %
                </div>
                <img src="../../assets/images/jiantou.png" width="120">
            </div>
            <div class="level">上三级创客会员</div> -->
        </div>
        <div style="margin:50px 0;">
            交易成功，商家获得奖励券比例
            <el-input style="width:60px;" v-model="f.QOne2Two"></el-input>
            %
        </div>
        <el-button type="primary" @click="submit">提交</el-button>

    </div>
</template>
<style>
    .distribution {
        font-size: 17px;
        padding-top: 80px;
        margin-left: 50px;
    }

    .level {
        border: 1px solid black;
        display: inline-block;
        padding: 10px 20px;
        margin-bottom: 20px;
    }
</style>
<script>

    export default {
        data() {
            return {
                f: {},
                reward_point_buyer_upper1:'',   //买方上1级奖励比例
                reward_point_buyer_upper2:'',  //买方上2级奖励比例
                reward_point_seller_upper1:'',   //卖方上1级奖励比例
                reward_point_seller_upper2:'',   //卖方上2级奖励比例
            }
        },
        created(){
            this.fetchArgument()
        },
        methods: {
            fetchArgument(){
                
                //查询系统参数
                this.dataApi.ajax('sysParamQuery',{
                sysCodes:'reward_point_buyer_upper1,reward_point_buyer_upper2,reward_point_seller_upper1,reward_point_seller_upper2'}, res => {
                    if (res.responseType === 'S') {
                         for(var k in res.map){
                              this[k]=res.map[k]*100
                          }
                    }
                });
            },
            submit() {
                var dtos=[
                     {
                        sysCode:'reward_point_buyer_upper1',
                        sysKey:'reward_point_buyer_upper1',
                        sysValue:this.reward_point_buyer_upper1/100
                     },
                     {
                        sysCode:'reward_point_buyer_upper2',
                        sysKey:'reward_point_buyer_upper2',
                        sysValue:this.reward_point_buyer_upper2/100
                     },
                     {
                        sysCode:'reward_point_seller_upper1',
                        sysKey:'reward_point_seller_upper1',
                        sysValue:this.reward_point_seller_upper1/100
                     },
                     {
                        sysCode:'reward_point_seller_upper2',
                        sysKey:'reward_point_seller_upper2',
                        sysValue:this.reward_point_seller_upper2/100
                     }
                
                 ]
                
                 this.dataApi.ajax('batchEditSysParam',{dtos:JSON.stringify(dtos)}, res => {    
                        if (res.responseType === 'S') {
                              this.showMsg('修改成功');
                              this.fetchArgument();

                        }
                 });
            }
        }
    }
</script>
