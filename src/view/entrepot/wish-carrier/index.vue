<template>
    <page class="p-wish-shipping">
        <el-row>
            <el-col :span="12">
                <wish-list ref="wishList"
                           @get-wish-info="get_wish_info"
                           @add="add_click"></wish-list>
            </el-col>
            <el-col :span="12">
                <card-list ref="cardList"
                           @cancel="cancel"
                           @add="add" :loading="loading" :wish-info="wishInfo"
                           @update="update"
                           @refresh-account="get_account_list"
                           :but-mark="butMark"
                           :account-list="accountList"></card-list>
            </el-col>
        </el-row>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {api_wish_carrier_account, api_wish_carrier_info} from "@/api/wish-carrier";

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '赖永凤',
                createTime: '2018-8-3',
                updateTime: ''
            },
        },
        refresh() {
            this.$refs.wishList.init();
        },
        data() {
            return {
                wishInfo: {},
                accountList: [],
                loading: false,
                butMark: false,
            }
        },
        methods: {
            get_wish_info(id) {
                this.butMark = false;
                this.loading = true;
                this.$http(api_wish_carrier_info, id).then(res => {
                    this.wishInfo = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
                this.get_account_list(id);
            },
            get_account_list(id) {
                this.$http(api_wish_carrier_account, id).then(res => {
                    this.accountList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    this.loading = false;
                })
            },
            add() {
                this.butMark = false;
                this.$refs.wishList.init();
            },
            cancel() {
                this.butMark = false;
            },
            update() {
                this.$refs.wishList.init();
            },
            add_click() {//点击添加按钮触发
                this.butMark = true;
                this.$refs.cardList.activeName = 'wishInfo';
            }
        },
        components: {
            wishList: require('./wish-list.vue').default,
            cardList: require('./card-list.vue').default
        }
    }
</script>
