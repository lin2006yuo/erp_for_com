<template>
    <page-dialog :loading="loading" class="c-edit-address" v-model="visible" @open="open" @close="close" size="large"
                 title="设置地址">
        <el-row>
            <virtual-list :size="22" :remain="22" :bench="66">
                <el-col v-for="(item,index) in aliInfo.ali_address" :key="index" class="mb-xs">
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
        </el-row>
        <div slot="footer">
            <el-button v-if="editable" type="primary" size="mini" @click="sure">确定</el-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-edit-address {
        .address-wrap {
            max-height: 1000px;
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
    import {api_set_ali_address} from "@/api/setLogistics";

    export default {
        data() {
            return {
                visible: false,
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
                })
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
                this.$emit('close');
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
            pageDialog: require('@/components/page-dialog.vue').default,
            virtualList: require('@/components/virtual-list').default
        }
    }
</script>