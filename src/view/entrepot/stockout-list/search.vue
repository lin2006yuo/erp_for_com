<template>
    <div class="p-search-member">
        <search-card @search="search" :params="searchData" :clears="clears">
            <label-item label="仓库：">
                <el-select class="width-sm" v-model="searchData.warehouse_id" filterable placeholder="请选择/输入...">
                    <el-option v-for="(item,index) in warehouseList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="开发员：" class="ml-sm">
                <param-account
                        class="width-sm"
                        v-model="searchData.developer_id"
                        v-sf.developer_id
                        :fixResult="development_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/development/staffs">
                </param-account>
            </label-item>
            <label-item label="采购员：" class="ml-sm">
                <purchaser v-sf.purchase_user_id v-model="searchData.purchaser_id" class="s-width-small"></purchaser>
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
    import {api_warehouses} from '@/api/global';

    export default {
        data() {
            return {
                warehouseList: [],
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
                    goodsStatus: 0,
                    page: 1,
                    pageSize: 50,
                },
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehouses).then(res => {
                    this.warehouseList = res;
                    this.searchData.warehouse_id = this.warehouseList[0].value;
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
            selectButtons(val) {
                this.searchData.goodsStatus = val;
                this.$emit("search");
            },
            change_label() {
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
            labelButtons: require('@/components/label-buttons').default
        }
    }
</script>
