<template>
    <div class="c-collector-card-list">
        <el-tabs v-loading="loading" class="ml-sm" element-loading-text="玩命加载中..."
                 v-model="activeName">
            <el-tab-pane v-resize="{height: 0}" label="物流商API" name="wishApi">
                <el-form ref="wishInfo" :model="form" label-width="120px">
                    <el-form-item label="客户ID：">
                        <el-col :span="12">
                            <el-input v-model="form.client_id"
                                      :disabled="!isEdit"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="客户端秘钥：">
                        <el-col :span="12">
                            <el-input v-model="form.client_secret"
                                      :disabled="!isEdit"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="重新载入URI：">
                        <el-col :span="12">
                            <el-input v-model="form.redirect_uri"
                                      :disabled="!isEdit"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="授权码：">
                        <el-col :span="12">
                            <el-input v-model="form.access_token"
                                      :disabled="!isEdit"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="获取授权码：">
                        <el-col :span="12">
                            <permission tag="ElButton"
                                        type="primary"
                                        size="mini"
                                        :route="apis.url_wish_get_token"
                                        @click.native="get_token"
                                        :disabled="!isEdit">
                                获取授权码
                            </permission>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="授权：">
                        <el-col :span="12">
                            <permission tag="requestButton" type="primary"
                                        size="mini"
                                        :route="apis.url_wish_carrier_authors"
                                        req-key="wishAuthors"
                                        @click.native="authors"
                                        :disabled="!isEdit">
                                授权
                            </permission>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane v-resize="{height: 0}" label="物流商信息" name="wishInfo">
                <ui-form :model="form" ref="wishInfo" label-width="120px">

                    <ui-form-item label="物流名称：" class="inline">
                        <el-input v-model="form.name" :disabled="!isEdit"></el-input>
                    </ui-form-item>

                    <ui-form-item label="物流代码：" class="inline">
                        <el-input v-model="form.code" :disabled="!isEdit"></el-input>
                    </ui-form-item>

                    <el-row>

                        <ui-form-item label="申请公司：" class="inline">
                            <el-input v-model="form.company_name" :disabled="!isEdit"></el-input>
                        </ui-form-item>

                        <ui-form-item label="状态：" class="inline">
                            <el-select v-model="form.status" :disabled="!isEdit" style="width:153px">
                                <el-option v-for="item in status"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"
                                ></el-option>
                            </el-select>
                        </ui-form-item>
                    </el-row>
                    <ui-form-item style="margin-top: 5px;">
                        <div v-if="butMark==true">
                            <permission tag="ElButton" type="primary" @click.native="add" size="mini"
                                        :disabled="isSave" :route="apis.url_add_wish_carrier">确定
                            </permission>
                            <el-button @click.native="cancel" size="mini">取 消</el-button>
                        </div>
                        <div v-else>
                            <div v-if="isEdit">
                                <permission tag="ElButton" type="primary" @click.native="update" size="mini"
                                            :disabled="isSave" :route="apis.url_update_wish_carrier">修改
                                </permission>
                                <el-button @click.native="update_cancel" size="mini">取 消</el-button>
                            </div>
                            <el-button v-else type="primary" @click.native="edit" size="mini">编辑
                            </el-button>
                        </div>
                    </ui-form-item>
                </ui-form>
            </el-tab-pane>
            <el-tab-pane label="账号绑定" name="accountList">
                <account-list v-if="activeName === 'accountList'"
                              @add-account="add_account"
                              @show-log="show_log"
                              :wish-id="wishInfo.id"
                              v-bind="$attrs"></account-list>
            </el-tab-pane>
        </el-tabs>
        <wish-log v-model="logVisible"
                  :log-data="logData"
                  :title="form.name"
                  :loading="logLoading">
        </wish-log>
        <add-account v-model="addVisible"
                     @bind="$listeners['refresh-account']"
                     :title="form.name" :wish-id="form.id"
                     :unbound-account="unboundAccount"
                     :loading="addLoading">
        </add-account>
    </div>
</template>

<style lang="stylus">
    .c-collector-card-list {
        margin-top: 15px;
        background-color: #fff;
    }
</style>

