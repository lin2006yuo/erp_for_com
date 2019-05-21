<template>
    <div class="p-sku-set">
        <div class="p-title-bg-color">
            <span>{{$t('ymx-detail.skuSet')}}</span>
        </div>
        <div class="p-head-border-color">
            <el-form :modal="form" :label-width="labelWidth">
                <el-form-item v-for="item in form.basic"
                              v-if="item.key ==='VariationTheme'"
                              :key="item.key"
                              :label="`${item.name}：`">
                    <el-select class="inline"
                               v-model="item.value"
                               :placeholder="$t('ymx-detail.select')"
                               @visible-change="get_variation_list"
                               @input="(val)=>{select_variation(val,item)}">
                        <el-option v-for="(item, index) in form.variationTheme"
                                   :label="item.name"
                                   :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <table class="sku-set-table"
                           cellspacing="0"
                           cellpadding="0"
                           style="margin-left: 115px; width:350px;">
                        <tr v-for="(item, index) in form.bindCategoryList" :key="index">
                            <td style="min-width:80px;max-width:130px">
                                <ui-tip :content="item.attr_name"></ui-tip>
                            </td>
                            <td style="border-top: 1px solid #ddd;width:200px">
                                <el-select v-model="item.option_value"
                                           filterable clearable
                                           @change="select_bindCategory(item)">
                                    <el-option v-for="(item, index) in variantOption"
                                                 :key="index"
                                                 :label="item.value"
                                                 :value="item.label"></el-option>
                                </el-select>
                            </td>
                        </tr>
                    </table>
                </div>
            </el-form>
            <div style="overflow:auto;">
                <div>
                    <el-button type="primary" size="mini" @click="set_add_sku">{{$t('ymx-detail.addSku')}}</el-button>
                    <div style="float: right;" class="title-select" v-if="!showCur">
                        <span>{{$t('ymx-detail.selAttr')}}：</span>
                        <el-checkbox-group style="display: inline-block"
                                           v-model="titleValue"
                                           type="primary">
                            <el-checkbox-button v-for="title in titleVisible"
                                                :label="title.value"
                                                :key="title.value">{{title.title}}
                            </el-checkbox-button>
                        </el-checkbox-group>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <table class="template">
                        <thead style="background-color:#eff2f7">
                            <tr>
                                <th v-for="(item, index) in form.variant_title"
                                    :key="`${index}${item}`"
                                    :class="[item==='check'?'check-width':'table-width-th']"
                                    v-if="show_cur_item(item)"
                                    v-show="!is_show_category(item)">
                                    <sup style="color: red">{{is_required(item)}}</sup>
                                    <ui-tip :content="item==='check'?'':item" v-if="item!=='Sale Price'&&item!=='Standard Price'"></ui-tip>
                                    <ui-tip v-else :content="`${item}[${form.currency}]`"></ui-tip>
                                    <span v-if="item==='Standard Price'" >{{$t('ymx-list.profit')}}</span>
                                </th>
                                <th>{{$t('ymx-detail.op')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="background-color: rgb(204, 204, 204)"
                                    v-for="(item, title_index) in form.variant_title"
                                    :key="title_index"
                                    v-if="show_cur_item(item)"
                                    v-show="!is_show_category(item)">
                                    <p v-if="show_batch(item,'input')">
                                        <span  style="display:flex;justify-content: center;width:100%;" v-if='form.batchOperation[item].key!=="RecommendedNode"' >
                                            <el-input class="inline width-sm"
                                                      style="width:125px;"
                                                      @blur="batch(item)" v-model="form.batchOperation[item].value"></el-input>
                                            <span  v-if='form.batchOperation[item].key==="StandardPrice"' @click="get_standard_price(form.variant)" class="btn-icon" title="点击初始化刊登定价数据" ></span>
                                        </span>
                                        <el-row  v-if='form.batchOperation[item].key==="RecommendedNode"'>
                                            <el-col :span="20">
                                                <el-input class="inline width-sm"
                                                          @blur="batch(item)" v-model="form.batchOperation[item].value"></el-input>
                                            </el-col>
                                            <el-col :span="4">
                                                <span class="btn-icon" :title="$t('ymx-detail.clickCate')" @click="change_category('batch')"></span>
                                            </el-col>
                                        </el-row>
                                        <el-select v-if="form.batchOperation[item].restriction&&form.batchOperation[item].restriction.length>0"
                                                   class="inline width-xs"
                                                   v-model="form.batchOperation[item].unitValue" filterable clearable>
                                            <el-option
                                                v-for="res in form.batchOperation[item].restriction"
                                                :label="res"
                                                :value="res"
                                                :key="res"
                                            ></el-option>
                                        </el-select>
                                    </p>
                                    <p v-else-if="show_upc_btn(item)">
                                        <request-button req-key="getUpc" class="inline"
                                                        @click.native="get_upc('all')">{{$t('ymx-detail.getUpc')}}</request-button>
                                    </p>
                                    <p v-else-if="show_batch(item,'select')">
                                        <el-select class="inline width-sm"
                                                   v-model="form.batchOperation[item].value"
                                                   @change="batch(item)">
                                            <el-option v-for="(i,k) in form.batchOperation[item].option"
                                                       :key="k" :label="i" :value="i"></el-option>
                                        </el-select>
                                        <el-select v-if="form.batchOperation[item].restriction&&form.batchOperation[item].restriction.length>0"
                                                   class="inline width-xs"
                                                   v-model="form.batchOperation[item].unitValue" filterable clearable>
                                            <el-option
                                                    v-for="res in form.batchOperation[item].restriction"
                                                    :label="res"
                                                    :value="res"
                                                    :key="res"
                                            ></el-option>
                                        </el-select>
                                    </p>
                                    <p v-else-if="show_batch(item,'date')">
                                        <el-date-picker class="inline width-sm" style="width: 120px;" @change="batch(item)"
                                                        v-model="form.batchOperation[item].value"
                                                        type="date"
                                                        :placeholder="$t('ymx-detail.date')">
                                        </el-date-picker>
                                    </p>
                                    <p v-else-if="item === 'Product ID'">
                                        <el-select class="inline width-sm" style="width: 40%"
                                                   v-model="form.batchOperation[item][0].value"
                                                   @change="batch(item)">
                                            <el-option v-for="(i,k) in form.batchOperation[item][0].option" :key="k"
                                                       :label="i"
                                                       :value="i"></el-option>
                                        </el-select>
                                        <el-input class="inline width-sm" style="visibility: hidden;width: 55%"
                                                  v-model="form.batchOperation[item][1].value"></el-input>
                                    </p>
                                    <p v-else-if="item === 'check'">
                                        <el-checkbox v-model="form.batchOperation[item].value"
                                                     @change="batch(item)"></el-checkbox>
                                    </p>
                                </td>
                                <td></td>
                            </tr>
                            <tr v-for="(row, index) in form.variant" :key="index">
                                <td v-for="(item, title_index) in form.variant_title"
                                    :key="title_index"
                                    v-if="show_cur_item(item)"
                                    :class="[item==='check'?'check-width':'table-width-th']"
                                    v-show="!is_show_category(item)">
                                    <p v-if="row[item] && row[item].type === 'input'&& row[item].key!=='ProductIdValue' && row[item].key!=='RecommendedNode'&&row[item].key!=='StandardPrice'">

                                        <el-input v-if="row[item].key!=='ColorMap'" class="inline width-sm" v-model="row[item].value"></el-input>
                                        <el-input v-else-if="row[item].key==='ColorMap'&& row[item].validata.length===0" class="inline width-sm" v-model="row[item].value"></el-input>
                                        <el-select
                                            v-else-if="row[item].key==='ColorMap'&& row[item].validata.length!==0"
                                            class="inline width-xs"
                                            style="width: 120px!important;"
                                            v-model="row[item].value"
                                            clearable
                                            filterable
                                            allow-create
                                            :placeholder="$t('ymx-list.pse')"
                                        >
                                            <el-option
                                                v-for="(item,index) in row[item].validata"
                                                :label="item"
                                                :value="item"
                                                :key="index"
                                            >
                                            </el-option>
                                        </el-select>

                                        <el-select v-if="row[item].restriction&&row[item].restriction.length>0"
                                                   class="inline width-xs"
                                                   v-model="row[item].unitValue" filterable clearable>
                                            <el-option
                                                    v-for="res in row[item].restriction"
                                                    :label="res"
                                                    :value="res"
                                                    :key="res"
                                            ></el-option>
                                        </el-select>
                                    </p>
                                    <p class='operate' v-else-if="row[item] && row[item].type === 'input'&& row[item].key==='ProductIdValue'">
                                        <el-row>
                                            <el-col :span="20">
                                                <el-input class="inline" v-model="row[item].value"></el-input>
                                            </el-col>
                                            <el-col :span="4">
                                                <span class="icon-refresh" @click="get_upc(row,'cur')"
                                                      title="点击获取UPC"
                                                      v-if="row['ProductIDType'].value==='UPC'"></span>
                                            </el-col>
                                        </el-row>
                                    </p>
                                    <p class='operate' v-else-if="row[item] && row[item].type === 'input'&& row[item].key==='RecommendedNode'">
                                        <el-row>
                                            <el-col :span="20">
                                                <el-input class="inline" v-model="row[item].value"></el-input>
                                            </el-col>
                                            <el-col :span="4">
                                                <span class="btn-icon" title="点击更改产品分类" @click="change_category('single',index)"></span>
                                            </el-col>
                                        </el-row>
                                    </p>
                                    <p style="display: flex" v-else-if="row[item] && row[item].type === 'input'&& row[item].key==='StandardPrice'">
                                            <el-input style='flex: 1' class="inline" v-model="row[item].value"></el-input>
                                            <!--<span class='profit-tips' title="Profit margin" v-if="row.gross_profit">{{row.gross_profit}}</span>-->
                                            <!--<el-input class="inline profit-tips" @blur="blur_gross_profit(row)" @input="input_gross_profit(row)" v-model="row.gross_profit"  ></el-input>%-->
                                            <input type="text" v-if="row.gross_profit!==undefined"  class="inline profit-tips input-price" @input="input_gross_profit(row)" @change="change_gross_profit(row)" v-model="row.gross_profit"   /><span v-if="row.gross_profit!==undefined">%</span>
                                    </p>
                                    <p v-else-if=" row[item] && row[item].type === 'select' ">
                                        <el-select class="inline width-sm" v-model="row[item].value">
                                            <el-option v-for="(i,k) in row[item].option" :key="k" :label="i"
                                                       :value="i"></el-option>
                                        </el-select>
                                        <el-select v-if="row[item].restriction&&row[item].restriction.length>0"
                                                   class="inline width-xs"
                                                   v-model="row[item].unitValue" filterable clearable>
                                            <el-option
                                                    v-for="res in row[item].restriction"
                                                    :label="res"
                                                    :value="res"
                                                    :key="res"
                                            ></el-option>
                                        </el-select>
                                    </p>
                                    <p v-else-if=" row[item] && row[item].type === 'text' && row[item].key!=='BindingGoods'">
                                        {{row[item].value}}
                                    </p>
                                    <span class='operate' v-else-if="row[item] && row[item].type === 'text'&& row[item].key==='BindingGoods'"
                                          @click="binding_goods(row,item,index)">{{row[item].value}}</span>
                                    <p v-else-if=" row[item] && row[item].type === 'check'">
                                        <el-checkbox v-model="row[item].value"></el-checkbox>
                                    </p>
                                    <p v-else-if=" row[item] && row[item].type === 'date' ">
                                        <el-date-picker class="inline width-sm" style="width: 120px;"
                                                        v-model="row[item].value"
                                                        type="date"
                                                        :placeholder="$t('ymx-detail.date')">
                                        </el-date-picker>
                                    </p>
                                    <p v-else>
                                        <span v-for="(node, ind) in row[item]" :key="ind">
                                            <span v-if="node.type === 'select'">
                                                <el-select class="inline width-80" style="width: 40%"
                                                           v-model="node.value">
                                                    <el-option v-for="(i,k) in node.option" :key="k" :label="i"
                                                                       :value="i"></el-option>
                                                </el-select>
                                            </span>
                                            <span v-else-if="node.type === 'input'">
                                                <el-input class="inline width-sm" style="width: 55%"
                                                      v-model="node.value"></el-input>
                                            </span>
                                        </span>
                                    </p>
                                </td>
                                <td>
                                    <el-button type="text" size="mini" @click="delete_sku(index,row)"
                                               :disabled="form.variant&&form.variant.length<=1">{{$t('ymx-detail.delete')}}</el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <label-item :label="`${$t('ymx-detail.associat')}：`" class="mt-sm">
                        <el-radio-group v-for='item in form.basic'
                                        :key='item.key'
                                        v-if="item.key==='SaveMap'"
                                        v-model="item.value">
                            <el-radio v-for="it in item.option" :key='it' :label="it">{{get_label(it)}}</el-radio>
                        </el-radio-group>
                    </label-item>
                </div>
            </div>
        </div>
        <add-goods v-model="addGoodsVisible"
                   @add-goods="select_goods"></add-goods>
        <bundling-sales channel="2"
                        :is-fixed-price-item="false"
                        v-model="bundlingDialog"
                        @submit="submit_bundling"
                        :data="bindingGoods"></bundling-sales>
        <category-dialog ref="category" v-model="categoryDialog"
                         channel="amazon" :site="form.siteName"
                         @submit="submit_dialog"></category-dialog>
    </div>
</template>

<style lang="stylus">
    .p-sku-set{
        .profit-tips{
            display: inline-block;
            width:50px;
            height:26px;
            background-color:#ddd;
            border-radius:3px
        }
        .table-width-th{
            min-width:80px;
            max-width:130px
        }
        .check-width{
            width:30px;
        }
        .el-checkbox-button .el-checkbox-button__inner{
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
            box-shadow: -1px 0 0 0 #8cc5ff;
        }
        .el-checkbox-button.is-checked .el-checkbox-button__inner{
            color: #1F2D3D;
            background-color: #fff;
            border-color: #C0CCDA;
            box-shadow: -1px 0 0 0 #ddd;
        }
        .width-80 {
            width: 80px;
        }
        .p-title-bg-color {
            background: #FAECE7;
            span {
                color: #FFF;
                font-weight: bold;
                padding: 5px 10px;
                font-size: 1.7rem;
                display: inline-block;
                background: #74ba4e;
            }
        }
        .p-head-border-color {
            padding: 20px;
            border-left: 3px solid #74ba4e;
        }
        .sku-set-table {
            p {
                text-align: center
            }
            td, th {
                padding: 3px 5px;
                border-bottom: 1px solid #ccc;
                border-right: 1px solid #ccc;
                text-align: center;
            }
            th {
                border-top: 1px solid #ccc;
            }
            tr {
                height: 26px;

                td:first-child, th:first-child {
                    border-left: 1px solid #ccc;
                    background-color: #eff2f7 !important
                }
            }
        }
        .input-price {
            border:1px solid #C0CCDA;
            border-radius:3px;
            background-color:white;
            padding-left:10px;
            height:26px;
            box-sizing:border-box;
        }
    }
</style>
<script>
    import {api_variation_search,api_amazon_templatelist,api_get_upc,api_pricing_rules} from '../../../../api/amazon-publish-info';
    import {get_edit_data} from './info-public-methods';
    export default{
        data(){
            return {
                variationValue: '',
                addGoodsVisible:false,
                variationList: [
                    {
                        theme_name: this.$t('ymx-detail.select'),
                        variant_id: ''
                    }
                ],
                bindCategoryList: [],
                selectOptionValue: '',
                titleVisible: [
                    {title:'PartNumber', value:'PartNumber'},
                    {title:'RecommendedNode', value:'RecommendedNode'},
                    {title:'ConditionType/ConditionNote', value:'Condition'},
                    {title:'Sale Price/Start Date/End Date', value:'Sale'},
                ],
                titleValue: ['RecommendedNode','Condition','Sale'],
                bindingGoods:[],
                curIndex:'',
                bundlingDialog:false,
                categoryDialog:false,
                curType:'',
            }
        },
        updated(){
            this.Japan_site_profit();
        },
        methods: {
            get_edit_data,
            //日本站点 利润率 整数 刊登
            Japan_site_profit(){
                //遍历 每个标签页
                    if (this.form.siteName === "JP") {
                        this.form.variant.forEach(item => {
                            if(item["Standard Price"].value!==""){
                                //向上取整
                                item["Standard Price"].value = Math.ceil(parseFloat(item["Standard Price"].value));
                            }
                        })
                    }
            },
            change_category(type,index){
                this.categoryDialog = true;
                this.curIndex = type==='single'?index:0;
                this.curType = type;
            },
            submit_dialog(val){
                let category_id = '';
                if(val instanceof Array && val.length > 0){
                    category_id = val[val.length-1].category_id;
                }else if(val instanceof Object){
                    category_id = val.category_id;
                }
                if(this.curType==='batch'){
                    this.form.batchOperation['RecommendedNode'].value = category_id;
                    this.batch('RecommendedNode')
                }else{
                    this.form.variant[this.curIndex]['RecommendedNode'].value = category_id
                }
                this.categoryDialog = false;
            },
            show_upc_btn(item){
                return item==="ProductIdValue"&&this.comVariant;
            },
            show_batch(item,type){
                return this.form.batchOperation[item].type === type && this.form.batchOperation[item].is_batch
            },
            get_upc(row,name){
                let arr = this.form.variant.filter(item=>{
                     return item.check.value
                })
                if(arr.length===this.form.variant.length){
                    let list = [];
                    if(name==='cur'){
                        list.push(row);
                    }else{
                        list = this.form.variant.filter(row=>{
                            return row['check'].value===true&&row['ProductIDType'].value==='UPC'&&row['ProductIdValue'].type==='input'
                        });
                    }
                    let number = list.length;
                    this.$http(api_get_upc,number).then(res => {
                        list.forEach((row,index)=>{
                            row['ProductIdValue'].value = res.data[index];
                        });
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=> {
                        this.$reqKey('getUpc', false);
                    })
                }else{
                    this.$message({
                        type:'info',
                        message:'SKU设置版块存在未勾选的SKU,请勾选后再获取!'
                    })
                }
            },
            show_cur_item(item){
                if(!this.showCur){
                    return item!=='hidden'&&item!=='平台SKU'&&item!=='BindingGoods'&&item!=='SKUID'
                }else{
                    return item!=='hidden'&&item!=='BindingGoods'
                }
            },
            get_label(it){
                switch(it){
                    case 1:
                        return this.$t('ymx-detail.autoAssociat');
                    case 0:
                        return this.$t('ymx-detail.notAssociat');
                }
            },
            binding_goods(row,item,index){
                this.bindingGoods = row[item].value.split(',').map(row=>{
                    let detail = row.split('*');
                    return {
                        local_sku:detail[0],
                        quantity:detail[1],
                    }
                });
                this.bundlingDialog = true;
                this.curIndex = index;
            },
            submit_bundling(data){
                this.form.variant[this.curIndex]['Bundled/packaged sales'].value = data;
                this.bundlingDialog = false;
            },
            async select_goods(val,goods){
                    console.log(val,goods);
                   let skuIdList = val.map(row=>row.sku_id);
                   //计算刊登销售价
                   let priceRule = await this.$http(api_pricing_rules,{
                        channel_id:2,
                        account_id:this.form.account_id,
                        site_code:this.form.siteName,
                        sku_id:skuIdList,
                    });
                    let keysList = ['check','ConditionNote','ConditionType','ProductIDType','ProductIdValue','Quantity','Sale End Date','Sale Price','Sale Start Date','Standard Price'];
                    let keys = goods.keys.map(row=>`参考_${row}`);
                    let filterKeys = keys.filter(row=>!this.form.variant_title.includes(row));
                    let index = this.form.variant_title.findIndex(row=>row==='ProductIDType');
                    if(index>-1)this.form.variant_title.splice(index,0,...filterKeys);
                    keys.forEach(row=>{
                        let obj = {
                            name:row,
                            type:'text',
                            value:''
                        };
                        this.form.variant.forEach(item=>{
                            if(!item.hasOwnProperty(row)){
                                item[row] = clone(obj)
                            }
                        });
                        if(!this.form.batchOperation.hasOwnProperty(row)){
                            this.form.batchOperation[row] = clone(obj);
                        }
                    });
                    let obj = clone(this.form.batchOperation);
                    let emptyKey =  Object.keys(obj).filter(item=>!keysList.includes(item));
                    emptyKey.forEach(item=>{
                        obj[item].value = '';
                    });
                    val.forEach(row=>{
                        // 添加平台sku
                        !!obj['SKUID']&&(obj['SKUID'].value = row.sku_id);
                        !!obj['平台SKU']&&(obj['平台SKU'].value = row.sku);
                        !!obj['SKU']&&(obj['SKU'].value = row.sku);
                        !!obj['Bundled/packaged sales']&&(obj['Bundled/packaged sales'].value = `${row.sku}*1`);
                        //添加新的sku时，请求当前规则下的销售价
                        if(!!obj['Standard Price']&&priceRule[row.sku_id]&&priceRule[row.sku_id].total_price){
                            obj['Standard Price'].value = priceRule[row.sku_id].total_price;
                            this.$set(obj,'gross_profit',priceRule[row.sku_id].gross_profit.substring(0,priceRule[row.sku_id].gross_profit.length-1))
                        }
                        keys.forEach(item=>{
                            obj[item].value = row[item.replace('参考_','')];
                        });
                        this.form.variant.push(clone(obj));
                        //添加 标题与描述
                        let des = clone(this.form.descript[0]);
                        des.skuName = row.sku;
                        this.form.descript.push(des);
                        //添加图片
                        let parentImg=this.form.images[0];
                        let imgs={
                            attribute_id:parentImg.attribute_id,
                            baseUrl:parentImg.baseUrl,
                            goods_id:row.goods_id,
                            images:[
                                {
                                    path:row.path,
                                    goods_id:row.goods_id,
                                    baseUrl:parentImg.baseUrl,
                                    is_default:1,
                                    is_default_txt:'主图',
                                    isSwatch:true,
                                }
                                ],
                            name:row.sku,
                            sku_id:row.sku_id,
                            value_id:0,
                        };
                        this.form.images.push(imgs)
                    });

            },
            get_variation_list(val){
                if(!val)return;
                if(this.form.category_template_id===''||this.form.siteId==='')return this.$message({type:'warning',message:'分类模板或站点为空，请补充完整！'});
                console.log(this.form.product_template_id,'this.form.product_template_id');
                console.log(this.form,'this.form');
                this.get_edit_data(0,this.form.siteId,this.form.category_template_id,this.form.product_template_id).then(res=>{
                    let category = res.category;
                    if(!!category){
                        category.attrs.forEach(row=>{
                            let restriction = [];
                            this.$set(row,'unitValue','');
                            if(!!row.attribute)restriction = row.attribute.restriction;
                            this.$set(row,'restriction',restriction);
                        });
                    }
                    this.$emit('get-variation-list',category.attrs);
                }).catch(code=>{
                    console.log(code);
                })
            },
            select_variation(val,item){
                console.log('变体改变',item);
                console.log('新值为',val);
                item.value= val;
                console.log('改变之后的新值',item);
                if(val==='')return;
                if(val===0){
                    this.delete_variant();
                    return;
                }else{
                    this.delete_variant();
                    let find = this.form.variationTheme.find(res=>res.id===val);
                    let variation = {};//当前属性的变体 key:value
                    if(!!find){
                        if(typeof find.relation_field === 'string'){
                            find.relation_field = JSON.parse(find.relation_field);
                        }
                        find.relation_field.forEach(row=>{
                            /*this.form.variationAttr字段内包括每个变体属性的详情,
                            *在get-variation-list事件中获得
                            * */
                            let findChild = this.form.variationAttr.find(res=>res.name===row);
                            if(!!findChild){
                                this.$set(findChild,'key',row);
                                this.$set(findChild,'is_required',findChild.required);
                                this.$set(findChild,'type',findChild.select?'select':'input');
                                this.$set(findChild,'value','');
                                this.$set(findChild,'isVariant',1);//字段用于判断 是否为添加的变体属性
                                variation[row] = findChild ;
                            }
                        });
                        let name = Object.keys(variation);
                        if(name.length>0) this.add_variant(name,variation);//在表格中添加变体属性
                    }
                }
            },
            /*更改 Variation Theme时，先删除旧的变体属性
            * */
            delete_variant(){
                let nameList = Object.values(this.form.batchOperation).filter(row=>row.isVariant).map(row=>row.name);
                this.form.variant_title = this.form.variant_title.filter(row=>!nameList.includes(row));
                nameList.forEach(row=>{
                    this.form.variant.forEach(res=>{
                        delete res[row];
                    });
                    this.form.bindCategoryList = [];
                });
            },
            /*添加新的 变体属性
            * */
            add_variant(name,variation){
                let lastName ='';
                let list = this.form.variant_title.filter(row=>row.includes('参考'));
                if(list.length<=0) list = this.form.variant_title.filter(row=>row!=='SKUID'&&row.includes('SKU'));
                lastName = list[list.length-1];
                let findIndex = this.form.variant_title.findIndex(row=>row===lastName);
                if(findIndex>-1)this.form.variant_title.splice(findIndex+1,0,...name);//在列表头部加入变体
                name.forEach(row=>{
                    this.form.variant.forEach(res=>{
                        this.$set(res,row,clone(variation[row]));
                    });
                    this.form.batchOperation[row] = clone(variation[row]);
                    this.form.bindCategoryList.push({attr_name:row,option_value:''});
                });
                console.log(this.form.variant,'this.form.variant');
            },
            select_bindCategory(val){
                this.form.variant.forEach(row=>{
                    row[val.attr_name].value = val.option_value?row[val.option_value].value:'';
                });
                this.$emit('select-replace', val);
            },
            set_add_sku(){
                this.addGoodsVisible = true;
            },
            delete_sku(index,row){
                this.form.variant.splice(index, 1);
                this.form.descript.splice(index+1,1);
                this.form.images.splice(index+1,1)
            },
            batch(val){
                if (val === 'check'){
                    this.form.variant.forEach(row => {
                        row[val].value = this.form.batchOperation[val].value
                    });
                } else {
                    if(!this.form.batchOperation[val].value) return
                    this.form.variant.forEach(row => {
                        if(row.check.value){
                            row[val].value = this.form.batchOperation[val].value
                        }
                    });
                    this.form.batchOperation[val].value=''
                }
            },
            is_required(val){
                let item = {};
                if(this.form.variant.length<=0)return;
                item = this.form.variant[0];
                if (val === 'check') {
                    return ''
                } else if (val === 'Product ID') {
                    if (item[val][0].require || item[val][1].require) {
                        return '*'
                    }
                } else {
                    if (item[val].require) {
                        return '*'
                    }
                }
            },
            is_show_category(item){
                let isTrue = false;
                this.titleValue.forEach(row=>{
                    if(item===row){
                        isTrue = true;
                    }else{
                        if(row==='Condition'){
                            if(item === 'ConditionType'||item==='ConditionNote') isTrue = true;
                        }else if(row === 'Sale'){
                            if(item.includes('Sale Price')|| item.includes('Sale Start Date')||item.includes('Sale End Date'))isTrue = true;
                        }
                    }
                });
                return isTrue;
            },
            /*输入框输入字符限制*/
            input_gross_profit(val){

                val.gross_profit = val.gross_profit.replace(/[^\d.]/g, "");//清除数字和点以外的字符
                val.gross_profit = val.gross_profit.replace(/\.{2,}/g, ".");//清除多余的.字符
                val.gross_profit = val.gross_profit.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                val.gross_profit = val.gross_profit.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
                if (val.gross_profit.indexOf(".") < 0 && val.gross_profit !== "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                    val.gross_profit = parseFloat(val.gross_profit);
                }
                if(parseInt(val.gross_profit)>=100){
                    val.gross_profit=99.9;
                }
                if(val.gross_profit===''){
                    val.gross_profit=0;
                }


            },
            change_gross_profit(val){
                let skuIdList=[val.SKUID.value];
                let attr=val.SKUID.value+'';
                let params={
                    channel_id:2,
                    account_id:this.form.account_id,
                    site_code:this.form.siteName,
                    sku_id:skuIdList,
                }
                if(val.gross_profit!==''&& val.gross_profit>=20){
                    this.$set(params,'gross_profit',val.gross_profit);
                    this.$http(api_pricing_rules,params).then(res=>{
                        if(res[attr].error){
                            this.$message({
                                type:"error",
                                message:res[attr].error
                            })
                        }else{
                            val['Standard Price'].value=res[attr].total_price;
                            if(this.form.siteName==="JP"){
                                val['Standard Price'].value = Math.ceil(parseFloat(val['Standard Price'].value));
                            }
                        }
                    }).catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
                }else if(val.gross_profit<20) {
                    this.$http(api_pricing_rules, params).then(res => {
                        val.gross_profit = parseFloat(res[val.SKUID.value].gross_profit);
                        val['Standard Price'].value = res[val.SKUID.value].total_price;
                        if(this.form.siteName==="JP"){
                            val['Standard Price'].value = Math.ceil(parseFloat(val['Standard Price'].value));
                        }
                    }).catch(err => {
                        this.$message({
                            type: 'error',
                            message: err.message || err
                        })
                    })
                }
            },
            get_standard_price(val){
                let skuIdList=[];
                val.forEach(item=>{
                    skuIdList.push(item.SKUID.value);
                })
                if(this.iconInit){
                    this.$confirm('此操作将初始化刊登定价数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_pricing_rules,{
                            channel_id:2,
                            account_id:this.form.account_id,
                            site_code:this.form.siteName,
                            sku_id:skuIdList,
                        }).then(res=>{
                            for(let attr in res){
                                if(res[attr].total_price!==undefined){
                                    let obj=val.find(item=>{
                                        return item.SKUID.value===parseInt(attr);
                                    })
                                    obj['Standard Price'].value=res[attr].total_price;
                                    if(obj.gross_profit!==undefined){
                                        obj.gross_profit=parseFloat(res[attr].gross_profit);
                                    }
                                    this.$message({
                                        type:"success",
                                        message:"初始化成功!"
                                    })
                                }else{
                                    this.$message({
                                        type:"error",
                                        message:"没有匹配到对应的定价规则"
                                    })
                                }
                            }
                        }).catch(err=>{
                            this.$message({
                                type:'error',
                                message:err.message || err
                            })
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }else{
                    this.$http(api_pricing_rules,{
                        channel_id:2,
                        account_id:this.form.account_id,
                        site_code:this.form.siteName,
                        sku_id:skuIdList,
                    }).then(res=>{
                        console.log(res);
                        for(let attr in res){
                            if(res[attr].total_price!==undefined){
                                let obj=val.find(item=>{
                                    return item.SKUID.value===parseInt(attr);
                                })
                                obj['Standard Price'].value=res[attr].total_price;
                                if(obj.gross_profit!==undefined){
                                    obj.gross_profit=parseFloat(res[attr].gross_profit);
                                }
                                console.log(obj.gross_profit);
                                this.$message({
                                    type:"success",
                                    message:"初始化成功!"
                                })
                            }else{
                                this.$message({
                                    type:"error",
                                    message:"没有匹配到对应的定价规则"
                                })
                            }
                        }
                    }).catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
                }
            }
        },
        computed:{
            comVariant:{
                get(){
                    let find = this.form.variant.find(row=>row['ProductIDType'].value === 'UPC');
                    return !!find;
                },
            },
            variantOption(){
                let option = this.form.variant_option;
                option.forEach(row=>{
                      this.$set(row,'disabled',false);
                });
                this.form.bindCategoryList.forEach(row=>{
                    /*Tips:option_value 使用的是label 字段
                    * */
                    let find = option.find(res=>res.label===row.option_value);
                    if(!!find) this.$set(find,'disabled',true);
                });
                return option
            },
            iconInit(){
                let obj=this.form.variant.find(item=>{
                    return item["Standard Price"].value!==""
                })
                return obj ? true: false;
            }
        },
        props: {
            form:{
                required:true,
                type:Object
            },
            labelWidth:{
                type:String
            },
            /*由于范本刊登详情页面和Amazon刊登详情页面有所不同，故使用此字段进行区分*/
            showCur:{
                type:Boolean,
                default(){
                    return false
                }
            },
            //外部随机分配 能匹配到定价规则 的 预计刊登利率
            profit:{

            }
        },
        components: {
            addGoods: require("../../../../api-components/add-goods.vue").default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            bundlingSales:require('../../ebay/kandeng-list/add-edit-listing/bundling-sales.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            productCategory: require('./components/product-category.vue').default,
            categoryDialog: require('../../ebay/category-dialog.vue').default
        }
    }
</script>

