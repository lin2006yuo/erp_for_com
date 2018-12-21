<template>
    <el-tabs v-loading="loading" class="c-collector-card-list ml-sm" element-loading-text="玩命加载中..." v-model="activeName">
        <el-tab-pane v-resize="{height: 0}" label="揽收商信息" name="collectorInfo">
            <collector-info v-bind="$attrs" v-on="$listeners"></collector-info>
        </el-tab-pane>
        <el-tab-pane label="邮寄方式" name="shipWay">
            <shipping-list v-if="activeName === 'shipWay'" v-bind="$attrs"></shipping-list>
        </el-tab-pane>
    </el-tabs>
</template>

<style lang="stylus">
    .c-collector-card-list {
        margin-top: 15px;
        background-color: #fff;
    }
</style>

<script>
    export default {
        data() {
            return {
                activeName: 'collectorInfo',
            }
        },
        props: {
            loading: {},
        },
        components: {
            collectorInfo: require('./collector-info.vue').default,
            shippingList: require('./shipping-list.vue').default
        }
    }
</script>
