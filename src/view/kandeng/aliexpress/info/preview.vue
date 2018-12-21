<template>
    <page class="p-preview over-flow-auto">
        <div class="p-preview-container" height="2000px">
            <el-row class="bg-white">
                <el-col :span="12" style="border-right: 1px solid #efefef;">
                    <div style="padding:20px;">
                        <img :src="mainImg" width="100%" height="100%"/>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="title">{{formData.pTitle}}</div>
                    <el-row class="p-md">
                        <el-col :span="6">
                            price:
                        </el-col>
                        <el-col :span="18">
                            <div>{{formData.currencyCode}} {{showPrice}} / {{minProductUnit}}</div>
                            <div>Find more detail on the app</div>
                        </el-col>
                    </el-row>
                    <el-row class="p-md" v-for="(item,i) in formData.listing_info" :key="i" v-if="info_show(i)">
                        <div v-for="(sku_attr,sku_attr_i) in formData.sku_attr_info" :key="sku_attr_i">
                            <div v-for="(attr,attr_i) in item.sku_attributes" :key="attr_i">
                                <div v-if="sku_attr.id===attr.ali_attr_id&&sku_attr.is_checked" style="height:40px;">
                                    <el-col :span="6" v-if="sku_attr.names_en">
                                        {{sku_attr.names_en}}:
                                    </el-col>
                                    <el-col :span="18">
                                        <span v-if="at.customized_pic&&at.customized_pic===1&&sku_attr.id===at.ali_attr_id" class="mr-sm"
                                              v-for="(at,it_i) in attrArr" :key="it_i">
                                             <img :src="change_img(at.custom_pic)"
                                                  :title="at.code||at.propertyValueDefinitionName" width="40px" height="40px"/>
                                        </span>
                                        <span v-if="!at.customized_pic&&sku_attr.id===at.ali_attr_id" class="mr-sm"
                                              v-for="(at,it_i) in attrArr" :key="it_i">
                                             <i class="tag-size">
                                                {{get_size(at, sku_attr)}}
                                            </i>
                                        </span>
                                    </el-col>
                                    <!--<el-col :span="18">-->
                                        <!--<span v-if="attr.customized_pic&&attr.customized_pic===1" class="mr-sm "-->
                                              <!--v-for="(it,it_i) in formData.listing_info" :key="it_i">-->
                                             <!--<img v-for="(at,at_i) in it.sku_attributes" :key="at_i"-->
                                                  <!--:src="change_img(at.custom_pic)"-->
                                                  <!--:title="at.code" width="40px" height="40px"/>-->
                                        <!--</span>-->
                                        <!--<span class="mr-sm" v-if="!attr.customized_pic"-->
                                              <!--v-for="(it,it_i) in formData.listing_info" :key="it_i">-->
                                             <!--<i class="tag-size"-->
                                                <!--v-for="(at,at_i) in it.sku_attributes" :key="at_i"-->
                                                <!--v-if="sku_attr.id===at.ali_attr_id">-->
                                                <!--{{get_size(at, sku_attr)}}-->
                                            <!--</i>-->
                                        <!--</span>-->
                                    <!--</el-col>-->
                                </div>
                            </div>
                        </div>
                    </el-row>
                    <el-row
                        v-if="formData.delivery&&formData.delivery.length&&formData.delivery[0].list_val.length&&formData.delivery[0].is_checked"
                        style="padding: 0 20px;">
                        <el-col :span="6">
                            {{formData.delivery[0].names_en}}:
                        </el-col>
                        <el-col :span="18">
                            <span class="mr-sm">
                                <i v-for="(used,i) in deliveryArr" :key="i" class="tag-size">
                                    {{used}}
                                </i>
                            </span>
                        </el-col>
                    </el-row>
                    <div class="p-md">
                        <a class="p-preview-btn">Buy Now</a>
                        <a class="p-preview-btn p-preview-btn-add">Add to Cart</a>
                    </div>
                    <p class="add-to-wish">
                        Add to Wish List
                    </p>
                </el-col>
            </el-row>
            <el-row class="mt-sm">
                <el-col :span="4" class="p-preview-left">
                    <h5>Sold By</h5>
                    <h5>Store Name</h5>
                </el-col>
                <el-col :span="20" class="p-preview-right">
                    <ul class="menu">
                        <li>Product Details</li>
                        <li>Feedback</li>
                        <li>Shipping & Payment</li>
                        <li>Seller Guarantees</li>
                    </ul>
                    <div>
                        <p class="info-title">Item specifics</p>
                    </div>
                    <div>
                        <p class="info-title">Product Description</p>
                        <div v-html="infoRelevance" v-if="formData.relation_template_postion==='top'" style="margin:20px"></div>
                        <div v-html="userModuleContents" v-if="formData.custom_template_postion==='top'"  style="margin:20px"></div>
                        <div v-html="formData.description" style="word-wrap: break-word;margin:20px"></div>
                        <div v-html="infoRelevance" v-if="formData.relation_template_postion==='bottom'" style="margin:20px"></div>
                        <div v-html="userModuleContents" v-if="formData.custom_template_postion==='bottom'" style="margin:20px"></div>
                    </div>
                    <div>
                        <p class="info-title">Packaging Details</p>
                        <el-row style="margin:10px 20px;">
                            <el-col :span="12">
                                Unit Type:<span>{{minProductUnit}}</span>
                            </el-col>
                            <el-col :span="12">
                                Package Weight:<span>{{formData.grossWeight}}</span>
                            </el-col>
                        </el-row>
                        <el-row style="margin:10px 20px;">
                            <el-col :span="12">
                                Package Size:<span>{{packageSize}}</span>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
    </page>
