<template>
    <page class="p-generate-order">
        <search-module @init-data="init_data"
                       @warehouse-name="set_warehouse_name"
                       ref="search_module"
                       :left-show="leftShow"
                       @transport-change="transport_change"
                       v-model="warehouse_id"
                       @init-tree="init_tree"
        ></search-module>
        <table-module :search-data="searchData"
                      @generate="generate"
                      :transport-change="transportChange"
                      :warehouse-name="warehouseName"
                      @left-show-change="left_show_change"
                      @transport-change="transport_change"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
        <div class="layer" v-if="layer_visiable">
            <div class="layer-box">
                <p>请等待,生成中...</p>
            </div>
        </div>
    </page>
</template>
<style lang="stylus">
    .p-generate-order {
        .layer {
            top: 95px;
            left: 160px;
            width: 100%;
            height: 100%;
            position: fixed;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
        }
        .layer-box {
            position: absolute;
            top: -200px;
            left: -200px;
            right: 0;
            bottom: 0;
            width: 200px;
            height: 100px;
            background-color: #ffffff;
            text-align: center;
            line-height 100px;
            margin: auto;
            p {
                margin: 0;
            }
        }
    }

</style>
<script>
    import {
        api_get_pickings,
        api_get_shipping,
        api_post_pickings,
        api_get_shelf,
        api_get_channels
    } from '@/api/generate-order'

    export default {
        page: {
            devinfo: {
                frontEnd: '张明亮,张志勇',
                backEnd: '张文宇',
                createTime: '2017-11-8',
                updateTime: '2017-11-9'
            },
        },
        refresh() {
            this.$refs.searchData.request_channels();
            this.$refs.searchData.init();
        },
        data() {
            return {
                searchData: {
                    carrier_id: 0,
                    shipping_id: [],
                },
                tableData: [],
                layer_visiable: false,
                warehouse_id: 2,
                warehouseName: '',
                transportChange: true,
                leftShow: false,
            }
        },
        mounted() {
        },
        methods: {
            init_data(searchData) {
                this.searchData = Object.assign(this.searchData, searchData, {warehouse_id: this.warehouse_id});
                this.$nextTick(() => {
                    this.searchData.carrier_id = 0;
                    this.searchData.shipping_id = [];
                    this.$refs.table_module.init();
                    if (!this.leftShow) {
                        this.$refs.table_module.init_tree();
                    }
                });
            },
            init_tree() {
                this.$nextTick(() => {
                    this.$refs.table_module.init_tree();
                });
            },
            generate() {
                this.$refs.search_module.request_channels();
                this.$refs.search_module.init();
            },
            set_warehouse_name(val) {
                this.warehouseName = val;
            },
            transport_change(val) {
                this.transportChange = val;
            },
            left_show_change(val) {
                this.leftShow = val;
            }
        },
        computed: {},
        watch: {
            warehouse_id(val) {
                this.searchData.warehouse_id = this.warehouse_id;
            }
        },
        props: {},
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default
        },
    }
</script>
