<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="historyData"
                border
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中">
            <el-table-column label="code" inline-template>
                <div>
                    <ui-tip :content="row.code"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="软件名" inline-template>
                <div>
                    <ui-tip :content="row.software_name"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column width="90" label="客户端版本" inline-template>
                <div>
                    <ui-tip :content="row.version" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="运行环境" inline-template>
                <div>
                    <span>{{row.run_environment}}</span>
                </div>
            </el-table-column>
            <el-table-column label="更新地址" inline-template>
                <div>
                    <ui-tip :content="row.upgrade_address" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="备注" inline-template>
                <div>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="md5" inline-template>
                <div>
                    <ui-tip :content="row.md5" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column width="80" label="状态" inline-template>
                <div>
                    <ui-tip :content="row.status | statusFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="添加人" width="90">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{scope.row.department_name}}</p>

                        <div slot="reference">
                            <div>{{scope.row.creator_txt}}</div>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column width="100" label="添加|时间" inline-template>
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            open(){
            
            },
            close(){
            
            },
            keep(){
            	
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        filters: {
            statusFilter(val) {
                return val === 1 ? '停用' : '启用';
            },
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd', val);
                } else {
                    return "--";
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            historyData:{},
            title:{},
            loading:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>