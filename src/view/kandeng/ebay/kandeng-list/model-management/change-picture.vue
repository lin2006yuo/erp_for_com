<template>
    <div class="p-images-box">
        <div style="position: relative">
            <drag-drop tag="ul" class="image-thums im" v-model="imgs">
                <li v-for="(image, index) in imgs"
                    :key="`${index}`"
                    class="image border-n"
                >
                    <img v-lazy="operate_img(image)">
                    <div class="tool">
                        <span class="btn">
                             <i class="el-icon-delete" @click.stop="remove(index)"></i>
                        </span>
                        <span class="btn">
                            <i class="el-icon-edit" @click.stop="mdf_img(index)"></i>
                        </span>
                        <!--<span class="btn">-->
                            <!--<i class="el-icon-search" @click.stop="search_img(image.path)"></i>-->
                        <!--</span>-->
                    </div>
                </li>
                <li class="image add-button border-n"
                    @click="add" v-if="canAddImg">
                    <i class="el-icon-plus"></i>
                </li>
            </drag-drop>
            <select-img v-model="selectVisible"
                        :channel-id="channelId"
                        :spu="spu"
                        :account="account"
                        :id="id"
                        @add="addImg"
                        @call-back="call_back"
                        @move-drap="move_drap"
                        @handle-change="handleChange"
                        :edit-img="editImg"></select-img>
            <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
    .checkbox{
        position: absolute;
        top: 0;
        right: 0;
    }
    .isMasterMap{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 30%;
        background-color: rgba(255, 15, 7, 0.8);
        text-align: center;
        span{
            color:#fff;
        }
    }
    .image:first-child .isMasterMap{
        display: block;
    }
    .p-images-box{
        overflow: hidden;
        .uploadall{
            position: absolute;
            left:0;
            bottom:0;
            right:0;
            height:32px;
            line-height:32px;
            &:hover{
                background-color: rgba(0, 0, 0, 0.72);
                color: #fff;
            }
        }
        position: relative;
        .image-thums.im{
            border:none;
            display: inline-block;
            position: relative;
            margin:10px 10px 5px 10px;
        }
        .img-index{
            position: absolute;
            width: 5px;
            height: 100px;
            background: #ff4d51;
        }
        .image:hover{
            .tool{
                display: block;
            }
        }
        .image{
            vertical-align: middle;
            border: 1px solid #ddd;
            display: inline-block;
            position: relative;
            height:100px;
            width:100px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            img{
                width:100%;
                height:100%;
            }
            .tool{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 30%;
                background-color: rgba(0, 0, 0, 0.6);
                text-align: center;
                display:none;
                .btn{
                    display: inline-block;
                    color: #fff;
                    font-size: 1.2rem;
                    cursor: pointer;
                    vertical-align: middle;
                    transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms, opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
                    margin-top: 1%;
                    width: 10px;
                    border: 0;
                }
                .btn .i{
                    color: #fff;
                    display: block;
                    font-size: 25px;
                    line-height: inherit;
                    margin: 0 auto 5px;
                }
                .btn:hover{
                    transform: translateY(-2px);
                }
                .image-status{
                    border-radius: 50%;
                    border:2px solid gainsboro;
                    color: #fff;
                    position: absolute;
                    right: 0;
                    top:0;
                    padding: 2px;
                }
            }
        }
        .border-n{
            margin: 0 5px 5px 0;
        }
        .img-line{
            border-right:3px solid red;
        }
        .add-button{
            top:0;
            right:0;
            margin: 0;
            height:100px;
            line-height:100px;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            &:hover{
                background-color: rgba(42,73,52,0.2);
            }
            &:active{
                background-color: rgba(42,73,52,0.35);
            }
            &::after{
                vertical-align: middle;
                content: '';
                width:0;
                height:0;
                display: inline-block;
            }
            i{
                font-size: 1rem;
                font-weight: 600;
            }
        }
    }

</style>
<script>
    export default {
        data() {
            return {
                selectVisible: false,
                editImg:false,
                spliceImgIndex:0,
                imgDialog: false,
                imgPath:''
            }
        },
        methods:{
            remove(index){
                this.imgs.splice(index, 1);
            },
            mdf_img(index){
                this.spliceImgIndex = index;
                this.editImg = true;
                this.selectVisible = true;
            },
            operate_img(image){
            	if(image.path&&image.path.indexOf("http")===-1){
            		this.$set(image,'thumb',image.base_url + image.path);
                    this.$set(image,'eps_path',image.base_url + image.path);
            		return image.base_url + image.path;
                }
            	return image.thumb;
            },
            search_img(image){
                this.imgPath = this.url_join(image,'_500x500.');
                this.imgDialog = true;
            },
            url_join(path = '', size='_100x100.'){
                let isBlob = path.includes('blob:');
                if(isBlob) return path;
                let bl = path.includes('http');
                let b2 = path.includes('_100x100.');
                if(bl&&b2)return path;
                let index = path.lastIndexOf('.');
                let arr = [...path];
                arr.splice(index,1, size);
                let str = arr.join('');
                return bl?path:this.baseUrl+str;
            },
            change_image(item){
                this.$emit("change-image",item,this.itemData);
            },
            addImg(arr){
                arr.forEach(item=>{
                    let find = this.imgs.find((row)=>{
                        return row.id === item.id;
                    });
                    if(find) {this.$message({type:"warning",message:"有重复图片，已过滤"}); return}
                    if(this.editImg){
                        this.imgs.splice(this.spliceImgIndex,1,...arr);
                    }else {
                        if(!!this.imgLength&&(this.imgs.length>=this.imgLength))return this.$message({type:"warning",message:`该平台只允许添加${this.imgLength}张图片，超出的图片已被去除`});
                        this.imgs.push(item);
                    }
                });
            },
            call_back(val){
                this.selectVisible = false;
                val.path = val.path instanceof Array?val.path:JSON.parse(val.path);
                let path = val.path.map(row=>{return {path:row,base_url:val.baseUrl}});
                path.forEach(row=>{
                    if(this.imgs.find(res=>res.path===row.path)) return this.$message({type:"warning",message:"添加图片重复,已被过滤"});
                    this.imgs.push(row);
                })
            },
            add(){
                this.editImg = false;
                this.selectVisible = true;
            },
            move_drap(val){
                console.log(val);
            },
            handleChange(imgs,path){
                console.log(imgs,'imgs');
                console.log(path,'path');
//                this.imgs.push(item);
            },
        },
        computed:{
            canAddImg(){
                if(this.imgs.length>=12){
                    return false;
                }
                return true;
            },
        },
        watch:{
        },
        props:{
            imgs:{
                required:true,
                type:Array
            },
            id:{
                required:true,
                type:[String,Number]
            },
            channelId:{//平台id
                default(){
                    return "";
                }
            },
            spu:{
                default(){
                    return "";
                }
            },
            account:{
                default(){
                    return "";
                }
            },
//            baseUrl:{
//                type:String,
//                required:true
//            },
            baseUrl:{
                default(){
                    return ""
                }
            },
        },
        components: {
            dragDrop:require("../../../../../components/drag-drop").default,
            selectImg: require('../../../../../components/select-img.vue').default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,
        }
    }
</script>
