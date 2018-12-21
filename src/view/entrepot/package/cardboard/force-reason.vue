<template>
    <page-dialog class="abnormal-mark-handle" v-model="visible" @open="open" @close="close" title="强制拆板完成">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message" style="margin-left: 50px;">
            <p>还有未拆包裹，是否要完结此卡板？</p>
            <el-input type="textarea" :autosize="size" class="mt-sm" placeholder="请输入采购单反馈问题"
                      v-model="remark"></el-input>
        </div>
        <div slot="footer">
            <request-button req-key="batchForceBox" type="primary" size="mini" @click.native="sure">确定
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
    import {api_box_batch_force} from "@/api/purchase-parcels-box";

    export default {
        data() {
            return {
                visible: false,
                remark: '',
                size: {
                    minRows: 4
                },
            }
        },
        methods: {
            open() {

            },
            sure() {
                typeof this.remark === "string" && (this.remark = this.remark.trim());
                if(this.remark === '') {
                    this.$message({type: 'error', message: '请填写强制拆板完成理由'});
                    this.$reqKey('batchForceBox', false);
                    return;
                }
                let params = {
                    box_ids: this.selectedData.filter(row => row.status===3).map(row => row.id).join(),
                    content: this.remark
                }
                this.$http(api_box_batch_force, params).then(res => {
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
                        this.$reqKey('batchForceBox', false);
                    }, 200);
                })

            },
            close() {
                this.remark = '';
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
        }
    }
</script>