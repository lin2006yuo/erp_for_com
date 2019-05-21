<template>
    <div class="inline">
        <label-item label="平台：" v-if="byChannel">
            <el-select v-model="channel"
                       placeholder="请选择平台"
                       @change="change_channel"
            >
                <el-option v-for="channel in channels"
                           :key="channel.value"
                           :label="channel.label"
                           :value="channel.value"
                ></el-option>
            </el-select>
        </label-item>
        <el-autocomplete
                class="inline-input"
                v-model="select"
                custom-item="account-search-item"
                :fetch-suggestions="querySearch"
                placeholder="请输入账号名"
                icon="search"
                @select="handleSelect"
        ></el-autocomplete>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    import Vue from 'vue';
    import {api_account_search} from '../api/common';
    import {api_channels} from '../api/global';
    Vue.component('account-search-item', {
        functional: true,
        render: function (h, ctx) {
            let item = ctx.props.item;
            if (item.platform) {
                return h('li', {...ctx.data, class: 'account-search-item'}, [
                    h('div', {attrs: {class: 'name'}}, [`${item.platform}-${item.value}`]),
                ]);
            } else {
                return h('li', ctx.data, [
                    h('div', {attrs: {class: 'name'}}, [item.value]),
                ]);
            }
        },
        props: {
            item: {type: Object, required: true}
        }
    });
    export default{
        data(){
            return {
                channel: 1,
                select: '',
                channels: []
            }
        },
        mounted(){
            this.$http(api_channels).then(res=>{
                this.channels = res;
            })
        },
        methods: {
            change_channel(val){
                this.select = '';
                this.$emit('change-channel',val);
            },
            querySearch(query, callback){
                this.$http(api_account_search, this.channel, query).then(res => {
                    let data = [];
                    if (this.channel > 0) {
                        data = res.map(account => {
                            return {
                                value: account.label,
                                id: account.value,
                            }
                        });
                    } else {
                        res.forEach(channel => {
                            channel.search_result.map(account => {
                                data.push({
                                    value: account.label,
                                    id: account.value,
                                    platform: channel.channel_name,
                                    platform_id: channel.channel_name
                                })
                            })
                        })
                    }

                    callback(data);
                })
            },
            handleSelect(item){
                this.select = item.value;
                this.$emit('select', this.channel, item);
            }
        },
        watch:{
//            channels(val){
//                if(val instanceof Array){
//                    if(val.length){
//                        this.channel = val[0].value;
//                    }
//                }
//            }
        },
        props: {
            byChannel: {
                default: true
            }
        },
        components: {
            labelItem: require('./label-item.vue').default
        }
    }
</script>
