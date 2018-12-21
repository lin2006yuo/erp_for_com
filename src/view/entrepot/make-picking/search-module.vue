<template>
    <div>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline width-sm">
                    <el-option
                            v-for="(item, index) in warehouses"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <search-card :params="searchData"
                         @search="search"
                         :clears="clears"
                         @init-params="init_status_btn">
                <div class="mb-mini">
                    <el-col :span="9">
                        <select-more-button label="包裹类型："
                                            :button-list="packageList"
                                            @query="query">
                        </select-more-button>
                    </el-col>
                    <label-buttons
                            label="发货剩余时间："
                            class="inline ml-sm"
                            @select="change_delivery_time"
                            :buttons="timesList">
                    </label-buttons>
                </div>
                <div class="mb-xs">
                    <select-more-button label="销售渠道："
                                        class="inline"
                                        :show-all="false"
                                        :max="15"
                                        :button-list="channels"
                                        @query="change_channel">
                    </select-more-button>
                    <!--<label-buttons
                            label="销售渠道："
                            class="inline"
                            @select="change_channel"
                            :max="15"
                            :buttons="channels">
                    </label-buttons>-->
                    <label-item :label="channel_label"
                                v-if="channel_label && accountList.length > 0">
                        <el-select v-model="searchData.accounts"
                                   v-sf.accounts
                                   style="width:300px"
                                   filterable multiple
                                   placeholder="请选择/输入">
                            <el-option
                                    v-for="(item, index) in accountList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </label-item>
                </div>
                <div class="mb-sm">
                    <label-item label="国家：">
                        <el-select v-model="searchData.country"
                                   filterable multiple
                                   v-sf.country
                                   style="width:300px"
                                   class="inline"
                                   placeholder="请选择/输入">
                            <el-option
                                    v-for="(item, index) in countryList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </label-item>
                    <label-buttons
                            label="跟踪号："
                            class="inline ml-sm"
                            @select="change_has_tacking"
                            :buttons="tackingList">
                    </label-buttons>
                </div>
                <label-item label="分区：">
                    <el-select v-model="searchData.area" v-sf.area @change="change_area" class="width-sm">
                        <el-option v-for="(item, index) in partitions"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="SKU：" class="ml-sm">
                    <el-input v-model="searchData.sku"
                              @keyup.enter.native="sku_enter"
                              v-sf.sku>
                    </el-input>
                </label-item>
                <label-item class="ml-sm mt-mini">
                    <el-select v-model="searchData.snType" class="width-sm" v-sf.snType>
                        <el-option v-for="(item, index) in skuType_list"
                                   :key="index"
                                   :value="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.snOperator"
                               class="width-sm ml-sm" v-sf.snOperator>
                        <el-option v-for="(item, index) in operatorList"
                                   :key="index"
                                   :value="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                    <el-input v-model="searchData.snText"
                              class="ml-sm mr-sm" v-sf.snText
                              @keyup.enter.native="snText_enter">
                    </el-input>
                </label-item>
            </search-card>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_get_channels, entrepot_picking, api_get_accounts, api_get_operator, api_get_area, api_get_surplus,
        api_get_country, api_get_packages
    } from '@/api/generate-order'

    export default {
        data() {
            return {
                label: '请选择仓库：',
                warehouse_id: 2,
                searchData: {
                    channel_id: [],
                    type: [],
                    has_tracking: '',
                    accounts: [],
                    sku: '',
                    snType: 'sku',
                    snText: '',
                    snOperator: '=',
                    country: [''],
                    residue_time: '',
                    area: '',
                    sorting_shelf_id: ''
                },
                tackingList: [
                    {label: '全部', value: ''},
                    {label: '有', value: 0},
                    {label: '无', value: 1}
                ],
                accountList: [],
                countryList: [],
                packageList: [],
                timesList: [],
                skuType_list: [
                    {label: 'sku数量', value: 'sku'}
                ],
                operatorList: [],
                warehouses: [],
                clears: {
                    channel_id: [],
                    type: [],
                    accounts: [],
                    snType: 'sku',
                    snOperator: '=',
                    country: [''],
                },
                channels: [],
                channel_label: '',
                partitions: [],
                is_mounted: false
            }
        },
        mounted() {
            this.first_init();
        },
        methods: {
            first_init() {// 初始化
                this.init_warehouse();
                this.init_operate();
                this.init_time();
                this.init_country();
                this.init_packageList();
                this.request_channels();
                this.init();
            },
            init_status_btn() {// 动态条件清除处理
                let cur = this.packageList;
                let cur2 = this.timesList;
                let cur3 = this.channels;
                let cur4 = this.tackingList;
                this.packageList = [];
                this.timesList = [];
                this.channels = [];
                this.tackingList = [];
                this.$nextTick(() => {
                    this.packageList = cur;
                    this.timesList = cur2;
                    this.channels = cur3;
                    this.tackingList = cur4;
                })
            },
            init() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$emit('init-data', this.searchData);
            },
            init_warehouse() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.init_area();
                    this.$parent.$refs.table_module.init_shelf(this.warehouse_id);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_operate() {
                this.$http(api_get_operator).then(res => {
                    this.operatorList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_area() {
                this.$http(api_get_area, {warehouse_id: this.warehouse_id, warehouse_area_type: 11}).then(res => {
                    this.partitions = res.map(row => {
                        return {label: row.name, value: row.id};
                    });
                    this.partitions.unshift({label: '全部', value: ''});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_packageList() {
                this.$http(api_get_packages).then(res => {
                    this.packageList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_time() {
                this.$http(api_get_surplus).then(res => {
                    this.timesList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_country() {
                this.$http(api_get_country).then(res => {
                    this.countryList = res.map(row => {
                        return {label: row.zone_code, value: row.country_code}
                    });
                    this.countryList.unshift({label: '全部', value: ''});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            reflash_first() {
                this.$nextTick(() => {
                    this.change_depot();
                });
            },
            //点击渠道时
            change_channel(channels) {
                //账号清缓存
                this.searchData.accounts = [];
                this.channel_label = '';
                this.accountList = [];
                this.searchData.accounts = [];
                this.searchData.channel_id = channels.map(row => row.value);
                if(channels.length === 1) {//单选显示账号
                    this.channel_label = channels[0].label + "账号：";
                    if(channels[0].value !== 0) {
                        this.searchData.accounts = [''];
                        this.request_account();
                    } else {
                        this.searchData.channel_id = [];
                    }
                }
                if (this.is_mounted) {
                    this.init();
                    // this.$emit('init-tree');
                }
            },
            //改变仓库 调取接口
            change_depot() {
                this.init_area();
                this.request_channels();
                this.$parent.$refs.table_module.init_shelf(this.warehouse_id);
                if (this.is_mounted) {
                    this.init();
                    // this.$emit('init-tree');
                }
            },
            query(types) {
                this.searchData.type = types.map(row => {
                    return row.value;
                });
                this.init();
            },
            change_delivery_time(select, item) {
                this.searchData.residue_time = item.value;
                if (this.is_mounted) {
                    this.init();
                }
            },
            change_area() {
                if (this.is_mounted) {
                    this.init();
                }
            },
            change_has_tacking(select, item) {
                this.searchData.has_tracking = item.value;
                if (this.is_mounted) {
                    this.init();
                }
            },
            request_channels() {
                let params = {
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_get_channels, params).then(res => {
                    this.channels = [];
                    for (let item in res) {
                        this.channels.push({label: `${res[item].label}(${res[item].count})`, value: res[item].value})
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            request_account() {
                this.accountList = [];
                if (this.searchData.channel_id.length <= 0) {
                    return;
                }
                let params = {
                    warehouse_id: this.warehouse_id,
                    channel_id: this.searchData.channel_id[0],
                };
                this.$http(api_get_accounts, params).then(res => {
                    this.accountList = res.map(row => {
                        return {label: `${row.name}(${row.count})`, value: row.value};
                    });
                    this.accountList.unshift({label: '全部', value: ''});
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            search() {
                this.init();
            },
            sku_enter() {
                if (this.is_mounted) {
                    this.init();
                }
            },
            snText_enter() {
                if (this.is_mounted) {
                    this.init();
                }
            }
        },
        computed: {
            warehouseName() {
                let warehouse_id = this.warehouses.find(row => row.value === this.warehouse_id)
                if (warehouse_id) {
                    return warehouse_id.label;
                } else {
                    return '';
                }
            },
        },
        watch: {
            warehouse_id(val) {
                this.$emit('transport-change', true);
                this.$emit('input', val);
            },
            value(val) {
                this.warehouse_id = val;
            },
            warehouseName(val) {
                this.$emit('warehouse-name', val);
            },
            searchData: {
                deep: true,
                handler() {
                    this.$emit('transport-change', true);
                }
            }

        },
        props: {
            value: {},
            leftShow: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            selectMoreButton: require('@/components/select-more-button').default
        },
    }
</script>
