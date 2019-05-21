<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="审核不通过">
        <el-input type="textarea" :autosize="size" class="mt-sm" placeholder="请输入审核不通过原因" v-model="remark"></el-input>
        <div slot="footer">
            <permission tag="requestButton" :route="apis.url_delete_stock" req-key="deleteCheck"
                        @click="sure">审核不通过
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {url_delete_stock} from "@/api/stocking";

    export default {
        permission: {
            url_delete_stock,
        },
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
                this.$emit('sure', this.remark);
            },
            close() {
                this.remark = '';
                this.$reqKey(`deleteCheck`, false);
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
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>