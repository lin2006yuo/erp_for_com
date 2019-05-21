<template>
    <page class="p-forbidden">
        <page-dialog  v-model="show" size="small" title="违规词检测">
            <el-table
                    class="scroll-bar"
                    :data="forbiddenData"
                    style="width: 100%">
                <el-table-column
                        prop="account_code"
                        label="检测内容">
                </el-table-column>
                <el-table-column
                        prop="position"
                        label="检测内容"
                        >
                </el-table-column>
                <el-table-column
                        prop="reason"
                        label="违禁词"
                        >
                </el-table-column>
                <el-table-column
                        prop="word"
                        label="违禁类型">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="show=false" >关   闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    export default{
        data(){
            return {
                show:false
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {},
        methods: {},
        filters: {},
        watch: {
            show(val){this.$emit("input",val)},
            value(val){this.show=val;}
        },
        props: {
            value:{},
            forbiddenData:{
                required:true,
                type:Array
            },
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue")
        }
    }
</script>