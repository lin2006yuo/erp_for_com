<template>
    <page class="p-publish">
        <page-dialog :title="edit?'编辑':'添加到亚马逊预刊登'" v-model="visible" size="large" :close-on-click-modal="false">
            <el-form label-width="180px">
                <el-form-item label="本地 SPU：">
                    <el-input v-model="fromData.spu" class="inline" style="width:300px;" disabled></el-input>
                </el-form-item>
                <el-form-item label="本地 SKU：" v-if="isSingle">
                    <el-input v-model="fromData.parent_seller_sku" class="inline" style="width:300px;"
                              disabled></el-input>
                </el-form-item>
                <el-form-item label="Product Name：" required>
                    <limit-input v-model="fromData.name" class="inline" style="width: 823px;margin-right: 30px;"
                                 :is-textarea="false"
                                 :maxlength="120"
                                 :cur-span="23" :show-number="true"></limit-input>
                    <el-button type="primary" size="mini" @click="initial_uppercase">设置首字母大写</el-button>
                </el-form-item>
                <div>
                    <el-form-item label="Bullet-Point：" style="display: inline-block;width: 40%">
                        <el-input v-model="point_1" class="mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="point_2" class="mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="point_3" class="mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="point_4" class="mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="point_5" style="width:323px;"></el-input>
                    </el-form-item>
                    <el-form-item label="Generic Keywords：" style="display: inline-block;width: 40%">
                        <el-input v-model="generic_keywords_1" class="inline mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="generic_keywords_2" class="inline mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="generic_keywords_3" class="inline mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="generic_keywords_4" class="inline mb-sm" style="width:323px;"></el-input>
                        <el-input v-model="generic_keywords_5" class="i4line" style="width:323px;"></el-input>
                    </el-form-item>
                </div>
                <el-form-item>
                    <table class="p-publish-table" cellspacing="0" cellpadding="0" width="81%" v-if="extend_info.length>0">
                        <thead>
                        <tr style="background-color: #eff2f7">
                            <th>本地SKU</th>
                            <th width="80">external_product_id_type</th>
                            <th width="80">external_product_id</th>
                            <th width="100">brand_name</th>
                            <th width="80">standard_price</th>
                            <th width="80">quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr style="background-color: rgb(204, 204, 204)">
                            <td></td>
                            <td>
                                <el-select v-model="external_product_id_type_value_0" @change="select_product_type">
                                    <el-option v-for="(item, index) in external_product_id_type_0" :key="index"
                                               :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td></td>
                            <td>
                                <el-input v-model="brand_name" @blur="brand_name_update"></el-input>
                            </td>
                            <td>
                                <el-input type="number" v-model="standard_price" @blur="standard_price_update"></el-input>
                            </td>
                            <td>
                                <el-input type="number" v-model="quantity" @blur="quantity_update"></el-input>
                            </td>
                        </tr>
                        <tr v-for="(item, index) in extend_info" :key="index">
                            <td>{{item.sku}}</td>
                            <td>
                                <el-select v-model="item.external_product_id_type">
                                    <el-option v-for="(item, index) in external_product_id_type" :key="index"
                                               :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="item.external_product_id"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.brand_name"></el-input>
                            </td>
                            <td>
                                <el-input type="number" v-model="item.standard_price"></el-input>
                            </td>
                            <td>
                                <el-input type="number" v-model="item.quantity"></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-form-item>
                <el-form-item label="Parent Seller SKU 刊登图片：" v-if="!isSingle">
                    <div v-for="(item, index) in parentImages" :key="index">
                        <p class="title-t" style="margin-left: 1px;"><span class="fr"><el-checkbox
                            :value="true"></el-checkbox>被勾选的为 swatch_imag</span></p>
                        <img-add class="mt-sm" :id="id" v-model="item.images" :base-url="baseUrl"
                                 :show-swatch-img="false"
                                 :default-random="isRandom"></img-add>
                    </div>
                </el-form-item>
                <el-form-item label="Child Seller SKU 刊登图片：">
                    <div class="mb-sm" v-for="(item, index) in childImages" :key="index">
                        <p class="title-t" style="margin-left: 1px;">
                            本地 SKU：{{item.sku}}<span v-for="(value,i) in item.attribute" :key="index">，<span
                            v-for="(v, k, i) in value" :key="v">{{k}}：{{v}}</span></span>
                            <span class="fr"><el-checkbox :value="true"></el-checkbox>被勾选的为 swatch_imag</span>
                        </p>
                        <img-add class="mt-sm" :id="id" v-model="item.images" :base-url="baseUrl"
                                 :default-random="isRandom"
                                 :key="index"></img-add>
                    </div>
                </el-form-item>
                <el-form-item label="Product Description：">
                    <div>
                        <div style="width: 941px">
                            <html-editor v-model="description" editid="11"></html-editor>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="add">确认</el-button>
                <el-button size="mini" @click="cancel">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>

