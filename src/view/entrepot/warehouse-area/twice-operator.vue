<template>
    <page-dialog v-model="visible" class="c-twice-operator" @open="open" @close="close" :title="action.title">
        <div class="mt-sm">
            <label-item label="仓库：" :label-width="80" label-align="right" class="mb-xs">
                <span>{{operatorInfo.warehouse_name}}</span>
            </label-item>
            <br/>
            <label-item label="分拣人：" :label-width="80" label-align="right">
                <el-row v-if="edit" class="fit-width align-top">
                    <div v-if="curOperators.length !== 0">
                        <el-tag v-for="(item,index) in operator"
                                type="primary"
                                closable
                                class="ml-sm mb-xs"
                                @close="delete_operator(item)"
                                :key="item.id">
                            {{item.realname}}
                        </el-tag>
                    </div>
                    <el-select class="width-sm ml-sm"
                               v-model="operator_id" filterable @change="select_operator">
                        <el-option v-for="item in curOperators"
                                   :label="item.realname"
                                   :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-row>
                <el-row v-else>
                    <span v-for="(item,index) in operator" :key="index"
                          class="width-xs"
                          :class="{'ml-sm': index !== 0}">
                        {{item.realname}}
                    </span>
                </el-row>
            </label-item>
        </div>
        <div slot="footer">
            <el-button v-if="!edit" type="primary" size="mini" @click="edit = true">编辑</el-button>
            <permission v-else
                        tag="requestButton"
                        type="primary"
                        size="mini"
                        req-key="api_set_twice_picker"
                        :route="apis.url_set_twice_picker"
                        @click.native="sure">
                确定
            </permission>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-twice-operator {
        .align-top {
            vertical-align: top;
        }
    }
</style>
<script>
    import {api_warehouse_staffs} from '@/api/warehouse-cargo';
    import {api_get_twice_picker, api_set_twice_picker, url_set_twice_picker} from "@/api/warehouse-area";

    export default {
        permission: {
            url_set_twice_picker
        },
        data() {
            return {
                visible: this.value,
                operator: [],
                operator_id: '',
                operators: [],
                edit: false,
            }
        },
        mounted() {
            this.get_operator();
        },
        methods: {
            open() {
                this.get_info();
            },
            close() {
                this.operator = [];
                this.operator_id = '';
                this.edit = false;
            },
            get_info() {
                let data = {
                    type: ''
                };
                if(this.action.operate === 'twice'){
                    data.type = 1
                }else if(this.action.operate === 'remark'){
                    data.type = 2
                }
                this.$http(api_get_twice_picker, this.operatorInfo.warehouse_id, data).then(res => {
                    this.operator = res.map(row => {
                        return {
                            id: row.picker_id,
                            realname: row.picker,
                        };
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            get_operator() {
                this.$http(api_warehouse_staffs).then(res => {
                    this.operators = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            select_operator() {
                if (this.operator_id !== '') {
                    this.operator.push(this.operators.find(row => row.id === this.operator_id));
                    this.operator_id = '';
                }
            },
            delete_operator(row) {
                let index = this.operator.findIndex(operator => operator.id === row.id);
                this.operator.splice(index, 1);
            },
            sure() {
                if (this.operator.length === 0) {
                    this.$message({type: 'error', message: '请选择分拣人！'});
                    this.$reqKey('api_set_twice_picker', false);
                    return;
                }
                let data = {
                    picker_ids: this.operator.map(row => row.id),
                    type: ''
                };
                if(this.action.operate === 'twice'){
                    data.type = 1
                }else if(this.action.operate === 'remark'){
                    data.type = 2
                }
                this.$http(api_set_twice_picker, this.operatorInfo.warehouse_id, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_set_twice_picker', false);
                    }, 200);
                })
            },
        },
        computed: {
            curOperators() {
                if (this.operators.length !== 0) {
                    return this.operators.filter(row => !this.operator.find(operate => operate.id === row.id));
                }
                return [];
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            operatorInfo: {},
            action: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>