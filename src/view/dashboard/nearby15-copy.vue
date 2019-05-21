<template>
    <ui-card height="330px">
        <span slot="header">
            <span  :class="[curType==='orders'?'title_underline':'no-underline','title']"
                   @click="change_module('orders')">销售量</span>
            <span class="title">|</span>
            <span :class="[curType==='FBA'?'title_underline':'no-underline','title']"
                  @click="change_module('FBA')">FBA销售量</span>
        </span>
        <!--销售订单数-->
        <div v-show="curType==='orders'">
            <el-row :gutter="8">
                <el-col :span="4">
                    <ui-list :data="channels"
                             v-model="curChannel"
                             :styleData="styleData"
                             @click-cur="click_list"></ui-list>
                </el-col>
                <el-col :span="20">
                    <el-table
                        class="scroll-bar"
                        :data="ordersData"
                        v-loading="isLoading"
                        height="290"
                        element-loading-text="玩命加载中..."
                        highlight-current-row>
                        <el-table-column label='日期' prop="date"></el-table-column>
                        <el-table-column label='销售量' inline-template>
                            <span v-if="curChannel!=='all'&&curType==='orders'" @click="salesInfo(row)" class="operate">{{row.quantities | filterQuan}}</span>
                            <el-popover
                                placement="bottom"
                                v-else
                                width="175"
                                trigger="hover">
                                <el-table
                                    height="500"
                                    class="scroll-bar"
                                    :data="get_detail($index,'quantities')"
                                    highlight-current-row>
                                    <el-table-column label="平台" prop="label"></el-table-column>
                                    <el-table-column label='销售量' inline-template>
                                        <div>{{row.value | filterQuan}}</div>
                                    </el-table-column>
                                </el-table>
                                <div slot="reference">
                                    <span class="operate">{{row.quantities | filterQuan}}</span>
                                </div>
                            </el-popover>
                        </el-table-column>
                        <el-table-column label='销售额($)' inline-template>
                            <span v-if="curChannel!=='all'&&curType==='orders'">{{row.amount | filterAmount}}</span>
                            <el-popover placement="bottom"
                                        v-else
                                        width="175"
                                        trigger="hover">
                                <el-table
                                    height="500"
                                    class="scroll-bar"
                                    :data="get_detail($index,'amount')"
                                    highlight-current-row>
                                    <el-table-column label='平台' prop="label"></el-table-column>
                                    <el-table-column label='销售额($)' inline-template>
                                        <span>{{row.value | filterAmount}}</span>
                                    </el-table-column>
                                </el-table>
                                <div slot="reference">
                                    <div class="operate">{{row.amount | filterAmount}}</div>
                                </div>
                            </el-popover>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <!--FBA销售量-->
        <div v-show="curType==='FBA'">
            <el-table
                height="290" :data="FBAData"
                class="scroll-bar"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row>
                <el-table-column label="日期" prop="date"></el-table-column>
                <el-table-column label="销售量" inline-template>
                    <div>{{row.quantities | filterQuan}}</div>
                </el-table-column>
                <el-table-column label="销售额($)" inline-template>
                    <div>{{row.amount | filterAmount}}</div>
                </el-table-column>
            </el-table>
        </div>
        <sales-amount v-model="showSalesAmount"
                      :title="title"
                      :tableData = "tableData"
        ></sales-amount>
    </ui-card>
</template>
<style lang="stylus" scoped>
    .nearby-chat {
        width: 100%;
        height: 200px;
    }
    .title_underline{
        transition:all 0.2s;
        border-bottom-color: #00acac !important;
    }
    .no-underline{
        color: #b1b1b1;
    }


