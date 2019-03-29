<template>
    <page-dialog :loading="loading" class="c-edit-address" v-model="visible" @open="open" @close="close" size="large"
                 :title="editable ? '设置地址' : '查看地址'">
        <el-row class="mt-sm mb-sm">
            <label-item label="账号：" class="ml-lg">
                <el-input v-model="account" placeholder="请输入账号名，支持模糊搜索"
                          class="width-lg"
                          ref="account"
                          @keyup.enter.native="search"
                          @focus="select_input"></el-input>
                <el-button class="ml-sm" type="primary" size="mini" @click.native="search">搜索</el-button>
                <el-button class="ml-sm" type="primary" size="mini" v-if="editable" @click="show_setting_address(1)">批量设置寄件人</el-button>
                <el-button class="ml-sm" type="primary" size="mini" v-if="editable" @click="show_setting_address(2)">批量设置揽收人</el-button>
                <el-button class="ml-sm" type="primary" size="mini" v-if="editable" @click="show_setting_address(3)">批量设置退件人</el-button>
            </label-item>
        </el-row>
        <el-row>
            <virtual-list v-if="curAccountList.length" :size="22" :remain="22" :bench="66">
                <el-col v-for="(item,index) in curAccountList" :key="item.account_code" class="mb-xs">
                    <span class="account" :title="item.account_code">{{item.account_code}}：</span>
                    <el-select v-model="item.default_sender" placeholder="请选择寄件人" class="inline width-super"
                               :disabled="!editable"
                               clearable>
                        <el-option
                                v-for="it in item.sender"
                                :key="it.address_id"
                                :label="`${it.country}${it.province}${it.city}${it.name}`"
                                :value="it.address_id">
                        </el-option>
                    </el-select>
                    <el-select v-model="item.default_pickup" placeholder="请选择揽件人" class="inline width-super"
                               :disabled="!editable"
                               clearable>
                        <el-option
                                v-for="it in item.pickup"
                                :key="it.address_id"
                                :label="`${it.country}${it.province}${it.city}${it.name}`"
                                :value="it.address_id">
                        </el-option>
                    </el-select>
                    <el-select v-model="item.default_refund" placeholder="请选择退件人" class="inline width-super"
                               :disabled="!editable"
                               clearable>
                        <el-option
                                v-for="it in item.refund"
                                :key="it.address_id"
                                :label="`${it.country}${it.province}${it.city}${it.name}`"
                                :value="it.address_id">
                        </el-option>
                    </el-select>
                </el-col>
            </virtual-list>
            <div v-else class="none">暂无数据</div>
        </el-row>
        <div slot="footer">
            <el-button v-if="editable" type="primary" size="mini" @click="sure">确定</el-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
        <setting-address
            v-model="showSettingModal"
            :type="settingType"
            :request="setting_address_save"
        ></setting-address>
    </page-dialog>
</template>
<style lang="stylus">
    .c-edit-address {
        .address-wrap {
            max-height: 1000px;
        }
        .none {
            text-align center
            color: #5e7582
        }
        .account {
            display: inline-block;
            width: 120px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
        }
    }
</style>
<script>
    import {api_set_ali_address, api_address_batch} from "@/api/setLogistics";

    export default {
        data() {
            return {
                visible: false,
                account: '',
                curAccountList: [],
                showSettingModal: false,
                settingType: 1,
                typeMap: {
                    1: 'default_sender',
                    2: 'default_pickup',
                    3: 'default_refund'
                }
            }
        },
        methods: {
            open() {
            },
            sure() {
                let ali_address = this.aliInfo.ali_address.map(row => {
                    return {
                        account_id: row.account_id,
                        sender_id: row.default_sender || "",
                        pickup_id: row.default_pickup || "",
                        refund_id: row.default_refund || "",
                    }
                });
                this.$http(api_set_ali_address, this.aliInfo.id, {ali_address: ali_address}).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.visible = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            close() {
                this.account = '';
                this.curAccountList = [];
                this.$emit('close');
            },
            select_input() {
                this.$refs.account.inputSelect();
            },
            search() {
                this.account = this.account.trim();
                if(this.account === '') {
                    this.curAccountList = this.aliInfo.ali_address;
                } else {
                    this.curAccountList = this.aliInfo.ali_address.filter(row => row.account_code.includes(this.account));
                }
            },
            //作为回调函数传入
            setting_address_save(params) {
                return this.$http(api_address_batch, params).then(res => {
                    if(res.length === 0) return this.$message({ type: 'warning', message: '查询不到地址' })
                    this.setting_address(res)
                    this.showSettingModal = false
                    return this.$message({ type: 'success', message: '批量设置成功，按确定后保存' })

                }).catch(message => {
                    this.$message({ type: 'error', message: message })
                })
            },
            show_setting_address(type) {
                this.settingType = type
                this.showSettingModal = true
            },
            setting_address(data) {
                this.aliInfo.ali_address.forEach(item => {
                    const value = data[item.account_id]
                    const key = this.typeMap[this.settingType]
                    if(!value || item[key] !== "") return
                    item[key] = value
                })
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            },
            loading(val) {
                if(!val) {
                    this.curAccountList = this.aliInfo.ali_address;
                }
            }
        },
        props: {
            value: {},
            aliInfo: {},
            editable: {},
            loading: {
                type: Boolean,
                default() {
                    return false;
                }
            },
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            virtualList: require('@/components/virtual-list').default,
            settingAddress: require('./setting-address').default
        }
    }
</script>
