<template>
    <div class="c-table-data">
        <el-table
            class="scroll-bar"
            :data="tableData.list"
            v-loading="load"
            v-resize="{height:41}"
            element-loading-text="玩命加载中..."
            @selection-change="selectionChange"
            @sort-change="sort_change"
            highlight-current-row
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column label="简称" prop="code" sortable></el-table-column>
            <el-table-column label="MyMall账号" prop="account_name" sortable></el-table-column>
            <el-table-column label="密钥有效期" inline-template sortable>
                <div v-if="row.expiry_time === ''">-- --</div>
                <div v-else>{{row.expiry_time}}</div>
            </el-table-column>
            <el-table-column label="数据同步" inline-template>
                <div>
                    <span class="succeed-download-order"
                          v-if="row.is_invalid && row.download_order>0"
                          :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                    <span class="default-download-order" v-else title="抓取订单功能已关闭"></span>
                    <span class="succeed-download-listing"
                          :title="`远程刊登数据${row.sync_listing}分钟抓取一次`"
                          v-if="row.is_invalid && row.sync_listing>0"></span>
                    <span class="default-download-listing"
                          title="抓取远程刊登数据未开启" v-else></span>
                </div>
            </el-table-column>
            <el-table-column label="MyMall状态" inline-template>
                <div :class="[row.enabled?'color-success':'red']">{{row.enabled | filterEnabled}}</div>
            </el-table-column>
            <el-table-column label="系统状态" inline-template>
                <div>
                    <!--url_change_status-->
                    <permission tag="ElSwitch"
                                v-model="row.is_invalid"
                                :route="apis.url_change_status"
                                onText="启用"
                                offText="停用"
                                @change="change_status(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission class="operate" :route='apis.url_look_pandao_account'
                                tag="span" @click="look_over(row)">查看</permission>
                    <permission tag="span" :route='apis.url_look_pandao_account'>|</permission>
                    <permission class="operate" :route="apis.url_update_pandao_account"
                                tag='span' @click="edit(row)">编辑</permission>
                    <permission tag="span" :route='apis.url_update_pandao_account'>|</permission>
                    <permission tag='span' :route='apis.url_get_authorization'
                                class="operate" @click="do_authorization(row)">{{row.is_authorization | filterAuthor}}</permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="change_size"
                @current-change="change_page"
                :current-page="tableData.page"
                :page-sizes="[10,20, 50, 100, 200]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.count">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_change_status,api_pandao_account,url_update_pandao_account,url_change_status,url_get_authorization,url_look_pandao_account} from '../../../../api/my-mall';
    export default {
        permission:{
            url_look_pandao_account,
            url_get_authorization,
            url_change_status,
            url_update_pandao_account
        },
        data() {
            return {}
        },
        filters:{
            filterAuthor(val){
                switch (val){
                    case 0:
                        return '未授权';
                    case 1:
                        return '已授权';
                }
            },
            filterEnabled(val){
                switch (val){
                    case 0:
                        return '失效';
                    case 1:
                        return '有效';
                }
            },
        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            change_size(size){
                this.$emit('change-size',size);
            },
            change_page(page){
                this.$emit('change_page',page);
            },
            change_status(row){
                this.$confirm(`您将更改 ${row.account_name} 账户状态，确认此操作吗？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    let params = {
                        id:row.id,
                        is_invalid:row.is_invalid?1:0
                    }
                    this.$http(api_change_status,params).then(data=>{
                        this.$message({
                            type:"success",
                            message:data.message||data,
                        });
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(code=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    });
                    row.is_invalid = !row.is_invalid;
                })
            },
            look_over(row){
                this.$emit('look-over',row);
            },
            edit(row){
                this.$emit('edit',row);
            },
            do_authorization(row){
                this.$emit('do-authorization',row);
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tableData:{//列表所需数据
                type:Object,
                required:true,
            },
            load:{//加载
                type:Boolean,
                required:true,
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {}
    }
</script>
