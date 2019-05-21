<template>
    <div class="c-data-table">
        <el-table v-resize="{height:41}"
                  :data="tableData.data"
                  border
                  highlight-current-row
                  v-loading="loading"
                  @sort-change="sort_change"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    width="60"
                    prop="id"
                    label="NO.">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="卡号">
                <ui-tip :content="row.card_number" v-copy></ui-tip>
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="card_master"
                    label="卡主姓名">
            </el-table-column>
            <el-table-column
                    prop="bank"
                    label="银行">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="validity_date"
                    label="有效期">
            </el-table-column>
            <el-table-column
                    prop="card_category"
                    label="信用卡类别"
                    width="120">
            </el-table-column>
            <el-table-column
                    width="110"
                    inline-template
                    label="安全码">
                <ui-tip :content="row.security_code" :width="68" v-copy></ui-tip>
            </el-table-column>
            <el-table-column inline-template
                             sortable
                             label="被绑定账号数">
                <div>
                    <el-button type="text" @click.native="see_show(row)" :class="[row.account_count?'':'disabled see-account activeRed']">{{row.account_count}}</el-button>
                </div>
            </el-table-column>
            <el-table-column label="数据同步" align="center" inline-template width="90">
                <div v-if="row.synchronize_status > 0">
                    <span>
                            <span class="succeed-download-listing"
                                  v-if="parseInt(row.synchronize_status)>0"
                                  :title="`远程刊登数据${row.synchronize_status}分钟抓取一次`"></span>
                            <span class="default-download-listing" v-else title="同步远程刊登数未开启"></span>
                        </span>
                </div>
                <div v-else>
                    <span class="default-download-listing" title="同步远程刊登数据未开启"></span>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="状态">
                <ui-tip :content="row.card_status | runStatus" :width="68"></ui-tip>
            </el-table-column>
            <el-table-column label="添加人" width="100">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{scope.row.department}}</p>
                        <div slot="reference">
                            <div>{{scope.row.creator}}</div>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="create_time"
                             sortable
                             label="添加时间">
            </el-table-column>
            <el-table-column label="操作" inline-template align="center" width="160">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_card_edit"
                            class="operate"
                            @click="look_over(row)">查看
                    </permission>
                    <permission tag="span"
                                :route="apis.url_card_update">&nbsp;|&nbsp;
                    </permission>
                    <permission
                            tag="span"
                            :route="apis.url_card_update"
                            class="operate"
                            @click="edit_credit(row)">编辑
                    </permission>
                    <permission tag="span"
                                :route="apis.url_card_delete">&nbsp;|&nbsp;
                    </permission>
                    <div class="inline">
                        <span v-if="Number(row.account_count) !== 0 && Number(row.account_count) !== ''" class="activeRed">删除</span>
                        <permission
                                v-else
                                tag="span"
                                :route="apis.url_card_delete"
                                class="operate"
                                @click="card_delete(row)">删除
                        </permission>
                    </div>

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
        <account-table v-model="accountCount" :account-data="accountData" :titles="titles"></account-table>
    </div>
</template>
<style lang="stylus">
        .sucStatus {
            color: #339907
        }

        .loseStatus {
            color: #ff0000;
        }
        .activeBlues{
            color #69f;
        }
        .activeRed{
            color #a29f9c
        }
        .disabled{
            pointer-events:none;
        }
</style>
<script>
    import {url_card_edit,url_card_update,
        api_card_delete,url_card_delete,api_card_info} from '@/api/credit-card';
    export default {
        permission: {
            url_card_edit,
            url_card_update,
            url_card_delete,
        },
        data() {
            return {
                accountCount:false,
                accountData:[],
                titles:'',
            }
        },
        methods:{
            sort_change(val){
                this.$emit('sort-change',val);
            },
            look_over(row){//---查看
                this.$emit('look-over',row);
            },
            edit_credit(row){//---编辑
                this.$emit('edit-credit',row);
            },
            card_delete(row){//---删除
                this.$confirm('此操作将删除该信用卡, 确认此操作吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http(api_card_delete,row.id).then(res=>{
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('submit');
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            see_show(row){//---被绑定账号数
                this.$http(api_card_info,row.id).then(res=>{
                    this.titles = `查看信用卡：${row.card_number} 绑定的账号信息`
                    this.accountData = res;
                    this.accountCount = true;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
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
            runStatus(status){
                switch (status){
                    case 1:return '正常';
                    case 2:return '异常';
                    case 3:return '注销';
                    default:
                        return '';
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
            accountTable: require("./account-table.vue").default,
        }
    }
</script>