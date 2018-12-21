<template>
    <page-dialog title="添加渠道"
                 size="small"
                 style="z-index:999;"
                 class="p-weighing-packages"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-col :span="showRightPanel ? 12 : 24">
            <div class="mb-sm">
                <el-radio :label="1" v-model="select_channel" class="mb-sm">扫描面单获取渠道</el-radio>
                <div class="mb-sm">
                    <label-item label="面单号：" :label-width="50">
                        <el-input v-model="shipping_number"
                                  autofocus
                                  ref="shipping_number"
                                  style="width:178px"
                                  :disabled="!isDisabled"
                                  @focus="focus('shipping_number')"
                                  @keyup.enter.native="search_channel">
                        </el-input>
                    </label-item>
                </div>
            </div>
            <div>
                <el-radio :label="2" v-model="select_channel" class="mb-sm">自行选择渠道</el-radio>
                <div v-if="select_channel === 2">
                    <div class="mb-sm">
                        <label-item label="仓库：" :label-width="50">
                            <el-select v-model="warehouse_id" @change="change_warehouse">
                                <el-option v-for="item in warehouseList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </label-item>
                    </div>
                    <div class="mb-sm">
                        <label-item label="揽收商：" :label-width="50">
                            <el-select v-model="collector_id" @change="change_collector">
                                <el-option v-for="(item, index) in collectorList"
                                           :key="index"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </label-item>
                    </div>
                    <div class="mb-sm">
                        <label-item label="渠道：" :label-width="50">
                            <el-select :loading="isLoadingShipping"
                                       value=""
                                       @input="changeChannel"
                                       :disabled="isDisabled">
                                <el-option v-for="(item, index) in remainChannelList"
                                           :key="index"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </label-item>
                        <div class="select-link-btn">
                            <span class="link" @click="checkAllChannel">全选</span>&nbsp;&nbsp;
                            <span class="link" @click="invertCheckChannel">反选</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span="10">
            <div v-if="showRightPanel">
                <div class="global-operation">
                    <el-checkbox label="全选" @change="checkAll"></el-checkbox>
                    <el-checkbox label="仅显示已勾渠道" v-model="showOnlyCheck"></el-checkbox>
                </div>
                <div class="local-operation">
                    <ul class="selected-channel" v-for="(channel, index) in searchChannel" :key="index">
                        <el-checkbox :label="channel.label" v-model="channel.check"></el-checkbox>
                        <i class="delete-icon" @click="delete_channel(channel)"></i>
                        <li v-for="shipping in channel.shippings">
                            <template v-if="!showOnlyCheck || shipping.check">
                                <el-checkbox v-model="shipping.check"></el-checkbox>
                                {{shipping.label}}
                                <i class="delete-icon" @click="delete_shipping(shipping)"></i>
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
        </el-col>
        <div slot="footer">
            <el-button type="primary" size="mini" @click="query">确认</el-button>
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-weighing-packages {
        .select-link-btn {
            position absolute
            left 180px
            span.link {
                cursor: pointer;
                font-size: 1.2rem;
                color: #6699FF;
                &:hover {
                    text-decoration: underline;
                }
                &:active {
                    color: #397180;
                }
            }
        }
        .local-operation {
            max-height: 300px;
            overflow-y: auto;
        }
        .selected-channel {
            li {
                padding-left: 20px;
            }
        }
    }
