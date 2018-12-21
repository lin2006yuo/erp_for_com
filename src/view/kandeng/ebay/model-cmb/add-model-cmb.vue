<template>
    <div class="c-add-model-cmb">
        <page-dialig v-model="dialog"
                     @change="click_dialog"
                     size="large"
                     width="40%" left="30%"
                     :title="title"
                     :close-on-click-modal="false">
            <el-form :model="form" ref="form" :rules="rules" label-width="255px">
                <el-form-item label="模块组合名称：" prop="model_name">
                    <el-input class="inline width-super" v-model="form.model_name" placeholder="请输入模块组合名称"></el-input>
                </el-form-item>
                <el-form-item label="站点：" prop="site">
                    <el-select class="inline width-super"
                               ref="cursite"
                               v-mouse-side.mousewheel="()=>{$refs.cursite.visible = false}"
                               v-model="form.site"
                               filterable clearable
                               @change="change_site"
                               :disabled="siteList.length<=0"
                               :placeholder="m_placeholder(siteList,'站点')">
                        <el-option
                                :key="item.value"
                                v-for="item in siteList"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="刊登风格：">
                    <el-select class="inline width-super"
                               ref="curstyle"
                               v-mouse-side.mousewheel="()=>{$refs.curstyle.visible = false}"
                               v-model="form.style"
                               filterable clearable
                               :disabled="styleList.length<=0"
                               :placeholder="m_placeholder(styleList,'刊登风格')">
                        <el-option
                            :key="item.value"
                            v-for="item in styleList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售说明：">
                    <el-select class="inline width-super"
                               ref="sale"
                               v-mouse-side.mousewheel="()=>{$refs.sale.visible = false}"
                               v-model="form.sale"
                               filterable clearable
                               :disabled="saleList.length<=0"
                               :placeholder="m_placeholder(saleList,'销售说明')">
                        <el-option
                            :key="item.value"
                            v-for="item in saleList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联促销：">
                    <el-select class="inline width-super"
                               ref="promotion"
                               v-mouse-side.mousewheel="()=>{$refs.promotion.visible = false}"
                               v-model="form.promotion"
                               filterable clearable
                               :disabled="promotionList.length<=0"
                               :placeholder="m_placeholder(promotionList,'关联促销')">
                        <el-option
                            :key="item.value"
                            v-for="item in promotionList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流设置：">
                    <el-select class="inline width-super"
                               ref="trans"
                               v-mouse-side.mousewheel="()=>{$refs.trans.visible = false}"
                               v-model="form.trans"
                               filterable clearable
                               :disabled="transList.length<=0"
                               :placeholder="comPlaceholder(transList,'物流设置')">
                        <el-option
                            :key="item.value"
                            v-for="item in transList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="不运送地区：">
                    <el-select class="inline width-super"
                               ref="exclude"
                               v-mouse-side.mousewheel="()=>{$refs.exclude.visible = false}"
                               v-model="form.exclude"
                               filterable clearable
                               :disabled="excludeList.length<=0"
                               :placeholder="comPlaceholder(excludeList,'不运送地区')">
                        <el-option
                            :key="item.value"
                            v-for="item in excludeList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备货时间：">
                    <el-select class="inline width-super"
                               ref="choice"
                               v-mouse-side.mousewheel="()=>{$refs.choice.visible = false}"
                               v-model="form.choice"
                               filterable clearable
                               :disabled="choiceList.length<=0"
                               :placeholder="m_placeholder(choiceList,'备货时间')">
                        <el-option
                            :key="item.value"
                            v-for="item in choiceList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上门提货(Local Pickup)：">
                    <el-select class="inline width-super"
                               ref="pickup"
                               v-mouse-side.mousewheel="()=>{$refs.pickup.visible = false}"
                               v-model="form.pickup"
                               filterable clearable
                               :disabled="pickupList.length<=0"
                               :placeholder="m_placeholder(pickupList,'上门提货')">
                        <el-option
                            :key="item.value"
                            v-for="item in pickupList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品所在地：">
                    <el-select class="inline width-super"
                               ref="location"
                               v-mouse-side.mousewheel="()=>{$refs.location.visible = false}"
                               v-model="form.location"
                               filterable clearable
                               :disabled="locationList.length<=0"
                               :placeholder="m_placeholder(locationList,'商品所在地')">
                        <el-option
                            :key="item.value"
                            v-for="item in locationList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="橱窗展示(Gallery)图片：">
                    <el-select class="inline width-super"
                               ref="gallery"
                               v-mouse-side.mousewheel="()=>{$refs.gallery.visible = false}"
                               v-model="form.gallery"
                               filterable clearable
                               :disabled="galleryList.length<=0"
                               :placeholder="m_placeholder(galleryList,'橱窗展示图片')">
                        <el-option
                            :key="item.value"
                            v-for="item in galleryList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="私人物品(Private Listing)：">
                    <el-select class="inline width-super"
                               ref="individual"
                               v-mouse-side.mousewheel="()=>{$refs.individual.visible = false}"
                               v-model="form.individual"
                               filterable clearable
                               :disabled="individualList.length<=0"
                               :placeholder="m_placeholder(individualList,'私人物品')">
                        <el-option
                            :key="item.value"
                            v-for="item in individualList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="买家限制：">
                    <el-select class="inline width-super"
                               ref="refuse"
                               v-mouse-side.mousewheel="()=>{$refs.refuse.visible = false}"
                               v-model="form.refuse"
                               filterable clearable
                               :disabled="refuseList.length<=0"
                               :placeholder="m_placeholder(refuseList,'买家限制')">
                        <el-option
                            :key="item.value"
                            v-for="item in refuseList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退货：">
                    <el-select class="inline width-super"
                               ref="returngoods"
                               v-mouse-side.mousewheel="()=>{$refs.returngoods.visible = false}"
                               v-model="form.returngoods"
                               filterable clearable
                               :disabled="returngoodsList.length<=0"
                               :placeholder="m_placeholder(returngoodsList,'退货')">
                        <el-option
                            :key="item.value"
                            v-for="item in returngoodsList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款选项：">
                    <el-select  class="inline width-super"
                                ref="receivables"
                                v-mouse-side.mousewheel="()=>{$refs.receivables.visible = false}"
                                v-model="form.receivables"
                                :disabled="receivablesList.length<=0"
                                filterable clearable
                                :placeholder="comPlaceholder(receivablesList,'收款选项')">
                        <el-option
                            :key="item.value"
                            v-for="item in receivablesList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接受买家还价(Best Offer)：">
                    <el-select  class="inline width-super"
                                ref="bargaining"
                                v-mouse-side.mousewheel="()=>{$refs.bargaining.visible = false}"
                                v-model="form.bargaining"
                                :disabled="bargainingList.length<=0"
                                filterable clearable
                                :placeholder="comPlaceholder(bargainingList,'接受买家还价')">
                        <el-option
                            :key="item.value"
                            v-for="item in bargainingList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <label style="display: block">（小提示：此选项只作用于卖家出售方式为：一口价/Fixed price。）</label>
                </el-form-item>
                <el-form-item label="数量：">
                    <el-select  class="inline width-super"
                                ref="quantity"
                                v-mouse-side.mousewheel="()=>{$refs.quantity.visible = false}"
                                v-model="form.quantity"
                                filterable clearable
                                :disabled="quantityList.length<=0"
                                :placeholder="m_placeholder(quantityList,'数量')">
                        <el-option
                            :key="item.value"
                            v-for="item in quantityList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <permission
                        tag="ElButton"
                        :route="apis.url_save_combList"
                        type="primary"
                        size="mini"
                        @click.native="add">确定</permission>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialig>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_save_combList,api_get_account,api_common_modeList,api_get_promotion_list,api_get_stylelist,api_get_ebay_site} from '../../../../api/ebay-kandeng-public-module';
    import {url_save_combList} from '../../../../api/ebay-kandeng-public-module';
    export default{
        permission:{
            url_save_combList
        },
        data(){
            return {
                accountList:[],
                dialog:this.value,
                styleList:[],
                saleList:[],
                promotionList:[],
                transList:[],
                excludeList:[],
                choiceList:[],
                pickupList:[],
                locationList:[],
                galleryList:[],
                individualList:[],
                refuseList:[],
                receivablesList:[],
                bargainingList:[],
                quantityList:[],
                returngoodsList:[],
                rules:{
                    model_name:[
                        {required:true,message:"模块组合名称为必填",trigger:'blur,change'}
                    ],
//                    ebay_account:[
//                        {required:true,message:"eBay账号为单个账号",trigger:'blur,change',type:'number'}
//                    ],
                    site:[
                        {required:true,message:"站点为必选",trigger:'blur,change',type:'number'}
                    ]
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
            "form.site"(val){
                this.bargainingList = [];
                this.form.bargaining="";
                this.excludeList = [];
                this.form.exclude="";
                this.receivablesList = [];
                this.form.receivables = "";
                this.transList = [];
                this.form.trans = "";
                this.returngoodsList = [];
                this.form.returngoods = "";
                if(val==="")return;
                this.init_select_site(val);
            },
        },
        created(){
//            this.init_select();
        },
        methods:{
            change_site(val){
//                this.form.ebay_account = '';
//                this.get_ebay_account(val);
            },
            click_dialog(val){
                if(val) this.init_select();
            },
            comPlaceholder(Array,str){//有站点过滤
                if(this.form.site===""){
                    return "请先选择站点"
                }else if(this.form.site&&Array.length<=0){
                    return "该站点下暂无数据"
                }else{
                    return `请选择${str}`;
                }
            },
            m_placeholder(Array,str){
                if(Array.length<=0){
                    return "暂无数据";
                }else{
                    return `请选择${str}`
                }
            },
            /*添加 && 取消*/
            add(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let curForm = window.clone(this.form);
                        let detail = [];
                        curForm.type = 'comb';
                        detail.push(curForm);
                        let params = {
                            model_type:'comb',
                        };
                        params.detail = JSON.stringify(detail);
                       return this.$http(api_save_combList,params).then(res=>{
                            this.$message(res.message);
                            this.dialog = false;
                            this.$emit("add",res.data);
                            return Promise.resolve();
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'});
                        });
                    }
                })
            },
            cancel(){
                this.dialog = false;
            },

            /*调取下拉框 除站点&&账号之外的所有数据*/
            init_select(){//无站点项
                let params = ["sale","choice","promotion","style","counter","gallery","pickup","location","individual","quantity","refuse"];
                params.forEach((row)=>{
                    let curApi;
                    let cur= [];
                    if(row==='style'){
                        curApi = api_get_stylelist;
                    }else if(row==='promotion'){
                        curApi = api_get_promotion_list;
                    }else{
                        curApi = api_common_modeList;
                    }
                    this.$http(curApi,{model_type:row}).then(res=>{
                         cur = res.data.map((item)=>{
                            return {
                                label:item.model_name,
                                value:item.id,
                            }
                        });
                        switch(row){
                            case 'sale':
                                this.saleList = cur;
                                break;
                            case 'choice':
                                this.choiceList = cur;
                                break;
                            case 'promotion':
                                this.promotionList = cur;
                                break;
                            case 'style':
                                this.styleList = cur;
                                break;
                            case 'counter'://计数器  暂时没有
                                this.counterList = cur;
                                break;
                            case 'gallery':
                                this.galleryList = cur;
                                break;
                            case 'pickup':
                                this.pickupList = cur;
                                break;
                            case 'location':
                                this.locationList = cur;
                                break;
                            case 'individual':
                                this.individualList = cur;
                                break;
                            case 'quantity':
                                this.quantityList = cur;
                                break;
                            case 'refuse':
                                this.refuseList = cur;
                                break;
                        }
                    }).catch(code=>{
                        console.log(code);
                    });
                })
            },
            init_select_site(val){//有站点
                let params = ["bargaining","exclude","receivables","returngoods","trans"];
                params.forEach((row)=>{
                    let curApi;
                    let cur= [];
                    let params ={
                        model_type:row,
                        site:val
                    };
                    curApi = api_common_modeList;
                    this.$http(curApi,params).then(res=>{
                        cur = res.data.map((item)=>{
                            return {
                                label:item.model_name,
                                value:item.id,
                            }
                        });
                        switch(row){
                            case 'bargaining':
                                this.bargainingList = cur;
                                break;
                            case 'exclude':
                                this.excludeList = cur;
                                break;
                            case 'receivables':
                                this.receivablesList = cur;
                                break;
                            case 'returngoods':
                                this.returngoodsList = cur;
                                break;
                            case 'trans':
                                this.transList = cur;
                                break;
                        }
                    }).catch(code=>{
                        console.log(code);
                    });
                })
            },
            /*账号  API*/
            get_ebay_account(val){
                this.accountList = [];
                if(val==='')return;
                this.$http(api_get_account,{site:val}).then(res=>{//接口--》曾
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            value:{},
            title:{
                required:true,
                type:String
            },
            form:{
                required:true,
                type:Object
            },
            siteList:{
                required:true,
                type:Array
            },
//            accountList:{
//                required:true,
//                type:Array
//            }

        },
        components: {
            pageDialig:require('../../../../components/page-dialog.vue').default,
        }
    }
    </script>
