<template>
    <div class="p-add-analyze">
        <page-dialog :title="`SKU:${form.sku}的商品销量统计`" @open="open" v-model="dialog" size="large"
                     :close-on-click-modal="false">
            <label-buttons label="平台：" :buttons="channels" @select="changeChannel"></label-buttons>
            <div>
                <div id="addAnalyze" style="width:100%;height:400px"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="dialog=false">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import echarts from 'echarts';
    import {api_chart_data} from '../../../api/purchasing'
    import {api_channels} from '../../../api/global'

    export default {
        data() {
            return {
                dialog: false,
                channels: [],
            }
        },
        created() {

        },
        mounted() {
            this.$http(api_channels).then(res => {
                this.channels = [{label: "全部", value: 0}, ...res];
            })
        },
        methods: {
            open() {
                this.$nextTick(() => {
                    this.request_channel_data(0);
                });
            },
            changeChannel(index, channel) {
                this.request_channel_data(channel.value);
            },
            request_channel_data(channelId) {
                this.$http(api_chart_data, Object.assign({channel_id: channelId}, this.form)).then(res => {
                    let myChart = echarts.init(document.getElementById('addAnalyze'));
                    //销量数据接口
                    var option = {
                        title: {
                            text: `3天销量：${res.three_qty}     5天销量：${res.five_qty}     7天销量：${res.seven_qty}     15天销量：${res.fifteen_qty}     30天销量：${res.thirdty_qty}     ${res.one_months_name}月份销量：${res.one_months_qty}     ${res.two_months_name}月份销量：${res.two_months_qty}`
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter: "销量统计：<br/>{b} : {c}"
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            axisLine: {onZero: false},
                            axisLabel: {
                                formatter: '{value}'
                            },
                            boundaryGap: false,
                            data: res.x_axis
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            },
                            minInterval:1,
                            max:()=>{
                                let max = 0;
                                res.data.forEach(num=>{
                                    max = num>max?num:max;
                                });
                                if(max>5){
                                    return max
                                }else{
                                    return 5
                                }
                            }
                        },
                        series: [
                            {
                                name: '商品销量统计图表',
                                type: 'line',
                                smooth: true,
                                lineStyle: {
                                    normal: {
                                        width: 3,
                                        shadowColor: 'rgba(0,0,0,0.4)',
                                        shadowBlur: 10,
                                        shadowOffsetY: 10
                                    }
                                },
                                data: res.data
                            }
                        ]
                    };
                    myChart.setOption(option);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                });
            }
        },
        filters: {},
        watch: {
            value(val) {
                this.dialog = val;
            },
            dialog(val) {
                this.$emit('input', val)
            },
        },
        computed: {},
        props: {
            value: {},
            form: {},
            title: {}
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            labelButtons: require('../../../components/label-buttons.vue').default
        }
    }
</script>
