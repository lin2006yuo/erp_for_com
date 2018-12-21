<template>
    <page-dialog v-model="visible" class="receive-abnormal-handle" @open="open" @close="close" title="包裹异常信息跟进">
        <label-item label="运单号：" :label-width="80" label-align="right">
            <span class="ml-sm">{{abnormalInfo.tracking_number}}</span>
        </label-item>
        <label-item label="包裹状态：" :label-width="80" label-align="right">
            <span class="ml-sm">{{abnormalInfo.is_use_text}}</span>
        </label-item>
        <label-item label="异常原因：" :label-width="80" label-align="right">
            <span class="ml-sm">{{abnormalInfo.abnormal_content}}</span>
        </label-item>
         <label-item label="缺失采购单：" :label-width="80" label-align="right" v-if="abnormalInfo.abnormal_type === 0">
             <el-input class="ml-sm" v-model="abnormalInfo.purchase_order_id" placeholder="请输入缺失采购单号"></el-input>
         </label-item>
        <label-item label="跟进结果：" :label-width="80" label-align="right">
            <div class="ml-80">
                <el-input type="textarea" v-model="process_methods"
                          placeholder="请输入跟进结果"
                          class="wh-60" :autosize="autoSize"></el-input>
                <div class="reference-text">
                    <span>参考值：</span>
                    <div class="table ml-xs" v-for="(title, index) in shortTitles">
                        <span class="operate" @click="add_title(index)">{{title}}</span>
                    </div>
                </div>
            </div>
        </label-item>
        <!--<el-row class="mt-xs">
            <span class="red">注意：输入的采购单号必须是等待到货、部分到货等待剩余状态。</span>
        </el-row>-->
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="api_reply_letter"
                        :route="apis.url_reply_letter" @click="sure">确定
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .receive-abnormal-handle {
        .ml-80 {
            margin-left: 10px;
            vertical-align: top;
            width: calc(100% - 100px);
        }
        .wh-60 {
            /*width: 60%;*/
        }
        .table {
            display: inline-table;
        }
        .c-label-item {
            display: block;
            line-height: 2.5;
            > label {
                font-weight: bold;
            }
        }
    }
</style>
<script>
    import {api_reply_letter, url_reply_letter} from "@/api/ready-receive";

    export default {
        permission: {
            url_reply_letter,
        },
        data() {
            return {
                visible: this.value,
                autoSize: {
                    minRows: 4,
                },
                process_methods: '',
                shortTitles: ['PO号', '包裹丢失', '私人包裹', '包裹找回'],
            }
        },
        methods: {
            open() {
            },
            sure() {
                this.process_methods = this.process_methods.trim();
                if (this.process_methods === '') {
                    this.$message({type: 'error', message: '请填写跟进结果'});
                    this.$reqKey('api_reply_letter', false);
                    return;
                }
                let data = this.get_params();
                this.$http(api_reply_letter, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_reply_letter', false);
                    }, 200);
                });
            },
            get_params() {
                Object.keys(this.abnormalInfo).forEach(key => {
                    if (typeof this.abnormalInfo[key] === 'string') {
                        this.abnormalInfo[key] = this.abnormalInfo[key].trim();
                    }
                });
                let {abnormal_id, tracking_number, recipient, purchase_order_id} = this.abnormalInfo;
                if(purchase_order_id) {
                    return {
                        abnormal_id,
                        tracking_number,
                        recipient,
                        purchase_order_id,
                        process_methods: this.process_methods,
                    }
                }
            },
            close() {
                this.process_methods = '';
            },
            add_title(index) {
                let title = this.shortTitles[index];
                if (this.process_methods.includes(title)) {
                    return;
                }
                if (this.process_methods === '') {
                    this.process_methods += title;
                } else {
                    this.process_methods += `，${title}`;
                }
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
            abnormalInfo: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>