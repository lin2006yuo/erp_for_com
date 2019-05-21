<template>
    <div>
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
                        class="inline ml-sm"
                        ref="status"
                        @select="$listeners['change-status']"
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
                <label-item label="" class="inline ml-sm">
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
                <label-item label="货位：" class="ml-sm">
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
            <super-select v-model="searchData.operator_id"
                          class="s-width-default inline"
                          :options="staffsList"
                          storageKey="warehouseStaffs"></super-select>
            <!--<param-account-->
                <!--v-model="searchData.operator_id"-->
                <!--class="s-width-default"-->
                <!--:param="{data:{content:''}}"-->
                <!--:fixUrl="true"-->
                <!--:fixResult="sale_fix_result"-->
                <!--type="warehouseUser"-->
                <!--placeholder="请选择/输入..."-->
                <!--url="get|user/warehouse/staffs">-->
            <!--</param-account>-->
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
    import {api_get_staffs_list} from '@/api/warehouse-cargo';
    import {entrepot_picking, api_get_status, api_get_areatype} from '../../../api/putaway-waiting-goods';
    export default {
        data(){
            return {
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
                staffsList: []
            }
        },
        mounted(){
            this.init_statusList();
            this.init_typeList();
            this.get_staffs()
        },
        methods: {
            get_staffs(){
                this.$http(api_get_staffs_list).then(res => {
                    this.staffsList = res.map(row => {
                        return {
                            value: row.id,
                            label: row.realname
                        }
                    })
                })
            },
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
                if(!this.$parent.firstLoading){
                    this.search();
                }
            },
            search(){
               this.$emit('search')
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
        props: {
            searchData: {},
            clears: {}
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            scrollSelect:require('@/components/scroll-select.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            paramAccount:require('@/api-components/param-account').default
        },
    }
</script>
