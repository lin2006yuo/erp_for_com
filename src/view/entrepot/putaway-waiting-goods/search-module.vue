<template>
    <div>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id"
                           @change="change_depot"
                           class="inline s-width-default">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData"
                     @search="search"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                    label="类型："
                    class="inline"
                    @select="change_type"
                    :buttons="typeList">
                </label-buttons>
                <label-buttons
                        label="状态："
                        class="inline"
                        ref="status"
                        @select="change_status"
                        :buttons="statusList">
                </label-buttons>
            </div>
            <div class="mb-mini">

                <label-item label="批次：">
                    <el-input v-model="searchData.batch_id"
                              @keyup.native.enter="search"
                              placeholder="请输入批次"
                              v-sf.batch_id>
                    </el-input>
                </label-item>
                <label-item label="采购单id：" class="ml-sm">
                    <el-input v-model="searchData.purchase_order_id"
                              placeholder="请输入采购单id"
                              @keyup.native.enter="search"
                              v-sf.purchase_order_code>
                    </el-input>
                </label-item>
                <label-item label="" class="inline">
                    <el-select v-sf.snType v-model="searchData.snType" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in snTypeList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="" class="inline">
                    <order-input v-sf.snText
                                 v-model="searchData.snText"
                                 class="inline width-super pt-sm"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                </label-item>
                <label-item label="货位：">
                    <el-input v-model="searchData.warehouse_cargo_code"
                              placeholder="请输入货位"
                              @keyup.native.enter="search"
                              v-sf.warehouse_cargo_code>
                    </el-input>
                </label-item>
            </div>
            <el-select v-model="searchData.operator_type" class="width-xs inline" v-sf.operator_type>
                <el-option v-for="(item, index) in peopleList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <param-account
                v-model="searchData.operator_id"
                class="s-width-default"
                :param="{data:{content:''}}"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                type="warehouseUser"
                placeholder="请选择/输入..."
                url="get|user/warehouse/staffs">
            </param-account>
            <el-select v-model="searchData.operator_time" class="ml-sm width-xs inline" v-sf.operator_time>
                <el-option v-for="(item, index) in timeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker
                    v-model="searchData.operator_time_from"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.operator_time_from
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.operator_time_to"
                    type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm"
                    v-sf.operator_time_to
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus" scoped>
    .el-card {
        overflow: inherit;
    }
</style>
<script>
    import {entrepot_picking, api_get_status, api_get_areatype} from '../../../api/putaway-waiting-goods'
    export default {
        data(){
            return {
                warehouse_id:2,
                searchData:{
                    batch_id:'',
                    purchase_order_code:'',
                    user_id:'',
                    status:0,
                    snType:'sku',
                    snText: '',
                    warehouse_area_type:11,
                    warehouse_cargo_code:'',
                    operator_type:1,
                    operator_id:'',
                    operator_time:1,
                    operator_time_from:'',
                    operator_time_to:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    status:0,
                    snType:'sku',
                    warehouse_area_type:11,
                    operator_type:1,
                    operator_time:1,
                    page:1,
                    pageSize:20
                },
                warehouses: [],
                statusList:[],
                typeList:[],
                clone_statusList:[],
                snTypeList: [
                    {label: 'SKU', value: 'sku'},
                    {label: 'SKU别名', value: 'sku_alias'}
                ],
                peopleList:[
                    {label:'创建人',value:1},
                    {label:'更新人',value:2}
                ],
                timeList:[
                    {label:'创建时间',value:1},
                    {label:'更新时间',value:2}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.operator_time_to){
                            return time.getTime() > this.searchData.operator_time_to;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.operator_time_from){
                            return time.getTime() < this.searchData.operator_time_from;
                        }else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted(){
            this.init_warehouse();
            this.init_statusList();
            this.init_typeList();
        },
        methods: {
            init_status_btn(){
                let cur = this.statusList;
                let cur2 = this.typeList;
                this.statusList = [];
                this.typeList = [];
                this.$nextTick(()=>{
                    this.statusList = cur;
                    this.typeList = cur2;
                })
            },
            init(){
                Object.keys(this.searchData).forEach(key=>{
                    if(typeof this.searchData[key] === 'string'){
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let searchData = window.clone(this.searchData);
                if (searchData.snText) {// 批量搜索条件数组化
                    let cur = searchData.snText.split('\n').filter(row => !!row);
                    searchData.snText = cur.map(row => {
                        return row.trim();
                    });
                } else {
                    searchData.snText = [];
                }
                Object.assign(searchData, {warehouse_id: this.warehouse_id});
                this.$emit('init-data', searchData);
            },
            init_warehouse(){
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_statusList(){
                this.$http(api_get_status).then(res => {
                    this.statusList = res;
                    this.clone_statusList = res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                });
            },
            init_typeList(){
                this.$http(api_get_areatype).then(res => {
                    this.typeList = res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                });
            },
            change_depot(){
                this.init();
            },
            change_status(select, item){
                this.searchData.status = item.value;
                this.init();
            },
            change_type(select, item){
                if(item.value !== 11){
                    let arr = [];
                    arr.push(this.clone_statusList[2]);
                    this.searchData.status = 2;
                    this.statusList = arr;
                } else {
                    this.searchData.status = 0;
                    this.statusList = this.clone_statusList;
                }
                this.$refs.status.buttonClick(0, this.$refs.status.realButtons[0]);
                this.searchData.warehouse_area_type = item.value;
                this.init();
            },
            search(){
                this.init();
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            labelButtons:require('../../../components/label-buttons.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            paramAccount:require('../../../api-components/param-account').default
        },
    }
</script>
