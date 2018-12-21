<template>
    <el-row class="p-vova-table">
        <el-table v-resize="{height:41}"
                  :data="tableData.list"
                  border
                  highlight-current-row
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  @sort-change="sort_change"
                  @selection-change="selectionChange">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column inline-template
                             label="简称"
                             sortable>
                <ui-tip :content="row.code" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template
                             label="账号名称"
                             sortable>
                <ui-tip :content="row.account_name" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column label="数据同步" align="center" inline-template>
                <div v-if="row.status=='1'">
                        <span>
                            <span class="succeed"
                                  v-if="parseInt(row.download_order)>0"
                                  :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                            <span v-else class="default" title="同步远程订单已关闭"></span>
                        </span>
                    <span>
                            <span class="succeed_sync"
                                  v-if="parseInt(row.sync_delivery)>0"
                                  :title="`发货状态${row.sync_delivery}分钟同步一次`"></span>
                            <span v-else class="default_sync" title="同步发货状态未开启"></span>
                        </span>
                    <span>
                            <span class="succeed-download-listing"
                                  v-if="parseInt(row.download_listing)>0"
                                  :title="`远程刊登数据${row.download_listing}分钟抓取一次`"></span>
                            <span class="default-download-listing" v-else title="同步远程刊登数未开启"></span>
                        </span>
                </div>
                <div v-else>
                    <span class="default" title="同步远程订单未开启"></span>
                    <span class="default_sync" title="同步发货状态未开启"></span>
                    <span class="default-download-listing" title="同步远程刊登数据未开启"></span>
                </div>
            </el-table-column>
            <el-table-column label="vova状态" align="center" inline-template>
                <div :class="parseInt(row.is_authorization)===0?'loseStatus':'sucStatus'">
                    {{row.is_authorization|filterStatus}}
                </div>
            </el-table-column>
            <el-table-column inline-template label="系统状态" align="center">
                <div>
                    <el-switch :key="row.code"
                               v-model="row.status"
                               :on-text="status[0]"
                               on-color="#20a0ff"
                               :off-text="status[1]"
                               off-color="#C0CCDA"
                               @change="changStatus(row)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template align="center" width="260">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_get_vova_account"
                            class="operate"
                            @click="lookOver(row)">查看
                    </permission>
                    <permission tag="span"
                                :route="apis.url_get_vova_account">&nbsp;|&nbsp;
                    </permission>
                    <permission
                            tag="span"
                            :route="apis.url_put_vova_account"
                            class="operate"
                            @click="edit(row)">编辑
                    </permission>
                    <permission
                            tag="span"
                            :route="apis.url_put_vova_account">&nbsp;|&nbsp;
                    </permission>
                    <permission
                            tag="span"
                            :route="apis.url_token_vova_account"
                            class="operate"
                            @click="add_accredit(row)">{{row.is_authorization | filterAuthor}}
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=tableData.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=tableData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .p-vova-table {
        .el-table__body-wrapper {
            overflow-x hidden
        }
    }
    .sucStatus {
        color: #339907
    }

    .loseStatus {
        color: #ff0000;
    }
    .succeed {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3468px;
    }

    .default {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3490px;
    }

    .succeed_sync {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1325px;
    }

    .default_sync {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1351px;
    }
</style>
<script>
    import {
        api_vova_account_states,
        url_get_vova_account,
        url_put_vova_account,
        url_token_vova_account} from '@/api/vova-account';
    export default {
        permission: {
            url_get_vova_account,
            url_put_vova_account,
            url_token_vova_account
        },
        data() {
            return {
                status: ["启用", "停用"],
            }
        },
        methods: {
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            changStatus(row) {//-----------------------修改启用或禁用事件
                let statusTitle = row.status ? '停用' : '启用';
                this.$confirm('您将' + statusTitle + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let status = row.status ? 1 : 0;
                    let params = {
                        id: row.id,
                        status: status
                    };
                    this.$http(api_vova_account_states, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code,
                        });
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + statusTitle
                    });
                    row.status = !row.status
                });
            },
            sort_change(val) {//-----------------------表格排序
                this.$emit("sort-change", val);
            },
            lookOver(row) {//-----------------------查看
                this.$emit('look-over', row);
            },
            edit(row) {//-----------------------编辑
                this.$emit('edit', row);
            },
            add_accredit(row) {//-----------------------订单授权
                this.$emit('add-accredit', row);
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
        },
        filters: {
            filterStatus(value) {
                return parseInt(value) ? '有效' : '失效';
            },
            filterAuthor(val) {
                switch (val) {
                    case 0:
                        return '未授权';
                    case 1:
                        return '已授权';
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props: {
            tableData: {
                required: true,
                type: Object,
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                type: Boolean,
                required: true
            },
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>
