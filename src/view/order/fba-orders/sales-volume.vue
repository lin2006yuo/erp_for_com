<template>
    <div class="p-add-analyze">
        <page-dialog :title="`SKU:${saleVolume.sku}的商品销量统计`" size="full" v-model="dialog" :close-on-click-modal="false">
            <div>
                <div id="addAnalyze" style="width:100%;height:400px"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="dialog=false">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .nearby-chat {
        width: 100%;
        height: 200px;
    }
</style>

<script>
    import {api_fba_chart_data} from '../../../api/fba-orders';
    import echarts from 'echarts';
    export default {
        data(){
            return {
                echarts: null,
                dialog:false
            }
        },
        mounted(){},
        methods: {
            init(){
                this.$http(api_fba_chart_data,Object.assign({channel_id:2},this.saleVolume)).then(res=>{
                    let myChart  = echarts.init(document.getElementById('addAnalyze'));
                    //销量数据接口
                    let option = {
                        title: {
                            text: '30天销量：'+res.thirdty_qty +'  '+'15天销量：'+res.fifteen_qty+'  '+'7天销量：'+res.seven_qty+'  '+'3天销量：'+res.three_qty,
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
                                data:res.data
                            }
                        ]
                    };
                    myChart .setOption(option);
                }).catch(code=>{this.$message({type:'error',message:code.message||code})});
            },
        },
        computed: {},
        watch: {
            value(val){
                if(val){
                    this.init();
                }
                this.dialog=val;
            },
            dialog(val){
                this.$emit('input',val)
            },
        },
        props: {
            value:{},
            saleVolume:{}
        },
        components: {
            labelButtons: require('../../../components/label-buttons.vue').default,
            pageDialog:require("../../../components/page-dialog.vue").default,
        },
    }
</script>
