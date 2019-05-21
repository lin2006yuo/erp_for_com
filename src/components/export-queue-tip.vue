<template>
    <div class="c-export-queue-tip">
        <page-dialog v-model="dialog" size="small" title=""
                     :close-on-click-modal="false">
            <div class="tip-content">
                <div>添加导出任务成功</div>
                <div>请到 <span class="operate" @click="jump_export_files">报表导出管理</span>处下载EXCEL</div>
            </div>
            <div slot="footer">
                <el-button class="inline" size="mini" @click.native="dialog = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .tip-content{
        text-align: center;
        margin-top: 20px;
        line-height: 30px;
    }
</style>
<script>
    export default {
        data() {
            return {
                dialog:this.value
            }
        },
        methods:{
            jump_export_files(){
                this.dialog = false;
                this.$open('/report/export-files');
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
        },
        components: {
            pageDialog:require('./page-dialog.vue').default,
        }
    }
</script>