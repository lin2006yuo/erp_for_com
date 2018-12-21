<template>
    <page-dialog size="large" v-model="show" title="异常任务列表">
        <el-table :data="expTasks">
            <el-table-column label="任务路径" prop="path">
            </el-table-column>
            <el-table-column label="异常信息" prop="expinfo">
            </el-table-column>
        </el-table>
        <span slot="footer">
            <el-button @click.native="show = false" type="danger">已知晓</el-button>
        </span>
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
            expTasks:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>