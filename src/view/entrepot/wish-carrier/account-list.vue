<template>
    <div>
        <div class="clear">
            <div class="mb-sm fr">
                <el-input class="inline width-super" placeholder="请输入名称/代码..." @keyup.enter.native="search"
                          v-model="searchText"></el-input>
                <el-button class="ml-sm" type="primary" size="mini" @click.native="search" icon="search">搜索
                </el-button>
                <permission tag="ElButton"
                            :route="apis.url_wish_carrier_bind_account"
                            class="ml-sm" type="primary" size="mini"
                            :disabled="accountList.length >= 200"
                            @click.native="add_account">添加
                </permission>
                <permission tag="requestButton"
                            class="ml-sm"
                            req-key="unbindAccount"
                            :disabled="selectData.length === 0"
                            :route="apis.url_unbind_account"
                            type="primary" size="mini"
                            @click.native="delete_account">删除
                </permission>
            </div>
        </div>
        <div class="mt-sm mb-xs clear">
            <span>已绑定账号：{{accountList.length}}</span>
            <permission tag="span" :route="apis.url_wish_carrier_log" class="operate fr" @click="show_log">操作日志
            </permission>
        </div>
        <el-table :data="accountData"
                  class="scroll-bar"
                  @selection-change="select_change"
                  v-resize="{height: 0}"
                  highlight-current-row>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column inline-template label="简称" align="center">
                <div>{{row.code}}</div>
            </el-table-column>
            <el-table-column prop="account_name" label="Wish账号" align="center"
                             show-overflow-tooltip>
            </el-table-column>
        </el-table>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import {
        api_unbind_account,
        url_wish_carrier_bind_account,
        url_wish_carrier_log,
        url_unbind_account,
    } from "@/api/wish-carrier";

    export default {
        permission: {
            url_wish_carrier_bind_account,
            url_wish_carrier_log,
            url_unbind_account,
        },
        data() {
            return {
                searchText: '',
                accountData: [],
                selectData: [],
            }
        },
        mounted() {
            if (this.accountList.length) {
                this.accountData = clone(this.accountList);
            }
        },
        methods: {
            select_change(value) {
                this.selectData = value;
            },
            search() {
                this.searchText = this.searchText.trim();
                if (this.searchText === '') {
                    this.accountData = window.clone(this.accountList);
                } else {
                    this.accountData = this.accountList.filter(row =>
                        row.code.includes(this.searchText) || row.account_name.includes(this.searchText));
                    this.selectData = [];
                }
                this.searchText = '';
            },
            delete_account() {// 解绑账号
                let account_ids = this.selectData.map(row => row.id);
                this.$confirm(`您将解绑选中的账号，确定解绑吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$http(api_unbind_account, this.wishId, {account_ids: account_ids}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.selectData.forEach(row => {
                            let account = this.accountList.findIndex(account => account.id === row.id);
                            if(account !== -1) {
                                this.accountList.splice(account, 1);
                            }
                        });
                        this.selectData = [];
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        this.$reqKey('unbindAccount', false);
                    })
                }).catch(() => {
                    this.$reqKey('unbindAccount', false);
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            show_log() {
                this.$emit('show-log');
            },
            add_account() {
                this.$emit('add-account');
            }
        },
        watch: {
            accountList(val) {
                this.accountData = window.clone(val);
                this.selectData = [];
            }
        },
        props: {
            accountList: {},
            wishId: {},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>
