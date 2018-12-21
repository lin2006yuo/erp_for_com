<template>
    <page-dialog v-model="visible" size="large" @open="open" @close="close" title="选择指定商品">
        <el-row class="mb-sm">
            <label-item label="sku：" class="inline">
                <order-input v-model="sku" class="width-super" @keydown="search"></order-input>
            </label-item>
            <el-button type="primary" size="mini" class="inline ml-sm" @click.native="search">搜索</el-button>
            <el-button type="default" size="mini" class="inline ml-sm" @click.native="clear">清空</el-button>
        </el-row>

        <ui-table v-loading="loading"
                  v-model="checkAll"
                  element-loading-text="玩命加载中..."
                  :has-data="tableData.length>0"
                  :body-height="150"
                  :heads="uiHeads"
                  @check="check_all"
        >
            <tbody>
            <template v-for="(row,index) in tableData">
                <tr @click="add_class(index)"
                    :class="[clickData[index]?'active-color':'']">
                    <!--isCheck-->
                    <td></td>

                    <!--第三方仓SKU/本地SKU-->
                    <td v-if="isThird">
                        <plus-minus @show-detail="show(index, row)"
                                    class="inline"
                                    :show="row.show"
                                    :title="tipTitle">
                        </plus-minus>
                        <span :title="row.spu_name">{{row.thirdparty_goods_sku}}</span>
                        <div>
                            {{row.sku}}
                        </div>
                    </td>
                    <!--第三方仓SKU/本地SKU-->
                    <td v-else>
                        <plus-minus @show-detail="show(index, row)"
                                    class="inline"
                                    :show="row.show"
                                    :title="tipTitle">
                        </plus-minus>
                        <el-popover
                                class="inline"
                                placement="right"
                                v-if="row.spu_name"
                                trigger="hover">
                            <span>{{row.spu_name}}</span>
                            <div slot="reference">
                                <div>
                                    {{row.sku}}
                                    <!--<span title="点击可查看商品详情" class="operate" @click="look(row)">{{row.sku}}</span>-->
                                </div>
                                <div>{{row.sku_alias || ''}}</div>
                            </div>
                        </el-popover>
                        <div v-else class="inline">
                            <div>
                                {{row.sku}}
                                <!--<span title="点击可查看商品详情" class="operate" @click="look(row)">{{row.sku}}</span>-->
                            </div>
                            <div>{{row.sku_alias || ''}}</div>
                        </div>
                    </td>
                    <!--当前库存(系统/第三方)-->
                    <td v-if="isThird">
                        <div :class="[Number(row.third_quantity)<Number(row.alert_quantity)?'bg-alert':'']">
                            {{row.quantity}}/{{row.third_quantity}}
                        </div>
                    </td>
                    <!--当前库存-->
                    <td v-else>
                        <div :class="[Number(row.quantity)<Number(row.alert_quantity)?'bg-alert':'']">
                            {{row.quantity}}
                        </div>
                    </td>
                    <!--可用库存(系统/第三方)-->
                    <td v-if="isThird">
                        <div>{{row.available_quantity}}/{{row.third_avaliable_quantity}}</div>
                    </td>
                    <!--可用库存-->
                    <td v-else>
                        <div>{{row.available_quantity}}</div>
                    </td>
                    <!--待发数量-->
                    <td>
                        <div>{{row.waiting_shipping_quantity}}</div>
                    </td>
                    <!--单价-->
                    <td>
                        <div>{{row.per_cost |filterable}}</div>
                    </td>
                </tr>
                <template v-if="row.show">
                    <tr style="font-weight:bold">
                        <td></td>
                        <td>平台</td>
                        <td>当前库存</td>
                        <td>可用库存</td>
                        <td>待发库存</td>
                        <td>日均销量</td>
                    </tr>
                    <tr v-for="channel in row.detail">
                        <!--isCheck-->
                        <td align="center">
                            <el-checkbox v-model="channel.isCheck" @change="check_box"></el-checkbox>
                        </td>
                        <!--平台-->
                        <td>
                            <div>{{channel.channel_name}}</div>
                        </td>
                        <!--当前库存-->
                        <td>
                            <ui-tip :content="channel.quantity" :width="98"></ui-tip>
                        </td>
                        <!--可用库存-->
                        <td>
                            <ui-tip :content="channel.available_quantity" :width="80"></ui-tip>
                        </td>
                        <!--待发库存-->
                        <td>
                            <ui-tip :content="channel.waiting_shipping_quantity" :width="98"></ui-tip>
                        </td>
                        <!--日均销量-->
                        <td>
                            <ui-tip :content="channel.average_daily_sales" :width="98"></ui-tip>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="sure">确定
            </el-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_oversea_channel_detail, api_third_channel_detail} from "@/api/overseas-stock";

    export default {
        data() {
            return {
                visible: false,
                sku: '',
                checkAll: false,
                clickData: [],
                tableData: [],
                loading: false,
                tipTitle: "点击查看平台分库存",
            }
        },
        filters: {
            filterable(val) {
                if (val) return parseFloat(val).toFixed(2);
            }
        },
        methods: {
            open() {
            },
            search() {
                this.sku = this.sku.trim();
                let sku;
                if (this.sku !== '') {
                    sku = this.sku.split('\n').filter(row => !!row).map(row => row.trim());
                } else {
                    sku = this.sku;
                }
                let data = {
                    warehouse_id: this.warehouse_id,
                    channel_id: this.channel_id,
                    snType: 'sku',
                    snText: sku,
                };
                let api = this.isThird ? api_third_channel_detail : api_oversea_channel_detail;
                this.$http(api, data).then(res => {
                    this.tableData = res;
                    this.tableData.forEach(row => {
                        this.$set(row, 'show', true);
                        row.detail.forEach(detail => {
                            this.$set(detail, 'isCheck', false);
                        });
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            show(index, row) {
                row.show = !row.show;
            },
            check_all(val) {
                this.tableData.forEach(row => {
                    row.detail.forEach(row => {
                        row.isCheck = val;
                    });
                });
            },
            add_class(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            check_box() {
                let isCheckAll = !this.tableData.some(row => row.detail.some(row => !row.isCheck));
                this.checkAll = isCheckAll;
            },
            sure() {
                let goodsData = [];
                this.tableData.forEach(row => {
                    row.detail.forEach(detail => {
                        if (detail.isCheck) {
                            goodsData.push({
                                sku_id: row.sku_id,
                                sku: row.sku,
                                sku_alias: row.sku_alias,
                                thumb: row.thumb,
                                available_quantity: detail.available_quantity,
                                from_channel_id: detail.channel_id,
                                from_channel_name: detail.channel_name,
                                quantity: 1,
                                audit_id: '',
                            });
                        }
                    });
                });
                if (goodsData.length === 0) {
                    this.$message({type: 'error', message: '请选择需要借调的数据'});
                    return;
                }
                this.visible = false;
                this.$emit('add-goods', goodsData);
            },
            clear() {
                this.sku = ''
            },
            close() {
                this.sku = ''
                this.clickData = [];
                this.tableData = [];
            }
        },
        computed: {
            uiHeads() {
                return this.isThird ? [
                    {isCheck: true, width: 4},
                    {label: '第三方仓SKU/本地SKU', width: 36},
                    {label: '当前库存(系统/第三方)', width: 15},
                    {label: '可用库存(系统/第三方)', width: 15},
                    {label: '待发数量', width: 15},
                    {label: '单价', width: 15},
                ] : [
                    {isCheck: true, width: 4},
                    {label: 'SKU/SKU别名', width: 36},
                    {label: '当前库存', width: 15},
                    {label: '可用库存', width: 15},
                    {label: '待发数量', width: 15},
                    {label: '单价', width: 15},
                ]
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            warehouse_id: {},
            channel_id: {},
            isThird: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            uiTable: require('@/components/ui-table.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
        }
    }
</script>