<style lang="stylus">
    .p-publish {

    .p-publish-table {

    td, th {
        padding: 3px 5px;
        border-bottom: 1px solid #C0CCDA;
        border-right: 1px solid #C0CCDA;
        text-align: center;
    }

    th {
        border-top: 1px solid #C0CCDA;
    }

    tr {
        height: 26px;

    td:first-child, th:first-child {
        border-left: 1px solid #C0CCDA;
    }

    }
    }
    .inner {
        width: 1200px !important;
    }

    .title-t {
        padding: 0;
        margin: 0;
        background: #EFF2F7;
        display: block;
        height: 30px;
        line-height: 30px;
        width: 961px;
    }

    .fr {
        float: right;
        height: 30px;
        line-height: 30px;
    }

    .copy-img {
        color: #1D8CE0;
        cursor: pointer;
    }

    }
</style>
<script>
    import {api_git_img} from '../../../../api/amazon-publish'
    import {
        api_amazon_get_product,
        api_amazon_add_product,
        api_amazon_edit_product
    } from '../../../../api/amazon-publish'
    export default{
        data(){
            return {
                visible: false,
                host: config.apiHost,
                parentImages: [],
                childImages: [],
                fromData: {},
                point_1: '',
                point_2: '',
                point_3: '',
                point_4: '',
                point_5: '',
                flag: '',
                generic_keywords: '',
                generic_keywords_1: '',
                generic_keywords_2: '',
                generic_keywords_3: '',
                generic_keywords_4: '',
                generic_keywords_5: '',
                description: '',
                baseUrl: '',
                isSingle: false,
                singleSku: '',
                isEdit: false,
                external_product_id_type_value_0: 0,
                external_product_id_type_value: '',
                external_product_id: '',
                brand_name: '',
                standard_price: '',
                quantity: '',
                external_product_id_type_0: [
                    {
                        label: '请选择',
                        value: 0
                    },
                    {
                        label: 'UPC',
                        value: 'upc'
                    },
                    {
                        label: 'ENA',
                        value: 'ena'
                    },
                    {
                        label: 'GCID',
                        value: 'gcid'
                    },
                    {
                        label: 'GTIN',
                        value: 'gtin'
                    }
                ],
                external_product_id_type: [
                    {
                        label: 'UPC',
                        value: 'upc'
                    },
                    {
                        label: 'ENA',
                        value: 'ena'
                    },
                    {
                        label: 'GCID',
                        value: 'gcid'
                    },
                    {
                        label: 'GTIN',
                        value: 'gtin'
                    }
                ],
                extend_info: []
            }
        },
        methods: {
            init(){
                this.$http(api_amazon_get_product, this.id).then(res => {
                    this.baseUrl = res.baseUrl;
                    this.fromData = res;
                    console.log("res.description", res.description);
                    this.description ="<p>"+ res.description.replace(/\r/g,'<br/>') +"</p>";
                    console.log(" this.description",  this.description);

                    this.extend_info = Object.keys(this.fromData.attributes_images);
                    console.log("extend_info", this.extend_info);
                    this.extend_info = this.extend_info.map(res => {
                        return {
                            sku: res,
                            external_product_id_type: 'upc',
                            external_product_id: '',
                            brand_name: '',
                            standard_price: '',
                            quantity: ''
                        }
                    });
                    this.extend_info = this.extend_info.filter(item => {
                        return item.sku !== '0'
                    });

                    this.fromData.attributes_images = Object.values(this.fromData.attributes_images);
                    this.fromData.search_terms.forEach((item, index) => {
                        this['generic_keywords_' + (index + 1)] = item;
                    });
                    this.data_computed();

                    if (!!res.id) {
                        this.$confirm('该产品已经添加到导出列表，是否继续编辑?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '编辑'
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                            this.visible = false;
                        });

                        this.isEdit = true;
                        this.edit_data();
                    }

                })
            },
            splice_image(imagelist,length){
                imagelist.forEach(row=>{
                    if(row.images.length>20){
                        row.images = row.images.splice(length,row.images.length-1);
                    }
                });
                return imagelist;
            },
            data_computed(){
                let data = this.fromData.attributes_images || [];
                if (data.length === 0) {
                    this.parentImages = []
                } else if (data.length === 1) {
                    this.isSingle = true;
                    //this.parentImages.push(data[0]);
                    this.childImages.push(data[0]);
                    this.singleSku = data[0] && data[0].sku
                } else {
                    let arr = [...data];
                    let splitarr = arr.splice(0, 1);
                    splitarr =  this.splice_image(splitarr,20);
                    this.parentImages.push(...splitarr);
                    this.childImages = this.splice_image(arr,20);
                }

                if (!this.edit) {
                    this.parentImages[0].images && this.parentImages[0].images.forEach(res => {
                        this.$set(res, 'isSwatch', false)
                    });
                    this.childImages.forEach(item => {
                        item.images && item.images.forEach(res => {
                            this.$set(res, 'isSwatch', false)
                        })
                    })
                }
            },
            add(){

                if (this.fromData.name.length > 120) {
                    this.$message({
                        type: "error",
                        message: 'Product Name超过最大字数限制'
                    });

                    return
                }
                let extend_info_obj = {};
                this.extend_info.forEach(item=>{
                    extend_info_obj[item.sku] = item;
                });
                this.$set(this.fromData,'extend_info', extend_info_obj);

                this.fromData.bullet_point = [this.point_1, this.point_2, this.point_3, this.point_4, this.point_5];
                this.fromData.search_terms = [this.generic_keywords_1, this.generic_keywords_2, this.generic_keywords_3, this.generic_keywords_4, this.generic_keywords_5];


                let str = this.description.replace(/<p>/g, '');
                str = str.replace(/<\/p>/g, '<br/>');
                console.log('br');
                this.description = str;
                console.log("str", str);
                this.fromData.description = str;

                console.log(this.parentImages);
                console.log(this.childImages);

                console.log(this.fromData);

                let data = window.clone(this.fromData);
                let attrArr = [...this.parentImages, ...this.childImages];
                let attrObj = {};
                attrArr.forEach((item, index) => {
                    if (index === 0) {
                        attrObj[0] = item;
                    } else {
                        attrObj[item.sku] = item
                    }
                });
                data.attributes_images = attrObj;

                if (this.edit || this.isEdit) {
                    return this.$http(api_amazon_edit_product, this.id, data).then(res => {
                        this.visible = false;
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.$emit('list-edit', data);
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    })
                } else {
                     return this.$http(api_amazon_add_product, data).then(res => {
                        this.visible = false;
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        })
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    })
                }

            },
            cancel(){
                this.visible = false;
            },
            copy_img(){
                let imgs = window.clone(this.childImages);
                this.childImages2 = imgs;
            },
            //首字母大写
            initial_uppercase(){
                if (!this.fromData.name) return this.$message({message: "请输入刊登标题", type: 'warning'});
                let name = this.fromData.name.split(/\s+/);
                name = name.map(row => {
                    row = this.up_first_letter(row);
                    return row;
                });
                this.fromData.name = name.join(' ');
            },
            up_first_letter(str){
                return str.substring(0, 1).toUpperCase() + str.substring(1);
            },
            edit_data(){
                this.if_edit();
                this.img_join();
            },
            if_edit(){
                this.fromData.bullet_point.forEach((item, index) => {
                    this['point_' + (index + 1)] = item;
                });
                this.fromData.search_terms.forEach((item, index) => {
                    this['generic_keywords_' + (index + 1)] = item;
                });
            },
            img_join(){
                this.$http(api_git_img, this.id, {channel_id: 4}).then(res => {
                    let arr = [];
                    res.forEach(item => {
                        arr = [...arr, ...item.images]
                    });
                    arr.filter(item => {
                        return item.is_default !== 4;
                    });
                    this.parentImages.forEach(imgs => {
                        arr.forEach(item => {
                            let find = imgs.images.find(row => {
                                return row.id === item.id;
                            });
                            if (!find) {
                                this.$set(item, 'isSwatch', false);
                                let obj = window.clone(item)
                                imgs.images.push(obj);
                            }
                        });
                    });
                    this.childImages.forEach(imgs => {
                        arr.forEach(item => {
                            let find = imgs.images.find(row => {
                                return row.id === item.id;
                            });
                            if (!find) {
                                this.$set(item, 'isSwatch', false);
                                let obj = window.clone(item);
                                imgs.images.push(obj);
                            }
                        });
                    })
                });
            },
            select_product_type(val){
                if (val !== 0) {
                    this.extend_info.forEach(item => {
                        item.external_product_id_type = val;
                    })
                }
            },
            brand_name_update(){
                this.extend_info.forEach(item => {
                    item.brand_name = this.brand_name;
                })
            },
            standard_price_update(){
                this.extend_info.forEach(item => {
                    item.standard_price = this.standard_price;
                })
            },
            standard_price_change(value){
                value = Number(value);
                this.standard_price = value.toFixed(2);
            },
            quantity_update(){
                this.extend_info.forEach(item => {
                    item.quantity = this.quantity;
                })
            },
            quantity_change(value){
                value = Number(value);
                this.quantity = value.toFixed(0)
            }
        },
        created(){

        },
        filters: {},
        mounted(){

        },
        updated(){

        },
        destroy(){

        },
        computed: {
            isRandom(){
                return !this.edit;
            }
        },
        watch: {
            value(val){
                this.visible = val;
                if (val) {
                    this.isEdit = false;
                    this.fromData = {};
                    this.parentImages = [];
                    this.childImages = [];
                    this.point_1 = '';
                    this.point_2 = '';
                    this.point_3 = '';
                    this.point_4 = '';
                    this.point_5 = '';
                    this.generic_keywords_1 = '';
                    this.generic_keywords_2 = '';
                    this.generic_keywords_3 = '';
                    this.generic_keywords_4 = '';
                    this.generic_keywords_5 = '';
                    this.generic_keywords = '';
                    this.description = '';
                    this.external_product_id_type_value_0= 0;
                    this.external_product_id_type_value= '';
                    this.external_product_id= '';
                    this.brand_name= '';
                    this.standard_price= '';
                    this.quantity= '';
                    if (this.edit) {
                        this.fromData = this.editData;
                        this.baseUrl = this.editData.baseUrl;
                        this.fromData.attributes_images = Object.values(this.fromData.attributes_images);
                        this.description = "<p>"+ this.editData.description +"</p>";
                        console.log("edit this.description", this.description);
                        this.data_computed();
                        this.edit_data();
                        this.extend_info = this.fromData.extend_info && Object.values(this.fromData.extend_info) || [];
                    } else {
                        this.init()
                    }

                }
            },
            visible(val){
                this.$emit('input', val)
            }
        },
        props: {
            value: {},
            id: {},//goods_id
            editData: {},
            edit: {
                default(){
                    return false
                }
            }
        },
        components: {
            //integerInput: require("../../../../components/integer-input.vue").default,
            pageDialog: require('../../../../components/page-dialog.vue').default,
            limitInput: require('../../ebay/kandeng-list/add-edit-listing/limit-input.vue').default,
            imgAdd: require('../../../../components/img-add.vue').default,
            htmlEditor: require("./only-blod-edit.vue").default,

        }
    }
</script>

