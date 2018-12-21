<template>
    <div class="c-mdf-img">
        <page-dialog @open="open" title="修改图片" v-model="dialog" size="small" :close-on-click-modal="false" width="702px">
            <img-add v-model="imgForm.path"
                     @save-meitu="save_meitu(imgForm.path,$event)"
                     :channel-id="channelId"
                     :cur-sku="curSku"
                     class="mt-sm"
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
                <el-button type="danger" size="mini" class="inline" @click.native="clear_all">清空图片</el-button>
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
                curGoodId:"",
                multiple:false,
                isAdd:true,
                mdfRow:{},
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
            save_meitu(imageList,obj){
                console.log(imageList[obj.curIndex],'imageList[obj.curIndex]');
                if(imageList[obj.curIndex])imageList[obj.curIndex].path = obj.newPath;
            },
            clear_all(){
                this.$confirm(`此操作将删除当前所有图片，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.imgForm.path = [];
                    this.$emit("mdfimg-submit",this.imgForm);
                })
            },
            open(){
                this.oldImage = clone(this.imgForm.path);
            },
            change_image(val){
                this.addDialog = true;
                this.multiple=false;
                this.isAdd = false;
                this.mdfRow = val;
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
            /*图片数据源
            * */
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
            /*用于img-add组件中的美图，保存修改后的图片时，需要channel_id
            *不传的情况保存图片不成功
            * */
            channelId:{
                type:Number,
            }
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            imgAdd:require('../../../components/img-add.vue').default,
        }
    }
</script>