<script>
    import {
        api_add_wish_carrier,
        api_update_wish_carrier,
        api_wish_carrier_log,
        api_wish_account,
        api_wish_get_token,
        api_wish_carrier_authors,
        url_add_wish_carrier,
        url_update_wish_carrier,
        url_wish_get_token,
        url_wish_carrier_authors,
    } from "@/api/wish-carrier";

    export default {
        permission: {
            url_add_wish_carrier,
            url_update_wish_carrier,
            url_wish_get_token,
            url_wish_carrier_authors,
        },
        data() {
            return {
                activeName: 'wishInfo',
                isEdit: false,
                form: {
                    name: '',
                    code: '',
                    company_name: '',
                    client_id: '',
                    client_secret: '',
                    access_token: '',
                    redirect_uri: '',
                    status: 1,
                },
                status: [
                    {label: "启用", value: 1},
                    {label: "停用", value: 0}
                ],
                logData: [],
                unboundAccount: [],
                logVisible: false,
                addVisible: false,
                addLoading: false,
                logLoading: false,
            }
        },
        mounted() {
        },
        methods: {
            edit() {
                this.isEdit = true;
            },
            add() {
                this.trim_form();
                let params = {
                    name: this.form.name,
                    code: this.form.code,
                    company_name: this.form.company_name,
                    status: this.form.status,
                };
                this.$http(api_add_wish_carrier, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.isEdit = false;
                    this.$emit('add');
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
            },
            cancel() {
                this.$refs.wishInfo.resetFields();
                this.form = clone(this.wishInfo);
                this.isEdit = false;
                this.$emit('cancel');
            },
            update() {
                this.trim_form();
                this.$http(api_update_wish_carrier, this.form.id, this.form).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('update');
                    this.isEdit = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
            },
            update_cancel() {
                this.isEdit = false;
                this.form = clone(this.wishInfo);
            },
            trim_form() {
                Object.keys(this.form).forEach(key => {
                    if (typeof this.form[key] === 'string') {
                        this.form[key] = this.form[key].trim();
                    }
                });
            },
            show_log() {
                this.logData = [];
                this.logVisible = true;
                this.logLoading = true;
                this.$http(api_wish_carrier_log, this.wishInfo.id).then(res => {
                    this.logData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.logLoading = false;
                })
            },
            add_account() {
                this.unboundAccount = [];
                this.addVisible = true;
                this.addLoading = true;
                this.$http(api_wish_account).then(res => {
                    res.forEach(row => {
                        this.$set(row, 'check', false);
                    });
                    this.unboundAccount = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.addLoading = false;
                })
            },
            get_token() {
                this.trim_form();
                let data = {
                    id: this.form.id,
                    client_id: this.form.client_id,
                    client_secret: this.form.client_secret,
                    code: this.form.access_token,
                    redirect_uri: this.form.redirect_uri,
                };
                this.$http(api_wish_get_token, data).then(res => {
                    window.open(res.auth_url)
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            authors() {
                this.trim_form();
                let data = {
                    id: this.form.id,
                    client_id: this.form.client_id,
                    client_secret: this.form.client_secret,
                    code: this.form.access_token,
                    redirect_uri: this.form.redirect_uri,
                };
                if (!data.code || !data.client_id || !data.client_secret) {
                    this.$message({type: "error", message: '请填写完整的授权信息'});
                    this.$reqKey('wishAuthors', false);
                    return false;
                }
                this.$http(api_wish_carrier_authors, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('wishAuthors', false);
                    }, 200);
                })
            }
        },
        computed: {
            isSave() {
                switch (true) {
                    case !this.form.name:
                        return true;
                    case !this.form.code:
                        return true;
                    case !this.form.company_name:
                        return true;
                }
                return false
            },
        },
        watch: {
            wishInfo(val) {
                this.form = clone(val);
                this.isEdit = false;
            },
            butMark(val) {
                if (val) {
                    this.isEdit = true;
                    this.$refs.wishInfo.resetFields();
                    this.form = {
                        name: '',
                        code: '',
                        company_name: '',
                        client_id: '',
                        client_secret: '',
                        access_token: '',
                        redirect_uri: '',
                        status: 1,
                    };
                }
            }
        },
        props: {
            loading: {},
            wishInfo: {},
            butMark: {
                type: Boolean,
                default() {
                    return false;
                }
            },
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            accountList: require('./account-list.vue').default,
            wishLog: require('./wish-log.vue').default,
            addAccount: require('./add-account.vue').default,
        }
    }
</script>
