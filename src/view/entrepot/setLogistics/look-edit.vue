<template>
    <!--<page class="p-look-edit">-->
    <page-dialog v-model="editVisible" size="full"
                 :title="titleName" @change="change_dialog">
        <el-tabs ref="tabs" @tab-click="tab_click" :active-name="action">
            <el-tab-pane name="base-info" class="scroll" v-resize="{height: 150}" label="基本信息" key="base-info">
                <base-info :baseData="baseData"
                           :shipping-method="shippingMethod"
                           :editable="editable"
                           ref="base"></base-info>
            </el-tab-pane>
            <el-tab-pane name="express-info" class="scroll" v-resize="{height: 150}" label="面单信息" key="express-info">
                <express-info
                        v-if="expressShow"
                        :express-data="expressData"
                        :shipping-method="shippingMethod"
                        :shortname-method="shortnameMethod"
                        :special-picking-list="specialPickingList"
                        :editable="editable"
                        :carrier_id="carrier_id"
                        ref="express"></express-info>
            </el-tab-pane>
            <el-tab-pane name="effective" class="scroll" v-resize="{height: 150}" label="实效及运费" key="effective">
                <effective v-if="effectiveShow" :effective-data="effData"
                           @effective-change="change_eff_data"
                           :editable="editable" :shipping-id="shipping"
                           @files-success="files_success"></effective>
            </el-tab-pane>
            <el-tab-pane name="deliver-channel" class="scroll" v-resize="{height: 150}" label="可发货平台"
                         key="deliver-channel">
                <deliver-channel v-if="channelShow" :channel-data="channelData"
                                 :editable="editable"
                                 ref="channel"></deliver-channel>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <div v-if="editable">
                <el-button size="mini" type="primary" @click="keep">确定</el-button>
                <el-button size="mini" @click.native="editVisible=false">取消</el-button>
            </div>
            <div v-else>
                <el-button size="mini" @click.native="editVisible=false">关闭</el-button>
            </div>
        </div>
    </page-dialog>
    <!--</page>-->
</template>
<style lang="stylus">
    .p-look-edit {
        /*.el-tabs {
            width: 100%;
        }*/
    }

    .scroll {
        > div {
            overflow: auto;
        }
    }
