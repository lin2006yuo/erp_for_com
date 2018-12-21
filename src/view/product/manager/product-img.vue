<template>
    <el-row class="c-product-img">
            <el-row v-if="!editAble&&!isShow&&!isAdd&&status!==3" class="mb-sm" style="display: flex ;flex-direction: row">
                <label style="line-height: 26px">抓取图片地址：</label>
                <el-input v-model="path" placeholder="请输入地址"  class="inline" style="flex: 1"></el-input>
                <request-button   size="mini"   type="primary"  class="inline ml-sm"  :request="down_img">自动抓取图片</request-button>
            </el-row>
            <div v-for="items in imgData">
                <label class="label">{{items.name}}</label>
                <ul style="min-height:110px;border: 1px solid #ffcf73;max-width: 950px;margin: 0 auto">
                    <li class="li-other"> <image-upload :item="items" :thumbnail-mode="true"   :image="{width:'100px',height:'100px'}"  :init="items.images"  :edit="editAble"> </image-upload> </li>
                </ul>
            </div>
        <div style="margin:10px 0  0 30px"  v-if="!isAdd">
            <el-button size="mini" v-show="!editAble&&!isShow"  type="primary"    @click="keep_">保 存</el-button>
            <!--<el-button   size="mini" v-show="!editAble&&!isShow"   @click="cancel_">取  消</el-button>-->
            <el-button   size="mini" v-show="!editAble&&isShow"  type="primary"    @click="edit_more">编   辑</el-button>
        </div>
    </el-row>
</template>
<style lang="stylus" scoped>
    .c-product-img{
        .label{
            text-align: left;
            display: block;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .li-style{
            height:100px;
            display: inline-block;
            width:100px;
            border:none;
            margin: 5px;
            vertical-align: middle;
        }
        .li-other{
            min-height:100px;
            display: inline-block;
            border:none;
            margin: 5px 0 5px 5px;
            vertical-align: middle;
        }

    }

</style>
<script>
    import card from '../../../components/card.vue'
    import imageUpload from "./img-upload.vue"
        import {api_update_img,api_server_img,api_server_path} from "../../../api/product-library"
    export default{
        data(){
            return{
                path:'',
                status:1,
            }
        },
        created(){
            !this.editAble&&this.get_path()
        },
        methods:{
            get_path(){
                this.$http(api_server_path,{id:this.id}).then(res=>{
                    this.status=res.status;
                    this.path=res.path||'';
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            down_img(){
                return this.$http(api_server_img,{goods_id:this.id,path:this.path}).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                });
                return Promise.resolve();
            },
            keep_(){
                this.$emit("keep")
            },
            edit_more(){
                this.$emit("more")
            },
            cancel_(){
                this.$emit("cancel")
            },

        },
        watch:{
            editAble(val){
                if(!val){
                    this.get_path()
                }
            }
        },
        props:{
            imgData:{
//                    required:true,
                type:Array
            },
            editAble:{
                required:true,
                type:Boolean
            },
            isShow:{
                default(){
                    return false;
                }
            },
            id:{},
            isAdd:{
                default(){
                    return false;
                }
            }

        },
        components:{
            card,
            imageUpload,
            requestButton:require('@/global-components/request-button.vue').default,
        }
    }
</script>
