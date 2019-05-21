<template>
    <page-dialog title="提示"
                 size="small"
                 style="z-index:999;"
                 class="c-discontinue-shipping"
                 v-model="visible"
                 @open="open"
                 :show-close-icon="false"
                 :close-on-click-modal="false">
        <div class="discontinue-content">
            <el-row class="t-center">
                <div class="el-icon-warning warning"></div>
                <span>{{`您将启用${action.shortname}，确认此操作吗？`}}</span>
            </el-row>
            <el-row class="t-center mt-sm">
                <span class="inline width-sm t-right"><span class="red">*</span>仓库停止集包时间：</span>
                <el-date-picker type="datetime"
                                class="inline"
                                v-model="stop_pickup_time"
                                :picker-options="picker"></el-date-picker>
            </el-row>
            <el-row class="t-center mt-sm">
                <span class="inline width-sm t-right"><span class="red">*</span>是否重跑订单规则：</span>
                <div class="inline top t-left" style="width: 177px;">
                    <el-radio-group v-model="stop_type">
                        <el-radio class="ml-15 mb-xs" label="0">不处理</el-radio>
                        <el-radio label="1" class="mb-xs">未生成拣货单重跑规则</el-radio>
                        <el-radio label="2" class="mb-xs">未发货重跑规则</el-radio>
                    </el-radio-group>
                </div>
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
    .c-discontinue-shipping {
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
        .top {
            vertical-align: top;
        }
        .ml-15 {
            margin-left: 15px;
        }
    }
</style>
<script>
    export default {
        data() {
            let now = Date.now();
            return {
                visible: false,
                stop_pickup_time: new Date(now),
                stop_type: '',
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
            open() {
                this.stop_type = '';
                this.stop_pickup_time = new Date();
            },
            sure() {
                if(this.stop_pickup_time.getTime() < Date.now()) {
                    this.$message({
                        type: 'error',
                        message: `所选时间不能小于当前时间，请重新设置时间！`
                    });
                    return;
                }
                if(this.stop_type === '') {
                    this.$message({type: 'error', message: '请选择是否重跑订单规则'});
                    return;
                }
                let data = {
                    stop_pickup_time: Math.floor(this.stop_pickup_time.getTime() / 1000),
                };
                this.$emit('sure', data)
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
