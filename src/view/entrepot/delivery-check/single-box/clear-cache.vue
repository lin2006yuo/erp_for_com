<template>
    <page-dialog v-model="visible" @open="open" @close="close" size="large" :title="cacheInfo.title">
        <el-table :data="cacheData"
                  ref="table"
                  class="scroll-bar mt-sm"
                  v-resize="{height: 150}"
                  border
                  v-loading="loading"
                  @selection-change="select"
                  element-loading-text="玩命加载中..."
                  highlight-current-row>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="包裹号" inline-template>
                <div>{{row.number}}</div>
            </el-table-column>
            <el-table-column label="渠道/账号信息" inline-template>
                <ui-tip :content="`${row.channel_name}/${row.code}`" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="包装前包裹详情" inline-template>
                <div>
                        <span>SKU:{{row.sku}}</span>
                        <span class="ml-sm">数量:{{row.quantity}}</span>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <permission tag="requestButton"
                        :route="apis.url_delete_watch_cache"
                        @click="sure"
                        :disabled="selectData.length === 0"
                        req-key="api_delete_watch_cache">确定
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_delete_watch_cache, url_delete_watch_cache} from "@/api/delivery-check";

    export default {
        permission: {
            url_delete_watch_cache
        },
        data() {
            return {
                visible: false,
                loading: false,
                selectData: [],
            }
        },
        methods: {
            open() {
                this.cacheData.forEach(row => {
                    this.$refs.table.toggleRowSelection(row, true)
                })
            },
            select(selection) {
                this.selectData = selection;
            },
            sure() {
                let data = {
                    keys: this.selectData.map(row => row.key)
                };
                this.$http(api_delete_watch_cache, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(()=> {
                    setTimeout(()=> {
                        this.$reqKey('api_delete_watch_cache', false);
                    }, 200);
                });
            },
            close() {
                this.selectData = [];
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
            cacheInfo: {},
            cacheData: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton:require('@/global-components/request-button').default,
            uiTip: require('@/components/ui-tip.vue').default,
        }
    }
</script>