<template>
    <page class="p-add-product">
        <page-dialog  title="添加商品" v-model="addVisable"    size="large" @change="change_dialog" :close-on-click-modal="false">
        <div class="tabs-content">
            <div class="tabs-content-pane card">
                <ui-tabs type="card" :active-name="action" ref="tabs" @tab-click="tab_click">
                    <ui-tab-item key="base-info" name="base-info" label="基本信息" class="roll-height">
                        <base-info :baseData="baseData[0]" :editAble="false" :unitData="unitData" :isAdd="true" ref="baseInfo"></base-info>
                    </ui-tab-item>
                    <ui-tab-item key="provider-info" name="provider-info" label="供应商信息" class="roll-height" v-if="!showInfo[1]">
                        <provider-info :supplierData="supplierData" :editAble="false" :isAdd="true" ></provider-info>
                    </ui-tab-item>
                    <ui-tab-item key="specification-info" name="specification-info" label="规格参数"  v-if="!showInfo[2]" class="roll-height">
                        <specification-info :specData="specData" @top-speckeep="top_speckeep" :lookspecData="lookspecData" :editAble="false" :isAdd="true" @table-change="table_change"></specification-info>
                    </ui-tab-item>
                    <ui-tab-item key="product-attr" name="product-attr" label="产品属性" v-if="!showInfo[3]" class="roll-height">
                        <product-attr :attrData="attrData" :editAble="false"  :isAdd="true"></product-attr>
                    </ui-tab-item>
                    <ui-tab-item key="remark-msg" name="remark-msg" label="备注信息" v-if="!showInfo[4]" class="roll-height">
                        <remark-msg :logData="logData" :goodsId="goodsId" :editAble="false" @addlog="add_log" :isAdd="true"></remark-msg>
                    </ui-tab-item>
                    <ui-tab-item key="qc-msg" name="qc-msg" label="质检信息" v-if="!showInfo[5]" class="roll-height">
                        <qc-msg :isAdd="true" :editAble="false" :qualityData="qualityData"></qc-msg>
                    </ui-tab-item>
                    <ui-tab-item key="product-desc" name="product-desc" label="产品描述" v-if="!showInfo[6]" class="roll-height">
                        <product-desc :descData="descData" :editAble="false" :isAdd="true"></product-desc>
                    </ui-tab-item>
                    <ui-tab-item key="product-img" name="product-img" label="产品图片" v-if="!showInfo[7]" class="roll-height">
                        <product-img :id="goodsId" :imgData="imgData" :editAble="false" :isAdd="true"></product-img>
                    </ui-tab-item>
                </ui-tabs>
            </div>
        </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="keep_add" type="primary">保  存</el-button>
                <el-button size="mini" @click.native="keep_next"  v-if="action!=='product-img'" type="primary" >保存并下一步</el-button>
                <el-button size="mini" @click.native="addVisable=false" >关   闭</el-button>
            </span>
        </page-dialog>

    </page>
