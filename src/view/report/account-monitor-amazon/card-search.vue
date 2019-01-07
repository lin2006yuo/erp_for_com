<template>
    <div class="account-monitor-amazon">
        <searchCard
            :params="searchData" @search="search" :clears="originData" @enter="search"
        >
            <label-item label="平台：" class="ml-sm">
                <el-select
                    v-model="searchData.channel_id"
                    class="s-width-default"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(opt, index) in channelList"
                        :key="`channel_${index}`"
                        :label="opt.label"
                        :value="opt.value"
                    >
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="站点：" class="ml-sm">
                <el-select
                    v-model="searchData.website_id"
                    class="s-width-default"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(opt, index) in websiteList"
                        :key="`website_${index}`"
                        :label="opt.label"
                        :value="opt.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select
                    v-model="searchData.account_id"
                    class="s-width-default"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(opt, index) in accountList"
                        :key="`account_${index}`"
                        :label="opt.lable"
                        :value="opt.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="销售员：" class="ml-sm">
                <el-input
                    placeholder="请输入销售员名称"
                    class="width-sm input"
                    v-model="searchData.seller"
                    clearable
                ></el-input>
            </label-item>
        </searchCard>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                //重置的数据
                originData: {},
                //平台选项数据
                channelList: [],
                //站点选项数据
                websiteList: [],
                //账号选项数据
                accountList: []
            }
        },
        methods: {
            search() {
                this.$emit('search')
            }
        },
        props: {
            searchData: {
                type: Object,
                required: true
            }
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default
        }
    }
</script>
<style>
    .account-monitor-amazon .input {
        margin-right: 10px;
    }
</style>
