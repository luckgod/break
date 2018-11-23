<template>
    <div class="bg">
        <div id="container" class="map" tabindex="0"></div>
        <el-button type="primary" @click="goBack()" style="position: relative;">返回</el-button>
        <div id="pickerBox">
            <input id="pickerInput" placeholder="输入关键字选取地点" />
            <el-button type="primary" @click="submit">保存</el-button>
            <div id="poiInfo"></div>
        </div>
    </div>
    
</template>
<style>

  #container {
        width: 100%;
        height: 100%;
        margin: 0px;
        font-size: 13px;
    }
    
    #pickerBox {
        position: absolute;
        z-index: 9999;
        top: 80px;
        right: 30px;
        width: 300px;
    }
    
    #pickerInput {
        width: 200px;
        padding: 5px 5px;
    }
    
    #poiInfo {
        background: #fff;
    }
    
    .amap_lib_placeSearch .poibox.highlight {
        background-color: #CAE1FF;
    }
    
    .amap_lib_placeSearch .poi-more {
        display: none!important;
    }
</style>




<script>
    
    export default {
        data() {
            return {
               addressInfo:{
                   storeAccu:'',
                   storeDime:'',
                   storeAddress:'',
                   areaNum:''
               },
               urlPram:{}
            };
        },
        created() {
           sessionStorage.removeItem('address')
        },
        mounted(){
            this.urlPram = getRequestParam(location.hash)
            var _this=this
            var map = new AMap.Map('container', {
                zoom: 10
            });

            AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

                var poiPicker = new PoiPicker({
                    //city:'北京',
                    input: 'pickerInput'
                });

                //初始化poiPicker
                poiPickerReady(poiPicker);
            });

            function poiPickerReady(poiPicker) {
                
                window.poiPicker = poiPicker;

                var marker = new AMap.Marker();

                var infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -20)
                });

                //选取了某个POI
                poiPicker.on('poiPicked', function(poiResult) {
                   
                    var source = poiResult.source,
                        poi = poiResult.item,
                        info = {
                            // source: source,
                            // id: poi.id,
                            // name: poi.name,
                            // location: poi.location.toString(),
                            address: poi.address
                        };
                    _this.addressInfo={
                        storeAccu:poi.location.O,
                        storeDime:poi.location.P,
                        storeAddress:poi.district+poi.address,
                        areaNum:poi.adcode
                    }
                    marker.setMap(map);
                    infoWindow.setMap(map);

                    marker.setPosition(poi.location);
                    infoWindow.setPosition(poi.location);

                    infoWindow.setContent('地点信息: <pre>地址:' + poi.address+ '</pre>');
                    infoWindow.open(map, marker.getPosition());

                    //map.setCenter(marker.getPosition());
                });

                
                // poiPicker.onCityReady(function() {
                //     poiPicker.suggest(decodeURI(_this.urlPram.storeAddress));
                // });
            }
        },
        methods: {
            submit(){
                if (this.addressInfo.storeAddress=='') {
                    this.showMsg('选择地址不正确','warning')
                    return
                }
                sessionStorage.setItem('address',JSON.stringify(this.addressInfo))
                sessionStorage.removeItem('keep')
                this.goBack()
                
            }
        }
    }
</script>