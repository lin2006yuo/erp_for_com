<template>
    <div class="c-picking-sku-table">
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  v-loading="loading"
                  @sort-change="$listeners['sort-change']"
                  element-loading-text="玩命加载中...">
            <!--<div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>-->
            <el-table-column label="图片" min-width="70">
                <template slot-scope="scope">
                    <el-popover
                            v-if="scope.row.sku_thumb"
                            placement="right"
                            trigger="hover">
                        <img :src="scope.row.sku_thumb | filterImage"
                             width="200px"
                             height="200px">
                        <div slot="reference">
                            <img :src="scope.row.sku_thumb"
                                 @click="search_img(scope.row.sku_thumb)"
                                 height="60px" width="60px"
                                 style="border:none">
                        </div>
                    </el-popover>
                    <img src="/static/error-picture-128.png"
                         v-else
                         height="60px" width="60px"
                         style="border:none">
                </template>
            </el-table-column>
            <el-table-column label="SKU/别名" min-width="55" inline-template>
                <div>
                    <div>{{row.sku}}</div>
                    <div>{{row.sku_alias || ''}}</div>
                </div>
            </el-table-column>
            <el-table-column label="产品名称" min-width="130" inline-template>
                <span>{{row.sku_title}}</span>
            </el-table-column>
            <el-table-column label="包裹数量" min-width="50" inline-template>
                <span>{{row.package_quantity}}</span>
            </el-table-column>
            <el-table-column label="待生成数量" min-width="50" sortable inline-template>
                <div>{{row.quantity}}</div>
            </el-table-column>
            <el-table-column label="拣货区库存" min-width="50" inline-template>
                <div>{{row.pickingArea_quantity}}</div>
            </el-table-column>
            <el-table-column label="良品收货区库存" min-width="50" inline-template>
                <div>{{row.goodArea_quantity}}</div>
            </el-table-column>
            <el-table-column label="待发货区库存" min-width="50" inline-template>
                <div>{{row.waitArea_quantity}}</div>
            </el-table-column>
            <el-table-column label="退货区库存" min-width="60" inline-template>
                <div>{{row.returnArea_quantity}}</div>
            </el-table-column>
            <el-table-column label="最早配货时间" min-width="120" inline-template>
                <div>{{row.min_distribution_time | fdatetime}}</div>
            </el-table-column>
        </el-table>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <el-pagination
                class="t-right"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<style lang="stylus">
</style>

<script>
    export default {
        data() {
            return {
                imgPath: '',
                imgDialog: false,
            }
        },
        filters: {
            filterStatus(val) {
                switch (val) {
                    case 1:
                        return '在售';
                    case 2:
                        return '停售';
                    case 3:
                        return '待发布';
                    case 4:
                        return '卖完下架';
                    case 5:
                        return '缺货';
                }
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        methods: {
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            sort_change(column) {
                this.$emit('sort_change', column);
            }
        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
        },
        components: {
            uiTip: require('@/components/ui-tip').default,
            blowupImage: require("@/components/blowup-image.vue").default,
        }
    }
</script>
