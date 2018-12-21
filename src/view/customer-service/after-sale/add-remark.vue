<template>
    <page-dialog title="返回修改" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="remarkData" ref="remarkData" label-width="100px">
            <el-form-item label="备注：">
                <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        v-model="remarkData.remark" style="width: 360px;">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
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
            cloce(){
            
            },
            keep(){
            	this.$emit('keep');
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
            remarkData:{
                required:true,
                type:Object
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>