<template>
    <page>
        <div class="scroll">
            <card-search @search="search" :clears="clears" :form="form" class="mb-sm">
            </card-search>
            <div
                v-loading="loading"
                element-loading-text="拼命加载中"
            >
                <!--暂时不显示-->
                <request-button
                    v-if="false"
                    class="mt-xs mb-xs ml-sm"
                    :request="batch_export">批量导出</request-button>
                <!--取消图表-->
                <!--<div ref="chart" class="mb-sm chart" v-if="!!table.length"></div>-->
                <div class="formula fr" v-if="!!table.length">
                    <span style="color:red">！</span><span>币种统一为人民币</span>
                </div>
                <table-list :table="table" :loading="loading" :firstTime="firstTime" @detail="detail" :table-columns="tableColumns">

                </table-list>
            </div>
            <detail-model :table="detail_list"
                          v-model="detail_show" :title="title" @size-change="size_change" @current-change="current_change">

            </detail-model>
            <export-dialog v-model="export_show"></export-dialog>
        </div>
    </page>
</template>
<style scoped>
    .scroll{
        height: 800px;
        overflow: scroll;
    }
.chart{
    width: 1200px;
    height: 400px;
}
    .formula{
        display: flex;;
        justify-content: flex-end;
        margin-bottom: 5px;
        padding-right: 34px;
        color:#99a9bf;
        margin-top: 15px;
    }
