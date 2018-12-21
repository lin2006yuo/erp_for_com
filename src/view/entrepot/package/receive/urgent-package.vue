<template>
    <page-dialog class="c-receive-urgent" v-model="visible" @open="open" @close="close" title="接收提示">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message" style="margin-left: 50px;">
            <p>当前包裹需要：<span class="red bold-font">{{urgentText | filterUrgent}}</span></p>
        </div>
        <div slot="footer">
            <div v-if="box_id">
                <el-button type="primary" size="mini" @click.native="no_join">不加人卡板</el-button>
                <el-button size="mini" @click.native="sure">加人卡板</el-button>
            </div>
            <el-button v-else size="mini" @click.native="visible = false">关闭</el-button>

        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-receive-urgent {
        .dialog__body {
            position: relative;
        }
        .el-message-box__status {
            left: 25%;
            font-size: 48px !important;
        }
        .el-message-box__message {

            height: 48px;
            p {
                text-align: center;
                font-size: 1.6rem;
                line-height: 48px;
                span {
                    font-size: 1.6rem;
                }
            }
        }

    }
</style>
<script>

    export default {
        data() {
            return {
                visible: false,
            }
        },
        filters: {
            filterUrgent(val) {
                return val === 1 ? '紧急入库' : '联系采购员';
            }
        },
        methods: {
            open() {

            },
            sure() {
                this.$emit('join', true);
                this.visible = false;
            },
            close() {
                this.$emit('close');
            },
            no_join() {
                this.$emit('join', false);
                this.visible = false;
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
            urgentText: {},
            box_id: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>