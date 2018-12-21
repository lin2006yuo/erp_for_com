<template>
    <ui-card>
        <span slot="header" class="title">销售额：¥</span>
        <div ref="nearby15" class="nearby-chat"></div>
    </ui-card>
</template>

<style lang="stylus" scoped>
    .nearby-chat {
        width: 100%;
        height: 300px;
    }
</style>

<script>
    import {api_fba_orders_report} from '../../../api/fba-orders';
    import echarts from 'echarts';
    export default {
        data(){
            return {
                echarts: null,
                options:{}
            }
        },
        mounted(){
            console.log(this.$refs.nearby15);
            this.echarts = echarts.init(this.$refs.nearby15);
            this.init();
        },
        methods: {
            init(){
                let timeArray = [];
                let amountArray = [];
                let channels = [''];
                timeArray = this.report.map(row=>{
                    return fdatetime(row.time*1000, "YYYY-MM-dd");
                });
                amountArray = this.report.map(row=>{
                    return row.amount;
                });
                let channelsData = [{
                    type: 'line',
                    name: '亚马逊平台',
                    data: amountArray
                }];
                this.init_echats(channels,timeArray,channelsData);
            },
            init_echats(channels, dates, channelsData){
                let option = {
                    grid:{
                        x:60,
                        x2:60,
                        y:25,
                        y2:25
                    },
                    tooltip: {},
                    legend: {
                        show:true,
                        data: channels,
                    },
                    xAxis: {
                        data: dates,
                    },
                    yAxis: {},
                    series:channelsData
                };
                this.echarts.setOption(option);
            }
        },
        computed: {},
        watch: {
            report(){
                this.init();
            },
            options(opts){
                this.echarts.setOption(opts);
            },
            loadingChart(val){
                if(val){
                    this.echarts.showLoading();
                } else {
                    this.echarts.hideLoading();
                }
            }
        },
        props: {
            report:{},
            loadingChart:{}
        },
        components: {
            uiCard: require('../../../components/ui-card').default,
            labelButtons: require('../../../components/label-buttons.vue').default
        },
    }
</script>