</style>
<script>
    import {api_index_settle,api_index_settle_detail,api_settle_export} from '../../../api/loan-payment-days'
    import echarts from 'echarts'
    export default {
        page:{
            devinfo:{
                frontEnd:'陆城锫/林学裕',
                backEnd:'林鹏',
                createTime:'2018-11-27',
                updateTime:'2019-1-9'
            }
        },
        data() {
            return {
                loading:false,
                flag:true,
                chart:null,
                firstTime:true,
                detail_show:false,
                export_show:false,
                title:'',
                order_proportion:[],
                loan_proportion:[],
                form: {
                    channel_id:4,
                    site:'',
                    account_id:'',
                    date_b:new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),
                    date_e:this.lastDay(new Date()),
                    time_type: 'shipping_time'
                },
                clears:{
                    channel_id:4,
                    site:'',
                    account_id:'',
                    date_b:new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),
                    date_e:this.lastDay(new Date()),
                    time_type: 'shipping_time'
                },
                page:1,
                pageSize:20,
                table:[],
                detail_list:{
                    list:[],
                    page:null,
                    pageSize:null,
                    total:0,
                    loading:true,
                },
                clone_detail:{},
                period:[],
                //表头信息
                tableColumns: [],
                //loading
                loading: false
            }
        },
        mounted(){
            // this.init();
        },
        methods: {
            search() {
                this.init()
            },
            lastDay(data){
                let checkDay = function (year,mouth) {
                    let bigMonth = [1,3,5,7,8,10,12];
                    let smallMonth = [4,6,9,11];
                    let secondMonth = checkLeapYear(year)?29:28;
                    if(bigMonth.includes(mouth)){
                        return 31;
                    }else if(smallMonth.includes(mouth)){
                        return 30
                    }else {
                        return secondMonth
                    }
                };
                let checkLeapYear = function (year) {
                    if((year%4==0&&year%100 !=0) ||year%400 ==0){
                        return true
                    }else {
                        return false
                    }
                };
                let prevMonth_lastDay_Times = function (today) {
                    let prevMonth = today.getMonth()==0?12:today.getMonth();
                    let prevYear = prevMonth==12?today.getFullYear()-1:today.getFullYear();
                    let lastDay = checkDay(prevYear,prevMonth);
                    return new Date(`${prevYear}-${prevMonth}-${lastDay} ${23}:${59}:${59}`);
                };
                return prevMonth_lastDay_Times(data)
            },
            current_change(val){
                this.$set(this.clone_detail,'page',val);
                this.detail_req(this.clone_detail);
            },
            size_change(val){
                this.$set(this.clone_detail,'pageSize',val);
                this.detail_req(this.clone_detail);

            },
            batch_export(){
                let data = window.clone(this.form);
                this.$delete(data,'site');
                if(this.form.date_e){
                    let cur = new Date(this.form.date_e);
                    data.date_e = cur.getTime()/1000
                }
                if(this.form.date_b){
                    let cur = new Date(this.form.date_b);
                    data.date_b = cur.getTime()/1000;
                };
                if(this.form.date_b === undefined) {
                    data.date_b = ""
                }
              return this.$http(api_settle_export,data).then(res => {
                  this.$message({type:"success",message:res.message||res});
                  this.export_show = true;
                  return Promise.resolve();
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            //详情请求
            detail_req(data){
                if (this.flag){
                    this.detail_list.loading=true;
                    this.flag= false;
                    this.$http(api_index_settle_detail,data).then(res=>{
                        this.flag = true;
                        if(!!res){
                            let period=res.data[0].loan_period===-1?'未放款':res.data[0].loan_period ;
                            if(Number(res.data[0].loan_period)>=16){
                                period = '16周以上'
                            }
                            this.title = `${period}周账期订单详情`;
                            this.detail_list.list= res.data;
                            this.detail_list.page = Number(res.page);
                            this.detail_list.pageSize = Number(res.pageSize);
                            this.detail_list.total = res.total;
                            this.detail_list.list.forEach(row=>{
                                if(row.loan_period===-1) row.loan_period = '未放款';
                            });
                        }
                        this.detail_list.loading=false;                        
                        this.$nextTick(()=>{
                            this.detail_show = true
                        })
                    }).catch(err=>{
                        this.flag = true;
                        console.log(err)
                    })
                }
            },
            detail(row){
                this.clone_detail={};
                let data={
                    account_id:this.form.account_id,
                    channel_id:this.form.channel_id,
                    loan_period:row.loan_period==='未放款'?-1:row.loan_period==='16周以上'?16:row.loan_period,
                    page:1,
                    pageSize:20,
                };
                if(!!this.form.date_b) this.$set(data,'date_b',new Date(this.form.date_b).getTime()/1000);
                if(!!this.form.date_e) this.$set(data,'date_e',new Date(this.form.date_e).getTime()/1000);
                if(data.loan_period==='汇总') return;
                Object.assign(this.clone_detail,data);
                this.detail_req(data)
            },
            //获取当前月最后一天
            getCurrentMouthLast(){
                let date = new Date();
                let currentMouth = date.getMonth();
                let nextMouth = ++currentMouth;
                let nextMouthFirstDay = new Date(date.getFullYear(),nextMouth,1);
                let oneDay = 1000*60*60*24;
                return new Date(nextMouthFirstDay-oneDay)
            },
            //echart
            init_chart(){
                this.chart =echarts.init(this.$refs.chart);
                this.order_proportion = this.order_proportion.map(row=>Number(row.replace('%','')));
                this.loan_proportion = this.loan_proportion.map(row=>Number(row.replace('%','')));
                this.order_proportion = this.order_proportion.splice(0,this.order_proportion.length-2);
                this.loan_proportion = this.loan_proportion.splice(0,this.loan_proportion.length-2);
                this.period = this.period.filter(row=>row!=='汇总'&&row!=='未放款');
                this.chart.setOption({
                    title:{
                        text:'放款账期占比',
                        x: 700,
                        y:'top',
                        textAlign:'left'
                    },
                    grid:{
                        left:'35%',
                        top:'10%',
                        width:720
                    },
                    tooltip:{
                        trigger:'item',
                        formatter:function (par) {
                            return `${par.name}${par.seriesName} : ${par.data}%`
                        }
                    },
                    legend: {
                        orient: 'horizontal', // 'vertical'
                        x: 700, // 'center' | 'left' | {number},
                        y: 360, // 'center' | 'bottom' | {number}
                        backgroundColor: '#fff',
                        // borderColor: 'rgba(178,34,34,0.8)',
                        // borderWidth: 4,
                        padding: 15,    // [5, 10, 15, 20]
                        itemGap: 20,
                        width:800,
                        data:['账期占比(订单量)','账期占比(订单额)']
                    },
                    dataZoom: [{
                       type: 'inside'
                    }],
                    color:['#4F81BD','#C0504D'],
                    toolbox: {
                        show : true,
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.period,
                            axisLabel:{
                                // interval:0,
                                rotate:0,
                                // //x轴超出部分省略号显示
                                // formatter: function(val) {
                                //     if (val.length > 3) {
                                //         return val.substring(0, 1) + '...';
                                //     } else {
                                //         return val;
                                //     }
                                // }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            //type : 'value',
                            axisLabel:{
                               formatter:'{value}%',
                                textStyle:{
                                    color:'#888'
                                },
                            },
                        }
                    ],
                    series : [
                        {
                            name:'账期占比(订单量)',
                            type:'bar',
                            data:this.order_proportion
                        },
                        {
                            name:'账期占比(订单额)',
                            type:'bar',
                            data:this.loan_proportion,
                        }
                    ]
                })
            },
            //格式化金额
             async init(){
                this.loading = true;
                this.get_column_list();
                this.loading = true;
                let data = window.clone(this.form);
                if(!!this.form.date_e){
                    let cur = new Date(this.form.date_e);
                     data.date_e = cur.getTime()/1000
                }else {
                    data.date_e =''
                };
                if(!!this.form.date_b){
                    let cur = new Date(this.form.date_b);
                    data.date_b = cur.getTime()/1000
                }else {
                    data.date_b = ''
                }
                // 3 为wish
                if(data.channel_id === 3) {
                    try {
                        const res = await this.$http(api_index_settle, data);
                        if(res.length === 0) {
                            this.noData();
                            return
                        }
                        this.loading = false;
                        this.firstTime = false;
                        if(!res.length) {
                            this.table =[];
                            this.order_proportion = [];
                            this.loan_proportion = [];
                            return
                        }
                        this.table = res;
                        this.order_proportion = this.table.map(row=>row.order_quantity_proportion);
                        this.loan_proportion = this.table.map(row=>row.order_amount_proportion);
                    } catch (e) {
                        this.handleError(e)
                    }

                }
                // 4 为速卖通
                else if(data.channel_id === 4){
                    // 代扣订单合计
                    try {
                        let dataTable = await this.$http(api_index_settle, {...data});
                        if(dataTable.length === 0) {
                            this.noData();
                            return
                        }
                        this.firstTime = false;
                        const {h_data, hn_data, sum} = dataTable;
                        const table = [...h_data, ...hn_data, ...sum];
                        //处理table数据
                        this.handleTableData(table);
                        this.table = table;
                        this.loading = false;
                    } catch (e) {
                        this.handleError(e)
                    }
                } else {
                    this.$message({type: 'error', message: 'channel_id错误'})
                }
            },
            //设置表头
            get_column_list() {
                switch (this.form.channel_id) {
                    // 3为wish平台
                    case 3:
                        this.tableColumns = [
                            {label:'放款账期(周)', value:'loan_period'},
                            {label:'订单量', value:'order_quantity', click: 'not-click'},
                            {label:'订单金额', value:'order_amount'},
                            {label:'放款 | 退款金额', value:'loan_amount'},
                            {label:'放款 | 退款比例', value:'real_loan_proportion'},
                            {label:'其他相关费用', value:'correlative_amount'},
                            {label:'转账小计', value:'transfer_amount'},
                            {label:'转账小计比例', value:'transfer_amount_proportion'},
                            {label:'账期占比(订单量)', value:'order_quantity_proportion'},
                            {label:'账期占比(订单额)', value:'order_amount_proportion'},
                        ];
                        break;
                    // 4为速卖通
                    case 4:
                        this.tableColumns = [
                            {label:'放款账期(周)', value:'loan_period'},
                            {label:'订单量', value:'order_quantity', click: 'not-click'},
                            {label:'系统订单金额', value:'order_amount'},
                            {label:'扣佣后放款 | 退款金额', value:'loan_amount'},
                            {label:'扣佣后放款 | 退款比例', value:'real_loan_proportion'},
                            {label:'线上费用', value:'withhold_amount'},
                            {label:'其他与订单相关', value:'correlative_amount'},
                            {label:'转账小计', value:'transfer_amount'},
                            {label:'转账小计比例', value:'transfer_amount_proportion', width: 90},
                            {label:'账期占比(订单量)', value:'order_quantity_proportion', width: 120},
                            {label:'账期占比(订单额)', value:'order_amount_proportion', width: 120},
                        ]
                        break;
                }
            },
            handleTableData(table) {
                table.forEach(row => {
                    row.order_quantity = this.format(row.order_quantity);
                    row.order_amount = this.format(row.order_amount);
                    row.loan_amount = this.format(row.loan_amount);
                    row.withhold_amount = this.format(row.withhold_amount);
                    row.correlative_amount = this.format(row.correlative_amount);
                    row.transfer_amount = this.format(row.transfer_amount);

                    row.real_loan_proportion = this.addPro(row.real_loan_proportion);
                    row.transfer_amount_proportion = this.addPro(row.transfer_amount_proportion);
                    row.order_quantity_proportion = this.addPro(row.order_quantity_proportion);
                    row.order_amount_proportion = this.addPro(row.order_amount_proportion)
                })
            },
            //添加%符号
            addPro(str) {
                //如果存在"|"分隔符
                if(typeof str === 'string' && str.indexOf('|') !== -1){
                    const strArr = str.split('|');
                    return strArr[0] + '%|' + strArr[1] + '%'
                } else {
                    return str + '%';
                }
            },
            format (num) {
                if(typeof num === 'string' && num.indexOf("|") !== -1){
                    let strArr = num.split("|");
                    return this.format(strArr[0]) + "|" + this.format(strArr[1])
                } else {
                    num = String(num)
                }
                let reg=/(\d)(?=(\d{3})+\.)/g;
                return num.replace(reg, '$1,')
            },
            handleError(e) {
                this.loading = false;
                this.$message({type: 'error', message: e});
                this.table = []
            },
            noData() {
                this.firstTime = false;
                this.loading = false;
                this.table = []
            }
        },
        watch: {
            'form.date_e'(val) {
                if(val) {
                    if((val.getTime() / 1000) % 10 === 9) {
                        return ;
                    } else {
                        this.form.date_e = new Date(val.getTime() + 24*60*60*1000 - 1000);
                    }
                }
            },
            // 'form.channel_id'() {
            //     this.get_column_list()
            // }
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            detailModel:require('./detail-model.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
            exportDialog:require('../../report/export-dialog').default,
        }
    }
</script>

