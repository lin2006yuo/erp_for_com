<template>
    <div v-loading="loading" class="store-management-right" element-loading-text="玩命加载中...">
        <el-tabs v-model="activeName">
            <el-tab-pane label="仓库地址" name="warehouseAddress">
                <entrepot-address ref="address"
                                  :entrepot-id="entrepotId"
                                  @show-height="show_height"
                                  :form="address"
                                  v-model="isEdit"
                                  :isAdd='isAdd'
                                  @cancelCreate="cancel_create"
                                  @save='save'
                                  @update='update'></entrepot-address>
            </el-tab-pane>
            <el-tab-pane label="邮寄方式" name="shipWay">
                <entrepot-shipping :entrepot-id="entrepotId"
                                   :max-height="maxHeight"
                                   :lists="shipping"
                                   :isAdd='isAdd'
                                   :form="address"
                                   @save_mail="save_mail"
                                   v-model="third"></entrepot-shipping>
            </el-tab-pane>
            <el-tab-pane label="参数设置" name="systemParam">
                <entrepot-config :id="entrepotId"
                                 @search="get_system"
                                 :system-data="systemData" @upload="upload"></entrepot-config>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="stylus">
    .store-management-right {
        .system-placeholder {
            text-align: center;
            margin-top: 20px;
            color: #ccc;
        }
    }

    .scroll {
        > .config-table {
            overflow: hidden auto;
            max-height: 600px;
        }
    }
