<template>
    <div class="p-weighing-packages">
        <search-module @init-data="init_data"
                       :collection="currentCollection"
                       :shipping_id="shipping_id"
                       @weighing-change="weighing_change"
                       @start-whole="start_whole"
                       @time-start="set_time_start"
                       @weighing="weighing"
                       @dir-change="change_dir"
                       v-model="canSetWeight"
                       :package_collection_number="package_collection_number"
                       ref="search_module">
        </search-module>
        <div class="mt-xs">
            <!--根据物流商不同列出不同集包-->
            <div class="mt-xs mb-xs ml-sm">
                <el-button type="primary" size="mini" @click.native.stop.prevent="addChannel" icon="plus"></el-button>
            </div>
            <el-tag
                    v-for="(item, index) in channels"
                    :key="item.value"
                    closable
                    class="tag ml-xs mb-xs"
                    :class="{'tagBlue': currentChannel === index}"
                    @click.native.stop="change_channel(item)"
                    @close="handleClose($event,item, index)">
                <el-popover v-if="item.brother.length !== 0" placement="bottom-start" trigger="click"
                            :visible-arrow="false">
                    <ul class="shipping-merge">
                        <li class="combination-channels-title">公用集包</li>
                        <li><span>{{`【主】 ${item.label}`}}</span></li>
                        <li v-for="(subItem, index) in item.brother" :key="index">
                            <span>{{subItem.label}}</span>
                        </li>
                    </ul>
                    <el-button class="icon-combination" slot="reference" icon="menu"></el-button>
                </el-popover>
                {{item.label}}
            </el-tag>
        </div>
        <table-module :search-data="searchData"
                      :collection="currentCollection"
                      :shipping-id="shipping_id"
                      :collect-types="collectTypes"
                      @change-collect-type="change_collect_type"
                      @remove-package="removePackage"
                      @show-printdata="showPrintData"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
        <add-channel v-model="channelVisible"
                     :collect-types="collectTypes"
                     @select-shippings="selectShippings">
        </add-channel>
    </div>
</template>
<style lang="stylus">
    .p-weighing-packages {
        .add {
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        }
        .add:hover {
            background: gainsboro;
        }
        .el-tag {
            background: #cccccc;
            .icon-combination {
                padding: 2px;
                color: #e23f2c;
            }
        }
        .tag {
            height: 30px;
            line-height: 30px;
            cursor: pointer;
        }
        .tag:hover {
            background: #6295e9;
        }
        .tagBlue {
            background: #6295e9;
        }
    }

    .el-popover {
        ul.shipping-merge {
            .combination-channels-title {
                background-color: #ccc;
                border: none;
            }
            li {
                border-top: solid 1px #ccc;
                line-height: 28px;
                height: 28px;
            }
        }
    }
