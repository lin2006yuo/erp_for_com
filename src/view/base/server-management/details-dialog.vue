<template>
    <page-dialog :title="`查看服务器：${curName}被引用详情`"
                 size="large"
                 v-model="visible"
                 @open="open"
                 :close-on-click-modal="false">
        <el-table :data="detailsData"
                  class="scroll-bar mt-sm"
                  highlightCurrentRow
                  v-resize={height:41}>
            <el-table-column label="平台" prop="channel"></el-table-column>
            <el-table-column label="站点" prop="site_code"></el-table-column>
            <el-table-column label="账号简称" prop="account_code"></el-table-column>
            <el-table-column label="公司名称" prop="company"></el-table-column>
        </el-table>
    </page-dialog>
</template>

<style scoped lang="stylus">

</style>

<script>
    export default {
        data(){
            return{
                visible: false
            }
        },
        methods:{
            open(){

            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            detailsData:{},
            curName:{}
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default
        },
    }
</script>