<template>
    <page-dialog title="添加预报"
                 size="full"
                 class="p-inventory-check"
                 @open="open"
                 v-model="visible"
                 :close-on-click-modal="false">
        <div class="mt-xs ml-sm">
            <el-button type="primary" size="mini" @click="add_forecast">添加产品</el-button>
        </div>
        <el-table class="mt-xs scroll-bar"
                  v-resize="{height: 100}"
                  :data="tableData"
                  highlight-current-row>
            <el-table-column label="SKU">
                <template slot-scope="scope">
                    <el-input
                            v-if="!!scope.row.sku"
                            v-model="scope.row.third_sku">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="预报产品">
                <template slot-scope="scope">
                    <el-cascader
                            :options="forecastCategory"
                            v-model="scope.row.category"
                            filterable
                            @change="category_change(scope)">
                    </el-cascader>
                </template>
            </el-table-column>
            <el-table-column :render-header="is_require">
                <template slot-scope="scope">
                    <el-input
                            v-model="scope.row.title"
                            @blur="handle_change(scope, 'title')">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column width="80" :render-header="is_require">
                <template slot-scope="scope">
                    <el-input
                            v-model="scope.row.declared_value"
                            @blur="handle_change(scope, 'declared_value')">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column :render-header="is_require">
                <template slot-scope="scope">
                    <el-input
                            v-model="scope.row.declared_name_zh"
                            @blur="handle_change(scope, 'declared_name_zh')">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column :render-header="is_require">
                <template slot-scope="scope">
                    <el-input
                            v-model="scope.row.declared_name"
                            @blur="handle_change(scope, 'declared_name')">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column width="100" label="货物属性">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.contain_battery" @change="handle_change(scope, 'contain_battery')">
                        <el-option v-for="item in goods.props"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column width="80" :render-header="is_require">
                <template slot-scope="scope">
                    <el-input
                            v-model="scope.row.weight"
                            @blur="handle_change(scope, 'weight')">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="长宽高尺寸(cm)" width="120">
                <template slot-scope="scope">
                    <el-row class="goods-size">
                        <el-col :span="8">
                            <el-input
                                    class="inline"
                                    v-model="scope.row.length"
                                    @blur="handle_change(scope, 'length')">
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input
                                    :span="8"
                                    class="inline"
                                    v-model="scope.row.width"
                                    @blur="handle_change(scope, 'width')">
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input
                                    :span="8"
                                    class="inline"
                                    v-model="scope.row.height"
                                    @blur="handle_change(scope, 'height')">
                            </el-input>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="海关编码">
                <template slot-scope="scope">
                    <el-input
                            v-model="scope.row.hs_code"
                            @blur="handle_change(scope, 'hs_code')">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="产品图片" width="80">
                <template slot-scope="scope">
                    <div class="forecast-img-show" v-if="scope.row.sku">
                        <img :src="scope.row.thumb[0]" height="26px" width="26px">
                        <i class="el-icon-edit vertical_super" @click="mdf_child_img(scope.row)"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    width="80"
                    label="操作">
                <template slot-scope="scope">
                    <permission v-if="scope.row.sku" tag="ElButton"
                                :route="apis.url_forecast_detail"
                                type="text"
                                class="operation-color"
                                size="mini"
                                @click="delete_row(scope)">删除
                    </permission>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <request-button req-key="addForecast" @click="upload" :disabled="isUpload">确定上传预报</request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
        <add-goods v-model="goodsDialog" @add-goods="goods_submit" :warehouse="warehouse_type"
                   :is_multi_warehouse="is_multi_warehouse"></add-goods>
        <mdf-img :img-form="tempData"
                 :cur-sku="currentSku"
                 :goods-id="ids"
                 :baseUrl="baseUrl"
                 :img-length="12"
                 :img-number="12"
                 @mdfimg-submit="mdfimg_submit"
                 v-model="picVisible"></mdf-img>
    </page-dialog>
</template>

<style lang="stylus">
    .arrival-warning-color {
        color: #FF4949;
    }

    .goods-size {
        .el-col.el-col-8 {
            padding: 2px;
            input {
                padding: 0 3px;
            }
        }
    }

    .forecast-img-show {
        i {
            cursor: pointer;
        }
    }
</style>

