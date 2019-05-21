<template>
    <div class="p-search-member">
        <search-card @search="search" :params="searchData" :clears="clears">
            <el-row>
                <label class="inline ml-sm" title="请选择仓库"> 仓库：</label>
                <super-select class="inline s-width-default"
                              v-sf.warehouse_id
                              v-model="searchData.warehouse_id"
                              filterable clearable
                              storageKey="virtual_store"
                              :options="warehouseList">
                </super-select>
                <label-item label="开发员：" class="ml-sm">
                    <super-select v-model="searchData.developer_id"
                                  class="inline s-width-default"
                                  v-sf.developer_id
                                  storageKey="virtual_develop"
                                  :options="developList">
                    </super-select>
                </label-item>
                <label-item label="采购员：" class="ml-sm">
                    <super-select  v-model="searchData.purchaser_id"
                                   class="inline s-width-default"
                                   v-sf.purchaser_id
                                   storageKey="virtual_staffs"
                                   :options="staffsList">
                    </super-select>
                </label-item>
                <label-item label="供应链专员：" class="ml-sm">
                    <super-select  v-model="searchData.supply_chain_specialist_id"
                                   class="inline s-width-default"
                                   v-sf.supply_chain_specialist_id
                                   storageKey="supply_chain_specialist"
                                   :options="supplyChainSpecialist">
                    </super-select>
                </label-item>
                <el-select v-sf.snType v-model="searchData.snType"
                           class="inline ml-sm s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <order-input v-model="searchData.snText"
                             class="inline s-width-large"
                             v-sf.snText
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>

                <label-item label="商品状态：" class="ml-sm">
                    <el-select class="width-sm" v-model="searchData.goodsStatus" filterable placeholder="请选择/输入...">
                        <el-option v-for="(item,index) in statusList"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label class="inline ml-sm" title="请选择平台"> 平台：</label>
                <super-select class="inline s-width-default"
                              v-sf.channel_id
                              v-model="searchData.channel_id"
                              filterable clearable
                              storageKey="virtual_platform"
                              :options="channelList">
                </super-select>
                <label-item  label="缺货数量：" class="ml-sm">
                    <integer-zero-input
                        type="number"
                        clearable
                        placeholder="缺货最小值"
                        :min="0"
                        @blur="start_blur"
                        v-model="searchData.lack_qty_min"
                        class="s-width-small ml-xs">
                    </integer-zero-input>
                    <span>&nbsp;~</span>
                    <integer-zero-input
                        clearable
                        type="number"
                        :min="Number(searchData.lack_qty_min) || 0"
                        placeholder="缺货最大值"
                        @blur="end_blur"
                        v-model="searchData.lack_qty_max"
                        class="s-width-small ml-xs">
                    </integer-zero-input>
                </label-item>
            </el-row>
            <el-row class="mt-xs"></el-row>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-search-member {
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_warehouses,api_get_channel_categories} from '@/api/global';
    import {api_get_publish} from '@/api/procurement-plan';
    import {
        api_developer,
        api_stock_lack_get_supply_chain_specialist
    } from "@/api/developer-correspondence-matrix.js"
    export default {
        data() {
            return {
                staffsList: [],
                supplyChainSpecialist:[],
                developList: [],
                warehouseList: [],
                url_developer:config.apiHost+'user/development/staffs',
                url_purchaser:config.apiHost+'user/purchase/staffs',
                statusList: [
                    {label: '全部', value: 0},
                    {label: '在售', value: 1},
                    {label: '停售', value: 2},
                    {label: '待发布', value: 3},
                    {label: '卖完下架', value: 4},
                    {label: '缺货', value: 5}
                ],
                selectList: [
                    {label: 'SKU', value: 'sku'},
                    {label: 'SPU', value: 'spu'},
                    {label: '别名', value: 'alias'},
                ],
                clears: {
                    snType: "sku",
                    channel_id:'',
                    goodsStatus: 0,
                    page: 1,
                    pageSize: 50,
                },
                channelList:[]
            }
        },
        mounted() {
            this.get_channel();
            this.init_warehouse();
            this.get_packing_staffs();
            this.get_packing_develop();
            this.get_supply_chain_specia_list();
        },
        methods: {
            end_blur() { //失去焦点时最大值如果小于最小值默认等于最小值
                if(this.searchData.lack_qty_max && this.searchData.lack_qty_min && (Number(this.searchData.lack_qty_max) < Number(this.searchData.lack_qty_min))) {
                     this.searchData.lack_qty_max = this.searchData.lack_qty_min
                }
            },
            start_blur() {
                this.end_blur();
            },
            get_supply_chain_specia_list(){
                this.$http(api_stock_lack_get_supply_chain_specialist).then(res=>{
                    this.supplyChainSpecialist = res.map(row=>({label:row.realname,value:row.id}));
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_packing_develop() {//开发人
                this.$http(api_developer).then(res=>{
                    this.developList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_packing_staffs() {//采购员
                this.$http(api_get_publish).then(res=>{
                    this.staffsList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:'realname',
                    content:keyword,
                };
            },
            init_warehouse() {
                this.$http(api_warehouses).then(res => {
                    this.warehouseList = [{label: '全部', value: ''}, ...res];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            /*平台*/
            get_channel() {
                this.$http(api_get_channel_categories).then(res => {
                    this.channelList = [{label: '全部', value: ''}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            selectButtons(val) {
                this.searchData.goodsStatus = val;
                this.$emit("search");
            },
            change_label() {
            },
            change_channel(val) {
            },
            search() {
                this.$emit("search");
            },
            clear() {
                this.$emit("clear");
            },
        },
        props: {
            searchData: {
                required: true,
                type: Object
            }
        },
        components: {
            paramAccount: require('@/api-components/param-account.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item').default,
            selectButtons: require('@/components/select-buttons').default,
            orderInput: require('@/components/order-input').default,
            purchaser: require('@/api-components/purchaser.vue').default,
            dropDownLoad:require('./drop-down-load.vue').default,
            scroll:require('../../../components/scroll.vue').default,
            labelButtons: require('@/components/label-buttons').default,
            integerZeroInput:require('@/components/integer-zero-input').default,
        }
    }
</script>
