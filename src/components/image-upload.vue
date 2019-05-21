<template>
    <div>
        <div class="p-images-box">
            <drag-drop v-model="images" tag="ul" v-if="thumbnailMode" class="image-thums">
                <li class="image" :style="imageStyle" v-for="image in images" @mouseover="over(image)" @mouseout="out(image)">
                    <img :src="image.url">
                    <div class="tool" v-if="image.show">
                        <span class="btn">
                            <i class="el-icon-upload2" @click="upimage(image)"></i>
                        </span>
                        <span class="btn">
                             <i class="el-icon-delete" @click="remove(image)"></i>
                        </span>
                        <i class="image-status">{{image.status}}</i>
                    </div>
                </li>
            </drag-drop>
            <div class="image add-button" :style="imageStyle" @click="$refs.input.click();">
                <i class="el-icon-plus"></i>
                <span class="addImg"> 添加图片</span>
                <span class="uploadall" @click.stop="upload">上传所有图片</span></div>
        </div>
        <input type="file" ref="input" hidden @change="handleChange" :multiple="multiple">
    </div>
</template>
<style lang="stylus">
    .p-images-box{
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
        .image-thums{
            border:1px solid #418dbe;
            border-radius: 5px;
        }
        .image{
            border:1px solid rgba(28,129,83,0.89);
            vertical-align: middle;
            margin:5px;
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
        .add-button{
            position: absolute;
            top:0;
            right:0;
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
            upload(){
                this.images.forEach(image=>this.upimage(image));
                console.log('upload');
            },
            upimage(image){
                console.log('upimage');
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
                fileArr.forEach(file=>this.file_push(file));
                this.$refs.input.value = null;
            },
            file_push(file){
                file.uid = Date.now() + this.tempIndex++;
                let _file = {
                    status: '已上传',
                    name: file.name,
                    size: file.size,
                    percentage: 0,
                    uid: file.uid,
                    showProgress: true,
                    show:false,
                };
                if (this.thumbnailMode) {
                    try {
                        _file.url = URL.createObjectURL(file);
                    } catch (err) {
                        console.error(err);
                        return;
                    }
                }
                this.images.push(_file);
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
            dragDrop:require('./drag-drop').default
        }
    }
</script>