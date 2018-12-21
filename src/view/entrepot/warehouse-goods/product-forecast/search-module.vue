<template>
    <div class="c-search-module">
        <div>
            <label-item label="预报系统：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_type" @change="change_warehouse" filterable clearable class="inline width-xs">
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
            <!-- sku/商品名称 -->
            <label-item label="" class="inline">
                <el-select v-sf.snType v-model="searchData.snType" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in typeList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="" class="inline">
                <order-input v-sf.snText
                             ref="batchInput"
                             v-model="searchData.snText"
                             class="inline width-super pt-sm"
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行...">
                </order-input>
            </label-item>
            <label-item label="预报状态：" class="inline ml-sm">
                <el-select v-sf.can_allot v-model="searchData.status" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in statusList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="关联映射：" class="inline ml-sm">
                <el-select v-sf.can_allot v-model="searchData.is_relate" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in relateList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="创建时间：" class="ml-sm mr-sm">
                <el-date-picker
                        v-model="searchData.data_from"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.create_time_from
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.data_to"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.create_time_to
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-search-module {
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_warehous_third_type} from '../../../../api/entrepot-picking.js';
    import {api_forecast_status} from '@/api/warehouse-goods-forecast.js';
    export default {
        data() {
            return {
                warehouse_type: 1,
                searchData: {
                    snType: 'sku',
                    snText: '',
                    status: -1,
                    data_from: '',
                    data_to: '',
                    is_relate: '0',
                },
                clears: {
                    status: -1,
                    is_relate: '0',
                    snType: 'sku'
                },
                cleared: false,
                warehouses: [],
                statusList: [],
                typeList: [
                    {label: 'SKU', value: 'sku'},
                    {label: '商品名称', value: 'goods_name'},
                ],
                relateList: [
                    {label: '全部', value: '0'},
                    {label: '已关联', value: '1'},
                    {label: '未关联', value: '2'},
                ],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.data_to) {
                            return time.getTime() > this.searchData.data_to;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.data_from) {
                            return time.getTime() < this.searchData.data_from;
                        } else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        refresh() {
            this.init();
        },
        mounted() {
            this.init();
        },
        methods: {
            init_status_btn() {
                this.cleared = true;
                let cur2 = this.statusList;
                this.statusList = [];
                this.$nextTick(() => {
                    this.statusList = cur2;
                })
            },
            async init() {
                let item = await this.init_warehouse();
                this.init_status();
                this.search();
            },
            async init_warehouse() {//获取仓库列表
                try {
                    let res = await this.$http(api_warehous_third_type);
                    this.warehouses = res;
                    this.warehouse_type = this.warehouses[0].value;
                } catch (code) {
                    this.$message({type: "error", message: code.message || code});
                }
            },
            init_status() {
                this.$http(api_forecast_status).then(res => {
                    this.statusList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            search() {
                let searchData = this.generate_params();
                this.$emit('search', searchData);
            },
            generate_params() {//生成查询条件
                if (this.cleared) {// 清空条件后，分页信息默认
                    this.$emit('clear');
                    this.cleared = false;
                }

                let params = window.clone(this.searchData);
                Object.assign(params, {warehouse_type: this.warehouse_type});

                if (params.snText) {// 批量搜索条件数组化
                    params.snText = params.snText.split('\n').filter(row => !!row).map(row => row.trim());
                } else {
                    params.snText = [];
                }
                Object.keys(params).forEach(key => {
                    if(typeof params[key] === 'string') {
                        params[key] === params[key].trim();
                    }
                });
                return params;
            },
            change_warehouse(val) {
                this.warehouse_type = val;
                this.$emit('warehouse-change', this.generate_params());
            }
        },
        watch: {
            warehouse_type(val) { // 利用v-model绑定仓库类型值
                this.$emit('input', val);
            }
        },
        props: {
            value: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            orderInput: require("@/components/order-input.vue").default,
        },
    }
</script>
