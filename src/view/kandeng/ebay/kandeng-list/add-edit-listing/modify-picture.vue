<template>
    <div>
        <page-dialog title="已选中图片" v-model="visible" size="large" :close-on-click-modal="false" class="receive-search">
            <el-popover
                    v-model="webUrl"
                    placement="top"
                    trigger="click">
                <div>
                    <label>图片地址：</label>
                    <el-input v-model="imgUrl" placeholder="多个地址以 | 隔开" class="inline" style='width:300px;'></el-input>
                    <el-button type="primary" size="mini" @click="add_url">确定</el-button>
                </div>
                <span slot="reference" >
                    <el-button type="primary" size="mini">添加网络图片</el-button>
                </span>
            </el-popover>
            <image-upload @select-img="select_img" :images="images"></image-upload>
            <div slot="footer" class="dialog-footer mt-md">
                <el-button @click.native="sure" type="primary" size="mini">确认</el-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_wish_image,api_wish_image_web} from "../../../../../api/kandeng";
    import {api_aliexpress_image } from "../../../../../api/publish-smt";
    export default {
        data(){
            return {
                visible:false,
                dialogImageUrl: '',
                dialogVisible: false,
                webUrl:false,
                imgUrl:"",
                formData:{
                    thumb:[]
                },
                images:[]
            }
        },
        mounted(){
        },
        methods: {
            sure(){
                this.visible = false;
                this.$emit("submit-mdf",this.formData.thumb);
            },
            select_img(val){
                this.formData.thumb = val.map(res => {
                    return res.image
                });
            },
            //获取图片列表
            get_pic(){
                this.allpic=[];
                this.$http(api_aliexpress_image,{goods_id:Number(this.id)}).then(res=>{
                    this.allpic=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //添加网络图片
            add_url(){
                this.$http(api_wish_image_web,{id:Number(this.id),images:this.imgUrl}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.get_pic();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
                if(val){
                    this.get_pic();
                }
            }
        },
        props: {
            value:{},

        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            imageUpload:require('./img-upload.vue').default
        },
    }
</script>
