<template>
    <el-row class="address-style">
        <ui-card v-if="form.third&&isAdd === false">
            <div>
                <el-form :model="form" label-width="150px">
                    <el-form-item label="Token Customer ID：">
                        <el-col :span="12">
                            <el-input v-model="form.interface_token" :disabled="!isEdit"></el-input>
                        </el-col>
                        <el-col :span="4" v-if="form.type==='winit'">
                            <el-tooltip class="item" effect="dark" content="未提供接口" placement="top-start">
                                <el-button type="primary" style="margin-left:10px;" size="mini">获取token</el-button>
                            </el-tooltip>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="userName：">
                        <el-col :span="8">
                            <el-input v-model="form.interface_user_name" :disabled="!isEdit"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
        </ui-card>
        <ui-card>
            <div>
                <ui-form :model="form" :rules="rules" ref="form" label-width="120px" localtion="right">
                    <el-row v-show="type_.length<=0">
                        <ui-form-item label="代码：" class="inline">
                            <el-input v-model="form.code" :disabled="!isEdit"></el-input>
                        </ui-form-item>
                        <ui-form-item label="运营类型：" class="inline">
                            <el-select class="s-width-default"
                                       clearable
                                       :disabled="!isEdit"
                                       v-model="form.operation_mode">
                                <el-option v-for="item in operationList"
                                           :value="item.value"
                                           :label="item.label"
                                           :key="item.value"></el-option>
                            </el-select>
                        </ui-form-item>
                    </el-row>
                    <el-row>
                        <ui-form-item label="仓库名称：" class="inline">
                            <el-input v-model="form.name" :disabled="!isEdit"></el-input>
                        </ui-form-item>
                        <ui-form-item label="周转仓库：" class="inline">
                            <el-select class="s-width-default"
                                       clearable
                                       :disabled="!isEdit"
                                       v-model="form.parent_warehouse_id">
                                <el-option v-for="item in localWarehouseList"
                                           :value="item.value"
                                           :label="item.label"
                                           :key="item.value"></el-option>
                            </el-select>
                        </ui-form-item>
                    </el-row>
                    <el-row>
                        <ui-form-item label="仓库类型：" class="inline">
                            <el-select v-model="form.type"
                                       :disabled="isDisabled"
                                       style="width:153px">
                                <el-option v-for="item in types"
                                           :label="item.name"
                                           :value="item.code"
                                           :key="item.code">
                                </el-option>
                            </el-select>
                        </ui-form-item>

                        <ui-form-item label="仓库：" class="inline">
                            <select-remote v-model="form.entrepot"
                                           @change="entrepot_change"
                                           :remote="entrepotRemote"
                                           :disabled="isDisabled"
                                           style="width: 153px;"
                            ></select-remote>
                        </ui-form-item>
                        <ui-form-item class="inline" v-if="form.type === 6">
                            <el-checkbox v-model="form.is_virtual_transit"
                                         :disabled="!isEdit">虚拟仓
                            </el-checkbox>
                        </ui-form-item>
                    </el-row>
                    <el-row>
                        <ui-form-item label="中转仓库：" class="inline transit-warehouse" v-if="form.type!==1">
                            <el-select v-model="form.transit_warehouse_id" multiple :disabled="isTransitDisabled">
                                <el-option v-for="item in warehouses"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value">
                                </el-option>
                            </el-select>
                        </ui-form-item>
                    </el-row>
                    <el-row>
                        <ui-form-item label="是否启用：" class="inline">
                            <el-select v-model="form.status" :disabled="!isEdit" style="width:153px">
                                <el-option v-for="item in status"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value">
                                </el-option>
                            </el-select>
                        </ui-form-item>
                        <ui-form-item label="所在国家：" class="inline">
                            <el-input v-model="form.country_code"
                                      :disabled="!isEdit">
                            </el-input>
                        </ui-form-item>
                    </el-row>
                    <ui-form-item label="所在地区：">
                        <el-col :span="5" class="p-city">
                            <el-select v-model="form.state_or_provice" @change="change_province" filterable
                                       v-if="isEdit">
                                <el-option label="" value="">请选择省</el-option>
                                <el-option
                                        v-for="item in chinaAddress"
                                        :label="item.name"
                                        :value="item.name"
                                        :key="item.name">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.state_or_provice" :disabled="true" v-if="!isEdit">
                                <el-option label="" value=""></el-option>
                                <el-option
                                        v-for="item in chinaAddress"
                                        :label="item.name"
                                        :value="item.name"
                                        :key="item.name">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5" class="p-city">
                            <el-select v-model="form.city" @change="change_city" filterable v-if="isEdit">
                                <el-option label="" value="">请选择市</el-option>
                                <el-option
                                        v-for="item in selected_city"
                                        :label="item.name"
                                        :value="item.name"
                                        :key="item.name">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.city" :disabled="true" v-if="!isEdit">
                                <el-option label="" value=""></el-option>
                                <el-option
                                        v-for="item in selected_city"
                                        :label="item.name"
                                        :value="item.name"
                                        :key="item.name">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5" class="p-city">
                            <el-select v-model="form.area" @change="change_district" filterable v-if="isEdit">
                                <el-option label="" value="">请选择县/区</el-option>
                                <el-option
                                        v-for="item in selected_district"
                                        :label="item.name"
                                        :value="item.name"
                                        :key="item.name">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.area" :disabled="true" v-if="!isEdit">
                                <el-option label="" value=""></el-option>
                                <el-option
                                        v-for="item in selected_district"
                                        :label="item.name"
                                        :value="item.name"
                                        :key="item.name">
                                </el-option>
                            </el-select>
                        </el-col>
                    </ui-form-item>

                    <ui-form-item label="详细地址：">
                        <el-col :span="20">
                            <el-input type="textarea" v-model="form.address" :disabled="!isEdit"
                                      :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                        </el-col>
                    </ui-form-item>

                    <el-row>
                        <ui-form-item label="邮编：" prop="zip" localtion="right" :bubble="true" class="inline">
                            <el-input v-model="form.zip" :disabled="!isEdit"></el-input>
                        </ui-form-item>
                    </el-row>

                    <el-row>
                        <ui-form-item label="联系人姓名：" prop="contact_name" localtion="right" :bubble="true"
                                      class="inline">
                            <el-input v-model="form.contact_name" :disabled="!isEdit"></el-input>
                        </ui-form-item>

                        <ui-form-item label="电话/手机：" prop="phone" localtion="right" :bubble="true" class="inline">
                            <el-input v-model="form.phone" :disabled="!isEdit"></el-input>
                        </ui-form-item>
                    </el-row>

                    <ui-form-item>
                        <div v-if="isEdit === 'create'">
                            <el-button type="primary" @click.native="create" size="mini" :disabled="isCreate">保存
                            </el-button>
                            <el-button @click.native="cancel_create" size="mini">取 消</el-button>
                        </div>
                        <div v-if="isEdit === 'modify'">
                            <permission tag="ElButton" type="primary" @click.native="modify"
                                        :disabled="isCreate" size="mini" :route="apis.url_store_update">修改
                            </permission>
                            <el-button @click.native="cancel_modify" size="mini">取 消</el-button>
                        </div>
                        <el-button type="primary" @click="edit" v-if="isEdit==false" size="mini">编 辑</el-button>
                    </ui-form-item>
                </ui-form>
            </div>
        </ui-card>
    </el-row>
