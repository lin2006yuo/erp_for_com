<template>
    <el-row class="c-sku-settings"  v-if="form.list.listing_type===1&&form.list.variation===1">
        <rainbow-header title="SKU设置" >
            <el-form :model="form" label-width="220px">
                <el-form-item label="刊登产品对应属性：">
                    <!--TODO 需要更换table-->
                    <table class="template" style="width:50%" v-if="form.mappingspec&&form.mappingspec.length>0">
                        <tr>
                            <th>
                                <el-checkbox :value="checkAllMap"
                                             :disabled="param.curPage==='already'&&param.isAdd===false"
                                             @input="(val)=>{check_all_map(val)}"></el-checkbox>
                            </th>
                            <th>平台分类属性</th>
                            <th>对应本地属性</th>
                        </tr>
                        <template v-for="(item,index) in form.mappingspec">
                            <tr>
                                <td>
                                    <el-checkbox :value="item.is_check"
                                                 :disabled="param.curPage==='already'&&param.isAdd===false"
                                                 @input="(val)=>{start_using(item,val)}"></el-checkbox>
                                </td>
                                <td>{{item.channel_spec}}</td>
                                <td>
                                    <el-select :value="item.combine_spec"
                                               filterable clearable
                                               @input="(val)=>{change_combine(val,item)}"
                                               :disabled="!item.is_check||(param.curPage==='already'&&param.isAdd===false)">
                                        <el-option
                                        v-for="item in curAttrInfo"
                                        :label="item.value"
                                        :value="item.value"
                                        :key="item.value"
                                        :disabled="item.disabled"></el-option>
                                    </el-select>
                                </td>
                            </tr>
                        </template>
                    </table>
                    <div v-else>请先选择站点和平台产品分类</div>
                    <span class="inline mt-sm" v-if="form.specificsList&&form.specificsList.length>0">注意：系统会自动匹配平台属性，个别未匹配成功的，可手动添加匹配。</span>
                </el-form-item>
            </el-form>
            <el-button type="primary"
                       size="mini"
                       class="inline mb-sm"
                       @click.native="add_sku">添加SKU</el-button>
            <el-button type="primary"
                       size="mini"
                       class="inline mb-sm"
                       @click.native="copy_sku">复制SKU</el-button>
            <table class="template">
                <tr>
                    <th style="width:45px"></th>
                    <th style="width:75px"></th>
                    <th :class="[!form.list.assoc_order?'edit-sku-width':'default-sku-width']">本地SKU</th>
                    <th style="min-width:90px">捆绑/打包销售</th>
                    <th style="width:105px">展图（最多12张)</th>
                    <th v-for="it in comHeader" style="max-width:100px;min-width:50px">
                        {{it}}
                    </th>
                    <template  v-if="form.list.useMappingspec.length>0" v-for="(item,item_i) in form.list.useMappingspec">
                        <th style="min-width:70px">
                            <span v-if="item_i > 0" title="向左移一列"
                                  class="el-icon-arrow-left" @click="attrSort(item,item_i,-1)"></span>
                            <span>{{item.channel_spec}}</span>
                            <span v-if="(form.list.useMappingspec.length-1) > item_i" title="向右移一列"
                                  class="el-icon-arrow-right" @click="attrSort(item,item_i,+1)">
                            </span>
                        </th>
                    </template>
                    <th v-if="showRef" style="max-width:100px;min-width:80px">参考销售价</th>
                    <th style="width:100px">销售价（{{!!curSite.currency?curSite.currency:'RMB'}}）</th>
                    <th style="width:80px">可售数</th>
                    <!--英国、德国、西班牙、法国、意大利，这5个只需显示EAN 其他的都只需显示UPC -->
                    <th v-if="showLine" style="width:120px">EAN</th>
                    <th v-else style="width:120px">UPC</th>
                    <th width="50px">操作</th>
                </tr>
                <tbody>
                    <tr>
                        <th>
                            <el-checkbox v-model="checkAll" @change="check_all"></el-checkbox>
                        </th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>
                            <span class="operate" @click="cur_delete">删除</span>
                            <span class="operate ml-lg" @click="random_click">随机</span>
                        </th>
                        <th v-if='comHeader.length>0' :colspan="comHeader.length">
                            <span class="operate" @click="update_header">获取属性值</span>
                        </th>
                        <template v-for="(item,item_i) in form.list.useMappingspec">
                            <th v-if="get_head_attr(item)">
                                <el-select :value="get_attr(item)"
                                           default-first-option
                                           class="inline"
                                           v-if="item.selection_mode==='FreeText'"
                                           @input="(val)=>{blur_change(val,item)}"
                                           placeholder="请添加或选择商品属性"
                                           filterable clearable allow-create>
                                    <el-option
                                            v-for="(res,index) in item.detail"
                                            :label="res.category_specific_value"
                                            :value="res.category_specific_value"
                                            :key="index"
                                    ></el-option>
                                </el-select>
                                <el-select v-if="item.selection_mode==='SelectionOnly'"
                                           class="inline"
                                           default-first-option
                                           :value="get_attr(item)"
                                           placeholder="请搜索或选择商品属性"
                                           @input="(val)=>{blur_change(val,item)}"
                                           filterable clearable>
                                    <el-option
                                            v-for="(res,index) in item.detail"
                                            :label="res.category_specific_value"
                                            :value="res.category_specific_value"
                                            :key="index"
                                    ></el-option>
                                </el-select>
                                <el-input :value="get_attr(item)"
                                          class="inline"
                                          @blur="(val)=>blur_change(val,item,'custom')"
                                          v-if="item.custom===1"></el-input>
                            </th>
                        </template>
                        <!--参考销售价-->
                        <th v-if="showRef">
                            <span class="operate"
                                  @click="make_application">一键应用</span>
                            <!--<el-button type="primary"-->
                                       <!--size="mini"-->
                                       <!--@click.native="make_application"-->
                                       <!--class="inline"></el-button>-->
                        </th>
                        <!--修改价格-->
                        <th>
                            <ui-limit-number v-model="mdfPrice"
                                             @blur="batch_change('mdfPrice',mdfPrice)"
                                             :limit="2"></ui-limit-number>
                        </th>
                        <!--修改数量-->
                        <th>
                            <integer-input v-model="mdfQuantity"
                                           :min="1"
                                           @blur="batch_change('mdfQuantity',mdfQuantity)"></integer-input>
                        </th>
                        <!--upc-->
                        <th>
                            <el-input v-model="mdfUpc" @blur="batch_change('mdfUpc',mdfUpc)"></el-input>
                        </th>
                        <th></th>
                    </tr>
                    <tr v-for="(row,row_i) in form.varians" :key="`${row_i}${row.sku_id}`">
                    <td>
                        <el-checkbox v-model="row.isCheck"></el-checkbox>
                    </td>
                    <th>
                        <span class="btn-small up  sort-span invoice invoice-up" @click="up(row_i)"></span>
                        <span class="btn-small down  sort-span invoice invoice-down" @click="down(row_i)"></span>
                    </th>
                    <td>
                        <el-input v-model="row.v_sku" v-if="!form.list.assoc_order"></el-input>
                        <span v-else>{{row.v_sku}}</span>
                    </td>
                    <td><span class="operate" @click="bundling_sales(row,row_i)">{{row.combine_sku}}</span></td>
                    <td>
                        <el-popover
                                placement="bottom-start"
                                trigger="hover">
                            <img v-if="row.path&&row.path.length>0"
                                 :src="get_path(row.path[0].path,'_100x100.',row.path[0].base_url)"
                                 width="150px"
                                 height="150px" >
                            <span slot="reference">
                                     <img class="inline"
                                          v-if="row.path&&row.path.length>0"
                                          :src="get_path(row.path[0].path,'_100x100.',row.path[0].base_url)"
                                          width="26px"
                                          height="26px"
                                          style="cursor: -webkit-zoom-in;">
                                </span>
                        </el-popover>
                        <el-button class="ml-xs inline"
                                   type="text"
                                   @click.native="modify_picture(row,row_i)"
                                   :id="form.mappingspec.id">修改({{row.path.length}})</el-button>
                    </td>
                    <!--渲染-->
                    <th v-for="it in get_row_refs(row,'value')">
                        {{it}}
                    </th>
                    <template  v-for="(item,item_i) in form.list.useMappingspec">
                        <th v-if="get_row_attr(item,row)!==false&&item.custom===0" >
                            <el-select  v-if="item.selection_mode==='SelectionOnly'"
                                        :disabled="row.isDisabled"
                                        class="inline"
                                        :value="get_row_attr(item,row)"
                                        default-first-option
                                        placeholder="请搜索或选择商品属性"
                                        filterable clearable
                                        @input="(val)=>{set_attr(row,row_i,item,item_i,val)}">
                                <el-option
                                        v-for="attr in  get_option(item,row)"
                                        :key="attr.category_specific_value"
                                        :label="attr.category_specific_value"
                                        :value="attr.category_specific_value">
                                </el-option>
                            </el-select>
                            <el-select  :placeholder="com_placeholder(item,row)"
                                        class="inline"
                                        :disabled="row.isDisabled"
                                        default-first-option
                                        v-if="item.selection_mode==='FreeText'"
                                        :value="get_row_attr(item,row)"
                                        @input="(val)=>{set_attr(row,row_i,item,item_i,val)}"
                                        filterable allow-create clearable>
                                <el-option
                                        v-for="attr in  get_option(item,row)"
                                        :key="attr.category_specific_value"
                                        :label="attr.category_specific_value"
                                        :value="attr.category_specific_value">
                                </el-option>
                            </el-select>
                        </th>
                        <th v-if="get_row_attr(item,row)!==false&&item.custom===1">
                            <!--<th>-->
                            <!--<div>{{get_row_attr(item,row)}}</div>-->
                            <el-input  :value="get_row_attr(item,row)"
                                       :disabled="row.isDisabled"
                                       class="inline"
                                       @input="(val)=>{set_attr(row,row_i,item,item_i,val)}"></el-input>
                        </th>
                    </template>
                    <td v-if="showRef">
                        {{reference_sale_price(row)}}
                    </td>
                    <!--价格-->
                    <td>
                        <ui-limit-number v-model="row.v_price"
                                         class="inline"
                                         @blur="blur_price(row)"
                                         :limit="2"></ui-limit-number>
                    </td>
                    <td>
                        <integer-input v-model="row.v_qty" class="inline" :min="1"></integer-input>
                    </td>
                    <td v-if="showLine">
                        <el-input v-model="row.ean" class="inline"></el-input>
                    </td>
                    <td v-else>
                        <el-input v-model="row.upc" class="inline"></el-input>
                    </td>
                    <td>
                        <span class="operate" @click="cur_del(row_i)">删除</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="mt-sm mb-sm">
                <label class="bold-font">图片关联：</label>
                <el-radio-group v-model="form.set.variation_image" v-for="(item,item_i) in form.mappingspec" :key="item_i">
                    <el-radio v-if="get_head_attr(item)" class="mr-sm"
                              :label="get_head_attr(item)">{{get_head_attr(item)}}</el-radio>
                </el-radio-group>
            </div>
            <div>
                <label class="bold-font">订单商品关联：</label>
                <el-radio class="radio" v-model="form.list.assoc_order" :label="1">自动关联订单商品</el-radio>
                <el-radio class="radio" v-model="form.list.assoc_order" :label="0">不关联订单商品(将转为商品未知订单)</el-radio>
            </div>
            <div class="red " v-if="showRef">注意：当前的"参考销售价"利润率为：{{grossProfit}}，允许降价刊登的幅度为：{{reduction}}；</div>
            <bundling-sales v-model="bundingDialog"
                            :data="transferData"
                            :is-fixed-price-item="true"
                            @submit="submit"></bundling-sales>
            <!--添加sku-->
            <add-goods v-model="addDialog" @add-goods="submit_sku"></add-goods>
            <!--修改图片-->
            <mdf-img :img-form="curRow"
                     :cur-sku="skuName"
                     :goods-id="goodsId"
                     :baseUrl="baseUrl"
                     :img-length="12"
                     :channel_id="1"
                     :img-number="12"
                     @mdfimg-submit="mdfimg_submit"
                     v-model="modifyVisible"></mdf-img>
        </rainbow-header>
    </el-row>
