<template>
    <div>
        <div class="img-box">
            <li class="image" :style="imageStyle" v-for="image in images" @mouseover="over(image)" @mouseout="out(image)">
                <img :src="image.url">
                <div class="tool" v-if="image.show">
                   <!-- <span class="btn">
                            <i class="el-icon-upload2" @click="upimage(image)"></i>
                        </span>-->
                    <span class="btn">
                        <i class="el-icon-edit" @click="$refs.input.click();"></i>
                    </span>
                    <span class="btn">
                         <i class="el-icon-delete" @click="remove(image)"></i>
                    </span>
                </div>
            </li>
            <div class="image add-button" :style="imageStyle" @click="$refs.input.click();"  v-if="images.length<=0">
                <i class="el-icon-plus"></i>
                <span class="addImg"> 添加图片</span></div>
        </div>
        <input type="file" ref="input" hidden @change="handleChange" :multiple="multiple">
    </div>
</template>
<style lang="stylus">
    .img-box{
        position: relative;
        .image-thums{
            border:1px solid #418dbe;
            border-radius: 5px;
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
                tempIndex:0
            }
        },
        methods:{
            upimage(image){
            },
            remove(image){
                let index = this.images.indexOfFun(row=>row.uid === image.uid);
                this.images.splice(index, 1);
            },
            handleChange(ev){
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach(file=>{
                    if ((/\.(?!(png$|jpg$))/.test(file.name))) {
                        this.$message({
                            type: "error",
                            message: "文件类型错误，请选择图片文件上传！"
                        });
                        return ;
                    }else{
                        this.file_push(file);
                    }
                });
                this.$refs.input.value = null;
            },
            file_push(file){
                let  reader = new FileReader();
                reader.readAsDataURL(file) ;
                file.uid = Date.now() + this.tempIndex++;
                reader.onload =(e)=> {
                    let  imgs = e.target.result;
                    let _file = {
                        name:file.name,
                        size:file.size,
                        image: imgs,
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
                    if(this.images.length===0){
                        this.images.push(_file);
                    }else {
                        this.images.splice(0,1,_file)
                    }
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
            }
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
            }
        },
        components:{
        }
    }
</script>
