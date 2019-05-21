<template>
    <page-dialog v-model="visible" class="c-allocation-logistics-look" size="large" @open="open" @close="close"
                 :title="action.title">
        <table v-if="action.type === 'logistics'" class="right-table mb-sm" cellpadding="0" cellspacing="0">
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
                <td width="150">账号是否正规</td>
                <td width="150">{{editData.tax === 1 ? '正规': '不正规'}}</td>
                <td width="150">创建人</td>
                <td width="150">{{editData.create}}</td>
                <td width="150">创建时间</td>
                <td width="150">{{editData.create_time || '--'}}</td>
            </tr>
        </table>
        <table v-if="action.type === 'shipping'" class="right-table mb-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="100">调出仓库</td>
                <td width="150">{{editData.out_warehouse}}</td>
                <td width="100">调入仓库</td>
                <td width="150">
                    <span>{{editData.in_warehouse}}</span>
                </td>
                <td width="100">状态</td>
                <td width="100" style="position: relative">
                    {{editData.status_txt}}
                    <el-tooltip :content="row.reason" placement="right" effect="light"
                                v-if="editData.status === 2">
                        <span class="error-icon"></span>
                    </el-tooltip>
                </td>
                <td width="100">总箱数</td>
                <td width="100">{{editData.box_list.length}}</td>
            </tr>
            <tr>
                <td width="100">创建人</td>
                <td width="150">{{editData.create}}</td>
                <td width="100">创建时间</td>
                <td width="150">{{editData.create_time || '--'}}</td>
                <td width="100">交接人</td>
                <td width="100">{{editData.deliver_user}}</td>
                <td width="100">交接时间</td>
                <td width="100">{{editData.deliver_time || '--'}}</td>
            </tr>
        </table>

        <el-row class="mt-xs mb-xs" v-if="action.type === 'logistics'">
            <permission v-if="isLook" tag="ElButton"
                        @click.native="export_box_list"
                        :route="apis.url_allocation_export"
                        type="primary" size="mini">
                导出装箱单
            </permission>
        </el-row>
        <ui-table element-loading-text="玩命加载中..."
                  :has-data="editData.box_list.length>0"
                  :body-height="280"
                  :heads="boxHeads">
            <tbody>
            <template v-for="(box,index) in editData.box_list">
                <tr>
                    <td :colspan="10">
                        <el-row>
                            <el-col :span="10" class="t-left">
                                            <span class="ml-sm red bold-font">
                                                箱号：{{index + 1}}
                                            </span>
                                <span class="ml-sm red bold-font">
                                                箱唛：{{box.shipping_mark}}
                                            </span>
                            </el-col>
                            <el-col :span="5" class="t-left">
                                            <span class="ml-sm red bold-font">
                                                箱子重量：{{Number(parseFloat(box.box_weight).toFixed(3))}}KG
                                            </span>
                            </el-col>
                            <el-col :span="5" class="t-left">
                                            <span class="ml-sm red bold-font">
                                                箱子体积：{{`${box.length}*${box.width}*${box.height}`}}
                                            </span>
                            </el-col>
                            <el-col :span="4" class="t-left">
                                            <span class="ml-sm red bold-font">
                                                状态：{{box.status_txt}}
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
                        <td v-if="!isFBA">
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
            <label-item label="ReferenceID：" class="inline ml-sm">
                <span>{{editData.reference_id}}</span>
            </label-item>
            <div class="mt-xs">
                <el-row>
                    <label-item label="物流渠道：" class="inline">
                        <el-input v-if="isUpload" v-model="editData.shipping_method"></el-input>
                        <span v-else>{{editData.shipping_method}}</span>
                    </label-item>
                    <label-item label="" class="inline ml-sm">
                        <template v-if="isLook">
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
                        <span v-if="isLook">{{editData.tracking_number}}</span>
                        <el-input v-else v-model="editData.tracking_number"></el-input>
                    </label-item>
                    <label-item label="参考号：" class="inline ml-sm">
                        <span v-if="isLook">{{editData.reference_number}}</span>
                        <el-input v-else v-model="editData.reference_number"></el-input>
                    </label-item>
                    <label-item label="IEN：" class="inline ml-sm">
                        <span v-if="isLook">{{editData.ien}}</span>
                        <el-input v-else v-model="editData.ien"></el-input>
                    </label-item>
                </el-row>
            </div>
            <div class="mt-xs" v-if="isUpload">
                <label-item label="物流面单：">
                    <div class="file-btn"
                         v-if="files.length === 0">
                        选择文件
                        <input type="file"
                               ref="file"
                               :multiple="true"
                               @change="file_change">
                    </div>
                    <div v-else>
                        <el-tag class="mr-xs"
                                type="primary"
                                closable
                                v-for="(item, index) in files"
                                @close="barcode_close(index)"
                                :key="index">{{item.file.name}}
                        </el-tag>
                    </div>
                </label-item>
            </div>
        </div>
        <div class="fl-clear">
            <span class="mb-sm inline">备注：</span>
            <el-input
                    type="textarea"
                    :rows="2"
                    :disabled="true"
                    placeholder="请输入内容"
                    v-model="editData.remark">
            </el-input>
        </div>
        <div slot="footer">
            <request-button type="primary"
                            v-if="action.value !== 'look'"
                            req-key="api_allocation_logistics_upload"
                            size="mini" @click.native="sure">确定
            </request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-allocation-logistics-look {
        .right-table {
            width: 100%;
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
            background: url('../../../assets/error-icon2.png') no-repeat center center;
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
        api_allocation_detail,
        api_allocation_logistics_upload,
        url_allocation_logistics_upload,
        api_allocation_export,
        url_allocation_export,
    } from "@/api/allocation-logistics";
    import {api_get_currency} from "@/api/transfer-plan";
    import {downloadFile} from '@/lib/http';

    export default {
        permission: {
            url_allocation_export,
        },
        data() {
            return {
                visible: this.value,
                clickData: [],//当前行样式
                files: [],
                currencyList: [],
            }
        },
        filters: {
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            filterable(val) {
                if (val) return parseFloat(val).toFixed(2);
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
            },
            close() {
                this.files = [];
                this.clickData = [];
            },
            sure() {
                if (!this.validate()) {
                    this.$reqKey('api_allocation_logistics_upload', false);
                    return;
                }
                let searchData = clone(this.editData);
                let data = {
                    ien: searchData.ien,
                    reference_number: searchData.reference_number,
                    tracking_number: searchData.tracking_number,
                    currency_code: searchData.currency_code,
                    shipping_fee: searchData.shipping_fee,
                    taxes: searchData.taxes,
                    allocation_id: this.action.id,
                };
                let shipping_label = [];
                if (this.isUpload) {
                    data.shipping_method = searchData.shipping_method;
                    if (this.files.length === 0) {
                        this.upload(data);
                    } else {
                        this.files.forEach(({file}, index) => {
                            let barcode = {
                                content: '',
                                name: file.name
                            };
                            let reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = (e) => {
                                barcode.content = e.target.result;
                                shipping_label.push(barcode);
                                if (shipping_label.length === this.files.length) {
                                    data.shipping_label = shipping_label;
                                    this.upload(data);
                                }
                            };
                        });
                    }
                }
                if (this.isEdit) {
                    this.upload(data);
                }
            },
            upload(data) {
                this.$http(api_allocation_logistics_upload, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_allocation_logistics_upload', false);
                    }, 200);
                });
            },
            validate() {
                Object.keys(this.editData).forEach(key => {
                    if (typeof this.editData[key] === 'string') {
                        this.editData[key] = this.editData[key].trim();
                    }
                });
                if (this.isUpload) {
                    if (this.editData.shipping_method === '') {
                        this.$message({type: 'error', message: '请填写物流渠道'});
                        return false;
                    }
                }
                if (this.isEdit) {
                    if (this.editData.tracking_number === '') {
                        this.$message({type: 'error', message: '请填写运单号'});
                        return false;
                    }
                }
                return true;
            },
            add_class(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            file_change() {//附件选择
                const files = this.$refs.file.files;
                this.files = [];
                Object.keys(files).forEach(key => {
                    let file = files[key];
                    this.files.push({file: file, result: '', errors: []});
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            barcode_close(index) {// 商品条码删除
                this.files.splice(index, 1);
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
            isUpload() {
                return this.action.value === 'upload';
            },
            isEdit() {
                return this.action.value === 'edit';
            },
            isLook() {
                return this.action.value === 'look';
            },
            isFBA() {
                return this.editData.is_fba;
            },
            boxHeads() {
                switch (true) {
                    case !this.isFBA:
                        return [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 9},
                            {label: '第三方SKU', width: 9},
                            {label: '产品名称', width: 23},
                            {label: '英文品名', width: 8},
                            {label: 'HS Code', width: 8},
                            {label: '产品物流属性', width: 8},
                            {label: '销售链接', width: 8},
                            {label: '成本', width: 5},
                            {label: '出库数量', width: 6},
                        ];
                    case this.isFBA:
                        return [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 9},
                            {label: 'FNSKU', width: 9},
                            {label: '产品名称', width: 23},
                            {label: '英文品名', width: 8},
                            {label: 'HS Code', width: 8},
                            {label: '产品物流属性', width: 8},
                            {label: '销售链接', width: 8},
                            {label: '成本', width: 5},
                            {label: '出库数量', width: 6},
                        ];
                    default:
                        return [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '产品名称', width: 28},
                            {label: '英文品名', width: 10},
                            {label: 'HS Code', width: 8},
                            {label: '产品物流属性', width: 8},
                            {label: '销售链接', width: 8},
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