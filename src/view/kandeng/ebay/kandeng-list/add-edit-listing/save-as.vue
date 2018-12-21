<template>
    <div class="c-save-as">
        <page-dialog title="保存为新模板" v-model="dialog" size="small" :close-on-click-modal="false">
            <el-input v-model="data"></el-input>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    export default{
        data(){
            return {
                dialog:this.value,
                data:"",
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
                if(val){
                    this.data = '';
                }
            },
        },
        methods:{
            submit(){
                this.$emit("submit",this.data);
            },
            cancel(){
                this.dialog = false;
            },
        },
        props:{
            value:{},
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>