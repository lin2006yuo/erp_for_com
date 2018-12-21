<template>
    <page class="p-base-info">
        <el-form ref="form1" :model="expressData" label-width="180px">
            <el-form-item label="面单长度：">
                <el-row>
                    <el-col :span="curSpan">
                        <ui-input :min="0" type="Number" @input="number('label_lenght')"
                                  v-model="expressData.label_lenght" :edit="editable"></ui-input>
                    </el-col>
                    <el-col :span="comSpan">
                        <span>mm</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="面单宽度：">
                <el-row>
                    <el-col :span="curSpan">
                        <ui-input :min="0" type="Number" @input="number('label_width')"
                                  v-model="expressData.label_width" :edit="editable"></ui-input>
                    </el-col>
                    <el-col :span="comSpan">
                        <span>mm</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="面单打印反向：">
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="expressData.label_direction"
                                   :disabled="!editable">
                            <el-option v-for="item in label_directions"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="下单失效时间：">
                <el-row>
                    <el-col :span="curSpan">
                        <ui-input type="Number" v-model="expressData.upload_expire_day" :edit="editable"></ui-input>
                    </el-col>
                    <span class="red ml-xs">0不失效,其他时间是失效天数</span>
                </el-row>
            </el-form-item>
            <el-form-item label="允许下单次数：">
                <el-row>
                    <el-col :span="curSpan">
                        <ui-input type="Number" v-model="expressData.download_count" :edit="editable"></ui-input>
                    </el-col>
                    <span class="red ml-xs">0不限制,默认为1</span>
                </el-row>
            </el-form-item>
            <el-form-item label="拣货分类：">
                <el-row>
                    <el-col :span="curSpan">
                        <div v-if="expressData.special_picking_details.length === 0"></div>
                        <div v-else>
                            <label-item v-for="item in expressData.special_picking_details"
                                        :label="item.warehouse_name"
                                        :label-width="100"
                                        label-align="left"
                                        :key="item.warehouse_id">
                                <el-select v-model="item.special_picking"
                                           :disabled="!editable">
                                    <el-option v-for="item in specialPickingList"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value"></el-option>
                                </el-select>
                            </label-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="称重生成发票：">
                <el-radio-group v-model="expressData.invoice" :disabled="!editable">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="面单是否需要报关信息：" required>
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="expressData.is_declared_info"
                                   ref="declared"
                                   v-mouse-side.mousewheel="()=>{$refs.declared.visible=false}"
                                   :disabled="!editable">
                            <el-option v-for="item in declaredInfoList"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="面单显示条码：" required>
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="expressData.label_used_number"
                                   ref="number"
                                   v-mouse-side.mousewheel="()=>{$refs.number.visible=false}"
                                   :disabled="!editable">
                            <el-option v-for="item in labelUsedNumber"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="面单来源类型：" required>
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="expressData.label_source_type"
                                   ref="source"
                                   v-mouse-side.mousewheel="()=>{$refs.source.visible=false}"
                                   :disabled="!editable">
                            <el-option v-for="item in labelUsedType"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="面单序列号：">
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="expressData.sequence_number"
                                   filterable
                                   v-mouse-side.mousewheel="()=>{$refs.source.visible=false}"
                                   :disabled="!editable">
                            <el-option v-for="item in shippingMethod"
                                       :label="item.value"
                                       :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="面单水印坐标：" class="coordinate-data">
                <label-item label="default：" label-width="70">
                    <span style="margin-left: 70px">x：</span>
                    <integer-input v-model="expressData.coordinate_data.default.x"
                                   :min="0"
                                   :max="100"
                                   class="inline"
                                   :disabled="!editable"></integer-input>
                    <span>%</span>
                    <label>&nbsp;--&nbsp;</label>
                    <span>y：</span>
                    <integer-input v-model="expressData.coordinate_data.default.y"
                                   :min="0"
                                   :max="100"
                                   class="inline"
                                   :disabled="!editable"></integer-input>
                    <span>%</span>
                    <el-button v-if="editable" type="primary" class="ml-xs"
                               @click.native="add_coordinate" icon="plus"></el-button>
                </label-item>
                <label-item v-for="(coordinate, key) in expressData.coordinate_data"
                            v-if="key !== 'default'"
                            :label="`${key}：`"
                            label-width="70"
                            class="mb-xs"
                            label-align="left"
                            :key="key">
                    <span>x：</span>
                    <integer-input v-model="coordinate.x"
                                   :min="0"
                                   :max="100"
                                   class="inline"
                                   :disabled="!editable"></integer-input>
                    <span>%</span>
                    <label>&nbsp;--&nbsp;</label>
                    <span>y：</span>
                    <integer-input v-model="coordinate.y"
                                   :min="0"
                                   :max="100"
                                   class="inline"
                                   :disabled="!editable"></integer-input>
                    <span>%</span>
                    <el-button v-if="editable" type="primary" class="ml-xs"
                               @click.native="delete_coordinate(key)" icon="minus"></el-button>
                </label-item>
            </el-form-item>
            <el-form-item label="面单水印字号：">
                <el-row>
                    <el-col :span="curSpan">
                        <integer-input v-model="expressData.label_font_size"
                                       :min="0"
                                       :max="100"
                                       class="inline"
                                       :disabled="!editable"></integer-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <!--<el-form-item label="面单序列号横坐标：">
                <el-row>
                    <el-col :span="curSpan">
                        <el-input v-model="expressData.coordinate_x"
                                  :disabled="!editable"></el-input>
                    </el-col>
                    <el-col :span="comSpan">
                        <span>%</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="面单序列号纵坐标：">
                <el-row>
                    <el-col :span="curSpan">
                        <el-input v-model="expressData.coordinate_y"
                                  :disabled="!editable"></el-input>
                    </el-col>
                    <el-col :span="comSpan">
                        <span>%</span>
                    </el-col>
                </el-row>
            </el-form-item>-->

            <el-form-item label="可合并集包邮寄方式：">
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="expressData.merge_collection_ids" multiple placeholder="请选择"
                                   class="s-width-large merge-able" :disabled="!editable">
                            <el-option
                                    v-for="item in shortnameMethod"
                                    :key="item.value"
                                    :disabled="item.disabled"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <add-country ref="addCountry" v-model="countryVisible" @get-country="get_country"></add-country>
    </page>
