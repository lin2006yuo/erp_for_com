<template>
    <div>
        <page-dialog v-model="show" size="small" class="export-dialog" title="" :close-on-click-modal="false">
            <div>添加导出任务成功</div>
            <div>
                <span>请到</span>
                <el-button size="mini" type="text" @click="look_export">
                    报表导出管理
                </el-button>
                <span>处下载EXCEL</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="show = false" size="mini">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .export-dialog{
        text-align: center;
        font-size: 20px;
    }
</style>
<script>
    export default {
        data(){
            return {
                show:false
            }
        },
        mounted(){
        },
        methods: {
            look_export(){
                this.$open('/report/export-files');
            }
        },
        computed: {},
        watch: {
            show(val){
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        props: {
            value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default
        },
    }
</script>
