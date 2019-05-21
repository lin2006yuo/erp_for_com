<template>
    <div class="p-picking-search-module">
        <search-card :params="searchData" @search="search" :clears="clears" class="mt-xs">
            <el-row>
                <label class="inline mb-mini" title="请选择仓库"> 仓库：</label>
                <super-select class="inline width-sm"
                          v-model="warehouse_id"
                          filterable clearable
                          storageKey="virtual_store"
                          @change="warehouse_change"
                          :options="warehouseList">
                </super-select>
                <label-buttons label="处理状态："
                               class="inline ml-sm"
                               :buttons="statusList"
                               @select="select_status"></label-buttons>
                <label-buttons label="包裹状态："
                               class="inline ml-sm"
                               :buttons="packageStatusList"
                               @select="select_package_status"></label-buttons>
            </el-row>
            <!--发起，接收，处理人-->
            <el-select class="inline s-width-default"
                       v-model="searchData.person_type">
                <el-option v-for="item in personTypeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <!--<super-select class="inline s-width-default"-->
                          <!--v-model="staffs"-->
                          <!--storageKey="virtual_user"-->
                          <!--:adjustStructure="adjust_structure"-->
                          <!--:remoteRequestHttp="remoteRequestHttp">-->
            <!--</super-select>-->
            <scroll-select v-model="staffs" style="width:158px" class="inline"
                           textAlign="left"
                           ref="creater"
                           remote="get|user"
                           :fix-params="fix_params_account"
                           :fixResult="fix_result_account">
            </scroll-select>
            <!--采购，运单号-->
            <el-select class="inline ml-sm s-width-default"
                       v-model="searchData.bill_type">
                <el-option v-for="item in typeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.bill_number"
                         class="inline width-super"
                         v-sf.s_bill_number
                         @keydown="search"></order-input>
            <!--时间搜索-->
            <el-select class="inline ml-sm s-width-default"
                       v-model="searchData.time_type">
                <el-option v-for="item in timeTypeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <el-date-picker v-model="searchData.date_b"
                            type="date"
                            placeholder="开始时间"
                            v-sf.date_b
                            :picker-options="pickerStart"
                            class="inline date"></el-date-picker>
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
    .p-picking-search-module {
        .c-label-item {
            vertical-align: top;
            display: inline-block;
            font-size: 0;
        }
    }
</style>
<script>
    import {api_get_user} from  '../../../../../api/report-channel'
    export default {
        data() {
            return {
                userList: [],
                warehouse_id: '',
                // staffs: '',
                statusList: [
                    {label: '全部', value: ''},
                    {label: '未处理', value: 0},
                    {label: '已处理', value: 1},
                ],
                packageStatusList:[
                    {label: '全部', value: ''},
                    {label: '未拆', value: 0},
                    {label: '已拆', value: 1},
                    {label: '已接收', value: 2},
                    {label: '异常', value: 3},
                ],
                personTypeList: [
                    {label: '发起人', value: 0},
                    {label: '受理人', value: 1},
                    {label: '跟进人', value: 2},
                ],
                timeTypeList: [
                    {label: '接收时间', value: 1},
                    {label: '预接收时间', value: 2},
                    {label: '跟进时间', value: 3},
                    {label: '发起时间', value: 0},
                ],
                typeList: [
                    {
                        label: '采购单ID',
                        value: 1,
                    },
                    {
                        label: '运单号',
                        value: 0,
                    },
                ],
                clears: {
                    process_status: '',
                    bill_type: 1,
                    bill_number: '',
                    person_type: 2,
                    person_id: '',
                    person_name: '',
                    time_type: 1,
                    date_b: '',
                    date_e: '',
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e.getTime()
                        } else {
                            return false
                        }

                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b.getTime()
                        } else {
                            return false
                        }

                    }
                },
            }
        },
        mounted() {},
        methods: {
            adjust_structure(res) {
                let data = res.data.map(row => {
                    return {
                        label: row.realname,
                        value: row.id
                    }
                });
                return {
                    count: res.count,
                    data: data
                }
            },
            remoteRequestHttp(page,pageSize,query) {
                let data = {
                    page: page,
                    pageSize: 10000,
                    snType: 'realname',
                    snText: query || "",
                };
                return api_get_user(data);
            },
            search() {
                this.$emit('search');
            },
            warehouse_change() {
                this.$emit('warehouse-change',this.warehouse_id);
            },
            select_status(index, data) {
                this.searchData.process_status = data.value;
                this.search();
            },
            select_package_status(index, data) {
                this.searchData.is_use = data.value;
                this.search();
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
        computed: {
            staffs: {
                get() {
                    return {
                        value: this.searchData.person_id,
                        label: this.searchData.person_name,
                    };
                },
                set(val) {
                    console.log('valdsds', val);
                    this.searchData.person_id = val.value;
                    this.searchData.person_name = val.label;
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
