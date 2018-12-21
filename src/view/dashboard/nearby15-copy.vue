<template>
    <ui-card :is-loading="isLoading">
        <span slot="header" class="title">近期(15天)销售订单数</span>
        <div style="width:100%;text-align: center;margin-bottom: 10px">
            <el-radio-group v-model="curChannel">
                <el-radio v-for="item in channels" :key="item" :label="item">{{item}}</el-radio>
            </el-radio-group>
        </div>
        <div>
            <table class="template" v-if="comInitData">
                <tr>
                    <th style='max-width:130px'></th>
                    <th v-for="item in dates" :key="item">{{item}}</th>
                </tr>
                <tr>
                    <td>
                        {{comInitData.quantitiesTitle}}
                    </td>
                    <td v-for="(quantity,index) in comInitData.quantities" :key="index">
                        <div v-if="curChannel!=='所有平台'">{{quantity}}</div>
                        <el-popover placement="bottom"
                                    v-else
                                    width="175"
                                    trigger="hover">
                            <el-table
                                    class="scroll-bar"
                                    :data="get_detail(index,'quantities')"
                                    highlight-current-row>
                                <el-table-column prop="label"></el-table-column>
                                <el-table-column prop="value"></el-table-column>
                            </el-table>
                            <div slot="reference">
                                 <div class="operate">{{quantity}}</div>
                            </div>
                        </el-popover>
                    </td>
                </tr>
                <tr>
                    <td>
                        {{comInitData.amountTitle}}
                    </td>
                    <td v-for="(row,index) in comInitData.amount" :key="index">
                        <div v-if="curChannel!=='所有平台'">{{row}}</div>
                        <el-popover placement="bottom"
                                    v-else
                                    width="175"
                                    trigger="hover">
                            <el-table
                                    class="scroll-bar"
                                    :data="get_detail(index,'amount')"
                                    highlight-current-row>
                                <el-table-column prop="label"></el-table-column>
                                <el-table-column prop="value"></el-table-column>
                            </el-table>
                            <div slot="reference">
                                 <div class="operate">{{row}}</div>
                            </div>
                        </el-popover>
                    </td>
                </tr>
            </table>
        </div>
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
                isLoading:false,
                echarts: null,
                channels:[],
                dates:[],
                channelsData:[],
                curChannel:'所有平台',
            }
        },
        filters:{
            filterAmount(val){
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(2):val;
            },
        },
        mounted(){
            this.init();
        },
        methods: {
            get_detail(index,name){
                if(this.curChannel==='所有平台'){
                    return this.channelsData.map(row=>{
                        return {
                            label:row.channel,
                            value:row[name][index]
                        }
                    });
                }
            },
            init(){
                this.isLoading = true;
                this.$http(api_nearyby15,{channel_id:0}).then(res=>{
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
                    let newChannel = '所有平台';
                    this.channels.unshift(newChannel);
                    this.dates = dates;
                    this.channelsData = channelsData;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.isLoading = false;
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
                };

                this.echarts.setOption(option);
            }
        },
        computed:{
            comAllAmount(){
                if(this.curChannel==='所有平台'){
                    return this.channelsData.map(row=>{
                        return {
                            label:row.channel,
                            amount:eval(row.amount.join('+'))
                        }
                    });
                }
            },
            comAllQuantities(){
                if(this.curChannel==='所有平台'){
                    return this.channelsData.map(row=>{
                        return {
                            label:row.channel,
                            quantities:eval(row.quantities.join('+'))
                        }
                    });
                }
            },
            comInitData(){
                if(this.channelsData.length>0){
                    let obj = {};
                    if(this.curChannel!=='所有平台'){
                        let find = this.channelsData.find(row=>row.channel===this.curChannel);
                        if(find){
                            this.$set(find,'amountTitle',`${find.channel} 销售额$`);
                            this.$set(find,'quantitiesTitle',`${find.channel} 订单量`);
                            obj = find;
                        }
                        return obj;
                    }else{
                        let amount = [];
                        let quantities = [];
                        this.dates.forEach((item,index)=>{
                            this.channelsData.forEach(row=>{
                                if(amount[index]===undefined){
                                    amount[index] = Number(row.amount[index]);
                                }else{
                                    amount[index] += Number(row.amount[index]);
                                }
                                if(quantities[index]===undefined){
                                    quantities[index] = Number(row.quantities[index])
                                }else{
                                    quantities[index] += Number(row.quantities[index]);
                                }
                            });
                        });
                        return {
                            amountTitle:'总销售额＄',
                            quantitiesTitle:'总订单量',
                            amount:amount,
                            quantities:quantities
                        };
                    }
                }
            }
        },
        components: {
            uiCard: require('../../components/ui-card').default,
            labelButtons: require('../../components/label-buttons.vue').default
        }
    }
</script>