</style>
<script>
    import {api_base_keep, api_effective_keep, api_express_keep, api_logistics_channel_keep} from "@/api/setLogistics"

    export default {
        data() {
            return {
                editVisible: false,
                action: "base-info",
                expressShow: false,
                effectiveShow: false,
                channelShow: false,
            }
        },
        methods: {
            channel_init() {
                this.$nextTick(() => {
                    this.$refs.channel.init();
                });
            },
            tab_click(val) {
                switch (val.index) {
                    case '1':
                        this.expressShow = true;
                    case '2':
                        this.effectiveShow = true;
                    case '3':
                        if (!this.channelShow) {
                            this.channel_init();
                        }
                        this.channelShow = true;
                }
                this.action = val.name
            },
            files_success(id) {
                this.$emit('files-success', id);
            },
            keep() {
                switch (this.action) {
                    case "base-info":
                        let arr = this.$refs.base.submit();
                        setTimeout(() => {
                            let flag = true;
                            arr.forEach(row => {
                                if (row === false) {
                                    flag = false;
                                    this.$message({
                                        type: "error",
                                        message: `请完善信息再保存!`
                                    });
                                }
                            });
                            flag && this.keep_base();
                        }, 300);
                        break;
                    case "express-info":
                        this.keep_express();
                        break;
                    case "effective":
                        this.keep_eff();
                        break;
                    case "deliver-channel":
                        this.keep_channel();
                        break;
                }
            },
            keep_base() {
                Object.keys(this.baseData).forEach(key => {
                    if (typeof this.baseData[key] === 'string') {
                        this.baseData[key] = this.baseData[key].trim();
                    }
                });
                let data = this.clone(this.baseData);
                data.is_pickup_address = data.is_sender_address ? 1 : 0;
                data.is_return_address = data.is_sender_address ? 1 : 0;
                data.is_sender_address = data.is_sender_address ? 1 : 0;
                let warehouses = this.baseData.warehouses.filter(row => {
                    return row.enabled
                });
                data.warehouses = warehouses.map(row => {
                    return {
                        warehouse_id: row.warehouse_id,
                        shipping_method_id: row.shipping_method_id,
                    }
                });
                data.channels.forEach(row => {
                    row.info.forEach(item => {
                        if (item.type === "select") {
                            item.selects && delete item.selects;
                        }
                    })
                });
                this.$http(api_base_keep, this.baseData.id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('update-name', this.baseData.id, this.baseData.shortname);
                    this.editVisible = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            keep_express() {
                Object.keys(this.expressData).forEach(key => {
                    if (typeof this.expressData[key] === 'string') {
                        this.expressData[key] = this.expressData[key].trim();
                    }
                });
                //水印坐标检验
                let isValidate = true;
                Object.keys(this.expressData.coordinate_data).some(key => {
                    this.expressData.coordinate_data[key].x = Number(this.expressData.coordinate_data[key].x);
                    this.expressData.coordinate_data[key].y = Number(this.expressData.coordinate_data[key].y);
                    if (isNaN(this.expressData.coordinate_data[key].x) ||
                        isNaN(this.expressData.coordinate_data[key].y) ||
                        this.expressData.coordinate_data[key].x > 100 ||
                        this.expressData.coordinate_data[key].y > 100) {
                        this.$message({type: 'error', message: `国家${key}的水印坐标为无效输入`});
                        isValidate = false;
                    }
                });
                if (!isValidate) return;
                let data = this.clone(this.expressData);
                this.$http(api_express_keep, this.baseData.id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.editVisible = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            keep_eff() {
                Object.keys(this.effData).forEach(key => {
                    if (typeof this.effData[key] === 'string') {
                        this.effData[key] = this.effData[key].trim();
                    }
                });
                let data = this.clone(this.effData);
                delete data.details_0;
                delete data.details_1;
                delete data.details_2;
                delete data.details;
                //适用物流
                let allow = this.effData.allow_properties.filter(row => {
                    return row.enabled
                });
                // 可发货平台
                data.channels = this.effData.channels.map(row => {
                    return {
                        id: row.id,
                        enabled: row.enabled,
                    }
                });
                data.allow_properties = allow.map(row => {
                    return {
                        value: row.value,
                        field: row.field,
                    }
                });
                //禁运物流
                let deny = this.effData.deny_properties.filter(row => {
                    return row.enabled
                });
                data.deny_properties = deny.map(row => {
                    return {
                        value: row.value,
                        field: row.field,
                    }
                });
                switch (this.effData.arriveable_type) {
                    case 0:
                        let a = this.copy_(this.clone(this.effData.details_0));
                        data.details = a;
                        break;
                    case 1:
                        let b = this.copy_(this.clone(this.effData.details_1));
                        data.details = b;
                        console.log(b, 'b');
                        break;
                    case 2:
                        let c = this.copy_(this.clone(this.effData.details_2));
                        console.log(c, 'c');
                        data.details = c;
                        break;
                }
                this.$http(api_effective_keep, data.id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.editVisible = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            keep_channel() {
                let data = clone(this.channelData);
                data.channels.push(data.common);
                this.$http(api_logistics_channel_keep, data.id, {data: data.channels}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.editVisible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            copy_(data) {
                data.forEach(row => {
                    row.is_volumn_weight = row.is_volumn_weight ? 1 : 0;
                    row.is_oli_additional = row.is_oli_additional ? 1 : 0;
                    row.is_stage_fee = row.is_stage_fee ? 1 : 0;
                    row.is_registered_fee = row.is_registered_fee ? 1 : 0;
                });
                return data;
            },
            clone(obj) {
                let o;
                if (typeof obj === "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (let i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (let j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            change_dialog(val) {
                if (!val) {
                    this.action = "base-info";
                    this.expressShow = false;
                    this.effectiveShow = false;
                    this.channelShow = false;
                    this.$emit('close_edit');
                }
            },
            change_eff_data(val) {
                this.effData = val;
            }
        },
        watch: {
            value(val) {
                this.editVisible = val
            },
            editVisible(val) {
                this.$emit("input", val)
            }
        },

        computed: {
            titleName() {
                if (this.editable) {
                    return `编辑物流商：${this.title}邮件方式`
                } else {
                    return `查看物流商：${this.title}邮件方式`
                }
            },
            shipping() {
                let shipping = [];
                if (this.baseData) {
                    shipping = [this.baseData.carrier_id, this.baseData.id];
                }
                return shipping;
            },
        },
        props: {
            shippingMethod: {
                type: Array
            },
            shortnameMethod: {
                type: Array
            },
            specialPickingList: {},
            value: {},
            effData: {
                required: true,
                type: Object
            },
            baseData: {
                required: true,
                type: Object
            },
            expressData: {
                required: true,
                type: Object
            },
            editable: {
                required: true,
                type: Boolean
            },
            channelData: {
                required: true,
                type: Object
            },
            title: '',
            carrier_id: '',
        },
        components: {
            baseInfo: require('./base-info.vue').default,
//            effective: require('./effective.vue').default,
            effective: require('./effective-copy.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            expressInfo: require('./express-info.vue').default,
            deliverChannel: require('./deliver-channel.vue').default,
        }
    }
</script>
