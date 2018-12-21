<template>
    <div class="c-remark-dialog">
        <page-dialog title="提示" v-model="dialog" @open="open"
                     size='small' :close-on-click-modal="false">
            <div class="el-message-box__content">
                <div class="el-message-box__status el-icon-warning"></div>
                <div style="margin-left:50px">{{tipsTitle}}</div>
            </div>
            <div style="padding:0 25px">
                <el-input type="textarea" v-model="remark"  :rows="4" placeholder="请填写备注后点击确定...."></el-input>
            </div>
            <div slot="footer">
                <request-button req-key="remarkDialogKey" class="inline" @click="submit">确定</request-button>
                <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
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
                remark:"",
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            open(){
                this.remark = "";
            },
            submit(){
                if(!this.remark){
                    this.$message({
                        message: '备注不能为空，请填写备注！',
                        type: 'warning'
                    });
                    return this.$reqKey('remarkDialogKey',false)
                }
                this.dialog = false;
                this.$emit("submit",this.remark);
            },
        },
        props:{
            value:{},
//            handleId:{},
            tipsTitle:{
                required:true,
                type:String,
            }
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
        }
    }
</script>
