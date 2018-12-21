<template>
    <ui-card v-if="isAdd === false">
        <!--<div slot="header" class="ui-card-header">-->
        <!--<span class="title">邮寄方式</span>-->
        <div class="t-right mb-sm">
            <el-input class="inline width-super" placeholder="请输入名称/代码..." @keyup.enter.native="search"
                      v-model="searchText"></el-input>
            <el-button class="ml-sm inline" type="primary" size="mini" @click.native="search" icon="search">搜索
            </el-button>
            <permission tag="ElButton" type="primary" size='mini'
                        class="inline"
                        @click.stop.prevent.native="show_dialog"
                        v-if="!form.third"
                        :route="apis.url_store_bound">绑定
            </permission>
        </div>
        <!--</div> :max-height="maxHeight"-->
        <div>
            <el-table :data="copyData" border class="scroll-bar" v-resize="{height: 40}" highlight-current-row>
                <el-table-column label="物流商" v-if="!form.third" inline-template>
                    <div>
                        <ui-tip :content="row.carrier_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="类型" v-if="!form.third" style="width:50px;" inline-template>
                    <div>
                        <ui-tip :content="row.type" :width="58"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="代码" width="90" row-key="code" inline-template>
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="名称" inline-template>
                    <div>
                        <ui-tip :content="row.shortname" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <template>
                    <el-table-column inline-template label="状态" align="center" show-overflow-tooltip>
                        <div>
                            <el-switch :key="row.id"
                                       v-model="row.status"
                                       :on-text="state[0]"
                                       :off-text="state[1]"
                                       :on-value="1"
                                       :off-value="0"
                                       on-color="#20a0ff"
                                       off-color="#C0CCDA"
                                       @change="change_status(row)">
                            </el-switch>
                        </div>
                    </el-table-column>
                </template>
                <el-table-column prop="has_tracking_number" width="60" label="跟踪号?" show-overflow-tooltip>
                </el-table-column>
                <el-table-column inline-template label="操作" align="center" width="80">
                    <div>
                        <span class="operate" @click="look_operate(row)">查看</span>
                        <permission tag="span" :route="apis.url_logistics_base_keep">&nbsp;|</permission>
                        <permission tag="span" class="operate" @click="edit_operate(row)"
                                    :route="apis.url_logistics_base_keep">修改
                        </permission>
                    </div>
                </el-table-column>
            </el-table>
            <look-edit v-model="newVisable"
                       :editable="editable"
                       :title="title"
                       :express-data="expressData"
                       :baseData="baseData"
                       :channel-data="channelData"
                       @files-success="files_success"
                       :effData="effData"></look-edit>
        </div>
        <bound v-model="showBound" :entrepot-id="entrepotId" @save_mail="save_mail"></bound>

        <discontinue-shipping v-model="discontinuationVisible" :action="action" @cancel="cancel_discontinue"
                              @sure="sure_discontinue"></discontinue-shipping>
    </ui-card>
</template>
<style lang="stylus" scoped>
    .el-table__body-wrapper {
        overflow-x: hidden;
    }
