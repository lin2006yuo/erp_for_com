<template>
    <el-row class="c-product-img">
        <card label="图片上传">
            <div v-for="items in imgData">
                <label>{{items.name}}</label>
                <ul style="min-height:110px">
                    <li class="li-other">
                        <image-upload :item="items" :thumbnail-mode="true" :image="{width:'100px',height:'100px'}" :init="items.images" :edit="!imgEdit"></image-upload>
                    </li>
                </ul>
            </div>
        </card>
        <el-row>
            <el-col :span="18" style="margin-left:60px">
                <div v-if="imgEdit">
                    <el-button type="primary" size="mini" @click.native="save">确定</el-button>
                    <el-button  size="mini" @click.native="cancel">取消</el-button>
                </div>
                <el-button v-else type="primary" size="mini" @click.native="edit">编辑</el-button>
            </el-col>
        </el-row>
    </el-row>
</template>
<style lang="stylus">
    .c-product-img{
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
            margin: 5px;
            vertical-align: middle;
        }

    }

</style>
<script>
    import card from '../../../components/card.vue'
    import imageUpload from "../../product/manager/img-upload.vue"
    export default{
        data(){
            return{}
        },
        created(){

        },
        methods:{
            save(){
                this.$emit("save")
            },
            edit(){
                this.$emit("edit")
            },
            cancel(){
//                this.$emit("cancel")
                console.log(this.imgData)
            },

        },
        props:{
            imgData:{
                required:true,
                type:Array
            },
            imgEdit:{
                required:true,
                type:Boolean
            },

        },
        components:{
            card,
            imageUpload
        }
    }
</script>
