<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="编辑备货单名称">
        <label-item label="备货单名称：">
            <el-input v-model="remark" placeholder="请输入备货单名称"></el-input>
        </label-item>
        <div slot="footer">
            <request-button type="primary" size="mini" @click.native="sure" req-key="addRemark">确定</request-button>

            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_stock_remark} from "@/api/stocking";

    export default {
        data() {
            return {
                visible: false,
                remark: this.remarkData.remark,
            }
        },
        methods: {
            open() {
                this.remark = this.remarkData.remark;
            },
            sure() {
                typeof this.remark && (this.remark = this.remark.trim());
                if (this.remark === '') {
                    this.$message({
                        type: 'error',
                        message: '请输入名称'
                    });
                    this.$reqKey('addRemark', false);
                    return
                }
                let data = {
                    remark: this.remark
                };
                this.$http(api_stock_remark, this.remarkData.id, data).then(res => {
                    this.$message(res.message || res);
                    this.$set(this.remarkData, 'remark', this.remark);
                    this.visible = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    setTimeout( () => {
                        this.$reqKey('addRemark', false);
                    }, 200);
                })
            },
            close() {
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
            remarkData: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>