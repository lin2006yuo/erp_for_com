<template>
    <div class="c-long-not-opened-search-module">
        <search-card :params="searchData" @search="search" :clears="clears" class="mt-xs">
            <label class="inline" title="请选择仓库"> 仓库：</label>
            <super-select class="inline width-sm"
                          v-model="searchData.warehouse_id"
                          storageKey="virtual_store"
                          @change="search"
                          :options="warehouseList">
            </super-select>
            <label-item label="处理状态：" class="ml-sm">
                <el-select class="width-sm" v-sf.process_status v-model="searchData.process_status">
                    <el-option
                        v-for="item in disposeStatus"
                        :label="item.label"
                        :value="item.value"
                        :key="item.label"
                    ></el-option>
                </el-select>
            </label-item>
            <label-buttons label="审批状态："
                           class="inline ml-sm"
                           :buttons="approveStatus"
                           :max="12"
                           @select="approveStatusChange"
                           title="请选择状态">
            </label-buttons>
            <div>
                <label-buttons label="单据来源："
                               class="inline"
                               :buttons="sourceList"
                               @select="sourceChange"
                               title="请选择状态">
                </label-buttons>
                <label-buttons label="异常类型："
                               class="inline ml-sm"
                               @select="abnormalTypeChange"
                               :buttons="abnormalType"
                               title="请选择状态">
                </label-buttons>
                <!--包裹丢失状态-->
                <label-item label="包裹丢失状态：" class="ml-sm">
                    <el-select class="width-sm" v-sf.lost_status v-model="searchData.lost_status">
                        <el-option
                            v-for="item in lostStatus"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </label-item>
            </div>
            <el-select class="inline s-width-default"
                       v-sf.person_type
                       v-model="searchData.person_type">
                <el-option v-for="item in typeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <scroll-select v-model="personUser"
                           style="width:120px"
                           class="inline"
                           textAlign="left"
                           v-sf.person_id
                           :remote="urlCreate"
                           :fix-params="fix_params_account"
                           :fixResult="fix_result_account"></scroll-select>

            <el-select class="inline s-width-default ml-sm"
                       v-sf.bill_type
                       v-model="searchData.bill_type">
                <el-option v-for="item in oddNumbersList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.bill_number"
                         class="inline width-super"
                         v-sf.bill_number
                         @keydown="search"></order-input>
            <el-select v-model="searchData.time_type"
                       v-sf.time_type
                       class="s-width-small inline ml-sm">
                <el-option v-for="item in timeTypeList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                ></el-option>
            </el-select>
            <el-date-picker v-model="searchData.date_b"
                            type="date"
                            placeholder="开始时间"
                            v-sf.date_b
                            :picker-options="pickerStart"
                            class="inline date ml-mini"></el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker v-model="searchData.date_e"
                            type="date"
                            placeholder="结束时间"
                            v-sf.date_e
                            :picker-options="pickerEnd"
                            class="inline date mr-sm"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-long-not-opened-search-module {
        .c-label-item {
            vertical-align: top;
            display: inline-block;
            font-size: 0;
        }
    }
</style>
<script>
    import {api_purchase_parcels_abnormal_type,api_purchase_order_audit_status_text} from '@/api/long-not-opened'

    export default {
        data() {
            return {
                disposeStatus: [
                    {
                        value: '',
                        label: "全部",
                    },
                    {
                        value: 0,
                        label: "未处理",
                    },
                    {
                        value: 1,
                        label: "已处理",
                    },
                ],
                approveStatus: [],
                abnormalType: [],
                lostStatus: [
                    {
                        value: '',
                        label: "全部",
                    },
                    {
                        value: 1,
                        label: "未找回",
                    },
                    {
                        value: 2,
                        label: "找回有差异",
                    },
                    {
                        value: 3,
                        label: "找回无差异",
                    },
                ],
                typeList: [
                    {
                        label: '创建人',
                        value: 0,
                    },
                    {
                        label: '仓库处理人',
                        value: 1,
                    },
                    {
                        label: '采购确认人',
                        value: 2,
                    },
                    {
                        label: '采购员',
                        value: 8,
                    },
                    {
                        label: '接收员',
                        value: 4,
                    },
                    {
                        label: '预接收员',
                        value: 5,
                    },
                    {
                        label: '组长审批人',
                        value: 6,
                    },
                    {
                        label: '经理审核人',
                        value: 7,
                    },
                ],
                person: '',
                urlCreate: 'get|user',
                oddNumbersList: [
                    {label: '运单号', value: 0},
                    {label: '采购单号', value: 1},
                ],
                sourceList: [
                    {name: '全部', value: ''},
                    {name: '采购购单管理', value: 1},
                    {name: '包裹查询', value: 2},
                    {name: 'PO缺失列表', value: 4},
                ],
                timeTypeList: [
                    {label: '创建时间', value: 0},
                    {label: '接收时间', value: 1},
                    {label: '预接收时间', value: 2},
                    // {label: '处理时间', value: 3},
                    // {label: '审批时间', value: 4},
                ],
                clears: {
                    warehouse_id: '',
                    process_status: '',
                    audit_status: '',
                    source: '',
                    abnormal_type: 1,
                    lost_status: '',
                    person_type: 0,
                    person_id: '',
                    time_type: 0,
                    date_b:'',
                    date_e:new Date(),
                    bill_type:0,
                    bill_number:''
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b.getTime()
                        } else {
                            return false
                        }

                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() < this.searchData.date_e.getTime()
                        } else {
                            return false
                        }

                    }
                },
                initCount:0
            }
        },
        mounted() {
            this.get_abnormal_type();
            this.get_approve_status();
        },
        methods: {
            get_abnormal_type() {
                this.$http(api_purchase_parcels_abnormal_type).then(res => {
                    this.abnormalType = [{label:'全部',value:''},...res.filter(row => row.value !== 1)];
                }).catch(code => {
                    console.log(code)
                });
            },
            get_approve_status(){
                this.$http(api_purchase_order_audit_status_text).then(res => {
                    this.approveStatus = [{label:'全部',value:''},...res];
                }).catch(code => {
                    console.log(code)
                });
            },
            search() {
                this.$emit('search');
            },
            approveStatusChange(index, item) {
                this.initCount++;
                if(this.initCount>3) {
                    this.$emit('approve-status-change',item.value);
                }
            },
            sourceChange(index, item) {
                this.initCount++;
                if(this.initCount>3) {
                    this.$emit('source-change',item.value);
                }
            },
            abnormalTypeChange(index, item) {
                this.initCount++;
                if(this.initCount>3) {
                    this.$emit('abnormal-type-change',item.value);
                }
            },
            fix_params_account({page, pageSize, keyword}) {
                if (!keyword) {
                    this.personUser = {label: '', value: ''};
                }
                return {
                    page: page,
                    pageSize: pageSize,
                    snType: 'realname',
                    snText: keyword ? keyword : ''

                };
            },
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
        computed: {
            personUser: {
                get() {
                    return {
                        label: this.person,
                        value: this.searchData.person_id
                    }
                },
                set(val) {
                    this.person = val.label;
                    this.searchData.person_id = val.value;
                }
            }
        },
        props: {
            searchData: {
                required: true,
                type: Object
            },
            warehouseList: {
                required: true,
                type: Array
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            purchaser: require('@/api-components/purchaser.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
        }
    }
</script>
