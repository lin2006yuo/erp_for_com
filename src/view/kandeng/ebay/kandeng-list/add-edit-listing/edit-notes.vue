<template>
    <div class="c-edit-notes">
        <page-dialog v-model="dialog" title="批量修改Notes" size="small">
            <el-input v-model="notes"></el-input>
            <div slot="footer">
                <el-button type="primary"
                           size="mini"
                           @click.native="submit"
                           class="inline">确定</el-button>
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
                dialog:false,
                notes:''
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            submit(){
                if(!this.notes) return;
                this.dialog = false;
                this.$emit('submit',this.notes);
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