</template>
<style lang="stylus">
.p-add-product{
    padding:0;
    padding-left: 20px;
    .el-tabs.el-tabs--card{
        width: 100%;
    }
    .el-tab-pane{
        display: block;
    }

}
</style>
<script>
    import pageDialog from "../../../components/page-dialog.vue"
    import baseInfo from './base-infoadd.vue';
    import providerInfo from './provider-info.vue';
    import specificationInfo from './specification-info.vue';
    import productAttr from './product-attr.vue';
    import remarkMsg from './remark-msg.vue';
    import qcMsg from './qc-msg.vue';
    import productDesc from './product-desc.vue';
    import productImg from './product-img.vue';
    import {publish_baseinfo,publish_specification,publish_attribute ,publish_description,publish_supplier,publish_log,publish_edit_unit,publish_edit_packing ,publish_edit_tag,publish_edit_brand,publish_edit_tort,publish_edit_lang,publish_add_baseinfo,publish_updata_specification,publish_updata_attribute,publish_updata_description,publish_updata_baseinfo,publish_edit_depot,publish_edit_plat,publish_skuinfo,publish_skuinfo_edit,publish_skuinfo_keep,publish_edit_quality,publish_updata_quality,publish_img,api_update_img,publish_edit_property,publish_add_plat,publish_updata_supplier} from  '../../../api/product-library'
    export default{
        data(){
            return{
                addVisable :false,
                action:"base-info",
                showInfo:[false,true,true,true,true,true,true,true],
                goodsId:0,
                specData:[],
                attrData:[],
                descData:[],
                imgData:[],
                qualityData:[],
                lookspecData:{},
                tempSku:[],
                tempSpecAction:[],
                supplierData:[],
                logData:[],
                menuList:[
                    {name:"base-info",id:0},
                    {name:"provider-info",id:1},
                    {name:"specification-info",id:2},
                    {name:"product-attr",id:3},
                    {name:"remark-msg",id:4},
                    {name:"qc-msg",id:5},
                    {name:"product-desc",id:6},
                    {name:"product-img",id:7},
                ],
                unitData:[
                    {unit:null},
                    {brand:null},
                    {tag:null},
                    {packing:null},
                    {tort:null},
                    {lang:null},
                    {depot:null},
                    {plat:null},
                    {property:null},
                ],
                baseData:[
                    {
                        spu:"",
                        category_id:"",
                        category:"",
                        name:"",
                        retail_price:"",
                        cost_price:"",
                        declare_name:"",
                        declare_en_name:"",
                        weight:"",
                        net_weight:"",
                        height:"",
                        depth:"",
                        width:"",
                        volume_weight:"",
                        packing_id:"",
                        unit_id:"",
                        source_url:[],
                        thumb:"",
                        alias:"",
                        hs_code:"",
                        is_packing:'',
                        tort_id:"",
                        brand_id:"",
                        tags:[],
                        developer_id:"",
                        warehouse_id:"",
                        is_multi_warehouse:"",
                        platform_sale:[],
                    }
                ]
            }
        },
        created(){
        },
        mounted(){
        },
        computed:{
        },
        methods:{
            //第一次 保存   上传基本信息  获取ID
            base_updata(data,bool){
                this.$http(publish_add_baseinfo,data).then(res=>{
                    this.$message({
                        message: "保存成功",
                        type: 'success'
                    });
                    this.goodsId=res.message;
                    this.supplier_init();
                if(bool){
                    this.action=this.menuList[1].name
                }
                this.showInfo.splice(1,1,false)
                }).catch(code=>{
                    console.log(code)
                  this.$message({type:"error",message:code.message || code});
                })
            },
            // 上传基本信息
            base_updata_again(data,bool){
                this.$http(publish_updata_baseinfo,this.goodsId,data).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                this.showInfo.splice(1,1,false)
                if(bool){
                    this.action=this.menuList[1].name
                }
                }).catch(code=>{
                    console.log(code)
                  this.$message({type:"error",message:code.message || code});
                })
            },
            //保存基本信息
            keep_base(bool){
                let temp=this.clone(this.baseData);
                temp[0].tags=this.unitData[2].tag.filter(item=>{
                    return  item.ischeck
                })
                let proper=this.unitData[8].property.filter(item=>{
                    return  item.enabled
                })
                temp[0].properties=proper.map(item=>{
                     return  {
                         value:item.value,
                         field:item.field
                     }
                })
                temp[0].platform_sale=temp[0].platform_sale.map(row=>{
                            return {
                                name:row.name,
                                value_id:row.value_id
                            }
                        })
                if(this.goodsId===0){
                    this.base_updata(temp[0],bool);
                }else {
                    this.base_updata_again(temp[0],bool)
                };
            },
            //添加状态下  供应商信息
            supplier_init(){
                this.supplierData=[];
                this.$http(publish_supplier,this.goodsId).then(res=>{
                    this.supplierData.push(res);
                    console.log("this.supplierData",this.supplierData)
                }).catch(code=>{
                    console.log(code)
                })
            },
            //保存供应商
            keep_supplier(bool){
                let data={
                    goods_id:this.goodsId,
                    purchaser_id:this.supplierData[0].purchaser_id,
                }
                let find=this.supplierData[0].supplier.find(row=>{return row.is_default===1});
                if(!!find){
                    data.supplier_id=find.supplier_id;
                }
                this.$http(publish_updata_supplier,data).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.showInfo.splice(2,1,false)
                    if(bool){
                        this.action=this.menuList[2].name
                    }
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //添加状态下  请求规格参数  上部分 checkbox
            specification_init(){
                this.specData=[];
                this.$http(publish_specification,this.goodsId).then(res=>{
                    this.specData=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //规格上部分   点击生成sku
            top_speckeep(){
                let arr=this.clone(this.specData).map((item,index)=>{
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
            //保存规格参数
            spec_updata(data){
                this.$http(publish_updata_specification,this.goodsId,data).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                this.edit_sku()
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                })
            },
            //编辑状态下  请求sku
            edit_sku(){
                this.lookspecData={};
                this.$http(publish_skuinfo_edit,this.goodsId).then(res=>{
                    this.lookspecData=res;
                    this.tempSku=this.clone(res.lists)
                }).catch(code=>{
                    console.log(code)
                })
            },
            //保存 sku
            keep_sku(bool){
                //拿到增加  删除的 sku
                let arr=[];
                for(let i=0;i<this.tempSku.length;i++){
                    if(this.tempSku[i].enabled!==this.lookspecData.lists[i].enabled&&this.tempSku[i].enabled){
                        arr.push({sub:i, action:"del"})
                    }else if(this.tempSku[i].enabled!==this.lookspecData.lists[i].enabled&&!this.tempSku[i].enabled){
                        arr.push({ sub:i, action:"add"})
                    }
                }
                let arrid=arr.map(item=>{
                    return item.sub
                });
                //拿到修改 sku
                let tss=[]
                for(let i=0;i<this.tempSpecAction.length;i++){
                    if(arrid.indexOf(this.tempSpecAction[i])===-1){
                        tss.push({
                            sub:this.tempSpecAction[i],
                            action:"modify"
                        })
                    }
                }
                let  mdfSku=arr.concat(tss)
                let mdfData=mdfSku.map(item=>{
                    let attrs=[];
                    for(let k=0;k<this.lookspecData.headers.length;k++){
                        attrs.push({
                            attribute_id:this.lookspecData.lists[item.sub][this.lookspecData.headers[k].attribute_id].attribute_id,
                            value_id:this.lookspecData.lists[item.sub][this.lookspecData.headers[k].attribute_id].id
                        })
                    }
                    return {
                        action:item.action,
                        sku:this.lookspecData.lists[item.sub].sku,
                        alias_sku:this.lookspecData.lists[item.sub].alias_sku,
                        id:this.lookspecData.lists[item.sub].id,
                        name:this.lookspecData.lists[item.sub].name,
                        status:this.lookspecData.lists[item.sub].status,
                        cost_price:this.lookspecData.lists[item.sub].cost_price,
                        retail_price:this.lookspecData.lists[item.sub].retail_price,
                        retail_price:this.lookspecData.lists[item.sub].retail_price,
                        enabled:this.lookspecData.lists[item.sub].enabled,
                        enabled:this.lookspecData.lists[item.sub].enabled,
                        attributes:attrs
                    }
                });
                this.$http(publish_skuinfo_keep,this.goodsId,{lists:mdfData}).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.showInfo.splice(3,1,false);
                    if(bool){
                        this.action=this.menuList[2].name;
                    }
                    console.log(this.action);
                }).catch(code=>{
                    console.log(code)
                })
            },
            //拿到修改的 sku
            table_change(index){
                if(this.tempSpecAction.indexOf(index)===-1){
                    this.tempSpecAction.push(index);
                };
            },
            //添加状态下  请求属性
            attribute_init(){
                this.attrData=[];
                this.$http(publish_attribute,this.goodsId).then(res=>{
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
                }).catch(code=>{
                    console.log(code)
                })
            },
            //上传产品属性
            attr_updata(data,bool){
                this.$http(publish_updata_attribute,this.goodsId,data).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.showInfo.splice(4,1,false);
                    if(bool){
                        this.action=this.menuList[3].name
                    }
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                })
            },
            //保存属性
            keep_attr(bool){
                let array=[];
                this.clone(this.attrData).forEach((item,index)=>{
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
                                        console.log("its",its);
                                        return {id:its.id,value:its.value}
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
                                let curValue = it.attribute_value.find(row=>{if(row.id===it.radio)return row.value});
                                arr.push({id:it.radio,value:curValue.value});
                                array.push({type: it.type,
                                    attribute_id: it.attribute_id,
                                    attribute_value:arr,
                                })
                            }
                        }
                    })
                })
                this.$nextTick(()=>{
                    console.log("array",array);
                    this.attr_updata({attributes:JSON.stringify(array)},bool)
                })
            },
            // 查看状态下的 日志
            log_init(){
                this.logData=[];
                this.$http(publish_log,this.goodsId).then(res=>{
                    this.logData=res;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //添加日记
            add_log(){
                this.log_init();
            },
            //编辑下的 质检
            quality_edit(){
                this.qualityData=[];
                this.$http(publish_edit_quality,this.goodsId).then(res=>{
                    this.qualityData=res;
                    this.totalData[5]=this.clone(this.qualityData);
                }).catch(code=>{
                    console.log(code)
                })
            },

            //上传质检信息
            quality_updata(data,bool){
                this.$http(publish_updata_quality,this.goodsId,data).then((res)=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                this.showInfo.splice(6,1,false)
                if(bool){
                    this.action=this.menuList[5].name
                }
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                })
            },
            //保存质检信息
            keep_quality(bool){
                let quality=[];
                for(let i=0 ;i<this.qualityData.length;i++){
                    for (let k=0;k<this.qualityData[i].items.length;k++){
                        if(this.qualityData[i].items[k].enabled){
                            quality.push(this.qualityData[i].items[k].attribute_id)
                        }
                    }
                }
                this.quality_updata({lists:quality},bool)
            },
            //添加状态下  请求产品描述
            description_init(){
                this.descData=[];
                this.$http(publish_description,this.goodsId).then(res=>{
                    this.descData=res.map(row=>{
                             row.inputValue=""
                            return row
                                 });
                }).catch(code=>{
                    console.log(code)
                })
            },
            //上传产品描述
            desc_updata(data,bool){
                this.$http(publish_updata_description,this.goodsId,data).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                this.showInfo.splice(7,1,false)
                if(bool) {
                    this.action = this.menuList[6].name
                }
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                })
            },
            //保存产品描述
            keep_desc(bool){
                let arr2=this.clone(this.descData).map(item=>{
                    return {
                        lang_id:item.lang_id,
                        description:item.description,
                        title:item.title,
                        tags:item.tags
                    }
                })
                this.desc_updata({descriptions:JSON.stringify(arr2)},bool)
            },
            //添加 请求图片
            img_init(){
                this.$http(publish_img,this.goodsId).then(res=>{
                    res.forEach(item=>{
                        if(item.images.length!==0){
                            item.images.forEach((it,index)=>{
                                it.show=false;
                                it.uid=index;
                            })
                        }
                    })
                    this.imgData=res;
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
                }).catch(code=>{
                  this.$message({type:"error",message:code.message || code});
                })
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
                            arr.images.push({
                                sku_id:it.sku_id,
                                value_id:it.value_id,
                                image:it.image,
                                sort:it.sort,
                            })
                        }
                        if(it.id){
                            arr.images.push({
                                sku_id:it.sku_id,
                                value_id:it.value_id,
                                id:it.id,
                                sort:it.sort
                            })
                        }
                    })
                })
                this.imgUpdate(arr);
            },
        //保存按键 保存
            keep_add(){
                let actionID =this.menuList.findRet(item=>{
                    if(item.name===this.action){
                        return item.id;
                    }
                });
                console.log("测试",actionID)
                switch (actionID){
                    case 0:
                        let a=this.$refs.baseInfo.submit();
                        a&&this.keep_base();
                            break;
                    case 1:
                        this.keep_supplier()
                        break;
                    case  2:
                        this.keep_sku();
                        break;
                    case 3:
                        this.keep_attr();
                        break;
                    case 5:
                            this.keep_quality();
                        break;
                    case 6:
                            this.keep_desc()
                        break;
                    case 7:
                        this.keep_img()
                        break;
                }
            },
            //保存下一步
            keep_next(){
                console.log(this.baseData);
                let act =this.menuList.findRet(item=>{
                    if(item.name===this.action){
                        return item.id;
                    }
                });
                switch (act){
                    case 0:
                        this.$refs.baseInfo.submit()&&this.keep_base(true);
                        break;
                    case 1:
                        this.keep_supplier(true)
                        break;
                    case  2:
                        this.keep_sku(true);
                        break;
                    case 3:
                        this.keep_attr(true);
                        break;
                    case 4:
                        this.showInfo.splice(5,1,false);
                        this.action=this.menuList[4].name;
                        break;
                    case 5:
                        this.keep_quality(true);
                        break;
                    case 6:
                        this.keep_desc(true)
                        break;
                    case 7:
                        this.keep_img()
                        break;
                }
            },
            //点击事件
            tab_click(val){
                this.action=val.name;
                if(val.name==="base-info"){

                }else if(val.name==="specification-info"){
                    this.specification_init();
                }else if(val.name==="product-attr"){
                    this.attribute_init()
                }else if(val.name==="product-desc"){
                    this.description_init()
                }else if(val.name==="provider-info"){

                }else  if(val.name==="remark-msg"){
                    this.log_init()
                }else  if(val.name==="qc-msg"){
                    this.quality_edit();
                }else  if(val.name==="product-img"){
                    this.img_init();
                }

            },
            //单位 请求
            unit_init(){
                this.$http(publish_edit_unit).then(res=>{
                    this.unitData[0].unit=res
                }).catch(code=>{
                    console.log(code)
                })
                this.$http(publish_edit_packing).then(res=>{
                    this.unitData[3].packing=res
                }).catch(code=>{
                    console.log(code)
                })
                this.$http(publish_edit_tag).then(res=>{
                    res.forEach(row=>{
                        row.ischeck=false;
                    })
                    this.unitData[2].tag=res
                }).catch(code=>{
                    console.log(code)
                })
                this.$http(publish_edit_brand).then(res=>{
                    this.unitData[1].brand=res
                }).catch(code=>{
                    console.log(code)
                })
                this.$http(publish_edit_tort).then(res=>{
                    this.unitData[4].tort=res
                }).catch(code=>{
                    console.log(code)
                })
//                this.$http(publish_edit_lang).then(res=>{
//                    this.unitData[5].lang=res
//                }).catch(code=>{
//                    console.log(code)
//                })
                this.$http(publish_edit_depot).then(res=>{
                    this.unitData[6].depot=res
                }).catch(code=>{
                    console.log(code)
                })
                this.$http(publish_edit_plat).then(res=>{
                    this.unitData[7].plat=res
                }).catch(code=>{
                    console.log(code)
                })
                this.$http(publish_edit_property).then(res=>{
                    this.unitData[8].property=res
                }).catch(code=>{
                    console.log(code)
                });
                this.$http(publish_add_plat).then(res=>{
                    this.baseData[0].platform_sale=res;
            }).catch(code=>{
                    console.log(code)
            });
            },
            //对象深度克隆
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            //页面关闭初始化
            change_dialog(val){
                if(val){
                    this.specData=[];
                    this.attrData=[];
                    this.descData=[];
                    this.supplierData=[];
                    this.logData=[];
                    this.qualityData=[];
                    this.action="base-info";
                    this.goodsId=0;
                    this.lookspecData={};
                    this.showInfo=[false,true,true,true,true,true,true,true];
                }else {
                    this.unitData= [
                        {unit:null},
                        {brand:null},
                        {tag:null},
                        {packing:null},
                        {tort:null},
                        {lang:null},
                        {depot:null},
                        {plat:null},
                        {property:null},
                    ];
                    this.baseData=[
                        {
                            spu:"",
                            category_id:"",
                            category:"",
                            name:"",
                            retail_price:"",
                            cost_price:"",
                            declare_name:"",
                            declare_en_name:"",
                            weight:"",
                            height:"",
                            depth:"",
                            width:"",
                            volume_weight:"",
                            packing_id:"",
                            unit_id:"",
                            source_url:[],
                            thumb:"",
                            developer_id:"",
                            alias:"",
                            hs_code:"",
                            is_packing:"",
                            tort_id:"",
                            brand_id:"",
                            tags:[],
                            warehouse_id:"",
                            is_multi_warehouse:"",
                            platform_sale:[]
                        }
                    ]
                }

            }
        },
        filters:{
        },
        watch:{
            addVisable(val){
                this.$emit("input",val)
            },
            value(val){
                this.addVisable=val;
                if(val){
                    this.unit_init()
                }
            },
            action(val){
                if(val==="base-info"){

                }else if(val==="specification-info"){
                    this.specification_init()
                }else if(val==="product-attr"){
                    this.attribute_init()
                }else if(val==="product-desc"){
                    this.description_init()
                }else if(val==="provider-info"){
                    this.supplier_init()
                }else  if(val==="remark-msg"){
                    this.log_init()
                }else if(val==="qc-msg"){
                    this.quality_edit();
                }else  if(val==="product-img"){
                    this.img_init();
                } else  if(val==="product-img"){
                    this.img_init();
                }
            },
        },
        props:{
            value:{
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
            uiTabs:require('../../../components/ui-tabs').default,
            uiTabItem:require('../../../components/ui-tab-item').default,
        }
    }
</script>