</template>
<style lang="stylus">
    .p-base-info {
        padding: 5px 35px 5px 0;
        .form1 {
            .el-row {
                margin-bottom: 8px;
            }
        }
        .account {
            display: inline-block;
            width: 80px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
        }
        .el-select__tags {
            height: 30px !important;
            overflow-y: auto;
            > span {
                white-space: inherit;
            }
        }
        .merge-able {
            .el-input {
                width: 300px;
            }
        }
        .coordinate-data {
            .c-label-item {
                display: block;
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                curSpan: 5,
                declaredInfoList: [{label: "需要", value: 1}, {label: "不需要", value: 0}],
                labelUsedNumber: [{label: "跟踪号", value: 1}, {label: "物流商单号", value: 2}, {label: "包裹号", value: 3}],
                labelUsedType: [{label: "自制模板", value: 1}, {label: "物流商API接口获取", value: 2}],
                // specialPickingList:[{label:"混合拣货",value:0},{label:"特殊拣货",value:1},{label:"单独拣货",value:2}],
                rules: {},
                shortname_method: '',
                label_directions: [{label: "纵向", value: 1}, {label: "横向", value: 2}],
                countryVisible: false,
            }
        },
        methods: {
            number(val) {
                if (Number(this.expressData[val]) < 0) {
                    this.expressData[val] = '0';
                }
            },
            add_coordinate() {
                this.countryVisible = true;
            },
            get_country(index, array) {
                array.forEach(row => {
                    if (!this.expressData.coordinate_data.hasOwnProperty(row.country_code)) {
                        let coordinate = {x: '', y: ''};
                        this.$set(this.expressData.coordinate_data, row.country_code, coordinate);
                    }
                });
            },
            delete_coordinate(key) {
                this.$delete(this.expressData.coordinate_data, key);
            }
        },
        watch: {
            expressData(val) {
                console.log('expressData', val);
            }
        },
        computed: {
            cols() {
                let col = 0;
                this.expressData.channels.forEach(row => {
                    let length = row.info.length;
                    if (length > col) {
                        col = length
                    }
                });
                return col;
            },
            comSpan() {
                return 24 - this.curSpan;
            },
        },
        filters: {
            filterNumber(val) {
                if (val === '0') {
                    return '';
                } else {
                    return val;
                }
            },
        },
        props: {
            expressData: {},
            editable: {
                required: true,
                type: Boolean
            },
            shippingMethod: {
                type: Array
            },
            shortnameMethod: {
                type: Array
            },
            specialPickingList: {}
        },
        components: {
            card: require('@/components/card.vue').default,
            uiInput: require('@/components/ui-input.vue').default,
            selectText: require("@/components/select-text.vue").default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            addCountry: require('./add-country.vue').default,
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>