</style>
<script>
    import {store_check, api_get_warehouse_config} from '@/api/storeManagement'

    export default {
        data() {
            return {
                isEdit: false,
                isAdd: false,
                third: false,
                maxHeight: 400,
                loading: true,
                shipping: [],
                activeName: 'warehouseAddress',
                address: {
                    code: '',
                    name: '',
                    type: 1,
                    country_code: '',
                    status: 1,
                    address: '',
                    zip: '',
                    contact_name: '',
                    phone: '',
                    state_or_provice: '',
                    city: '',
                    area: '',
                    interface_token: '',
                    interface_user_name: '',
                    entrepot: '',
                    operation_mode: 11,
                    is_virtual_transit: false,
                    transit_warehouse_id: '',
                    parent_warehouse_id: '',
                },
                systemData: {
                    warehouse: {
                        is_auto_check: 0,
                        is_divide_platform: 0,
                        test_print: 0,
                        shelf_days: 0,
                        weight_interval: [],
                    }
                }
                /*singleOrMore: 0,
                moreCarrier: 0,
                bind_picking: 0,
                picking_max_quantity: 0,
                package_weight_min_deviation: 0,
                package_weight_max_deviation: 0,
                collection_weight_min_deviation: 0,
                collection_weight_max_deviation: 0,
                single_manual_value: 0,
                is_allow_stop: 0,
                is_divide_platform: 0,
                is_auto_check: 0,
                test_print: 0,
                shelf_days: 0,
                weight_interval: [],*/
            }
        },
        methods: {
            quote_fun() {
                this.$refs.address.cite_fun()
            },
            cancel_create() {
                this.$emit('cancelCreate', this.isEdit);
            },
            save(data) {
                this.$emit('save', data);
            },
            update(form) {
                this.$emit('update', form);
            },
            save_mail(entrepotId) {
                this.$http(store_check, entrepotId).then(res => {
                    this.shipping = res.shipList;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
            },
            show_height(height) {
                this.maxHeight = height;
            },
            upload(data) {
            },
            get_system(id) {
                this.$http(api_get_warehouse_config, id).then(res => {
                    this.systemData = res;
                    this.systemData.config = res.config.map(row => {
                        //0 单选  1多选
                        row.type === 3 && row.choose_type === 0 && this.action_type_zero(row);
                        row.type === 3 && row.choose_type === 1 && this.action_type_one(row);
                        return row
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            action_type_zero(item) {
                let curValue = item.value.value;
                if (this.is_show(item)) {
                    curValue = !!Number(item.value.value);
                }
                if (!this.common_action(item)) {
                    this.$set(item, 'choose', curValue);
                    return
                }
                let find = item.setting.find(row => {
                    return row.value == item.value.value;
                });
                if (!!find && item.value.child && item.value.child.length > 0) {
                    if (find.choose_type === 0) {
                        find.choose = item.value.child[0].value;
                    } else {
                        find.child.forEach(child => {
                            let findChild = item.value.child.find(val => {
                                return val.value == child.value;
                            });
                            child.checked = !!findChild;
                        })
                    }
                }
                this.$set(item, 'choose', curValue);
            },
            action_type_one(item) {
                if (!this.common_action(item)) {
                    return
                }
                item.setting.forEach(row => {
                    let find = item.value.find(child => {
                        return row.value === child.key.value;
                    });
                    row.checked = !!find;
                    if (!!find && row.child && row.child.length > 0) {
                        if (row.choose_type === 0) {
                            row.choose = find.child[0].value;
                        } else {
                            row.child.forEach(setting => {
                                let findChild = find.child.find(val => {
                                    return setting.value === val.value;
                                });
                                setting.checked = !!findChild;
                            })
                        }
                    }
                })
            },
            is_show(item) {
                let list = ["tort_ebay", "tort_amazon", "tort_wish", "tort_aliexpress", "tort_pandao", "tort_joom", "tort_shopee"];
                return list.includes(item.name);
            },
            common_action(item) {
                if (!item.setting || item.setting.length === 0) {
                    return false
                }
                item.setting.forEach(row => {
                    if (row.child && row.child.length > 0) {
                        row.choose_type = row.child[0].choose_type;
                        row.child[0].choose_type === 0 && (row.choose = '');
                        row.child[0].choose_type === 1 && (row.child.forEach(child => {
                            child.checked = false
                        }))
                    }
                });
                if (!item.value) {
                    return false
                }
                return true
            },
        },
        watch: {
            entrepotId(val) {
                if (val) {
                    this.isEdit = false;
                    this.isAdd = false;
                    this.loading = true;
                    this.get_system(val);
                    this.$http(store_check, val).then(res => {
                        this.address.code = res.code;
                        this.address.name = res.name;
                        this.address.type = res.type;
                        this.address.country_code = res.country_code;
                        this.address.status = res.status;
                        this.address.address = res.address;
                        this.address.zip = res.zip;
                        this.address.contact_name = res.contact_name;
                        this.address.phone = res.phone;
                        this.address.state_or_provice = res.state_or_provice;
                        this.address.city = res.city;
                        this.address.area = res.area;
                        this.address.operation_mode = res.operation_mode;
                        this.shipping = res.shipList;
                        this.address.third = res.third;
                        this.address.entrepot = res.code;
                        this.address.is_virtual_transit = !!res.is_virtual_transit;
                        this.address.transit_warehouse_id = res.transit_warehouse_id === 0 ? '' : res.transit_warehouse_id;
                        this.address.parent_warehouse_id = res.parent_warehouse_id || '';
                        this.third = res.third;
                        /*this.systemData = {
                            singleOrMore: res.singleOrMore,
                            moreCarrier: res.moreCarrier,
                            bind_picking: res.bind_picking,
                            picking_max_quantity: res.picking_max_quantity,
                            package_weight_min_deviation: res.package_weight_min_deviation,
                            package_weight_max_deviation: res.package_weight_max_deviation,
                            collection_weight_min_deviation: res.collection_weight_min_deviation,
                            collection_weight_max_deviation: res.collection_weight_max_deviation,
                            single_manual_value: res.single_manual_value,
                            is_allow_stop: res.is_allow_stop,
                            is_divide_platform: res.is_divide_platform,
                            is_auto_check: res.is_auto_check,
                            test_print: res.test_print,
                            shelf_days: res.shelf_days,
                            weight_interval: res.weight_interval,
                        };*/
                        this.loading = false
                    }).catch(code => {
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: code.message || code,
                        });
                    })
                } else {
                    this.activeName = 'warehouseAddress';
                    this.address.code = '';
                    this.address.name = '';
                    this.address.type = 1;
                    this.address.country_code = '';
                    this.address.status = 1;
                    this.address.address = '';
                    this.address.zip = '';
                    this.address.contact_name = '';
                    this.address.phone = '';
                    this.address.state_or_provice = '';
                    this.address.city = '';
                    this.address.area = '';
                    this.address.is_virtual_transit = false;
                    this.shipping = [];
                    this.address.entrepot = '';
                    this.address.transit_warehouse_id = '';
                    this.address.parent_warehouse_id = '';
                    this.address.operation_mode = 11;
                    this.isEdit = 'create';
                    this.isAdd = true
                }
            },
        },
        props: {
            entrepotId: {
                required: true,
                type: Number
            },
        },
        components: {
            entrepotAddress: require('./entrepot-address.vue').default,
            entrepotShipping: require('./entrepot-shipping.vue').default,
            entrepotConfig: require('./entrepot-config.vue').default,
        }
    }
</script>
