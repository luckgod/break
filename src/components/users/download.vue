<template>
    <div class="admin-home" style="padding-top: 20px;">
           <div id="chart" style="width:1200px;height:400px;margin-left: 10px;margin-top: 40px;"></div>      
    </div>
</template>
<style> 


</style>
<script>
    export default{
        data(){
            return{
                countData:[],
                countDate:[]
            }
        },
        created() {
            // this.fetchData()
        },
        methods: {
           fetchData () {
                this.dataApi.ajax('countNumber',null, res => {
                  if (res.responseType === 'S') {
                        for (var i = res.dtos.length-1;i  >= 0;  i--) {
                          this.countData.push(res.dtos[i].count)
                          this.countDate.push(res.dtos[i].date)  
                        } 
                        this.data()
                   }
                 });

            },
            data(){
              var myChart = echarts.init(document.getElementById('chart'),'walden');
            var  options = {
                    title: {
                        text: '近30天用户增长量统计图'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                               
                            }
                        }
                    },
                    legend: {
                        data:['增长量']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data :this.countDate
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'增长量',
                            type:'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            data:this.countData
                        },
                    ]
                };
                myChart.setOption(options);


            },

        }
    }
</script>
