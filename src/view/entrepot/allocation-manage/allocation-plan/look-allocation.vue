<template>
    <page-dialog v-model="visible"
                 class="c-look-allocation-plan"
                 @open="open" @close="close" size="large" :title="action.title">
        <el-tabs v-model="activeName" @tab-click="handle_click">
            <el-tab-pane label="基础信息" name="base_info">
                <div class="t-right mb-xs mr-xs">
                    <span>账号：{{editData.tax === 1 ? '正规' : '不正规'}}</span>
                </div>
                <table class="right-table mb-sm" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="150">出库仓库</td>
                        <td width="150">{{editData.out_warehouse}}</td>
                        <td width="150">入库仓库</td>
                        <td width="150">
                            <span>{{editData.in_warehouse}}</span>
                        </td>
                        <td width="150">状态</td>
                        <td width="150" style="position: relative">
                            {{editData.status_txt}}
                            <el-tooltip :content="row.reason" placement="right" effect="light"
                                        v-if="editData.status === 2">
                                <span class="error-icon"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    <tr>
                        <td width="150">创建人</td>
                        <td width="150">{{editData.create}}</td>
                        <td width="150">创建时间</td>
                        <td width="150">{{editData.create_time | timeFilter}}</td>
                        <td width="150">更新人</td>
                        <td width="150">{{editData.update}}</td>
                    </tr>
                    <tr>
                        <td width="150">审核人</td>
                        <td width="150">{{editData.auditor}}</td>
                        <td width="150">审核时间</td>
                        <td width="150">{{editData.auditor_time | timeFilter}}</td>
                        <td width="150">更新时间</td>
                        <td width="150">{{editData.update_time | timeFilter}}</td>
                    </tr>
                </table>
                <ui-table element-loading-text="玩命加载中..."
                          :has-data="editData.sku_list.length>0"
                          :body-height="280"
                          :heads="baseHeads">
                    <tbody>
                    <template v-for="(row,index) in editData.sku_list">
                        <tr @click="add_class(index)"
                            :class="[clickData[index]?'active-color':'']">
                            <!--图片-->
                            <td>
                                <el-popover
                                        placement="right"
                                        trigger="hover">
                                    <img :src="row.thumb | filterImage" width="200px" height="200px">
                                    <span slot="reference">
                                    <img :src="row.thumb" v-if="row.thumb"
                                         height="60px" width="60px"
                                         style="border:none;vertical-align: middle">
                                </span>
                                </el-popover>
                            </td>
                            <!--SKU/SKU别名-->
                            <td>
                                <div>
                                    <div>
                                        {{row.sku}}
                                    </div>
                                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                                </div>
                            </td>
                            <!--第三方SKU-->
                            <td v-if="isThirdSku">
                                <div>{{row.third_sku}}</div>
                            </td>
                            <!-- FNSKU -->
                            <td v-if="isFBA">
                                <div>{{row.fn_sku}}</div>
                            </td>
                            <!--产品名称-->
                            <td>
                                <div>{{row.goods_name}}</div>
                            </td>
                            <!--产品物流属性-->
                            <td>
                                <div>{{row.transport_property}}</div>
                            </td>
                            <!--调拨数量-->
                            <td>
                                <div>{{row.quantity}}</div>
                            </td>
                            <!--出库数量-->
                            <td>
                                <div>{{row.send_qty}}</div>
                            </td>
                            <!--出库货位号-->
                            <td>
                                <div>{{row.out_cargo_code}}</div>
                            </td>
                            <!--成本-->
                            <td>
                                <div>{{row.price | filterable}}</div>
                            </td>
                            <!--已入库数量-->
                            <td>
                                <ui-tip :content="row.in_qty" :width="98"></ui-tip>
                            </td>
                            <!--备货计划单号-->
                            <td>
                                <div v-for="code in row.stock_code" :key="code">
                                    {{code}}
                                </div>
                            </td>
                            <!--退回数量-->
                            <td>
                                <ui-tip :content="row.return_qty" :width="98"></ui-tip>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </ui-table>

                <div class="mt-xs">
                    <label-item label="发货物流方式：" class="inline">
                        <el-radio-group v-model="editData.shipping_type" :disabled="true">
                            <el-radio :label="1" class="ml-sm">空运</el-radio>
                            <el-radio :label="2" class="ml-sm">海运</el-radio>
                            <el-radio :label="4" class="ml-sm">快递</el-radio>
                            <el-radio :label="5" class="ml-sm">专线</el-radio>
                            <el-radio :label="3" class="ml-sm">其他</el-radio>
                        </el-radio-group>
                    </label-item>
                    <label-item label="ReferenceID：" v-if="isFBA" class="inline ml-sm">
                        <el-input v-model="editData.reference_id" class="s-width-default"
                                  :disabled="action.value !== 'reference'">
                        </el-input>
                    </label-item>
                    <div>
                        <el-row>
                            <label-item label="物流渠道：" class="inline">
                                <el-input v-if="isEdit" v-model="editData.shipping_method"></el-input>
                                <span v-else>{{editData.shipping_method}}</span>
                            </label-item>
                            <label-item label="" class="inline ml-sm">
                                <template v-if="!isEdit">
                                    <span>运费：{{editData.shipping_fee}}{{editData.currency_code}}</span>
                                    <span class="ml-sm">税金：{{editData.taxes}}{{editData.currency_code}}</span>
                                </template>
                                <template v-else>
                                    <span>运费：</span>
                                    <ui-limit-number v-model="editData.shipping_fee" class="inline"
                                                     style="width: 50px;"></ui-limit-number>
                                    <span class="ml-sm">税金：</span>
                                    <ui-limit-number v-model="editData.taxes" class="inline"
                                                     style="width: 50px;"></ui-limit-number>
                                    <el-select v-model="editData.currency_code" class="inline ml-xs width-xs"
                                               placeholder="请选择币种">
                                        <el-option v-for="(item, index) in currencyList"
                                                   :key="index"
                                                   :label="item.code"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </label-item>
                        </el-row>
                        <el-row class="mt-xs">
                            <label-item label="运单号：" class="inline ml-sm">
                                <span v-if="!isEdit">{{editData.tracking_number}}</span>
                                <el-input v-else v-model="editData.tracking_number"></el-input>
                            </label-item>
                            <label-item label="参考号：" class="inline ml-sm">
                                <span v-if="!isEdit">{{editData.reference_number}}</span>
                                <el-input v-else v-model="editData.reference_number"></el-input>
                            </label-item>
                            <label-item label="IEN：" class="inline ml-sm">
                                <span v-if="!isEdit">{{editData.ien}}</span>
                                <el-input v-else v-model="editData.ien"></el-input>
                            </label-item>
                        </el-row>
                    </div>
                </div>
                <div style="clear: both">
                    <span class="mb-sm inline">备注：</span>
                    <el-input
                            type="textarea"
                            :disabled="true"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="editData.remark">
                    </el-input>
                </div>
            </el-tab-pane>
            <el-tab-pane label="装箱清单" name="box_list">
                <el-row class="fl-clear mt-xs mb-xs">
                    <permission tag="ElButton"
                                :disabled="boxList.length === 0"
                                @click.native="export_box_list"
                                :route="apis.url_allocation_export"
                                type="primary" size="mini">
                        导出装箱单
                    </permission>
                    <span class="fr mr-xs">账号：{{editData.tax === 1 ? '正规' : '不正规'}}</span>
                </el-row>

                <ui-table element-loading-text="玩命加载中..."
                          class="right-table"
                          :has-data="boxList.length>0"
                          :body-height="280"
                          :heads="boxHeads">

                    <tbody>
                    <template v-for="(box,index) in boxList">
                        <tr>
                            <td :colspan="10">
                                <el-row>
                                    <el-col :span="10" class="t-left">
                                            <span class="ml-sm red bold-font">
                                                箱号：{{index+1}}
                                            </span>
                                        <span class="ml-sm red bold-font">
                                                箱唛：{{box.shipping_mark}}
                                            </span>
                                    </el-col>
                                    <el-col :span="6" class="t-left">
                                            <span class="ml-sm red bold-font">
                                                箱子重量：{{box.box_weight | weightFilter}}KG
                                            </span>
                                    </el-col>
                                    <el-col :span="8" class="t-left">
                                            <span class="ml-sm red bold-font">
                                                箱子体积：{{`${box.length}*${box.width}*${box.height}`}}
                                            </span>
                                    </el-col>
                                </el-row>
                            </td>
                        </tr>
                        <template v-for="(row, detialIndex) in box.detail">
                            <tr @click="add_class(detialIndex)"
                                :class="[clickData[index]?'active-color':'']">
                                <!-- 图片 -->
                                <td>
                                    <el-popover
                                            placement="right"
                                            trigger="hover">
                                        <img :src="row.thumb | filterImage" width="200px" height="200px">
                                        <span slot="reference">
                                    <img :src="row.thumb" v-if="row.thumb"
                                         height="60px" width="60px"
                                         style="border:none;vertical-align: middle">
                                </span>
                                    </el-popover>
                                </td>
                                <!-- SKU/SKU别名 -->
                                <td>
                                    <div>
                                        <div>
                                            {{row.sku}}
                                        </div>
                                        <div v-for="item in row.alias">{{item || `--`}}</div>
                                    </div>
                                </td>
                                <!--第三方SKU-->
                                <td v-if="isThirdSku">
                                    <div>{{row.third_sku}}</div>
                                </td>
                                <!-- FNSKU -->
                                <td v-if="isFBA">
                                    <div>{{row.fn_sku}}</div>
                                </td>
                                <!--商品名称-->
                                <td>
                                    <div>{{row.goods_name}}</div>
                                </td>
                                <!--英文品名-->
                                <td>
                                    <div>{{row.en_name}}</div>
                                </td>
                                <!-- HS Code -->
                                <td>
                                    <div>{{row.hs_code}}</div>
                                </td>
                                <!-- 产品物流属性 -->
                                <td>
                                    <div>{{row.transport_property}}</div>
                                </td>
                                <!-- 销售链接 -->
                                <td>
                                    <a :href="row.source_url" class="sale-link">
                                        {{row.source_url}}
                                    </a>
                                </td>
                                <!-- 成本 -->
                                <td>
                                    <div>{{row.price | filterable}}</div>
                                </td>
                                <!-- 出库数量 -->
                                <td>
                                    <div>{{row.quantity}}</div>
                                </td>
                            </tr>
                        </template>
                    </template>
                    </tbody>
                </ui-table>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer">
            <request-button req-key="edit_reference_id" type="primary" v-if="action.value !== 'look'" size="mini"
                            @click.native="sure">确定
            </request-button>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-look-allocation-plan {
        .right-table {
            width: calc(100% - 4px);
            border: 1px solid #d3dce6;
            td {
                text-align: center;
                border-bottom: 1px solid #d3dce6;
                border-right: 1px solid #d3dce6;
                height: 33px;
            }
            td:nth-child(2n+1) {
                font-weight: 700;
                background-color: #f5f7fa;
            }
        }
        .sale-link {
            display: inline-block;
            width: 83px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .error-icon {
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            background: url('../../../../assets/error-icon2.png') no-repeat center center;
            background-size: cover;
            &:hover {
                box-shadow: 0 0 10px rgba(105, 105, 105, 1);
                border-radius: 50%;
                transform: scale(1.1);
                -ms-transform: scale(1.1); /* IE 9 */
                -moz-transform: scale(1.1); /* Firefox */
                -webkit-transform: scale(1.1); /* Safari 和 Chrome */
                -o-transform: scale(1.1);
            }
        }
    }
</style>
<script>
    import {
        api_put_allocation,
        url_put_allocation,
        api_get_currency,
        api_allocation_box_list
    } from "@/api/transfer-plan";
    import {url_allocation_export, api_allocation_export} from "@/api/allocation-logistics";
    import RequestButton from "@/global-components/request-button";
    import {downloadFile} from '@/lib/http';

    export default {
        permission: {
            url_put_allocation,
            url_allocation_export,
        },
        data() {
            return {
                visible: this.value,
                activeName: 'base_info',
                clickData: [],//当前行样式
                boxList: [],
                currencyList: [],
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            filterable(val) {
                if (val) return parseFloat(val).toFixed(3);
            },
            weightFilter(val) {
                if (val) return Number(parseFloat(val).toFixed(3));
            },
        },
        mounted() {
            this.init_currency_list();
        },
        methods: {
            init_currency_list() {
                this.$http(api_get_currency).then(res => {
                    this.currencyList = res.map(row => {
                        return {label: row.name, value: row.code}
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            open() {
                this.$http(api_allocation_box_list, this.action.id).then(res => {
                    this.boxList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            sure() {
                let params = this.get_params();

                let data = {
                    in_warehouse_id: params.in_warehouse_id,
                    out_warehouse_id: params.out_warehouse_id,
                    remark: params.remark,
                };
                if (this.action.value === 'reference') {
                    if (params.reference_id === '') {
                        this.$message({type: 'error', message: '请填写reference id'});
                        this.$reqKey('edit_reference_id', false);
                        return;
                    }
                    data.reference_id = params.reference_id;
                }
                if (this.action.value === 'edit_tracking') {
                    data.shipping_method = params.shipping_method;
                    data.shipping_fee = params.shipping_fee;
                    data.taxes = params.taxes;
                    data.reference_number = params.reference_number;
                    data.ien = params.ien;
                    data.currency_code = params.currency_code;
                    data.tracking_number = params.tracking_number;
                }
                this.$http(api_put_allocation, this.action.id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('edit_reference_id', false);
                    }, 200);
                });
            },
            get_params() {
                Object.keys(this.editData).forEach(key => {
                    if (typeof this.editData[key] === 'string') {
                        this.editData[key] = this.editData[key].trim();
                    }
                });
                return clone(this.editData);
            },
            close() {
                this.activeName = 'base_info';
                this.clickData = [];
            },
            add_class(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            handle_click() {
                this.activeName = 'base_info';
            },
            /* 导出装箱清单 */
            export_box_list() {
                this.$http(api_allocation_export, {allocation_id: this.action.id}).then(res => {
                    if(res.status===1){
                        this.$message({type:'success',message:res.message||res});
                        downloadFile({
                            url: config.apiHost+'downloadFile/downExportFile',
                            get:{file_code:res.file_code},
                            fileName:res.file_name,
                            suffix:'.xlsx',
                        });
                    }else{
                        this.$message({type:'error',message:res.message||res});
                    }
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                });
            }

        },
        computed: {
            isThirdSku() {
                return this.editData.is_third;
            },
            isFBA() {
                return this.editData.is_fba;
            },
            isEdit() {
                return this.action.value === 'edit_tracking';
            },
            baseHeads() {
                switch (true) {
                    case this.isThirdSku:
                        return [
                            {label: '图片', width: 7},
                            {label: 'SKU/SKU别名', width: 9},
                            {label: '第三方SKU', width: 8},
                            {label: '产品名称', width: 25},
                            {label: '产品物流属性', width: 6},
                            {label: '调拨数量', width: 4},
                            {label: '出库数量', width: 4},
                            {label: '出库货位号', width: 8},
                            {label: '成本', width: 6},
                            {label: '已入库数量', width: 4},
                            {label: '备货计划单号', width: 8},
                            {label: '退回数量', width: 4}
                        ];
                    case this.isFBA:
                        return [
                            {label: '图片', width: 7},
                            {label: 'SKU/SKU别名', width: 9},
                            {label: 'FNSKU', width: 8},
                            {label: '产品名称', width: 25},
                            {label: '产品物流属性', width: 6},
                            {label: '调拨数量', width: 4},
                            {label: '出库数量', width: 4},
                            {label: '出库货位号', width: 8},
                            {label: '成本', width: 6},
                            {label: '已入库数量', width: 4},
                            {label: '备货计划单号', width: 8},
                            {label: '退回数量', width: 4}
                        ];
                    default:
                        return [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '产品名称', width: 30},
                            {label: '产品物流属性', width: 8},
                            {label: '调拨数量', width: 5},
                            {label: '出库数量', width: 5},
                            {label: '出库货位号', width: 8},
                            {label: '成本', width: 6},
                            {label: '已入库数量', width: 6},
                            {label: '备货计划单号', width: 10},
                            {label: '退回数量', width: 4}
                        ]
                }
            },
            boxHeads() {
                switch (true) {
                    case this.isThirdSku:
                        return [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '第三方SKU', width: 10},
                            {label: '产品名称', width: 23},
                            {label: '英文品名', width: 8},
                            {label: 'HS Code', width: 8},
                            {label: '产品物流属性', width: 8},
                            {label: '销售链接', width: 13},
                            {label: '成本', width: 6},
                            {label: '出库数量', width: 6},
                        ];
                    case this.isFBA:
                        return [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: 'FNSKU', width: 10},
                            {label: '产品名称', width: 23},
                            {label: '英文品名', width: 8},
                            {label: 'HS Code', width: 8},
                            {label: '产品物流属性', width: 8},
                            {label: '销售链接', width: 13},
                            {label: '成本', width: 6},
                            {label: '出库数量', width: 6},
                        ];
                    default:
                        return [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '产品名称', width: 30},
                            {label: '英文品名', width: 10},
                            {label: 'HS Code', width: 8},
                            {label: '产品物流属性', width: 8},
                            {label: '销售链接', width: 14},
                            {label: '成本', width: 6},
                            {label: '出库数量', width: 6},
                        ]
                }
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
            editData: {},
            action: {},
        },
        components: {
            RequestButton,
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            uiTable: require('@/components/ui-table.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            integerInput: require('@/components/integer-input.vue').default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
        }
    }
</script>