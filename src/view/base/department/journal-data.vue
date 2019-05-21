<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @close="close" :close-on-cilck-modal="false">
        <div class="card">
            <el-table
                    highlight-current-row
                    class="scroll-bar mb-sm"
                    :data="lists"
                    max-height="550"
                    border>
                <el-table-column
                        align="center"
                        label="操作时间"
                        width="150" inline-template>
                    <div>{{row.create_time | timeFilter}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        align="center"
                        width="120"
                        label="操作人">
                        <el-popover trigger="hover" placement="right">
                            <div>{{row.department_name}}</div>
                            <span slot="reference" class="name-wrapper">
                                <div>{{row.operator}}</div>
                            </span>
                        </el-popover>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="remark"
                        label="操作内容">
                </el-table-column>
            </el-table>
        </div>
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
            timeFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
                type:String
            },
            lists:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
