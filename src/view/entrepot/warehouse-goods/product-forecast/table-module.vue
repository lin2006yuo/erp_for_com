<template>
    <div class="c-turnover-box">
        <goods-classify ref="classifyPart" :leftControllerTitle="leftControllerTitle">
            <div slot="button-list" class="">
                <el-button size="mini" type="primary"
                           @click.native.stop.prevent="$listeners['add-forecast']">添加产品预报
                </el-button>
            </div>
            <goods-tree slot="goods-tree"
                        @change-category="$listeners['change-category']"
                        @hidden-left="$refs.classifyPart.showLeft(true)">
            </goods-tree>
            <el-table slot="goods-tabel"
                      :data="tableData"
                      v-loading="loading"
                      class="scroll-bar"
                      v-resize="{height:41}">
                <el-table-column
                        align="center"
                        inline-template
                        width="70"
                        label="图片">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img v-lazy="sku_image(row.thumb[0])" width="200px" height="200px">
                        <span slot="reference">
                            <img v-lazy="row.thumb[0]" v-if="row.thumb" height="60px" width="60px" style="border:none">
                        </span>
                    </el-popover>
                </el-table-column>
                <el-table-column label="第三方仓SKU/本地SKU"
                                 width="145"
                                 inline-template>
                    <div>
                        <ui-tip :content="row.third_sku"></ui-tip>
                        <div>
                            <span v-if="!row.sku" class="relate-info" @click="$listeners['relate'](row)">
                                <i class="el-icon-information"></i> 未关联
                            </span>
                            <ui-tip v-else :content="row.sku"></ui-tip>
                        </div>
                    </div>
                </el-table-column>
                <el-table-column label="产品名称" inline-template>
                    <div>
                        {{row.title}}
                    </div>
                </el-table-column>
                <el-table-column label="预报品类" inline-template>
                    <div>
                        <ui-tip :content="row.third_category_name"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="预报状态" width="80" inline-template>
                    <div>
                        <ui-tip :content="row.status_text"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="创建时间">
                    <div>
                        <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        width="80"
                        label="操作">
                    <template slot-scope="scope">
                        <permission tag="ElButton"
                                    :route="apis.url_forecast_detail"
                                    type="text"
                                    class="operation-color"
                                    size="mini"
                                    @click.native="$listeners['look'](scope.row)">查看
                        </permission>
                    </template>
                </el-table-column>
            </el-table>
        </goods-classify>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['size-change']"
                @current-change="$listeners['current-change']"
                :current-page="pagination.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .c-turnover-box {
        .operation-color {
            color: #69f;
        }
        .relate-info {
            color: #008BCE;
            cursor: pointer;
            .el-icon-information {
                width: 1em;
                height: 1em;
            }
        }
    }

</style>
<script>
    import {
        api_forecast_list, //预报列表
        api_forecast_category, //获取预报品类
        api_forecast_detail, //预报品类详情
        url_forecast_detail
    } from '@/api/warehouse-goods-forecast.js';

    export default {
        permission: {
            url_forecast_detail
        },
        data() {
            return {
                leftControllerTitle: "显示产品分类检索",
                action: {},
                visible: false,
                trendAction: {},
                lookVisible: false,
            }
        },
        mounted() {
            console.log('table module', this.$listeners);
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return "";
            }
        },
        props: {
            tableData: {},
            pagination: {
                required: true,
                type: Object
            },
            loading: {},
            total: {}
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            goodsClassify: require('@/components/goods-classify.vue').default,
            goodsTree: require('@/components/goods-tree.vue').default,
        },
    }
</script>