</template>
<style lang="stylus">
    .p-preview {
        background: #EFEFEF;
        line-height: 1.5em;
        font-size: 1.2em;
        /*overflow-y: auto;*/
        .clearfix:after {
            content: ".";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden
        }
        .clearfix {
            zoom: 1;
        }
        .p-preview-container {
            width: 1300px;
            margin: 5px auto 0;
            .title {
                margin: 0 10px;
                padding 10px 0;
                line-height: 22px;
                font-size: 17px;
                border-bottom: 1px solid #efefef;
            }
            .p-md {
                padding: 10px 20px;
            }
            .add-to-wish {
                margin: 10px 20px;
                border-bottom: 1px solid #efefef;
            }
            .p-preview-btn {
                display: inline-block;
                line-height: 42px;
                text-align: center;
                font-size: 18px;
                background: #fd9729;
                color: #fff;
                padding: 0 35px;
                margin: 0 10px 5px 0
                border: 1px solid #fd9729;
                border-radius: 3px;
            }
            .p-preview-btn-add {
                background: #ff5400;
                padding: 0 30px;
                margin: 0 5px 5px 0;
            }
            .bg-white {
                background: #fff;
            }
            .p-preview-left {
                width: 16%;
                margin-right: 1%;
                background: #fff;
                padding-left:20px;
            }
            .p-preview-right {
                width: 83%;
                background: #fff;
                margin-bottom: 15px;
                .menu {
                    height: 45px;
                    background: #FFFBFF;
                    li {
                        float: left;
                        padding: 0 25px;
                        font-size: 16px;
                        line-height: 46px;
                        border-bottom: 1px solid #efefef;
                        &:first-child {
                            background: #fff;
                            border-bottom: 1px solid #fff;
                            border-right: 1px solid #efefef;
                        }
                    }
                }
                .info-title {
                    background: #EFEBEF;
                    margin: 20px;
                    height: 35px;
                    line-height: 35px;
                    padding-left: 20px;
                }
            }
            .tag-size {
                padding: 0 9px;
                border: 1px solid #999;
                font-style: normal;
            }
        }
    }
