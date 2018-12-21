<template>
    <page>
        <div class="scroll">
            <card-search @search="search" :clears="clears" :form="form" class="mb-sm">
            </card-search>
            <request-button
                    class="mt-xs mb-xs ml-sm"
                    :request="batch_export">批量导出</request-button>
            <div ref="chart" class="mb-sm chart" v-if="!!table.length"></div>
            <div class="formula" v-if="!!table.length">
                <span style="color:aqua">！</span><span>账期占比 = 本账期订单 / 合计订单</span>
            </div>
            <table-list :table="table" :loading="loading" :firstTime="firstTime" @detail="detail">

            </table-list>
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
        color:#99a9bf
    }
</style>
<script>
    import {api_index_settle,api_index_settle_detail,api_settle_export} from '../../../api/loan-payment-days'
    import echarts from 'echarts'
    export default {
        page:{
            devinfo:{
                frontEnd:'陆城锫',
                backEnd:'林鹏',
                createTime:'2018-11-27',
                updateTime:''
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
                    date_e:this.lastDay()
                },
                clears:{
                    channel_id:4,
                    site:'',
                    account_id:'',
                    date_b:new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),
                    date_e:this.lastDay()
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
                period:[]
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            search() {
                this.init()
            },
            lastDay(){
                let time = new Date();
                let year = time.getFullYear();
                let month = time.getMonth();
                if(month===0){
                    month = 12;
                    year = year-1
                }else if(month<10){
                    month='0'+month;
                }
                let myDate = new Date(year,month,0);
                let lastDay = year+'-'+month+'-'+myDate.getDate();
                return lastDay
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
                        text:'放款账期与放款比例',
                        x:700,
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
                                interval:0,
                                rotate:0
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
            init(){
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
                };
                this.$http(api_index_settle,data).then(res=>{
                    this.loading = false;
                    this.firstTime = false;
                    if(res instanceof Array){
                        if(!res.length) {
                            this.table =[];
                            this.order_proportion = [];
                            this.loan_proportion = [];
                            return
                        }
                    }else {
                        this.table = res.data;
                        this.order_proportion = this.table.map(row=>row.order_proportion);
                        this.loan_proportion = this.table.map(row=>row.loan_proportion);
                        this.table.forEach(row=>{
                            if(row.loan_period===-1){
                                row.loan_period = '未放款'
                            } else if(row.loan_period==='16'){
                                row.loan_period = '16周以上';
                            }
                            row.order_amount = 'USD'+row.order_amount.toString();
                            row.loan_amount = 'USD'+row.loan_amount.toString()
                        });
                        this.period=JSON.parse(JSON.stringify(this.table)).map(row=>{
                            if({}.toString.call(row.loan_period)==='[object Number]'){
                                this.$set(row,'loan_period',row.loan_period+'周');
                            }
                            return row.loan_period;
                        });
                    }
                    this.$nextTick(()=>{
                        this.init_chart();
                    })
                }).catch(err=>{
                    console.log(err)
                })
            }
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

