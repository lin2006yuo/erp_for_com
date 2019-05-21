<template>
    <div class="p-prolong-dialog">
        <page-dialog v-model="show" size="small" :title="title" :min-height="200" :close-on-click-modal="isClose">
            <div class="p-prolong-time">
                <span>延长买家收货确认时间：
                    <input type="number" class="input-diff_code s-width-mini" v-model="prolongTime"
                           onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                           onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                           max="30" min="1">
                    天
                </span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" class="mr-sm" type="primary" @click.native="updateTime">确认</el-button>
                <el-button size="mini" class="mr-sm" @click.native="show=false">关闭</el-button>
            </div>
        </page-dialog>
        <div style="position:fixed;left:0;top:0;right:0;bottom:0;background:#000;opacity:.4;z-index:999" v-if="false"></div>
    </div>
</template>
<style lang="stylus">
    .p-prolong-dialog {
        .input-diff_code{
            box-sizing: border-box;
            border: 1px solid #C0CCDA;
            border-radius: 3px;
            height: 26px;
            display: inline !important;
            position: relative;
            top: -1px;
            padding: 3px;
        }
        .p-prolong-time{
            text-align center;
            line-height 101px;
        }
    }
</style>

<script>
    export default {
        data(){
            return {
                show:this.value,
                prolongTime:1
            }
        },
        methods:{
            updateTime(){
                if(this.prolongTime < 1){
                    this.$message({type:'warning',message:'延长时间不能小于1天'});
                    return
                }
                if(this.prolongTime > 30){
                    this.$message({type:'warning',message:'延长时间不能超过30天'});
                    return
                }
                this.$emit('update-time',this.prolongTime);
                this.show = false;
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input',val);
            },
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
            isClose:{
                type:Boolean,
                default(){
                    return false;
                }
            },
        },
        components:{
            pageDialog:require("../../../components/page-dialog.vue").default,
        }
    }
</script>

