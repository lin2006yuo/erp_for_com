<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="添加配置">
        <el-table :data="configData" border
                  v-loading="loading"
                  @selection-change="select_change"
                  highlight-current-row>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="配置名称" inline-template>
                <div>
                    {{`${row.title}(${row.name})`}}
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="api_use_system_config"
                        @click="sure"
                        :disabled="selectData.length === 0"
                        :route="apis.url_use_system_config">
                确定
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_system_config, api_use_system_config, url_use_system_config} from "@/api/storeManagement";

    export default {
        permission: {
            url_use_system_config,
        },
        data() {
            return {
                visible: this.value,
                configData: [],
                selectData: [],
                loading: false,
            }
        },
        methods: {
            open() {
                this.loading = true;
                this.$http(api_system_config, {warehouse_id: this.id}).then(res => {
                    this.configData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                })
            },
            close() {
                this.configData = [];
                this.selectData = [];
                this.loading = false;
            },
            select_change(val) {
                this.selectData = val;
            },
            sure() {
                let data = {
                    config_id: this.selectData.map(row => row.id),
                };
                this.$http(api_use_system_config, this.id, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search', this.id);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_use_system_config', false);
                    }, 200);
                });
            },
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
            id: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button').default,
        }
    }
</script>