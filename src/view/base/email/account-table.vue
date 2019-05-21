<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-table :data="accountData"
                  class="scroll-bar mt-sm"
                  highlightCurrentRow
                  v-resize={height:0}>
            <el-table-column label="平台" prop="channel_name"></el-table-column>
            <el-table-column label="站点" prop="site_code"></el-table-column>
            <el-table-column label="账号简称" prop="account_code"></el-table-column>
            <el-table-column label="公司名称" prop="company_name"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show=false">关 闭</el-button>
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
        props:{
            value:{
                required:true,
                type:Boolean
            },
            accountData:{
                required:true,
                type:Array
            },
            title:{}
        },
        components:{}
    }
</script>