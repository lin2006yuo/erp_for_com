<template>
    <page-dialog class="abnormal-mark-handle" v-model="visible" @open="open" @close="close" title="标记为已处理">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message" style="margin-left: 50px;">
            <!--<p>您将对勾选项标记为“已处理”状态，确认此操作吗？</p>-->
            <div>
                <label-item label="处理方式：">
                    <el-radio-group v-model="status" class="inline">
                        <el-radio :label="2" class="ml-sm">继续入库</el-radio>
                        <el-radio :label="3" class="ml-sm">退货</el-radio>
                        <!--<el-radio :label="4" v-if="selectedData.length === 1" class="ml-sm">其他入库</el-radio>-->
                    </el-radio-group>
                </label-item>
            </div>
            <label-item label="已入库采购单："
                        v-if="status === 4"
                        class="mt-xs">
                <el-input v-model="new_purchase_order_id"
                          placeholder="请输入已入库采购单"></el-input>
            </label-item>
            <el-input type="textarea" :autosize="size" class="mt-sm" placeholder="请输入处理备注"
                      v-model="remark"></el-input>
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
                remark: '',
                status: '',
                new_purchase_order_id: '',
                size: {
                    minRows: 4
                },
            }
        },
        methods: {
            open() {

            },
            sure() {
                if(this.status === '') {
                    this.$message({type: 'error', message: '请选择处理方式'});
                    this.$reqKey('abnormalHandle', false);
                    return;
                }
                typeof this.remark === "string" && (this.remark = this.remark.trim());
                if(this.remark === '' && this.status !== 2) {
                    this.$message({type: 'error', message: '请填写处理备注'});
                    this.$reqKey('abnormalHandle', false);
                    return;
                }
                let params = {
                    ids: this.selectedData.map(row => row.id),
                    process_method: this.remark,
                    exception_status: this.status,
                    purchase_order_ids: this.selectedData.map(row => row.purchase_order_ids),
                };
                if(this.status === 4) {
                    this.new_purchase_order_id = this.new_purchase_order_id.trim();
                    if(this.new_purchase_order_id === '') {
                        this.$message({type: 'error', message: '请输入已入库采购单'});
                        this.$reqKey('abnormalHandle', false);
                        return;
                    }
                    params.new_purchase_order_id = this.new_purchase_order_id;
                }
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
            close() {
                this.remark = '';
                this.status = '';
                this.new_purchase_order_id = '';
            },
            add_title(index) {
                let title = this.shortTitles[index];
                if (this.remark.includes(title)) {
                    return;
                }
                if (this.remark === '') {
                    this.remark += title;
                } else {
                    this.remark += `，${title}`;
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