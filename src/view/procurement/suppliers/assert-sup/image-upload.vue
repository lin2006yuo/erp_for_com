<template>
    <div class="upload-imgs">
        <div v-for="(image,i) in images" class="inline">
            <div class="allli" :key="i">
                <img v-if="image.path"
                     :src="img_path(image.path)"
                     height="100%"
                     @click="search_img(image.path)"
                     width="100%">
                <img v-if="image.file&&image.file.image"
                     :src="image.file.image"
                     height="100%"
                     @click="search_img(image.file)"
                     width="100%">
                <div class="tool">
                    <span v-if="!isLook&&(image.path||image.file.image)"
                          class="btn-img el-icon-delete"
                          @click="remove_img(i)"></span>
                    <span v-if="!isLook"
                          class="btn-img el-icon-edit"
                          @click="edit_img(image)"></span>
                    <img v-if="showDownload&&image.path"
                         class="btn-img btn-i-img"
                         @click="downloadImg(image.path)"
                         width="20px"
                         height="20px"
                         src="../../../../assets/download.svg">
                </div>
            </div>
        </div>
        <div v-if="!isLook&&images.length<maximum" class="inline" style="margin-top: 15px;margin-left: -4px;">
            <i class="add-image add-image-icon" @click="add_img"></i>
        </div>
        <input type="file" ref="input" hidden @change="handleChange" :multiple="maximum>1">
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .upload-imgs {
        position: relative;

        .allli {
            height: 100px;
            width: 100px;
            display: inline-block;
            position: relative;
            border: 1px solid #CFCFCF;
            transition: all .3s ease;
            margin-top: 15px;
            margin-right 10px;
            &:hover {
                transform: scale(1.1);
                box-shadow: 0 0 5px #ccc;
                z-index: 1;
            }
            &:hover .tool {
                height: 30px;
            }
        }
        .tool {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            background-color: rgba(0, 0, 0, .5);
            text-align: center;
            overflow: hidden;
            transition: all .3s ease;
            .btn-img {
                box-sizing: border-box;
                width: 22px;
                height: 22px;
                display: inline-block;
                color: #fff;
                font-size: 1.3rem;
                cursor: pointer;
                margin: 5px 2px;
                overflow: hidden;
                line-height: 22px;
                &:hover {
                    border-radius: 2px;
                    background-color: rgba(0, 0, 0, .55);
                }
                &:active {
                    background-color: rgba(0, 0, 0, .9);
                }
                > .i {
                    color: #fff;
                }
            }
            .btn-i-img {
                width: 20px !important;
                height: 20px !important;
                margin-bottom 8px !important;
            }
        }
        .add-image {
            width 100px;
            height 100px;
            display: inline-block;
            vertical-align: middle;
            border: 1px dotted #ddd;
            border-radius: 3px;
            transition: all .2s;
            &:hover {
                transform: scale(1.1);
                box-shadow: 0 0 5px #ccc;
                z-index: 1;
            }
        }
    }

</style>
<script>
    export default {
        data() {
            return {
                images: this.value,
                tempIndex: 0,
                imgSrc: '',
                imgDialog: false,
                imgPath: '',
                editImage: ''
            }
        },
        methods: {
            img_path(path) {
                return path ? `${config.apiHost}${path}` : ''
            },
            //查看大图
            search_img(image) {
                if (typeof image === 'string' && !!image) {
                    this.imgPath = this.img_path(image).replace("_60x60", "_500x500");
                } else {
                    this.imgPath = image.image;
                }
                this.imgDialog = true;
            },
            edit_img(image) {
                this.editImage = image;
                this.input_click();
            },
            add_img() {
                if (this.images.length === this.maximum) {
                    this.$message({type: 'warning', message: `最多上传${this.maximum}张图片！`});
                    return
                }
                this.editImage = '';
                this.input_click();
            },
            remove_img(index) {
                let removeImg = this.images.splice(index, 1);
                this.$emit('remove-img',removeImg);
            },
            input_click() {
                this.$refs.input.click();
            },
            remove(image) {
                let index = this.images.findIndex(row => row.uid === image.uid);
                this.images.splice(index, 1);
                this.imgSrc = '';
            },
            handleChange(ev) {
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach(file => {
                    if (file.name.includes(`.png`)
                        || file.name.includes(`.jpg`)
                        || file.name.includes(`.jpeg`)
                        || file.name.includes(`.PNG`)
                        || file.name.includes(`.JPG`)
                        || file.name.includes(`.JPEG`)) {
                        if (!this.images.find(image => image.file.name === file.name)) {
                            this.file_push(file);
                        } else {
                            this.$message({type: 'warning', message: `图片【${file.name}】已存在，请重新选择！`});
                        }
                    } else {
                        this.$message({type: 'warning', message: `请上传png或jpg格式的图片文件!`});
                    }
                });
                this.$refs.input.value = null;
            },
            file_push(file) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                file.uid = Date.now() + this.tempIndex++;
                reader.onload = (e) => {
                    this.imgSrc = e.target.result;
                    let _file = {
                        name: file.name,
                        size: file.size,
                        image: this.imgSrc,
                        show: false,
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
                    if(_file.size<this.maximize) {
                        if (this.editImage) {
                            this.editImage.path && (this.editImage.path = '');
                            this.editImage.file = _file;
                            this.$emit('update-file');
                        } else {
                            if (this.images.length < this.maximum) {
                                this.images.push({path: '', file: _file});
                                this.$emit('update-file');
                            } else {
                                this.$message({type: 'warning', message: `最多上传${this.maximum}张图片！`});
                            }
                        }
                    }else{
                        this.$message({type: 'warning', message: `只支持上传${this.maximize/1048576}M以内的图片！`});
                    }
                }
            },
            out(image) {
                image.timer = setTimeout(() => {
                    image.show = false;
                }, 300);
            },
            over(image) {
                clearTimeout(image.timer);
                image.show = true
            },
        },
        watch: {
            value(val) {
                this.images = val;
            },
            images(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {
                required: true,
                type: Array
            },
            thumbnailMode: {
                type: Boolean,
                default() {
                    return true
                }
            },
            //限制上传张数
            maximum: {
                type: Number,
                default() {
                    return 1
                }
            },
            //限制上传大小，默认1M
            maximize:{
                type:Number,
                default(){
                    return 1048576
                }
            },
            //查看状态不能添加编辑
            isLook: {
                type: Boolean,
                default() {
                    return false
                }
            },
            //是否显示下载
            showDownload:{
                type:Boolean,
                default(){
                    return false
                }
            },
            //下载处理函数
            downloadImg:{
                type:Function,
                default(){
                    return ()=>{}
                }
            }
        },
        components: {
            blowupImage: require("@/components/blowup-image.vue").default,
        }
    }
</script>