<script>
    import {
        url_forecast_detail,
        api_add_forecast, //添加预报
    } from '@/api/warehouse-goods-forecast.js';

    export default {
        permission: {
            url_forecast_detail
        },
        data() {
            return {
                baseUrl: 'http://img.rondaful.com/',
                tableData: [],
                goodsDialog: false,
                forecastCollections: [],
                is_multi_warehouse: 0,
                ids: 0,
                isAdd: false,
                picVisible: false,
                visible: false,
                batchData: {
                    sku: '',
                    category: [],
                    sku_id: '',
                    third_sku: '',
                    goods_id: '',
                    cat_id_level0: '',
                    cat_id_level1: '',
                    cat_id_level2: '',
                    title: '',
                    weight: '',
                    length: '',
                    width: '',
                    contain_battery: '',
                    declared_value: '',
                    declared_name: '',
                    declared_name_zh: '',
                    hs_code: '',
                    thumb: [],
                },
                requires: ['title', 'declared_value', 'declared_name', 'declared_name', 'weight'],
                tempData: {},
                currentSku: '',
                goods: {
                    props: [
                        {
                            label: '普货',
                            value: '0'
                        },
                        {
                            label: '含电池',
                            value: '1'
                        },
                        {
                            label: '纯电池',
                            value: '2'
                        }
                    ]
                }
            }
        },
        methods: {
            open() {
                this.tableData = [];
            },
            upload() {
                this.isAdd = true;
                if (this.validate()) {
                    return;
                }
                this.add_category();
                let param = {warehouse_type: this.warehouse_type, sku_info: this.sku_info};
                this.$http(api_add_forecast, param).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.visible = false;
                    this.tableData = [];
                    this.isAdd = false;
                    this.$emit('upload-forecast');
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    this.isAdd = false;
                    setTimeout(() => {
                        this.$reqKey('addForecast', false);
                    }, 300)
                });
            },
            add_forecast() {
                this.goodsDialog = true;
            },
            goods_submit(val) {
                if (this.tableData.length === 0) {
                    this.tableData.push(window.clone(this.batchData));
                }

                val.forEach(res => {
                    let forecast = window.clone(this.batchData);
                    forecast.sku = res.sku;
                    forecast.third_sku = res.sku;
                    forecast.sku_id = res.sku_id;
                    forecast.goods_id = res.goods_id;
                    forecast.title = res.spu_name;
                    forecast.weight = res.weight;
                    forecast.length = res.length;
                    forecast.width = res.width;
                    forecast.height = res.height;
                    forecast.contain_battery = '0';
                    forecast.declared_value = res.usd_cost_price;
                    forecast.declared_name = res.declare_en_name;
                    forecast.declared_name_zh = res.declare_name;
                    forecast.hs_code = res.hs_code;
                    this.tableData.splice(1, 0, forecast);
                });
            },
            is_require(h, {column, $index}) {
                let label = '';
                switch ($index) {
                    case 2:
                        label = '产品名称';
                        break;
                    case 3:
                        label = '申报价值＄';
                        break;
                    case 4:
                        label = '中文申报品名';
                        break;
                    case 5:
                        label = '英文申报品名';
                        break;
                    case 7 :
                        label = '预报重量';
                        break;
                }
                return h(
                    'div',
                    [
                        h('span', {class: 'arrival-warning-color'}, '*'),
                        h('span', {}, label)
                    ]
                );
            },
            delete_row({row, $index}) {
                this.tableData.splice($index, 1);
            },
            mdfimg_submit(val) {
                let thumb = val.path.map(res => {
                    return `${res.base_url}${res.path}`.replace('.jpg', '_60x60.jpg');
                });
                this.tempData.thumb = thumb;
            },
            mdf_child_img(row) {
                this.currentSku = row.sku;
                this.ids = row.goods_id;
                this.picVisible = true;
                this.tempData = row;
            },
            handle_change({row, column, $index}, key) {// 批量操作
                if (key === 'category') {
                    console.log('chose category blur', row, column);
                }
                if ($index !== 0) return;
                let forecast = this.tableData[0];
                let value = forecast[key];
                if (value === '' || value.length === 0) return;
                if (key === 'declared_value' || key === 'weight') {
                    let validate = Number(value);
                    if (isNaN(validate) || validate < 0) {
                        this.$message({type: 'error', message: '请输入正确的不为负数的数字'});
                        this.tableData.splice(0, 1, window.clone(this.batchData));
                        return;
                    }
                }
                this.tableData.forEach((res, index) => {
                    if (index !== 0) {
                        res[key] = value;
                    }
                });
                this.tableData.splice(0, 1, window.clone(this.batchData));
            },
            category_change({row, column, $index}) {
                if ($index === 1) {
                    if (row.category[0] === -1) {
                        row.category = [];
                        return;
                    }
                }
                if ($index === 0) {
                    let forecast = this.tableData[0];
                    console.log('category change', forecast);
                    let value = forecast.category;
                    if (value.length === 0) return;
                    if (value[0] === -1) {
                        this.tableData[0].category = [];
                        return;
                    }
                    this.tableData.forEach((res, index) => {
                        if (index !== 0) {
                            res.category = value;
                        }
                    });
                    this.tableData.splice(0, 1, window.clone(this.batchData));
                } else {
                    if (row.category[0] === -1) {
                        row.category = this.tableData[$index - 1].category;
                    }
                }

            },
            validate() {
                return this.sku_info.some((res, index) => {
                    let rightNumber = this.right_number(res);
                    switch (true) {
                        case res.title === '':
                        case res.declared_value === '':
                        case res.declared_name === '':
                        case res.declared_name_zh === '':
                        case res.weight === '':
                        case rightNumber:
                            this.$message({
                                type: 'error',
                                message: `第${index + 1}行必填数据有误，请修改为有效值后提交`
                            });
                            return true;
                    }
                    return false;
                })
            },
            right_number(res) {//true为验证不通过，false为验证通过
                let value = Number(res.declared_value);
                let weight = Number(res.weight);
                if (isNaN(value) || value < 0 || isNaN(weight) || weight < 0) {
                    return true;
                }
                return false;
            },
            add_category() {
                this.sku_info.forEach(res => {
                    res.cat_id_level0 = res.category[0];
                    res.cat_id_level1 = res.category[1];
                    res.cat_id_level2 = res.category[2];
                });
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            }
        },
        computed: {
            sku_info() {
                return this.tableData && this.tableData.slice(1);
            },
            isUpload() {
                return this.isAdd || this.tableData.length <= 1;
            }
        },
        props: {
            value: {},
            warehouse_type: {},
            forecastCategory: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            addGoods: require('./add-goods.vue').default,
            mdfImg: require('./mdf-img.vue').default
        }
    }
</script>
