<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="排除法批量包装">
        <label-item label="包裹号：" class="full-width mt-sm">
            <el-input type="textarea"
                      class="mt-sm mb-sm"
                      v-model="package_number"
                      :autosize="{minRows: 4}"
                      placeholder="扫描或输入包裹号，回车换行">
            </el-input>
        </label-item>
        <div class="t-center red">
            提示：点击确认后，输入框中的包裹自动作废，该拣货单的其他包裹将自动包装完成
        </div>
        <div slot="footer">
            <permission tag="requestButton"
                        @click="sure"
                        req-key="api_exclusion_check"
                        :route="apis.url_exclusion_check">
                确认
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_exclusion_check, url_exclusion_check} from "@/api/delivery-check";

    export default {
        permission: {
            url_exclusion_check,
        },
        data() {
            return {
                visible: this.value,
                package_number: '',
            }
        },
        methods: {
            open() {
            },
            sure() {
                this.package_number = this.package_number.trim();
                if(this.package_number === '') {
                    this.$message({type: 'error', message: '请输入或扫描不需要包装的包裹号'});
                    this.$reqKey('api_exclusion_check', false);
                    return;
                }
                let package_number = clone(this.package_number).split('\n').filter(row => !!row).map(row => row.trim());
                let data = {
                    number : package_number,
                    picking_id: this.picking_id,
                };
                this.$http(api_exclusion_check, data).then(res => {
                    this.$message({type: 'success', message: `${res.success}个包裹包装完成，${res.cancel}个包裹已作废，${res.fail}个包裹包装失败`});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(()=> {
                    setTimeout(()=> {
                        this.$reqKey('api_exclusion_check', false);
                    }, 200);
                });
            },
            close() {
                this.package_number = '';
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
            picking_id: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>