</style>
<script>
    import {mapActions, mapGetters} from 'vuex';
    import {
        api_save_collection, api_get_type,
        api_combination_shipping
    } from '@/api/weighing-packages';
    import {api_get_packagelist} from '@/api/package-collection';


    export default {
        data() {
            return {
                searchData: {
                    shipping_number: '',
                    package_weight: ''
                },
                printData: {},
                is_show: true,
                currentChannel: 0,
                channelVisible: false,
                collectTypes: [],
                timeStart: '',
                weighingStyle: 'usb',
                canSetWeight: false,
                defaultDir: 2,//传送带默认方向右
                websocket: null,
            }
        },
        mounted() {
            this.from_package_collection();
            this.init_collect_types();
        },
        methods: {
            ...mapActions({
                set_collectionList: 'api/set_collectionList',
            }),
            change_dir(val) {
                this.defaultDir = val;
            },
            set_time_start(val) {
                this.timeStart = val;
            },
            init_data(searchData) {
                this.searchData = searchData;
                this.$nextTick(() => {
                    this.save_collection();
                });
            },
            showPrintData(...args) {
                this.$emit('print', ...args);
            },
            shippingNumberFocus() {
                this.$refs.search_module.focus('shipping_number')
            },
            init_collect_types() {
                this.$http(api_get_type).then(res => {
                    this.collectTypes = res.map(row => {
                        row.longLabel = `${row.label} -- ${row.weight}g`;
                        return row;
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            collect_label(type) {
                let collectType = this.collectTypes.find(collect => collect.value === type);
                if (collectType) {
                    return collectType.label;
                } else {
                    return type;
                }
            },
            collectTypeIdByName(name) {
                let type = this.collectTypes.find(type => type.label === name);
                if (type) {
                    return type.value;
                } else {
                    return name;
                }
            },
            removePackage(item) {
                let flag = this.packages.indexOf(item);
                if (flag !== -1) {
                    this.packages.splice(flag, 1);
                }
                //如果改拣货单列表为空
                if (this.packages.length <= 0) {
                    this.channels.splice(this.currentChannel, 1);
                    let nextCurrentChannel = Math.min(this.channels.length - 1, this.currentChannel);
                    this.change_channel(nextCurrentChannel);
                }
                this.set_collectionList(this.channels);
            },
            isExistChannel() {
                return this.channels.some(row => {
                    return row.packages.find(item => {
                        return item.shipping_number === this.searchData.shipping_number;
                    })
                });
            },
            isExistPackage() {
                //判断该面单号是否已称重，如果已称重则报错
                if (this.isExistChannel()) {
                    this.$refs.search_module.isRead = false;
                    this.$refs.search_module.searchData.package_weight = '';
                    this.$refs.search_module.$refs.shipping_number.$refs.input.select();
                    this.$refs.search_module.warning.shipping_number = '该面单号已称重';
                    return true;
                } else {
                    return false;
                }
            },
            save_collection() {
                let package_collection_number = this.channels.filter(channel => !!channel.code).map(channel => channel.code);
                let data = {
                    shipping_number: this.searchData.shipping_number,
                    package_weight: this.searchData.package_weight,
                    package_collection_number: package_collection_number,
                    shipping_id: this.shipping_id,
                    type: this.currentCollection.collect_type || this.collectTypes[0].value,
                };
                try {
                    console.log('正常称重');
                    if (data.package_collection_number.length === 0) {
                        console.error('正常称重', data);
                    }
                    if (this.timer) { // 若是称重时还在轮询，则清除轮询
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    console.error('扫描到请求前耗时', Number(Date.now()) - this.timeStart);
                    this.$http(api_save_collection, data).then(response => {
                        console.error('扫描到请求耗时', Number(Date.now()) - this.timeStart);
                        if (response.is_recently === 1) {
                            this.$confirm(`你最近已经称重过相同渠道集包单号为${response.package_collection.code}的集包单，是否继续集包?`, '提示', {
                                confirmButtonText: '继续',
                                cancelButtonText: '创建新包裹',
                                type: 'warning'
                            }).then(() => {
                                console.log('继续集包response', response);
                                data.is_continue = 1;
                                this.getPackage(response.package_collection);
                            }).catch(code => {
                                console.log('新建集包response', response);
                                data.is_continue = 2;
                                this.$http(api_save_collection, data).then(res => {
                                    this.createPackage(res);
                                }).catch(code => {
                                    code.voice && this.audio_play(code.voice);
                                    this.start_whole(0);
                                    this.savePackError(code);
                                });
                            });
                        } else {
                            console.log('正常称重，添加包裹');
                            this.createPackage(response);
                        }
                    }).catch(code => {
                        console.error('扫描到请求耗时', Number(Date.now()) - this.timeStart);
                        if (code.package_id > 0) {//必须称重
                            this.$refs.search_module.warning.package_weight = code.message || code;
                            this.weighing();
                        } else {
                            code.voice && this.audio_play(code.voice);
                            if (this.weighingStyle === 'whole') {
                                this.$message({type: 'error', message: code.message || code, duration: 5000});
                                this.start_whole(0);
                            } else {
                                this.$confirm(`${code.message || code}`, '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'error',
                                    callback: () => {
                                        setTimeout(() => {
                                            this.cleanSearchData();
                                        }, 300);
                                    }
                                });
                            }
                        }
                    });
                } catch (code) {
                    this.cleanSearchData();
                    this.savePackError(code);
                } finally {
                    this.$refs.search_module.isRead = false;
                }
            },
            audio_play(voice, speed) {// 播报语音
                this.$audio(voice, this.audioToken, speed);
            },
            weighing(shipping_number) {//需要称重,串口称重，usb聚焦
                shipping_number && (this.searchData.shipping_number = shipping_number);
                if(this.weighingStyle === 'websocket') {
                    this.$refs.search_module.websocket_weighing();
                } else if(this.weighingStyle === 'usb'){
                    this.$refs.search_module.focus('package_weight');
                }
            },
            async createPackage(response) {
                if (this.isExistPackage()) {
                    return;
                }
                //如果渠道的列表为空，则新增渠道以及渠道对应的集包单列表
                if (this.channels.length === 0) {
                    const data = {shipping_id: [response.main_shipping_id]};
                    let item = await this.newChannel(data);
                }
                // 获取当前渠道并聚焦
                let channelIndex = this.channels.findIndex(res => res.value === response.main_shipping_id);
                let channel = this.channels[channelIndex];
                this.change_channel(channelIndex);
                // 添加袋子信息
                console.log('添加袋子信息', window.clone(channel), response, this.create_channel(response.package_collection));
                //TODO:疑似集包bug处
                if (channel.shipping_id !== response.main_shipping_id || channel.code !== response.package_collection.code) {
                    Object.assign(channel, this.create_channel(response.package_collection));
                }
                // 添加包裹
                this.addPackage(channel, response);
                this.set_collectionList(this.channels);
                //重新计算该渠道对应的集包单的重量
            },
            cleanSearchData() {
                this.$refs.search_module.searchData.package_weight = '';
                this.$refs.search_module.searchData.shipping_number = '';
                this.$refs.search_module.searchData.shipping_name = '';
                this.$refs.search_module.warning.success = true;
                this.canSetWeight = false;
                this.shippingNumberFocus();
                if(this.weighingStyle === 'websocket') {
                    this.$refs.search_module.websocket_weighing();
                }
            },
            addPackage(channel, res) {
                let newPackage = this.create_package(res);
                const existIndex = channel.packages.findIndex(Package => Package.shipping_number === res.shipping_number);
                if (existIndex >= 0) {
                    channel.packages.splice(existIndex, 1, newPackage);
                } else {
                    channel.packages.unshift(newPackage);
                }
                this.set_collectionList(this.channels);
                this.start_whole(this.curDir);
                this.cleanSearchData();
            },
            async getPackage(data) {
                let param = {
                    package_number: '',
                    shipping_number: '',
                    page: 1,
                    pageSize: 999
                };

                if (this.channels.length === 0) {
                    let item = await this.newChannel({shipping_id: [data.shipping_method_id]});
                } else {
                    this.$message({type: 'error', message: `已存在称重包裹的渠道邮寄方式`});
                    this.start_whole(0);
                    this.cleanSearchData();
                    console.error('已有渠道，称重返回recently', window.clone(this.channels), data);
                    return false;
                }
                this.$http(api_get_packagelist, data.id, param).then(res => {
                    let channel = this.channels.find(res => res.value === data.shipping_method_id);
                    Object.assign(channel, this.create_channel(data));
                    let packages = res.list.filter(row => row.deleted === 0);
                    channel.packages = packages;

                    let channelIndex = this.channels.indexOf(channel);
                    this.change_channel(channelIndex);
                    this.continuePackage();

                }).catch(code => {
                    this.start_whole(0);
                    this.cleanSearchData();
                    this.$message({type: "error", message: code.message || code});
                });
            },
            async newChannel(data) {
                try {
                    let res = await this.$http(api_combination_shipping, data);
                    res.forEach(channels => {
                        let channel = {
                            label: channels.shipping_name,
                            value: channels.shipping_id,
                            packages: [],
                            brother: channels.brother
                        };
                        if (channels.brother.length !== 0) {
                            channel.brother = this.get_brother_channels(channels.brother);
                        }
                        this.channels.push(channel);
                        let currentChannel = this.channels.length - 1;
                        this.change_channel(currentChannel);
                    });
                    this.set_collectionList(this.channels);
                } catch (code) {
                    this.start_whole(0);
                    this.cleanSearchData();
                    this.$message({type: 'error', message: code.message || code})
                }
            },
            get_brother_channels(channels) {//获取绑定渠道
                return channels.map(channel => {
                    return {
                        label: channel.shipping_name,
                        value: channel.shipping_id
                    }
                })
            },
            async continuePackage() {
                if (this.isExistPackage()) {
                    this.start_whole(0);
                    this.cleanSearchData();
                    return;
                }
                let package_collection_number = this.channels.filter(channel => !!channel.code).map(channel => channel.code);
                let params = {
                    shipping_number: this.searchData.shipping_number,
                    package_weight: this.searchData.package_weight,
                    package_collection_number: package_collection_number,
                    shipping_id: this.shipping_id,
                    type: this.currentCollection.collect_type || this.collectTypes[0].value,
                    is_continue: 1
                };
                this.$http(api_save_collection, params).then(res => {
                    let channel = this.channels[this.currentChannel];
                    this.addPackage(channel, res);
                }).catch(code => {
                    this.start_whole(0);
                    this.cleanSearchData();
                    this.savePackError(code);
                });

                //向VUEX中存放正在处理的面单号的数组
            },
            savePackError(code) {
                switch (code.field) {
                    case 'shipping_number':
                        this.$refs.search_module.searchData.package_weight = '';
                        this.$refs.search_module.warning.shipping_number = this.shippingNameErrorMsg(code.message);
                        break;
                    case 'weight':
                        this.$refs.search_module.searchData.package_weight = '';
                        this.$refs.search_module.warning.package_weight = code.message;
                        break;
                    default:
                        this.$refs.search_module.searchData.package_weight = '';
                        this.$refs.search_module.warning.shipping_number = this.shippingNameErrorMsg(code.message);
                }
            },
            shippingNameErrorMsg(message) {
                let channel = this.channels[this.currentChannel];
                return message === '邮寄方式不匹配' ? `${message} 错误方式：${channel.label}` : message;
            },
            finish() {
                let index = this.channels.findIndex(row => {
                    return row.value === this.shipping_id;
                });
                if (index !== -1) {
                    this.channels.splice(index, 1);
                }
                //向VUEX中存放正在处理的面单号的数组
                this.change_channel(this.channels[0]);
                this.set_collectionList(this.channels);
            },
            addChannel() {
                this.channelVisible = true;
            },
            selectShippings(selectShippings) {
                let channels = this.channels;
                let shipping_ids = channels.map(channel => {
                    return channel.value;
                });
                for (let i = 0; i < selectShippings.length; i++) {
                    shipping_ids.indexOf(selectShippings[i].value) === -1 ? channels.push(selectShippings[i]) : 0;
                }
                this.set_collectionList(this.channels);
                this.currentChannel = this.channels.length - 1;
                this.change_channel(this.currentChannel);
            },
            //点击不同标签触发的函数
            change_channel(index) {
                if (isNaN(Number(index))) {
                    index = this.channels.indexOf(index);
                }
                this.currentChannel = index;
            },
            handleClose(ev, item, index) {
                ev.stopPropagation();
                let nextCurrentChannel = 0;
                if (item.packages.length === 0) {
                    this.channels.splice(index, 1);
                    nextCurrentChannel = Math.min(this.channels.length - 1, index);
                    this.change_channel(nextCurrentChannel);
                } else {
                    this.$confirm(`该集包单还有${item.packages.length}个包裹未集包，确定关闭?`, '提示', {
                        confirmButtonText: '关闭',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.channels.splice(index, 1);
                        nextCurrentChannel = Math.min(this.channels.length - 1, index);
                        this.change_channel(nextCurrentChannel);
                    }).catch(code => {
                    });
                }
                this.set_collectionList(this.channels);
            },
            async from_package_collection() { // 继续集包
                let param = this.param;
                if (window.objlength(param) !== 0 && param.packages.length !== 0) {
                    let packages = param.packages;
                    let data = {shipping_id: [param.shipping_id]};
                    // 继续集包时必须是没有邮寄方式的，因此要创建邮寄方式，当前渠道也是唯一渠道
                    let item = await this.newChannel(data);
                    let targetChannel = this.channels[0];
                    const channel = {
                        id: param.id || 0,
                        code: param.code,
                        shipping_name: targetChannel.label,
                        shipping_id: param.shipping_id,
                        collect_type: param.collect_type,
                        collect_weight: param.collect_weight,
                        collect_label: this.collect_label(param.collect_type),
                        packages: packages
                    };
                    Object.assign(targetChannel, channel);
                    this.change_channel(this.channels.indexOf(targetChannel));
                    //向VUEX中存放正在处理的面单号的数组
                    this.set_collectionList(this.channels);
                }
            },
            /*pollingWeight() {
                let id = this.searchData.shipping_number;
                let req = new Request('http://localhost:10093/setPackageinfo', {
                    method: 'post',
                    mode: 'cors',
                    headers: {"Content-Type": 'application/x-www-form-urlencoded'},
                    body: obj2url({'ID': id, 'CallBack': 'xxx'})
                });
                this.fetch_local(req).then(local => {
                    this.set_timer();
                });
            },*/
            start_whole(direction) {
                if (this.weighingStyle === 'whole') {
                    if (whole_websocket && whole_websocket.IsOpen === true) {
                        whole_websocket.sendRequest({
                            Direction: direction,
                        });
                        this.cleanSearchData();
                        this.canSetWeight = false;
                        this.shippingNumberFocus();
                    } else {
                        wholeWebSocket({
                            open: () => {
                                whole_websocket.connected();
                                whole_websocket.sendRequest({
                                    Direction: direction,
                                });
                                this.cleanSearchData();
                                this.canSetWeight = false;
                                this.shippingNumberFocus();
                            },
                            error: () => {
                                whole_websocket.closed();
                                let req = new Request(`http://127.0.0.1:7001/Api/GetJFData?Direction=${direction}`, {
                                    method: 'get',
                                    mode: 'cors',
                                    headers: {"Content-Type": 'application/x-www-form-urlencoded'}
                                });
                                this.fetch_local(req).then(res => {
                                    console.log(`start whole`, res, direction);
                                }).catch(code => {
                                    console.log(`start whole`, code, direction);
                                }).finally(() => {
                                    this.canSetWeight = false;
                                    this.cleanSearchData();
                                    this.shippingNumberFocus();
                                });
                            },
                            message: ({data}) => {
                                this.$refs.search_module.whole_weighing(data);
                            }
                        });
                    }
                    setTimeout(() => {
                        if (direction === 2 && this.$refs.search_module.searchData.shipping_number === '') {
                            this.shippingNumberFocus();
                        }
                    }, 1500);
                }

            },
            fetch_local(req) { // 开启串口并绑定id
                return new Promise((success, fail) => {
                    fetch(req).then(async res => {
                        if (200 === res.status) {
                            try {
                                const json = await res.json()
                                success(json);
                            } catch (e) {
                                if (e instanceof Error) {
                                    fail(e.message);
                                } else {
                                    fail(e);
                                }
                            }
                        } else {
                            res.json().then(json => {
                                fail(json, res.status);
                            })
                        }
                    }).catch(error => {
                        fail(error)
                    })
                })
            },
            /*set_timer() { // 打印机轮询请求
                let req = new Request('http://localhost:10093/getWeighCache', {
                    method: 'get',
                    mode: 'cors',
                    headers: {"Content-Type": 'application/x-www-form-urlencoded'},
                });
                if (this.timer) {
                    clearInterval(this.timer)
                } else {
                    this.timer = setInterval(() => {
                        this.fetch_local(req).then(res => {
                            if (Number(res.status) === 1) {
                                clearInterval(this.timer);
                                this.timer = null;
                                this.searchData.package_weight = res.directResults;
                                this.submitWeight(); // 称重称自带回车，不用这边触发
                            }
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code})
                        })
                    }, 1000)
                }
                this.fetch_local(req).then(res => {
                    if (Number(res.status) === 1) {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.searchData.package_weight = res.directResults;
                        this.submitWeight(); // 称重称自带回车，不用这边触发
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            submitWeight() { // 重量enter，轮询打印机后触发
                if (this.searchData.package_weight && this.searchData.shipping_number) {
                    this.$refs.search_module.isRead = true;
                    this.changeShipping();
                    this.init_data(this.searchData);
                }
            },*/
            changeShipping() {
                this.$refs.search_module.warning.package_weight = '';
                this.$refs.search_module.warning.shipping_number = '';
                this.$refs.search_module.warning.success = false;
            },
            create_channel(data) { // 通过返回信息创建袋子
                let {package_weight, quantity, shipping_method_id, type, ...channel} = data;
                channel.collect_type = type;
                channel.shipping_id = shipping_method_id;
                channel.collect_label = this.collect_label(channel.collect_type);
                return channel;
            },
            create_package(data) { // 通过集包返回信息创建包裹
                let {is_recently, carrier_id, carrier_name, package_collection, main_shipping_id, shipping_id, ...newPackage} = data;
                return newPackage;
            },
            change_collect_type(val) {
                let channel = this.channels[this.currentChannel];
                if (!channel) return;
                channel.collect_type = val;
                channel.collect_label = this.collect_label(val);

            },
            weighing_change(val) {
                this.weighingStyle = val;
            }
        },
        computed: {
            ...mapGetters({audioToken: 'audio/token'}),
            currentCollection() {
                return this.channels[this.currentChannel] || {};
            },
            packages() {
                return this.currentCollection.packages || [];
            },
            curDir() {
                if (this.currentChannel === 0) {
                    return this.defaultDir;
                } else {
                    return this.defaultDir === 2 ? 1 : 2;
                }
            },
            package_collection_number() {
                // 先过滤掉没有code的，再返回codes
                return this.channels.filter(channel => !!channel.code).map(channel => channel.code);
            },
            shipping_id() {
                let shipping_id = [];
                const channelsHasShippingId = this.channels.some(channel => {
                    return channel.value;
                });
                if (channelsHasShippingId) {
                    this.channels.map(channel => {
                        channel.value && shipping_id.push(channel.value);
                    });
                }
                return shipping_id;
            },

        },
        watch: {
            'currentCollection.collect_type'(value) {
                this.collectTypes.find(row => {
                    if (row.value === value) {
                        this.currentCollection.collect_weight = row.weight;
                        this.currentCollection.collect_type = row.value;
                        this.currentCollection.collect_label = row.label;
                        return true;
                    }
                });
            },
            param(val) {
                val = val ? val : {};
                this.from_package_collection();
            }
        },
        props: {
            param: {},
            channels: {}
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            labelButtons: require('@/components/label-buttons').default,
            addChannel: require('./add-channel').default
        },
    }
</script>
