<template>
    <el-row class="c-picture">
        <rainbow-header title="图片与描述" background-color="#ABCD05">
            <el-form :model="form" label-width="220px">
                <el-form-item label="刊登风格：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select :value="form.list.mod_style"
                                       ref="modstyle"
                                       v-mouse-side.mousewheel="()=>{$refs.modstyle.visible=false}"
                                       @input="(val)=>{chang_mod_style(val)}"
                                       filterable clearable>
                                <el-option v-for="item in styleList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="销售说明模板：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.mod_sale"
                                       ref="modsale"
                                       v-mouse-side.mousewheel="()=>{$refs.modsale.visible=false}"
                                       filterable clearable>
                                <el-option v-for="item in saleList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item :label="`刊登图片(${form.imgs.length}/12)：`" required>
                    <img-add v-model="form.imgs"
                             @save-meitu="save_meitu(form.imgs,$event)"
                             :key="form.code"
                             :isKandeng="true"
                             :need-clear-all="true"
                             :id="especialIds"
                             :channel-id="channelId"
                             :spu="spu"
                             :channel_id="1"
                             :account="account"
                             :default-random="!form.list.id||isCopy"
                             :base-url="baseUrl"
                             :img-number=12
                             :row-count=12
                             :show-swatch-img="false"></img-add>
                    <label class="red">注意：此处图第一张图片自动被用作 eBay 橱窗图（Gallery），所有图片将在刊登时上传到eBay，最多 20 张图片。请不要把多属性图片放在此处</label>
                </el-form-item>
                <el-form-item :label="`详情描述图片(${form.detail_imgs.length}/20)：`">
                    <img-add v-model="form.detail_imgs"
                             :default-random="!form.list.id||isCopy"
                             @save-meitu="save_meitu(form.detail_imgs,$event)"
                             :generate-image="true"
                             :isKandeng="true"
                             :need-clear-all="true"
                             :can-add-img="false"
                             :show-random-btn="false"
                             :channel_id="1"
                             :id="especialIds"
                             :base-url="baseUrl"
                             @generate-image="generate_image"
                             :img-number=20
                             :row-count=20>
                        <el-button type="primary"
                                   size="mini"
                                   :disabled="form.detail_imgs.length>=20"
                                   @click.native="add_image(2)">添加图片
                        </el-button>
                        <el-button type="primary"
                                   size="mini"
                                   :disabeld="form.imgs.length<=0"
                                   @click.native="copy_image">复制刊登图片
                        </el-button>
                    </img-add>
                </el-form-item>
                <el-form-item label="移动端描述：">
                    <el-row>
                        <el-col :span="24">
                            <limit-input
                                    v-model="form.set.mobile_desc"
                                    :is-textarea="true"
                                    :maxlength="800"
                                    :custom-autosize="{ minRows: 6, maxRows: 8}"
                                    other-remark="(最多800字符，不支持HTML)"
                            ></limit-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="详情描述：" required>
                    <kindeditor :editor-text="form.set.description"
                                :id="especialIds"
                                :can-replace="canReplace"
                                :showAddPicNormal="false"
                                @content-change="editor_content_change"
                                :editor-id="editorId"></kindeditor>
                </el-form-item>
                <el-form-item label="橱窗展示(Gallery)图片 ($)：">
                    <el-radio-group v-model="form.list.picture_gallery">
                        <el-radio :label="0">不使用</el-radio>
                        <el-radio :label="2">Featured</el-radio>
                        <el-radio :label="1">Gallery</el-radio>
                        <el-radio :label="3">Plus</el-radio>
                    </el-radio-group>
                    <a class="link ml-lg" href="http://pages.ebay.com/help/sell/fees.html" target="_blank">查看Ebay费用</a>
                </el-form-item>
                <el-form-item label="样式($)：">
                    <el-checkbox v-model="form.list.listing_enhancement">BoldTitle</el-checkbox>
                    <a class="link ml-lg" href="http://pages.ebay.com/help/sell/fees.html" target="_blank">查看Ebay费用</a>
                </el-form-item>
            </el-form>
        </rainbow-header>
        <select-img v-model="selectImgDialog"
                    :isKandeng="true"
                    :channelId="1"
                    :spu="spu"
                    :account="account"
                    :id="especialIds"
                    @add="addImg"
                    @add-url="add_url"
                    @handleChange="handleChange"></select-img>
    </el-row>
</template>
<style lang="stylus" scoped>
    .c-picture {
        .wangEditor-container {
            div.wangEditor-txt {
                height: 580px !important;
            }
        }
    }
