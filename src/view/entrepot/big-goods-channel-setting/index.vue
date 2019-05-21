<template>
    <page>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <super-select v-model="warehouse_id"
                              @change="change_warehouse"
                              class="inline s-width-default"
                              :options="warehouses"
                              storageKey="localTransitWarehouse"></super-select>
            </label-item>
        </div>
        <search-module :search-data="searchData"
                       :clears="clears"
                       @search="search"></search-module>
        <div class="mt-xs mb-xs">
            <permission tag="ElButton"
                        class="ml-sm inline"
                        type="primary"
                        size="mini"
                        @click="showDialog = true"
                        :route="apis.url_post_add_big_goods_channel">
                添加大货渠道
            </permission>
        </div>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @delete-item="delete_item"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <add-dialog v-model="showDialog" @add-channel="add_channel" :shipping-list="shippingList"></add-dialog>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {
        api_get_big_goods_list,
        api_delete_big_goods_channel,
        api_post_add_big_goods_channel,
        url_post_add_big_goods_channel
    } from '@/api/big-goods-channel-setting';
    import {
        api_get_shipping
    } from '@/api/common.js';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    export default {
        permission: {
            url_post_add_big_goods_channel
        },
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '蓝术术',
                createdTime: '2019-04-25',
                updateTime: '2019-04-25'
            }
        },
        data(){
            return{
                warehouse_id: '',
                searchData: {
                    carrier_name: '',
                    shipping_name: '',
                    page: 1,
                    pageSize: 50,
                },
                clears: {
                    page: 1,
                    pageSize: 50,
                },
                warehouses: [],//仓库列表
                checkData: [],//表格选中列表
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                showDialog: false,
                shippingList: []
            }
        },
        mounted(){
            this.get_warehouse();
        },
        methods:{
            init(){
                this.loading = true;
                let data = this.get_init_params();
                this.$http(api_get_big_goods_list, data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            get_shipping(warehouse_id) {
                if (!warehouse_id) return this.shippingList = [];
                this.$http(api_get_shipping, {warehouse_id: warehouse_id}).then(res => {
                    this.shippingList = [];
                    if (res.length <= 0) return;
                    let enableArr = res.filter(row => row.status === "1");
                    this.transform_tree(enableArr);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            transform_tree(res){
                let shippingList = {}, i = 0;
                res.forEach(row => {
                    if (shippingList.hasOwnProperty(row.carrier_id)) {
                        this.shippingList[shippingList[row.carrier_id]].children.push({
                            id: row.shipping_method_id,
                            label: row.shortname,
                        })
                    } else {
                        shippingList[row.carrier_id] = i++;
                        let shipping = {
                            label: row.carrier_name,
                            id: row.carrier_id,
                        };
                        this.$set(shipping, 'children', [
                            {
                                id: row.shipping_method_id,
                                label: row.shortname,
                            }
                        ]);
                        this.shippingList.push(shipping);
                    }
                });
            },
            //初始化搜索条件
            get_init_params(){
                let params = clone(this.searchData);
                if(typeof this.searchData.carrier_name === 'string') {
                    params.carrier_name = this.searchData.carrier_name.trim()
                }
                if (this.searchData.shipping_name) {
                    params.shipping_name = this.searchData.shipping_name.split('\n').filter(row => !!row).map(row => row.trim());
                }
                this.$set(params, 'warehouse_id', this.warehouse_id);
                return params;
            },
            search(){
                this.init();
            },
            change_warehouse(){
                this.init();
                this.get_shipping(this.warehouse_id)
            },
            add_channel(ids){
                let data = {
                    warehouse_id: this.warehouse_id,
                    shipping_ids: ids
                };
                this.$http(api_post_add_big_goods_channel, data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.showDialog = false;
                    this.init()
                }).catch(err => {
                    this.$message({type: 'error', message: err.message || err})
                })
            },
            delete_item(row){
                this.$confirm(`是否确认删除该大货渠道`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_delete_big_goods_channel, row.id).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.init()
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                })
            },
            //获取本地仓和中转仓列表
            get_warehouse() {
                let params = {
                    sign: 'local_transit'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.warehouse_id = this.warehouses[0].value
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change(val){

            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            labelItem: require('@/components/label-item').default,
            addDialog: require('./add-dialog').default
        }
    }
</script>