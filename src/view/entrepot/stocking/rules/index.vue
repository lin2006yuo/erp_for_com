<template>
    <page>
        <search-card :params="searchData" :clears="clears" @search="init">
            <label-buttons label="类型：" :buttons="typeList" @select="change_type"></label-buttons>
            <el-select v-model="searchData.snType"
                       class="inline width-xs"
                       v-sf.snType>
                <el-option v-for="item in userList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <el-select v-model="searchData.snText"
                       v-sf.snText
                       filterable
                       remote
                       :loading="approverLoading"
                       :remote-method="(query) => {approver_remote(query)}"
                       class="inline ml-xs">
                <el-option
                        v-for="opt in approvers"
                        :key="opt.id"
                        :label="opt.realname"
                        :value="opt.id">
                </el-option>
            </el-select>
            <label-item label="审批层级：" class="ml-sm">
                <el-select v-model="searchData.approve_grade" class="inline width-lg">
                    <el-option v-for="item in grades"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="创建时间：" class="inline ml-sm">
                <el-date-picker v-model="searchData.date_b"
                                type="date"
                                placeholder="开始时间"
                                v-sf.time_st
                                :picker-options="pickerStart"
                                class="inline date ml-mini"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker v-model="searchData.date_e"
                                type="date"
                                placeholder="结束时间"
                                v-sf.time_nd
                                :picker-options="pickerEnd"
                                class="inline date mr-sm"></el-date-picker>
            </label-item>
        </search-card>
        <div class="mt-xs mb-xs ml-sm">
            <permission tag="ElButton"
                        :route="apis.url_stock_rules"
                        type="primary"
                        @click.native="add"
                        size="mini"
                        title="添加备货审批规则"> 添加
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_get_default_stock_rule"
                        type="primary"
                        @click.native="default_rule"
                        v-if="searchData.warehouse_type"
                        size="mini"
                        title="默认审批规则">默认审批规则
            </permission>
            <permission tag="request-button"
                        :route="apis.url_stock_rules_sort"
                        v-if="isChange"
                        :mintime="200"
                        :request="save"
                        req-key="url_sort">保存
            </permission>
        </div>
        <table-module @change="isChange=true"
                      @lookup="lookup"
                      :tables="tables"
                      :loading="loading">
        </table-module>
        <rule-dialog @refresh-data="init"
                     :default-rule="defaultRule"
                     :warehouse-type="searchData.warehouse_type"
                     :mdfid="mdfid"
                     :title="title"
                     v-model="show">
        </rule-dialog>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import {
        api_stock_rules,
        api_stock_rules_sort,
        url_get_default_stock_rule,
        url_stock_rules,
        url_stock_rules_sort
    } from "@/api/stock-rules";
    import {
        api_approver
    } from '@/api/plan-rule';

    export default {
        permission: {
            url_stock_rules,
            url_stock_rules_sort,
            url_get_default_stock_rule
        },
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '张伟',
                createTime: '2018-8-15',
                updateTime: ''
            },
            beforeClose() {
                return true;
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                show: false,
                mdfid: 0,
                tables: {
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    lists: []
                },
                isChange: false,
                conds: [
                    {label: "规则名称", value: 'title'},
                    {label: "操作者", value: 'operator'},
                ],
                searchData: {
                    warehouse_type: '',
                    snType: 'create',
                    snText: '',
                    date_b: '',
                    date_e: '',
                },
                clears: {
                    snType: 'create',
                },
                approverLoading: false,
                approvers: [],
                userList: [
                    {label: '创建人', value: 'create'},
                    {label: '审核人', value: 'audit'},
                ],
                grades: [
                    {label: '全部', value: ''},
                    {label: '一级审批', value: 1},
                    {label: '二级审批', value: 2},
                    {label: '三级审批', value: 3},
                ],
                typeList: [
                    {label: '全部', value: ''},
                    {value: 1, label: '海外仓备货'},
                    {value: 2, label: '活动备货'},
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() < this.searchData.date_e.getTime()
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
                title: '',
                loading: true,
                defaultRule: false
            }
        },
        mounted() {
            // this.init();
        },
        methods: {
            add() {
                this.show = true;
                this.mdfid = 0;
                this.defaultRule = false;
                this.title = '添加规则';
            },
            default_rule(){
                this.show = true;
                this.mdfid = 0;
                this.defaultRule = true;
                this.title = '默认规则';
            },
            reload() {
                this.init();
            },
            save() {
                let sort = this.tables.lists.map((row, index) => {
                    return {id: row.id, sort: index}
                });
                return this.$http(api_stock_rules_sort, {sort}).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.isChange = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_sort', false);
                    }, 200);
                })
            },
            change_type(index, item) {
                this.searchData.warehouse_type = item.value;
                this.init();
            },
            init() {
                this.loading = true;
                let data = this.get_params();
                this.$http(api_stock_rules, data).then(res => {
                    res.forEach(row => {
                        row.isTurn = false;
                        row.number = 1;
                        row.status = row.status ? false : true;
                    });
                    this.tables.lists = res;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                })
            },
            get_params: function () {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });

                let searchData = clone(this.searchData);
                if (this.searchData.date_b) {
                    searchData.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                } else {
                    searchData.date_b = '';
                }
                if (this.searchData.date_e) {
                    searchData.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                } else {
                    searchData.date_e = '';
                }
                return searchData;
            },
            lookup(itemid) {
                this.mdfid = itemid;
                this.defaultRule = false;
                this.title = '查看编辑规则：';
                this.show = true;
            },
            approver_remote(query) {
                this.approverLoading = true;
                this.$http(api_approver, query).then(res => {
                    this.approvers = res.data
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.approverLoading = false;
                })
            },
        },
        watch: {
            show(val) {
                if (!val) {
                    this.mdfid = 0;
                    this.init();
                }
            }
        },
        components: {
            labelButtons: require('@/components/label-buttons.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            tableModule: require('./table-module.vue').default,
            ruleDialog: require('./rule-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
        }
    }
</script>
