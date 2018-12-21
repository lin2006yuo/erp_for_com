<template>
    <page class="p-picking-sku">
        <label-item label="仓库：">
            <el-select v-model="warehouse_id" class="width-sm" @change="warehouse_change">
                <el-option
                        v-for="warehouse in warehouseList"
                        :label="warehouse.label"
                        :value="warehouse.value"
                        :key="warehouse.value"
                ></el-option>
            </el-select>
        </label-item>
        <search-card :params="searchData" @search="search" :clears="clears" class="mt-xs">
            <el-select class="inline width-mini"
                       v-model="searchData.snType">
                <el-option v-for="item in typeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <el-input v-if="searchData.snType === 'spu'"
                      v-model="searchData.snText"
                      @enter.native="search"
                      class="inline width-super"
                      placeholder="请输入商品名称"></el-input>
            <order-input v-else
                         v-model="searchData.snText"
                         class="inline width-super"
                         v-sf.snText
                         @keydown="search">
            </order-input>
            <select-more-button label="包裹类型："
                                class="inline ml-sm mr-sm"
                                :button-list="packageList"
                                @query="query_type">
            </select-more-button>
        </search-card>
        <table-module :table-data="tableData"
                      class="mt-sm"
                      :search-data="searchData"
                      :loading="loading"
                      :total="total"
                      @sort-change="sort_change"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change">
        </table-module>
    </page>
</template>

<style lang="stylus">
    .p-picking-sku {
        .el-card {
            overflow: visible;
            .width-super.el-input {
                width: 200px
            }
        }
    }
</style>

<script>
    import {api_wait_picking_sku} from "@/api/pickings";
    import {api_warehouses} from '@/api/global';
    import {api_get_packages} from "@/api/generate-order";

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '邓海波',
                createTime: '2018-8-16',
                updateTime: '2018-8-22'
            }
        },
        refresh() {
            this.search();
        },
        data() {
            return {
                warehouse_id: 2,
                loading: false,
                searchData: {
                    snType: 'sku',
                    snText: '',
                    type: '',
                    page: 1,
                    pageSize: 50,
                },
                total: 0,
                clears: {
                    snType: 'sku',
                    page: 1,
                    pageSize: 50,
                },
                warehouseList: [],
                typeList: [
                    {
                        label: 'SKU',
                        value: 'sku',
                    },
                    {
                        label: 'SPU',
                        value: 'spu',
                    },

                    {
                        label: '别名',
                        value: 'sku_alias',
                    }
                ],
                packageList: [],
                tableData: [],
                sort_field: '',
                sort_type: '',
            }
        },
        created() {
            this.init_warehouse();
            this.init_packageList();
        },
        mounted() {
            this.search();
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehouses).then(res => {
                    this.warehouseList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                })
            },
            init_packageList() {
                this.$http(api_get_packages).then(res => {
                    this.packageList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            query_type(types) {
                console.log(`xxxxxx:}`)
                this.searchData.type = types.map(row => {
                    return row.value;
                });
                this.search();
            },
            search() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_wait_picking_sku, data).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    this.loading = false;
                })
            },
            get_params: function () {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let searchData = clone(this.searchData);

                if (searchData.snType !== 'spu') {
                    searchData.snText = searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                }

                this.sort_field && (searchData.sort_field = this.sort_field);
                this.sort_type && (searchData.sort_type = this.sort_type);

                return Object.assign({}, searchData, {warehouse_id: this.warehouse_id});
            },
            warehouse_change() {
                this.search();
            },
            sort_change(column) {
                console.log('sort', column);
                if (column.column instanceof Object) {
                    let sort_label = column.column.label;
                    switch (sort_label) {
                        case "待生成数量":
                            this.sort_field = "quantity";
                            break;
                    }
                    this.sort_type = column.order === "descending" ? "desc" : "asc";
                    this.search();
                }
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.search();
            }
        },
        components: {
            warehouse: require('@/api-components/warehouse.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
            selectMoreButton: require('@/components/select-more-button.vue').default,
        }
    }
</script>
