<template>
    <div v-loading="loading" class="p-card-list" element-loading-text="玩命加载中...">
        <el-tabs v-model="activeName">
            <el-tab-pane label="物流商API" name="shipApi">
                <el-form ref="shipForm" :model="shipForm" label-width="120px">
                    <el-form-item :label="data.name+'：'"
                                  v-for="(data,index) in shipForm.api_info"
                                  :key="index">
                        <el-col :span="12">
                            <el-input v-model="data.value" :key="index"
                                      :disabled="isEdit" v-if="data.type === 'input'"></el-input>
                            <el-button type="primary" size="mini" :disabled="isEdit" @click="get_token(data)"
                                       v-else>{{data.name}}
                            </el-button>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="物流商信息" name="shipMes">
                <ui-form :model="shipForm" :rules="rules" ref="shipForm" label-width="120px">
                    <ui-form-item label="物流简称：" class="inline">
                        <el-input v-model="shipForm.shortname" :disabled="isEdit"></el-input>
                    </ui-form-item>
                    <ui-form-item label="物流代码：" class="inline">
                        <el-input v-model="shipForm.code" :disabled="isEdit"></el-input>
                    </ui-form-item>

                    <ui-form-item label="物流全名：" class="inline">
                        <el-input v-model="shipForm.fullname" :disabled="isEdit"></el-input>
                    </ui-form-item>
                    <ui-form-item label="物流站点：" class="inline">
                        <el-input v-model="shipForm.website" :disabled="isEdit"></el-input>
                    </ui-form-item>

                    <ui-form-item label="联系人名称：" class="inline">
                        <el-input v-model="shipForm.contact" :disabled="isEdit"></el-input>
                    </ui-form-item>
                    <ui-form-item label="联系电话：" prop="telephone" localtion="right" :bubble="true"
                                  class="inline">
                        <el-input v-model="shipForm.telephone" :disabled="isEdit"></el-input>
                    </ui-form-item>

                    <ui-form-item label="物流类型：" class="inline">
                        <el-select v-model="shipForm.type" :disabled="isEdit" style="width:153px">
                            <el-option v-for="item in types"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </ui-form-item>
                    <ui-form-item label="接口编码：" class="inline">
                        <el-select v-model="shipForm.index" :disabled="isEdit" style="width:153px">
                            <el-option v-for="item in index"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </ui-form-item>

                    <el-row>
                        <ui-form-item label="状态：" class="inline">
                            <el-select v-model="shipForm.status" :disabled="isEdit" style="width:153px">
                                <el-option v-for="item in status"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"
                                ></el-option>
                            </el-select>
                        </ui-form-item>
                        <ui-form-item label="面单序列号：" class="inline">
                            <el-select v-model="shipForm.sequence_number" :disabled="isEdit" style="width:153px">
                                <el-option v-for="item in sequenceNumList"
                                           :label="item.value"
                                           :value="item.value"
                                           :key="item.value"
                                ></el-option>
                            </el-select>
                        </ui-form-item>
                    </el-row>
                    <ui-form-item label="收件地址：">
                        <el-col :span="16">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 1, maxRows: 4}"
                                    placeholder="请输入..."
                                    v-model="shipForm.address" :disabled="isEdit">
                            </el-input>
                        </el-col>
                    </ui-form-item>
                    <ui-form-item style="margin-top: 5px;">
                        <div v-if="isEdit==false&&butMark==false">
                            <permission tag="ElButton" type="primary" @click.native="save" size="mini"
                                        :disabled="isSave" :route="apis.url_logistics_add">确定
                            </permission>
                            <el-button @click.native="cancel" size="mini">取 消</el-button>
                        </div>
                        <div v-if="butMark==true">
                            <permission tag="ElButton" type="primary" @click.native="update" size="mini"
                                        :disabled="isSave" :route="apis.url_logistics_update">修改
                            </permission>
                            <el-button @click.native="update_cancel" size="mini">取 消</el-button>
                        </div>
                        <el-button type="primary" v-if="isEdit==true" @click.native="edit" size="mini">编辑
                        </el-button>
                    </ui-form-item>
                </ui-form>
            </el-tab-pane>
            <el-tab-pane label="邮寄方式" name="shipWay">
                <div class="mb-sm fr">
                    <el-input class="inline width-super" placeholder="请输入名称/代码..." @keyup.enter.native="search"
                              v-model="params.snText"></el-input>
                    <el-button class="ml-sm" type="primary" size="mini inline" @click.native="search" icon="search">搜索
                    </el-button>
                    <el-button type="primary" size="mini inline" @click="synchronization">同步邮寄方式</el-button>
                    <el-button type="primary" size="mini inline" @click="add_logistics">添加</el-button>
                </div>
                <el-table :data="tempData" class="scroll-bar" v-resize="{height: 41}" highlight-current-row>
                    <el-table-column prop="code" label="代码" align="center" width="180"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column inline-template label="名称" align="center" show-overflow-tooltip>
                        <div>{{row.shortname}}</div>
                    </el-table-column>
                    <el-table-column inline-template label="状态" align="center" width="100">
                        <div>
                            <permission tag="ElSwitch"
                                        :key="row.shortname"
                                        v-model="row.status"
                                        :on-text="state[0]"
                                        :off-text="state[1]"
                                        on-color="#20a0ff"
                                        off-color="#C0CCDA"
                                        @change="change_status(row)"
                                        :route="apis.url_logistics_enabled">
                            </permission>
                        </div>
                    </el-table-column>
                    <el-table-column inline-template label="操作" align="center" width="210">
                        <div>
                            <span class="operate" @click="look_operate(row)">查看</span>
                            <permission tag="span" :route="apis.url_logistics_base_keep">&nbsp;|&nbsp;</permission>
                            <permission tag="span" class="operate" @click="edit_operate(row)"
                                        :route="apis.url_logistics_base_keep">修改
                            </permission>
                            <permission tag="span" :route="apis.url_shipping_method_log">&nbsp;|&nbsp;</permission>
                            <permission tag="span" class="operate" @click="look_log(row)"
                                        :route="apis.url_shipping_method_log">操作日志
                            </permission>
                            <permission tag="span" :route="apis.url_ali_address" v-if="isAddressEdit">&nbsp;|&nbsp;
                            </permission>
                            <permission tag="span" class="operate" @click="look_address(row)"
                                        v-if="isAddressEdit"
                                        :route="apis.url_ali_address">查看地址
                            </permission>
                            <permission tag="span" :route="apis.url_ali_address" v-if="isAddressEdit">&nbsp;|&nbsp;
                            </permission>
                            <permission tag="span" class="operate" @click="edit_address(row)"
                                        v-if="isAddressEdit"
                                        :route="apis.url_ali_address">设置地址
                            </permission>
                        </div>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <el-pagination v-if="activeName === 'shipWay'"
                       @size-change="$listeners['size-change']"
                       @current-change="$listeners['cur-change']"
                       :current-page="params.page"
                       :page-sizes="[20, 50, 100, 200,500]"
                       :page-size="params.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="shipForm.shipCount"
                       class="t-right mt-sm">
        </el-pagination>
        <add-logistics v-model="addShow" :form="form" @confirm="confirm"></add-logistics>
        <operate-dialog v-model="operateShow" :operateId="operate_id"></operate-dialog>
        <look-edit v-model="editVisible"
                   ref="look_edit"
                   :editable="editable"
                   :title="shipForm.fullname"
                   :base-data="baseData"
                   :express-data="expressData"
                   :channel-data="channelData"
                   :special-picking-list="specialPickingList"
                   :shipping-method="shippingMethod"
                   :shortname-method="shortnameMethod"
                   @update-name="update_name"
                   @close_edit="close_edit"
                   @files-success="files_success"
                   :eff-data="effData"></look-edit>
        <discontinue-shipping v-model="discontinuationVisible" :action="action" @cancel="cancel_discontinue"
                              @sure="sure_discontinue"></discontinue-shipping>
        <address-update v-model="editAddressVisible" :ali-info="aliInfo" :loading="addressLoading"
                        @close="address_close" :editable="addressEditable"></address-update>
    </div>
