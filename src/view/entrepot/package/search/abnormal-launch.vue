<template>
    <page-dialog class="c-abnormal-launch" v-model="visible" @open="open" @close="close" title="发起包裹异常">
        <div class="mt-sm">
            <label-item label="运单号：" :label-width="100" label-align="right">
                <span class="ml-sm">{{abnormalInfo.tracking_number}}</span>
            </label-item>
            <label-item label="采购单号：" :label-width="100" label-align="right">
                <span class="ml-sm">{{abnormalInfo.purchase_order_codes}}</span>
            </label-item>
            <label-item label="包裹状态：" :label-width="100" label-align="right">
                <span class="ml-sm">{{abnormalInfo.is_use_text}}</span>
            </label-item>
            <label-item label="异常类型：" :label-width="100" label-align="right">
                <el-select v-model="abnormalInfo.abnormal_status"
                           @change="status_change"
                           class="s-width-default ml-sm">
                    <el-option v-for="item in abnormalStatusList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="是否同步给采购：" v-if="abnormalInfo.color !== 'red'" :label-width="100" label-align="right">
                <el-radio-group v-model="abnormalInfo.sync_purchase" class="ml-sm">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0" :disabled="onlyTrue">否</el-radio>
                </el-radio-group>
            </label-item>
            <label-item label="采购员：" v-if="shouldPurchase" :label-width="100" label-align="right">
                <purchaser class="inline s-width-small ml-sm" v-model="abnormalInfo.purchase_id"></purchaser>
            </label-item>
            <label-item label="异常原因：" :label-width="100" label-align="right">
                <div class="ml-80 ml-sm">
                    <el-input type="textarea" v-model="abnormalInfo.content"
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
        </div>
        <div slot="footer">
            <request-button req-key="api_mark_parcel_abnormal" @click="sure">确定</request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-abnormal-launch {
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
        .ml-80 {
            vertical-align: top;
            width: calc(100% - 120px);
        }
    }
</style>
<script>
    import {api_mark_parcel_abnormal} from "@/api/search-parcel";

    export default {
        data() {
            return {
                visible: this.value,
                autoSize: {
                    minRows: 4,
                },
                abnormalStatusList: [
                    {label: '包裹丢失', value: 2},
                    {label: '退回物流商', value: 3},
                    {label: '退回供应商', value: 4},
                    {label: '仓库转移', value: 5},
                    {label: '其他', value: 6},
                ],
                onlyTrue: false,
                shortTitles: ['包裹确认丢失', '物流商送错', '供应商送错', '中山仓仓转到金华仓', '仓库员工个人包裹'],
            }
        },
        methods: {
            open() {
            },
            close() {
                this.onlyTrue = false;
            },
            sure() {
                let data = this.get_params();
                if(!this.validate()) {
                    return this.$reqKey('api_mark_parcel_abnormal', false);
                }
                this.$http(api_mark_parcel_abnormal, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_mark_parcel_abnormal', false);
                    }, 200);
                });
            },
            status_change(val) {
                if([2,4,5].includes(val)) {
                    this.$set(this.abnormalInfo, 'sync_purchase', 1);
                    this.onlyTrue = true;
                } else {
                    this.$set(this.abnormalInfo, 'sync_purchase', '');
                    this.onlyTrue = false;
                }
            },
            add_title(index) {
                let title = this.shortTitles[index];
                if (this.abnormalInfo.content.includes(title)) {
                    return;
                }
                if (this.abnormalInfo.content === '') {
                    this.abnormalInfo.content += title;
                } else {
                    this.abnormalInfo.content += `，${title}`;
                }
            },
            get_params() {
                Object.keys(this.abnormalInfo).forEach(key => {
                    if (typeof this.abnormalInfo[key] === 'string') {
                        this.abnormalInfo[key] = this.abnormalInfo[key].trim();
                    }
                });
                let {color, purchase_id, ...params} = this.abnormalInfo;
                if(this.shouldPurchase) params.purchase_id = purchase_id;
                return clone(params);
            },
            validate() {
                let data = this.abnormalInfo;
                switch (true) {
                    case data.abnormal_status === '':
                        this.$message({type: 'warning', message: '请选择异常类型！'});
                        return false;
                    case this.abnormalInfo.color !== 'red' && data.sync_purchase === '':
                        this.$message({type: 'warning', message: '请选择是否同步给采购'});
                        return false;
                    case this.shouldPurchase && this.abnormalInfo.purchase_id === '':
                        this.$message({type: 'warning', message: '请选择采购员！'});
                        return false;
                }
                return true;
            }
        },
        computed: {
            shouldPurchase() {
                return (this.abnormalInfo.abnormal_status === 4 || this.abnormalInfo.abnormal_status === 5) && this.abnormalInfo.purchase_order_codes === '';
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
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>