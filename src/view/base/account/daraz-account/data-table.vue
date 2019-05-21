<template>
    <div class="c-data-table">
        <el-table v-resize="{height:41}"
                  :data="tableData.data"
                  border
                  highlight-current-row
                  v-loading="loading"
                  @selection-change="selectionChange"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="40">
            </el-table-column>
            <el-table-column inline-template
                             label="简称">
                <ui-tip :content="row.code" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template
                             label="账户名称">
                <ui-tip :content="row.name" :width="98" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template
                             label="站点">
                <ui-tip :content="row.site" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="销售员" inline-template>
                <div :class="parseInt(row.seller_on_job)!==1?'loseStatus':''">
                    {{row.seller_name}}
                </div>
            </el-table-column>
            <el-table-column label="客服" inline-template>
                <div :class="parseInt(row.customer_on_job)!==1?'loseStatus':''">
                    {{row.customer_name}}
                </div>
            </el-table-column>
            <el-table-column label="注册日期" inline-template width="140px">
                <span>{{filterRegisterTime(row.register_time)}}</span>
            </el-table-column>
            <el-table-column label="交接日期" inline-template width="140px">
                <span>{{filterTime(row.fulfill_time)}}</span>
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
            <el-table-column label="Daraz状态" align="center" inline-template>
                <div :class="parseInt(row.platform_status)===0?'loseStatus':'sucStatus'">
                    {{row.platform_status|filterStatus}}
                </div>
            </el-table-column>
            <el-table-column inline-template label="系统状态" align="center">
                <span>{{row.status|filterStatu}}</span>
                <!--<div>-->
                    <!--<el-switch :key="row.code"-->
                               <!--v-model="row.status"-->
                               <!--:on-text="status[0]"-->
                               <!--on-color="#20a0ff"-->
                               <!--:off-text="status[1]"-->
                               <!--off-color="#C0CCDA"-->
                               <!--@change="changStatus(row)">-->
                    <!--</el-switch>-->
                <!--</div>-->
            </el-table-column>
            <el-table-column label="账号状态" align="center" inline-template>
                <ui-tip :content="row.site_status_str"  v-copy></ui-tip>
            </el-table-column>
            <el-table-column label="操作" inline-template align="center" width="260">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_get_daraz_read"
                            class="operate"
                            @click="look_over(row)">查看
                    </permission>
                    <permission tag="span"
                                :route="apis.url_daraz_account_update">&nbsp;|&nbsp;
                    </permission>
                    <permission
                            tag="span"
                            :route="apis.url_daraz_account_update"
                            class="operate"
                            @click="edit(row)">编辑
                    </permission>
                    <permission
                            tag="span"
                            :route="apis.url_change_authorization">&nbsp;|&nbsp;
                    </permission>
                    <permission
                            tag="span"
                            :route="apis.url_change_authorization"
                            class="operate"
                            @click="add_accredit(row)">{{row.is_authorization | filterAuthor}}
                    </permission>
                    <permission
                        tag="span"
                        :route="apis.url_daraz_account_log">|</permission>
                    <permission tag="span"
                                :route="apis.url_daraz_account_log"
                                class="operate"
                                @click="log(row)">日志</permission>
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
                    :total=tableData.count>
            </el-pagination>
        </div>
    </div>
</template>
<style lang="stylus">
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
    import {url_get_daraz_read,
            url_daraz_account_update,
            url_change_authorization,
            url_daraz_account_log,
            api_change_status} from '@/api/daraz-account';
    export default {
        permission: {
            url_get_daraz_read,
            url_daraz_account_update,
            url_change_authorization,
            url_daraz_account_log,
        },
        data() {
            return {
                status: ["启用", "停用"],
            }
        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            changStatus(row) {//-----------------------修改启用或禁用事件
                console.log('row.status',row.status);
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
                    this.$http(api_change_status, params).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('search');
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code,});
                    })
                }).catch((code) => {
                    this.$message({type: 'info', message: '已取消' + statusTitle});
                    row.status = !row.status
                });
            },
            look_over(row){//---查看
                this.$emit('look-over',row);
            },
            edit(row){//---编辑
                this.$emit('edit',row);
                this.title = `编辑`;
            },
            add_accredit(row){//---授权页面
                this.$emit('add-accredit',row);
            },
            //日志
            log(row){
                this.$emit('log-form',row);
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            filterTime(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            },
            filterRegisterTime(val){
                return datef('YYYY-MM-dd',val);
            },
        },
        filters: {
            filterStatus(value) {
                return parseInt(value) ? '有效' : '失效';
            },
            filterStatu(val){
                return val===true?'已启用':'已停用'
            },
            filterAuthor(val) {
                switch (val) {
                    case 0:
                        return '未授权';
                    case 1:
                        return '已授权';
                }
            },
            filterAccoutStatus(val){
                switch (val) {
                    case 0:
                        return '未分配';
                    case 1:
                        return '运营中';
                    case 2:
                        return '回收中';
                    case 3:
                        return '冻结中';
                    case 4:
                        return '申诉中';
                    case 5:
                        return '已回收';
                    case 6:
                        return '已作废';
                    default:
                        return '--'
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },

        },
        props:{
            tableData:{
                require:true,
                type:Object
            },
            loading:{},
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>
