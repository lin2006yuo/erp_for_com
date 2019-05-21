<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="提示">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message" style="margin-left: 50px;">
            <p>{{trendAction.title}}</p>

            <el-input type="textarea" :autosize="size" class="mt-sm" placeholder="请输入作废原因"
                      v-model="remark"></el-input>
        </div>
        <div slot="footer">
            <request-button  req-key="api_allocation_picking_invalid" type="primary" size="mini" @click.native="sure">确定
            </request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_allocation_picking_invalid} from "@/api/allocation-picking";

    export default {
        data() {
            return {
                visible: this.value,
                remark: '',
                size: {
                    minRows: 4
                }
            }
        },
        methods: {
            open() {
            },
            sure() {
                this.remark = this.remark.trim();
                if(this.remark === '') {
                    this.$message({type: 'error', message: '请填写作废原因'});
                    return this.$reqKey('api_allocation_picking_invalid', false);
                }
                this.$http(api_allocation_picking_invalid, this.trendAction.id, {remark: this.remark}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_allocation_picking_invalid', false);
                    }, 200);
                });
            },
            close() {
                this.remark = '';
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
            trendAction: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>