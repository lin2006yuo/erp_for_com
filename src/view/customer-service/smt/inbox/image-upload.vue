<template>
    <div class="upload-imgs">
        <div>
            <div class="upload-demo">
                <div v-if="showThumb&&imgSrc.length>0">
                    <el-popover
                        placement="right"
                        trigger="hover">
                        <img :src="imgSrc"
                             width="200px"
                             height="200px">
                        <span slot="reference">
                            <img :src="imgSrc"
                                 @click="search_img"
                                 height="60px" width="60px"
                                 style="border:none">
                                        </span>
                    </el-popover>
                </div>
                <div class="el-upload el-upload--text fl">
                    <div class="operate" style="display:inline-block" @click="$refs.input.click()" v-if="images.length===0">
                        <i class="el-icon-upload2"></i>{{label}}
                    </div>
                    <ul class="el-upload-list el-upload-list--text">
                        <li class="el-upload-list__item is-success" v-for="image in images">
                            <span class="el-upload-list__item-name"><i class="el-icon-document"></i>{{image.name}}</span>
                            <label class="img-lables">
                                <i class="el-icon-circle-check"></i>
                                <i class="el-icon-delete ml-xs" @click="remove(image)"></i>
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="clearFloat"></div>
            </div>
        </div>
        <input type="file" ref="input" hidden @change="handleChange" :multiple="multiple">
        <blowup-image v-model="imgDialog" :img-path="imgSrc" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .upload-imgs{
        position: relative;
        .image-thums{
            border:1px solid #418dbe;
            border-radius: 5px;
        }
        .img-lables{
            position: absolute;
            right: 0;
            top: 0;
        }
        .image{
            border:1px solid rgba(28,129,83,0.89);
            vertical-align: middle;
            display: inline-block;
            position: relative;
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
                height: 100%;
                background-color: rgba(0, 0, 0, 0.72);
                text-align: center;
                .btn{
                    display: inline-block;
                    color: #fff;
                    font-size: 1.25rem;
                    cursor: pointer;
                    vertical-align: middle;
                    transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms, opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
                    margin-top: 60%;
                }
                .btn .i{
                    color: #fff;
                    display: block;
                    font-size: 24px;
                    line-height: inherit;
                    margin: 0 auto 5px;
                }
                .btn:hover{
                    transform: translateY(-13px);
                }
                .btn:not(:first-child){
                    margin-left: 20px;
                }
            }
        }
        .el-upload-list__item:first-child {
            margin-top: 0;
        }
        .el-upload-list__item {
            transition: all .5s cubic-bezier(.55,0,.1,1);
            font-size: 1.25rem;
            color: #475669;
            line-height: 25px;
            margin-top: 5px;
            position: relative;
            box-sizing: border-box;
            border-radius: 4px;
            width: 100%;
        }
        .add-button{
            width:100%;
            height:100%;
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
                height:100%;
                display: inline-block;
            }
            i{
                margin-top: 35%;
                font-size: 1.5rem;
                font-weight: 600;
            }
            .addImg{
                display: block;
                font-size: 1.5rem;
                font-weight: 600;
            }
        }
    }

</style>
<script>
    export default {
        data(){
            return {
                images:(this.init || []),
                tempIndex:0,
                imgSrc:'',
                imgDialog:false
            }
        },
        methods:{
            upimage(image){
            },
            remove(image){
                let index = this.images.indexOfFun(row=>row.uid === image.uid);
                this.images.splice(index, 1);
                this.imgSrc = '';
            },
            handleChange(ev){
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach(file=>{
                    if(file.name.includes(`.png`)||file.name.includes(`.PNG`)||file.name.includes(`.jpg`)||file.name.includes(`.JPG`)||file.name.includes(`.JPEG`)){
                        this.file_push(file)
                    }else{
                        this.$message({type:'error',message:`请上传png或jpg格式的图片文件!`});
                    }
                });
                this.$refs.input.value = null;
            },
            file_push(file){
                let  reader = new FileReader();
                reader.readAsDataURL(file) ;
                file.uid = Date.now() + this.tempIndex++;
                reader.onload =(e)=> {
                    this.imgSrc = e.target.result;
                    let _file = {
                        name:file.name,
                        size:file.size,
                        image: this.imgSrc,
                        show:false,
                        uid: file.uid,
                    };
                    if (this.thumbnailMode) {
                        try {
                            _file.url = URL.createObjectURL(file);
                        } catch (err) {
                            console.error(err);
                            return;
                        }
                    }
                    if(!this.multiple){
                        if(this.images.length===0){
                            this.images.push(_file);
                        }else {
                            this.images.splice(0,1,_file)
                        }
                    }else{
                        this.images.push(_file);
                    }
                    this.$emit('handle-change');
                }
            },
            out(image){
                image.timer = setTimeout(()=>{
                    image.show=false;
                },300);
            },
            over(image){
                clearTimeout(image.timer);
                image.show=true
            },
            //查看大图
            search_img(){
                this.imgDialog = true;
            },
        },
        computed:{
            imageStyle(){
                return {
                    width: this.image.width || 'auto',
                    height: this.image.height || 'auto',
                }
            }
        },
        props:{
            init:{},
            thumbnailMode:{},
            image:{
                type:Object,
                default(){
                    return {};
                }
            },
            multiple:{
                type:Boolean,
                default(){
                    return true;
                }
            },
            label: {
                type: String,
                default: '上传图片'
            },
            showThumb:{
                type:Boolean,
                default:false
            }
        },
        components:{
            blowupImage:require("@/components/blowup-image.vue").default,
        }
    }
</script>
