<template>
    <div class="inline">
        <label-item label="操作内容：" class="inline">
            <el-select v-sf.content_type v-model="params.content_type" class="inline width-xs">
                <el-option
                        :key="item.value"
                        v-for="item in content_types"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="操作类型：" class="inline ml-sm">
            <el-select v-sf.operation_type v-model="params.operation_type" class="inline width-xs">
                <el-option
                        :key="item.value"
                        v-for="item in operation_types"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="来源单号：" class="inline ml-sm">
            <el-input v-sf.source_number v-model="params.source_number" placeholder="请输入来源单号"></el-input>
        </label-item>
        <label-item label="操作人：" class="inline ml-sm">
            <scroll-select v-model="accounts" style="width:158px" class="inline"
                           textAlign="left"
                           ref="creater"
                           :remote="urlcreater"
                           :fix-params="fix_params_account"
                           :fixResult="fix_result_account">
            </scroll-select>
        </label-item>
        <label style="vertical-align: middle" class="ml-sm">操作时间：</label>
        <label-item label="" class="inline">
            <ui-ddatetimerange :b_time.sync="params.date_b" :e_time.sync="params.date_e"></ui-ddatetimerange>
        </label-item>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import uiDdatetimerange from './ui-ddatetimerange.vue'
    import {api_warehouse_cargo_goods_log_types} from '@/api/warehouse-cargo-goods';

    export default {
        name: "handleDetailSearch",
        data() {
            return {
                params: this.value,
                content_types: [//操作内容
                    {label: '全部', value: '0'},
                    {label: '库存', value: '2'},
                    {label: '冻结库存', value: '4'},
                ],
                operation_types: '',//操作类型
                user_ids: '',//操作人
                urlcreater: 'get|user',
                UrlSelect: 'get|warehouse-cargo-goods/log-types',
            }
        },
        computed: {
            accounts: {
                get() {
                    return {
                        label: this.params.account_creator_name,
                        value: this.params.user_id
                    }
                },
                set(val) {
                    this.params.account_creator_name = val.label;
                    this.params.user_id = val.value;
                }
            },
        },
        filters: {},
        created() {
        },
        mounted() {
            this.request()
        },
        methods: {
            request() {
                // 操作类型
                this.$http(api_warehouse_cargo_goods_log_types).then(res => {
                    this.operation_types = res;
                    this.params.operation_type = res[0].value;
                })
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },//账号结果
            fix_result_account(res) {
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
        },
        watch: {
            value(val) {
                this.params = val;
            },
            params(val) {
                typeof val.source_number === 'string' && (val.source_number = val.source_number.trim());
                this.$emit('input', val);
            }
        },
        props: {
            value: {
                type: Object,
            }
        },
        components: {
            uiDdatetimerange,
            labelItem: require('@/components/label-item.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
        }
    }
</script>
