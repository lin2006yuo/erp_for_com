<template>
    <div>
        <div class="p-img-add">
            <div style="position: relative">
                <drag-drop tag="ul" class="image-thums im" v-model="imgs">
                    <li :style="imageStyle"
                        v-for="(image, index) in imgs"
                        :key="`${index}${image.path}`"
                        :class="['image','border-n',index===(imgNumber-1)?'img-line':'']">
                        <div v-if="index===0" class="mian-pic" :title="$t('ymx-list.mImage')"></div>
                        <img v-lazy="url_join(image.path,picSize)"
                             @click="click_img(index)"
                             @dblclick="showBigPic?search_img(image.path):''"
                             :title="showBigPic?`双击查看大图`:''">
                        <div class="tool">
                            <span class="btn-img el-icon-picture" title="美图" @click="meitu(index, image)"></span>
                            <span class="btn-img el-icon-delete" :title="$t('common.del')" @click="remove(index)"></span>
                            <span class="btn-img el-icon-edit" :title="$t('common.mdf')" @click="mdf_img(index)"></span>
                            <span class="btn-img el-icon-search" :title="$t('ymx-list.find')" @click="search_img(image.path)"></span>
                        </div>
                        <el-checkbox v-show="image.isSwatch" :value="image.isSwatch" class="checkbox"></el-checkbox>
                    </li>
                    <li class="add-image add-image-icon"
                        :style="imageStyle"
                        @click="add" v-if="canAddImg"></li>
                </drag-drop>
            </div>
        </div>
        <div>
            <slot></slot>
            <el-button type="primary"
                       size="mini"
                       v-if="showRandomBtn"
                       @click="random_arr">{{$t('ymx-detail.random')}}</el-button>
            <el-button type="primary"
                       v-if="needClearAll"
                       size="mini"
                       @click.native="clear_all">{{$t('common.clearAll')}}
            </el-button>
            <el-button type="primary"
                       size="mini"
                       v-if="generateImage"
                       @click.native="generate_image">生成图片</el-button>
        </div>
        <blowup-image v-model="imgDialog" :img-path="imgPath"
                      :base-url="baseUrl"
                      :img-arr="imgs"
                      :title="$t('ymx-list.viewLarger')"></blowup-image>
        <select-img v-model="selectVisible"
                    :cur-sku="curSku"
                    :channel-id="channelId"
                    :isKandeng="isKandeng"
                    :spu="spu"
                    :account="account"
                    :id="id"
                    @add="addImg"
                    @call-back="call_back"
                    @move-drap="move_drap"
                    @handle-change="handleChange"
                    :edit-img="editImg"></select-img>
        <meitu v-model="showMeitu" @save-base64="saveBase64"
               :source-url="meituUrl"></meitu>
    </div>
</template>
<style lang="stylus" scoped>
    .p-img-add {
        position: relative;
        .checkbox {
            position: absolute;
            top: 0;
            right: 0;
        }
        .mian-pic {
            position: absolute;
            top: -15px;
            right: -9px;
            width: 25px;
            height: 25px;
            background: url(../assets/main.png) no-repeat center center;
            background-size: contain;
        }
        /*.p-images-box{*/

        .uploadall {
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 32px;
            line-height: 32px;
            &:hover {
                background-color: rgba(0, 0, 0, 0.72);
                color: #fff;
            }
        }
        .image-thums.im {
            border: none;
            display: inline-block;
            position: relative;
        }
        .img-index {
            position: absolute;
            width: 5px;
            height: 100px;
            background: #ff4d51;
        }
        .add-image {
            display: inline-block;
            vertical-align: middle;
            border: 1px dotted #ddd;
            border-radius: 3px;
            transition: all .2s;
            margin: 0 5px 5px 0;
            &:hover {
                transform: scale(1.1);
                box-shadow: 0 0 5px #ccc;
                z-index: 1;
            }
        }
        .image {
            vertical-align: middle;
            border: 1px solid #ddd;
            display: inline-block;
            position: relative;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            transition: all .2s;
            &:hover {
                transform: scale(1.1);
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
            }
        }
        .border-n {
            margin: 0 5px 5px 0;
        }
        .img-line {
            border-right: 3px solid red
        }
        .add-button {
            top: 0;
            right: 0;
            margin: 0;
            height: 100%;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            &:hover {
                background-color: rgba(42, 73, 52, 0.2);
            }
            &:active {
                background-color: rgba(42, 73, 52, 0.35);
            }
            &::after {
                vertical-align: middle;
                content: '';
                width: 0;
                height: 0;
                display: inline-block;
            }
            i {
                margin-top: 35%;
                font-size: 1rem;
                font-weight: 600;
            }
            .addImg {
                display: block;
                font-size: 1.5rem;
                font-weight: 600;
            }
        }
    }

