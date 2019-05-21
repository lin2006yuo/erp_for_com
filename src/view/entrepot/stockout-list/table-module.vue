<template>
    <div class="stock-out-list">
        <el-table class="mb-sm scroll-bar"
                  border
                  :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  v-loading="loading"
                  @selection-change="selectionChange"
                  @sort-change="sort_change"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column label="图片" min-width="70">
                <template slot-scope="scope">
                    <el-popover
                        v-if="scope.row.thumb"
                        placement="right"
                        trigger="hover">
                        <img :src="scope.row.thumb | filterImage"
                             width="200px"
                             height="200px">
                        <span slot="reference">
                            <img :src="scope.row.thumb"
                                 @click="search_img(scope.row.thumb)"
                                 height="60px" width="60px"
                                 style="border:none">
                                        </span>
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
                    <div>{{row.alias}}</div>
                </div>
            </el-table-column>
            <el-table-column label="商品名称" min-width="130" inline-template>
                <span>{{row.name}}</span>
            </el-table-column>
            <el-table-column label="商品状态" min-width="50" inline-template>
                <ui-tip :content="row.sales_status|filterStatus" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="在途库存" min-width="50" inline-template>
                <div :class="row.instransit_qty > 0  ? 'bule_pointer' : ''" @click="detail(row)">{{row.instransit_qty}}</div>
            </el-table-column>
            <el-table-column label="可用库存" min-width="50" inline-template>
                <div>{{row.available_qty}}</div>
            </el-table-column>
            <el-table-column label="待发库存" min-width="50" inline-template>
                <div>{{row.shipping_qty}}</div>
            </el-table-column>
            <el-table-column label="缺货数量" min-width="60" sortable inline-template>
                <div v-if="row.lack_qty>0">{{row.lack_qty}}</div>
            </el-table-column>
            <el-table-column label="缺货订单数" min-width="60" inline-template>
                <div v-if="row.counts_order_id >0">{{row.counts_order_id }}</div>
            </el-table-column>
            <el-table-column label="最早缺货时间" sortable min-width="120" inline-template>
                <div>{{row.create_time | fdatetime}}</div>
            </el-table-column>
            <el-table-column label="开发员" min-width="60" inline-template>
                <div>{{row.developer_id}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="60" inline-template>
                <ui-tip :content="row.purchaser_id" :width="98"></ui-tip>
            </el-table-column>
        </el-table>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <instransit-detail v-model="instransitDetail" :detail-list="detailList"></instransit-detail>
    </div>
</template>
<style lang="stylus">
    .stock-out-list{
        .bule_pointer{
            color: #6699FF;
            cursor: pointer
        }
    }
</style>
<script>
    import {api_get_stock_lack_inventory} from "@/api/stockout-list";
    export default {
        data() {
            return {
                selects: [],
                imgPath: '',
                imgDialog: false,
                instransitDetail: false,
                detailList: [],
            }
        },
        methods: {
            detail(row) {
                if(row.instransit_qty > 0) {
                    this.$http(api_get_stock_lack_inventory, {sku: row.sku}).then(res => {
                        this.detailList = res;
                        this.instransitDetail = true;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }else {
                    return;
                }
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            sort_change(column) {
                this.$emit('sort_change', column);
            },
            selectionChange(val){
                this.$emit('selection-change',val);
            }
        },
        filters: {
            filterStatus(val) {
                switch (val) {
                    case 1:
                        return '在售';
                        break;
                    case 2:
                        return '停售';
                        break;
                    case 3:
                        return '待发布';
                        break;
                    case 4:
                        return '卖完下架';
                        break;
                    case 5:
                        return '缺货';
                        break;
                }
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                type: Boolean,
                default: false
            },
            firstTime: {
                type: Boolean,
                default: true
            }
        },
        components: {
            uiTip: require('@/components/ui-tip').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            instransitDetail: require("./instransit-detail.vue").default,
        }
    }
</script>
