<template>
    <ui-card>
        <span slot="header" class="title">近期(15天)销售订单数</span>
        <div ref="nearby15" class="nearby-chat"></div>
    </ui-card>
</template>
<style lang="stylus" scoped>
    .nearby-chat {
        width: 100%;
        height: 200px;
    }
</style>
<script>

    import {api_nearyby15} from '../../api/dashborad';
    import echarts from 'echarts';
    export default{
        data(){
            return {
                echarts: null,
                channels:[],
                dates:[],
                channelsData:[]
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                this.$http(api_nearyby15).then(res=>{
                    let channels = res.channels;
                    let dates = res.days.map(row=>{
                        return fdatetime(row*1000, "YYYY-MM-dd");
                    });
                    let channelsData = res.data.map(row=>{
                        row.type = 'line';
                        row.name = row.channel;
                        row.data = row.quantities;
                        return row;
                    });
                    this.channels = channels;
                    this.dates = dates;
                    this.channelsData = channelsData;
                    this.init_echats();
                })
            },
            init_echats(){
                if(this.echarts){
                    echarts.dispose(this.$refs.nearby15);
                    this.echarts = null;
                }
                this.echarts = echarts.init(this.$refs.nearby15);
                let option = {
                    grid:{
                        x:80,
                        x2:50,
                        y:20,
                        y2:30
                    },
                    tooltip: {},
                    legend: {
                        show:true,
                        data: this.channels,//['销量', 'sss']
                    },
                    xAxis: {
                        data: this.dates,//["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                    },
                    yAxis: {},
                    series:this.channelsData
//                        [
//
////                        {
////                            name: '销量',
////                            type: 'line',
////                            data: [5, 20, 36, 10, 10, 20]
////                        },
////                        {
////                            name: 'sss',
////                            type: 'line',
////                            data: [5, 5, 5, 10, 10, 20]
////                        }
//                    ]
                };

                this.echarts.setOption(option);
            }
        },
        components: {
            uiCard: require('../../components/ui-card').default,
            labelButtons: require('../../components/label-buttons.vue').default
        }
    }
</script>