<template>
    <el-row class="p-attribute-set-wish">
        <div class="p-titleBgcol">
            <span class="p-attribute">SKU信息</span>
        </div>
        <div class="p-titleColour-attribute">
            <!--sku 属性-->
            <el-form  label-width="160px"
                      v-if="tableData.sku_attr_info&&tableData.sku_attr_info.length>0">
                <el-form-item  label="刊登产品对应属性：">
                    <div style="width: 60%">
                        <table class="template">
                            <tr>
                                <th>启用</th>
                                <th>平台属性</th>
                                <th>对应本地属性</th>
                                <th>选择平台属性值</th>
                            </tr>
                            <tr v-for="(item,i) in tableData.sku_attr_info" :key="i+`${item.id?item.id:''}`" class="mb-xs" >
                                <td>
                                    <el-checkbox v-model="checkShow" v-if="item.required"
                                                 :disabled="checkShow">
                                    </el-checkbox>
                                    <el-checkbox v-model="item.is_checked" v-else
                                                 @change="change_checkbox(item)">
                                    </el-checkbox>
                                </td>
                                <td> {{item.names_zh}}</td>
                                <td>
                                    <el-select v-model="item.attribute_id"
                                               style="max-width: 200px;margin: 0 auto"
                                               clearable
                                               @change="sku_local_attr_change($event,item)"
                                               placeholder="未绑定"
                                               :disabled="!item.is_checked" >
                                        <el-option
                                            v-for="(it,index) in locals"
                                            :key="index"
                                            :label="it.attribute_name"
                                            :value="it.attribute_id"
                                            :disabled="it.disable">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td></td>
                            </tr>
                            <template v-for="(item,i) in tableData.delivery">
                                <tr class="mb-xs" :key="i"  >
                                    <td>
                                        <el-checkbox v-model="item.is_checked">
                                        </el-checkbox>
                                    </td>
                                    <td> {{item.names_zh}}</td>
                                    <td> </td>
                                    <td>
                                        <!--发货地 特殊多选属性-->
                                        <el-select v-model="item.used_vaules" multiple placeholder="请选择" :disabled="!item.is_checked" @change="change_delivery(item)">
                                            <el-option
                                                v-for="(it,index) in item.list_val"
                                                :key="index"
                                                :label="it.name_zh"
                                                :value="it.id">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </div>
                    <span style="color: red">注意：系统会自动匹配平台属性，个别未匹配成功的，可手动添加匹配</span>
                </el-form-item>
            </el-form>
            <!--SKU列表-->
            <el-row>
                <el-button type="primary"
                           @click="add_sku"
                           size="mini" class="mb-xs mr-xs">添加SKU</el-button>
                <el-button type="primary" @click.native="priceVisible=true" size="mini" class="mb-xs ml-lg">价格计算器</el-button>
                <!-- 添加sku -->
                <add-goods v-model="addlistVisable" @add-goods="submit_sku"></add-goods>
                <!-- 捆绑sku -->
                <bundling-sales v-model="bundingDialog"
                                :data="transferData"
                                :is-fixed-price-item="true"
                                channel="4"
                                @submit="submit"></bundling-sales>
            </el-row>
            <table v-if="tableData.sku_attr_info&&tableData.listing_info"
                   border="1" style="border-collapse:collapse;" class="template">
                <tr>
                    <th></th>
                    <th v-if="isTime">本地SKU</th>
                    <th v-else>平台SKU</th>
                    <th>捆绑/打包销售</th>
                    <template v-for="loc_attr in tableData.local_attr">
                        <th>
                            <span>参考{{loc_attr.attribute_name|filterAttrName}}</span>
                        </th>
                    </template>
                    <template v-for="attr in tableData.sku_attr_info" v-if="attr.is_checked">
                        <th>
                            <span>
                                <span v-if="attr.required" class="c-r mr-mini">*</span>{{attr.names_zh}}
                            </span>
                        </th>
                    </template>
                    <th>
                        成本价￥/重量g
                    </th>
                    <!--<th v-if="showRef">-->
                        <!--<span>参考零售价</span>-->
                        <!--<div>（利{{grossProfit}},降{{reduction}}）</div>-->
                    <!--</th>-->
                    <template v-if="hasDelivery">
                        <th v-if="tableData.is_wholesale">起批量</th>
                        <th>&nbsp;发货地&nbsp;/&nbsp;价格&nbsp;/&nbsp;数量 &nbsp;<span v-if="tableData.is_wholesale">&nbsp;/&nbsp;批发价</span> </th>
                    </template>
                    <template v-if="!hasDelivery">
                        <th><span class="c-r">*</span> 零售价</th>
                        <th><span class="c-r">*</span> 可售数</th>
                    </template>
                    <th v-if="tableData.is_wholesale&&!hasDelivery">起批量</th>
                    <th v-if="tableData.is_wholesale&&!hasDelivery">批发价</th>
                    <th>操作</th>
                </tr>
                <tr style="background: #ccc;">
                    <td style="padding: 0 5px;"><el-checkbox v-model="tableCheck"></el-checkbox></td>
                    <td></td>
                    <td></td>
                    <template v-for="(loc_attr,i) in tableData.local_attr">
                        <td :key="i">
                        </td>
                    </template>
                    <template v-for="attr in tableData.sku_attr_info" v-if="attr.is_checked">
                        <td>
                            <el-select v-model="attr.allChange" placeholder="请选择"
                                       @change="(val)=>{attr_change(val,attr)}"
                                       class="inline width-sm">
                                <el-option
                                    v-for="(att,index) in attr.list_val"
                                    :key="index"
                                    :label="att.name_zh"
                                    :value="att.id">
                                </el-option>
                            </el-select>
                            <el-input :value="attr.change_value" @input="(value)=>{change_customize(value)}" class="inline width-sm" v-if="attr.customized_name&&attr.customized_name===1"></el-input>
                            <span v-if="attr.customized_pic&&attr.customized_pic===1">
                                <img class="inline mr-sm" src="../../../../assets/del-pic.png" width="17px" height="17px"
                                     style="cursor: pointer;margin-right: 3px;"
                                     @click="del_pic(attr)"
                                >
                                <img class="inline" src="../../../../assets/change.png" width="17px" height="17px"
                                     style="cursor: pointer;"
                                     @click="random_click"
                                     v-if="!trueId||isCopy"
                                >
                                <span class="inline" style="width: 17px;height: 17px;" v-else></span>
                            </span>
                        </td>
                    </template>
                    <td></td>
                    <!--<td v-if="showRef">-->
                    <!--</td>-->
                    <template v-if="hasDelivery">
                        <td v-if="tableData.is_wholesale">起批量</td>
                        <td>
                            <ui-limit-number v-model="price"
                                             style="width:80px"
                                             class="inline"
                                             :limit="2"
                                             @blur="change_all_price"
                            ></ui-limit-number>
                            <integer-input v-model="count" :min="0"
                                           class="inline"
                                           style="width:80px"
                                           @blur="change_all_stock"
                            ></integer-input>
                        </td>
                    </template>
                    <template v-if="!hasDelivery">
                        <td>
                            <ui-limit-number v-model="price"
                                             style="width:80px"
                                             class="inline"
                                             :limit="2"
                                             @blur="change_all_price"
                            ></ui-limit-number>
                        </td>
                        <td>
                            <integer-input v-model="count" :min="0"
                                           class="inline"
                                           style="width:80px"
                                           @blur="change_all_stock"
                            ></integer-input>
                        </td>
                    </template>
                    <td v-if="tableData.is_wholesale&&!hasDelivery"></td>
                    <td v-if="tableData.is_wholesale&&!hasDelivery"></td>
                    <td></td>
                </tr>
                <tr v-for="(row,row_i) in tableData.listing_info" :key="row_i+`${row_i.id?row_i.id:''}`">
                    <td style="padding: 0 5px;"><el-checkbox v-model="row.isCheck"></el-checkbox></td>
                    <td><span>{{row.sku}}</span></td>
                    <td><span class="operate" @click="bundling_sales(row,row_i)">{{row.combine_sku}}</span></td>
                    <template v-for="(loc_attr,i) in tableData.local_attr">
                        <td>
                            {{get_row_temp_attr(row,loc_attr)}}
                        </td>
                    </template>
                    <template v-for="(attr,attr_i) in tableData.sku_attr_info">
                        <td v-if="attr.is_checked">
                            <el-select :value="get_row_id(row,attr_i)"
                                       @input="(val)=>{set_attr(row,attr_i,val,row_i)}"
                                       clearable
                                       placeholder="请选择" class="inline width-sm" >
                                <el-option
                                    v-for="(att,index) in get_attrs(attr_i)"
                                    :key="index+`${att.id?att.id:''}`"
                                    :label="att.name_zh"
                                    :value="att.id">
                                </el-option>
                            </el-select>
                            <el-input :value="get_custom_name(row,attr)"
                                      @input="set_value($event,row,attr_i)"
                                      :maxlength="20"
                                      class="inline width-sm" v-if="attr.customized_name&&attr.customized_name===1"></el-input>
                            <div @click="change_row_image(row,row_i)" class="inline" v-if="attr.customized_pic&&attr.customized_pic===1">
                                <img :src="filter_path(row,attr_i)"
                                     height="26px"
                                     width="26px">
                                <i class="el-icon-edit mdfhove"></i>
                            </div>
                        </td>
                    </template>
                    <td>{{ to_fixed(row.cost_price) }} / {{row.weight || 0}}</td>
                    <!--<td v-if="showRef">-->
                        <!--{{get_ref_price(row)}}-->
                    <!--</td>-->
                    <template v-if="hasDelivery">
                        <td v-if="tableData.is_wholesale">{{row.count}}</td>
                        <td>
                            <div v-if='row.extend&&row.extend.length>0' v-for="(delive,delive_i) in row.extend" :key="delive_i+`${delive.id?delive.id:''}`"  class=""   :class="[delive_i=== row.extend.length-1?'':'mb-xs']">
                                <span style="display: inline-block;width: 60px;text-align: right">{{delive.name_zh}}:</span>
                                <ui-limit-number v-model="delive.retail_price"
                                                 style="width:80px"
                                                 :limit="2"
                                                 @keyup="change_singe_price(delive)"
                                                 class="inline">
                                </ui-limit-number>
                                <el-input-number size="small"
                                                 class="inline"
                                                 style="width:80px"
                                                 v-model="delive.ipm_sku_stock"
                                                 :debounce="0"
                                                 :controls="false">
                                </el-input-number>
                                <span v-if="tableData.is_wholesale">{{delive.batchPrice}}</span>
                            </div>
                        </td>
                    </template>
                    <template v-if="!hasDelivery">
                        <td>
                            <ui-limit-number v-model="row.retail_price"
                                             style="width:80px" :limit="2"
                                             class="inline"
                                             @keyup="change_row_price(row)">
                            </ui-limit-number>
                        </td>
                        <td>
                            <el-input-number size="small"
                                             style="width:80px"
                                             class="inline"
                                             v-model="row.ipm_sku_stock"
                                             :debounce="0"
                                             :controls="false">
                            </el-input-number>
                        </td>
                    </template>
                    <td v-if="tableData.is_wholesale&&!hasDelivery">{{row.count}}</td>
                    <td v-if="tableData.is_wholesale&&!hasDelivery">{{row.batchPrice}}</td>
                    <td><span class="operate" @click="del_sigle(row_i)">删除</span></td>
                </tr>
            </table>
            <el-form ref="form1" label-width="80px" class="mt-sm">
                <el-form-item>
                    <el-row class="mb-mini">
                        <el-checkbox class="inline" v-model="tableData.quote_config_status">区域调价</el-checkbox>&nbsp;&nbsp;
                        <div class="inline" v-if="tableData.quote_config_status">
                            <span class="inline">商品零售价作为基准价，开放部分“Ship to”区域，可在基准价基础上调整。</span>
                            <label class="inline ml-sm">分组：</label>
                            <el-select v-model="tableData.region_group_id"
                                       clearable
                                       class="s-width-small inline">
                                <el-option v-for="item in tableData.group_region"
                                           :key="item.region_group_id"
                                           @click.native="get_templates"
                                           :label="item.name"
                                           :value="item.region_group_id"></el-option>
                            </el-select>
                            <label class="inline ml-sm">区域模板：</label>
                            <el-select v-model="tableData.region_template_id"
                                       clearable
                                       @change="replace_template"
                                       class="s-width-small inline">
                                <el-option v-for="item in tableData.region_template"
                                           :key="item.region_template_id"
                                           :label="item.name"
                                           :value="item.region_template_id"></el-option>
                            </el-select>
                            <permission tag="request-button"
                                        :route="apis.url_publish_express_edit_region_template"
                                        :mintime="200"
                                        v-if="tableData.region_template_id"
                                        class="inline ml-sm"
                                        req-key="url_publish_express_edit_region_template"
                                        @click="update_template">更新
                            </permission>
                            <permission tag="ElButton"
                                        :route="apis.url_publish_express_add_region_template"
                                        size="mini"
                                        type="primary"
                                        v-else
                                        class="inline ml-sm"
                                        @click="save_as_template">另存为
                            </permission>
                            <permission tag="request-button"
                                        :route="apis.url_publish_express_delete_region_template"
                                        :mintime="200"
                                        class="inline ml-sm"
                                        req-key="url_publish_express_delete_region_template"
                                        @click="delete_template">删除
                            </permission>
                            <permission tag="ElButton"
                                        :route="apis.url_publish_express_add_region_template"
                                        size="mini"
                                        type="primary"
                                        class="inline ml-sm"
                                        @click="reset_template(true)">重置
                            </permission>
                        </div>
                        <span v-else>当前未启用。可针对多国设置不同得售价比例。</span>
                    </el-row>
                    <div style="width: 800px;margin-left:80px" v-show="tableData.quote_config_status">
                        <table class="template quote-config">
                            <tr>
                                <th width="15%">区域</th>
                                <th width="35%" class="el-th-adjust">
                                    <el-select v-model="tableData.configuration_type"
                                               @change="adjust_change"
                                               class="inline width-sm el-select-adjust">
                                        <el-option
                                            v-for="(item,index) in options"
                                            :key="index+item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <div class="inline" v-if="adjustValue===0">
                                    (-30% ~ +100%)
                                    </div>
                                </th>
                                <th width="25%">零售价</th>
                                <th width="25%">调后价格</th>
                            </tr>
                            <tr v-for="(percentage,index) in tableData.aeopNationalQuoteConfiguration" :key="`${percentage.id}+${index}`" class="mb-xs quote-with-select" >
                                <td>{{percentage.zh_name}}({{percentage.shiptoCountry}})</td>
                                <td>
                                    <ui-select-input :data="percentage"
                                                     v-if="adjustValue===0"
                                                     v-model="percentage.percentage"
                                                     :show-icon="true"
                                                     :is-limit-size="true"
                                                     :disabled="adjustValue===-1"
                                                     @apply-all="applyAll"
                                                     :units="units"
                                    ></ui-select-input>
                                    <ui-select-input :data="percentage"
                                                     v-else
                                                     v-model="percentage.relative"
                                                     :show-icon="true"
                                                     :disabled="adjustValue===-1"
                                                     @apply-all="applyAll"
                                                     :units="units"
                                    ></ui-select-input>
                                </td>
                                <td>USD {{salePrice}}</td>
                                <td>USD {{get_refPrice(percentage)}}</td>
                            </tr>
                        </table>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="tableData.is_wholesale"
                                 @change="change_batch_price">支持批发价，</el-checkbox>
                    <span>购买数量
                        <integer-input v-model="tableData.bulkOrder" :min="2"
                                       class="inline"
                                       style="width:80px"
                                       @blur="bulkOrder_blur"
                        ></integer-input>
                        及以上，每单位价格在零售价的基础上减免
                    <el-input-number size="small"
                                     :max="99"
                                     :min="1"
                                     :debounce="0"
                                     style="width: 50px"
                                     v-model="tableData.bulkDiscount"
                                     class="inline"
                                     @change="bulkDiscount_blur"
                                     :controls="false">
                    </el-input-number>%，即{{discount}}折
                </span>
                </el-form-item>
            </el-form>
            <!-- 修改主图 -->
            <mdf-img v-model="picVisable"
                     :cur-sku="skuName"
                     :img-form="imgTemp"
                     :show-tips="false"
                     :goods-id="goodsId"
                     :channel-id="4"
                     :defaultRandom="false"
                     @mdfimg-submit="mdfimg_submit"
                     :base-url="baseUrl"></mdf-img>
        </div>
        <!-- 价格计算器 -->
        <price-calculation v-model="priceVisible" :platform-information="platformInformation"></price-calculation>
        <save-template v-model="saveAsDialog"
                       @update-groups="get_groups"
                       @save-change="save_change"
                       :groups="tableData.group_region"
                       :form-data="formData"
                       :aeop-national-quote-configuration="tableData.aeopNationalQuoteConfiguration"></save-template>
    </el-row>
