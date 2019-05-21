<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="标记为已处理">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message" style="margin-left: 50px;">
            <!--<p>您将对勾选项标记为“已处理”状态，确认此操作吗？</p>-->
            <el-input type="textarea" :autosize="size"
                      class="mt-sm" placeholder="请输入处理备注"
                      v-model="remark"></el-input>
        </div>
        <div slot="footer">
            <request-button req-key="abnormalBatchHandle" type="primary" size="mini" @click.native="sure">确定
            </request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_parcel_batch_end} from "@/api/arrival-parcel";

    export default {
        data() {
            return {
                visible: this.value,
                remark: '',
                size: {
                    minRows: 4
                },
            }
        },
        methods: {
            open() {

            },
            close() {
                this.remark = '';
            },
            sure() {
                this.remark = this.remark.trim();
                if(this.remark === '') {
                    this.$reqKey('abnormalBatchHandle', false);
                    this.$message({type: 'error', message: '请填写备注！'});
                    return;
                }
                let data = {
                    ids: this.selectedData.map(row => row.id),
                    exception_status: 5,
                    process_method: this.remark,
                };
                this.$http(api_parcel_batch_end, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('abnormalBatchHandle', false);
                    }, 200);
                });
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