</style>
<script>
    import {
        api_get_shipping,
        api_package_shipping,
        api_combination_shipping
    } from '@/api/weighing-packages'
    import {api_get_warehouse} from "@/api/report-channel";
    import {api_collector_list, api_get_shipping_by_collector} from "@/api/collector";

    export default {
        data() {
            return {
                warehouse_id: '',
                warehouseList: [],
                collector_name: '',
                collector_id: '',
                collectorList: [],
                search_channel_id: '',
                shippingList: [],
                visible: false,
                select_channel: 1,
                shipping_number: '',
                shipping: {},
                searchChannel: [],
                isLoadingShipping: false,
                showOnlyCheck: false,
            }
        },
        mounted() {
            this.init_warehouseList();
        },
        methods: {
            query() {
                let data = {
                    shipping_id: []
                };
                this.searchChannel.forEach(channel => {
                    channel.shippings.forEach(shipping => {
                        if (shipping.check) {
                            data.shipping_id.push(shipping.value);
                        }
                    });
                });
                this.$http(api_combination_shipping, data).then(res => {
                    let combinationChannels = this.get_combination_channels(res);
                    this.$emit('select-shippings', combinationChannels);
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            get_combination_channels(res) {
                let combinationChannels = [];
                try {
                    res.forEach(channels => {
                        let channel = {
                            label: channels.shipping_name,
                            value: channels.shipping_id,
                            brother: channels.brother,
                            packages: []
                        };
                        if (channels.package_collection) {
                            Object.assign(channel, this.create_channel(channels.package_collection));
                            channel.packages = channels.package_collection.list.filter(item => item.deleted === 0);
                        }
                        if (channels.brother && channels.brother.length !== 0) {
                            channel.brother = this.get_brother_channels(channels.brother);
                        }
                        combinationChannels.push(channel);
                    });
                } catch (code) {
                    this.$message({type: 'error', message: code.message || code})
                }
                return combinationChannels;
            },
            get_brother_channels(channels) {
                return channels.map(res => {
                    return {
                        label: res.shipping_name,
                        value: res.shipping_id
                    }
                })
            },
            init_warehouseList() {
                let data = {type: [1]};
                this.$http(api_get_warehouse, data).then(res => {
                    this.warehouseList = res.map(row => {
                        return {label: row.name, value: row.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            change_warehouse() {
                this.searchChannel.length = 0;
                this.collector_id = '';
                this.shipping_number = '';
                this.search_channel_id = '';
                this.shippingList.length = 0;
                this.init_collector_list({warehouse_id: this.warehouse_id});
            },
            init_collector_list(data) {
                this.$http(api_collector_list, data).then(res => {
                    this.collectorList = res.map(row => {
                        return {label: row.name, value: row.id};
                    });
                    if(this.collectorList.length !== 0) {
                        this.collector_id = this.collectorList[0].value || '';
                        this.collector_name = this.collectorList[0].label || '';
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            get_shipping() {
                this.isLoadingShipping = true;
                this.$http(api_get_shipping_by_collector, this.collector_id).then(res => {
                    this.shippingList = res.map(row => {
                        return {
                            label: row.shortname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => this.isLoadingShipping = false);
            },
            search_channel() {
                this.$http(api_package_shipping, {shipping_number: this.shipping_number}).then(res => {
                    let channel = this.searchChannel.find(row => row.value === res.collector_id);
                    if (channel) {
                        if (this.collector_id === res.carrier_id) {
                            this.add_shipping(channel, res);
                        } else {
                            this.new_shipping(res);
                        }
                    } else {
                        this.new_shipping(res);
                    }
                    this.shipping_number = '';
                    this.focus('shipping_number');
                }).catch(code => {
                    this.shipping_number = '';
                    this.focus('shipping_number');
                    this.$message({type: "error", message: code.message || code});
                });
            },
            add_shipping(channel, res) {
                let shippings = channel.shippings;
                let flag = this.shipping_exist(shippings, res.shipping_id);
                if (!flag) {
                    this.searchChannel.push(
                        {
                            label: res.collector_name,
                            value: res.collector_id,
                            check: false,
                            shippings: [
                                {
                                    label: res.shipping_name,
                                    value: res.shipping_id,
                                    check: true
                                }
                            ]
                        });
                } else if (flag.check) {
                    this.$message({type: "error", message: '该渠道已存在'});
                } else {
                    flag.check = true;
                }
            },
            new_shipping(res) {
                this.collector_id = res.collector_id;
                this.change_collector();
                this.collector_name = res.collector_name;
                this.search_channel_id = res.shipping_id;
                this.searchChannel.push({
                    label: res.collector_name,
                    value: res.collector_id,
                    check: false,
                    shippings: [
                        {
                            label: res.shipping_name,
                            value: res.shipping_id,
                            check: true
                        }
                    ]
                });
            },
            shipping_exist(shippings, id) {
                return shippings.find(res => {
                    return res.value === id;
                });
            },
            change_collector(value) {
                this.collectorList.find(row => {
                    if (row.value === this.collector_id) {
                        this.collector_name = row.label;
                    }
                });
                if(value !== '') {
                    this.get_shipping();
                }
                /*
                this.isLoadingShipping = true;
                this.$http(api_get_shipping, data).then(res => {
                    this.shippingList = res[0].shipping.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                        };
                    });
                    // this.shippingList.unshift({label:'全部/反选', value:0});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => this.isLoadingShipping = false);*/
            },
            changeChannel(val) {
                let channel = this.currentChannel;
                if (channel) {
                    if (channel.shippings.findIndex(shipping => shipping.value === val) < 0) {
                        const shipping = this.shippingList.find(shipping => shipping.value === val);
                        channel.shippings.push({
                            label: shipping.label,
                            value: shipping.value,
                            check: true
                        })
                    }
                } else {
                    const collector = this.get_collector(this.collector_id);
                    this.searchChannel.push({
                        value: this.collector_id,
                        label: collector.label,
                        shippings: [],
                        check: false
                    });
                    this.changeChannel(val);
                }
            },
            get_collector(id) {
                return this.collectorList.find(collector => collector.value === id);
            },
            checkAll(val) {
            },
            checkAllChannel() {
                this.shippingList.forEach(shipping => {
                    this.changeChannel(shipping.value);
                });
            },
            invertCheckChannel() {
                const index = this.searchChannel.findIndex(channel => this.collector_id === channel.value);
                if (index >= 0) {
                    this.searchChannel.splice(index, 1);
                }
            },
            delete_channel(channel) {
                let index = this.searchChannel.indexOf(channel);
                this.searchChannel.splice(index, 1);
            },
            delete_shipping(shipping) {
                let flag = this.searchChannel.findIndex(row => {
                    return row.value === shipping.value;
                });
                if (this.searchChannel.length === 0) {
                    this.carrier_id = '';
                    this.shippingList.length = 0;
                }
            },
            focus(item) {
                this.$refs[item].$refs.input.select();
            },
            create_package(data) {
                let {is_recently, quantity, package_weight, carrier_id, carrier_name, package_collection, main_shipping_id, shipping_id, ...newPackage} = data;
                return newPackage;
            },
            create_channel(data) {
                let {package_weight, package_count, carrier_id, carrier_name, list, type, ...channel} = data;
                channel.collect_type = type;
                channel.collect_label = this.collect_label(channel.collect_type);
                return channel;
            },
            collect_label(type) {
                let collectType = this.collectTypes.find(collect => collect.value === type);
                if (collectType) {
                    return collectType.label;
                } else {
                    return type;
                }
            },
        },
        computed: {
            currentChannel() {
                return this.searchChannel.find(channel => {
                    return channel.value === this.collector_id;
                });
            },
            remainChannelList() {
                const channel = this.searchChannel.find(c => c.value === this.collector_id);
                if (channel) {
                    return this.shippingList.filter(shipping => {
                        return !channel.shippings.find(exist => exist.value === shipping.value)
                    })
                } else {
                    return this.shippingList;
                }
            },
            isDisabled() {
                return this.select_channel === 1;
            },
            showRightPanel() {
                return this.select_channel === 2;
            }
        },
        watch: {
            select_channel(val) {
                if (val === 1) {
                    this.$nextTick(() => {
                        this.focus('shipping_number');
                    });
                }
                this.shipping_number = '';
                this.search_channel_id = '';
            },
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
                if (val) {
                    this.searchChannel.length = 0;
                    this.collector_id = '';
                    this.select_channel = 1;
                    this.shipping_number = '';
                    this.search_channel_id = '';
                    this.shippingList.length = 0;
                }
            },
        },
        props: {
            value: {},
            collectTypes: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            labelItem: require('@/components/label-item').default
        }
    }
</script>
