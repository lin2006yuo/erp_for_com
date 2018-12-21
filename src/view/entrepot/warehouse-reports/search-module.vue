<template>
    <div class="p-sorting-statistics">
        <search-card :params="searchData" :clears="clears" @search="search">
            <label-buttons
                label=""
                :buttons="buttons"
                @select="selectButtons">
            </label-buttons>
            <label-item label="操作人：" v-if="!isWarehouse">
                <param-account
                    class="width-sm"
                    v-model="searchData.operator_id"
                    :param="{data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="warehouseUser"
                    placeholder="请选择/输入..."
                    url="get|user/warehouse/staffs">
                </param-account>
            </label-item>
            <label-item label="仓库：" :class="{'ml-sm':!isWarehouse}">
                <el-select class="width-sm"
                           v-model="searchData.warehouse_id"
                           clearable
                           filterable placeholder="请选择/输入...">
                    <el-option v-for="(item,index) in warehouseList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label class="inline ml-sm">操作日期：</label>
            <el-date-picker
                v-model="searchData.date_from"
                :type="searchData.dateType"
                placeholder="选择日期"
                class="inline date"
                v-sf.date_from
                :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                v-model="searchData.date_to"
                :type="searchData.dateType"
                placeholder="选择日期"
                class="inline date"
                v-sf.date_to
                :picker-options="inputTimeEnd">
            </el-date-picker>
            <el-radio-group v-model="dateRange" class="ml-sm mr-sm">
                <el-radio-button v-for="(item, index) in dateList"
                                 :key="index"
                                 :label="item.label"
                                 @click.native="changeRange(item)">
                </el-radio-button>
            </el-radio-group>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-sorting-statistics{
        .el-radio-button__inner:hover{
            background-color:rgba(230, 230, 230, 1) !important;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner{
            border-color: #C0CCDA !important;
        }
        .el-radio-button__inner{
            padding: 6px 12px;
        }
    }
</style>
<script>
    import {api_warehouses} from '../../../api/global';
    export default {
        data() {
            return {
                searchData:{
                    type:'',
                    group_type:1,
                    operator_id:'',
                    warehouse_id:'',
                    date_from:'',
                    date_to:'',
                    dateType:'date',
                    page:1,
                    pageSize:20
                },
                clears:{
                    group_type:1,
                    dateType:'date',
                    page:1,
                    pageSize:20
                },
                dateRange:1,
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_to){
                            return time.getTime() > this.searchData.date_to || time.getTime() >= Date.now() - 24*60*60*1000;
                        }else {
                            return time.getTime() > Date.now() - 24*60*60*1000;
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_from){
                            return time.getTime() < this.searchData.date_from || time.getTime() > Date.now() - 24*60*60*1000;
                        }else {
                            return time.getTime() > Date.now() - 24*60*60*1000;
                        }
                    }
                },//结束时间
                warehouseList:[],
                dayList:[
                    {label:'昨天', value:1},
                    {label:'7天内', value:2},
                    {label:'30天内', value:3},
                    {label:'90天内', value:4}
                ],
                monthList:[
                    {label:'上个月', value:1},
                    {label:'上两个月', value:2},
                    {label:'上六个月', value:3},
                    {label:'上一年', value:4},
                ],
                buttons:[]
            }
        },
        mounted(){
            this.init_warehouse();
            if(this.use==='unpacking'){
                this.buttons=[
                    {label:`入库统计日报表`,value:1},
                    {label:`入库统计月报表`,value:2},
                    {label:`仓库入库统计日报表`,value:3},
                    {label:`仓库入库统计月报表`,value:4}
                ]
            }else {
                this.buttons = [
                    {label:`${this.use}入库统计日报表`,value:1},
                    {label:`${this.use}入库统计月报表`,value:2},
                    {label:`仓库${this.use}仓库入库统计日报表`,value:3},
                    {label:`仓库${this.use}仓库入库统计月报表`,value:4}
                ];
            }
        },
        methods: {
            init_warehouse(){
                this.$http(api_warehouses).then(res=>{
                    this.warehouseList = res;
                    // this.searchData.warehouse_id = this.warehouseList[0].value;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            selectButtons(index, item){
                this.searchData.group_type = item.value;
                this.clears.group_type = item.value;
                this.searchData.date_from = '';
                this.searchData.date_to = '';
                if(this.isMonth){
                    this.searchData.dateType = 'month';
                    this.clears.dateType = 'month';
                } else {
                    this.searchData.dateType = 'date';
                    this.clears.dateType = 'date';
                }
                this.$emit('search', this.searchData);
            },
            search(){
                this.$emit('search', this.searchData);
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            //num： 上几个月
            //flag：起始日期true,结束日期false
            getDay(flag, num){
                let date = new Date();
                if(flag){
                    //把日期设置为上num月
                    date.setMonth(date.getMonth() - num);
                    //把日期设置为上num月第一天
                    date.setDate(1);
                } else {
                    //获取上个月最后一天
                    date.setDate(0);
                }
                return date;
            },
            changeRange(item){
                if(this.isMonth){
                    switch (item.value){
                        case 1:
                            this.searchData.date_from = this.getDay(true, 1);
                            this.searchData.date_to = this.getDay(false);
                            break;
                        case 2:
                            this.searchData.date_from = this.getDay(true, 2);
                            this.searchData.date_to = this.getDay(false);
                            break;
                        case 3:
                            this.searchData.date_from = this.getDay(true, 6);
                            this.searchData.date_to = this.getDay(false);
                            break;
                        case 4:
                            let lastyearbegin = new Date();
                            lastyearbegin.setFullYear(lastyearbegin.getFullYear()-1);
                            lastyearbegin.setMonth(0);
                            lastyearbegin.setDate(1);
                            console.log(datef('YYYY-MM-dd', lastyearbegin/1000));
                            this.searchData.date_from = lastyearbegin;
                            let lastyearend = new Date();
                            lastyearend.setFullYear(lastyearend.getFullYear()-1);
                            lastyearend.setMonth(10);
                            lastyearend.setDate(0);
                            lastyearend.setMonth(11);
                            console.log(datef('YYYY-MM-dd', lastyearend/1000));
                            this.searchData.date_to = lastyearend;
                            break;
                    }
                } else {
                    switch (item.value){
                        case 1:
                            this.searchData.date_from = (Date.now()-(24*60*60*1000));
                            this.searchData.date_to = (Date.now()-(24*60*60*1000));
                            break;
                        case 2:
                            this.searchData.date_from = (Date.now()-(7*24*60*60*1000));
                            this.searchData.date_to = Date.now() - 24*60*60*1000;
                            break;
                        case 3:
                            this.searchData.date_from = Date.now()-(30*24*60*60*1000);
                            this.searchData.date_to = Date.now() - 24*60*60*1000;
                            break;
                        case 4:
                            this.searchData.date_from = Date.now()-(90*24*60*60*1000);
                            this.searchData.date_to = Date.now() - 24*60*60*1000;
                            break;
                    }
                }
            },
        },
        computed:{
            isMonth(){
                return this.searchData.group_type === 2 || this.searchData.group_type === 4;
            },
            isWarehouse(){
                return this.searchData.group_type === 3 || this.searchData.group_type === 4;
            },
            dateList(){
                if(this.isMonth){
                    return this.monthList;
                } else {
                    return this.dayList;
                }
            }
        },
        watch: {},
        props: {
            //用途
            use:{
                require:true
            }
        },
        components: {
            labelButtons:require('../../../components/label-buttons').default,
            searchCard:require('../../../components/search-card').default,
            labelItem:require('../../../components/label-item').default,
            paramAccount:require('../../../api-components/param-account').default,
        }
    }
</script>
