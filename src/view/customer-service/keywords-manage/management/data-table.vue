<template>
    <el-table :data="tableData"
              v-loading="loading"
              v-resize="{height:41}"
              element-loading-text="玩命加载中..."
              highlight-current-row>
        <div slot="empty" class="no-data-reminder">
            <i></i>
            {{emptyText}}
        </div>
        <el-table-column prop="id" label="NO.">

        </el-table-column>
        <el-table-column prop="keyword" label="关键词">

        </el-table-column>
        <el-table-column prop="channels" label="适用平台">

        </el-table-column>
        <el-table-column prop="type_name" label="类型">

        </el-table-column>

        <el-table-column prop="status" label="状态" inline-template>
            <el-switch v-model="row.status"
                       on-text="启用"
                       off-text="停用"
                       :on-value="1"
                       :off-value="0"
                       @change="change_status(row,$event)">
            </el-switch>
        </el-table-column>
        <el-table-column label="更新人" inline-template>
            <div>
                <el-popover :content="row.department" placement="right" trigger="hover">
                    <span slot="reference">{{row.create_name}}</span>
                </el-popover>
            </div>
        </el-table-column>
        <el-table-column label="更新时间" inline-template>
            <span>{{row.create_time | timeFilter}}</span>
        </el-table-column>
        <el-table-column label="操作" inline-template>
            <template>
                <span class="operate" @click="view(row)">查看</span>
                |&nbsp;<span class="operate" @click="del(row)">删除</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<style lang="">
</style>

<script>
    import {
        api_keywords_manage_status,
    } from'../../.././../api/keywords-manage';

    export default {
        data(){
            return{}
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        methods:{
            view(row){
                let data={row:row,type:'view'};
                this.$emit('get-form',data)
            },
            del(row){
                let data={row:row,type:'del'};
                this.$emit('get-form',data)
            },
            change_status(row, status){
                this.$confirm(`您将${status? '启用' : '停用'}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    this.$http(api_keywords_manage_status,{status:status, id: row.id}).then(res=>{
                        this.$set(row,'status',status);
                        this.$emit('statusDelete', row);
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error=>{
                        this.$set(row,'status',status?0:1);
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: `已取消${status?'启用':'停用'}`});
                    this.$set(row,'status',status?0:1);
                });
            }
        },
        filters: {
            timeFilter(val) {
                return val >0 ? datef('YYYY-MM-dd HH: mm: ss', val) : '- -';
            },
        },
        props:{
            tableData:{},
            loading: {required: true, type: Boolean},
            firstLoading: {required: true, type: Boolean},
        }
    }
</script>