</style>
<script>
    import {api_upload_self_goods} from '@/api/goods-image';

    export default {
        data() {
            this.$nextTick(() => {
                this.defaultRandom && this.random_arr();
            });
            return {
                showMeitu: false,
                meituUrl: '',
                tempIndex: 0,
                mdfIndex: 0,
                imgDialog: false,
                imgPath: '',
                selectVisible: false,
                imgs: this.value,
                editImg: false,
                spliceImgIndex: 0,
                curIndex:'',
            }
        },
        methods: {
            clear_all() {
                this.$confirm(`您将删除当前所有图片，确认此操作吗？`, this.$t('common.tips'), {
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.imgs = [];
                }).catch(() => {
                    this.$message({type: "info", message: this.$t('ymx-list.cancelTip')});
                });

            },
            test() {
                console.log("test", this.imgs);
            },
            add() {
                this.editImg = false;
                this.selectVisible = true;
            },
            meitu(index, image) {
                this.meituUrl = this.baseUrl+image.path;
                this.curIndex = index;
                this.showMeitu = true;
            },
            saveBase64(base64, fileName) {
                const goods_id = this.id instanceof Array?Number(this.id[0]):Number(this.id);
                let list = fileName.split('.');
                let typeName = list[list.length-1];
                let type = `data:image/${typeName};base64,`;
                const images = [
                    {
                        image: `${type}${base64}`,
                        name: fileName
                    }
                ];
                this.$http(api_upload_self_goods, {
                    goods_id,
                    channel_id: this.channel_id,
                    images
                }).then(res => {
                    let params = {
                        newPath:JSON.parse(res.path)[0],
                        curIndex:this.curIndex
                    };
                    this.$emit('save-meitu',params);
                }).catch(code =>{
                    console.error(code)
                })
            },
            mdf_img(index) {
                //this.add();
                this.spliceImgIndex = index;
                this.editImg = true;
                this.selectVisible = true;
            },
            random_arr() {
                let arr1 = [];
                let arrOther = [];
                this.imgs.forEach(item => {
                    if (item.is_default === 1) {
                        arr1.push(item)
                    } else {
                        arrOther.push(item);
                    }
                });
                let n = Math.floor(Math.random() * arr1.length);
                let spliceArr = arr1.splice(n, 1);
                let newArr = [...arr1.concat(arrOther)];
                newArr.sort(function () {
                    return Math.random() - 0.5;
                });
                let arr = [...spliceArr, ...newArr];
                this.imgs.length = 0;
                this.imgs.push(...arr);
            },
            addImg(arr) {//baseUrl后端实在给不了才用这个地方的baseUrl
                if (arr.length <= 0) return;
                const length = this.imgs.length;
                arr.forEach((item, index) => {
                    this.$set(item, 'base_url', this.baseUrl);
                    if (this.showSwatchImg) {
                        this.$set(item, 'isSwatch', false);
                    }
                    let find = this.imgs.find((row) => {
                        return row.path === item.path;
                    });
                    if (find) {
                        this.$message({type: "warning", message: "有重复图片，已过滤"});
                        return
                    }
                    if (this.editImg) {
                        this.imgs.splice(this.spliceImgIndex, 1, ...arr);
                    } else {
                        if (!!this.imgLength && (this.imgs.length >= this.imgLength)) return this.$message({
                            type: "warning",
                            message: `该平台只允许添加${this.imgLength}张图片，超出的图片已被去除`
                        });
                        this.imgs.push(item);
                    }
                });
                if (length <= 0 && this.showSwatchImg) this.imgs[0].isSwatch = true;
            },
            call_back(val) {
                this.selectVisible = false;
                val.path = val.path instanceof Array ? val.path : JSON.parse(val.path);
                let path = val.path.map(row => {
                    return {path: row, base_url: val.baseUrl}
                });
                path.forEach(row => {
                    if (this.imgs.find(res => res.path === row.path)) return this.$message({
                        type: "warning",
                        message: "添加图片重复,已被过滤"
                    });
                    this.imgs.push(row);
                })
            },
            move_drap(val) {
                console.log(val);
            },
            handleChange(imgs, path) {
                console.log(imgs, 'imgs');
                console.log(path, 'path');
//                this.imgs.push(item);
            },
            generate_image(){
                this.$emit('generate-image');
            },
            click_img(index) {
                if (!this.showSwatchImg) return;
                if(!this.generateImage){
                    let isTrue = this.imgs[index].isSwatch;
                    if (isTrue) {
                        this.imgs[index].isSwatch = false
                    } else {
                        let find = null;
                        while (find !== -1) {
                            find = this.imgs.findIndex(item => {
                                return item.isSwatch;
                            });
                            if (find !== -1) {
                                this.imgs[find].isSwatch = false;
                            }
                        }
                        this.imgs[index].isSwatch = true;
                    }
                }else{
                    this.imgs[index].isSwatch = !this.imgs[index].isSwatch;
                }
            },
            search_img(image) {
                this.imgPath = image;
                this.imgDialog = true;
            },
//            bigPicUrl(image){
//            	console.log(this.url_join(image,this.baseUrl,this.bigPicSize),123)
//            	return this.url_join(image,this.bigPicSize);
//            },
            remove(index) {
                this.imgs.splice(index, 1);
            },
            url_join(path = '', size = this.picSize) {
                let isBlob = path.includes('blob:');
                if (isBlob) return path;
                let bl = path.includes('http');
                let b2 = path.includes('_200x200.');
                if (bl && b2) return path;
                let index = path.lastIndexOf('.');
                let arr = [...path];
                arr.splice(index, 1, size);
                let str = arr.join('');
                return bl ? path : this.baseUrl+ str;
            }
        },
        watch: {
            imgs(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.imgs = val || [];
            },
        },
        computed: {
            imageStyle() {
                return {
                    width: this.image.width || 'auto',
                    height: this.image.height || 'auto',
                }
            },
            imgIndex() {
                let n = this.imgNumber !== 0 && this.imgNumber;
                let xpx = 106.3;
                let ypx = 108;
                let x = n % this.rowCount;
                let y = Math.ceil(n / this.rowCount);
                return {
                    left: (x === 0 ? this.rowCount : x) * xpx + 'px',
                    top: (y - 1) * ypx + 'px'
                }
            }
        },
        props: {
            /*用于美图组件，修改后的图片保存时需要用到此字段，不传的情况保存图片不成功
            * */
            channel_id:{
                type:Number
            },
            curSku: {
                type: String,
            },
            isKandeng: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            showBigPic: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            picSize: {
                type: String,
                default() {
                    return '_200x200.'
                }
            },
            value: {
                type: Array,
                default() {
                    return []
                }
            },
            image: {//自定义长宽对象
                type: Object,
                default() {
                    return {
                        width: '100px', height: '100px'
                    };
                }
            },
            edit: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            showSwatchImg: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            generateImage:{
                type: Boolean,
                default() {
                    return false;
                }
            },
            id: {
                required: true,
                type: [String, Number, Array]
            },
            baseUrl: {
                type: String,
                required: true
            },
            imgNumber: {
                type: Number,
                default() {
                    return 9;
                }
            },
            rowCount: {
                default() {
                    return 9
                }
            },
            canAddImg: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            needClearAll: {
                type: Boolean,
                default() {
                    return false;
                },
            },
            showRandomBtn: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            defaultRandom: {
                type: Boolean,
                default() {
                    return true
                },
            },
            imgLength: {
                type: Number,
                default() {
                    return 0;
                },
            },
            channelId: {//平台id
                default() {
                    return "";
                }
            },
            spu: {
                default() {
                    return "";
                }
            },
            account: {
                default() {
                    return "";
                }
            }
        },
        components: {
            dragDrop: require('./drag-drop').default,
            blowupImage: require("./blowup-image.vue").default,
            selectImg: require('./select-img.vue').default,
            meitu: require('@/components/meitu').default
        }
    }
</script>
