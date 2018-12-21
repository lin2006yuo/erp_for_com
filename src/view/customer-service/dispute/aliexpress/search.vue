<template>
    <div class="p-search">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
            <div>
                <label-buttons
                    class="inline p-package-tab-buttons"
                    label="纠纷状态："
                    @select="change_channel"
                    :buttons="buttons">
                </label-buttons>
            </div>
            <label>账号简称：</label>
            <el-select v-model="searchData.account_id" filterable placeholder="请选择" class="inline s-width-default"
                       v-sf.account_id>
                <el-option
                    :key="item.value"
                    v-for="item in accounts"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <label class="ml-sm">买家ID：</label>
            <el-input v-model="searchData.buyer_login_id" placeholder="请输入买家ID..." class="inline s-width-large" v-sf.buyer_login_id></el-input>
            <label class="ml-sm">订单号：</label>
            <el-input v-model="searchData.order_no" placeholder="请输入订单号..." class="inline s-width-large" v-sf.order_no></el-input>
            <label class="ml-sm">操作日期：</label>
            <el-date-picker class="date inline"
                            v-model="searchData.process_start_time"
                            :picker-options="picker_b"
                            v-sf.process_start_time
                            placeholder="开始时间"></el-date-picker> --
            <el-date-picker
                class="date inline mr-sm"
                placeholder="结束时间"
                v-model="searchData.process_end_time"
                v-sf.process_end_time
                :picker-options="picker_e"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_account, url_get_list} from "../../../../api/dispute"

    export default {
        permission: {
            url_get_list
        },
        data() {
            return {
                handles: [{name: "全部", value: this.searchData.count, count: this.searchData.count}, {
                    name: "未回评",
                    value: 2,
                    count: 1
                }],
                accounts: [],
                clears: {},
                purchaserList:[{label: '全部', value: ''}],
                picker_b: {
                disabledDate: (time) => {
                    if (this.searchData.process_end_time) {
                        return time.getTime() > this.searchData.process_end_time;
                    } else {
                        return time.getTime() > new Date();
                    }
                }
            },
            picker_e: {
                disabledDate: (time) => {
                    if (this.searchData.process_start_time) {
                        return time.getTime() < this.searchData.process_start_time || time.getTime() > new Date();
                    } else {
                        return time.getTime() > new Date();
                    }
                }
            },

            }
        },
        mounted() {
            this.get_account();
            this.clears = clone(this.searchData)
        },
        methods: {
            change_channel(index) {
                this.searchData.label_id = this.buttons[index].value;
                this.search();
            },
            search() {
                this.$emit("search")
            },
            clear() {
                this.$emit("clear")
            },
            get_account() {
                this.$http(api_get_account, {channel_id: 4}).then(res => {
                    this.accounts = [{label: '全部', value: ''}, ...res.account];
                }).catch(code => {
                    console.log(code)
                })
            }

        },
        filters: {},
        watch: {},
        props: {
            searchData: {
                require: true,
                type: Object
            },
            buttons:{
                require: true,
                type: Array
            }
        },
        components: {
            labelButtons: require("../../../../components/label-all-buttons.vue").default,
            searchCard: require("../../../../components/search-card.vue").default
        }
    }
</script>