</template>
<style lang="stylus" scoped>
    .c-sku-settings{
        .edit-sku-width{
            width:120px;
        }
        .default-sku-width{
            width:90px;
        }
        .btn-small {
            /*padding: 2px  2px;*/
            line-height: 16px;
            border: none;
        }
        tr:first-child .up {
            display: none;
        }
        tr:last-child .down {
            display: none;
        }
        sort-span {
            height: 16px;
            width: 16px;
        }
        .invoice {
            padding: 5px;
            width: 16px;
            height: 16px;
            &:hover {
                background-color: rgba(7, 17, 27, .3);
                border-radius: 3px;
            }
            &:active {
                background-color: rgba(7, 17, 27, .5);
                border-radius: 3px;
            }
        }
        .invoice-up {
            background: url('../../../../../assets/turnUp .png') no-repeat 5px 5px;
        }

        .invoice-down {
            background: url('../../../../../assets/turnDown.png') no-repeat 5px 5px;
        }
    }
</style>
<script>
    import {get_path,random_img} from './get-path';
    import {api_pricing_rules} from '../../../../../api/ebay-kandeng-public-module';
    import {api_get_categories, api_add_goods} from  "../../../../../api/supplier-quote";
    export default{
        data(){
            return {
                skuName:'',
                useMappingspec:[],
                grossProfit:"10%",
                reduction:'5%',
                addDialog:false,
                bundingDialog:false,
                transferData:[],
                curGoodId:"",
                curRow:{},
                curIndex:'',
                mdfPrice:"",
                mdfQuantity:"",
                mdfUpc:"",
                modifyVisible:false,
                curAttr:"",
                curValue:"",
                imgsList:[],
                oldCurSite:{},
                goodsId:"",
            }
        },
        methods:{
            get_path,
            random_img,
            reference_sale_price(row){
                let price = '';
                let priceObj = this.referencePrice[this.form.account_id];
                if(priceObj&&priceObj[row.sku_id]&&priceObj[row.sku_id].total_price){
                    price = parseFloat(priceObj[row.sku_id].total_price);
                }
                return price;
            },
            update_header(){
                let params = {
                    page:1,
                    pageSize:30
                };
                this.$http(api_add_goods,params).then(res=>{
                    console.log(res,'res');
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            up(index){
                let datas = this.form.varians.splice(index - 1, 1);
                this.form.varians.splice(index, 0, datas[0]);
                this.$emit('change');
            },
            attrSort(item, index, sort){
                this.form.list.useMappingspec.splice(index, 1);//先删
                this.form.list.useMappingspec.splice(index+sort,0,item);//再插
                this.form.varians.forEach(row=>{
                    let cur = row.variation.splice(index,1);
                    row.variation.splice(index+sort,0,cur[0]);
                })
            },
            make_application(){
                this.form.varians.forEach(row=>{
                    row.v_price = this.reference_sale_price(row);
                    this.blur_price(row);
                });
            },
            down(index){
                let datas = this.form.varians.splice(index + 1, 1);
                this.form.varians.splice(index, 0, datas[0]);
                this.$emit('change');
            },
            blur_price(row){
                this.$emit('blur-price',row);
            },
            random_click(){
                this.form.varians.forEach(row=>{
                    row.path = random_img(row.path);
                });
            },
            cur_delete(){
                this.$confirm(`此操作将删除当前SKU列表中所有展图,确认进行此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.form.varians.forEach(row=>{
                        row.path = [];
                    });
                }).catch(() => {
                    this.$message({type:"info",message:"已取消操作"})
                })
            },
            blur_change(val,item,custom){
                if(!!custom) val = val.target.value; //custom是否为自定义输入框  获取自定义输入框里的值
                this.$set(item,'value',val);//用于批量修改框里面的展示；
                if(val==='')return;
                this.form.varians.forEach(row=>{
                    if(row.isCheck&&!row.isDisabled){
                        let find = row.variation.find(res=>{return res.channel_spec===item.channel_spec});
                        if(!!find)find.value = val;
                    }
                })
            },
            get_attr(val){
                return val.value;
            },
            batch_change(name,val){
                if(!val)return;
                let curData = this.form.varians.filter(row=>!!row.isCheck);
                switch(name){
                    case 'mdfPrice':
                        this.$emit('batch-mdf-price',{row:curData,newPrice:val});
                        this.mdfPrice = '';
                        break;
                    case 'mdfQuantity':
                        curData.forEach(row=>{
                            row.v_qty = val;
                        });
                        this.mdfQuantity = '';
                        break;
                    case 'mdfUpc':
                        curData.forEach(row=>{
                            if(this.showLine){
                                row.ean = val;
                            }else{
                                row.upc = val;
                            }
                        });
                        this.mdfUpc = '';
                        break;
                }
            },
            change_Price_parities(){
                this.$nextTick(()=>{
                    this.form.varians.forEach(row=>{
                        let rmb =!!this.oldCurSite.official_rate?(parseFloat(row.v_price)*this.oldCurSite.official_rate):parseFloat(row.v_price);
                        row.v_price = (rmb/this.curSite.official_rate).toFixed(2);
                    })
                });
            },
            change_combine(val,item){
                item.combine_spec = val;
                this.form.varians.forEach(row=>{
                    let sku_attributes_v = row.sku_attributes_n[item.combine_spec];
                    let v_child = row.variation.find(res=>{return res.channel_spec===item.channel_spec});
                    if(val==='package'){
                        let combine_sku = row.combine_sku.split(',');
                        if(combine_sku.length>0){
                            v_child&&(v_child.value = combine_sku[0].split('*')[1]);
                            this.$set(row.sku_attributes_n,val,v_child.value);
                        }else{
                            console.log('捆绑/打包销售未绑定数据');
                        }
                    }else{
                        let skuAttributesList = [];
                        let length = 0;
                        if(!!sku_attributes_v){
                            skuAttributesList = sku_attributes_v.split("|");
                            length = skuAttributesList.length;
                        }
                        if(item.custom!==1) {
                            let params = item.detail.find(res => {
                                return res.category_specific_value === skuAttributesList[length-1];
                            });
                            if (item.selection_mode === "FreeText") {
                                if(!!v_child) v_child.value=!!params?params.category_specific_value:skuAttributesList[length - 1];
                            } else {
                                if (!!params && v_child) v_child.value = params.category_specific_value;
                            }
                        }else{
                            if(!!v_child) v_child.value = skuAttributesList[length - 1];
                        }
                    }

                })
            },
            check_all(val){},
            delete_mappingspec(item){
                let index = this.form.mappingspec.findIndex(res=>{return res.channel_spec ===item.category_specific_name});
                if(index>-1)this.form.mappingspec.splice(index,1);
            },
            get_mappingspec(Array){
                Array.forEach(row=>{
                    let cur = this.form.mappingspec.find(res=>{return res.channel_spec === row.category_specific_name});
                    if(!!cur){
                        cur.specific_value = row.specific_value;
                        cur.detail = row.detail;
                    }else if(!cur){
                        if(row.category_specific_name==="") return;
                        let obj = {
                            is_check:false,
                            custom:row.custom,
                            channel_spec:row.category_specific_name,
                            combine_spec:"",
                            selection_mode:row.selection_mode,
                            min_values:row.min_values,
                            specific_value:row.specific_value,
                            detail:row.detail,
                        };
                        this.form.mappingspec.push(obj);
                    }
                })
            },
            get_head_ref(item){
                if(item.is_check){
                    return item.combine_spec;
                }else {
                    return false
                }
            },
            get_head_attr(item){
                if(item.is_check){
                    return item.channel_spec
                }else {
                    return false
                }
            },
            get_row_refs(row,key){
                if(row){
                    if(key==="value"){
//                        let header = Object.keys(this.form.varians[0].sku_attributes_n);
                        let cur = this.comHeader.map(res=>{
                            return row.sku_attributes_n[res]
                        });
                        return cur;
                    }else{
                        return Object.keys(row.sku_attributes_n);
                    }
                }
            },
            get_row_ref(item,row){
                if(item.is_check){
                    let length = Object.keys(row.sku_attributes_n).length;
                    let ref=item.combine_spec;
                    if(!!ref){
                        return length===0?"- -":row.sku_attributes_n[ref];
                    }
                }else {
                    return Object.keys(row.sku_attributes_n).map(res=>{
                        return row.sku_attributes_n[res];
                    });
                }
            },
            get_row_attr(item,row){
                if(item.is_check){
                    let find=row.variation.find(attr=>{
                        return attr.channel_spec===item.channel_spec
                    });
                    return !!find?find.value:'';
                }else {
                    return false
                }
            },
            get_option(items,rowitem){
                if(!items.detail||items.detail.length<=0)return;
                if(!!items.relationship){
                    let cloneArr = [];
                    let detail = [];
                    let parent_name = items.detail[0].parent_name;
                    let childName = items.channel_spec;
                    cloneArr = !!rowitem?rowitem.variation:this.form.mappingspec;
                    let cur = cloneArr.find(row=>row.channel_spec===parent_name);
                    let curObj = cloneArr.find(row=>row.channel_spec===childName);
                    if(!!cur){
                        detail = items.detail.filter(item=>item.parent_value===cur.value);
//                        if(items.selection_mode==="SelectionOnly"){
//                            curObj.value="";
//                        }
                    }
                    return detail;
                }else{
                    return items.detail;
                }
            },
            com_placeholder(items,row){
                if(!items.detail||items.detail.length<=0)return;
                let cur = "";
                let cloneData = window.clone(row.variation);
                if(this.get_option(items,row).length<=0){
                    let parentName = items.detail[0].parent_name;
                    let curObj = cloneData.find(row=>row.channel_spec===parentName);
                    if(!!curObj) {
                        if (curObj.value === '') {
                            cur = `请先选择${parentName}`;
                        } else {
                            cur = "暂无数据";
                        }
                    }else{
                        cur = `请先选择${parentName}`;
                    }
                }else{
                    cur = "请添加或选择商品属性";
                }
                return cur;
            },
            /*设置多属性的值*/
            set_attr(row,row_i,item,item_i,val){
                if(item.combine_spec&&item.combine_spec!==""){
                    let ref=item.combine_spec;
                    let value=row.sku_attributes_n[ref];
                    if(value){
                        this.form.varians.forEach((attr,attr_i)=>{
                            if(value&&value!==""&&attr.sku_attributes_n[ref]===value){
                                let find2=attr.variation.find(channel=>{
                                    return channel.channel_spec===item.channel_spec
                                });
                                if(!!find2) {
                                    find2.value=val;
                                }else{
                                    return val;
                                }
                            }
                        })
                    }else{
                        let find3=row.variation.find(channel=>{
                            return channel.channel_spec===item.channel_spec
                        });
                        if(!!find3) {
                            find3.value=val;
                        }else{
                            return val;
                        }
                    }
                }else {
                    let find = this.form.varians[row_i].variation.find(attr=>{
                        return attr.channel_spec===item.channel_spec
                    });
                    if(!!find) {
                        find.value=val;
                    }else{
                        return val;
                    }
                }
            },

            check_all_map(val){
                this.checkAllMap = val;
                this.get_useMappingspec(this.checkAllMap,true);
                if(!!this.checkAllMap){
                    this.form.varians.forEach(row=>{
                        row.variation = [];
                    });
                    this.form.mappingspec.forEach(row=>{
                        let obj = {
                            channel_spec:row.channel_spec,
                            value:row.specific_value,
                            min_values:row.min_values,
                            selection_mode:row.selection_mode,
                            attr_values:row.detail,
                        };
                        this.form.varians.forEach(res=>{
                            res.variation.push(window.clone(obj));
                        });
                    })
                }else{
                    this.form.mappingspec.forEach(row=>{
                        this.form.varians.forEach(res=>{
                            let index = res.variation.findIndex(item=>{return item.channel_spec===row.channel_spec})
                            if(index !==-1){
                                res.variation.splice(index,1)
                            }
                        });
                    })
                }
            },
            //是否启用属性
            start_using(row,val){
                row.is_check = val;
                if(this.form.varians&&this.form.varians.length<=0){
                    row.is_check = false;
                    return this.$message({type:"warning",message:"当前sku数据为空，请先添加一条sku数据"})
                }
                this.get_useMappingspec(row.is_check,false,row);
                if(row.is_check){
                    let isTrue = false;
                    this.form.varians.forEach(it=>{
                        let find = it.variation.find(res=>res.channel_spec===row.channel_spec);
                        if(find) isTrue = true
                    });
                    if(isTrue) return; //判断是都已存在相同属性
                    let obj = {
                        channel_spec:row.channel_spec,
                        value:row.specific_value,
                        min_values:row.min_values,
                        selection_mode:row.selection_mode,
                        attr_values:row.detail,
                    };
                    this.form.varians.forEach(res=>{
                        res.variation.push(window.clone(obj));
                    });
                    this.form.set.variation_image = row.channel_spec;
                }else{
                    row.combine_spec = "";
                    let cloneVariationImage = clone(this.form.set.variation_image);
                    this.form.varians.forEach(res=>{
                        let index = res.variation.findIndex(item=>{return item.channel_spec===row.channel_spec});
                        if(index !==-1){
                            res.variation.splice(index,1)
                        }
                        if(row.channel_spec===cloneVariationImage&&res.variation.length>0) this.form.set.variation_image = res.variation[0].channel_spec;
                    });
                }

            },
            //获取useMappingspec值
            get_useMappingspec(isTrue,isAll,val){
                /*isAll 判断是批量操作还是单个属性操作
                * */
                if(isAll){
                    if(isTrue){
                        this.form.list.useMappingspec = [];
                        this.form.list.useMappingspec = this.form.mappingspec;
                    }else{
                        this.form.list.useMappingspec = [];
                    }
                }else{
                    if(isTrue){
                        let find = this.form.list.useMappingspec.find(row=>row.channel_spec===val.channel_spec);
                        if(!find) this.form.list.useMappingspec.push(val);
                    }else{
                        let curIndex = this.form.list.useMappingspec.findIndex(res=>res.channel_spec===val.channel_spec);
                        if(curIndex>-1)this.form.list.useMappingspec.splice(curIndex,1);
                    }
                }

            },
            //添加sku
            add_sku(){
                this.addDialog = true;
            },
            //复制sku
            copy_sku(){
                let list = clone(this.form.varians.filter(row=>row.isCheck));
                list.forEach(row=>{
                    let combine_sku = row.combine_sku.split(',');
                    if(combine_sku.length>0){
                        let combine_sku_ = combine_sku[0].split('*');
                        combine_sku_[1] = parseInt(combine_sku_[1])+1;
                        combine_sku[0] = combine_sku_.join('*');
                        row.map_sku[0].sku = combine_sku[0];
                    }
                    row.combine_sku = combine_sku.join(',');

                });
                this.update_package(list);
                this.form.varians.forEach(row=>{row.isCheck = false});
                this.form.varians =[...this.form.varians,...list];

            },
            update_package(list){
                let findPackage  = this.form.mappingspec.find(row=>row.combine_spec==='package');
                if(!findPackage)return;
                list.forEach(row=>{
                    this.handle_sku(row,findPackage);
                });
            },
            handle_sku(row,findPackage){
                let combine_sku = row.combine_sku.split(',');
                if(combine_sku.length>0) {
                    let combine_sku_ = combine_sku[0].split('*');
                    let find = row.variation.find(res=>res.channel_spec === findPackage.channel_spec);
                    if(!!find){
                        row.sku_attributes_n['package'] = combine_sku_[1];
                        find.value = combine_sku_[1];
                    }
                }else{
                    console.log("捆绑/打包销售未绑定数据");
                }
            },
            //选择商品后的提交
            async submit_sku(val,goods){
                let cur = [];
                let baseUrl = this.baseUrl;
                let sameSkuName = [];
                let keys2 = [];//sku_attributes_n 中存在的key集合
                if(this.form.varians&&this.form.varians.length>0){
                    cur = this.form.varians[0].variation;
                    if(this.form.varians[0].path&&this.form.varians[0].path.length>0){
                        baseUrl =  this.form.varians[0].path[0].base_url;
                    }
                    keys2 = Object.keys(this.form.varians[0].sku_attributes_n).filter(row=>{
                        return row;
                    });
                }
                let keys1 = goods.keys.map(row=>{
                    let child,splitData = row.split('|');
                    if(splitData.length>1){
                        child = row.split('|')[1].toLowerCase();
                        if(child.includes('(')){
                            child = child.split('(')[0];
                        }
                    }else if(splitData.length===1){
                        child = splitData[0].toLowerCase();
                    }
                    return child;
                });
                let keys3 = Array.from(new Set([...keys2,...keys1]));
                let skuList = val.map(row=>row.sku_id);
                let curPrice = await this.$http(api_pricing_rules,{
                    channel_id:1,
                    account_id:this.form.account_id,
                    site_code:this.form.site,
                    sku_id:skuList,
                });
                val.forEach(row=>{
                    let list = {};
                    goods.keys.forEach(item=>{
                        let child,splitData = item.split('|');
                        if(splitData.length>1){
                            child = item.split('|')[1].toLowerCase();
                            if(child.includes('(')){
                                child = child.split('(')[0];
                            }
                        }else if(splitData.length===1){
                            child = splitData[0].toLowerCase();
                        }
                        list[child] = row[item];
                    });
                    keys3.forEach(it=>{
                        if(!list[it]){
                            list[it] = '';
                        }
                        if(this.form.varians.length>0){
                            this.form.varians.forEach(res=>{
                                if(!res.sku_attributes_n[it]){
                                    res.sku_attributes_n[it] = '';
                                }
                            })
                        }
                    });
                    let sameSku = this.form.varians.find(res=>res.v_sku===row.sku);
                    if(!!sameSku)return sameSkuName.push(row.sku);
                    let obj = {
                        goods_id:row.goods_id,
                        sku_id:row.sku_id,
                        sku:`${row.sku}*1`,
                    };
                    let path = [
                        {path:row.path,base_url:baseUrl}
                    ];
                    let curObj = {
                        sku_id:row.sku_id,
                        isCheck:true,
                        v_sku:row.sku,
                        combine_sku:`${row.sku}*1`,
                        v_price:this.return_pricing(curPrice,row.sku_id),
                        v_qty:"",
                        variation:window.clone(cur),
                        sku_attributes_n:list,
                        path:path,
                        map_sku:[],
                        upc:"Does not apply",
                        ean:"Does not apply",
                        isbn:"Does not apply",
                    };
                    curObj.map_sku.push(obj);
                    this.form.varians.push(curObj);
                });
                let ids = val.map(row=>row.goods_id);
                if(ids.length>0){
                    this.$emit('submit-sku',ids);
                }
                if(sameSkuName.length>0){
                    this.$message({
                        type:"warning",
                        message:`SKU:${sameSkuName.join(",")}已经在列表中存在，请不要重复添加`
                    });
                }
            },

            //刊登定价规则 整理获取值
            return_pricing(curPrice,skuId){
                let price = '';
                if(skuId){
                    if(curPrice&&curPrice[skuId]&&curPrice[skuId].total_price!==undefined){
                        price =  curPrice[skuId].total_price;
                    }
                }
                return price
            },
            //点击   捆绑/打包销售
            bundling_sales(row,index){
                this.curRow = window.clone(row);
                this.curIndex = index;
                this.bundingDialog = true;
                let combine_sku = window.clone(row.map_sku);
                this.transferData = [];
                if(combine_sku.length>0){
                    combine_sku.forEach(row=>{
                        let cur = row.sku.split("*");
                        let obj = {
                            sku_id:row.sku_id,
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
                let cur = this.form.varians[this.curIndex];
                if(!!cur){
                    cur.combine_sku = val;
                    cur.map_sku = val2;
                    this.transferData = val2;
                    this.$message({type:"success",message:"捆绑成功！"});
                    let findPackage  = this.form.mappingspec.find(row=>row.combine_spec==='package');
                    if(!findPackage)return;
                    this.handle_sku(cur,findPackage);

                }
            },
            //删除
            cur_del(index){
                this.form.varians.splice(index,1);
            },
            //修改图片
            modify_picture(row,index){
                this.skuName = row.v_sku;
                this.curRow = window.clone(row);
                this.curIndex = index;
                this.modifyVisible = true;
                let cur = [];
                row.map_sku.forEach(res=>{cur.push(res.goods_id)});
                this.curGoodId = cur.join(',');
                this.goodsId = row.goods_id || (cur.length&&cur[0]);
            },
            mdfimg_submit(val){
                let curObj = this.form.varians[this.curIndex];
                if(!!curObj) curObj.path = val.path;
            },
        },
        watch:{
            "form.specificsList"(newVal){
                if(!!newVal)this.get_mappingspec(newVal);
            },
            curSite(newValue,oldValue){
                if(!!oldValue)this.oldCurSite = clone(oldValue);
            },
        },
        computed:{
            showRef(){//是否展示参考销售价，Boolean
                let find = '';
                let priceRef = this.referencePrice[this.form.account_id];
                if(priceRef&&this.form.varians){
                    /*找到一个sku有total_price，就展示销售价*/
                    find = this.form.varians.find(row=>!!priceRef[row.sku_id]&&priceRef[row.sku_id].total_price)
                }
                return !!find
            },
            comHeader(){
                let list = [];
                this.form.varians.forEach(row=>{
                    let key = Object.keys(row.sku_attributes_n);
                    list = [...list,...key];
                });
                list = [...new Set(list)];
                return list;
            },
            showLine(){
                /*英国、德国、西班牙、法国、意大利，
                            这5个只需显示EAN 其他的都只需显示UPC
                             法国：71
                            德国：77
                            西班牙：186
                            英国：3
                            意大利：101 */
                let cur = this.form.list.site;
                return !!(cur===71||cur===77||cur===186||cur===3||cur===101);
            },
            curSite(){
                let curObj = {};
                if(this.siteList&&this.siteList.length>0){
                    let cur = this.siteList.find(row=>row.siteid===this.form.list.site);
                    if(!!cur) curObj = cur;
                }
                return curObj
            },
            unmatchList(){
                let cur =  [];
                let cloneList = window.clone(this.form.mappingspec);
                if(cloneList&&cloneList.length>0){
                    cur = cloneList.filter(row=>{return row.combine_spec===""});
                }
                return cur;
            },
            detailAttr(){
                let cur = {};
                let cloneList = window.clone(this.form.mappingspec);
                if(cloneList&&cloneList.length>0&&this.curAttr){
                    cur = cloneList.find(row=>{return row.channel_spec===this.curAttr})
                }
                return !!cur?cur:{}
            },
            checkAll:{
                get(){
                    let cur= this.form.varians.find(row=> !row.isCheck);
                    return !cur;
                },
                set(val){
                    this.form.varians.forEach(row=>{
                        row.isCheck = !!val;
                    })
                }
            },
            checkAllMap:{
                get(){
                    let cur = this.form.mappingspec.find(row=>!row.is_check);
                    return !cur;
                },
                set(val){
                    this.form.mappingspec.forEach(row=>{
                        row.is_check = !!val;
                    })
                }
            },
            localName(){
                let cur = [];
                if(this.form.varians&&this.form.varians.length>0){
                    this.form.varians.forEach((row)=>{
                        if(row.variation instanceof Array){
                            row.variation.forEach(res=>{
                                cur.push(res.name);
                            })
                        }else{
                            console.log("row.variation 不是数组类型");
                        }
                    })
                }
                return cur;
            },
            curAttrInfo(){
                let cur = [];
                if(this.attrInfo instanceof Array){
                    return cur
                }else{
                    for(let i in this.attrInfo){
                        let find=this.form.mappingspec.find(row=>{
                            return  row.combine_spec===i
                        });
                        cur.push({value:i,disabled:!!find});
                    }
                    return cur;
                }
            },
        },
        props:{
            form:{},
            accountId:{},
            localAttr:{},
            attrInfo:{},
            siteList:{},
            baseUrl:{
                required:true,
                type:String,
            },
            param:{
                require:true,
                type:Object
            },
            referencePrice:{//参考售价
                require:true,
                type:Object
            }
        },
        components: {
            bundlingSales:require('./bundling-sales.vue').default,
            addGoods:require('../../../../../api-components/add-goods.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            modifyPicture:require('./modify-picture.vue').default,
            mdfImg:require('./mdf-img.vue').default,
            integerInput:require('../../../../../components/integer-input.vue').default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>
