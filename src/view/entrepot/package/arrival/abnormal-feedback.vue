<template>
    <page-dialog class="arrival-abnormal-feedback" v-model="visible" @close="close" title="拆包异常反馈" size="small">
        <el-radio-group v-model="abnormalType">
            <el-radio :label="1">标记为<span class="red bold-font">拆包异常</span>以便跟进处理</el-radio>
            <el-radio :label="2">标记为<span class="red bold-font">采购单异常</span>以便通知采购</el-radio>
        </el-radio-group>
        <el-input type="textarea" :autosize="size" class="mt-sm" placeholder="请输入采购单反馈问题" v-model="remark"></el-input>
        <div class="reference-text">
            <span>参考值：</span>
            <div class="table ml-xs" v-for="(title, index) in shortTitles">
                <span class="operate" @click="add_title(index)">{{title}}</span>
            </div>
        </div>
        <div slot="footer">
            <request-button req-key="abnormalFeedback" type="primary" size="mini" @click.native="sure">确定
            </request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .arrival-abnormal-feedback {
        .table {
            display: inline-table;
        }
    }
</style>
<script>
    import {api_order_feedback, api_set_parcel_exception} from '@/api/arrival-parcel.js'

    export default {
        name: "feedback",
        data() {
            return {
                visible: false,
                remark: '',
                abnormalType: 2,
                size: {
                    minRows: 4
                },
                shortTitles: ['颜色不符', '数量不对', '包装有破损', '货品有破损', '来错货', '个别SKU没来货', '少配件'],
            }
        },
        methods: {
            sure() {
                this.remark = this.remark.trim();
                if (this.remark === '') {
                    this.$message({
                        type: 'error',
                        message: '请输入反馈信息再提交'
                    });
                    this.$reqKey('abnormalFeedback', false);
                }
                let params, api;
                if (this.abnormalType === 2) {
                    params = {
                        id: this.feedbackInfo.purchase_order,
                        remark: this.remark
                    };
                    api = api_order_feedback;
                } else {
                    params = {
                        tracking_number: this.feedbackInfo.tracking_number,
                        purchase_parcel_code: this.feedbackInfo.purchase_parcel_code,
                        purchase_order_id: this.feedbackInfo.purchase_order,
                        content: this.remark,
                    };
                    api = api_set_parcel_exception;

                }
                this.$http(api, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.visible = false;
                    this.abnormalType === 1 && this.$emit('search');
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('abnormalFeedback', false);
                    }, 200);
                })

            },
            close() {
                this.remark = '';
                this.abnormalType = 2;
            },
            add_title(index) {
                let title = this.shortTitles[index];
                if (this.remark.includes(title)) {
                    return;
                }
                if (this.remark === '') {
                    this.remark += title;
                } else {
                    this.remark += `，${title}`;
                }
                console.log(`xxxxxx`, index);
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
            feedbackInfo: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>