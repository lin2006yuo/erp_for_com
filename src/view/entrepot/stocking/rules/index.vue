<template>
    <page>
        <div class="mt-sm mb-sm ml-sm">
            <permission tag="ElButton"
                        :route="apis.url_stock_rules"
                        type="primary"
                        @click.native="add"
                        size="mini"
                        title="添加备货审批规则"> 添加
            </permission>
            <permission tag="request-button"
                        :route="apis.url_stock_rules_sort"
                        v-if="isChange"
                        :mintime="200"
                        :request="save"
                        req-key="url_sort">保存
            </permission>
        </div>
        <rule-dialog @refresh-data="init"
                     :mdfid="mdfid"
                     :title="title"
                     v-model="show">
        </rule-dialog>
        <table-module @change="isChange=true"
                      @lookup="lookup"
                      :tables="tables"
                      :loading="loading">
        </table-module>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import {
        api_stock_rules,
        api_stock_rules_sort,
        url_stock_rules,
        url_stock_rules_sort
    } from "@/api/stock-rules";

    export default {
        permission: {
            url_stock_rules,
            url_stock_rules_sort
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
                cond: 'title',
                condValue: '',
                plat: '',
                btime: '',
                etime: '',
                title: '',
                loading: true
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            add() {
                this.show = true;
                this.mdfid = 0;
                this.title = '添加规则';
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
            init() {
                this.loading = true;
                this.$http(api_stock_rules).then(res => {
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
            lookup(itemid) {
                this.mdfid = itemid;
                this.title = '查看编辑规则：';
                this.show = true;
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
            tableModule: require('./table-module.vue').default,
            ruleDialog: require('./rule-dialog.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            labelItems: require('@/components/label-items.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
        }
    }
</script>
