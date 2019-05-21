<template>
    <div class="c-show-template">
        <page-dialog title="Invoice模板示例" v-model="dialog"
                     @open="open"
                     size="full" :close-on-click-modal="false">
            <el-checkbox label="显示布局注释" v-model="showDetail"></el-checkbox>
            <div class="t-center" v-resize="{height:120}" style="overflow-y:auto">
                <img src="./tongtoolwithlabel.jpg" v-if="showDetail">
                <img src="./enmodel.jpg" v-if="!showDetail && templateId === 1">
                <img src="./tongtool.jpg" v-if="!showDetail && templateId === 2">
            </div>
            <div slot="footer">
                <el-button size="mini" @click.native="close">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {
                dialog:this.value,
                showDetail:false,
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.dialog = val;

            },
            showDetail(val){
                console.log(val);
            }
        },
        methods:{
            close(){
                this.dialog = false;
            },
            open(){
                this.showDetail = false;
            },
        },
        props:{
            value:{},
            templateId:{}
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default
        }
    }
</script>