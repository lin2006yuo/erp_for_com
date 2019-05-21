<template>
        <div class="images-box">
            <el-button type="primary" size="mini" @click="$refs.input.click();" style="vertical-align: top;" v-if="images.length<=0">添加图片</el-button>
            <el-button type="primary" size="mini" @click="$refs.input.click();" style="vertical-align: top;" v-else>修改图片</el-button>
            <input type="file" ref="input" hidden @change="handleChange" :multiple="multiple" style="width:0">
            <li class="images" :style="imageStyle" v-for="image in images" @mouseover="over(image)" @mouseout="out(image)">
              <img :src="image.url">
                <div class="tool" v-if="image.show">
                    <span class="btn">
                         <i class="el-icon-delete" @click="remove(image)"></i>
                    </span>
                </div>
            </li>
    </div>
</template>
<style lang="stylus">
    .images-box{
        position: relative;
        width: 160px;
        .images{
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
                    margin-top: 50%;
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
                console.log(fileArr);
                this.file_push(fileArr[0]);
           /*     fileArr.forEach(file=>this.file_push(file));*/
                this.$refs.input.value = null;
                console.log(fileArr);
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
                let img =[];
                if (this.thumbnailMode) {
                    try {
                        _file.url = URL.createObjectURL(file);
                        console.log(_file.url)
                        // 创建对象
                        var imgs = new Image();
                        imgs.src = _file.url;
                        imgs.onload = function(){
                            if(imgs.width>26||imgs.height>26){
                                alert('图片上传的固定宽高为26*26');
                            }else{
                                img.push(_file);
                                console.log(img);
                            }
                        };
                    } catch (err) {
                        console.error(err);
                        return;
                    }
                }
                 this.images=img;
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
        watch:{
            value(val){
                this.images=val
            },
            images(val){
                this.$emit('input',val)
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
            value:{}
        },
        components:{
        }
    }
</script>