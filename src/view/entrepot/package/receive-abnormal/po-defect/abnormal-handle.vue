<template>
    <page-dialog v-model="visible" class="receive-abnormal-handle" @open="open" title="包裹异常信息跟进">
        <label-item label="运单号：" :label-width="80" label-align="right">
            <span class="ml-sm">{{abnormalInfo.tracking_number}}</span>
        </label-item>
        <label-item label="包裹状态：" :label-width="80" label-align="right">
            <span class="ml-sm">{{abnormalInfo.is_use_text}}</span>
        </label-item>
        <label-item label="异常原因：" :label-width="80" label-align="right">
            <el-radio-group v-model="abnormalInfo.abnormal_type" @change="abnormal_type_change">
                <el-radio :label="1">PO缺失</el-radio>
                <el-radio :label="2">其他处理</el-radio>
            </el-radio-group>
        </label-item>
        <template v-if="abnormalInfo.abnormal_type === 1">
            <label-item label="缺失采购单：" :label-width="80" label-align="right">
                <div class="block mb-xs">
                    <el-row v-for="(item, index) in abnormalInfo.purchase_order_ids" :key="index">
                        <el-input class="inline ml-sm" v-model="item.id"
                                  placeholder="请输入缺失采购单号"></el-input>
                        <el-button type="primary" size="mini" v-if="index === 0" @click.native="add_purchase_order"
                                   icon="plus"></el-button>
                        <el-button type="danger" size="mini" v-if="index !== 0"
                                   @click.native="delete_purchase_order(index)"
                                   icon="delete"></el-button>
                    </el-row>
                </div>
            </label-item>
            <label-item label="跟进结果：" class="mt-xs" :label-width="80" label-align="right">
                <div class="ml-80">
                    <el-input type="textarea" v-model="process_methods"
                              placeholder="请输入跟进结果"
                              class="wh-60" :autosize="autoSize"></el-input>
                    <div class="reference-text">
                        <span>参考值：</span>
                        <div class="table ml-xs" v-for="(title, index) in PODeficiencyShortTitles">
                            <span class="operate" @click="add_title(PODeficiencyShortTitles,index)">{{title}}</span>
                        </div>
                    </div>
                </div>
            </label-item>
        </template>
        <template v-if="abnormalInfo.abnormal_type === 2">
            <label-item label="异常类型：" :label-width="80" label-align="right">
                <div class="block mb-xs">
                    <el-select v-model="abnormalInfo.abnormal_status"
                               class="s-width-small inline ml-sm">
                        <el-option v-for="item in abnormalTypeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </label-item>
            <label-item label="采购员：" v-if="abnormalInfo.abnormal_status === 4" :label-width="80" label-align="right">
                <div class="block mb-xs">
                    <purchaser class="inline s-width-small ml-sm"
                               v-model="abnormalInfo.purchase_id"></purchaser>
                </div>
            </label-item>
            <label-item label="备注：" class="mt-xs" :label-width="80" label-align="right">
                <div class="ml-80">
                    <el-input type="textarea" v-model="process_methods"
                              placeholder="请输入备注..."
                              class="wh-60" :autosize="autoSize"></el-input>
                    <div class="reference-text">
                        <span>参考值：</span>
                        <div class="table ml-xs" v-for="(title, index) in restsShortTitles">
                            <span class="operate" @click="add_title(restsShortTitles,index)">{{title}}</span>
                        </div>
                    </div>
                </div>
            </label-item>
        </template>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="api_reply_letter"
                        :route="abnormalInfo.abnormal_type===1?apis.url_reply_letter:apis.url_purchase_order_abnormal_id_other_abnormal_type"
                        @click="sure">确定
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .receive-abnormal-handle {
        .block {
            /*display: block !important;*/
            vertical-align: top;
            width: calc(100% - 100px);
            margin: 0;
        }
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
    import {
        api_reply_letter,
        url_reply_letter,
        api_purchase_order_abnormal_id_other_abnormal_type,
        url_purchase_order_abnormal_id_other_abnormal_type
    } from "@/api/ready-receive";

    export default {
        permission: {
            url_reply_letter,
            url_purchase_order_abnormal_id_other_abnormal_type
        },
        data() {
            return {
                visible: this.value,
                autoSize: {
                    minRows: 4,
                },
                process_methods: '',
                PODeficiencyShortTitles: ['包裹丢失', '私人包裹', '包裹找回'],
                abnormalTypeList: [
                    {label: '退回物流商', value: 3},
                    {label: '退回供应商', value: 4},
                    {label: '其他', value: 6}
                ],
                purchaseList:[],
                restsShortTitles: ['实物已入库', '退回物流商','员工包裹']
            }
        },
        methods: {
            open() {
                this.process_methods = '';
            },
            sure() {
                this.process_methods = this.process_methods.trim();
                if (this.process_methods === '') {
                    this.$message({type: 'warning', message: '请填写跟进结果'});
                    this.$reqKey('api_reply_letter', false);
                    return;
                }
                Object.keys(this.abnormalInfo).forEach(key => {
                    if (typeof this.abnormalInfo[key] === 'string') {
                        this.abnormalInfo[key] = this.abnormalInfo[key].trim();
                    }
                    if (key === 'purchase_order_ids') {
                        this.abnormalInfo[key] = this.abnormalInfo[key].map(row => {
                            row.id = row.id.trim().replace(/PO/i, '');
                            return row
                        });
                    }
                });
                let data = {};
                switch (this.abnormalInfo.abnormal_type) {
                    case 1:
                        if (this.abnormalInfo.purchase_order_ids) {
                            if (this.abnormalInfo.purchase_order_ids.some(row => row.id === '')) {
                                return this.$message({type: 'error', message: '采购单不能为空值，请填写值或删除该输入框'});
                            }
                            data.abnormal_id = this.abnormalInfo.abnormal_id;
                            data.tracking_number = this.abnormalInfo.tracking_number;
                            data.recipient = this.abnormalInfo.recipient;
                            data.purchase_order_ids = this.abnormalInfo.purchase_order_ids.map(row => row.id);
                            data.process_methods = this.process_methods;
                        } else {
                            data.abnormal_id = this.abnormalInfo.abnormal_id;
                            data.tracking_number = this.abnormalInfo.tracking_number;
                            data.recipient = this.abnormalInfo.recipient;
                            data.process_methods = this.process_methods;
                        }
                        this.$http(api_reply_letter, data).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.visible = false;
                            this.$emit('update-table',data.abnormal_id, res.data);
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('api_reply_letter', false);
                            }, 200);
                        });
                        break;
                    case 2:
                        if (!this.process_methods.trim()) {
                            return this.$message({type: 'warning', message: '跟进结果为必填！'});
                        }
                        data.other_abnormal_type = this.abnormalInfo.abnormal_status;
                        data.remark = this.process_methods;
                        if(this.abnormalInfo.abnormal_status === 4){
                            if(!this.abnormalInfo.purchase_id){
                                return this.$message({type: 'warning', message:'退回类型为退回供应商，必须填写采购员！'})
                            }
                            data.purchase_id = this.abnormalInfo.purchase_id;
                        }
                        this.$http(api_purchase_order_abnormal_id_other_abnormal_type,this.abnormalInfo.abnormal_id, data).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.visible = false;
                            this.$emit('update-table');
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('api_reply_letter', false);
                            }, 200);
                        });
                        break;
                    default:
                        this.$reqKey('api_reply_letter', false);
                        this.$message({type:'warning',message:`异常类型有误，值为：${this.abnormalInfo.abnormal_type}`});
                }
            },
            abnormal_type_change(){
                this.process_methods = '';
            },
            add_title(arr, index) {
                let title = arr[index];
                if (this.process_methods.includes(title)) {
                    return;
                }
                if (this.process_methods === '') {
                    this.process_methods += title;
                } else {
                    this.process_methods += `，${title}`;
                }
            },
            add_purchase_order() {
                let {purchase_order_ids} = this.abnormalInfo;
                purchase_order_ids.push({id: ''});
            },
            delete_purchase_order(index) {
                this.abnormalInfo.purchase_order_ids.splice(index, 1);
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
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>
