<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="审核不通过">
        <el-input type="textarea"
                  v-model="reason"
                  :rows="4"
                  class="mt-sm mb-sm"
                  placeholder="请输入审核不通过原因"></el-input>
        <div slot="footer">
            <permission tag="requestButton" :route="apis.url_local_stocking_adopt" req-key="activityStockFail" @click="fail">审核不通过</permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {url_local_stocking_adopt} from "@/api/local-stocking";

    export default {
        permission: {
            url_local_stocking_adopt
        },
        data() {
            return {
                visible: false,
                reason: ''
            }
        },
        methods: {
            open() {

            },
            fail() {
                this.reason = this.reason.trim();
                if(this.reason === '') {
                    this.$message({type: 'error', message: '请填写审核不通过原因'});
                    this.$reqKey('activityStockFail', false);
                    return;
                }
                this.$emit('fail', this.reason);
            },
            close() {
                this.reason = '';
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
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>