</style>
<script>
    import {api_nearyby15,api_fba_nearby15,api_account_info } from '../../api/dashborad';
    import echarts from 'echarts';
    export default{
        data(){
            return {
                isLoading:false,
                loading:false,
                echarts: null,
                channels:[],
                dates:[],
                FBAData:[],
                channelsData:[],
                curChannel:'all',
                curType:"orders",
                styleData:{
                    overflowY:'scroll',
                    maxHeight:'290px'
                },
                dateTime:'', // 当前日期
                showSalesAmount:false,
                title:"",
                tableData:[],
            }
        },
        filters:{
            filterAmount(val){
                let valStr = val.toString().split('.');
                let str1 = valStr[0];
                let str2 = valStr[1]||'';
                if(str2===''){
                    return str1.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                }else{
                    str1 =  str1.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                    return [str1,str2].join('.')
                }

            },
            filterQuan(val){
                return val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            },
        },
        mounted(){
            this.init();
            let time = new Date().toLocaleString().split(" ")[0].replace(/\//,"-");
            this.dateTime = new Date().toISOString().split("T")[0];
        },
        methods: {
            salesInfo(row){
                this.showSalesAmount = true;
                this.tableData = []; // 清空之前数据
                this.title = "账号销售量统计："+row.date;
                this.$http(api_account_info,{
                    channel_id:this.curentChannel.channel_id,
                    dateline:row.date
                }).then(res => {
                    this.tableData = res.data.data;
                }).catch(error =>{
                    this.$message({type:"error",message:error.message||error})
                })
            },
            click_list(item){
                this.curChannel = item.value;
            },
            change_module(type){
                this.curType = type;
                this.init();
            },
            get_detail(index,name){
                if(this.curChannel==='all'){
                    return this.channelsData.map(row=>{
                        return {
                            label:row.channel,
                            value:row[name][index]
                        }
                    });
                }
            },
            init(){
                switch(this.curType){
                    case 'orders':
                        this.init_orders();
                        break;
                    case 'FBA':
                        this.init_FBA();
                        break;
                }
            },
            //初始化订单
            init_orders(){
                this.isLoading = true;
                this.$http(api_nearyby15,{channel_id:0}).then(res=>{
                    let channels = res.channels.map(val=>{
                        return {
                            label:val,
                            value:val,
                            light:false,
                        }
                    });
                    let dates = res.days.map(row=>{
                        return fdatetime(row*1000, "YYYY-MM-dd");
                    });
                    let channelsData = res.data.map(row=>{
                        row.quantities = row.quantities.reverse();
                        row.amount = row.amount.reverse();
                        return row;
                    });
                    this.channels = channels;
                    let newChannel = {label:'所有平台',value:'all',light:true};
                    this.channels.unshift(newChannel);
                    this.dates = dates.reverse();
                    this.channelsData = channelsData;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.isLoading = false;
                })
            },
            //初始化FBA订单
            init_FBA(){
                this.loading = true;
                this.$http(api_fba_nearby15).then(res=>{
                    res.days = res.days.map(row=>datef('YYYY-MM-dd',row));
                    let allData = res.data[0];
                    this.FBAData = res.days.map((row,index)=>{
                        return {
                            date:row,
                            amount:allData.amount[index],
                            quantities:allData.quantities[index],
                        }
                    }).reverse();
                }).catch(code=>{
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
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
            curentChannel(){
                return this.channelsData.find(val=>{
                    return this.curChannel===val.channel
                })
            },
            comAllAmount(){
                if(this.curChannel==='all'){
                    return this.channelsData.map(row=>{
                        return {
                            label:row.channel,
                            amount:eval(row.amount.join('+'))
                        }
                    });
                }
            },
            comAllQuantities(){
                if(this.curChannel==='all'){
                    return this.channelsData.map(row=>{
                        return {
                            label:row.channel,
                            quantities:eval(row.quantities.join('+'))
                        }
                    });
                }
            },
            ordersData(){
                let curData = [];
                if(this.channelsData.length>0){
                    if(this.curChannel==='all'){
                        curData = this.dates.map((row,index)=>{
                            let amount = this.channelsData.map(val=>Number(val.amount[index]));
                            let quantities = this.channelsData.map(val=>Number(val.quantities[index]));
                            return {
                                date:row,
                                amount:eval(amount.join('+')),
                                quantities:eval(quantities.join('+')),
                            }
                        })
                    }else{
                        let findData = this.channelsData.find(val=>val.channel===this.curChannel);
                        if(!findData)return [];
                        curData = this.dates.map((row,index)=>{
                            return {
                               date:row,
                               amount:findData.amount[index],
                               quantities:findData.quantities[index],
                            }
                        })
                    }
                }
                return curData;
            },
            comInitData(){
                if(this.channelsData.length>0){
                    let obj = {};
                    if(this.curChannel!=='all'){
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
            },

        },
        components: {
            uiCard: require('../../components/ui-card').default,
            labelButtons: require('../../components/label-buttons.vue').default,
            labelItem:require('@/components/label-item').default,
            uiList:require('@/components/ui-list.vue').default,
            "sales-amount":require("./sales-amount.vue").default
        }
    }
</script>
