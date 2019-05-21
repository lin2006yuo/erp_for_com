<template>
    <page-dialog size="small" v-model="dialog" :close-on-click-modal="false" :title="title">
        <div>
            <el-row>添加导出任务成功</el-row>
            <el-row>请到<a>报表导出管理</a>处下载EXCEL</el-row>
        </div>
        <div slot="footer">
            <el-button @click="close">关闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialog: this.value
            }
        },
        methods: {
            close() {
                this.dialog=false
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog=val;
            }
        },
        props:{
            title:{
                type:String
            },
            infoList:{
                type:Array
            },
            value:{},
        },
        components:{ pageDialog:require('@/components/page-dialog.vue').default,}
    }
</script>

<style scoped>

</style>