<template>
    <div class="c-blowup-image">
        <page-dialog v-model="dialog" size="small" :title="title"
                     @open="open" @close="close"
                     class="image-container" :close-on-click-modal="isClose">
            <i class="pre-pic" v-if="showController" @click="pre_pic">
                <i class="el-icon-arrow-left pd-10" v-show="canLeft"></i>
            </i>
            <i class="next-pic" v-if="showController" @click="next_pic">
                <i class="el-icon-arrow-right pd-10" v-show="canRight"></i>
            </i>
            <img :src="image" alt="暂无图片" width="100%" height="100%">
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>
    .image-container{
        position: relative;
        .pre-pic,.next-pic{
            position: absolute;
            font-size:30px;
            background: #fafbfc;
            top: 47%;
            cursor: pointer;
            display:inline-block;
            visibility:hidden;
            :hover{
                background: #ccc;
                color:#fff;
            }

        }
        .pre-pic{
            left: 20px;
        }
        .next-pic{
            right: 20px;
        }
        .pd-10{
            padding:10px;
        }
        :hover{
            .pre-pic,.next-pic{
                visibility:visible;
            }
        }
    }
</style>
<script>
    import {get_path} from '../view/kandeng/ebay/kandeng-list/add-edit-listing/get-path';
    export default {
        data() {
            return {
                dialog:false,
                image:'',
                newIndex:'',
            }
        },
        methods:{
            get_path,
            open(){
                if(!this.imgArr.length){
                    this.image = this.imgPath;
                }else{
                    this.newIndex = this.imgArr.findIndex(row=>{
                        return row.path === this.imgPath;
                    });
                }
            },
            close(){
                this.newIndex = '';
            },
            pre_pic(){
                if(this.newIndex > 0){
                    this.newIndex -=1;
                }
            },
            next_pic(){
                if(this.newIndex < this.imgArr.length-1){
                    this.newIndex +=1;
                }
            },
        },
        computed:{
            showController(){
            	return this.imgArr.length > 0;
            },
            canLeft(){
            	return this.newIndex > 0;
            },
            canRight(){
            	return this.newIndex < this.imgArr.length-1;
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
            newIndex(new_){
            	let img;
            	if(img = (new_ !==''&&this.imgArr[new_].path)){
            		if(img.includes('http')){
                        this.image = img;
                    }else{
                        this.image = this.get_path(img,this.bigPicSize,this.baseUrl||this.imgArr[new_].base_url);
                    }
                }
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
            },
            imgArr:{
            	default (){
            		return []
                }
            },
            baseUrl:{
            	type:String
            },
            bigPicSize:{
                type:String,
                default(){
                    return '_500x500.'
                }
            },
            isClose:{
                type:Boolean,
                default(){
                    return false;
    }
            }
        },
        components: {
            pageDialog:require("../components/page-dialog.vue").default,
        }
    }
</script>
