<template>
    <div>
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="tableData.length>0"
                  :body-height="40"
                  :heads="uiHeads"
        >
            <tbody>
            <template v-for="(order,index) in tableData">
                <tr @click="add_class(index)"
                    :class="[clickData[index]?'active-color':'']">
                    <!--采购单号-->
                    <td>
                        <plus-minus @show-detail="show(index, order)"
                                    :show="order.show"
                                    :title="tipTitle">
                        </plus-minus>
                        <ui-tip :content="`PO${order.id}`" :is-operate="true" @cur-click="search_id(order)"
                                :width="80"></ui-tip>
                    </td>
                    <!--采购仓库-->
                    <td>
                        <ui-tip :content="order.warehouse_name" :width="80"></ui-tip>
                    </td>
                    <!--供应商-->
                    <td>
                        <ui-tip :content="order.supplier_name" :width="80"></ui-tip>
                    </td>
                    <!--运费（CNY）-->
                    <td>
                        <ui-tip :content="order.shipping_cost" :width="80"></ui-tip>
                    </td>
                    <!--采购人员-->
                    <td>
                        <ui-tip :content="order.purchase_user_name" :width="80"></ui-tip>
                    </td>
                    <!--采购日期-->
                    <td>
                        <ui-tip :content="order.purchase_time | filterTime"
                                :width="80">
                        </ui-tip>
                    </td>
                    <!--采购状态-->
                    <td>
                        <ui-tip :content="order.status_name" :width="80"></ui-tip>
                    </td>
                </tr>
                <template v-if="order.show">
                    <tr style="font-weight:bold">
                        <td>图片</td>
                        <td>SKU</td>
                        <td>货品名称</td>
                        <td>本次采购数</td>
                        <td>良品数</td>
                        <td>入库数</td>
                        <td>次品数</td>
                        <td>采购单价（CNY）</td>
                    </tr>
                    <tr v-for="product in order_product(order)">
                        <!--图片-->
                        <td>
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img :src="product.thumb | filterImage"
                                     width="200px"
                                     height="200px">
                                <span slot="reference">
                                        <img :src="product.thumb"
                                             @click="search_img(product.thumb)"
                                             v-if="product.thumb"
                                             height="26px" width="26px"
                                             style="border:none">
                                        </span>
                            </el-popover>
                        </td>
                        <!--SKU-->
                        <td>
                            <ui-tip :content="product.sku" :width="98"></ui-tip>
                        </td>
                        <!--货品名称-->
                        <td>
                            <ui-tip :content="product.sku_name" :width="80"></ui-tip>
                        </td>
                        <!--本次采购数-->
                        <td>
                            <ui-tip :content="product.qty" :width="98"></ui-tip>
                        </td>
                        <!--良品数-->
                        <td>
                            <ui-tip :content="product.expected_int_qty" :width="98"></ui-tip>
                        </td>
                        <!--入库数-->
                        <td>
                            <ui-tip :content="product.in_qty" :width="98"></ui-tip>
                        </td>
                        <!--次品数-->
                        <td>
                            <ui-tip :content="product.expected_defective_qty" :width="98"></ui-tip>
                        </td>
                        <!--采购单价（CNY）-->
                        <td>
                            <ui-tip :content="product.price" :width="98"></ui-tip>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="pageInfo.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_order, api_get_orderdetail, url_get_order} from '@/api/arrival-parcel'

    export default {
        permission: {
            url_get_order
        },
        data() {
            return {
                pageInfo: {
                    page: 1,
                    pageSize: 20
                },
                tableData: [],
                uiHeads: [
                    {label: '采购单号', width: 8},
                    {label: '采购仓库', width: 10},
                    {label: '供应商', width: 12},
                    {label: '运费（CNY）', width: 8},
                    {label: '采购人员', width: 8},
                    {label: '采购日期', width: 12},
                    {label: '采购状态', width: 10},
                ],
                loading: false,
                total: 0,
                tipTitle: "点击查看采购单详情",
                imgPath: '',
                imgDialog: false,
                clickData: []
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            }
        },
        methods: {
            init() {
                this.clear_page_info();
                this.get_order_list();
            },
            clear_page_info() {
                this.pageInfo = {page: 1, pageSize: 20};
            },
            get_order_list() {
                this.loading = true;
                let params = Object.assign(this.searchData, this.pageInfo);
                if (this.$hasPermission(this.apis.url_get_order)) {
                    this.$http(api_get_order, params).then(res => {
                        this.loading = false;
                        this.total = res.count;
                        this.tableData = res.data;
                    }).catch(code => {
                        this.loading = false;
                        this.$message({type: "error", message: code.message || code});
                    });
                } else {
                    this.$message({type: "error", message: '没有查看该列表的权限'});
                }
            },
            //分页器
            handle_size_change(val) {
                this.pageInfo.pageSize = val;
                const new_max_page = Math.ceil(this.total / this.pageInfo.pageSize);
                this.pageInfo.page = this.pageInfo.page > new_max_page ? new_max_page : this.pageInfo.page;
                this.get_order_list();
            },
            handle_current_change(val) {
                this.pageInfo.page = val;
                this.get_order_list();
            },
            order_product(order) {
                return order.product_list || [];
            },
            show(index, order) {
                order.show = !order.show;
                let data = {
                    purchase_order_id: order.id,
                    pageSize: 100
                };
                if (order.show && (!order.product_list || order.product_list.length <= 0)) {
                    this.$http(api_get_orderdetail, data).then(res => {
                        this.$set(order, 'product_list', res.data);
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }
            },
            //查看大图
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            add_class(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            search_id(row) {
                this.$emit('search-id', row);
            },
        },
        watch: {},
        props: {
            searchData: {}
        },
        components: {
            uiTable: require('@/components/ui-table.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
        }
    }
</script>
