<template>
    <page-dialog title="提示"
                 size="small"
                 style="z-index:999;"
                 class="c-discontinue-shipping"
                 v-model="visible"
                 :show-close-icon="false"
                 :close-on-click-modal="false">
        <div class="discontinue-content">
            <el-row class="t-center">
                <div class="el-icon-warning warning"></div>
                <span>{{`您将启用${action.shortname}，确认此操作吗？`}}</span>
            </el-row>
            <el-row class="t-center mt-sm">
                <span class="red">*</span>仓库停止集包时间：
                <el-date-picker type="datetime"
                                class="inline"
                                v-model="stop_pickup_time"
                                :picker-options="picker"></el-date-picker>
            </el-row>
            <el-row class="t-center mt-sm">
                <span>停用后"订单规则"立即生效，仓库集包以停止时间为准</span>
            </el-row>
        </div>
        <div slot="footer">
            <el-button size="mini" @click="cancel">取消</el-button>
            <el-button type="primary" size="mini" @click="sure">确认</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .warning {
        /*position: relative;
        top: 9px;
        color: #FBC050;
        font-size: 36px !important;*/
        position: absolute;
        color: #FBC050;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        font-size: 36px !important;
    }

    .discontinue-content {
        width: 80%;
        margin: 10px auto;
    }
</style>
<script>
    export default {
        data() {
            let now = Date.now();
            return {
                visible: false,
                stop_pickup_time: now,
                picker: {
                    disabledDate: (time) => {
                        return time.getTime() <= now;
                    }
                },
            }
        },
        mounted() {
        },
        methods: {
            cancel() {
                this.$emit('cancel');
            },
            sure() {
                if(Number(this.stop_pickup_time)/1000 < Date.now() / 1000) {
                    this.$message({
                        type: 'error',
                        message: `所选时间不能小于当前时间，请重新设置时间！`
                    });
                    return;
                }
                this.$emit('sure', Number(this.stop_pickup_time)/1000)
            }
        },
        computed: {},
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            }
        },
        props: {
            value: {},
            action: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            labelItem: require('@/components/label-item').default
        }
    }
</script>
