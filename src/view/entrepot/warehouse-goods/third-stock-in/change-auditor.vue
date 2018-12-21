<template>
    <page-dialog class="stock-in-apply-change-auditor" v-model="visible" @open="open" @close="close" title="修改审批人">
        <label-item class="mt-sm change-auditor-label" label="审批人：">
            <el-select v-model="audit_id"
                       class="s-width-large"
                       clearable
                       filterable>
                <el-option v-for="item in auditorList"
                           :value="item.value"
                           :label="item.label"
                           :key="item.value"></el-option>
            </el-select>
        </label-item>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="changeAuditor"
                        :route="apis.url_channel_log_change_auditor"
                        type="primary" size="mini" @click.native="sure">提交
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
.stock-in-apply-change-auditor {
    .change-auditor-label {
        margin-left: 50px;
    }
}
</style>
<script>
    import {api_channel_log_change_auditor, url_channel_log_change_auditor} from "@/api/warehouse-goods-channel";

    export default {
        permission: {
            url_channel_log_change_auditor
        },
        data() {
            return {
                visible: false,
                audit_id: '',
            }
        },
        methods: {
            open() {

            },
            sure() {
                if(this.audit_id === '') {
                    this.$reqKey('changeAuditor', false);
                    return this.$message({type: 'error', message: '请选择要转交的审批人'});
                }
                let params = {
                    audit_id: this.audit_id,
                };
                this.$emit('change', params);
            },
            close() {
                this.audit_id = '';
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
            auditorList: {},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>