</template>
<style lang="stylus">
    .p-card-list {
        .tab-head {
            .body {
                padding-top: 30px;
                padding-bottom: 0;
                background-color: rgba(228, 232, 241, 0.8);
            }
        }
    }
</style>
<script>
    import {phone} from '@/define/validator_reg';
    import {
        api_base,
        api_shipping_method,
        api_shortname_method,
        logistics_shipping,
        api_effective,
        api_logistics_channel,
        logistics_enabled,
        logistics_type,
        api_add_logistics,
        api_ali_address,
        api_shipping_token_url,
        api_wish_authors,
        api_shipping_wangjipost_url,
        api_wangji_authors,
        api_express,
        api_special_list,
        url_shipping_method_log,
        url_logistics_add,
        url_logistics_update,
        url_logistics_enabled,
        url_logistics_base_keep,
        url_ali_address
    } from "@/api/setLogistics";
    import {http} from "@/lib/http-plus";
    import {api_get_shipping_by_collector} from "@/api/collector";

    export default {
        permission: {
            url_logistics_add,
            url_logistics_update,
            url_logistics_enabled,
            url_logistics_base_keep,
            url_shipping_method_log,
            url_ali_address
        },
        data() {
            var checkPhone = (rule, value, callback) => {
                setTimeout(() => {
                    if (!phone.test(value)) {
                        callback(new Error('电话/手机格式错误！'));
                    } else {
                        callback();
                    }
                }, 1000);
            }
            return {
                activeName: 'shipMes',
                editable: false,
                addressEditable: false,
                operateShow: false,
                editVisible: false,
                discontinuationVisible: false,
                addShow: false,
                editAddressVisible: false,
                addressLoading: false,
                isShow: true,
                shipment: true,
                basis: true,
                operate_id: '',
                baseData: {},
                shippingData: [],
                expressData: {},
                channelData: {},
                effData: {},
                shippingMethod: [],
                shortnameMethod: [],
                specialPickingList: [],
                status: [
                    {label: "启用", value: 1},
                    {label: "停用", value: 0}
                ],
                state: ['启用', '停用'],
                types: [
                    {label: "API对接物流商", value: 1},
                    {label: "无对接物流商", value: 0}
                ],
                index: [],
                rules: {
                    telephone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                form: {
                    code: '',
                    shortname: '',
                    system_code: '',
                    carrier_id: '',
                    period_type: '',
                    has_tracking_number: '',
                },
                tempsData: {
                    zero: [{
                        earliest_days: "",
                        latest_days: "",
                        shipping_method_id: "",
                        first_weight: "",
                        first_fee: '',
                        additional_weight: '',
                        additional_fee: '',
                        max_weight: '',
                        is_volumn_weight: false,
                        volumn_weight: '',
                        is_oli_additional: false,
                        oli_additional_fee: '',
                        is_stage_fee: false,
                        is_registered_fee: false,
                        registered_fee: '',
                        stages: [],
                    }],
                    one: [{
                        earliest_days: "",
                        latest_days: "",
                        shipping_method_id: "",
                        first_weight: "",
                        first_fee: '',
                        additional_weight: '',
                        additional_fee: '',
                        max_weight: '',
                        is_volumn_weight: false,
                        volumn_weight: '',
                        is_oli_additional: false,
                        oli_additional_fee: "",
                        is_stage_fee: false,
                        is_registered_fee: false,
                        registered_fee: '',
                        stages: [],
                        allow_properties: [],
                        deny_properties: [],
                    },
                        {
                            earliest_days: "",
                            latest_days: "",
                            shipping_method_id: "",
                            first_weight: "",
                            first_fee: '',
                            additional_weight: '',
                            additional_fee: '',
                            max_weight: '',
                            is_volumn_weight: false,
                            volumn_weight: '',
                            is_oli_additional: false,
                            oli_additional_fee: '',
                            is_stage_fee: false,
                            is_registered_fee: false,
                            registered_fee: '',
                            stages: [],
                            locations: [],
                            allow_properties: [],
                            deny_properties: [],
                        }
                    ],
                    two: []
                },
                searchText: '',
                action: {},
                aliInfo: {
                    id: '',
                    ali_address: [],
                },
            }
        },
        mounted() {
            this.$http(logistics_type).then(res => {
                this.index = res.map(data => {
                    return {
                        label: data,
                        value: data
                    }
                });
            }).catch(code => {
                this.$message({
                    type: "error",
                    message: code.message || code
                });
            });
            this.shippingData = window.clone(this.tempData);
            this.get_special_list();
        },
        methods: {
            close_edit() {
                this.shortnameMethod = [];
            },
            look_log(row) {
                this.operate_id = row.id;
                this.operateShow = true;
            },
            files_success(id) {
                this.get_information(id);
            },
            update_name(id, name) {
                this.tempData.forEach(res => {
                    if (res.id === id) {
                        res.shortname = name;
                    }
                });
            },
            add_logistics() {
                this.form = {
                    code: '',
                    shortname: '',
                    system_code: '',
                    carrier_id: '',
                    period_type: '',
                    has_tracking_number: '',
                };
                this.addShow = true;
            },
            confirm(val) {
                this.$set(val, 'carrier_id', this.fullnameId);
                this.$http(api_add_logistics, val).then(res => {
                    this.$set(val, 'id', parseInt(res.id));
                    this.$set(val, 'status', 0);
                    this.tempData.push(val);
                    this.$message({type: 'success', message: res.message || res});
                    this.addShow = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            get_token(row) {
                if (this.shipForm.index === 'Wish' || this.shipForm.index === 'Wangji') {
                    this.shipForm.api_info.forEach(row => {
                        if (typeof row.value === 'string') {
                            row.value = row.value.trim();
                        }
                    });
                    let client_id = this.shipForm.api_info.find(row => {
                        return row.field === 'interface_user_name'
                    });
                    let client_secret = this.shipForm.api_info.find(row => {
                        return row.field === 'interface_user_key'
                    });
                    let code = this.shipForm.api_info.find(row => {
                        return row.field === 'auth_code'
                    });
                    let redirect_uri = this.shipForm.api_info.find(row => {
                        return row.field === 'redirect_uri'
                    });
                    let data = {
                        id: this.shipForm.id,
                        client_id: client_id.value,
                        client_secret: client_secret.value,
                        code: code.value,
                        redirect_uri: redirect_uri.value,
                    };
                    let url = this.shipForm.index === 'Wish' ? api_shipping_token_url : api_shipping_wangjipost_url;
                    let authors = this.shipForm.index === 'Wish' ? api_wish_authors : api_wangji_authors;
                    if (row.name === '获取授权码') {
                        this.$http(url, data).then(res => {
                            window.open(res.auth_url)
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code})
                        })
                    } else {
                        if (!data.code || !data.client_id || !data.client_secret) {
                            this.$message({type: "error", message: '请填写完整的授权信息'});
                            return false;
                        }
                        this.$http(authors, data).then(res => {
                            this.$message({type: "success", message: res.message || res});
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        })
                    }
                }
            },
            //同步邮寄方式
            synchronization() {
                let data = {
                    id: this.fullnameId
                }
                this.$http(logistics_shipping, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
            },
            edit() {//----编辑
                this.$emit('edit')
            },
            save() {//---保存

                this.$refs.shipForm.validate((valid) => {
                    if (valid) {
                        Object.keys(this.shipForm).forEach(key => {
                            if (typeof this.shipForm[key] === 'string') {
                                this.shipForm[key] = this.shipForm[key].trim();
                            }
                        });
                        this.$emit('save', this.shipForm)
                    } else {
                        return false;
                    }
                });
            },
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            update() {//----修改
                this.$refs.shipForm.validate((valid) => {
                    if (valid) {
                        Object.keys(this.shipForm).forEach(key => {
                            if (typeof this.shipForm[key] === 'string') {
                                this.shipForm[key] = this.shipForm[key].trim();
                            }
                        });
                        this.$emit('update', this.shipForm)
                    } else {
                        return false;
                    }
                });
            },
            cancel() {//----取消
                this.$refs.shipForm.resetFields();
                this.$emit('cancel')
            },
            update_cancel() {//----取消修改
                this.$refs.shipForm.resetFields();
                this.$emit('update-cancel')
            },
            change_status(row) {
                console.log('change status', row);
                row.status ? this.discontinue(row) : this.start_using(row);
            },
            start_using(row) {
                this.$confirm(`您将启用${row.shortname}，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let params = {
                        id: row.id,
                        status: 1,
                        stop_pickup_time: 0
                    };
                    this.$http(logistics_enabled, row.id, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                    }).catch(code => {
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: code.message || code
                        });
                        row.status = !row.status
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消启用'
                    });
                    row.status = !row.status
                });
            },
            discontinue(row) {
                this.discontinuationVisible = true;
                this.action = row;
            },
            sure_discontinue(stop_pickup_time) {
                let params = {
                    id: this.action.id,
                    status: 0,
                    stop_pickup_time: stop_pickup_time
                };
                this.$http(logistics_enabled, this.action.id, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.discontinuationVisible = false;
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: code.message || code
                    });
                    this.action.status = !this.action.status
                })
            },
            cancel_discontinue() {
                this.$message({
                    type: 'info',
                    message: '已取消停用'
                });
                this.discontinuationVisible = false;
                this.action.status = !this.action.status
            },
            get_ali(id) {
                this.$http(api_ali_address, {shipping_id: id}).then(res => {
                    this.aliInfo.id = id;
                    this.aliInfo.ali_address = res;
                    this.addressLoading = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            get_shipping_method(id) {
                let params = {
                    carrier_id: this.fullnameId,
                    shipping_method_id: id
                };
                this.$http(api_shipping_method, params).then(res => {
                    this.shippingMethod = res.map(row => {
                        return {
                            value: row
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            get_short_name_method(id, shortname) {//可合并集包邮寄方式
                this.$http(api_get_shipping_by_collector, id).then(res => {
                    this.shortnameMethod = res.map(row => {
                        return {
                            value: row.id,
                            label: row.shortname,
                            disabled: this.baseData.shortname === row.shortname
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },

            // http://172.31.17.242/carrier/:id/shipping
            get_information(id, shortname = '') {
                this.effData = {};
                this.baseData = {};
                this.expressData = {
                    special_picking_details: [],
                };
                this.channelData = {},
                this.get_shipping_method(id);
                // this.get_shortname_method(id, shortname);
                let basePm = this.$http(api_base, id).then(res => {
                    res.is_sender_address = !!res.is_sender_address;
                    res.is_return_address = !!res.is_return_address;
                    res.is_pickup_address = !!res.is_pickup_address;
                    res.channels.forEach(row => {
                        row.info && row.info.forEach(item => {
                            if (item.type === "select") {
                                let url = `get|carrier-platform/${item.url}`;
                                this.$http(http(url)).then(res2 => {
                                    this.$set(item, "selects", res2)
                                }).catch(code => {
                                    this.$message({type: 'error', message: code.message || code});
                                })
                            }
                        });
                    });
                    this.baseData = res;
                    this.get_short_name_method(this.baseData.collector_id, shortname);
                    return Promise.resolve()
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
                let expressPm = this.$http(api_express, id).then(res => {
                    res.merge_collection_ids = res.merge_collection_ids.map(res => {
                        return Number(res)
                    });
                    res.coordinate_x = Number(res.coordinate_x);
                    res.coordinate_y = Number(res.coordinate_y);
                    this.expressData = res;
                    console.log(res, '接口请求res');
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
                let effPm = this.$http(api_effective, id).then(res => {
                    res.details.length !== 0 && res.details.forEach(row => {
                        row.is_volumn_weight = !!row.is_volumn_weight;
                        row.is_oli_additional = !!row.is_oli_additional;
                        row.is_stage_fee = !!row.is_stage_fee;
                        row.is_registered_fee = !!row.is_registered_fee;

                    });
                    switch (res.arriveable_type) {
                        case 0:
                            res.details_0 = res.details;
                            res.details_1 = this.clone(this.tempsData.one);
                            res.details_2 = this.clone(this.tempsData.two);
                            break;
                        case  1:
                            res.details_0 = this.clone(this.tempsData.zero);
                            res.details_1 = res.details;
                            res.details_2 = this.clone(this.tempsData.two);
                            break;
                        case  2:
                            res.details_0 = this.clone(this.tempsData.zero);
                            res.details_1 = this.clone(this.tempsData.one);
                            res.details_2 = res.details;
                            break;
                    }
                    this.effData = res;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
                let channelPm = this.$http(api_logistics_channel, id).then(res => {
                    this.channelData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
                Promise.all([basePm, expressPm, effPm, channelPm]).catch(err => {
                    console.error(err)
                });
            },
            look_operate(row) {
                this.editable = false;
                this.get_information(row.id);
                this.editVisible = true;
            },
            edit_operate(row) {
                this.editable = true;
                this.get_information(row.id, row.shortname);
                this.editVisible = true;
            },
            look_address(row) {
                this.addressLoading = true;
                this.addressEditable = false;
                this.get_ali(row.id);
                this.editAddressVisible = true;
            },
            edit_address(row) {
                this.addressLoading = true;
                this.addressEditable = true;
                this.get_ali(row.id);
                this.editAddressVisible = true;
            },
            search() {//按名称或代码搜索
                this.$emit('search');
            },
            address_close() {
                this.aliInfo = {
                    id: '',
                    ali_address: [],
                };
            },
            get_special_list() {
                this.$http(api_special_list).then(res => {
                    this.specialPickingList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            }
        },
        watch: {
            shipList(val) {
                this.shippingData = window.clone(this.tempData);
            }
        },
        computed: {
            isAddressEdit() {
                return this.shipForm.code === 'Aliexpress';
            },
            tempData() {//----------------修改返回数据的属性
                return this.shipList.filter(data => {
                    data.status = data.status == 1 ? true : false;
                    return data
                });
            },
            isSave() {
                if (!this.shipForm.shortname) {
                    return true
                }
                if (!this.shipForm.code) {
                    return true
                }
                if (!this.shipForm.fullname) {
                    return true
                }
                if (!this.shipForm.website) {
                    return true
                }
                if (!this.shipForm.contact) {
                    return true
                }
                if (!this.shipForm.telephone) {
                    return true
                }
                if (!this.shipForm.address) {
                    return true
                }
                return false
            },
            ramHeight() {
                if (document.body.clientWidth > 1366) {
                    if (this.isShow && this.shipment && this.basis) {
                        return 365
                    } else if (!this.shipment && !this.basis) {
                        return 655
                    } else if (this.shipment && !this.basis) {
                        return 575
                    } else if (!this.shipment && this.basis) {
                        return 440
                    }
                } else {
                    if (this.isShow && this.shipment && this.basis) {
                        return 190
                    } else if (!this.shipment && !this.basis) {
                        return 480
                    } else if (this.shipment && !this.basis) {
                        return 400
                    } else if (!this.shipment && this.basis) {
                        return 265
                    }
                }
            }
        },
        props: {
            sequenceNumList: {
                required: true,
                type: Array
            },
            shipForm: {
                required: true,
                type: Object
            },
            shipList: {
                required: true,
                type: Array
            },
            isEdit: {
                required: true,
                type: Boolean
            },
            butMark: {
                required: true,
                type: Boolean
            },
            loading: {
                required: true,
                type: Boolean
            },
            params: {},
            fullnameId: {}
        },
        components: {
            lookEdit: require('./look-edit.vue').default,
            uiForm: require('@/components/ui-form.vue').default,
            uiFormItem: require('@/components/ui-form-item.vue').default,
            addLogistics: require('./add-logistics.vue').default,
            operateDialog: require('./operate-dialog.vue').default,
            uiCard: require('@/components/ui-card.vue').default,
            tabs: require('@/components/tabs.vue').default,
            tabItem: require('@/components/tab-item.vue').default,
            tabHead: require('@/components/tab-head.vue').default,
            discontinueShipping: require('./discontinue-shipping.vue').default,
            addressUpdate: require('./address-update.vue').default,
        }
    }
</script>
