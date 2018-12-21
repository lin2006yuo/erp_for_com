<template>
    <page class="p-dialog">
        <page-dialog :title="title" v-model="dialog" :size="size" :close-on-click-modal="false" @change="change_dialog">
            <div style="width: 100%;text-align: center;">
                <label-item label="预警数量：" class="mb-xs label_one" v-if="valueShow===1">
                    <integer-input v-model="number" :min="0"></integer-input>
                </label-item>
                <label-item label="调出平台：" class="mb-xs dis_block" v-if="valueShow===3">
                    <el-select class="inline" v-model="from_channel_id" placeholder="请选择" style="width: 169px;">
                        <el-option
                                v-for="item in channelList"
                                :key="item.value"
                                :disabled="item.value===to_channel_id"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="借入平台：" class="mb-xs dis_block" v-if="valueShow===3">
                    <el-select class="inline" v-model="to_channel_id" placeholder="请选择" style="width: 169px;">
                        <el-option
                                v-for="item in channelList"
                                :disabled="item.value===from_channel_id"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="借调数量：" class="mb-xs dis_block" v-if="valueShow===3">
                    <integer-input v-model="quantity" :min="0"></integer-input>
                </label-item>
                <div v-if="valueShow===2" style="text-align: left;">
                    <el-row>
                        <label-item label="备货平台：" class="inline">
                            <el-select class="inline width-sm"
                                       v-model="channel_id"
                                       :disabled="channelDisable"
                                       placeholder="请选择">
                                <el-option
                                        v-for="item in channelList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </label-item>
                        <label-item label="备货中转仓：" class="inline ml-sm">
                            <el-select v-model="transit_warehouse_id" class="width-super">
                                <el-option v-for="item in warehouses"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value">
                                </el-option>
                            </el-select>
                        </label-item>
                    </el-row>
                    <el-button size="mini" type="primary" class="mb-mini mt-mini" @click="add_data">添加</el-button>
                    <el-button size="mini" type="primary" class="mb-mini mt-mini" @click="delete_data">删除<span
                            v-if="deleteNumber">({{deleteNumber}})</span></el-button>
                    <el-table :data="channelData"
                              class="scroll-bar"
                              v-resize="{height: 150}"
                              @selection-change="select_delete">
                        <el-table-column align="center" type="selection"></el-table-column>
                        <el-table-column
                                align="center"
                                inline-template
                                width="100"
                                label="图片">
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                                <span slot="reference">
                                    <img v-lazy="row.thumb" v-if="row.thumb" height="60px" width="60px"
                                         style="border:none">
                                </span>
                            </el-popover>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                width="150"
                                label="SKU">
                            <div>
                                <ui-tip :content="row.sku" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                label="商品名称">
                            <div>
                                {{row.spu_name}}
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                width="100"
                                label="备货数量">
                            <div>
                                <integer-input v-model="row.quantity" :min="0"></integer-input>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                width="200"
                                v-if="channel_id===2"
                                label="条形码号">
                            <div>
                                <el-input v-model="row.barcode"></el-input>
                            </div>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="saveAdd" @click="save" v-if="valueShow===1">确定</request-button>
                <request-button req-key="submitStock" @click="submit" v-if="valueShow===2">提交</request-button>
                <request-button req-key="get_lendAdd" @click.native="get_lend" v-if="valueShow===3">确定</request-button>
                <el-button size="mini" @click.native="dialog=false" v-if="valueShow!==3">关闭</el-button>
                <el-button size="mini" @click.native="dialog=false" v-if="valueShow===3">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .label_one {
        display: block;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .dis_block {
        display: block;
        margin: 25px;
    }
</style>
<script>
    import {api_get_channel} from '@/api/request-note';
    import {api_warehous_transit} from '@/api/entrepot-picking';

    export default {
        data() {
            return {
                dialog: false,
                number: '',
                channel_id: '',
                from_channel_id: '',
                to_channel_id: '',
                transit_warehouse_id: '',
                quantity: '',
                channelList: [],
                size: 'small',
                selectIds: [],
                warehouses: [],
            }
        },
        created() {
            this.get_channel();
            this.warehouses_init();
        },
        mounted() {
        },
        methods: {
            warehouses_init() {
                this.$http(api_warehous_transit).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.');
                }
                return ""
            },
            get_channel() {
                this.$http(api_get_channel, {}).then(res => {
                    this.channelList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            add_data() {
                this.$emit('add-data');
            },
            save() {
                this.$emit('save-alert', this.number);
            },
            get_lend() {
                let data = {
                    from_channel_id: this.from_channel_id,
                    to_channel_id: this.to_channel_id,
                    quantity: this.quantity,
                };
                this.$emit('save-lend', data);
            },
            submit() {
                if (this.channel_id === '') {
                    this.$message({type: 'warning', message: `备货平台不能空`});
                    this.$reqKey(`submitStock`, false);
                    return;
                }
                let find = this.channelData.find(row => {
                    return row.quantity === '0';
                });
                if (!!find) {
                    this.$message({type: 'warning', message: `备货数量不能为0`});
                    this.$reqKey(`submitStock`, false);
                    return;
                }
                let quantity = this.channelData.find(row => {
                    return row.quantity === '';
                });
                if (!!quantity) {
                    this.$message({type: 'warning', message: `备货数量不能为空`});
                    this.$reqKey(`submitStock`, false);
                    return;
                }
                if (this.channel_id === 2) {
                    let barcode = this.channelData.find(row => {
                        return row.barcode === '';
                    });
                    if (!!barcode) {
                        this.$message({type: 'warning', message: `条形码号不能为空`});
                        this.$reqKey(`submitStock`, false);
                        return;
                    }
                }
                let details = [];
                details = this.channelData.map(res => {
                    typeof res.barcode === 'string' && (res.barcode = res.barcode.trim());
                    return {
                        sku_id: res.sku_id,
                        quantity: res.quantity,
                        barcode: res.barcode,
                    }
                });
//                console.log(details);
                let data = {
                    details: details,
                    channel_id: this.channel_id,
                    transit_warehouse_id: this.transit_warehouse_id
                };
                this.$emit('save-apply', data)
            },
            change_dialog(val) {

            },
            delete_data() {
                this.selectIds.forEach(res => {
                    this.channelData.forEach((row, index) => {
                        if (row.sku_id === res) {
                            this.channelData.splice(index, 1);
                        }
                    });
                });
            },
            select_delete(val) {
                this.selectIds = val.map(res => {
                    return res.sku_id;
                });
                console.log(this.selectIds);
            },
        },
        filters: {},
        watch: {
            dialog(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.dialog = val;
                this.quantity = '';
                this.transit_warehouse_id = '';
                if (this.channelDisable) {
                    this.channel_id = 2;
                } else {
                    this.channel_id = '';
                }
                if (this.valueShow === 2) {
                    this.size = 'large';
                } else {
                    this.size = 'small';
                }
            },
            alertQuantity(val) {
                if (val) {
                    this.number = val;
                }
            },
            channelData(val) {
                if (val.length > 0) {
                    this.channelData.forEach(res => {
                        this.$set(res, 'quantity', '');
                        this.$set(res, 'barcode', '');
                    })
                }
            }
        },
        computed: {
            deleteNumber() {
                if (this.selectIds.length > 0) {
                    return this.selectIds.length;
                } else {
                    return '';
                }
            }
        },
        props: {
            value: {},
            title: {},
            valueShow: {},
            alertQuantity: {},
            channelData: {},
            channelDisable: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
