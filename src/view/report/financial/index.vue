<template>
    <page>
        <el-card>
            <label-item label="日期：">
                <ui-date-picker
                        v-model="ymd"
                        type="date"
                        align="right"
                        placeholder="选择日期范围"
                        :format="format"
                        :picker-options="pickerOptions">
                </ui-date-picker>
            </label-item>
            <label-item label="平台：">
                <el-select v-model="platform">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option v-for="platform in platforms"
                               :label="platform.label"
                               :value="platform.value"
                               :key="item.value"
                    >
                    </el-option>
                </el-select>
            </label-item>
            <el-button type="primary" @click.native="search">查询</el-button>
        </el-card>
        <chart-table>
            <el-table slot="table" :data="lists"
                      v-loading="loading"
                      empty-text="当前查询内容为空"
                      v-resize="{height:65}"
                      :default-sort = "{prop: 'amount_increase_rank', order: 'descending'}"
            >
                <el-table-column label="销售员" property="realname">
                </el-table-column>
                <el-table-column label="组长" property="name">
                </el-table-column>
                <el-table-column label="目标销售额" property="target_amount">
                </el-table-column>
                <el-table-column label="销售额" sortable property="sum_amount">
                </el-table-column>
                <el-table-column label="销售额增长" property="amount_increase">
                </el-table-column>
                <el-table-column label="增长排名" sortable property="amount_increase_rank">
                </el-table-column>
                <el-table-column label="销售额增长率(%)" property="amount_increase_rate">
                </el-table-column>
                <el-table-column label="增长率排名" property="amount_increase_rate_rank">
                </el-table-column>
                <el-table-column label="销售额综合排名" sortable property="overall_rank">
                </el-table-column>
                <el-table-column label="最终排名" sortable property="rank">
                </el-table-column>
            </el-table>
            <div slot="chart">chart</div>
        </chart-table>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    import http from '../../../lib/http';
    export default{
        page:{},
        refresh(){
          this.ymd = '';
          this.platform = 0;
          this.init();
        },
        data(){
            return{
                loading:false,
                ymd:'',
                platform:0,
                platforms:[],
                pickerOptions:{
                    shortcuts: [{
                        text: '最近10天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', start);
                            console.log(picker);
                        }
                    }, {
                        text: '最近20天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                lists:[]
            }
        },
        mounted(){
            this.init_platforms();
        },
        methods:{
            init_platforms(){
                this.$http(http('GET',config.apiHost+"channel-categories")).then(res=>{
                    this.platforms = res.map(row=>{
                        return {
                            label:row.title,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            format(val){
                let date = new Date(val);
                if(date instanceof Date && date.getFullYear()){
                    let Ten = "";
                    let day = date.getDate();
                    if(day >= 21){
                        Ten = '下';
                    }else if(day >= 11){
                        Ten = '中';
                    }else{
                        Ten = '上'
                    }
                    return `${date.getFullYear()}年-${date.getMonth()+1}月-${Ten}旬`;
                }
                return val;
            },
            search(){
                let date2time = (date)=>{
                    date = new Date(date);
                    let year = date.getFullYear();
                    if(year){
                        return `${year}-${date.getMonth()+1}-${date.getDate()}`;
                    }else{
                        return false;
                    }

                } ;
                let yml = date2time(this.ymd);
                if(!yml){
                    this.$message({
                        type:'error',
                        message:'请选择查询日期'
                    });
                    return;
                }
                let params = {
                    ymd:yml,
                    channel_id:this.platform
                };
                let url = 'http://www.erp-rondaful.com/report/Financial/ten_sort';
                this.loading=true;
                this.$http(http('GET',url,params)).then(res=>{
                    this.lists = res.data;
                    this.loading = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                    this.loading = false;
                })
            }
        },
        components:{
            labelItem:require('../../../components/label-item.vue').default,
            UiDatePicker:require('../../../components/ui-date-picker'),
            chartTable:require('../../../components/chart-table.vue').default,
        }
    }
</script>