</template>
<style lang="stylus">
    .address-style {
        .el-form-item {
            margin-bottom: 5px;
        }
        .transit-warehouse {
            width: calc(100% - 120px);
        }
        .p-city {
            margin-right: 10px;
        }
        .el-form-item__label {
            width: 140px;
        }
        .el-checkbox__input.is-disabled.is-checked {
            .el-checkbox__inner {
                background-color: #33B2FC;
                border-color: #2E90FE;
            }
        }
    }
</style>
<script>
    import {
        store_add,
        store_update,
        store_type,
        store_type_two,
        store_address,
        url_store_update
    } from '@/api/storeManagement';
    import {tel, zip, name} from '@/define/validator_reg';
    import {api_warehous_transit} from '@/api/entrepot-picking';
    import {api_warehouse_info} from "@/api/fba-stock";

    export default {
        permission: {
            url_store_update
        },
        data() {
            let checkPhone = (rule, value, callback) => {
                setTimeout(() => {
                    if (!tel.test(value)) {
                        callback(new Error('电话格式错误！'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            let checkZip = (rule, value, callback) => {
                setTimeout(() => {
                    if (!zip.test(value)) {
                        callback(new Error('邮编格式错误！'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            let checkName = (rule, value, callback) => {
                setTimeout(() => {
                    if (!name.test(value)) {
                        callback(new Error('姓名输入有误！'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            return {
                API: false,
                basi: true,
                isEdit: this.value,
                height: 425,
                types: [],
                status: [
                    {label: "是", value: 1},
                    {label: "否", value: 0}
                ],
                chinaAddress: {},
                oldform: {},
                type_: [],
                rules: {
                    phone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    zip: [
                        {validator: checkZip, trigger: 'blur'}
                    ]
                },
                warehouses: [],
                localWarehouseList: [],
                operationList: [
                    {label: '自营本地', value: 11},
                    {label: '自营海外', value: 12},
                    {label: '非自营本地', value: 21},
                    {label: '非自营海外', value: 22},
                ]
            }
        },
        mounted() {
            this.$http(store_type).then(res => {//------------------类型
                this.types = res;
            }).catch(code => {
            });
            this.$http(store_address).then(res => {//-------------地址
                this.chinaAddress = res;
            }).catch(code => {
            });
            this.warehouses_init();
            this.local_warehouse_init();
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
            local_warehouse_init() {
                this.$http(api_warehouse_info, {type: 1}).then(res => {
                    this.localWarehouseList = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            show() {
                if (this.API && this.basi) {
                    this.height = 325;
                    this.$emit("show-height", this.height);
                } else if (this.API && !this.basi) {
                    this.height = 600;
                    this.$emit("show-height", this.height);
                } else if (!this.API && this.basi) {
                    this.height = 425;
                    this.$emit("show-height", this.height);
                } else if (!this.API && !this.basi) {
                    this.height = 650;
                    this.$emit("show-height", this.height);
                } else {
                    this.height = 325;
                    this.$emit("show-height", this.height);
                }
            },
            create() {
                let newForm = this.clone(this.form);
                if (this.type_.length > 0) {
                    newForm.code = this.form.entrepot;
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        Object.keys(newForm).forEach(key => {
                            if (typeof newForm[key] === 'string') {
                                newForm[key] = newForm[key].trim();
                            }
                        });
                        this.$http(store_add, newForm).then(res => {
                            this.$message({
                                showClose: true,
                                type: 'success',
                                message: '新增成功!'
                            });
                            let create_time = Date.parse(new Date);
                            create_time = create_time / 1000;
                            this.$set(newForm, 'id', parseInt(res.id));
                            this.$set(newForm, 'create_time', create_time);
                            this.$emit('save', newForm);
                            this.isEdit = false;
                        }).catch(code => {
                            this.$message({
                                showClose: true,
                                type: 'error',
                                message: code.message || code,
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancel_create() {//-------------取消新增
                this.$refs.form.resetFields();
                this.$emit('cancelCreate');
            },
            modify() {
                this.$set(this.form, 'id', this.entrepotId);
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        Object.keys(this.form).forEach(key => {
                            if (typeof this.form[key] === 'string') {
                                this.form[key] = this.form[key].trim();
                            }
                        });
                        this.$emit('update', this.form);
                        this.isEdit = false;
                    } else {
                        return false;
                    }
                });
            },
            cancel_modify() {//--------------取消更新
                this.$refs.form.resetFields();
                for (let i in this.oldform) {
                    if (this.oldform.hasOwnProperty(i)) {
                        this.form[i] = this.oldform[i];
                    }
                }
                this.isEdit = false;
            },
            edit() {//------------------编辑
                for (let i in this.form) {
                    if (this.form.hasOwnProperty(i)) {
                        this.oldform[i] = this.form[i];
                    }
                }
                this.isEdit = "modify";
            },
            cite_fun() {
                this.isEdit = "modify";
            },
            /*------------------更改省市区时 清空*/
            change_province(val) {
                this.form.city = '';
                this.form.area = '';

            },
            change_city(val) {
                this.form.area = '';
            },
            change_district(val) {

            },
            entrepot_change(val) {//-----------------二级仓库
                this.type_.forEach(data => {
                    if (data.code === val) {
                        this.form.name = data.name
                    }
                })
            },
            //--------对象深度克隆
            clone(obj) {
                var o;
                if (typeof obj === "object") {
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
            }
        },
        computed: {
            entrepotRemote() {
                let type = this.form.type;
                return (callback) => {
                    this.$http(store_type_two, type).then(res => {
                        res = res.map(row => {
                            return {label: row.name, value: row.code};
                        });
                        callback(res, []);
                    })
                };
            },
            pcc: {
                get() {
                    return `${this.form.state_or_provice}-${this.form.city}-${this.form.area}`;
                },
                set(val) {
                    let pcc = val.split('-');
                    this.form.state_or_provice = parseInt(pcc[0]);
                    this.form.city = parseInt(pcc[1]);
                    this.form.area = parseInt(pcc[2]);
                }
            },

            selected_city() {//---------------------------市
                for (let i in this.chinaAddress) {
                    if (this.chinaAddress[i].name === this.form.state_or_provice) {
                        return this.chinaAddress[i]._child;
                    }
                }
            },
            selected_district() {//---------------县/区
                for (let i in this.chinaAddress) {
                    for (let j in this.chinaAddress[i]._child) {
                        if (this.chinaAddress[i]._child[j].name === this.form.city) {
                            return this.chinaAddress[i]._child[j]._child;
                        }
                    }
                }
            },
            isDisabled() {//-----------------------编辑时仓库类型不可选
                if (this.isEdit === "modify") {
                    return true
                }
                if (this.isEdit !== 'create') {
                    return true
                }
                return false
            },
            isTransitDisabled() { //----------------编辑和添加时可选择中转仓
                if (!this.isEdit) {
                    return true
                }
                return false;
            },
            isStart() {//-----------------------编辑时是否启用不可选
                if (this.isEdit === "modify") {
                    if (this.form.status === 1) {
                        return true
                    } else {
                        return false
                    }
                }
                if (this.isEdit !== 'create') {
                    return true
                }
                return false
            },
            isCreate() {//--------------验证
                if (!this.form.name) {
                    return true;
                }
                if(!this.form.operation_mode) {
                    return true;
                }
                /*
                if (!this.form.country_code) {
                    return true
                }
                if (!this.form.state_or_provice) {
                    return true
                }
                if (!this.form.city) {
                    return true
                }
                if (!this.form.area) {
                    return true
                }
                if (!this.form.address) {
                    return true
                }
                if (!this.form.zip) {
                    return true
                }
                if (!this.form.contact_name) {
                    return true
                }
                if (!this.form.phone) {
                    return true
                }*/
                return false
            }
        },
        watch: {
            isEdit(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.isEdit = val;
            },
            type_(val) {//--------------监听有无仓库
                if (this.entrepotId === 0) {
                    if (val.length > 0) {
                        this.form.entrepot = '';
                        this.form.name = ''
                    }
                }
            }
        },
        props: {
            entrepotId: {
                required: true,
                type: Number
            },
            form: {
                required: true,
                type: Object
            },
            isAdd: {
                required: true,
                type: Boolean
            },
            value: {},
        },
        components: {
            uiCard: require('@/components/ui-card').default,
            cardHidden: require('@/components/card-hidden.vue').default,
            uiForm: require('@/components/ui-form.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
            uiFormItem: require('@/components/ui-form-item.vue').default
        }
    }
</script>
