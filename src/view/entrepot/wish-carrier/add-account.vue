<template>
    <page-dialog class="c-wish-account-add" size="large" v-model="visible" @open="open" @close="close"
                 :title="`${title}绑定账号`">
        <el-row>
            <el-col :span="12">
                <order-input class="width-super mb-sm"
                             v-model="text"
                             @keydown="search"
                             placeholder="请输入名称或简称，支持模糊查询"></order-input>
                <el-tag
                        v-for="(item, index) in checkedAccountList"
                        :key="item.id"
                        closable
                        type="primary"
                        class="ml-xs mb-xs"
                        @close="handle_close($event,item, index)">
                    {{item.code}}
                </el-tag>
            </el-col>
            <el-col :span="12">
                <div class="account-list" v-resize="{height: 150}" v-loading="loading">
                    <el-checkbox v-for="item in accountList"
                                 class="width-half"
                                 v-model="item.check"
                                 :key="item.id">
                        {{item.code}}
                    </el-checkbox>
                </div>
            </el-col>
        </el-row>
        <div slot="footer">
            <permission tag="requestButton"
                        type="primary"
                        req-key="bindAccount"
                        size="mini"
                        :route="apis.url_wish_carrier_bind_account"
                        @click.native="sure">提交
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-wish-account-add {
        .width-half {
            width: 50%;
        }
        .el-checkbox + .el-checkbox {
            margin-left: 0;
        }
        .account-list {
            overflow-y: scroll;
        }
    }
</style>
<script>
    import {api_wish_carrier_bind_account, url_wish_carrier_bind_account} from "@/api/wish-carrier";

    export default {
        permission: {
            url_wish_carrier_bind_account,
        },
        data() {
            return {
                visible: false,
                text: '',
                accountList: [],
            }
        },
        methods: {
            open() {
            },
            search() {
                this.text = this.text.trim();
                if (this.text === '') {
                    this.accountList = this.unboundAccount;
                } else {
                    let text = this.text.split('\n').filter(row => !!row).map(row => row.trim());
                    this.accountList = this.unboundAccount.filter(
                        row => text.some(
                            txt => row.code.includes(txt) || row.account_name.includes(txt)
                        )
                    );

                }
            },
            sure() {
                let account_ids = this.checkedAccountList.map(row => row.id);
                if (account_ids.length === 0) {
                    this.$message({type: 'error', message: '请选择要绑定的账号'});
                    this.$reqKey('bindAccount', false);
                } else {
                    this.$http(api_wish_carrier_bind_account, this.wishId, {account_ids: account_ids}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('bind', this.wishId);
                        this.visible = false;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('bindAccount', false);
                        }, 200);
                    });
                }
            },
            close() {
                this.text = '';
            },
            handle_close(e, item, index) {
                let curItem = this.unboundAccount.find(row => row.id === item.id);
                this.$set(curItem, 'check', false);
            }
        },
        computed: {
            checkedAccountList() {
                return this.unboundAccount.filter(row => row.check);
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            },
            unboundAccount(val) {
                this.accountList = val;
                this.search();
            }
        },
        props: {
            value: {},
            unboundAccount: {},
            loading: {},
            title: {},
            wishId: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            orderInput: require('@/components/order-input.vue').default,
        }
    }
</script>