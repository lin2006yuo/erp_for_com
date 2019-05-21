<template>
    <page-dialog class="abnormal-mark-handle" v-model="visible" @open="open" @close="close" title="标记为已处理">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message" style="margin-left: 50px;">
            <!--<p>您将对勾选项标记为“已处理”状态，确认此操作吗？</p>-->
            <label-item label="处理方式：" label-width="100" label-align="right">
                <el-radio-group v-model="handleData.status" class="inline">
                    <el-radio :label="2" class="ml-sm">继续入库</el-radio>
                    <el-radio :label="3" class="ml-sm">退货</el-radio>
                    <el-radio :label="4" v-if="selectedData.length === 1" class="ml-sm">其他入库</el-radio>
                    <!--<el-radio :label="5" class="ml-sm">已处理</el-radio>-->
                </el-radio-group>
            </label-item>
            <br>
            <template v-if="handleData.status === 4">
                <label-item label="已入库采购单："
                            label-width="100" label-align="right"
                            class="mt-xs">
                    <el-input v-model="handleData.new_purchase_order_id"
                              class="ml-xs"
                              placeholder="请输入已入库采购单"></el-input>
                </label-item>
                <br>
                <label-item label="入库类型：" class="mt-xs" label-width="100" label-align="right">
                    <el-radio-group v-model="handleData.storage_status" class="inline">
                        <el-radio :label="4" class="ml-sm">继续拆包</el-radio>
                        <el-radio :label="6" class="ml-sm">已入库</el-radio>
                    </el-radio-group>
                </label-item>
            </template>
            <el-input type="textarea" :autosize="size" class="mt-sm" placeholder="请输入处理备注"
                      v-model="handleData.remark"></el-input>
            <div class="reference-text">
                <span>参考值：</span>
                <div class="table ml-xs" v-for="(title, index) in shortTitles">
                    <span class="operate" @click="add_title(index)">{{title}}</span>
                </div>
            </div>
        </div>
        <div slot="footer">
            <request-button req-key="abnormalHandle" type="primary" size="mini" @click.native="sure">确定
            </request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .abnormal-mark-handle {
        .table {
            display: inline-table;
        }
    }
</style>
<script>
    import {api_edit_parcel_exception} from "@/api/arrival-parcel";

    export default {
        data() {
            return {
                visible: false,
                shortTitles: ['入库', '退货'],
                handleData: {
                    remark: '',
                    status: '',
                    storage_status: '',
                    new_purchase_order_id: '',
                },
                size: {
                    minRows: 4
                },
            }
        },
        methods: {
            open() {

            },
            sure() {
                let data = this.get_params();
                if (!this.validate(data)) {
                    this.$reqKey('abnormalHandle', false);
                    return false;
                }
                //TODO:下版不传采购单id
                let params = {
                    ids: this.selectedData.map(row => row.id),
                    // purchase_order_ids: this.selectedData.map(row => row.purchase_order_ids),
                };
                Object.assign(params, data);
                this.$http(api_edit_parcel_exception, params).then(res => {
                    this.$message(res.message || res);
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('abnormalHandle', false);
                    }, 200);
                })

            },
            get_params() {
                Object.keys(this.handleData).forEach(key => {
                    if (typeof this.handleData[key] === 'string') {
                        this.handleData[key] = this.handleData[key].trim();
                    }
                });
                let data = clone(this.handleData);
                return data.status === 4 ? {
                    process_method: data.remark,
                    exception_status: data.status,
                    new_purchase_order_id: data.new_purchase_order_id,
                    storage_status: data.storage_status,
                } : {
                    process_method: data.remark,
                    exception_status: data.status,
                }
            },
            validate(data) {
                if (data.exception_status === '') {
                    this.$message({type: 'error', message: '请选择处理方式'});
                    return false;
                }
                if (data.exception_status === 4) {
                    if (data.new_purchase_order_id === '') {
                        this.$message({type: 'error', message: '请输入已入库采购单'});
                        return false;
                    }
                    if (data.storage_status === '') {
                        this.$message({type: 'error', message: '请选择入库类型'});
                        return false;
                    }
                }
                if (data.process_method === '' && data.exception_status !== 2) {
                    this.$message({type: 'error', message: '请填写处理备注'});
                    return false;
                }
                return true;
            },
            close() {
                Object.keys(this.handleData).forEach(key => {
                    this.handleData[key] = '';
                });
            },
            add_title(index) {
                let title = this.shortTitles[index];
                if (this.handleData.remark.includes(title)) {
                    return;
                }
                if (this.handleData.remark === '') {
                    this.handleData.remark += title;
                } else {
                    this.handleData.remark += `，${title}`;
                }
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
            selectedData: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>