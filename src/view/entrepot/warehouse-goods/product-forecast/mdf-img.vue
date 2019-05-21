<template>
    <div class="c-mdf-img">
        <page-dialog @open="open" title="修改图片" v-model="dialog" size="small" :close-on-click-modal="false" width="702px">
            <img-add v-model="imgForm.path"
                     :cur-sku="curSku"
                     class="mt-xs"
                     :img-length="imgLength"
                     :can-add-img="showAddIcon"
                     :img-number="imgNumber"
                     :show-random-btn="false"
                     :id="goodsId"
                     :default-random="false"
                     :show-big-pic="true"
                     :base-url="baseUrl"
                     :show-swatch-img="false"></img-add>
            <div class="ml-sm mt-sm red" v-if="showTips">注意：最多添加12张图片，第一张图片免费，其后每张可能需要收费</div>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="save">确定</el-button>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>
</style>
<script>
    export default {
        data() {
            return {
//                baseUrl:"",
                dialog:this.value,
                addDialog:false,
                multiple:false,
                oldImage:[]
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
        computed:{
            showAddIcon(){
                let cur = true;
                if(!!this.imgLength){
                    if(this.imgForm.path){
                        cur = this.imgForm.path.length<this.imgLength?true:false
                    }
                }
                return cur;
            }
        },
        methods:{
            open(){
                this.oldImage = clone(this.imgForm.path);
            },
            save(){
                this.$emit("mdfimg-submit",this.imgForm);
                this.dialog = false;
            },
            cancel(){
                this.dialog = false;
                this.imgForm.path = [];
                this.imgForm.path = clone(this.oldImage);
            },

        },
        props:{
            value:{},
            curSku:{
                type:String,
            },
            imgForm:{
                required:true,
                type:Object
            },
            goodsId:{
                required:true,
                type:[String,Number]
            },
            baseUrl:{
                required:true,
                type:String
            },
            showTips:{
                type:Boolean,
                default(){
                    return true
                },
            },
            imgLength:{
                type:Number,
                default(){
                    return 0;
                },
            },
            imgNumber:{
                type:Number,
                default(){
                    return 9;
                },
            },
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            imgAdd:require('@/components/img-add.vue').default,
        }
    }
</script>
