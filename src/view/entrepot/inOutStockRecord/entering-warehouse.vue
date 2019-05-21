<template>
    <el-row class="p-enteringWarehouse">
        <page-dialog v-model="addDialog" title="添加入库">
            <span>XXXXXX</span>
            <span slot="footer">
                <el-button size="mini" type="primary" @click.native="confirm">确定</el-button>
                <el-button size="mini" type="danger" @click.native="cancel">取消</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
import pageDialog from '../../../components/page-dialog.vue'
    export default{
        data(){
            return {
                addDialog:false,
            }
        },
        mounted(){
            this.addDialog=this.value;
        },
        methods:{
            confirm(){
                this.addDialog=false;
            },
            cancel(){
                this.addDialog=false;
            }
        },
        watch:{
            addDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.addDialog=val;
            }
        },
        props:{
            value:{}
        },
        components: {
            pageDialog
        }
    }
</script>