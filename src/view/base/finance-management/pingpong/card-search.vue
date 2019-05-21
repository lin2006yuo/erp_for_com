<template>
    <div class="c-card-search-order">
        <search-card style="overflow: visible" @search="$emit('search')"
                     @enter="$emit('search')" :params="searchData" :clears="clears"
                     class="local-order-search">
            <el-row>
                <label-buttons label="状态："
                               :buttons="status"
                               @select="change_select"
                               class="ml-sm">
                </label-buttons>
            </el-row>
            <label-item label="平台：" class="ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.channel_id"
                        :storage-key="`channelKey`"
                        :options="channelData">
                </super-select>
            </label-item>
            <label-item label="站点：" class="ml-xs">
                <super-select
                        class="s-width-default"
                        :disabled="!siteOptions.length"
                        :placeholder="sitePlaceholder"
                        v-model="searchData.site_code"
                        :storage-key="`channelsiteOptions`"
                        :options="siteOptions">
                </super-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <super-select
                        class="s-width-default"
                        :disabled="!accoutOptions.length"
                        :placeholder="accountPlaceholder"
                        v-model="searchData.account_code"
                        :storage-key="`channelaccoutOptions`"
                        :options="accoutOptions">
                </super-select>
            </label-item>
            <label-item label="服务器名：" class="ml-sm">
                <el-input type="text"
                          @keyup.enter.native="$emit('search')"
                          clearable
                          v-sf.ip_name
                          v-model="searchData.ip_name"
                          class="s-width-small">
                </el-input>
            </label-item>
            <label-items label="操作人：" class="inline ml-sm mr-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.operator_id"
                        :storage-key="`channelCreator`"
                        :options="creatorData">
                </super-select>
            </label-items>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search-order {
        .el-card {
            overflow: inherit;
        }
        .local-order-search {
            .local-order-self-width .el-select__tags {
                height: 30px !important;
                width: 208px
                overflow-y: auto;
                > span {
                    white-space: inherit;
                }
            }
            .local-order-input-no-margin {
                .el-select__input {
                    width: 196px !important;
                    margin-left: 4px !important;
                }
            }
        }
    }
</style>
<script>
    import {api_get_channel} from '@/api/order-local';
    import {api_channels_account} from '@/api/pingpong'
    export default {
        data() {
            return {
                status: [
                    {label: '全部', value: ''},
                    {label: '启用', value: 1},
                    {label: '停用', value: 0},
                ],
                siteOptions: [],
                accoutOptions: [],
                channelData: [],
            }
        },
        mounted() {
            this.siteOptions = [];
            this.accoutOptions = [];
            this.$http(api_get_channel, {}).then(res => {
                this.channelData = res.length ? [{label: "全部", value: ""}, ...res] : res;
            }).catch(code => {
                console.log(code);
            });
        },
        methods: {
            get_site(channel_id) {
                this.$http(api_channels_account, {channel_id: channel_id}).then(res => {
                    if(res.site&&res.site.length) {
                        this.siteOptions = res.site
                    }
                    if(res.account&&res.account.length) {
                        this.accoutOptions = res.account;
                    }
                }).catch(error => {
                    error && this.$message({type: 'error', message: error.message || error})
                });
            },
            change_select(index) {
                this.searchData.status = this.status[index].value;
                this.$emit('change-select');
            },
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snType: 'realname',
                    snText: keyword
                };
            }
        },
        computed: {
            sitePlaceholder() {
                if (!this.searchData.channel_id) {
                    return "请先选择平台";
                } else if (!!this.searchData.channel_id && this.siteOptions.length <= 1) {
                    return "该平台下暂无站点";
                } else {
                    return "请选择站点"
                }
            },
            accountPlaceholder() {
                if (!this.searchData.site_code) {
                    return "请先选择站点";
                } else if (!!this.searchData.site_code && this.accoutOptions.length <= 0) {
                    return "该站点下暂无账号";
                } else {
                    return "请选择账号"
                }
            },
        },
        watch:{
            'searchData.channel_id':{
                immediate: true,
                handler(val){
                    this.siteOptions = [];
                    this.accoutOptions = [];
                    this.searchData.site_code = '';
                    this.searchData.account_code = '';
                    if(val){
                        this.get_site(val)
                    }

                }
            }
        },
        props: {
            searchData: {},
            clears: {},
            creatorData: Array
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            labelItems: require('@/components/label-items.vue').default,
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>