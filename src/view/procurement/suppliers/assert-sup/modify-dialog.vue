<template>
    <div class="c-batch-remark">
        <page-dialog :title="`修改采购员`" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
            <el-row class="mt-sm" style="text-align: center;" v-if="form.type===2">
                <label-item label="原采购员：">
                    <purchaser class="inline s-width-default"
                               v-model="form.old_purchaser_id" style="width: 178px"></purchaser>
                </label-item>
            </el-row>
            <el-row class="mt-sm" style="text-align: center;">
                <label-item :label="form.type===2?`新采购员：`:`修改采购员为：`">
                    <purchaser class="inline s-width-default"
                               v-model="form.purchaser_id " style="width: 178px"></purchaser>
                </label-item>
            </el-row>
            <el-row class="mt-mini" style="text-align: center;">
                <el-checkbox v-model="form.is_sync">{{form.type===2?`同步更新原采购员负责的SKU`:`同步更新供应商的SKU`}}</el-checkbox>
            </el-row>
            <div slot="footer">
                <el-button type="primary"
                           size="mini"
                           @click.native="submit"
                           class="inline">{{form.type===2?`替换`:`确定`}}</el-button>
                <el-button size="mini"
                           @click.native="dialog = false"
                           class="inline">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                dialog:this.value
            }
        },
        methods:{
            open(){
                this.notes = '';
            },
            submit(){
                if(this.form.type===2){
                    if(!this.form.old_purchaser_id) {
                        return this.$message({type: "warning", message: '请选择原采购员！'});
                    }
                    if(!this.form.purchaser_id) {
                        return this.$message({type: "warning", message: '请选择新采购员！'});
                    }
                    if(this.form.purchaser_id===this.form.old_purchaser_id){
                        this.dialog = false;
                        return this.$message({type: "warning", message: '原采购员与新采购员一致！'});
                    }
                }else{
                    if(!this.form.purchaser_id) {
                        return this.$message({type: "warning", message: '请选择采购员！'});
                    }
                }
                this.$emit('submit');
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            form:{
                required:true,
                type:Object
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item').default,
            purchaser:require('@/api-components/purchaser').default,
        }
    }
</script>