</style>
<script>
    import {
        api_get_stylelist,
        api_common_modeList,
    } from '../../../../../api/ebay-kandeng-public-module';

    export default {
        data() {
            return {
                selectImgDialog: false,
                styleList: [],
                saleList: [],
                isAdd: false,
                tempImg: {},
                curImage: 0,
                curId: new Date().getTime() + "",
                multiple: true,
                canChange: 1,
            }
        },
        mounted() {
            this.get_stylelist();
            this.get_salelist();
            console.log(this.channelId,'channelId');
        },
        computed: {
            canReplace(){
                return this.curPage==='notYet'?true:false
            },
            editorId(){
                return `${this.curPage}${this.form.list.goods_id}${this.form.code}`
            },
            surplusCom() {
                return Number(23 - this.commonSpan);
            },
            surplusLar() {
                return Number(23 - this.largeSpan);
            }
        },
        methods: {
            editor_content_change(val){
                this.form.set.description = val;
            },
            save_meitu(imageList,obj){
                if(imageList[obj.curIndex])imageList[obj.curIndex].path = obj.newPath;
            },
            change_data(val) {
                this.form.set.description = val;
            },
            /*添加图片*/
            add_image(val) {
                this.isAdd = true;
                this.selectImgDialog = true;
            },
            handleChange(val) {//详情才会有；
            },
            add_url(val) {//详情才会有；
            },
            addImg(val) {
                if (!val || val.length <= 0) return;
                let cur = window.clone(this.form.detail_imgs);
                let curCopy = window.clone(val);
                curCopy.forEach(row => {
                    let def = this.form.detail_imgs.find(res => {
                        return res.path === row.path
                    });
                    if (this.form.detail_imgs.length >= 20) return;
                    if (def) return this.$message({type: "warning", message: "重复图片已被过滤"});
                    this.form.detail_imgs.push(row);
                })
            },
            copy_image() {
                let cur = this.form.detail_imgs;
                let curCopy = window.clone(this.form.imgs);
                if (cur) {
                    curCopy.forEach(row => {
                        let def = this.form.detail_imgs.find(res => {
                            return res.path === row.path
                        });
                        if (this.form.detail_imgs.length >= 20) return;
                        if (def) return this.$message({type: "warning", message: "重复图片已被过滤"});
                        this.form.detail_imgs.push(row);
                    })
                }
            },
            /*生成图片*/
            generate_image(){
                let list = this.form.detail_imgs.filter(row=>row.isSwatch).map(row=>{return `${row.base_url}${row.path}`});
                let img = '';
                list.forEach(row=>{
                    img += `<img src="${row}" />`;
                });
                KindEditor.insertHtml(`#${this.editorId}`, img);
            },
            remove(item) {
                let index = this.form.imgs.findIndex(row => {
                    return row.path === item.path
                });
                if (!!index || index === 0) this.form.imgs.splice(index, 1);
            },
            remove2(item) {
                let index = this.form.detail_imgs.findIndex(row => {
                    return row.path === item.path
                });
                if (!!index || index === 0) this.form.detail_imgs.splice(index, 1);
            },
            change_image(item) {
                this.tempImg = item;
                this.isAdd = false;
                this.selectImgDialog = true;
            },
            /*改变刊登风格*/
            chang_mod_style(val) {
                this.form.list.mod_style = val;
            },
            /*获取刊登风格*/
            get_stylelist() {
                this.$http(api_get_stylelist).then(res => {
                    this.styleList = res.data.map(row => {
                        return {
                            label: row.model_name,
                            value: row.id,
                        }
                    })
                }).catch(code => {
                    console.log(code);
                })
            },
            /*获取销售说明*/
            get_salelist() {
                let params = {
                    model_type: "sale",
                };
                this.$http(api_common_modeList, params).then(res => {
                    this.saleList = res.data.map(row => {
                        return {
                            label: row.model_name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
        },
        props: {
            curPage:{
                required:true,
                type:String
            },
            channelId: {
                default() {
                    return ""
                }
            },
            spu: {
                default() {
                    return ""
                }
            },
            account: {
                default() {
                    return ""
                }
            },
            isCopy: {
                type: Boolean
            },
            form: {},
            originalForm: {},
            commonSpan: {
                require: true,
                type: Number
            },
            largeSpan: {
                require: true,
                type: Number
            },
            goodsId: {
                require: true,
                type: [Number, String]
            },
            especialIds:{//多个商品情况下传入img-add组件的id
                require: true,
                type: Array,
            },
            baseUrl: {
                require: true,
                type: String,
                default(){
                    return '';
                }
            },
        },
        components: {
            pictureComponent: require('./picture-component.vue').default,
            dragDrop: require("@/components/drag-drop"),
            addImages: require("./add-images.vue").default,
            htmlEditor: require('@/components/html-editor.vue').default,
            html5Editor: require('@/components/html5-editor.vue').default,
            uEditor: require('@/components/u-editor.vue').default,
            limitInput: require('./limit-input.vue').default,
            imgAdd: require('@/components/img-add.vue').default,
            selectImg: require('@/components/select-img.vue').default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
            kindeditor:require('@/components/kindeditor.vue').default,
        }
    }
</script>
