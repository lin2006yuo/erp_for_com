<template>
    <div class="p-batch-edit">
        <page-dialog :title="titles" size="large" v-model="show" :close-on-click-modal="false" @change="change_dialog" >
            <!--修改标题-->
            <div  v-if="flag===1" class="ml-sm">
                <el-row>
                    <el-col :span="8" style="width: 150px;">
                        <el-radio  v-model="title.select" label="1">添加前后缀</el-radio>
                    </el-col>
                    <el-col :span="16">
                        <el-row class="mb-xs">
                            <el-checkbox v-model="title.prefix.isPre">前缀</el-checkbox>
                            <el-input v-model="title.prefix.pre" placeholder="请输入内容"
                                      class="inline" style="width:400px"></el-input>
                        </el-row>
                        <el-row class="mb-xs">
                            <el-checkbox v-model="title.prefix.isSuf">后缀</el-checkbox>
                            <el-input v-model="title.prefix.suf" placeholder="请输入内容"
                                      class="inline" style="width:400px"></el-input>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" style="width: 150px;">
                        <el-radio  v-model="title.select" label="2">查找并替换</el-radio>
                    </el-col>
                    <el-col :span="16">
                        <el-row class="mb-xs" style="padding: 18px">
                            查找 <el-input v-model="title.find.value" placeholder="请输入内容"
                                         class="inline" style="width:400px"></el-input>
                        </el-row>
                        <el-row  class="mb-xs" style="padding: 18px">
                            替换 <el-input v-model="title.find.replace" placeholder="请输入内容"
                                         class="inline" style="width:400px"></el-input>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" style="width: 150px;">
                        <el-radio  v-model="title.select" label="3">统一修改为</el-radio>
                    </el-col>
                    <el-col :span="16" style="padding-left: 45px;">
                        <el-input v-model="title.unite" placeholder="请输入内容"
                                  class="inline" style="width:400px"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-radio  v-model="title.select" label="5">首字母改大写</el-radio>
                </el-row>
                <el-row>
                    <el-button size="mini"
                               @click.native="title_preview"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>

                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="subject"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="newSubject"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--修改销售单位-->
            <div v-if="flag===2" class="ml-sm">
                <el-row>
                    <label style="width: 150px;"> 最小计量单位：</label>
                    <el-select v-model="bag.unit" placeholder="请选择" class="inline">
                        <el-option
                                :key="item.id"
                                v-for="item in bags"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-row>
                <el-row class="ml-lg">
                    <label style="width: 150px;">销售方式：</label>
                    <div class="inline">
                        <p>
                            <el-radio   v-model="bag.select" :label="0">单个{{bageName}}</el-radio>
                        </p>
                        <p>
                            <el-radio   v-model="bag.select" :label="1">打包销售{{bageName}}</el-radio>
                            <span>每包 <el-input v-model="bag.count" class="inline"></el-input></span>
                        </p>
                    </div>
                </el-row>
                <el-row>
                    <el-button size="mini"
                               @click.native="look_unit"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="product_unit_name"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="unit_name"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--修改包装重量-->
            <div v-if="flag===3" class="ml-sm">
                <div >
                    <p>
                        <el-radio  v-model="weight.select" label="1">统一修改为：</el-radio>
                        <el-input-number class="inline" size="small"
                                         v-model="weight.textall"
                                         :controls="false"
                                         style="width:150px"
                        >
                        </el-input-number>公斤
                    </p>
                    <p>
                        <el-radio  v-model="weight.select" label="2">按重量增加：</el-radio>
                        <el-input-number class="inline" size="small"
                                         v-model="weight.textadd"
                                         :controls="false"
                                         style="width:150px"
                        >
                        </el-input-number>公斤
                    </p>
                    <p>
                        <el-radio  v-model="weight.select" label="3">按涨幅增加：</el-radio>
                        <el-input-number class="inline" size="small"
                                         v-model="weight.textaup"
                                         :controls="false"
                                         style="width:150px"
                        >
                        </el-input-number>%
                    </p>
                </div>
                <el-row>
                    <el-button size="mini"
                               @click.native="weight_look"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="gross_weight"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="weight"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--修改尺寸  长宽高-->
            <div v-if="flag===4" class="ml-sm">
                <div>

                    <p>长： <el-input-number class="inline" size="small"
                                           v-model="size.length"
                                           :controls="false"
                                           style="width:150px"
                    >
                    </el-input-number>厘米</p>
                    <p>宽：<el-input-number class="inline" size="small"
                                          v-model="size.width"
                                          :controls="false"
                                          style="width:150px"
                    >
                    </el-input-number>厘米</p>
                    <p>高：<el-input-number class="inline" size="small"
                                          v-model="size.height"
                                          :controls="false"
                                          style="width:150px"
                    >
                    </el-input-number>厘米</p>
                </div>
                <el-row>
                    <el-button size="mini"
                               @click.native="size_look"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            label="修改前"
                            inline-template
                    >
                        <span>{{row.package_length}}×{{row.package_width}}×{{row.package_height}}</span>
                    </el-table-column>
                    <el-table-column
                            prop="newSize"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--修改产品信息模块-->
            <div v-if="flag===5" class="ml-sm">
                <div>
                    <p>关联产品模块：
                        <el-select v-model="information.relation" class="inline"  placeholder="请选择">
                            <el-option
                                    v-for="item in customTemplate.relation"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-radio class="radio" v-model="information.relation_position" label="top">顶部</el-radio>
                        <el-radio class="radio" v-model="information.relation_position" label="bottom">底部</el-radio>
                    </p>
                    <p>自定义信息模块：
                        <el-select v-model="information.custom" class="inline"  placeholder="请选择">
                            <el-option
                                    v-for="item in customTemplate.custom"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-radio class="radio" v-model="information.custom_position" label="top">顶部</el-radio>
                        <el-radio class="radio" v-model="information.custom_position" label="bottom">底部</el-radio>
                    </p>
                </div>
                <el-row>
                    <el-button size="mini"
                               @click.native="custom_relation_look"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            inline-template
                            label="修改前"
                    >
                        <div>
                            <p>
                                <span>关联产品模块:{{row.relation_name}}</span>
                                <span>位置:{{row.relation_position}}</span>
                            </p>
                            <p>
                                <span>自定义信息模块:{{row.custom_name}}</span>
                                <span>位置:{{row.custom_position}}</span>
                            </p>
                        </div>
                    </el-table-column>
                    <el-table-column inline-template label="修改后">
                        <div>
                            <p>
                                <span>关联产品模块:{{row.relation_name_new}}</span>
                                <span>位置:{{row.relation_position_new|positionFilter}}</span>
                            </p>
                            <p>
                                <span>自定义信息模块:{{row.custom_name_new}}</span>
                                <span>位置:{{row.custom_position_new|positionFilter}}</span>
                            </p>
                        </div>
                    </el-table-column>
                </el-table>

            </div>
            <!--修改服务模板-->
            <div v-if="flag===6" class="ml-sm">
                <div>
                    <label >服务模板：</label>
                    <el-select v-model="serviceTemplate" placeholder="请选择" class="inline">
                        <el-option
                                :key="item.template_id"
                                v-for="item in severTemplate"
                                :label="item.template_name"
                                :value="item.template_id">
                        </el-option>
                    </el-select>
                </div>
                <el-row>
                    <el-button size="mini"
                               @click.native="look_service"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="promise_template_name"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="newPromise"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--修改运费模板-->
            <div v-if="flag===7" class="ml-sm">
                <div>
                    <label >运费模板：</label>
                    <el-select v-model="shippingTemplate" placeholder="请选择" class="inline">
                        <el-option
                                :key="item.template_id"
                                v-for="item in template"
                                :label="item.template_name"
                                :value="item.template_id">
                        </el-option>
                    </el-select>
                </div>
                <el-row>
                    <el-button size="mini"
                               @click.native="look_Template"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="freight_template_name"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="template_name"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--修改零售价-->
            <div v-if="flag===8" class="ml-sm">
                <div>
                    <p>
                        <el-radio  v-model="price.select" label="1">按照金额增加</el-radio>
                        <ui-limit-number  style="width:100px"  class="inline"  v-model="price.add" :limit="2"></ui-limit-number>USD
                    </p>
                    <p>
                        <el-radio  v-model="price.select" label="2">按照涨幅增加</el-radio>
                        <ui-limit-number  style="width:100px"  class="inline"  v-model="price.up" :limit="2"></ui-limit-number>%
                    </p>
                </div>
                <el-row>
                    <el-button size="mini"
                               @click.native="look_price"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="sku_price"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="newPrice"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--批量修改产品分组-->
            <div v-if="flag===9" class="ml-sm">
                <ui-list-check @get="get" :option="groups" ></ui-list-check>
                <p>小提示：最多可以同时选择3项</p>
                <el-row>
                    <el-button size="mini"
                               @click.native="look_group"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="group_name"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="groupNewname"
                            label="修改后">
                    </el-table-column>
                </el-table>

            </div>
            <!--批量修改发货期-->
            <div v-if="flag===10" class="ml-sm">
                <el-row>
                    <el-col :span="2"><span class="ml-sm">修改方式：</span></el-col>
                    <el-col :span="22">
                        <div class="mb-xs">
                            <el-radio  v-model="delivery.select" label="1">修改为</el-radio>
                            <el-input-number class="inline" size="small"
                                             v-model="delivery.text"
                                             :controls="false"
                                             :debounce="0"
                                             :min="0"
                                             style="width:100px"
                            >
                            </el-input-number>天
                        </div>
                        <div>
                            <el-radio  v-model="delivery.select" label="2">增加&nbsp;&nbsp;&nbsp;</el-radio>
                            <el-input-number class="inline" size="small"
                                             v-model="delivery.add"
                                             :controls="false"
                                             :min="minAdd"
                                             style="width:100px"
                            >
                            </el-input-number>天
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button size="mini"
                               @click.native="look_delivery"
                               type="primary"
                               class="mt-sm mb-sm fr">预览</el-button>
                </el-row>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="delivery_time"
                            label="修改前"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="delivery"
                            label="修改后">
                    </el-table-column>
                </el-table>


            </div>
            <!--批量延长有效期-->
            <div v-if="flag===11" class="ml-sm">
                <span>小提示：产品有效期在3天以内的才能修改，大于3天的都不能修改产品有效期。产品有效期延长方式为：自动延长至初始刊登时所选择的有效期天数。</span>
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="product_id"
                            label="商品ID"
                    >
                    </el-table-column>
                </el-table>

            </div>
            <!--修改可售数量-->
            <div v-if="flag===12" class="ml-sm">
              <label>批量修改可售数量为：</label>
              <el-input-number class="inline" size="small"
                               v-model="setStock"
                               :controls="false"
                               :debounce="0"
                               :min="0"
                               style="width:100px"
              ></el-input-number>
              <div style="padding-top: 20px;text-align: right;padding-bottom: 10px;">
                <el-button type="primary" size="mini" @click="set_stock_num">预览</el-button>
              </div>
              <div v-for="item in tableData">
                <p>商品ID：{{item.product_id}}</p>
                <el-table
                  :data="item.product_sku"
                  style="width: 100%">
                  <el-table-column
                    prop="sku_code"
                    label="SKU"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="ipm_sku_stock"
                    label="修改前"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="newStock"
                    label="修改后">
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="keep" type="primary"  >保存待同步平台</el-button>
                <el-button size="mini" @click.native="close" >关   闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
  import {
    api_aliexpress_productUnit,
    api_aliexpress_team,
    api_aliexpress_service_template,
    api_aliexpress_template,
    api_aliexpress_batch_product,
    api_aliexpress_batch_unit,
    api_aliexpress_batch_size,
    api_aliexpress_batch_group,
    api_aliexpress_batch_delivery,
    api_aliexpress_batch_eff,
    api_aliexpress_batch_price,
    api_ali_custom_template,
    api_ali_custom_template_keep,
    api_edit_ae_stock
  } from "../../../../api/publish-smt"
    export default{
        data(){
            return {
                show:false,
                tableData:[],
                bags:[],
                groups:[],
                severTemplate:[],
                template:[],
                account_id:"",
                delivery:{
                    select:"",
                    text:0,
                    add:0
                },
                minAdd:0,
                group_id:[],
                title:{
                    select:"",
                    prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                    find:{value:"",replace:""},
                    unite:""
                },
                bag:{
                    unit:"",
                    select:"",
                    count:""
                },
                weight:{
                    select:"",
                    textall:"",
                    textadd:"",
                    textaup:""
                },
                size:{
                    length:"",
                    width:"",
                    height:""
                },
                information:{
                    custom:"",
                    relation:"",
                    custom_position:"bottom",
                    relation_position:"top",
                },
                serviceTemplate:"",
                shippingTemplate:"",
                price:{
                    select:"",
                    add:0,
                    up:0,
                },
                customTemplate:{
                    custom:[],
                    relation:[],
                },
                setStock:0
            }
        },
        created(){

        },
        mounted(){
        },
        computed: {
            titles(){
                switch (this.flag){
                    case 1:
                        return "修改刊登标题";
                        break;
                    case 2:
                        return "修改销售单位";
                        break;
                    case 3:
                        return "修改包装重量";
                        break;
                    case 4:
                        return "修改包装尺寸";
                        break;
                    case 5:
                        return "修改产品信息模块";
                        break;
                    case 6:
                        return "修改服务模板";
                        break;
                    case 7:
                        return "修改运费模板";
                        break;
                    case 8:
                        return "修改零售价";
                        break;
                    case 9:
                        return "修改商品分组";
                        break;
                    case 10:
                        return "修改发货期";
                        break;
                    case 11:
                        return "延长有效期";
                        break;
                    default:
                        return "修改"
                }
            },
            bageName(){
                let find=this.bags.find(row=>{
                    return this.bag.unit===row.id
                });
                if(!!find){
                    return find.name
                }else {
                    return "件"
                }
            },
        },
        methods: {
            close(){
                this.show=false;
            },
            get_bags(){
                this.$http(api_aliexpress_productUnit).then(res=>{
                    this.bags=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            get_groups(){
                this.$http(api_aliexpress_team,{account_id:this.account_id}).then(res=>{
                    this.groups=res.map(row=>{
                        let group={
                            value:row.group_id,
                            label:row.group_name,
                        }
                        if(!!row.children){
                            group.children=row.children.map(child=>{
                                let data={
                                    value:child.group_id,
                                    label:child.group_name,
                                    disable:false,
                                    check:false
                                }
                                return  data
                            })
                        }else {
                            group.disable=false
                            group.check=false
                        }
                        return group
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            get_sever_template(){
                this.$http(api_aliexpress_service_template,{account_id:this.account_id}).then(res=>{
                    this.severTemplate=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            get_template(){
                this.$http(api_aliexpress_template,{account_id:this.account_id}).then(res=>{
                    this.template=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            get_custom_template(){
                this.$http(api_ali_custom_template,{account_id:this.account_id}).then(res=>{
                    this.customTemplate=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })

            },
            //保存
            keep(){
                switch (this.flag){
                    case 1:
                        this.keep_title();
                        break;
                    case 2:
                        this.keep_unit();
                        break;
                    case 3:
                        this.keep_weight();
                        break;
                    case 4:
                        this.keep_size();
                        break;
                    case 5:
                        this.keep_custom_relation();
                        break;
                    case 6:
                        this.keep_service();
                        break;
                    case 7:
                        this.keep_shipping();
                        break;
                    case 8:
                        this.keep_price();
                        break;
                    case 9:
                        this.keep_group();
                        break;
                    case 10:
                        this.keep_delivery();
                        break;
                    case 11:
                        this.keep_eff()
                        break;
                  case 12:
                        this.keep_stock();
                        break;
                }

            },
            //修改可售数量
            keep_stock(){
                console.log(this.tableData)
                let parameter=[];
                this.tableData.forEach(res=>{
                      res.product_sku.forEach(row=>{
                        parameter.push({
                          product_id:res.product_id,
                          sku:row.sku_code,
                          stock:this.setStock,
                          old_stock:res.stock
                        })
                      });
                });
                this.$http(api_edit_ae_stock,{data:parameter}).then(res=>{
                  this.$message({
                    type: 'success',
                    message: res.message || res
                  });
                  this.show=false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            //  标题修改预览
            title_preview(){
                if(!this.title.select){
                    this.$message({type:'warning',message:"请选择修改方式"})
                    return;
                }
                let flag=true;
                switch (this.title.select){
                    case "1":      //选择前缀 或者后缀
                        if(this.title.prefix.isPre&&this.title.prefix.isSuf){
                            this.tableData.forEach(row=>{
                                this.$set(row,"newSubject",this.title.prefix.pre+row.subject+this.title.prefix.suf)
                            })
                        }else if(this.title.prefix.isPre&&!this.title.prefix.isSuf){
                            this.tableData.forEach(row=>{
                                this.$set(row,"newSubject",this.title.prefix.pre+row.subject)
                            })
                        }else if(!this.title.prefix.isPre&&this.title.prefix.isSuf){
                            this.tableData.forEach(row=>{
                                this.$set(row,"newSubject",row.subject+this.title.prefix.suf)
                            })
                        }else {
                            flag=false
                            this.$message({type:'warning',message:"请选择加前缀或后缀"})
                        }
                        break;
                    case "2":   //查找替换
                        if(this.title.find.value===""){
                            flag=false
                            this.$message({type:'warning',message:"请选择要替换的内容"})
                        }else {
                            this.tableData.forEach(row=>{
                                let reg=new RegExp(this.title.find.value,"g")
                                let name=row.subject.replace(reg,this.title.find.replace)
                                this.$set(row,"newSubject",name)
                            })
                        }
                        break;
                    case "3":  //统一修改
                        if(this.title.unite===""){
                            flag=false
                            this.$message({type:'warning',message:"请选择要替换的内容"})
                        }else {
                            this.tableData.forEach(row=>{
                                this.$set(row,"newSubject",this.title.unite)
                            })
                        }
                        break;
                    case "4": //过滤重复词
                        break;
                    case "5": //首字母大写
                        this.tableData.forEach(row=>{
                            let name= row.subject.split(/\s+/);
                            name= name.map(rows=>{
                                rows=this.up_first_letter(rows)
                                return rows;
                            });
                            this.$set(row,"newSubject",name.join(' '))
                        })
                        break;
                }
                return flag
            },
            up_first_letter(str){  //首字母大写
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
            //保存标题
            keep_title(){
                let flag=this.title_preview();
                if(flag){
                    let data= this.tableData.map(row=>{
                        return {
                            product_id:row.id,
                            value:row.newSubject
                        }
                    })
                    let postData={
                        type:"title",
                        data:data,
                    }
                    this.post_data(postData)
                }
            },
            post_data(data){
                this.$http(api_aliexpress_batch_product,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            //运费模板预览
            look_Template(){
                if(this.shippingTemplate===""){
                    this.$message({type:"warning",message:"请选择运费模板"})
                    return  false;
                }
                let find=this.template.find(row=>{
                    return row.template_id===this.shippingTemplate;
                })
                if(!find){
                    return false
                }
                this.tableData.forEach(row=>{
                    this.$set(row,"template_name",find.template_name)
                    this.$set(row,"template_id",find.template_id)
                })
                return true
            },
            //修改可售数量
            set_stock_num(){
                if(this.setStock===''){
                  this.$message({type:"warning",message:"请输入可售数量"})
                  return  false;
                }
                this.tableData.forEach(row=>{
                    row.product_sku.forEach(res=>{
                      this.$set(res,"newStock",this.setStock);
                    })
                });
            },
            //保存运费模板
            keep_shipping(){
                let flag=this.look_Template();
                if(flag){
                    let data= this.tableData.map(row=>{
                        return {
                            product_id:row.id,
                            value:row.template_id
                        }
                    })
                    let postData={
                        type:"freightTemp",
                        data:data,
                    }
                    this.post_data(postData)
                }
            },
            //服务模板
            look_service(){
                if(this.serviceTemplate===""){
                    this.$message({type:"warning",message:"请选择服务模板"})
                    return  false;
                }
                let find=this.severTemplate.find(row=>{
                    return row.template_id===this.serviceTemplate;
                })
                if(!find){
                    return false
                }
                this.tableData.forEach(row=>{
                    this.$set(row,"newPromise",find.template_name)
                    this.$set(row,"promise_template_id",find.template_id)
                })
                return true
            },
            keep_service(){
                let flag=this.look_service();
                if(flag){
                    let data= this.tableData.map(row=>{
                        return {
                            product_id:row.id,
                            value:row.promise_template_id
                        }
                    })
                    let postData={
                        type:"promiseTemp",
                        data:data,
                    }
                    this.post_data(postData)
                }
            },
            look_unit(){
                if(this.bag.unit===""){
                    this.$message({type:"warning",message:"请选择运输单位"})
                    return  false;
                };
                if(this.bag.select===""){
                    this.$message({type:"warning",message:"请选择销售方式"})
                    return  false;
                }
                let find=this.bags.find(row=>{
                    return row.id===this.bag.unit;
                })
                if(!find){
                    return false
                }
                this.tableData.forEach(row=>{
                    this.$set(row,"unit_name",find.name)
                    this.$set(row,"unit_id",find.id)
                })
                return true
            },
            keep_unit(){
                let flag=this.look_unit();
                if(flag){
                    let data= this.tableData.map(row=>{
                        return row.id
                    });
                    let postData={
                        product_ids:data.join(","),
                        product_unit:this.bag.unit,
                        package_type:this.bag.select,
                        num:this.bag.count
                    };
                    this.$http(api_aliexpress_batch_unit,postData).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })


                }
            },
            custom_relation_look(){
            let status=""
            if(this.information.custom&&this.information.relation){
                status=1
            }else  if(this.information.custom&&!this.information.relation){
                status=2
            }else  if(!this.information.custom&&this.information.relation){
                status=3
            } else {
                this.$message({type: "warning", message:"请选择关联模块或自定义模块"});
                return false ;
            }
            switch (status){
                case 1:
                    this.tableData.forEach(row=>{
                        let custom=this.customTemplate.custom.find(row=>{
                            return row.id===this.information.custom
                        }).name
                        let relation=this.customTemplate.relation.find(row=>{
                            return row.id===this.information.relation
                        }).name
                        this.$set(row,"custom_name_new",custom)
                        this.$set(row,"relation_name_new",relation)
                        this.$set(row,"custom_position_new",this.information.custom_position)
                        this.$set(row,"relation_position_new",this.information.relation_position)
                    })
                    break;
                case 2:
                    this.tableData.forEach(row=>{
                        let custom=this.customTemplate.custom.find(row=>{
                            return row.id===this.information.custom
                        }).name
                        this.$set(row,"custom_name_new",custom)
                        this.$set(row,"relation_name_new",row.relation_name)
                        this.$set(row,"custom_position_new",this.information.custom_position)
                        this.$set(row,"relation_position_new",row.relation_position)
                    })
                    break;
                case 3:
                    this.tableData.forEach(row=>{
                        let relation=this.customTemplate.relation.find(row=>{
                            return row.id===this.information.relation
                        }).name
                        this.$set(row,"custom_name_new",row.custom_name)
                        this.$set(row,"relation_name_new",relation)
                        this.$set(row,"custom_position_new",row.custom_position)
                        this.$set(row,"relation_position_new",this.information.relation_position)
                    })
                    break;
            }
            return true
            },
           keep_custom_relation(){
                let flag=this.custom_relation_look();
                if(flag){
                   let postData=[];
                    if(this.information.custom&&this.information.relation){
                        this.tableData.forEach(row=>{
                            let parm={
                                id:row.id,
                                relation_template_id:this.information.relation,
                                relation_template_postion:this.information.relation_position,
                                custom_template_id:this.information.custom,
                                custom_tempate_postion:this.information.custom_position,
                            }
                            postData.push(parm)
                        })
                    }else  if(this.information.custom&&!this.information.relation){
                        this.tableData.forEach(row=>{
                            let parm={
                                id:row.id,
                                custom_template_id:this.information.custom,
                                custom_tempate_postion:this.information.custom_position,
                            }
                            postData.push(parm)
                        })
                    }else  if(!this.information.custom&&this.information.relation) {
                        this.tableData.forEach(row=>{
                            let parm={
                                id:row.id,
                                relation_template_id:this.information.relation,
                                relation_template_postion:this.information.relation_position,
                            }
                            postData.push(parm)
                        })
                    }
                    this.$http(api_ali_custom_template_keep,{data:postData}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
           },
            weight_look(){
                if(this.weight.select===""){
                    this.$message({type:"warning",message:"请选择修改方式"})
                    return  false;
                };
                switch (this.weight.select){
                    case '1':
                        this.tableData.forEach(row=>{
                            this.$set(row,"weight",this.weight.textall)
                        });
                        break;
                    case "2":
                        this.tableData.forEach(row=>{
                            let weight=parseFloat(row.gross_weight)+this.weight.textadd;
                            this.$set(row,"weight",weight)
                        });
                        break;
                    case "3":
                        this.tableData.forEach(row=>{
                            this.$set(row,"weight",parseFloat(row.gross_weight)*(1+this.weight.textaup/100))
                        });
                        break;
                }
                return true

            },
            keep_weight(){
                let flag=this.weight_look();
                if(flag){
                    let data= this.tableData.map(row=>{
                        return {
                            product_id:row.id,
                            value:row.weight
                        }
                    })
                    let postData={
                        type:"weight",
                        data:data,
                    }
                    this.post_data(postData)
                }
            },
            size_look(){
                if(this.size["length"]===0||!this.size.width===0||!this.size.height===0){
                    this.$message({type:"warning",message:"请输入完整的长宽高"})
                    return  false;
                }
                this.tableData.forEach(row=>{
                    this.$set(row,"newSize",this.size["length"]+"×"+this.size.width+"×"+this.size.height);
                });
                return  true
            },
            keep_size(){
                let flag=this.size_look();
                if(flag){
                    let product=this.tableData.map(row=>row.id)
                    let postData={
                        product_ids:product.join(","),
                        length:this.size["length"],
                        width:this.size.width,
                        height:this.size.height
                    }
                    this.$http(api_aliexpress_batch_size,postData).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
            },
            get(val){
                this.group_id=val;
            },
            look_group(){
                if(this.group_id.length===0){
                    this.$message({type:"warning",message:"请选择商品分组"})
                    return  false;
                }
                let name=[];
                this.group_id.forEach(row=>{
                    this.groups.forEach(group=>{
                        if(group.children){
                            group.children.forEach(child=>{
                                if(child.value===row){
                                    name.push(child.label)
                                }
                            })
                        }else {
                            if(group.value===row){
                                name.push(group.label)
                            }
                        }

                    })

                })
                this.tableData.forEach(row=>{
                    this.$set(row,"groupNewname",name.join("|"));
                    this.$set(row,"groupNewid",this.group_id.join(","));
                });
                return true
            },
            keep_group(){
                let flag=this.look_group();
                if(flag){
                    let data=[];
                    this.tableData.forEach(row=>{
                        data.push({id:row.id,group_id:row.groupNewid})
                    })
                    this.$http(api_aliexpress_batch_group,{data}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
            },
            look_delivery(){
                if(this.delivery.select===""){
                    this.$message({type:"warning",message:"请选择修改方式"})
                    return  false;
                };
                if(this.delivery.select==="2"){
                    this.tableData.forEach(row=>{
                        let delivery=parseInt(row.delivery_time)+this.delivery.add;
                        this.$set(row,"delivery",delivery);
                    });
                }
                if(this.delivery.select==="1"){
                    this.tableData.forEach(row=>{
                        this.$set(row,"delivery",this.delivery.text);
                    });
                }
                return true
            },
            keep_delivery(){
                let flag=this.look_delivery();
                if(flag){
                    let data=[];
                    this.tableData.forEach(row=>{
                        data.push({id:row.id,delivery_time:row.delivery})
                    })
                    this.$http(api_aliexpress_batch_delivery,{data}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
            },
            keep_eff(){
                let data= this.tableData.map(row=>{
                    return row.id
                });
                this.$http(api_aliexpress_batch_eff,{productIds:data.join(",")}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            look_price(){
                if(this.price.select===""){
                    this.$message({type:"warning",message:"请选择修改方式"})
                    return  false;
                };
                switch (this.price.select){
                    case "1":
                        this.tableData.forEach(row=>{
                            let price=parseFloat(row.sku_price)+ Number(this.price.add);
                            this.$set(row,"newPrice",price.toFixed(2))
                        })
                        break;
                    case "2":
                        this.tableData.forEach(row=>{
                            let price=(parseFloat(row.sku_price))*(1+ Number(this.price.up)/100);
                            this.$set(row,"newPrice",price.toFixed(2))
                        });
                        break;
                }
                return true
            },
            keep_price(){
                let flag=this.look_price();
                if(flag){
                    let data=  this.tableData.map(row=>{
                        let data_row={
                            product_id:row.product_id,
                            sku:row.sku_code,
                            price:row.newPrice,
                            old_price:row.sku_price
                        }
                        return  data_row
                    })
                    this.$http(api_aliexpress_batch_price,{data}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
            },
            //开启模板 关闭模板预览
            change_dialog(val){
                if(val){
                    switch (this.flag){
                        case 2:
                            this.get_bags();
                            break;
                        case 5:
                            this.get_custom_template();
                            break;
                        case 6:
                            this.get_sever_template();
                            break;
                        case 7:
                            this.get_template();
                            break;
                        case 9:
                            this.get_groups();
                            break;
                    }
                }else {     //关闭   数据初始化
                    this.tableData=[];
                    this.account_id="";
                    this.delivery={
                        select:"",
                        text:0,
                        add:0
                    };
                    this.group_id=[];
                    this.title={
                        select:"",
                        prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                        find:{value:"",replace:""},
                        unite:""
                    };
                    this.bag={
                        unit:"",
                        select:"",
                        count:""
                    };
                    this.weight={
                        select:"",
                        textall:"",
                        textadd:"",
                        textaup:""
                    };
                    this.size={
                        length:"",
                        width:"",
                        height:""
                    };
                    this.information={
                        custom:"",
                        relation:"",
                        custom_position:"bottom",
                        relation_position:"top",
                    };
                    this.serviceTemplate="";
                    this.shippingTemplate="";
                    this. price={
                        select:"",
                        add:0,
                        up:0,
                    };
                    this.customTemplate={
                        custom:[],
                        relation:[],
                    }
                }
            }
        },
        filters: {
            positionFilter(val){
                if(val==="top"){
                    return "顶部"
                }else if(val==="bottom"){
                    return "底部"
                }else {
                    return "未定义"
                }
            }
        },
        watch: {
            value(val){
                this.show=val;
                if(!val){
                  this.$emit('keep');
                }
            },
            show(val){
                this.$emit("input",val)
            },
            'delivery.add'(val){
              this.tableData.forEach(row=>{
                if(parseInt(row.delivery_time)+this.delivery.add > 1){
                   this.minAdd = 1- parseInt(row.delivery_time);
                };
              });
            }
        },
        props: {
            value:{
            },
            flag:{
                required:true,
                type:Number
            }
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiListCheck:require("../../../../components/ui-list-check.vue").default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default
        }
    }
</script>
