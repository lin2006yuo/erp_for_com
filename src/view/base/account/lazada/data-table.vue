<template>
    <el-row class="p-lazada-table">
        <div>
            <el-table v-resize="{height:41}"
                      :data="lazadaList.list"
                      border
                      highlight-current-row
                      v-loading="loading"
                      element-loading-text="玩命加载中..."
                      @selection-change="selectionChange"
                      @sort-change="sort_change">
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
                                 label="账户名称"
                                 sortable>
                    <ui-tip :content="row.name" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template
                                 label="Lazada账户"
                                 sortable>
                    <ui-tip :content="row.lazada_name" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template
                                 label="站点"
                                 align="center"
                                 sortable>
                    <div>{{row.site}}</div>
                </el-table-column>
                <el-table-column inline-template
                                 label="密钥有效期"
                                 sortable
                                 align="center">
                    <ui-tip :content="row.token_expire_time | timeFilter" :width="98" v-copy></ui-tip>
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
                            <span  class="default-download-listing" v-else title="同步远程刊登数未开启"></span>
                        </span>
                    </div>
                    <div v-else>
                        <span class="default" title="同步远程订单未开启"></span>
                        <span class="default_sync" title="同步发货状态未开启"></span>
                        <span class="default-download-listing" title="同步远程刊登数据未开启"></span>
                    </div>
                </el-table-column>
                <el-table-column  label="Lazada状态" align="center"  inline-template>
                    <div :class="parseInt(row.platform_status)===0?'loseStatus':'sucStatus'">
                        {{row.platform_status|filterStatus}}</div>
                </el-table-column>
                <el-table-column inline-template  label="系统状态" align="center">
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
                <el-table-column label="操作" inline-template align="center" width="220">
                    <div>
                        <permission
                            tag="span"
                            :route="apis.url_get_lazada_account"
                            class="operate"
                            @click="lookOver(row)">查看</permission>
                        <permission tag="span"
                                    :route="apis.url_get_lazada_account">&nbsp;|&nbsp;</permission>
                        <permission
                            tag="span"
                            :route="apis.url_lazada_account_edit"
                            class="operate"
                            @click="edit(row)">编辑</permission>
                        <permission
                            tag="span"
                            :route="apis.url_lazada_account_edit">&nbsp;|&nbsp;</permission>
                        <permission
                            tag="span"
                            :route="apis.url_lazada_authorization"
                            class="operate"
                            @click="add_member(row)">{{row.is_authorization | filterAuthor}}</permission>
                        <permission
                            tag="span"
                            :route="apis.url_lazada_authorization">&nbsp;|&nbsp;</permission>
                        <permission
                            tag="span"
                            class="operate"
                            @click="update_token(row)"
                            :route="apis.url_get_token">更新token</permission>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=lazadaList.page
                :page-sizes="[20,50,100,200,500]"
                :page-size=lazadaList.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=lazadaList.total>
            </el-pagination>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .p-lazada-table{
        .el-table__body-wrapper {
            overflow-x hidden
        }
    }
    .sucStatus{
        color:#339907
    }
    .loseStatus{
        color:#ff0000;
    }
    .succeed{
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3468px;
    }
    .default{
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3490px;
    }
    .succeed_sync{
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1325px;
    }
    .default_sync{
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1351px;
    }
</style>
<script>
    import {
    	api_lazada_account_states,
        url_get_lazada_account,
        url_lazada_account_edit,
        url_lazada_authorization,
        url_get_token,
        api_get_token} from '../../../../api/lazada';
	export default{
		permission:{
            url_get_lazada_account,
            url_lazada_account_edit,
            url_lazada_authorization,
            url_get_token,
        },
        data(){
			return {
                status:["启用","停用"],
            }
		},
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select);
            },
            changStatus(row){//-----------------------修改启用或禁用事件
                let statusTitle = row.status ? '停用' : '启用';
                this.$confirm('您将'+statusTitle+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let status = row.status ? 1 : 0;
                    let params = {
                        id:row.id,
                        status:status
                    };
                    this.$http(api_lazada_account_states,params).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+statusTitle
                    });
                    row.status = !row.status
                });
            },
            update_token(row){
                this.$http(api_get_token,row.id).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            sort_change(val){//-----------------------表格排序
                this.$emit("sort-change",val);
            },
            lookOver(row){//-----------------------查看
                this.$emit('look-over',row);
            },
            edit(row){//-----------------------编辑
            	this.$emit('edit',row);
            },
            add_member(row){//-----------------------授权
                this.$emit('add-member',row);
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },

        },
        filters: {
            filterStatus(value){
                return parseInt(value) ? '有效' : '失效';
            },
            filterAuthor(val){
                switch (val) {
                    case 0:
                        return '未授权';
                    case 1:
                        return '已授权';
                }
            },
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd', val);
                } else {
                    return "--";
                }
            },
        },
        props:{
            lazadaList:{
                required:true,
                type:Object
            },
            loading:{
                required:true,
                type:Boolean
            },
        },
		components: {
            uiTip:require('../../../../components/ui-tip.vue').default
        }
	}
</script>
