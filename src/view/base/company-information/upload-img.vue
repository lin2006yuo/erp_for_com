<template>
    <div class="c-upload-img"
         :style="outsideStyle">
        <draggable v-model="images"
                   class="images">
            <div class="operate label-name"
                 @click="$refs.input.click()"
                 v-if="!images.length&&edit">
                <i class="el-icon-upload2"></i>{{label}}
            </div>
            <div class="image operate"
                 :style="imageStyle"
                 v-for="(image,index) in images" :key="index">
                <div class="image-item inline">
                    <i class="el-icon-document"></i>
                    <span class="image-name" @click="enlarge_image(image)">{{image.name}}</span>
                    <span ><i class="el-icon-circle-check"></i></span>
                    <span @click.stop="remove(image)"
                          v-if="edit">
                        <i class="el-icon-delete"></i>
                    </span>
                </div>
            </div>
        </draggable>
        <input type="file"
               ref="input"
               hidden
               @change="handleChange"
               accept="image/jpeg,image/jpg,image/png">
        <page-dialog title="查看大图"
                     v-model="enlargeImageShow"
                     size="small"
                     @change="open_enlarge"
                     class="enlarge-image-dialog">
            <div align="center">
                <img :src="imgPath" class="img-style">
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .c-upload-img{
        .label-name{
            display :inline-block;
            &:hover{
                cursor :pointer;
            }
        }
        .image-item{
            &:hover{
                cursor: pointer;
                background-color: rgba(42,73,52,0.2);
            }
            &:active{
                background-color: rgba(42,73,52,0.35);
            }
            .image-name{
                &:hover{
                    color: #69f;
                }
            }
        }
        .enlarge-image-dialog{
            .img-style{
                width :200px;
                height :200px;
            }
        }
    }
</style>

<script>
    export default {
        name: "upload-img",
        data(){
            return {
                imgPath:'',
                enlargeImageShow:false
            }
        },
        computed:{
            outsideStyle(){

            },
            imageStyle(){

            }
        },
        methods: {
            handleChange(ev){
                const files = ev.target.files;
                if (!files) {return;}
                let fileArr = Array.prototype.slice.call(files);
                let match=/.+(\.)(png|jpeg|jpg)$/;
                fileArr=fileArr.filter(file=>{
                    return match.test(file.name)
                });
                //有accept可要可不要
                //if(!fileArr.length)return this.$message({type:'success',message:'请选择png、jpeg或jpg格式图片上传！'});
                fileArr.forEach((file,index)=>{
                    file.uid = Date.now();
                    let  reader = new FileReader();
                    reader.readAsDataURL(file) ;
                    reader.onload =(e)=> {
                        let  imgs = e.target.result;
                        let param = {
                            uid:file.uid,
                            name:file.name,
                            size:file.size,
                            image: imgs,
                            path : URL.createObjectURL(file)
                        };
                        this.images.push(param);
                    }
                })
            },
            remove(img){
                let index = this.images.indexOfFun(row=>row.uid === img.uid);
                this.images.splice(index, 1);
            },
            enlarge_image(img){
                if(img.path){
                    this.imgPath=img.path;
                }else{
                    this.imgPath=img.name;
                }
                this.enlargeImageShow=true;
            },
            open_enlarge(val){

            }
        },
        props: {
            images:{
                required:true,
                type:Array
            },
            label:{
                type:String,
                default: '上传附件'
            },
            edit:{
                type:Boolean,
                default:true
            }
        },
    }
</script>