</style>
<script>
    import {store_bound, store_check, url_store_bound} from '../../../api/storeManagement';
    import {url_logistics_base_keep} from "../../../api/setLogistics"
    import {
        api_base, api_express, api_effective, api_logistics_channel,
        api_ali_address, logistics_enabled
    } from "../../../api/setLogistics"
    import {http} from "@/lib/http-plus";

    export default {
        permission: {
            url_store_bound, url_logistics_base_keep
        },
        data() {
            return {
                editable: false,
                newVisable: false,
                discontinuationVisible: false,
                baseData: {},
                title: '',
                expressData: {},
                effData: {},
                channelData: {},
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
                        allow_properties: [],
                        deny_properties: [],
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
                isShow: true,
                showBound: false,
                forms: [],
                state: ['启用', '停用'],
                third_: false,
                searchText: '',
                copyData: [],
                action: {}
            }
        },
        created() {
            this.copyData = window.clone(this.lists);
        },
        methods: {
            files_success(id) {
                this.get_information(id);
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
                    this.action.status = this.action.status === 0 ? 1 : 0;
                })
            },
            cancel_discontinue() {
                this.$message({
                    type: 'info',
                    message: '已取消停用'
                });
                this.discontinuationVisible = false;
                this.action.status = this.action.status === 0 ? 1 : 0;
            },
            show_dialog() {
                console.log('绑定');
                this.showBound = true;
            },
            save_mail(entrepotId) {
                this.$emit('save_mail', entrepotId)
            },
            del(row) {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: `${row.carrier_name}已使用不可删除`,
                });
            },
            look_operate(row) {
                this.editable = false;
                this.title = row.carrier_name;
                this.newVisable = true;
                this.get_information(row.id);
            },
            edit_operate(row) {
                this.editable = true;
                this.title = row.carrier_name;
                this.newVisable = true;
                this.get_information(row.id);

            },
            get_ali(id, data) {
                this.$http(api_ali_address, {shipping_id: id}).then(res => {
                    this.$set(data, 'showAli', true);
                    this.$set(data, 'showAliInfo', res)
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            get_information: function (id) {
                this.effData = {};
                this.baseData = {};
                this.expressData = {
                    special_picking_details: [],
                };
                this.channelData = {},
                    this.$http(api_base, id).then(res => {
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
                            })
                        });
                        if (res.carrier_code === 'Aliexpress') {
                            this.get_ali(id, res);
                        }
                        this.baseData = res;
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        });
                    });
                this.$http(api_express, id).then(res => {
                    res.merge_collection_ids = res.merge_collection_ids.map(res => {
                        return Number(res)
                    });
                    res.coordinate_x = Number(res.coordinate_x);
                    res.coordinate_y = Number(res.coordinate_y);
                    this.expressData = res;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
                this.$http(api_effective, id).then(res => {
                    res.details.length !== 0 && res.details.forEach(row => {
                        row.is_volumn_weight = !!row.is_volumn_weight;
                        row.is_oli_additional = !!row.is_oli_additional;
                        row.is_stage_fee = !!row.is_stage_fee;
                        row.is_registered_fee = !!row.is_registered_fee;

                    });
                    switch (res.arriveable_type) {
                        case 0:
                            res.details_0 = res.details;
                            res.details_1 = window.clone(this.tempsData.one);
                            res.details_2 = window.clone(this.tempsData.two);
                            break;
                        case  1:
                            res.details_0 = window.clone(this.tempsData.zero);
                            res.details_1 = res.details;
                            res.details_2 = window.clone(this.tempsData.two);
                            break;
                        case  2:
                            res.details_0 = window.clone(this.tempsData.zero);
                            res.details_1 = window.clone(this.tempsData.one);
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
                this.$http(api_logistics_channel, id).then(res => {
                    this.channelData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            search() {
                let key = this.searchText.trim();
                if (key === '') {
                    this.copyData = window.clone(this.lists);
                } else {
                    this.copyData = this.lists.filter(res => {
                        if (!res.code && !res.shortname) return false;
                        return res.code.indexOf(key) !== -1 || res.shortname.indexOf(key) !== -1
                    });
                }
            }
        },
        watch: {
            third_(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.third_ = val;
            },
            form: {
                deep: true,
                handler(val, val2) {
                }
            },
            lists(val) {
                this.searchText = '';
                this.copyData = window.clone(val);
            }
        },
        props: {
            lists: {
                required: true,
                type: Array
            },
            entrepotId: {
                required: true,
                type: Number
            },
            isAdd: {
                required: true,
                type: Boolean
            },
            form: {
                required: true,
                type: Object
            },
            value: {},
            maxHeight: {}
        },

        components: {
            bound: require('./bound.vue').default,
            cardHidden: require('../../../components/card-hidden.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            uiCard: require('@/components/ui-card').default,
            lookEdit: require('../setLogistics/look-edit.vue').default,
            discontinueShipping: require('./discontinue-shipping.vue').default,
        }
    }
</script>