</style>
<script>
    import {
        api_aliexpress_productUnit,
    } from  "../../../../api/publish-smt"
    import {
        api_look_template,
        api_review
    } from "../../../../api/aliexpress-product-info"
    export default{
        data(){
            return {
                formData: '',
                priceOptions: [],
                attrArr:[],
                moduleContents:"",
                userModuleContents:"",
                infoRelevance:"",
                deliveryArr:[],
            }
        },
        mounted(){
            if (window.objlength(this.param) !== 0) {
                this.formData = this.param;
                this.process_attr();
                !!this.formData.relation_template_id&&this.get_template();
                !!this.formData.custom_template_id&&this.get_uesr_template();

            }
            this.$http(api_aliexpress_productUnit).then(res => {
                this.priceOptions = res;
            }).catch(code => {
                console.log(code)
            })
        },
        methods: {
            //整理没图片数据
            process_attr(){
            	this.attrArr = [];
                this.formData.listing_info.forEach(info => {
                    info.sku_attributes.forEach(skuAttr => {
                        let findskuattr = this.formData.sku_attr_info.find(ali_ids => {
                            return (ali_ids.id === skuAttr.ali_attr_id)&&ali_ids.is_checked;
                        });
                        if (findskuattr && findskuattr.is_checked) {
                            skuAttr.customized_name === 1 && (skuAttr.propertyValueDefinitionName = skuAttr.changeName||skuAttr.custom_name);
                            if(skuAttr.customized_pic === 1){
                                skuAttr.custom_pic = (info.d_imgs&&info.d_imgs.length&&info.d_imgs[0].path)||skuAttr.custom_pic;
                            }
                        }
                        let find = this.attrArr.find(row=>{
                            return row.ali_attr_id === skuAttr.ali_attr_id && row.ali_attr_val_id === skuAttr.ali_attr_val_id
                        });
                        if(!find){
                            this.attrArr.push(skuAttr);
                        }
                    });
                });
                if(!!this.formData.delivery[0]&&this.formData.delivery[0].used_vaules){
                    this.deliveryArr = this.formData.delivery[0].used_vaules.map(it=>{
                        let find = this.formData.delivery[0].list_val.find(de=>{
                            return de.id === it;
                        })
                        if(find){
                            return find.name_en;
                        }
                    })
                }
            },
            //整理有图片数据
            process_img(val){

            },
            info_show(val){
                return val === 0 ? true : false;
            },
            get_size(attr, sku_attr){
                if (attr.ali_attr_id === sku_attr.id) {
                    let find = sku_attr.list_val.find(row => {
                        return attr.ali_attr_val_id === row.id
                    });
                    if (!!find) {
                        return find.name_en
                    }
                }
            },
            change_img(val){
                if (!val) return "";
                if (val.indexOf("http") !== -1) {
                    return val;
                } else {
                    return this.formData.base_url + val;
                }
            },
            get_template(){
                this.$http(api_look_template,{id:this.formData.relation_template_id}).then(res=>{
                    this.moduleContents = res.module_contents;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            get_uesr_template(){
                this.$http(api_look_template,{id:this.formData.custom_template_id}).then(res=>{
                    this.userModuleContents = res.module_contents;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            get_view(){
                this.$http(api_review,{product_ids:this.product_ids}).then(res=>{
                    //this.modelVisible = false;
                    this.$emit("previewEditModel",res.data);
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                });
            },
        },
        computed:{
            mainImg(){
                if (this.formData.imgs && this.formData.imgs.length) {
                    let main = this.formData.imgs[0].path;
                    if (main.indexOf("http") !== -1) {
                        return main;
                    } else {
                        return this.formData.base_url + main;
                    }
                }
            },
            showPrice(){
                let arr = this.formData.listing_info && this.formData.listing_info.map(row => row.retail_price) || [];
                arr = arr.sort((a, b) => {
                    return a - b
                });
                if (!arr.length) {
                    return "暂无售价";
                }
                if (arr.length < 2) {
                    return arr[0];
                } else {
                    let min = arr[0];
                    let max = arr[arr.length - 1];
                    if (Number(min) === Number(max)) {
                        return min;
                    }
                    return arr[0] + " ~ " + arr[arr.length - 1];
                }
            },
            minProductUnit(){
                if (this.formData.productUnit) {
                    let find = this.priceOptions.find(row => {
                        return Number(row.id) === Number(this.formData.productUnit);
                    })
                    if (!!find) {
                        return find.name;
                    }
                }
            },
            packageSize(){
                let width = this.formData.packageWidth;
                let height = this.formData.packageHeight;
                let length = this.formData.packageLength;
                return length + 'cm * ' + width + 'cm * ' + height + 'cm';
            }
        },
        watch: {
            param(val){
//                console.log(6688,val)
            },
//            param:{
//                deep:true,
//                handler(val){
//                    if (window.objlength(val) !== 0) {
//                        this.formData = val;
//                    }
//                    console.log(6688)
//                },
//            },
            moduleContents(val){
                this.$http(api_review,{product_ids:val}).then(res=>{
                	this.infoRelevance = res.data;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                });
            }
        },
        components: {
        }
    }
</script>
