<template>
    <div>
        <label-item label="货位号：">
            <el-input v-model="searchData.cargo" @keyup.enter.native="init"></el-input>
        </label-item>
        <label-item label="SKU：" class="ml-sm">
            <el-input v-model="searchData.sku" @keyup.enter.native="init"></el-input>
        </label-item>
        <label-item label="下架状态：" class="ml-sm">
            <el-select v-model="searchData.quantity_diff" class="width-sm">
                <el-option v-for="(item, index) in quantityList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <el-button type="primary"
                   size="mini"
                   class="ml-sm"
                   @click="init">搜索
        </el-button>
        <el-table :data="detailData"
                  v-loading="loading"
                  height="500"
                  class="scroll-bar mt-sm"
                  element-loading-text="玩命加载中"
                  highlightCurrentRow>
            <el-table-column
                    type="index"
                    width="40">
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="货位">
                <div>
                    <ui-tip :content="row.warehouse_cargo" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <!--<el-table-column-->
            <!--inline-template-->
            <!--width="160"-->
            <!--label="数量（下架数/总数）">-->
            <!--<div>-->
            <!--<ui-tip :content="`${row.picking_quantity}/${row.quantity}`"-->
            <!--:width="98">-->
            <!--</ui-tip>-->
            <!--</div>-->
            <!--</el-table-column>-->
            <el-table-column
                    inline-template
                    width="80"
                    label="总数">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="下架数">
                <div>
                    <ui-tip :content="row.picking_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="未包装数">
                <div>
                    <ui-tip :content="row.waiting_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="作废数">
                <div>
                    <ui-tip :content="row.invalid_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="周转箱信息">
                <div v-for="item in row.turnover_box">
                    <div>{{item.turnover_num}}:{{item.quantity}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="990"
                    label="商品名称（规格）">
                <div>
                    <span>{{`${row.name}(${row.attributes})`}}</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="fr mt-sm"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .p-pickings {
        .pagination {
            position: absolute;
            right: 5px;
            bottom: 5px;
        }
    }
</style>
<script>
    import {api_detail_pickings} from '@/api/pickings'

    export default {
        data() {
            return {
                loading: false,
                searchData: {
                    cargo: '',
                    sku: '',
                    quantity_diff: '',
                    page: 1,
                    pageSize: 20
                },
                detailData: [],
                quantityList: [
                    {label: '全部', value: ''},
                    {label: '待下架', value: '<'},
                    {label: '下架完成', value: '='}
                ],
                total: 0
            }
        },
        mounted() {
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            init() {
                this.loading = true;
                // this.trim();
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$http(api_detail_pickings, this.trendAction.id, this.searchData).then(res => {
                    this.detailData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            trim() {
                this.searchData.cargo = this.searchData.cargo.trim();
                this.searchData.sku = this.searchData.sku.trim();
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
        },
        computed: {},
        watch: {
            pickingsVisible(val) {
                if (val) {
                    this.init();
                }
            }
        },
        props: {
            pickingsVisible: {},
            trendAction: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default
        },
    }
</script>
