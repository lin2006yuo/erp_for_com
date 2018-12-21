<template>
    <page-dialog :title="`${titleName} 信息`"
                 min-height="500"
                 v-model="lookVisable"
                 size="full"
                 @change="change_dialog"
                 @open="open"
                 :close-on-click-modal="false">
        <div class="tabs-content">
            <div class="tabs-content-pane card">
                <el-tabs type="card" :active-name="action" ref="tabs" @tab-click="tab_click">
                    <el-tab-pane key="base-info" name="base-info" label="基本信息" class="roll-height">
                        <base-info :base="baseData"
                                   :edit-able="show[0]"
                                   :unitData="unitData"
                                   @keep="keep_edit"
                                   @cancel="cancel_edit"
                                   @init="base_init"
                                   @edit="edit"
                                   ref="baseInfo"></base-info>
                    </el-tab-pane>
                    <el-tab-pane key="provider-info" name="provider-info" label="供应商信息"  class="roll-height">
                        <provider-info :supplierData="supplierData"
                                       :editAble="show[1]"
                                       @keep="keep_edit"
                                       @cancel="cancel_edit"
                                       @edit="edit" ></provider-info>
                    </el-tab-pane>
                    <el-tab-pane key="specification-info" name="specification-info" label="规格参数"  class="roll-height">
                        <specification-info :specData="specData"
                                            :edit-able="show[2]"
                                            :oldSpecData="tempSku"
                                            :lookspecData="lookspecData"
                                            @top-speckeep="top_speckeep"
                                            @table-change="table_change"
                                            @keep="keep_edit"
                                            @cancel="cancel_edit"
                                            @edit="edit"></specification-info>
                    </el-tab-pane>
                    <el-tab-pane key="product-attr" name="product-attr" label="产品属性" class="roll-height">
                        <product-attr :attrData="attrData"
                                      :edit-able="show[3]"
                                      @keep="keep_edit"
                                      @cancel="cancel_edit"
                                      @edit="edit"></product-attr>
                    </el-tab-pane>
                    <el-tab-pane key="remark-msg" name="remark-msg"
                                 label="备注信息" class="roll-height">
                        <remark-msg :logData="logData"
                                    :goodsId="goodsId"
                                    :editAble="show[4]"
                                    @addlog="add_log"
                                    @keep="keep_edit"
                                    @cancel="cancel_edit"
                                    @edit="edit"></remark-msg>
                    </el-tab-pane>
                    <el-tab-pane key="qc-msg" name="qc-msg"
                                 label="质检信息" class="roll-height">
                        <qc-msg :qualityData="qualityData"
                                :edit-able="show[5]"
                                @keep="keep_edit"
                                @cancel="cancel_edit"
                                @edit="edit"></qc-msg>
                    </el-tab-pane>
                    <el-tab-pane key="product-desc"
                                 name="product-desc"
                                 label="产品描述"
                                 class="roll-height">
                        <product-desc :descData="descData"
                                      :edit-able="show[6]"
                                      @keep="keep_edit"
                                      @cancel="cancel_edit"
                                      @edit="edit"></product-desc>
                    </el-tab-pane>
                    <el-tab-pane key="product-img" name="product-img" label="产品图片"  class="roll-height">
                        <picture-group :img-data="imgData"
                                       :base-url="baseUrl"
                                       :goods-id="goodsId"
                                       :edit-able="show[7]"
                                       ref="pictureGroup"
                                       :active-name="childActiveName"
                                       @cancel-edit="cancel_edit"
                                       @save="keep_edit"></picture-group>
                    </el-tab-pane>
                    <el-tab-pane key="channel-classify"
                                 name="channel-classify"
                                 label="平台分类"
                                 class="roll-height">
                        <channel-classify :id="goodsId"
                                          v-if="baseData[0]"
                                          :form="baseData[0]"
                                          :edit-able="show[8]"
                                          :unitData="unitData"
                                          @edit="edit"
                                          @keep-edit="keep_edit"
                                          @cancel-edit="cancel_edit"></channel-classify>
                    </el-tab-pane>
                    <el-tab-pane key="statistics"
                                 name="statistics"
                                 label="刊登统计"
                                 class="roll-height">
                        <statistics :statistics-data="statisticsData"></statistics>
                        <!--<channel-classify :id="goodsId"-->
                                          <!--v-if="baseData[0]"-->
                                          <!--:form="baseData[0]"-->
                                          <!--:edit-able="show[8]"-->
                                          <!--:unitData="unitData"-->
                                          <!--@edit="edit"-->
                                          <!--@keep-edit="keep_edit"-->
                                          <!--@cancel-edit="cancel_edit"></channel-classify>-->
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button  size="mini" @click="close">关  闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-look-edit{
        .el-tabs.el-tabs--card{
            width: 100%;

        }
    }
