<template>
    <div class="record-keywords">
        <search-card :params="searchData"
                     @search="search"
                     @enter="search"
                     :clears="clears">
            <el-row>
                <label-buttons label="类型："
                               :buttons="msgType"
                               @select="select_type"
                               class="inline"
                               v-sf.mesg_type></label-buttons>
                <label-buttons label="平台："
                               :buttons="platformList"
                               @select="selectChannel"
                               class="inline ml-sm"
                               v-sf.platformList></label-buttons>
            </el-row>
            <el-row v-if="searchData.channel_id !== ''">
                <select-more-button label="账号简称："
                                    label-width="120"
                                    class="mb-mini"
                                    :button-list="accountList"
                                    :clearSelect="clearSelect"
                                    @query="change_account">>
                </select-more-button>
            </el-row>
            <label title="请输入关键词">关键词：</label>
            <el-input class="s-width-default inline" type="text" v-model="searchData.keyword"></el-input>
            <label title="请选择开始结束时间" class="ml-sm">接收时间：</label>
            <el-date-picker type="date"
                            placeholder="开始时间"
                            v-model="searchData.start_date"
                            v-sf.start_date
                            class="inline date"
                            :picker-options="pickerStart">
            </el-date-picker>&nbsp;--
            <el-date-picker type="date"
                            placeholder="结束时间"
                            v-model="searchData.end_date"
                            v-sf.end_date
                            :picker-options="pickerEnd"
                            class="inline mr-sm date">
            </el-date-picker>
        </search-card>
    </div>
</template>

<script>
    // import {
    //     api_keywords_ebay_account,
    // } from'../../.././../api/keywords-manage';
    export default {
        data() {
            return {
                clearSelect: false,
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_date) {
                            return time.getTime() > this.searchData.end_date;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.start_date) {
                            return time.getTime() < this.searchData.start_date ||time.getTime()>Date.now();
                        }
                    }
                },
            }
        },
        mounted() {
            // this.get_account();
        },
        methods: {
            search() {
                this.$emit("search")
            },
            select_type(item) {//--类型
                this.$emit('select-type', item);
            },
            selectChannel(item){//---平台
                this.clearSelect = !this.clearSelect;
                this.$emit('select-channel',item);
            },
            change_account(accounts) {
                this.searchData.account_id = accounts.map(a => a.value).join(',');
                this.$emit("reflash");
            },
        },
        props: {
            searchData: {required: true, type: Object},
            msgType:{require:true, type:Array},
            clears: {required: true, type: Object},
            platformList: {required: true, type: Array},
            accountList: {},
        },
        components: {
            labelButtons:require("@/components/label-buttons.vue").default,
            searchCard:require("@/components/search-card.vue").default,
            selectMoreButton: require('../../../entrepot/delivery/select-more-button').default,
        },
    }
</script>

<style scoped>

</style>
