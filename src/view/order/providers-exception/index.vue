<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="`下单异常(${totalStatistics.shipping_exception?totalStatistics.shipping_exception:'0'})`" name="1">
                <place-tab ref="place-tab" v-if="activeName === '1'"></place-tab>
            </el-tab-pane>
            <el-tab-pane :label="`集包异常(${totalStatistics.collection_exception?totalStatistics.collection_exception:'0'})`" name="2">
                <package-tab ref="package-tab" v-if="activeName === '2'"></package-tab>
            </el-tab-pane>
            <el-tab-pane :label="`停止揽收(${totalStatistics.stop_collecting?totalStatistics.stop_collecting:'0'})`" name="3">
                <stop-receive-tab ref="stop-receive-tab" v-if="activeName === '3'"></stop-receive-tab>
            </el-tab-pane>
            <el-tab-pane :label="`异常包裹(${totalStatistics.package_exception?totalStatistics.package_exception:'0'})`" name="4">
                <abnormal-tab ref="abnormal-tab" v-if="activeName === '4'"></abnormal-tab>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_providers_exception_total} from '../../../api/packages';

    export default {
        data() {
            return {
                activeName: '1',
                totalStatistics: '',
                exportVisable: false,
                ids:[],
                fields: [],
                templates: [],
                export_type: '',
            }
        },
        refresh() {
            this.init();
            this.refresh_tab();
        },
        created() {
            this.init();
        },
        methods: {
            refresh_tab(){
                switch (this.activeName) {
                    case '1':
                        this.$refs['place-tab'].init();
                        break;
                    case '2':
                        this.$refs['package-tab'].init();
                        break;
                    case '3':
                        this.$refs['stop-receive-tab'].init();
                        break;
                    case '4':
                        this.$refs['abnormal-tab'].init();
                        break;
                }
            },
            init() {
                this.$http(api_providers_exception_total).then(res => {
                    this.totalStatistics = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            handleClick() {
                switch (this.activeName) {
                    case '1':
                        break;
                    case '2':
                        break;
                    case '3':
                        break;
                }
            },
        },
        components: {
            placeTab: require('./place-tab/place-tab').default,
            packageTab: require('./package-tab/package-tab').default,
            stopReceiveTab:require('./stop-receive-tab/stop-receive-tab').default,
            abnormalTab:require('./abnormal-package/abnormal-tab').default,
            exportField: require("@/components/export-field").default,
        }
    }
</script>
