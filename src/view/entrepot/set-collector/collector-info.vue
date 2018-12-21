<template>
    <ui-form :model="form" :rules="rules" ref="collectorInfo" label-width="120px">
        <ui-form-item label="揽收商名称：" class="inline">
            <el-input v-model="form.name" :disabled="isEdit"></el-input>
        </ui-form-item>
        <ui-form-item label="揽收商代码：" class="inline">
            <el-input v-model="form.code" :disabled="isEdit"></el-input>
        </ui-form-item>

        <ui-form-item label="状态：" class="inline">
            <el-select v-model="form.status" :disabled="isEdit" style="width:153px">
                <el-option v-for="item in status"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value"
                ></el-option>
            </el-select>
        </ui-form-item>

        <ui-form-item label="联系人名称：" class="inline">
            <el-input v-model="form.contact" :disabled="isEdit"></el-input>
        </ui-form-item>
        <ui-form-item label="联系电话：" prop="telephone" localtion="right" :bubble="true"
                      class="inline">
            <el-input v-model="form.telephone" :disabled="isEdit"></el-input>
        </ui-form-item>
        <el-row>
            <ui-form-item label="所属仓库：" class="inline">
                <el-select v-model="form.warehouse_ids"
                           multiple
                           clearable
                           :disabled="isEdit" style="width:153px">
                    <el-option v-for="item in warehouseList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"
                    ></el-option>
                </el-select>
            </ui-form-item>
        </el-row>
        <div>
            <ui-form-item label="收件地址：">
                <el-col :span="16">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 4}"
                            placeholder="请输入..."
                            v-model="form.address" :disabled="isEdit">
                    </el-input>
                </el-col>
            </ui-form-item>
        </div>
        <ui-form-item class="mt-xs">
            <div v-if="butMark==true">
                <permission tag="ElButton" type="primary" @click.native="add" size="mini"
                            :disabled="isSave" :route="apis.url_add_collector">确定
                </permission>
                <el-button @click.native="cancel" size="mini">取 消</el-button>
            </div>
            <div v-else>
                <div v-if="!isEdit">
                    <permission tag="ElButton" type="primary" @click.native="update" size="mini"
                                :disabled="isSave" :route="apis.url_update_collector">修改
                    </permission>
                    <el-button @click.native="update_cancel" size="mini">取 消</el-button>
                </div>
                <el-button type="primary" v-else @click.native="edit" size="mini">编辑
                </el-button>
            </div>
        </ui-form-item>
    </ui-form>
</template>

<style lang="stylus">

</style>

<script>
    import {api_add_collector, api_updata_collector, url_add_collector, url_update_collector} from "@/api/collector";
    import {phone} from "@/define/validator_reg";
    import {api_get_warehouse} from "@/api/report-channel";

    export default {
        name: "collector-info",
        permission: {
            url_add_collector,
            url_update_collector,
        },
        data() {
            let checkPhone = (rule, value, callback) => {
                setTimeout(() => {
                    if (!phone.test(value)) {
                        callback(new Error('电话/手机格式错误！'));
                    } else {
                        callback();
                    }
                }, 1000);
            }
            return {
                isEdit: true,
                form: {
                    name: '',
                    code: '',
                    status: 1,
                    telephone: '',
                    warehouse_ids: [],
                    contact: '',
                    address: '',
                },
                rules: {
                    telephone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                status: [
                    {label: "启用", value: 1},
                    {label: "停用", value: 0}
                ],
                warehouseList: [],
            }
        },
        mounted() {
            this.init_warehouse_list();
        },
        methods: {
            edit() {
                this.isEdit = false;
            },
            init_warehouse_list() {
                let data = {type: [1]};
                this.$http(api_get_warehouse, data).then(res => {
                    this.warehouseList = res.map(row => {
                        return {label: row.name, value: row.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            add() {
                this.trim_form();
                this.$http(api_add_collector, this.form).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.isEdit = true;
                    this.$emit('add');
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
            },
            cancel() {
                console.log(`取消添加`, this.$refs.collectorInfo);
                this.$refs.collectorInfo.resetFields();
                this.form = clone(this.collectorInfo);
                this.isEdit = true;
                this.$emit('cancel');
            },
            update() {
                this.trim_form();
                this.$http(api_updata_collector, this.form.id, this.form).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('update', res.data);
                    this.isEdit = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
            },
            update_cancel() {
                this.isEdit = true;
                this.form = clone(this.collectorInfo);
            },
            trim_form() {
                Object.keys(this.form).forEach(key => {
                    if (typeof this.form[key] === 'string') {
                        this.form[key] = this.form[key].trim();
                    }
                });
            }
        },
        computed: {
            isSave() {
                switch (true) {
                    case !this.form.name:
                        return true;
                    case !this.form.code:
                        return true;
                    case this.form.status === '':
                        return true;
                    case !this.form.contact:
                        return true;
                    case !this.form.warehouse_ids.length === 0:
                        return true;
                    case !this.form.address:
                        return true;
                }
                return false
            },
        },
        watch: {
            collectorInfo(val) {
                this.form = clone(val);
                this.isEdit = true;
            },
            butMark(val) {
                if (val) {
                    console.log('but mark change', val);
                    this.isEdit = false;
                    this.$refs.collectorInfo.resetFields();
                    this.form = {
                        name: '',
                        code: '',
                        status: 1,
                        telephone: '',
                        warehouse_ids: [],
                        contact: '',
                        address: '',
                    };
                }
            }
        },
        props: {
            collectorInfo: {},
            butMark: {
                type: Boolean,
                default() {
                    return false;
                }
            }
        },
        components: {
            uiForm: require('@/components/ui-form.vue').default,
            uiFormItem: require('@/components/ui-form-item.vue').default,
        }
    }
</script>