</template>
<style lang="stylus">
    .p-attribute-set-wish {
        .p-titleBgcol {
            background: #FAECE7;
            .p-attribute {
                color: #FFF;
                font-weight: bold;
                font-size: 1.7rem;
                padding: 5px 10px;
                background: #74BA4E;
                display: inline-block;
            }
        }
        .p-titleColour-attribute {
            padding: 20px;
            border-left: 3px solid #FF6C36;
            table{
                width: 100%;
                tr{
                    width: 100%;
                    td{
                        text-align: center;
                        vertical-align: middle;
                        padding: 2px 5px;
                    }
                }
            }
        }
        .quote-config .quote-with-select{
            width:160px;
            .el-select .el-input {
                width: 60px;
            }
            .input-with-select .el-input-group__prepend {
                background-color: #fff;
            }
        }
        .c-r{
            color: red;
        }
        .mr-mini {
            margin-right: 3px;
        }
        .el-th-adjust{
            text-align left;
            .el-select-adjust{
                margin-left 30px;
            }
        }
    }

</style>
<script>
    import {
        url_publish_express_add_region_group,
        url_publish_express_delete_region_template,
        url_publish_express_add_region_template,
        url_publish_express_edit_region_template,
        api_aliexpress_sku_listing,api_pricing_rules,
        api_publish_express_edit_region_template,
        api_publish_express_delete_region_template,
        api_get_publish_express_region_group,
        api_get_publish_express_region_template,
        api_get_publish_express_region_template_info
    } from "../../../../api/publish-smt"
    import {get_path,random_img} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        permission:{
            url_publish_express_add_region_group,
            url_publish_express_delete_region_template,
            url_publish_express_add_region_template,
            url_publish_express_edit_region_template
        },
        data(){
            return {
                skuName:'',
                change_pic:{
                    row_i:0,
                    attr_i:0,
                },
                priceVisible:false,
                platformInformation:{
                    platform:3,
                    platform_name: 'AliExpress'
                },
                temp: {},
                imgTemp:{},
                showRef:true,
                grossProfit:'10%',
                reduction:'5%',
                selects: [],
                price: "",
                count: "",
                picVisable:false,
                addlistVisable:false,
                references:[],
                AreaCheck:false,
                options:[
                    {
                        value: 'percentage',
                        label: '调价比例'
                    },
                   {
                       value: 'relative',
                       label: '调价金额'
                   },
                ],
                input5:"",
                select: '1',
                bundingDialog:false,
                transferData:[],
                goodsId:"",
                curIndex:'',
                checkShow:true,
                units:'%',
                saveAsDialog:false,
                formData:{
                    template_name:'',
                    region_group_id:'',
                    type:''
                }
            }
        },
        mounted(){
            if(this.tableData.listing_info&&this.tableData.listing_info.length>0){
//                this.init_reference(this.tableData.listing_info.map(row=>row.goods_sku_id));
                this.tableData.listing_info.forEach((row)=>{
                    row.sku_attributes.forEach(attr=>{
                        if(attr.customized_name&&attr.customized_name===1){
                            this.$set(attr,"changeName","");
                        }
                    })
                })
            }
            this.tableData.sku_attr_info&&this.tableData.sku_attr_info.length>0&&this.tableData.sku_attr_info.forEach(row=>{
                this.$set(row,"allChange","");
                this.$set(row,"change_value","");
            });
        },
        computed: {
            adjustValue(){
                switch (this.tableData.configuration_type){
                    case '':
                        return -1;
                        break;
                    case 'percentage':
                        return 0;
                        break;
                    case 'relative':
                        return 1;
                        break;
                }
            },
            //区域调价 零售价
            salePrice(){
                let price = this.tableData.listing_info.map(row=>Number(row.retail_price));
                if(price.length>1){
                    let sortPrice = price.sort((a,b)=>a-b);
                    let max=sortPrice[price.length-1].toFixed(2);
                    let min=sortPrice[0].toFixed(2);
                    if(max===min){
                        return min;
                    }else{
                        return `${min}~${max}`
                    }
                }else if(price.length===1){
                    return price[0].toFixed(2);
                }else{
                    return 0.00;
                }
            },
            hasDelivery(){
                let flag=(this.tableData.delivery&&this.tableData.delivery.length>0&&this.tableData.delivery[0].is_checked&&this.tableData.delivery[0].used_vaules&&this.tableData.delivery[0].used_vaules.length>0);
                return flag
            },
            discount(){
                let count= Math.ceil((10-Number(this.tableData.bulkDiscount)/10)*10)/10 ;
                return count
            },
            tableCheck:{
                get(){
                    if(this.tableData.listing_info){
                        let find=this.tableData.listing_info.find(row=> !row.isCheck);
                        return !find;
                    }else {
                        return false
                    }
                },
                set(val){
                    this.tableData.listing_info.forEach(row=>{
                        row.isCheck=val;
                    })
                }
            },
            attrsAll(){
                if(this.tableData.sku_attr_info){
                    return this.tableData.sku_attr_info.filter(row=>{
                        if(row.is_checked&&row.attribute_id===""){
                            return true
                        }else {
                            return false
                        }
                    })
                }else {
                    return []
                }

            },
            isShow(){
                if(this.tableData.sku_attr_info){
                    let find=this.tableData.sku_attr_info.find(row=>{
                        return row.id===this.change_method
                    });
                    if(!!find){
                        if(find.customized_name===0){
                            return false
                        }else {
                            return true
                        }
                    }else {
                        return false
                    }
                }else {
                    return false
                }
            },
            // 绑定本地属性
            locals(){
                return  this.tableData.local_attr.map(row=>{
                    let find =this.tableData.sku_attr_info.find(item=>{
                        return item.attribute_id===row.attribute_id
                    });
                    row.disable=!!find;
                    return row;
                })

            },
        },
        methods: {
            save_change(data){
                this.get_groups('');
                this.get_templates();
                this.tableData.configuration_type = data.type;
            },
            get_groups(groups_name){
                this.$http(api_get_publish_express_region_group).then(res=>{
                    this.tableData.group_region = res;
                    if(!!groups_name){
                        let find = this.tableData.group_region.find(row=>row.name===groups_name);
                        if(!!find){
                            this.formData.region_group_id = find.region_group_id;
                        }
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_templates(){
                this.$http(api_get_publish_express_region_template,{region_group_id:this.tableData.region_group_id}).then(res=>{
                    this.tableData.region_template = res;
                    if(this.tableData.region_template_id) {
                        let find = this.tableData.region_template.find(row => row.region_template_id === this.tableData.region_template_id);
                        if (!find) {
                            this.tableData.region_template_id = '';
                            this.reset_template(false);
                        }
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            replace_template(){
                if(!this.tableData.region_template_id) {
                    this.reset_template(false);
                }else{
                    this.$http(api_get_publish_express_region_template_info, {region_template_id: this.tableData.region_template_id}).then(res => {
                        this.tableData.aeopNationalQuoteConfiguration = res.aeopNationalQuoteConfiguration;
                        this.tableData.configuration_type = res.configuration_type;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }
            },
            update_template(){
                if(!this.tableData.configuration_type){
                    this.$reqKey('url_publish_express_edit_region_template',false);
                    this.$message({type:'warning',message:'请先编辑区域调价再保存'});
                    return
                }
                let data = {
                    type:this.tableData.configuration_type,
                    region_template_id:this.tableData.region_template_id,
                    aeopNationalQuoteConfiguration:this.tableData.aeopNationalQuoteConfiguration
                };
                this.$http(api_publish_express_edit_region_template,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_publish_express_edit_region_template',false);
                    },300);
                })
            },
            save_as_template(){
                if(!this.tableData.configuration_type){
                    this.$message({type:'warning',message:'请先编辑区域调价再保存'});
                    return
                }
                this.saveAsDialog = true;
                this.formData.template_name = '';
                this.formData.region_group_id = this.tableData.region_group_id;
                this.formData.type = this.tableData.configuration_type;

            },
            delete_template(){
                if(this.tableData.region_template_id===''){
                    this.$message({type:'warning',message:'请选择操作数据！'});
                    this.$reqKey('url_publish_express_delete_region_template',false);
                    return
                }
                this.$confirm(`将要删除所选区域模板名称，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_publish_express_delete_region_template,{region_template_id:this.tableData.region_template_id}).then(res=>{
                        let index = this.tableData.region_template.findIndex(row=>row.region_template_id===this.tableData.region_template_id);
                        if(index>=0){
                            this.tableData.region_template.splice(index,1);
                        }
                        this.tableData.region_template_id = '';
                        this.$message({type:'success',message:res.message||res});
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_publish_express_delete_region_template',false);
                        },300);
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_publish_express_delete_region_template',false);
                    },300);
                });
            },
            reset_template(bool){
                //如果想还原到初始进入页面的值，请取region_template_id_old...aeopNationalQuoteConfigurationOld
                if(bool&&this.tableData.region_template_id){
                    let find = this.tableData.region_template.find(row=>row.region_template_id===this.tableData.region_template_id);
                    if(!!find){
                        find.configuration_type&&(this.tableData.configuration_type = find.configuration_type);
                        this.tableData.aeopNationalQuoteConfiguration = typeof find.aeopNationalQuoteConfiguration ==='string'?(JSON.parse(find.aeopNationalQuoteConfiguration)):find.aeopNationalQuoteConfiguration;
                    }
                }else{
                    this.tableData.region_group_id = '';
                    this.tableData.configuration_type = '';
                    this.tableData.region_template_id = '';
                    this.tableData.aeopNationalQuoteConfiguration.forEach(row=>{
                        this.$set(row,'symbol','0');
                        this.$set(row,'percentage',0);
                        this.$set(row,'relative',0);
                    })
                }
            },
        	//处理数据
            to_fixed(value){
            	if(!value){
            		return 0.00;
                }
            	return Number(value).toFixed(2);
            },
            //点击   捆绑/打包销售
            bundling_sales(row,index){
                this.curRow = window.clone(row);
                this.curIndex = index;
                this.bundingDialog = true;
                let combine_sku_arr = window.clone(row.combine_sku);
                combine_sku_arr = combine_sku_arr.split("|");
                this.transferData = [];
                if(combine_sku_arr.length>0){
                    combine_sku_arr.forEach(it=>{
                        let cur = it.split("*");
                        let obj = {
                            id:row.id,
                            goods_id:row.goods_id,
                            local_sku:cur[0],
                            quantity:cur[1]
                        };
                        this.transferData.push(obj);
                    })
                }
            },
            //提交   捆绑/打包销售 映射重新提交的数据
            submit(val,val2){
                this.bundingDialog = false;
                let cur = this.tableData.listing_info[this.curIndex];
                if(!!cur){
                    cur.combine_sku = val;
                    this.transferData = val2;
                }
            },
            adjust_change(val){
                switch (val){
                    case 'percentage':
                        this.units = '%';
                        this.tableData.aeopNationalQuoteConfiguration.forEach(item=>{
                            if(item.relative>0){
                                item.percentage = item.relative;
                                item.relative = '';
                            }

                        });
                        break;
                    case 'relative':
                        this.units = '$';
                        this.tableData.aeopNationalQuoteConfiguration.forEach(item=>{
                            if(item.percentage>0){
                                item.relative = item.percentage;
                                item.percentage = '';
                            }
                        });
                        break;

                }
            },
            // 区域调价数据修改
            get_refPrice(row){
                let newVal = 0;
                let price=this.salePrice;
                switch (this.tableData.configuration_type) {
                    case 'percentage':
                        newVal = Number(row.percentage)||0;
                        if(row.symbol==='1'){
                            newVal = -newVal;
                        }
                        if (this.tableData.is_wholesale) {
                            if (typeof price === 'string' && price.indexOf('~') > -1) {
                                let arr = price.split("~");
                                let newArr = arr.map(x => {
                                    return ((newVal / 100 + 1) * x ).toFixed(2);
                                });
                                return newArr[0] + "~" + newArr[1];
                            }
                            if (typeof price === 'string' && price.indexOf('.') > -1 || typeof price === 'number') return ((newVal / 100 + 1) * price ).toFixed(2);
                        }
                        if (typeof price === 'string' && price.indexOf('~') > -1) {
                            let arr = price.split("~");
                            let newArr = arr.map(x => {
                                return ((newVal / 100 + 1) * x).toFixed(2);
                            });
                            return newArr[0] + "~" + newArr[1];
                        }
                        if (typeof price === 'string' && price.indexOf('.') > -1 || typeof price === 'number') {
                            return ((newVal / 100 + 1) * price).toFixed(2);
                        }
                        break;
                    case 'relative':
                        newVal = Number(row.relative)||0;
                        if(row.symbol==='1'){
                            newVal = -newVal;
                        }
                        if (this.tableData.is_wholesale) {
                            if (typeof price === 'string' && price.indexOf('~') > -1) {
                                let arr = price.split("~");
                                let newArr = arr.map(x => {
                                    return ((Number(x)+newVal)).toFixed(2);
                                });
                                return newArr[0] + "~" + newArr[1];
                            }
                            if (typeof price === 'string' && price.indexOf('.') > -1 || typeof price === 'number') return ((Number(price)+newVal) ).toFixed(2);
                        }
                        if (typeof price === 'string' && price.indexOf('~') > -1) {
                            let arr = price.split("~");
                            let newArr = arr.map(x => {
                                return (Number(x)+newVal).toFixed(2);
                            });
                            return newArr[0] + "~" + newArr[1];
                        }
                        if (typeof price === 'string' && price.indexOf('.') > -1 || typeof price === 'number') {
                            return (Number(price)+newVal).toFixed(2);
                        }
                        break
                }
            },
            // sku 属性对应的值
            attr_change(val,attr){
                if(attr.customized_name&&attr.customized_name===1){
                    let index = attr.list_val.find(it=>{
                        return Number(it.id)===Number(val);
                    });
                    if(!!index){
                        attr.change_value = index.name_en ||"";
                    }
                }
                this.change_customize();
            },
            // 自定义图片
            filter_path(row,attr_i){
                let obj = this.piece_row_image(row,attr_i);
                if(obj){
                    return this.get_path(obj,'.',this.baseUrl)
                }else{
                    return ''
                }
            },
            get_path,
            random_img,
            // 删除图片
            del_pic(attr){
                this.$confirm(`您将删除所勾选展图，是否确定？`, '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData.listing_info.forEach(row=>{
                        let index = row.sku_attributes.find(it=>{
                            return attr.id===it.ali_attr_id;
                        });
                        if(!!index){
                            index.custom_pic="";
                        }
                        row.d_imgs = [];
                    });
                    this.$message({type:"warning", message: '删除成功'});
                }).catch(code => {
                    this.$message({type:"info", message: '已取消删除'});
                });
            },
            // 修改主图后，数据处理
            mdfimg_submit(val){
                let find = this.tableData.listing_info[this.curIndex];
                if(!!find){
                    this.$set(find,"path",val.path);
                    find.sku_attributes.forEach(attr=>{
                        if(attr.customized_pic&&attr.customized_pic===1){
                            this.$set(attr,"custom_pic",find.path.length&&find.path[0].path||"")
                        }
                    })
                    find.d_imgs = find.path;
                }
            },
            // 随机图片
            random_click(){
                this.tableData.listing_info.forEach(row=>{
                    if(!row.d_imgs)return;
                    row.path = random_img(row.d_imgs);
                    row.sku_attributes.forEach(attr=>{
                        if(attr.customized_pic&&attr.customized_pic===1){
                            this.$set(attr,"custom_pic",row.path[0].path)
                        }
                    });
                    row.d_imgs = row.path;
                })
            },
            // 修改后的属性值
            get_custom_name(row,attr){
                if(!!row.sku_attributes.length) {
                    let find = row.sku_attributes.find(item => {
                        return item.ali_attr_id === attr.id;
                    });
                    if(!!find){
                        return find.changeName||find.custom_name;
                    }else {
                        return ""
                    }
                }
            },
            // 选择了发货地后，数据的处理
            change_delivery(item){
                if(item.used_vaules&&item.used_vaules.length>0){
                    let used=[]
                    item.used_vaules.forEach(row=>{
                        let find=item.list_val.find(val=>{
                            return val.id===row;
                        });
                        used.push(find)
                    })
                    this.tableData.listing_info.forEach(info=>{
                        this.$set(info,'extend',used.map(use=>{
                            let obj={
                                ali_attr_val_id:use.id,
                                name_zh:use.name_zh,
                                name_en:use.name_en,
                                retail_price:info.retail_price,
                                ipm_sku_stock:info.ipm_sku_stock,
                                ali_attr_id:item.id,
                                batchPrice:info.batchPrice,
                            }
                            return obj
                        }))
                    })
                }

            },
            // 有发货地后的价格
            get_ref_price(row){
                let find=this.references.find(item=>{
                    return item.sku_id===row.goods_sku_id;
                });
                if(!!find){
                    return find.total_price
                }else {
                    return ''
                }
            },
            /*处理刊登定价*/
            get_retail_price(PricingRules,skuId){
                let totalPrice = '';
                console.log(skuId,'skuId');
                console.log(PricingRules,'PricingRules');
                if(PricingRules&&PricingRules[String(skuId)]&&PricingRules[String(skuId)].total_price){
                    totalPrice = PricingRules[String(skuId)].total_price;
                }
                return totalPrice;
            },
            // 参考值
//            init_reference(sku_ids){
//                const params = {
//                    channel_id:4,
//                    account_id:this.tableData.account_id,
//                    sku_id:sku_ids.filter(row=>!!row),
//                };
//                this.$http(api_ref_price, params).then(res=> {
//                    this.tableData.listing_info.map(info=>{
//                        if(res&&res[info.goods_sku_id]&&res[info.goods_sku_id].total_price&&!Number(info.retail_price)&&!info.is_change_retail_price){
//                            this.$set(info,'retail_price',res[info.goods_sku_id].total_price)
//                        }
//                        return info
//                    });
//                    if (res && (res instanceof Array)) {
//                        this.showRef = false;
//                        return
//                    }
//                    this.showRef=true;
//                    for(let key in res ){
//                        const find = this.references.find(ref=>{
//                            return Number(ref.sku_id) === Number(key);
//                        });
//                        this.reduction=res[key].reduction;
//                        this.grossProfit=res[key].gross_profit;
//                        (!res[key].reduction)&&(!res[key].gross_profit)&&(this.showRef=false);
//                        if(!find){
//                            this.references.push(Object.assign(res[key],{
//                                channel_id:4,
//                                account_id:this.tableData.account_id,
//                                sku_id:Number(key),
//                            }))
//                        }
//                    }
//                }).catch(code=>{
//                    this.showRef = false;
//                    this.$message({type: "error", message: code.message || code})
//                })
//            },
            //修改单行 价格
            change_row_price(row){
                this.$set(row,'is_change_retail_price',true);
                setTimeout(()=>{
                    if(this.tableData.is_wholesale){
                        let price=([parseFloat(row.retail_price)||0]*[(100-this.tableData.bulkDiscount)/100]).toFixed(2);
                        row.batchPrice=price;
                    }
                },50);
            },
            //修改单行 有发货地 价格
            change_singe_price(row){
                setTimeout(()=>{
                    if(this.tableData.is_wholesale) {
                        let price = ([parseFloat(row.retail_price) || 0] * [(100 - this.tableData.bulkDiscount) / 100]).toFixed(2);
                        row.batchPrice=price;
                    }
                },50);
            },
            //修改购买数
            bulkOrder_blur(){
            	if(this.tableData.bulkOrder<2){
                    this.tableData.bulkOrder = 2;
                }
                setTimeout(()=>{
                    if(this.tableData.is_wholesale){
                        this.tableData.listing_info.forEach(row=>{
                            this.$set(row,"count",this.tableData.bulkOrder)
                        })
                    }
                },50)

            },
            //减免打折数
            bulkDiscount_blur(){
                setTimeout(()=>{
                    if(this.tableData.is_wholesale){
                        this.tableData.listing_info.forEach(row=>{
                            let price=[parseFloat(row.retail_price)||0]*[(100-this.tableData.bulkDiscount)/100]
                            this.$set(row,"batchPrice",price.toFixed(2));
                            row.extend&& row.extend.length>0&&(row.extend.forEach(item=>{
                                let price2=[parseFloat(item.retail_price)||0]*[(100-this.tableData.bulkDiscount)/100]
                                this.$set(item,"batchPrice",price2.toFixed(2));
                            }))
                        })
                    }
                },50)
            },
            //是否支持批发价
            change_batch_price(){
                if(this.tableData.is_wholesale){
                    this.tableData.listing_info.forEach(row=>{
                        let price=[parseFloat(row.retail_price)||0]*[(100-this.tableData.bulkDiscount)/100];
                        this.$set(row,"count",this.tableData.bulkOrder);
                        this.$set(row,"batchPrice",price.toFixed(2));
                        row.extend&& row.extend.length>0&&(row.extend.forEach(item=>{
                            let price2=[parseFloat(item.retail_price)||0]*[(100-this.tableData.bulkDiscount)/100];
                            this.$set(item,"batchPrice",price2.toFixed(2));
                        }))
                    })
                }
            },
            del_sigle(i){
                this.tableData.listing_info.splice(i,1)
            },
            //添加listing
            async submit_sku(val){
                if(val.length>0){
                    let skuIdList = val.map(value=>value.sku_id);
                    let allPrice = await this.$http(api_pricing_rules,{
                        channel_id:4,
                        account_id:this.tableData.account_id,
                        site_code:0,
                        sku_id:skuIdList,
                    });
                    let ids=val.map(row=>row.id).join(",");
                    this.$emit('submit-sku',val.map(row=>row.goods_id));
                    this.$http(api_aliexpress_sku_listing,{category_id:this.tableData.category_id,sku_ids:ids}).then(res=>{
                        res.forEach(row=>{
                            let arr=[];
                            let d_imgs=[];
                            d_imgs.push({path:row.thumb});
                            this.$set(row,"isCheck",true);
                            if(row.sku_attributes===undefined||row.sku_attributes.length===0){
                                let sku_attr={
                                    ali_attr_val_id:"",
                                    value:"无参考值",
                                    code:"无参考值",
                                    custom_pic:row.thumb||"",
                                    skuImage:"",
                                };
                                arr.push(sku_attr);
                                this.$set(row,"sku_attributes",arr);
                            }
                            this.$set(row,"d_imgs",d_imgs);
                            this.$set(row,"retail_price",this.get_retail_price(allPrice,row.id));

                            this.tableData.listing_info.push(row);
                            if(row.local_attr&&row.local_attr.length>0){
                                this.tableData.local_attr.forEach(attr=>{
                                    let index = row.local_attr.findIndex(item=>item.attribute_id===attr.attribute_id);
                                    if(index>=0){
                                        row.local_attr.splice(index,1);
                                    }
                                });
                                if(row.local_attr.length>0){
                                    this.tableData.local_attr.push(...row.local_attr);
                                }
                            }
                            let find = this.tableData.delivery.find(x=>{return x.names_en==="Ships From"})
                            find&&this.change_delivery(find);
                        });
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    })
                }
            },
            //批量修改
            commont_change(){
                let data=[];
                this.tableData.listing_info.forEach(row=>{
                    row.isCheck&&data.push(row)
                })
                if(data.length===0){
                    this.$message({type:"warning",message:"请选择要修改的数据"});
                    return;
                }else {
                    return data;
                }
            },
            // 批量修改数量
            change_all_stock(){
                let data = this.commont_change();
                data.forEach(row=>{
                    this.$set(row,"ipm_sku_stock",Number(this.count)>=0?Number(this.count):row.ipm_sku_stock);
                    row.extend&& row.extend.length>0&& row.extend.forEach(item=>{
                        item.ipm_sku_stock= Number(this.count)>=0?Number(this.count):item.ipm_sku_stock;
                    })
                })
            },
            // 批量修改价格
            change_all_price(){
                let data = this.commont_change();
                let newPrice = Number(this.price).toFixed(2)||0;
                this.price = newPrice;
                data.forEach(row=>{
                    row.retail_price=newPrice||row.retail_price;
                    row.extend&& row.extend.length>0&& row.extend.forEach(item=>{
                        item.retail_price=newPrice||item.retail_price;
                    })
                });
            },
            //点击选择本地属性
            change_checkbox(item){
                if(!item.attribute_id){
                    this.$set(item,"attribute_id","")
                }
                if(!item.is_checked){
                    item.attribute_id="";
                }
            },
            //判断该属性是否重复
            is_Set_attr(row,id,val,row_i){
                let data=window.clone(row)
                let find=data.sku_attributes.find(item=>{
                    return item.ali_attr_id===id;
                });
                    find.ali_attr_val_id=val;
                    let newValue=this.single_value(data);
                    let flag=this.compare(newValue,row_i)
                    if(flag){
                        return true;
                    }else {
                        return false
                    }
            },
            //修改单行属性  并带动相同属性修改
            change_row_attrs(row,id,val,attr_i){
                let find=row.sku_attributes.find(item=>{
                    return item.ali_attr_id===id;
                });
                find.ali_attr_val_id=val;
                //自定义属性
                let sku_name = this.tableData.sku_attr_info[attr_i].change_value;
                if(find.customized_name===1){
                	if(!val){
                        find.changeName = "";
                    }else{
                        let name=this.get_row_value(row,attr_i);
                        find.changeName= name;
                    }

                }
            },
            //批量修改多行属性
            change_customize(newVal){
                let data = this.commont_change();
                data.forEach((row,row_i)=>{
                    this.tableData.sku_attr_info.forEach((inner,inner_i)=> {
                        if(!!inner.allChange){
                            this.set_attr(row,inner_i,inner.allChange,row_i);
                            let index = row.sku_attributes.find(it=> {
                                return it.ali_attr_id === inner.id&&Number(it.ali_attr_val_id)===Number(inner.allChange);
                            });
                            if(index&&this.tableData.sku_attr_info[inner_i].customized_name===1){
                                index.changeName=newVal||this.get_custom_name(this.tableData.listing_info[row_i],inner);
                            }
                        }
                    })
                })
            },
            set_attr(row,i,val,row_i){
                let attr=this.tableData.sku_attr_info[i];
                let id=attr.id;
                let find=row.sku_attributes.find(item=>{
                    return item.attribute_id===attr.attribute_id;
                });
                //没有选中对应本地属性时   或者选中了但是无参考值
                if(!attr.attribute_id||attr.attribute_id===""||find.value==="无参考值"){
                    let sinFlag=  this.is_Set_attr(row,id,val,row_i)
                    if(sinFlag||!val){
                        this.change_row_attrs(row,id,val,i)
                    }else {
                        this.$message({message:"有相同项", type:'error'});
                        return;
                    }
                    return;
                }
                //有参考值情况
                let  index_arr=[],same_arr=[],allFlag=true;
                this.tableData.listing_info.forEach((item,item_i)=>{
                    let listfind=item.sku_attributes.find(item=>{
                        return item.attribute_id===attr.attribute_id;
                    });
                    if(find.value===listfind.value){
                        index_arr.push(item_i)
                    }
                });
                index_arr.forEach((item)=>{
                    let flag=this.is_Set_attr(this.tableData.listing_info[item],id,val,item);
                    same_arr.push(flag);
                });
                same_arr.forEach(items=>{
                    if(!items){
                        allFlag=false;
                    }
                });
                if(allFlag){
                    index_arr.forEach(items=>{
                        this.change_row_attrs(this.tableData.listing_info[items],id,val,i)
                    })
                }else {
                    this.$message({message:"有相同项", type:'error'});
                    return ;
                }
            },
            single_value(row){
                let name=""
                this.tableData.sku_attr_info.forEach(item=>{
                    if(item.is_checked){
                        let find=row.sku_attributes.find(it=>{
                            return it.ali_attr_id===item.id
                        })
                        if(!!find){
                            name+=find.ali_attr_val_id
                        }
                    }
                });
                return name;
            },
            //对比是否不同
            compare(value,i){
                let arr =[]
                this.tableData.listing_info.forEach((row,index)=>{
                    if(i!==index){
                        let name="";
                        this.tableData.sku_attr_info.forEach(item=>{
                            if(item.is_checked){
                                let find=row.sku_attributes.find(it=>{
                                    return it.ali_attr_id===item.id
                                })
                                if(!!find){
                                    name+=find.ali_attr_val_id
                                }
                            }
                        })
                        arr.push(name);
                    }
                })
                if(arr.indexOf(value)===-1){
                    return true
                }else {
                    return false
                }
            },
            // 修改数据
            set_value(val,row,i){
                val = val.replace(/[^a-zA-Z0-9 .]/g,'');
                let id=this.tableData.sku_attr_info[i].id;
                let find=row.sku_attributes.find(item=>{
                    return item.ali_attr_id===id;
                });
                if(!this.tableData.sku_attr_info[i].attribute_id||this.tableData.sku_attr_info[i].attribute_id===""){
                    this.$set(find,'changeName',val);
                    this.$set(find,'custom_name',val);
                } else {
                    this.tableData.listing_info.forEach(info=>{
                        info.sku_attributes.forEach(attrs=>{
                            if(attrs.ali_attr_id===id&&attrs.ali_attr_val_id===find.ali_attr_val_id){
                                this.$set(attrs,'changeName',val);
                                this.$set(attrs,'custom_name',val);
                            }
                        })
                    })
                }
            },
            //获取属性
            get_attrs(i){
                return this.tableData.sku_attr_info[i].list_val||[];
            },
            //获得渲染数据
            get_row_id(row,i){
                let id=this.tableData.sku_attr_info[i].id;
                let info=this.tableData.sku_attr_info[i];
                let find=row.sku_attributes.find(item=>{
                    return item.ali_attr_id===id;
                });
                if(!!find){
                    return find.ali_attr_val_id
                }else {
                    let data={
                        ali_attr_id:info.id,
                        ali_attr_val_id:"",
                        attribute_id: info.attribute_id||"",
                        attribute_name: info.attribute_name||'',
                        custom_name:info.custom_name||"" ,
                        custom_pic:info.custom_pic||'',
                        customized_name: info.customized_name,
                        customized_pic: info.customized_pic,
                        value: "无参考值",
                    }
                    row.sku_attributes.push(data)
                    return data.ali_attr_val_id
                }
            },
            sku_local_attr_change(val,item){
                if(val&&item.local_attr&&val===item.local_attr.attribute_id){
                    let localAttr = this.tableData.local_attr.find(row=>row.attribute_id===val);
                    this.tableData.listing_info.forEach(row=>{
                        let findInfo = row.sku_attributes.find(item=>item.attribute_id===val);
                        row.sku_attributes.forEach(attr=>{
                            if(attr.attribute_id===val&&localAttr.attribute_values[findInfo.code]){
                                attr.ali_attr_val_id = localAttr.attribute_values[findInfo.code].ali_attr_val_id;
                                if(attr.customized_name&&attr.customized_name===1){
                                    this.$set(attr,"changeName",localAttr.attribute_values[findInfo.code].code);
                                    this.$set(attr,"custom_name",localAttr.attribute_values[findInfo.code].code);
                                }
                            }
                            this.tableData.sku_attr_info.forEach(row=>{
                                if(row.names_en === item.names_en){
                                    row.allChange = '';
                                    row.change_value = '';
                                }
                            })
                        });
                    });
                }
            },
            //获得渲染数据
            get_row_temp_attr(row,loc_attr){
                let find=row.sku_attributes.find(item=>{
                    return item.ali_attr_id===loc_attr.ali_attr_id;
                });
                if(find){
                    return find.value;
                }
                return '无参考值';
            },
            //获得渲染数据
            get_row_value(row,i){
                let id=this.tableData.sku_attr_info[i].id;
                let find=row.sku_attributes.find(item=>{
                    return item.ali_attr_id===id;
                });
                if(!!find){
                    let find_name = this.tableData.sku_attr_info[i].list_val.find(inner=>{
                        return inner.id === find.ali_attr_val_id
                    });
                    if(!!find_name){
                        return find_name.name_en;
                    }
                }else {
                    return ""
                }
            },
            piece_row_image(row,i){
                let url = this.get_row_image(row,i);
                if(!!url&&((typeof url)==='string')&&url!==""){
                    if(url.indexOf('http')!==-1){
                        return url;
                    }else{
                        return this.baseUrl+url;
                    }
                }else{
                    return url;
                }
            },
            //获得渲染数据
            get_row_image(row,i){
                let id=this.tableData.sku_attr_info[i].id;
                let find=row.sku_attributes.find(item=>{
                    return item.ali_attr_id===id;
                });
                if(!!find){
                    return (row.d_imgs&&row.d_imgs.length&&row.d_imgs[0].path)|| find.custom_pic ||"";
                }else {
                    return "";
                }
            },
            del_row(row){
                let index = this.tableData.data.find(row =>{
                    return old.id === row.id
                });
                this.tableData.data.splice(index, 1)
            },
            add_sku(){
                this.addlistVisable = true;
            },
            get_reference_name_head(attr){
                let find=this.tableData.local_attr.find(row=>{
                    return row.attribute_id===attr.attribute_id
                })
                if(!!find){
                    return find.attribute_name
                }else {
                    return  false
                }
            },
            selected_images(val){
                let id=this.tableData.sku_attr_info[this.change_pic.attr_i].id;
                let find=this.tableData.listing_info[ this.change_pic.row_i].sku_attributes.find(item=>{
                    return item.ali_attr_id===id;
                });
                if(!this.tableData.sku_attr_info[this.change_pic.attr_i].attribute_id||this.tableData.sku_attr_info[this.change_pic.attr_i].attribute_id===""){
                    find.custom_pic=val[0].path;
                } else {
                    this.tableData.listing_info.forEach(info=>{
                        info.sku_attributes.forEach(attrs=>{
                            if(attrs.ali_attr_id===id&&attrs.ali_attr_val_id===find.ali_attr_val_id){
                                attrs.custom_pic=val[0].path;
                            }
                        })

                    })
                }
            },
            // 单行点击了修改主图
            change_row_image(row,index){
                this.picVisable=true;
                this.skuName = row.sku.includes('|')?row.sku.split('|')[0]:row.sku;
                this.curIndex = index;
                this.imgTemp = window.clone(row);
                this.imgTemp.path = window.clone(row.d_imgs);
                this.goodsId = row.goods_id || this.id;
                delete this.imgTemp.d_imgs;
            },
            applyAll(number,data){
                switch (this.tableData.configuration_type) {
                    case 'percentage':
                        this.tableData.aeopNationalQuoteConfiguration.forEach(item=>{
                            item.percentage = number;
                            item.symbol = data.symbol;
                        });
                        break;
                    case 'relative':
                        this.tableData.aeopNationalQuoteConfiguration.forEach(item=>{
                            item.relative = number;
                            item.symbol = data.symbol;
                        });
                        break;
                }
            }
        },
        filters:{
            filterAttrName(val){
                if(!!val&&typeof val === 'string'&&val.indexOf('|')>0){
                    return val.slice(0,val.indexOf('|'));
                }else{
                    return val;
                }
            }
        },
        watch:{
            "tableData.listing_info"(val){
                if(val){
//                    const ids=val.map(row=>row.goods_sku_id);
//                    this.init_reference(ids);
                }
            },
        },
        props: {
            tableData: {
                required: true,
                type: Object
            },
            id:{
                required:true,
            },
            add:{
                required: true,
                type: Boolean
            },
            spu:{
                required:true,
            },
            baseUrl:{
                default(){
                    return "";
                }
            },
            trueId:{
                required:true,
            },
            isCopy:{
                required: true,
                type: Boolean
            },
            isTime:{
                default(){
                    return  true;
                }
            },
        },
        components: {
            addGoods: require('../../../../api-components/add-goods.vue').default,
            bundlingSales:require('../../ebay/kandeng-list/add-edit-listing/bundling-sales.vue').default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
            priceCalculation:require("../../../base/publish-rules/price-calculation.vue").default,
            integerInput:require("../../../../components/integer-input.vue").default,
            mdfImg:require('../../ebay/kandeng-list/add-edit-listing/mdf-img.vue').default,
            uiSelectInput:require('../../../../components/ui-select-input.vue').default,
            saveTemplate:require('./save-template').default,
        }
    }
</script>
