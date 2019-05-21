<template>
    <div class="c-image-upload-download">
        <draggable v-model="images">
            <div v-if="!images.length"
                 class="operate label-name inline"
                 @click="$refs.input.click()">
                <i class="el-icon-upload2"></i> {{label}}
            </div>
            <div v-else
                 class="image inline"
                 v-for="(image,index) in images" :key="index">
                <span class="image-item inline">
                    <i class="el-icon-document"></i>
                    <span class="image-name" @click="enlarge_image(image)"
                          :title="isTitle">{{image.name}}</span>
                    <span><i class="el-icon-circle-check"></i></span>
                </span>
                <span @click="remove(image)" v-if="isDelete" class="ml-mini ">
                        <i class="el-icon-delete" title="点击删除"></i>
                    </span>
                <span v-if="isDownload" class="operate image-item"
                      @click="$emit('download',image)">下载</span>
            </div>
        </draggable>
        <input type="file"
               ref="input"
               hidden
               :accept="accept"
               @change="handleChange">
        <page-dialog  title="查看大图"
                      v-model="enlargeImageShow"
                      size="small"
                      class="enlarge-image-dialog">
            <div align="center">
                <img :src="imgPath" :style="enlargeStyle">
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus" scoped>
    .c-image-upload-download{
        .label-name{
            i{
                &:hover{
                    cursor :pointer;
                }
            }
        }
        .image{
            &:hover{
                background-color: rgba(42,73,52,0.2);
            }
            &:active{
                background-color: rgba(42,73,52,0.35);
            }
            .image-item{
                &:hover{
                    cursor: pointer;
                    color: #69f;
                }
            }
        }
    }
</style>

<script>
    export default {
        name: "image-upload-download",
        data(){
            return {
                enlargeImageShow:false,
                imgPath:''
            }
        },
        computed: {
            isTitle(){
                let str=this.images.map(row=>row.name).join(',');
                let name=str.substring(str.lastIndexOf('.')+1).toLowerCase();
                let arr=['gif','jpg','jpeg','png'];
                if(arr.includes(name))return '点击放大';
            }
        },
        methods: {
            handleChange(ev){
                let files=ev.target.files;
                if(!files)return;
                let filesArr=Array.prototype.slice.call(files);
                let file=filesArr[0];
                if(!this.validate(file))return;
                let reader=new FileReader();
                reader.readAsDataURL(file) ;
                reader.onload =(e)=> {
                    let image={
                        image:e.target.result,
                        name:file.name,
                        size:file.size,
                        path:URL.createObjectURL(file),
                    };
                    this.images.push(image);
                    this.$refs.input.value=null;
                };
            },
            enlarge_image(image){
                this.imgPath=image.path?image.path:image.name;
                this.enlargeImageShow=true;
            },
            remove(img){
                let index=this.images.findIndex(row=>row.name===img.name);
                this.images.splice(index,1);
            },
        },
        props: {
            images:Array,
            label:{
                type:String,
                default:'上传图片'
            },
            validate:{//验证格式
                type:Function,
                default:(file)=>{
                    let fileFormat=file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
                    let arr=['jpg','png','jpeg'];
                    if(arr.includes(fileFormat)){
                        return true;
                    }else {
                        return this.$message({type:'warning',message:'上传图片格式错误！'})
                    }
                }
            },
            accept:{
                type:String,//image/gif,image/jpeg,image/jpg,image/png,image/svg....
                default:'image/jpeg,image/jpg,image/png'
            },
            isDelete:{
                type:Boolean,
                default:true,
            },
            isDownload:{
                type:Boolean,
                default:false
            },
            enlargeStyle:{
                type:Object,
                default(){
                    return {
                        width:'200px',
                    }
                }
            }
        },
    }
</script>

