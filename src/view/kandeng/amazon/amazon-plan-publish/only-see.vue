<template>
    <page class="p-only-see">
        <page-dialog title="查看" v-model="visible" size="large" :close-on-click-modal="false">
            <p><span class="see-label">本地 SPU：</span><span>{{row.spu}}</span></p>
            <p v-if="isSingle"><span class="see-label">本地 SKU：</span>{{row.attributes_images && row.attributes_images[0].sku}}<span></span></p>
            <p><span class="see-label">Product Name：</span><span>{{row.name}}</span></p>
            <div>
                <div style="display: inline-block; width: 400px;vertical-align: top">
                    <span class="see-label">Bullet-Point：</span>
                    <div style="display: inline-block">
                        <p v-for="(item, index) in row.bullet_point" :key="index">{{item}}</p>
                    </div>
                </div>
                <div style="display: inline-block; width: 400px;vertical-align: top">
                    <span class="see-label">Generic Keywords：</span>
                    <div style="display: inline-block">
                        <p v-for="(item, index) in (row.search_terms && row.search_terms)" :key="index">{{item}}</p>
                    </div>
                </div>
            </div>
            <div>
                <span class="see-label"></span>
                <div style="display: inline-block;max-width: 880px;">
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
                        <tr v-for="(item, index) in extend_info" :key="index">
                            <td>{{item.sku}}</td>
                            <td>
                                <!--<el-select v-model="item.external_product_id_type" disabled size="mini">-->
                                    <!--<el-option v-for="(item, index) in external_product_id_type" :key="index"-->
                                               <!--:label="item.label" :value="item.value">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->
                                <!--<el-input v-model="item.external_product_id_type" disabled></el-input>-->
                                <span>{{item.external_product_id_type}}</span>
                            </td>
                            <td>
                                <!--<el-input v-model="item.external_product_id" disabled></el-input>-->
                                <span>{{item.external_product_id}}</span>
                            </td>
                            <td>
                                <!--<el-input v-model="item.brand_name" disabled></el-input>-->
                                <span>{{item.brand_name}}</span>
                            </td>
                            <td>
                                <!--<el-input v-model="item.standard_price" disabled></el-input>-->
                                <span>{{item.standard_price}}</span>
                            </td>
                            <td>
                                <!--<el-input v-model="item.quantity" disabled></el-input>-->
                                <span>{{item.quantity}}</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <span class="see-label">Parent Seller SKU 刊登图片：</span>
                <div style="display: inline-block;width: 880px;">
                    <p></p>
                    <ul>
                        <li class="img-box"
                            v-for="(item, index) in (row.attributes_images && row.attributes_images[0].images)"
                            :key="index" @click="search(item.path)">
                            <img :src="url_join(item.path)" :alt="item.alt" :title="item.alt">
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <span class="see-label">Child Seller SKU 刊登图片：</span>
                <div style="display: inline-block;max-width: 880px;">
                    <div v-for="(item, key, index) in row.attributes_images" :key="index" v-show="index!==0" class="index">
                        <p class="title-t" style="margin-left: 3px;">
                            本地 SKU:{{item.sku}}<span v-for="(value,i) in item.attribute" :key="index">，<span v-for="(v, k) in value" :key="v">{{k}}:{{v}}</span></span>
                        </p>
                        <ul>
                            <li class="img-box"
                                v-for="(item, i) in item.images"
                                :key="i" @click="search(item.path)">
                                <img :src="url_join(item.path)" :alt="item.alt" :title="item.alt">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <span class=see-label>Product Description：</span>
            <div class="product-info" style="display: inline-block;max-width: 880px;line-height: 30px" v-html="row.description"></div>
            <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        </page-dialog>
    </page>
</template>

<style lang="stylus" type="text/stylus">
    .p-only-see{
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
        p{
            padding:0;
            margin: 0;
        }
        span{
            display: inline-block;
        }
        p, span{
           line-height: 30px;
        }
        .inner{
            width: 1200px!important;
        }
        .title-t {
            padding: 0;
            margin: 0;
            background: #EFF2F7;
            display: block;
            height: 30px;
            line-height: 30px;
            width: 863px;
        }
        .see-label {
            width: 180px;
            display: inline-block;
            text-align: right;
            vertical-align: top;
        }
        .img-box{
            width: 100px;height: 100px;border: 1px solid #aaa;display: inline-block;
            margin: 3px;vertical-align: middle}
        }
        .product-info {
            word-wrap:break-word; word-break:normal;

    }

</style>
<script>
import {api_amazon_product_export} from '../../../../api/amazon-publish'
    export default{
        data(){
            return {
                visible: false,
                imgPath:'',
                imgDialog:'',
                row:'',
                extend_info:[]
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
        methods: {
            init(){
                this.$http(api_amazon_product_export,this.id).then(res=>{
                    this.row = res;
                    this.extend_info = res.extend_info && Object.values(res.extend_info) || [];
                })
            },
            test(){
                console.log("test", this.row);
            },
            url_join(path = '', size='_100x100.'){
                let isBlob = path.includes('blob:');
                if(isBlob) return path;
                let bl = path.includes('http://');
                let index = path.lastIndexOf('.');
                let arr = [...path];
                arr.splice(index,1, size);
                let str = arr.join('');
                return bl?str:this.baseUrl+str;
            },
            search(image){
                this.imgPath = this.url_join(image,'_500x500.');
                this.imgDialog = true;
            },
        },
        computed: {
            isSingle(){
               return this.row.attributes_images && this.row.attributes_images.length === 1
            }
        },
        watch: {
            value(val){
                this.visible = val;
                if(val){
                    this.init();
                }
            },
            visible(val){
                this.$emit('input', val)
            }
        },
        props: {
            value: {},
            baseUrl: {},
            id:{}
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,

        }
    }
</script>

