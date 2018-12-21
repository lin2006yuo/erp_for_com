<template>
    <div>
        <el-row class="mt-xs mb-xs">
            <el-button type="primary"
                       :disabled="disabled"
                       @click.native="update_version">更新客户端版本
            </el-button>
        </el-row>
        <el-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :data="tableData.data"
                  ref="tableData"
                  border
                  align="center"
                  v-resize="{height:41}"
                  @selection-change="selection_change"
                  highlight-current-row>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    width="60"
                    label="NO."
                    prop="id">
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="服务器名"
                    prop="name">
            </el-table-column>
            <el-table-column
                    label="软件类型"
                    prop="software_type">
            </el-table-column>
            <el-table-column
                    label="客户端版本"
                    prop="version">
            </el-table-column>
            <el-table-column
                    label="是否升级"
                    inline-template>
                <div>
                    <el-switch v-model="row.status"
                               on-text="是"
                               off-text="否"
                               :on-value="0"
                               :off-value="1"
                               @change="change_status(row,$event)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    width="150"
                    label="最新升级时间"
                    inline-template>
                <div>{{row.upgrade_time|fmsdatetime}}</div>
            </el-table-column>
        </el-table>
        <el-pagination class="page-fixed"
                       @size-change="$emit('size',$event)"
                       @current-change="$emit('page',$event)"
                       :current-page="tableData.page"
                       :page-sizes="[20, 50,100, 200, 500]"
                       :page-size="tableData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.count">
        </el-pagination>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import {api_update_server_version,api_update_software_status} from '@/api/server-software'
    export default {
        name: "table-list",
        data() {
            return {
                selectData:[]
            }
        },
        computed:{
            disabled(){
                return !this.selectData.length||!!this.selectData.filter(row=>row.status).length;
            }
        },
        methods: {
            update_version(){
                let ids=this.selectData.map(row=>row.id);
                this.$http(api_update_server_version,{ids:ids}).then(res=>{
                    this.$message({type:'success', message:res.message||res});
                    this.$emit('refresh');
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            selection_change(selection){
                this.selectData=[];
                this.$nextTick(_=>{
                    this.selectData=selection;
                });
            },
            change_status(row,status){
                this.$confirm(`您将${status?'停用':'升级'}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_update_software_status,row.id,{status:status}).then(res=>{
                        this.$set(row,'status',status);
                        this.$message({type:'success',message:res.message||res});
                        this.$emit('refresh');
                    }).catch( error=>{
                        this.$set(row,'status',status?0:1);
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消${status?'停用':'升级'}`});
                    this.$set(row,'status',status?0:1);
                });
            }
        },
        props: {
            tableData:{
                type:Object,
            },
            loading:false,
        },
    }
</script>