</style>
<script>
    import pageDialog from "../../../components/page-dialog.vue"
    import baseInfo from './base-info.vue';
    import providerInfo from './provider-info.vue';
    import specificationInfo from './specification-info.vue';
    import productAttr from './product-attr.vue';
    import remarkMsg from './remark-msg.vue';
    import qcMsg from './qc-msg.vue';
    import productDesc from './product-desc.vue';
    import productImg from './product-img.vue';
    import {data} from '../../virtual-order/action.js';
    import {api_publish_statistics,publish_baseinfo,publish_specification,publish_attribute ,publish_description,publish_supplier,publish_log,publish_edit_unit,publish_edit_packing ,publish_edit_tag,publish_edit_brand,publish_edit_tort,publish_edit_lang,publish_updata_baseinfo,publish_updata_specification,publish_updata_attribute,publish_updata_description,publish_skuinfo,publish_skuinfo_edit,publish_skuinfo_keep,publish_quality,publish_edit_quality,publish_updata_quality,publish_edit_depot,publish_edit_plat,publish_img,api_edit_attribute,api_update_img,publish_updata_supplier} from  '../../../api/product-library'
    export default{
        data(){
            return{
                baseUrl:"",
                testImgData:data,
                titleName:`查看`,
//                editAble:true,
                lookVisable:false,
                show:[false,false,false,false,false,false,false,false,false,false],
                action:"base-info",
                baseData:[],
                specData:[],
                lookspecData:{},
                attrData:[],
                descData:[],
                supplierData:[],
                logData:[],
                imgData:[],
                qualityData:[],
                tempSku:[],
                tempSpecAction:[],
                statisticsData:[],
                unitData:[
                    {unit:null},
                    {brand:null},
                    {tag:null},
                    {packing:null},
                    {tort:null},
                    {lang:null},
                    {depot:null},
                    {plat:null},
                ],
                totalData:[
                    [],[],[],[],[],[],[],[]
                ],
                menuList:[
                    {name:"base-info",id:0},
                    {name:"provider-info",id:1},
                    {name:"specification-info",id:2},
                    {name:"product-attr",id:3},
                    {name:"remark-msg",id:4},
                    {name:"qc-msg",id:5},
                    {name:"product-desc",id:6},
                    {name:"product-img",id:7},
                    {name:"channel-classify",id:8},
                    {name:"statistics",id:9},
                ]
            }
        },
        methods:{
            open(){//打开弹框
                this.unit_init();
                this.base_init();
                this.action = "base-info";
            },
            // tabs点击
            tab_click(val){
                this.action=val.name;
                let actionID =this.menuList.findRet(item=>{
                    if(item.name===this.action){
                        return item.id;
                    }
                });
                if(val.name==="base-info"){

                }else if(val.name==="specification-info"){
                    this.specification_init();
                    if(this.editAble){
                        this.edit_sku()
                    }else{
                        this.look_sku();
                    }
                }else if(val.name==="product-attr"){
                    if(this.editAble){
                        this.edit_attribute_init();
                    }else{
                        this.attribute_init();
                    }
                }else if(val.name==="product-desc"){
                    this.description_init()
                }else if(val.name==="provider-info"){
                    this.supplier_init()
                }else  if(val.name==="remark-msg"){
                    this.log_init()
                }else  if(val.name==="qc-msg"){
                    if(this.editAble){
                        this.quality_edit();
                    }else{
                        this.quality_init();
                    }
                } else if(val.name==="product-img"){
                    this.$refs.pictureGroup.channelValue = this.get_channel_value(this.childActiveName);
                    this.$refs.pictureGroup.get_cur_path();
                    this.img_init();
                }else if(val.name==="statistics"){
                    console.log('请求了吗');
                    this.get_statistics();
                }
            },
            //编辑状态下的 取消
            cancel_edit(){
                let ind_=this.menuList.find(item=>{
                    return item.name===this.action
                }).id;
                /*
                * {name:"base-info",id:0},
                    {name:"provider-info",id:1},
                    {name:"specification-info",id:2},
                    {name:"product-attr",id:3},
                    {name:"remark-msg",id:4},
                    {name:"qc-msg",id:5},
                    {name:"product-desc",id:6},
                    {name:"product-img",id:7},
                    {name:"channel-classify",id:8},
                    {name:"statistics",id:9},
                * */
                switch (ind_) {
                    case 0:
                        this.base_init();
                        break;
                    case 1://
                        this.supplier_init();
                        break;
                    case 2:
                        this.specification_init();
                        this.edit_sku();
                        break;
                    case 3 :
                        this.edit_attribute_init();
                        break;
                    case 4 :
                        this.log_init();
                        break;
                    case 5 :
                        this.quality_edit();
                        break;
                    case 6 :
                        this.description_init();
                        break;
                    case 7 :
                        this.$refs.pictureGroup.channelValue = this.get_channel_value(this.childActiveName);
                        this.$refs.pictureGroup.get_cur_path();
                        this.img_init();
                        break;
                    case 8 :
                        this.base_init();
                        break;
                    case 9 :
                        this.get_statistics();
                        break;
                }

            },
            //保存完 后的编辑
            edit(){
                let actionID =this.menuList.findRet(item=>{
                    if(item.name===this.action){
                        return item.id;
                    }
                });
                this.show.splice(actionID,1,true);
            },
            //各平台刊登数据统计
            get_statistics(){
//                this.statisticsData = {};
                this.$http(api_publish_statistics,this.goodsId).then(res => {
                    if(res.length<=0)return this.$message({type:'warning',message:'暂无数据'});
//                     res.forEach(row=>{
//                         this.statisticsData[row.title] = row.publish_count;
//                    })

                    this.statisticsData = res.map(row=>{
                        return {
                            title:row.title,
                            publish_count:row.publish_count
                        }
                    });
                     console.log(this.statisticsData,'this.statisticsData');
                }).catch(code => {
                    console.log(code,'code');
                })
            },
            //1.1查看状态下  初始请求基本列表数据
            base_init(){
                this.baseData=[];
                this.$http(publish_baseinfo,this.goodsId).then(res=>{
                    if(res.developer_id===0)res.developer_id = "";
                    if(res.packing_id===0)res.packing_id = "";
                    if(res.unit_id===0)res.unit_id = "";
                    if(res.tort_id===0)res.tort_id = "";
                    if(res.warehouse_id===0)res.warehouse_id = "";
                    res.tags=res.tags.map(item=>{
                        return item.name;
                    });
                    this.baseData.push(res);
                    this.totalData[0]=clone(this.baseData)
                }).catch(code=>{
                    console.log(code);
                })
            },
            //1.2上传 基本信息
            base_updata(data){
                this.$http(publish_updata_baseinfo,this.goodsId,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.totalData[0]=clone(this.baseData);
                    this.$emit("change-data",data)
                }).catch(code=>{
                    this.show.splice(0,1,false);
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('baseInfo',false);
                    },200);
                });
            },
            //1.3 保存基本信息
            keep_base(){
                let temp=clone(this.baseData);
                temp[0].tags=clone(this.unitData[2].tag).filter(item=>{
                    if(this.baseData[0].tags.indexOf(item.name)!==-1){
                        return true
                    }
                });
                let proper=this.baseData[0].properties.filter(row=>{
                            return  row.enabled
                });
                temp[0].properties=proper.map(item=>{
                    return  {
                        value:item.value,
                        field:item.field
                    }
                });
                this.base_updata(temp[0]);
            },
            //2.1查看状态下  供应商信息
            supplier_init(){
                this.supplierData=[];
                this.$http(publish_supplier,this.goodsId).then(res=>{
                    if(res.purchaser_id===0)res.purchaser_id = "";
                    this.supplierData.push(res);
                    this.totalData[1]=clone(this.supplierData);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //保存供应商
            keep_supplier(){
                let data={
                    goods_id:this.goodsId,
                    purchaser_id:this.supplierData[0].purchaser_id,
                }
                let find=this.supplierData[0].supplier.find(row=>{return row.is_default===1})
                if(!!find){
                    data.supplier_id=find.supplier_id;
                    this.$reqKey('providerInfo',false);
                }
                this.$http(publish_updata_supplier,data).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.totalData[0]=clone(this.baseData);
                    this.show.splice(1,1,false);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('providerInfo',false);
                    })
                });
            },
            //编辑状态下  请求规格参数
            async specification_init(){
                this.specData=[];
                await this.$http(publish_specification,this.goodsId).then(res=>{
                    res.forEach((row)=>{
                        this.$set(row,'addValue',"");
                        this.$set(row,'selectValue',"");
                        row.attribute_value.forEach((re)=>{
                            this.$set(re,'showUserDefined',false);
                        })
                    });
                    this.specData=res;
                    this.totalData[2]=clone(this.specData);
                }).catch(code=>{
                    console.log(code)
                });
            },
            //规格参数中  生成sku部分
            top_speckeep(){
                let arr=clone(this.specData).map((item,index)=>{
                    if(item.type===2){
                        return  {
                            type:2,
                            attribute_id:item.attribute_id,
                            attribute_value:item.attribute_value
                        }
                    }else {
                        item.attribute_value=item.attribute_value.filter((it,i)=>{
                            return  it.selected
                        })
                        if(item.attribute_value.length!==0){
                            item.attribute_value=item.attribute_value.map((it,i)=>{
                                return  {id:it.id,value:it.value};
                            })
                            return {
                                type:item.type,
                                attribute_id:item.attribute_id,
                                attribute_value:item.attribute_value
                            }
                        }
                        else {
                            return {
                                type:item.type,
                                attribute_id:item.attribute_id,
                                attribute_value:[]
                            }
                        }
                    }
                })
                this.spec_updata({attributes:JSON.stringify(arr)})
            },
            //保存规格参数  上部分
            spec_updata(data){
                this.$http(publish_updata_specification,this.goodsId,data).then(res=>{
                    this.$message({type:"success",message:res.message || res});
                    this.totalData[2]=clone(this.specData);
                    this.edit_sku()
                }).catch(code=>{
                    this.specData=clone(this.totalData[2]);
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //  sku
            look_sku(){
                //查看状态下 请求sku
                this.lookspecData={};
                this.$http(publish_skuinfo,this.goodsId).then(res=>{
                    this.lookspecData = this.trans_sku_format(res);
                    this.tempSku=clone(res.lists);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //编辑状态下  请求sku
            edit_sku(){
                this.lookspecData={};
                this.$http(publish_skuinfo_edit,this.goodsId).then(res=>{
                    this.lookspecData = this.trans_sku_format(res);
                    this.tempSku=clone(res.lists)
                }).catch(code=>{
                    console.log(code)
                })
            },
            /*转换 查看&编辑下的sku数据格式
            * */
            trans_sku_format(res){
                res.lists.forEach(it=>{
                    let checkbox = it.auto_update_time?false:true;
                    this.$set(it,'checkbox',checkbox);
                    if(it.attributes===undefined)this.$set(it,'attributes',[]);
                    let list  = [];
                    res.headers.forEach(row=>{
                        let optionItem = this.specData.find(its=>parseInt(row.attribute_id)===parseInt(its.attribute_id));
                        if(!!optionItem){
                            let options = optionItem.attribute_value.filter(its=>its.selected);
                            let findChild = it.attributes.find(its=>parseInt(its.attribute_id)===parseInt(row.attribute_id))
                            if(findChild){
                                this.$set(findChild,'options',options)
                            }

                        }
                    });
                });
                return res;
            },
            // sku修改
            table_change(index){
                if(this.tempSpecAction.indexOf(index)===-1){
                    this.tempSpecAction.push(index);
                };
            },
            //保存 sku
            keep_sku(){
                let isTrue = [];
                let enabledData = clone(this.lookspecData.lists.filter(row=>row.enabled));
                if(enabledData.length<=0){
                    this.show.splice(2,1,false);
                    this.$reqKey('specification',false);
                    return this.$message({type:"success",message:"暂无提交项！"})
                }
                let mdfData = enabledData.map(row=>{
                    row.attributes = row.attributes.filter(res=>{
                        return this.lookspecData.headers.find(item=>item.attribute_id===res.attribute_id);
                    });
                    row.attributes = row.attributes.map(res=>{
                        let find = this.specData.find(it=>it.attribute_id===res.attribute_id);
                        this.$set(res,'value_id',0);
                        if(!!find){
                            let findChild = find.attribute_value.find(it=>it.value===res.attribute_value);
                            if(!!findChild) res.value_id = findChild.id;
                        }
                        return {
                            attribute_id:res.attribute_id,
                            value_id:res.value_id,
                            value:res.attribute_value
                        }
                    });
                    console.log(row,'row');
                    let params = {
                        action:'modify',
                        sku:row.sku,
                        alias_sku:row.alias_sku,
                        id:row.id,
                        name:row.name,
                        cost_price:row.cost_price,
                        retail_price:row.retail_price,
                        weight:row.weight,
                        width:row.width,
                        length:row.length,
                        height:row.height,
                        enabled:row.enabled,
                        attributes:row.attributes,
                    };
                    if(row.checkbox){
                        this.$set(params,'is_auto_update_weight',1);
                    }else{
                        this.$set(params,'is_auto_update_weight',0);
                    }
                    return params
                });
                this.$http(publish_skuinfo_keep,this.goodsId,{lists:mdfData}).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.show.splice(2,1,false);
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('specification',false);
                    },200);
                })
            },
            //查看状态下  请求属性
            attribute_init(){
                this.attrData=[];
                this.$http(publish_attribute,this.goodsId).then(res=>{
                    this.attrData=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //编辑状态下的属性
            edit_attribute_init(){
                this.attrData=[];
                this.$http(api_edit_attribute,this.goodsId).then(res=>{
                    res.forEach(row=>{
                        row.attributes.forEach(item=>{
                                   if(item.type===0){
                            let flag=false;
                                item.radio="";
                            item.attribute_value.forEach(it=>{
                                    if(it.selected){
                                        this.$set(item,"radio",it.id)
                                    }
                            })

                        }
                     })
                })
                    this.attrData=res;
                    this.totalData[3]=clone(this.attrData);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //上传产品属性
            attr_updata(data){
                this.$http(publish_updata_attribute,this.goodsId,data).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.totalData[3]=clone(this.attrData);
                    this.show.splice(3,1,false);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                      this.$reqKey('productAttr',false)
                    })
                })
            },
            //保存产品属性
            keep_attr(){
                let array=[];
                clone(this.attrData).forEach((item,index)=>{
                    item.attributes.forEach(it=>{
                        if(it.type===2){
                            if(it.enabled){
                                array.push({
                                    type:2,
                                    attribute_id:it.attribute_id,
                                    attribute_value:it.attribute_value
                                })
                            }
                        }else if(it.type===1) {
                            if (it.enabled) {
                                it.attribute_value = it.attribute_value.filter(its=> {
                                    return its.selected
                                });
                                if (it.attribute_value.length !== 0) {
                                    it.attribute_value = it.attribute_value.map((its, i)=> {
                                        return its.id
                                    })
                                    array.push({
                                        type: it.type,
                                        attribute_id: it.attribute_id,
                                        attribute_value: it.attribute_value
                                    })
                                } else {
                                    array.push({
                                        type: it.type,
                                        attribute_id: it.attribute_id,
                                        attribute_value: []
                                    })
                                }
                            }
                        }else if(it.type===0){
                            if (it.enabled) {
                            let arr=[];
                                arr.push(it.radio);
                                array.push({type: it.type,
                                    attribute_id: it.attribute_id,
                                    attribute_value:arr,
                                })

                            }
                        }
                    })
                })
                this.attr_updata({attributes:JSON.stringify(array)})
            },
            //查看状态下 日记
            log_init(){
                this.logData=[];
                this.$http(publish_log,this.goodsId).then(res=>{
                    res.forEach(row=>{
                        row.remark = row.remark.split(';');
                    })
                    this.logData=res;
                    this.totalData[4]=clone(this.logData);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //添加日记
            add_log(){
                this.log_init()
            },
            //查看状态下  请求产品描述
            description_init(){
                this.descData=[];
                this.$http(publish_description,this.goodsId).then(res=>{
                    this.descData=res.map(row=>{
                        row.newTags="";
                        return row
                    });
                    this.totalData[6]=clone(this.descData);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //上传产品描述
            desc_updata(data){
                this.$http(publish_updata_description,this.goodsId,data).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.totalData[6]=clone(this.descData);
                    this.show.splice(6,1,false);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('productDesc',false);
                    },200)
                });
            },
            //保存 产品描述
            keep_desc(){
                let desc =[];
                this.descData.map(row=>{
                    desc.push({
                        lang_id:row.lang_id,
                        description:row.description,
                        title:row.title,
                        tags:row.tags,
                        selling_point_description:row.selling_point_description
                    })
                });
                this.desc_updata({descriptions:desc})
            },
            //查看下的  质检
            quality_init(){
                this.qualityData=[];
                this.$http(publish_quality,this.goodsId).then(res=>{
                    res.forEach(row=>{
                        row.remark = row.remark.split(';');
                    });
                    this.qualityData=res;
                    console.log(this.qualityData,'this.qualityData');
                }).catch(code=>{
                    console.log(code)
                })
            },
            //编辑下的 质检
            quality_edit(){
                this.qualityData=[];
                this.$http(publish_edit_quality,this.goodsId).then(res=>{
                    res.forEach(row=>{
                        row.remark = row.remark.split(';');
                    });
                    this.qualityData=res;
                    console.log(this.qualityData,'this.qualityData');
                    this.totalData[5]=clone(this.qualityData);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //上传质检信息
            quality_updata(data){
                this.$http(publish_updata_quality,this.goodsId,data).then((res)=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.totalData[5]=clone(this.qualityData);
                    this.show.splice(5,1,false);
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('qcMsg',false);
                    },200);
                });
            },
            //保存质检信息
            keep_quality(){
                let quality=[];
                for(let i=0 ;i<this.qualityData.length;i++){
                    for (let k=0;k<this.qualityData[i].items.length;k++){
                        if(this.qualityData[i].items[k].enabled){
                            quality.push(this.qualityData[i].items[k].attribute_id)
                        }
                    }
                }
                this.quality_updata({lists:quality})
            },
            //图片
            img_init(){
                this.imgData=[];
                this.$http(publish_img,this.goodsId).then(res=>{
                    this.baseUrl  = res[0].baseUrl;
                    this.imgData=res;
                    this.$nextTick(()=>{
                        this.$refs.pictureGroup.init_data();
                    });
                    this.totalData[7]=clone(this.imgData);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //上传图片
            imgUpdate(data){
                this.$http(api_update_img,data).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.totalData[7]=clone(this.imgData);
                    this.show.splice(7,1,false);
                    let param = {
                    	id:data.id,
                        thumb:res.thumb
                    };
                    this.$emit("change-data",param)
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                });
            },
            //保存图片参数
            keep_img(){
                let arr={
                    id:this.goodsId,
                    images:[]
                }
                this.imgData.forEach(item=>{
                    item.images.forEach((it,index)=>{
                        it.sort=index;
                        if(it.image){
                                let parm1={
                                    name:it.name,
                                    sku_id:it.sku_id,
                                    value_id:it.value_id,
                                    image:it.image,
                                    sort:it.sort,
                                }
                                if(index===0){
                                    parm1.is_default=1
                                }else {
                                    parm1.is_default=0
                                }
                            arr.images.push(parm1)
                        }
                        if(it.id){
                                    let parms2={
                                        sku_id:it.sku_id,
                                        value_id:it.value_id,
                                        id:it.id,
                                        sort:it.sort
                                    }
                            if(index===0){
                                parms2.is_default=1
                            }else {
                                parms2.is_default=0
                            }
                            arr.images.push(parms2)
                        }
                    })
                })
                this.imgUpdate(arr);
            },
            //编辑状态下的   基本信息中的 单位
            unit_init(){
                this.$http(publish_edit_unit).then(res=>{
                    this.unitData[0].unit=res
                }).catch(code=>{
                    console.log(code)
                });
                this.$http(publish_edit_packing).then(res=>{
                    this.unitData[3].packing=res
                }).catch(code=>{
                    console.log(code)
                });
                this.$http(publish_edit_tag).then(res=>{
                    this.unitData[2].tag=res
                }).catch(code=>{
                    console.log(code)
                });
                this.$http(publish_edit_brand).then(res=>{
                    this.unitData[1].brand=res
                }).catch(code=>{
                    console.log(code)
                });
                this.$http(publish_edit_tort).then(res=>{
                    this.unitData[4].tort=res
                }).catch(code=>{
                    console.log(code)
                });
                this.$http(publish_edit_depot).then(res=>{
                    this.unitData[6].depot=res
                }).catch(code=>{
                    console.log(code)
                });
                this.$http(publish_edit_plat).then(res=>{
                    this.unitData[7].plat=res;
                }).catch(code=>{
                    console.log(code)
                });
            },
            //还原数据
            aronud(new_,old_){
                for(let i=0;i<new_.length;i++){
                    for(let k in new_[i]){
                        old_[i][k]=new_[i][k];
                    }
                }
            },
            //编辑状态时的  保存
            keep_edit(list){
                let actionID =this.menuList.findRet(item=>{
                    if(item.name===this.action){
                        return item.id;
                    }
                });
                switch (actionID) {
                    case 0:
                        this.keep_base();
                        this.show.splice(0,1,false);
                        break;
                    case 1:
                        this.keep_supplier();
                        break;
                    case 2:
                        this.keep_sku();
                        break;
                    case 3:
                        this.keep_attr();
                        break;
                    case 4:
                        this.show.splice(4,1,false);
                        break;
                    case 5 :
                        this.keep_quality();
                        break;
                    case 6:
                        this.keep_desc();
                        break;
                    case 7:
                        let arr={
                            id:this.goodsId,
                            images:list
                        };
                        this.imgUpdate(arr);
                        break;
                    case 8:
                        this.keep_base();
                        this.show.splice(8,1,false);
                        break;
                }
            },
            get_channel_value(val){
                switch(val){
                    case '自定义图片':
                        return '';
                        break;
                    case 'ebay平台':
                        return 'eBay';
                        break;
                    case '亚马逊平台':
                        return 'Amazon';
                        break;
                    case 'wish平台':
                        return 'Wish';
                        break;
                    case '速卖通平台':
                        return 'AliExpress';
                        break;
                }
            },
            //弹出框开启关闭   初始化数据
            change_dialog(val){
                this.show = this.cur_show();
            },
            //详情 关闭 按钮
            close(){
                this.show = this.cur_show();
                this.lookVisable = false;
            },
            cur_show(){
                return this.editAble?[true,true,true,true,true,true,true,true,true,true]:[false,false,false,false,false,false,false,false,false,false];
            },
        },
        computed:{

        },
        watch:{
            lookVisable(val){
                this.$emit('input',val);
            },
            value(val){
                this.lookVisable = val;
            },
            action(val){
                val==="specification-info"&&this.editAble&&this.look_sku();
                val==="specification-info"&&!this.editAble&&this.edit_sku();
            }
        },
        props:{
            value: {},
            editAble:{
                required:true,
                type:Boolean
            },
            goodsId:{
                required:true,
                type:Number
            },
            spu:{},
            childActiveName:{

            },
        },
        components:{
            pageDialog,
            baseInfo,
            providerInfo,
            specificationInfo,
            productAttr,
            remarkMsg,
            qcMsg,
            productDesc,
            productImg,
            channelClassify:require('./channel-classify.vue').default,
            pictureGroup:require('../../../components/picture-group.vue').default,
            statistics:require('./statistics.vue').default,
        }
    }
</script>
