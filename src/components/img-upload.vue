<template>
    <page-dialog class="c-img-upload" v-model="visible" @open="open" @close="close" :tag="imageInfo.tip" :title="imageInfo.title">
        <div class="image-box">
            <li class="image-content image" v-for="(item,index) in images"
                :key="index">
                <img :src="item.path" @click="search_img(item.path)">
                <div class="tool" v-if="needAdd">
                    <span class="btn-img el-icon-delete" :title="$t('common.del')" @click="remove(index)"></span>
                </div>
            </li>
            <div v-if="isShowAdd" class="image-content inline image-box-tip" title="点击添加图片" @click="add_pic"></div>
            <!--<img v-else :src="path" width="100%" height="100%" @click="add_pic" title="点击更换图片">-->
        </div>
        <input type="file" ref="input" hidden @change="handle_change"
               :multiple="multiple"
               accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        <div slot="footer">
            <el-button v-if="needAdd" type="primary" size="mini" @click.native="sure">
                {{sureText}}
            </el-button>
            <el-button size="mini" @click.native="cancel">
                {{cancelText}}
            </el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-img-upload {
        .image-box {
            margin-top: 20px;
            margin-bottm: 20px;
            text-align: center;
            /*margin-left:175px;*/
            .image-content {
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 5px;
                width: 190px;
                height: 190px;
                margin-right: 15px;
                margin-bottom: 5px;
                vertical-align: top;
            }
            .image {
                display: inline-block;
                position: relative;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                &:hover {
                    box-shadow: 0 0 5px #ccc;
                    z-index: 1;
                }
                &:hover .tool {
                    height: 30px;
                }
                img {
                    width: 100%;
                    height: 100%;
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
                }
            }
            .image-box-tip {
                text-align: center;
                background: url("../assets/add-image-icon.png") no-repeat center;
                background-position: center center;
                background-size: 35% 35%;
            }
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                visible: this.value,
                images: [],
            }
        },
        methods: {
            open() {
                this.images = this.imageInfo.images || [];
            },
            close() {
                this.images = [];
            },
            sure() {
                if(this.images.length === 0 && this.isRequire) {
                    this.$message({type: 'warning', message: '请选择图片上传！'});
                    return;
                }
                let data = clone(this.images);
                this.$emit('upload', data);
            },
            cancel() {
                this.visible = false;
                this.$emit('cancel');
            },
            handle_change(ev) {
                const files = ev.target.files;
                if (!files) return;
                let timer = null;
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file, index) => {
                    file.uid = Date.now();
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let img = e.target.result;
                        if (this.images.length >= this.limit) {
                            this.$message({type: 'warning', message: `最多只能上传${this.limit}张图片！`});
                        } else {
                            this.images.push({
                                path: img,
                            });
                        }
                        // 清空input数据避免上传同一张图片没有触发该事件
                        this.$refs.input.value = null;
                    };
                });
            },
            remove(index) {
                this.images.splice(index, 1);
            },
            add_pic() {
                this.$refs.input.click();
            },
            /**
             * 查看原图
             * @param image
             */
            search_img(image) {
                if (/http(s)?:\/\/.+/.test(image)) {
                    window.open(image);
                }else {
                    window.open(config.apiHost+image);
                }
            },
        },
        computed:{
            isShowAdd(){
                if(this.needAdd){
                    return this.images.length<this.limit
                }else{
                    return false
                }
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            imageInfo: {
                require: true,
                type: Object,
                default() {
                    return {
                        title: '上传图片',
                        images: [],
                    }
                }
            },
            multiple: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            limit: {
                type: Number,
                default() {
                    return Number.MAX_SAFE_INTEGER;
                }
            },
            needAdd: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            isRequire: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            sureText: {
                default() {
                    return '确认';
                }
            },
            cancelText: {
                default() {
                    return '取消';
                }
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>
