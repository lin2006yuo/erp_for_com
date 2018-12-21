<template>
    <div class="c-blowup-image">
        <page-dialog v-model="dialog" size="small" :title="title">
            <img :src="imgPath" alt="暂无图片" width="100%" height="100%">
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default {
        data() {
            return {
                dialog:false
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{},
            imgPath:{
                required:true,
                type:String
            },
            title:{
                required:true,
                type:String
            }
        },
        components: {
            pageDialog:require("../../../../../components/page-dialog.vue").default,
        }
    }
</script>