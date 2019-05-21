<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="search">
            <el-row>
                <label-item class="inline">
                    <label-buttons class="inline mr-sm" label="类型：" :buttons="typeBtn"
                                   @select="$listeners['select-type']"></label-buttons>
                </label-item>
            </el-row>
            <label-item label="名称：" class="inline">
                <el-input type="text" v-model="searchData.address_name" @keydown.native="key_word"></el-input>
            </label-item>
            <label-item label="创建时间：" class="inline ml-sm">
                <el-date-picker
                        v-model="searchData.date_b"
                        type="date"
                        placeholder="选择日期"
                        class="inline date ml-xs"
                        v-sf.date_b
                        :picker-options="pickerStart"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.date_e
                        :picker-options="pickerEnd"></el-date-picker>
            </label-item>
            <label-item label="创建人：" class="inline ml-sm mr-sm">
                <super-select v-model="searchData.create_id"
                              :remote-request-http="get_user"
                              :adjust-structure="adjust"
                              storage-key="allStaffs"></super-select>
                <!--<scroll-select v-model="accounts" style="width:158px" class="inline"
                               textAlign="left"
                               ref="creater"
                               :remote="urlcreater"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account"></scroll-select>-->
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>
    .p-search-module {
        .el-card {
            overflow: inherit;
        }
    }
</style>

<script>
    import {api_get_user} from "@/api/server-management";

    export default {
        data() {
            return {
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e.getTime()
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
                urlcreater: 'get|user',
            }
        },
        mounted() {

        },
        methods: {
            search() {
                this.$emit('search')
            },
            key_word(val) {
                if (val.code === 'Enter') {
                    this.search()
                }
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },
            //账号结果
            fix_result_account(res) {
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            get_user(page, pageSize, query) {
                return api_get_user({
                    page: page,
                    pageSize: pageSize,
                    snText: query || "",
                    snType: "realname"
                })
            },
            adjust(res) {
                return {
                    data: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    count: res.count
                }
            }
        },
        computed: {
            accounts: {
                get() {
                    return {
                        label: this.searchData.account_creator_name,
                        value: this.searchData.create_id
                    }
                },
                set(val) {
                    this.searchData.account_creator_name = val.label;
                    this.searchData.create_id = val.value;
                }
            },
        },
        props: {
            searchData: {
                require: true,
                type: Object
            },
            clears: {
                require: true,
                type: Object
            },
            typeBtn: {
                require: true,
                type: Array
            }
        },
        components: {
            searchCard: require("@/components/search-card.vue").default,
            labelButtons: require('@/components/label-buttons.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default
        }
    }
</script>