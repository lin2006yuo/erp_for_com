<template>
    <div class="p-sorting-statistics">
        <search-card :params="searchData" :clears="clears" @search="search">
            <label-buttons
                label=""
                :buttons="buttons"
                @select="selectButtons">
            </label-buttons>
            <label-item label="操作人："  v-if="!isWarehouse">
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
                <el-select class="width-sm" v-model="searchData.warehouse_id" filterable placeholder="请选择/输入...">
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
                                 :label="item.value">
                    {{item.label}}
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
    import {api_warehouses} from '../../../../api/global';
    export default {
        data() {
            return {
                searchData: {
                    type: 1,
                    group_type:1,
                    operator_id: '',
                    warehouse_id: '',
                    date_from: '',
                    date_to: '',
                    dateType: 'date',
                    page:1,
                    pageSize:20
                },
                clears: {
                    type: 1,
                    group_type:1,
                    dateType: 'date',
                    page:1,
                    pageSize:20
                },
                dateRange: 0,
                inputTimeStart: {
                    disabledDate: (time) => {
                        return time.getTime() > this.getDateDate(1,1);
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        return time.getTime() > this.getDateDate(1,1) || time.getTime() < this.searchData.date_from;
                    }
                },//结束时间
                warehouseList:[],
                dateList: [
                    {label: '昨天', value: 1},
                    {label: '7天内', value: 2},
                    {label: '30天内', value: 3},
                    {label: '90天内', value: 4}
                ],
                isMonth:'',
                buttons:[],
                group_type_old:1
            }
        },
        mounted(){
            this.init_warehouse();
            this.buttons = [
                {label:`${this.use}统计日报表`,value:1},
                {label:`${this.use}统计月报表`,value:2},
                {label:`仓库${this.use}统计日报表`,value:3},
                {label:`仓库${this.use}统计月报表`,value:4}
            ];
        },
        methods:{
            init_warehouse(){
                this.$http(api_warehouses).then(res=>{
                    this.warehouseList = res;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            selectButtons(index, item){
                this.group_type_old = item.value;
                this.searchData.group_type = item.value;
                this.clears.group_type = item.value;
                this.searchData.date_from = '';
                this.searchData.date_to = '';
                this.$emit('search', this.searchData);
            },
            search(){
                this.$emit('search', this.searchData);
            },
            sale_fix_result(res){
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            //月份按钮时间获取:获取上1个月-上6个月，或上一年的开始和结束时间
            getMonthDate(n,start){
                let nowDate = new Date();
                if(start === 0){//start===0 => 获取开始
                    if(n===12){//n===12 => 获取上一年的时间
                        let nowYear = nowDate.getFullYear();
                        nowYear += nowDate.getFullYear()<2000 ? 1900 : 0;
                        return new Date(new Date(nowYear-1,0).getTime());
                    }else{//获取上n个月的时间
                        return new Date(new Date(nowDate.getFullYear(),nowDate.getMonth()-n).getTime());
                    }
                }else{//获取结束时间
                    if(n===12){//n===12 => 获取上一年的时间
                        let nowYear = nowDate.getFullYear();
                        nowYear += nowDate.getFullYear()<2000 ? 1900 : 0;
                        return new Date(new Date(nowYear,0).getTime()-1);
                    }else{//获取上n个月的时间
                        return new Date(new Date(nowDate.getFullYear(),nowDate.getMonth()-n+1).getTime()-1);
                    }
                }
            },
            //天数按钮时间获取：获取n天前的开始或结束时间
            getDateDate(n,start){
                let nowDate = new Date();
                if(start === 0){//获取开始时间
                    return new Date(new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate()-n-1,24,0,0));
                }else{//获取结束时间
                    return new Date(new Date(new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate()-n,24,0,0)).getTime()-1);
                }
            }
        },
        computed: {
            isWarehouse(){
                return this.searchData.group_type === 3 || this.searchData.group_type === 4;
            }
        },
        watch: {
            'searchData.group_type':function(val,old){
                if(this.group_type_old != val){
                    this.isMonth = false;
                    let btnArr = this.buttons;
                    this.buttons = [];
                    this.$nextTick(()=>{
                        this.buttons = btnArr;
                    });
                    this.$emit('search',this.searchData);
                }
                switch (val){
                    case 1:
                        this.isMonth = false;
                        this.searchData.dateType = 'date';
                        break;
                    case 2:
                        this.isMonth = true;
                        this.searchData.dateType = 'month';
                        break;
                    case 3:
                        this.isMonth = false;
                        this.searchData.dateType = 'date';
                        break;
                    case 4:
                        this.isMonth = true;
                        this.searchData.dateType = 'month';
                        break;
                }
            },
            'isMonth':function (val) {
                if(val){
                    this.dateList = [
                        {label: '上个月', value: 1},
                        {label: '上两个月', value: 2},
                        {label: '上六个月', value: 3},
                        {label: '上一年', value: 4},
                    ];
                }else{
                    this.dateList = [
                        {label: '昨天', value: 1},
                        {label: '7天内', value: 2},
                        {label: '30天内', value: 3},
                        {label: '90天内', value: 4}
                    ];
                }
            },
            //通过监听dateRange获取对应的startDate和endDate
            dateRange:function(val){
                if(this.isMonth){
                    switch (val){
                        case 1:
                            this.searchData.date_from = this.getMonthDate(1,0);
                            this.searchData.date_to = this.getMonthDate(1,1);
                            break;
                        case 2:
                            this.searchData.date_from = this.getMonthDate(2,0);
                            this.searchData.date_to = this.getMonthDate(1,1);
                            break;
                        case 3:
                            this.searchData.date_from = this.getMonthDate(6,0);
                            this.searchData.date_to = this.getMonthDate(1,1);
                            break;
                        case 4:
                            this.searchData.date_from = this.getMonthDate(12,0);
                            this.searchData.date_to = this.getMonthDate(12,1);
                            break;
                    }
                } else {
                    switch (val){
                        case 1:
                            this.searchData.date_from = this.getDateDate(1,0);
                            this.searchData.date_to = this.getDateDate(1,1);
                            break;
                        case 2:
                            this.searchData.date_from = this.getDateDate(7,0);
                            this.searchData.date_to = this.getDateDate(1,1);
                            break;
                        case 3:
                            this.searchData.date_from = this.getDateDate(30,0);
                            this.searchData.date_to = this.getDateDate(1,1);
                            break;
                        case 4:
                            this.searchData.date_from = this.getDateDate(90,0);
                            this.searchData.date_to = this.getDateDate(1,1);
                            break;
                    }
                }
            }
        },
        props: {
            //用途
            use: {
                require: true
            }
        },
        components: {
            labelButtons: require('../../../../components/label-buttons').default,
            searchCard: require('../../../../components/search-card').default,
            labelItem: require('../../../../components/label-item').default,
            paramAccount: require('../../../../api-components/param-account').default
        }
    }
</script>
