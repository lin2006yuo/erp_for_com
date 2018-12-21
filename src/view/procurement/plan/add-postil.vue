<template>
    <div class="c-batch-remark">
        <page-dialog :title="title" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
            <el-input v-model="postilRow.postil"
                      type="textarea"
                      :maxlength="200"
                      :autosize="{ minRows: 6, maxRows: 10}"
                      placeholder="请填写批注..."
                      ></el-input>
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
                dialog:this.value,
            }
        },
        methods:{
            open(){},
            submit(){
                this.$emit('add-postil');
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
            value:{},
            title:{},
            postilRow:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>
