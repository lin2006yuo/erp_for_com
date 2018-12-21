<template>
    <page-dialog class="p-new-detail"
                 :title="spuTitle"
                 v-model="dialogVisible"
                 :size="dialogSize"
                 @close="close"
                 @open="open"
                 :close-on-click-modal="false">
        <el-card class="tabs-content-card">
            <div class="content-header">
                <label class="ml-xs">开发类型：<span>竞争对手在卖商品</span></label>
                <div class="fr">
                    <!--每个页面都有的备注-->
                    <div class="inline">
                        <permission
                                tag="ElButton"
                                :route="apis.url_product_add_log"
                                class="inline ml-xs"
                                type="primary"
                                size="mini"
                                @click.native="remarks">备注</permission>
                        <div class="remarks-box" v-if="showRemark">
                            <el-form>
                                <el-form-item label="备注信息">
                                    <el-input type="textarea" v-model="note"></el-input>
                                </el-form-item>
                                <div class="fr" style="padding-bottom: 5px;">
                                    <button class="small-button submit" type="button" @click="sub_remark(note)">提交</button>
                                    <button class="small-button cancel" type="button" @click="can_remark">取消</button>
                                </div>
                            </el-form>
                        </div>
                    </div>
                    <!--否定状态下出现的备注-->
                    <div class="inline" v-if="qcFail&&showRemarks">
                        <div class="remarks-box">
                            <el-form>
                                <el-form-item label="备注信息">
                                    <el-input type="textarea" v-model="notes"></el-input>
                                </el-form-item>
                                <div class="fr">
                                    <button class="small-button submit" type="button" @click="sub_remarks(notes)">{{selectHandle.label}}</button>
                                    <button class="small-button cancel" type="button" @click="can_remarks">取消</button>
                                </div>
                            </el-form>
                        </div>
                    </div>
                    <permission
                            tag="trendsSelect"
                            :route="apis.url_process_handle"
                            v-if="editAble&&processStatus.length>0"
                            class="inline"
                            @trigger="next_handle"
                            :selects="processStatus"
                            type="primary"></permission>
                </div>
            </div>
            <div style="text-align:center">
                <ui-svg width="100%" height="150px" :nodes="processNode"></ui-svg>
            </div>
        </el-card>
        <div class="tabs-content-pane">
            <el-tabs type="card" :active-name="action" class="tabs-width" @tab-click="tab_click">
                <el-tab-pane class="roll-height" key="base-info" name="base-info" label="基本信息">
                    <base-info
                            label="产品信息"
                            :base-form="form.baseInfo"
                            :unit-data="unitData"
                            :base-edit="show[0]"
                            @save="save"
                            @cancel="cancel"
                            @edit="edit"
                    ></base-info>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key="channel-category" name="channel-category" label="平台分类">
                    <!--新增模块show为8-->
                    <channel-category
                            :form="form.baseInfo"
                            :platformList="unitData.platform"
                            :base-edit="show[8]"
                            :id="id"
                            @save="save"
                            @cancel="cancel"
                            @edit="edit"
                    ></channel-category>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key="provider-info" name="provider-info" label="供应商信息">
                    <provider-info
                            label="供应商信息"
                            :supplier-form="form.supplier"
                            :supplier-edit="show[1]"
                            @save="save"
                            @cancel="cancel"
                            @edit="edit"
                    ></provider-info>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key="specification-info" name="specification-info" label="规格参数">
                    <!--<specification-info-->
                            <!--:spec-data="form.specData"-->
                            <!--:lookspec-data="form.specSku"-->
                            <!--@sku-change="sku_change"-->
                            <!--:spec-edit="show[2]"-->
                            <!--@edit="edit"-->
                            <!--@save="save"-->
                            <!--@cancel="cancel"-->
                    <!--&gt;</specification-info>-->
                    <specification-info :specData="form.specData"
                                        :edit-able="show[2]"
                                        :lookspecData="form.specSku"
                                        @keep="save"
                                        @cancel="cancel"
                                        @edit="edit"></specification-info>

                </el-tab-pane>
                <el-tab-pane class="roll-height" key="product-attr" name="product-attr" label="产品属性">
                    <product-attr
                            title="产品参数"
                            :attribute-form="form.attribute"
                            :attr-edit="show[3]"
                            @save="save"
                            @edit="edit"
                            @cancel="cancel"
                    ></product-attr>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key="remark-msg" name="remark-msg" label="备注信息">
                    <remark-msg
                            label="操作日志"
                            label2="添加备注信息"
                            :log-form="form.logForm"
                            @add-log="add_log"
                    ></remark-msg>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key="qc-msg" name="qc-msg" label="质检信息" v-if="showQc">
                    <qc-msg
                            :qc-form="form.qcForm"
                            :qc-edit="show[4]"
                            :show-qc-btn="showQcBtn"
                            @edit="edit"
                            @save="save"
                            @cancel="cancel"
                            @success-qc="success_qc"
                            @fail-qc="fail_qc"
                    ></qc-msg>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key="product-desc" name="product-desc" label="产品描述" v-if="showDesc">
                    <product-desc
                            :language-list="unitData.lang"
                            :desc-form="form.descForm"
                            :desc-edit="show[5]"
                            @lang-change="lang_change"
                            @save="save"
                            @edit="edit"
                            @cancel="cancel"
                    ></product-desc>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key="product-img" name="product-img" label="产品图片">
                    <picture-group :img-data="imgData"
                                   :base-url="baseUrl"
                                   :goods-id="id"
                                   :edit-able="show[6]"
                                   ref="pictureGroup"
                                   :active-name="childActiveName"
                                   @cancel-edit="edit"
                                   @save="save"></picture-group>
                </el-tab-pane>
                <el-tab-pane class="roll-height" key='mdf-pic' name="mdf-pic" label="修图要求">
                    <img-requirement :img-requirement="imgRequirement"
                                     :isDisposeEdit="show[7]"
                                     @save="save"
                                     @edit="edit"
                                     @cancel="cancel"
                                     :show-bth="true"></img-requirement>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click.native="close">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .tabs-content-pane{
        margin-top:10px;
    }
    .remarks-box{
        width:190px;
        position:absolute;
        top:77px;
        right:14px;
        border:1px solid #ddd;
        border-radius: 5px;
        background: #fff;
        padding:0 5px;
        z-index:999;
    }
    .color-box{
        width:24px;
        height:24px;
        display:inline-block;
        border:1px solid #ddd;
        vertical-align: middle;
    }
    .box-label {
        box-sizing: border-box;
        width: 100%;
        color: #5e6d82;
        font-size: 1.25rem;
        padding: 0 21px 10px;
        display: inline-block;
        border-bottom: 2px solid #dee5ee;
        margin-bottom: 20px;
    }
    .input-box{
        label{
            color:#1f2d3d;
        }
        .min-width{
            width:50px
        }
    }
    .tabs-width{
        width:100%;
    }
    .tabs-detail{
        width:100%;
            margin:46px 10px 0px 20px;
            .tabs-content-card{
                box-sizing:border-box;
                /*height:100px;*/
                margin-bottom:10px;
                .content-header{
                    font-size:1.2rem;
                    width:100%;
                }
            }
    }
</style>
<script>
    import baseInfo from './base-info.vue';
    import providerInfo from './provider-info.vue';
    import specificationInfo from '../../product/manager/specification-info.vue';
    import productAttr from './product-attr.vue';
    import remarkMsg from './remark-msg.vue';
    import qcMsg from './qc-msg.vue';
    import productDesc from './product-desc.vue';
    import productImg from './product-img.vue';
    import {publish_img,api_update_img,process_handle,api_up_img_requirement,
        publish_updata_supplier,api_update_base,api_specification_info,
        api_product_attr,api_platform,api_warehouse_type,api_packing,
        api_unit,api_brand,api_tort,api_tag,api_lang,product_list,product_base,
        product_supplier,product_specification,product_skuinfo,product_attribute,
        product_log,product_add_log,producr_description,api_update_sku,qc_msg,
        update_qc_msg,api_update_desc,api_process_node,api_process_id,api_get_mdf_img,api_img_requirement} from '../../../api/product';
    import {url_process_handle,url_product_add_log} from '../../../api/product';
    export default{
        permission:{
            url_process_handle,
            url_product_add_log
        },
        page:{},
        refresh(){
          this.init();
        },
        data(){
            return{
                note:"",
                notes:"",
                showRemark:false,
                showRemarks:false,
                qcFail:false,
                dialogVisible:false,
                showQcBtn:false,
                dialogSize:'large',
                baseUrl:"",
                colors:[],
                processStatus:[],
                selectHandle:{},
                //修图要求
                imgRequirement:{},
                form:{
                    baseInfo:{},
                    supplier:{},
                    specData:[],
                    specSku:{
                        lists:[],
                        headers:[]
                    },
                    attribute:[],
                    logForm:[],
                    qcForm:[],
                    descForm:[],
                },
                action:"base-info",
                unitData:{
                    packing:[],
                    unit:[],
                    brand:[],
                    tort:[],
                    tag:[],
                    lang:[],
                    warehouse:[],
                    platform:[],
                },
                menuList:[
                    {name:"base-info",id:0},
                    {name:"provider-info",id:1},
                    {name:"specification-info",id:2},
                    {name:"product-attr",id:3},
                    {name:"remark-msg",id:4},
                    {name:"qc-msg",id:5},
                    {name:"product-desc",id:6},
                    {name:"product-img",id:7},
                    {name:"mdf-pic",id:8},
                    {name:"channel-category",id:9},
                ],
                tempSpecAction:[],
                tempSku:[],
                show:[false,false,false,false,false,false,false,false,false],
                processNode:[],
                imgData:[],
            }
        },
        mounted(){
            this.dialogVisible=this.value;
        },
        watch:{
            dialogVisible(val){
                this.$emit("input",val);
                if(!val){
                    this.$emit("close");
                }
            },
            value(val){
                this.dialogVisible=val;
                if(val){
                    this.process_id(this.processId);
                    this.process_node(this.id);
                    this.selectHandle = {};
                    this.note = "";
                    this.notes = "";
                }
            },
            editAble(val){
                for(let i = 0;i<=8;i++){
                    this.show.splice(i,1,val);
                }
            },
            selectHandle(val){
                let code = val.value;
                this.qcFail = code==="no_photo"||code==="cancel"||code==="qc_fail"||code==="qc_confirm_fail"||code==="photo_audit_fail"||code==="photoshop_audit_fail" ? true:false;
            },
            processStatus(val){
                val.map(row=>{
                    this.showQcBtn = row.code==="qc_fail" ? true:false;
                });
            },
            processId(cur){
                if(cur){
                    if(cur===176||cur===177||cur===432||cur==433){
                        this.qc_msg(this.id);
                        this.action = 'qc-msg';
                    }else if(cur===20400||cur===53168||cur===1968){
                        this.product_desc(this.id)
                        this.action = 'product-desc';
                    }else if(cur===122804||cur===24500||cur===32688){
                        this.img_init(this.id);
                        this.action = 'product-img';
                    }else{
                        this.base_info(this.id);
                        this.action = 'base-info';
                    }
                }
            },
        },
        created(){
            this.wordbook_init();
        },
        methods:{
            success_qc(val){
                let params = {
                    code: "qc_success",
                    remark: val
                };
                this.api_process_handle(this.id,params);
            },
            fail_qc(val){
                let params = {
                    code: "qc_fail",
                    remark: val
                };
                this.api_process_handle(this.id,params);
            },
//          -------------------------------------------- 一直存在的备注按钮
            remarks(){
                this.showRemark = !this.showRemark;
            },
            sub_remark(val){
                if(!val) return this.$message({message:"请添加备注后再点击提交", type:'warning'});
                      this.$message({
                        type: 'success',
                        message: "保存成功"
                      })
                this.update_product_log(this.id,{remark:val});
                this.showRemark = false;
            },
            can_remark(){
                this.note = "";
                this.showRemark = false;
            },
//          -------------------------------------------- 否定操作的备注框
            sub_remarks(val){
                if(!val)return this.$message({message:"请完善备注信息！", type:'warning'});
                let params = {
                    code: this.selectHandle.value,
                    remark: this.notes,
                }
                this.api_process_handle(this.id,params);
            },
            can_remarks(){
                this.notes = "";
                this.showRemarks = false;
            },
            //查看状态下   图片
            img_init(id){
                this.imgData = [];
                this.$http(publish_img,id).then(res=>{
                    this.baseUrl  = res[0].baseUrl;
                    this.imgData=res;
                    this.$nextTick(()=>{
                        this.$refs.pictureGroup.init_data();
                    });
                }).catch(code=>{
                    console.log(code)
                })
            },
            //查看编辑下的修图
            init_mdf_pic(id){
                this.get_mdf_img_data();
                this.$http(api_get_mdf_img,id).then(res=>{
                    if(res.ps_requirement&&res.ps_requirement.main_options){
                        Object.keys(res.ps_requirement.main_options).forEach(row=>{
                            let cur = res.ps_requirement.main_options[row].options.filter(res=>!!res.checked).map(res=>res.value);
                            this.imgRequirement[row].requireList = [...cur];
                        });
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            //修图要求
            async get_mdf_img_data(){
                await this.$http(api_img_requirement).then(res=>{
                    this.imgRequirement = res;
                    Object.keys(res).forEach(row=>{
                        this.$set(this.imgRequirement[row],'requireList',[]);
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            //上传图片
            imgUpdate(data){
                this.$http(api_update_img,data).then(res=>{
                    this.$message(res.message);
                    this.show.splice(6,1,false);
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                    this.show.splice(6,1,true);
                })
            },
            img_requirement(){//整理勾选修图数据
                let selectList = {};
                Object.keys(this.imgRequirement).forEach(res => {
                    selectList[res] = {name: this.imgRequirement[res].name, options: []};
                    this.imgRequirement[res].requireList.forEach(row => {
                        let index = this.imgRequirement[res].options.findIndex(list => {
                            return list.value === row;
                        });
                        this.imgRequirement[res].options[index].checked = true;
                        selectList[res].options.push(this.imgRequirement[res].options[index])
                    })
                });
                return {img_requirement: selectList};
            },
            //保存修图要求
            submit_mdf_requirement(val){
                let data = this.img_requirement();
                this.$http(api_up_img_requirement,this.id,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show.splice(7,1,false);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            //保存图片参数
            keep_img(){
                let arr={
                    id:this.id,
                    images:[]
                };
//                this.imgData.forEach(item=>{
//                    item.images.forEach((it,index)=>{
//                        it.sort=index;
//                        if(it.image){
//                            let parm1={
//                                name:it.name,
//                                attribute_id:it.attribute_id,
//                                value_id:it.value_id,
//                                image:it.image,
//                                sort:it.sort,
//                            }
//                            if(index===0){
//                                parm1.is_default=1
//                            }else {
//                                parm1.is_default=0
//                            }
//                            arr.images.push(parm1)
//                        }
//                        if(it.id){
//                            let parms2={
//                                attribute_id:it.attribute_id,
//                                value_id:it.value_id,
//                                id:it.id,
//                                sort:it.sort
//                            }
//                            if(index===0){
//                                parms2.is_default=1
//                            }else {
//                                parms2.is_default=0
//                            }
//                            arr.images.push(parms2)
//                        }
//                    })
//                })
            },
//          --------------------------------------------  弹框关闭
            change_dialog(){
                this.show = this.cur_show();
            },
            tab_click(tab){
                this.action = tab.name;
                if(tab.name==="base-info"){
                    this.base_info(this.id);
                }else if(tab.name==="provider-info"){
                    this.provider_info(this.id);
                }else if(tab.name==="specification-info"){
                    this.specification_info(this.id);
                    this.product_sku(this.id);
                }else if(tab.name==="product-attr"){
                    this.product_attr(this.id);
                }else if(tab.name==="remark-msg"){
                    this.remark_msg(this.id);
                }else if(tab.name==="qc-msg"){
                    this.qc_msg(this.id);
                } else if(tab.name==="product-desc"){
                    this.product_desc(this.id)
                }else if(tab.name==="product-img"){
                    this.img_init(this.id);
                }else if(tab.name==="mdf-pic") {
                    this.init_mdf_pic(this.id);
                }else if(tab.name==='channel-category'){
                    this.base_info(this.id);
                }
            },

            close(){
                this.show = this.cur_show();
                this.dialogVisible = false;
            },
            open(){
                this.process_id(this.processId);
                this.process_node(this.id);
                this.selectHandle = {};
                this.note = "";
                this.notes = "";
                this.show = this.cur_show();
            },
            cur_show(){
                return this.editAble?[true,true,true,true,true,true,true,true,true]:[false,false,false,false,false,false,false,false,false];
            },
//            --------------------------------------------  编辑
            edit(){
                let actionId = this.menuList.findRet(item => {
                    if (item.name == this.action) {
                        return item.id
                    }
                });
                switch(actionId){
                    case 0:
                        this.show.splice(0,1,true);
                        break;
                    case 1:
                        this.show.splice(1,1,true);
                        break;
                    case 2:
                        this.show.splice(2,1,true);
                        break;
                    case 3:
                        this.show.splice(3,1,true);
                        break;
                    case 5:
                        this.show.splice(4,1,true);
                        break;
                    case 6:
                        this.show.splice(5,1,true);
                        break;
                    case 7:
                        this.show.splice(6,1,true);
                        break;
                    case 8:
                        this.show.splice(7,1,true);
                        break;
                    case 9:
                        this.show.splice(8,1,true);
                        break;
                }
            },
//            --------------------------------------------  保存
            save(val){
                this.$emit("save");
                let actionId = this.menuList.findRet(item=>{
                    if (item.name == this.action) {
                        return item.id
                    }
                });
                switch (actionId) {
                    case 0 :
                        this.tidy_updte_baseInfo();
                        break;
                    case 1:
                        this.keep_supplier();
                        break;
                    case 2 :
                        this.save_sku();
                        break;
                    case 3 :
                        let array=clone(this.form.attribute).map(items=>{
                           return  items.attributes.map(item=>{
                                if(item.type===2){
                                    return {
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
                                                return  {id:it.id,value:it.value}
                                            })
                                        return {
                                            type:item.type,
                                            attribute_id:item.attribute_id,
                                            attribute_value:item.attribute_value
                                        }
                                    }else {
                                        return {
                                            type:item.type,
                                            attribute_id:item.attribute_id,
                                            attribute_value:[]
                                        }
                                    }
                                }
                            })
                        })
                        this.update_product_attr({attributes:JSON.stringify(array[0])})
                        break;
                    case 4 :
                        break;
                    case 5 :
                        let quality=[];
                        for(let i=0 ;i<this.form.qcForm.length;i++){
                            for (let k=0;k<this.form.qcForm[i].items.length;k++){
                                if(this.form.qcForm[i].items[k].enabled){
                                    quality.push(this.form.qcForm[i].items[k].attribute_id)
                                }
                            }
                        }
                        this.update_qc_msg(this.id,{lists:quality});
                        break;
                    case 6 :
                        let desc =[];
                        this.form.descForm.map(row=>{
                            desc.push({
                                lang_id:row.lang_id,
                                description:row.description,
                                title:row.title,
                                tags:row.tags
                            })
                        });
                        this.update_desc({descriptions:desc});
                        break;
                    case 7:
                        let parms = {
                            id:this.id,
                            images:val,
                        }
//                        this.keep_img();
                        this.imgUpdate(parms);
                        break;
                    case 8:
                        this.submit_mdf_requirement();
                        break;
                    case 9:
                        this.tidy_updte_baseInfo();
                        this.show.splice(8,1,false);
                        break;
                }
            },
            tidy_updte_baseInfo(){
                let temp = clone(this.form.baseInfo);
                temp.tags=this.unitData.tag.filter(item=>{
                    if(this.form.baseInfo.tags.indexOf(item.name)!==-1){
                        return true
                    }
                });
                temp.properties = [];
                this.form.baseInfo.properties.map(row=>{
                    if(row.enabled){
                        temp.properties.push({
                            field:row.field,
                            value:row.value
                        });
                    }
                });
                this.update_base_info(temp);
            },
//            --------------------------------------------  取消
            cancel(){
                //编辑状态下的 取消
                    let ind_=this.menuList.find(item=>{
                        return item.name===this.action
                    }).id;
                    switch (ind_) {
                        case 0:
                            this.base_info(this.id);
                            break;
                        case 1:
                            this.provider_info(this.id);
                            break;
                        case 2:
                            this.specification_info(this.id);
                            this.product_sku(this.id);
                            break;
                        case 3 :
                            this.product_attr(this.id);
                            break;
                        case 4 :
                            this.remark_msg(this.id);
                            break;
                        case 5 :
                             this.qc_msg(this.id);
                            break;
                        case 6 :
                            this.product_desc(this.id);
                            break;
                        case 7 :
                            this.img_init(this.id);
                            break;
                        case 8 :
                            this.init_mdf_pic(this.id);
                            break;
                        case 9 :
                            this.base_info(this.id);
                            break;
                    }
            },
//          ----------------------------------------------  添加产品备注 更新
            add_log(data){
                this.remark_msg(this.id);
            },
//            ----------------------------------------------  选择语言
            lang_change(val){
                let langList = this.form.descForm.map(row=>{
                    return row.lang_id;
                });
                if(langList.indexOf(val.id)===-1){
                    this.form.descForm.push({
                        lang_id:val.id,
                        lang_name:val.name,
                        goods_id:this.id,
                        content:""
                    })
                }
            },
//            -----------------------------------------------   查看获取数据  接口
            /*基本信息*/
            base_info(id){
                this.$http(product_base,id).then(res=>{
                    res.tags = res.tags.map(row=>{
                        return row.name;
                    });
                    res.retail_price = parseFloat(res.retail_price).toFixed(2);
                    this.form.baseInfo = res;
                });
            },
            /*供应商信息*/
            provider_info(id){
                this.form.supplier = {};
                this.$http(product_supplier,id).then(res=>{
                    this.form.supplier = res;
                });
            },
            /*规格参数*/
            async specification_info(id){
                this.form.specData = [];
                await this.$http(product_specification,id).then(res=>{
                    res.forEach((row)=>{
                        this.$set(row,'addValue',"");
                        this.$set(row,'selectValue',"");
                        row.attribute_value.forEach((re)=>{
                            this.$set(re,'showUserDefined',false);
                        })
                    })
                    this.form.specData = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*获取编辑开发sku列表*/
            product_sku(id){
                this.$http(product_skuinfo,id).then(res=>{
                    if(!res.lists||!res.headers){
                        let newObj = {
                            lists:[],
                            headers:[]
                        };
                        this.form.specSku= newObj;
                        return;
                    }
                    res.lists.forEach(it=>{
                        if(it.attributes===undefined)this.$set(it,'attributes',[]);
                        let list  = [];
                        res.headers.forEach(row=>{
                            let options,optionItem = this.form.specData.find(its=>row.attribute_id===its.attribute_id);
                            if(!!optionItem){
                                options = optionItem.attribute_value.filter(its=>its.selected);
                                let findChild = it.attributes.find(its=>parseInt(its.attribute_id)===parseInt(row.attribute_id))
                                this.$set(findChild,'options',options)  
                            } 
                        });
                    });
                    this.form.specSku= res;
                    this.tempSku=clone(res.lists);
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*产品属性*/
            product_attr(id){
                this.$http(product_attribute,id).then(res=>{
                    this.form.attribute=res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*备注信息*/
            remark_msg(id){
                this.$http(product_log,id).then(res=>{
                    this.form.logForm =res;
                })
            },
            /*质检信息*/
            qc_msg(id){
                this.$http(qc_msg,id).then(res=>{
                    this.form.qcForm = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*产品描述*/
            product_desc(id){
                this.$http(producr_description,id).then(res=>{
                    this.form.descForm = res.map(row=>{
                        row.newTags = '';
                        return row;
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*产品图片*/
            /*获取开发流程节点列表*/
            process_node(id){
                this.$http(api_process_node,id).then(res=>{
                    this.processNode = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*获取操作按钮根据流程ID接口*/
            process_id(id){
                this.$http(api_process_id,id).then(res=>{
                    this.processStatus = res.map(row=>{
                        return {
                            label:row.btn_name,
                            value:row.code,
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                });
            },
//            ------------------------------------------------  Api 编辑更新接口
            /*基本信息*/
            update_base_info(data){
                this.$http(api_update_base,this.id,data).then(res=>{
                    this.$message(res.message);
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('newBaseInfo', false);
                    }, 300)
                })
            },
            /*规格参数*/
            update_specification_info(data){
                this.$http(api_specification_info,this.id,data).then(res=>{
                    this.$message(res.message);
                    this.product_sku(this.id);
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            /*产品属性*/
            update_product_attr(data){
                this.$http(api_product_attr,this.id,data).then(res=>{
                    this.$message(res.message);
                    this.product_attr(this.id);
                    this.show.splice(3,1,false);
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                    this.show.splice(3,1,true);
                }).finally()
            },
            /*添加备注信息*/
            update_product_log(id,data){
                this.$http(product_add_log,id,data).then(res=>{
                    this.$message(res.message);
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            /*质检更新*/
            update_qc_msg(id,data){
              this.$http(update_qc_msg,id,data).then(res=>{
                  this.$message(res.message);
                  this.show.splice(4,1,false);
              }).catch(code=>{
                  this.$message({message:code.message,type:'error'});
                  this.show.splice(4,1,true);
              })
            },
            /*更新产品描述*/
            update_desc(data){
                this.$http(api_update_desc,this.id,data).then(res=>{
                    this.$message(res.message);
                    this.show.splice(5,1,false);
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                    this.show.splice(5,1,true);
                })
            },
//            -----------------------------------------------  Api 字典
            wordbook_init(){
                /*包装材料*/
                this.$http(api_packing).then(res => {
                    this.unitData.packing = [...res];
                }).catch(code => {
                    console.log(code);
                });
                /*产品单位*/
                this.$http(api_unit).then(res => {
                    this.unitData.unit = res;
                }).catch(code => {
                    console.log(code);
                });
                /*产品品牌*/
                this.$http(api_brand).then(res => {
                    this.unitData.brands = res;
                }).catch(code => {
                    console.log(code);
                });
                /*侵权风险*/
                this.$http(api_tort).then(res => {
                    this.unitData.tort = res;
                }).catch(code => {
                    console.log(code);
                });
                /*获取标签*/
                this.$http(api_tag).then(res => {
                    this.unitData.tag = res;
                }).catch(code => {
                    console.log(code);
                });
                /*获取语言*/
                this.$http(api_lang).then(res => {
                    this.unitData.lang = res;
                }).catch(code => {
                    console.log(code);
                });
                /*获取仓库类型*/
                this.$http(api_warehouse_type).then(res=>{
                    this.unitData.warehouse = res;
                }).catch(code=>{
                    console.log(code);
                })
                /*获取平台销售状态*/
                this.$http(api_platform).then(res=>{
                    this.unitData.platform = res;
                    console.log(res,'res');
                }).catch(code=>{
                    console.log(code);
                })
                /**/

            },
//            -----------------------------------------------  还原数据
            aronud(new_,old_){
                for(let i=0;i<new_.length;i++){
                    for(let k in new_[i]){
                        old_[i][k]=new_[i][k]
                    }
                };
            },
//            --------------------------------------------  产品描述
            save_desc(val,id){
                this.$emit("save-desc",val,id);
            },
            edit_desc(val,id){
                this.$emit("edit-desc",val,id);
            },
//            ---------------------------------------------  操作按钮
            next_handle(val){
                this.selectHandle = val;
                this.$nextTick(()=>{
                    if(this.qcFail)return this.showRemarks = true;
                    let params = {
                        code: val.value,
                        remark: this.notes,
                    }
                    this.api_process_handle(this.id,params);
                })
            },
//            ----------------------------------------------  修改sku列表
            sku_change(index){
                if(this.tempSpecAction.indexOf(index)===-1){
                    this.tempSpecAction.push(index);
                };
            },
//            ----------------------------------------------  保存sku
            save_sku(){
                let isTrue = [];
                let enabledData = clone(this.form.specSku.lists.filter(row=>row.enabled));
                if(enabledData.length>1){
                    for(let i = 0;i<enabledData.length;i++){
                        for(let j = 0;j<enabledData[i].attributes.length;j++){
                            if(i+1<enabledData.length){
                                let val2 = enabledData[i+1].attributes[j];
                                let val1 = enabledData[i].attributes[j];
                                if(val2.attribute_id===val1.attribute_id&&val2.attribute_value===val1.attribute_value){
                                    isTrue.push(true);
                                }else{
                                    isTrue.push(false);
                                }
                            }else if(i-1>0){
                                let val2 = enabledData[i-1].attributes[j];
                                let val1 = enabledData[i].attributes[j];
                                if(val2.attribute_id===val1.attribute_id&&val2.attribute_value===val1.attribute_value){
                                    isTrue.push(true);
                                }else{
                                    isTrue.push(false);
                                }
                            }
                        }
                    }
                    if(isTrue.findIndex(row=>!row)<=-1){
                        setTimeout(() => {
                            this.$reqKey('specification', false);
                        }, 300);
                        return this.$message({type:"warning",message:"sku属性不允许重复，请修改后提交"});
                    }
                }
                let mdfData = enabledData.map(row=>{
                    row.attributes = row.attributes.map(res=>{
                        let find = this.form.specData.find(it=>it.attribute_id===res.attribute_id);
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
                    return {
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
                    }
                });
                this.$http(api_update_sku,this.id,{lists:mdfData}).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.show.splice(2,1,false);
                    this.product_sku(this.id);
                    this.tempSku=clone(this.form.specSku);
                }).catch(code=>{
                    this.show.splice(2,1,true);
                    console.log(code)
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('specification', false);
                    }, 300)
                })
            },
//            -----------------------------------------  保存供应商
            keep_supplier(){
                let data={
                    goods_id:this.id,
//                    purchaser_id:this.form.supplier.purchaser_id
                };
                let find=this.form.supplier.supplier.find(row=>{return row.is_default===1});
                if(!!find){
                    data.supplier_id=find.supplier_id;
                }
                this.$http(publish_updata_supplier,data).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.show.splice(1,1,false);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('providerInfo', false);
                    }, 300)
                })
            },
//            -----------------------------------------   提交审批流程接口
            api_process_handle(id,data){
                this.$http(process_handle,id,data).then(res=>{
                    this.$message(res.message);
                    this.dialogVisible = false;
                    this.$emit("process-handle");
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                    this.dialogVisible = true;
                })
            },
        },
        computed:{
            showQc(){
                if(this.processId) return this.processId>=176?true:false;
            },
            showDesc(){
                if(this.processId) return this.processId>=1968?true:false;
            },
            showImg(){
                console.log(this.processId,'this.processId');
                if(this.processId) return this.processId>=122804?true:false;
            },
//            action(){
//                if(this.processId){
//                    let cur = this.processId;
//                    if(cur===176||cur===177||cur===432||cur==433){
//                        this.qc_msg(this.id);
//                        return 'qc-msg';
//                    }else if(cur===20400||cur===53168||cur===1968){
//                        this.product_desc(this.id)
//                        return 'product-desc';
//                    }else if(cur===122804||cur===24500||cur===32688){
//                        this.img_init(this.id);
//                        return 'product-img';
//                    }else{
//                        this.base_info(this.id);
//                        return 'base-info';
//                    };
//                }
//            }
        },
        props:{
            spuTitle:{},
            value:{},
            editAble:{
                required:true,
                type:Boolean
            },
            id: {
                required: true,
                type: Number
            },
            processId: {
                required: true,
                type: Number
            },
            currentStatus:{
                required: true,
                type: Number
            },
            childActiveName:{},
        },
        components:{
            baseInfo,providerInfo,
            specificationInfo,
            productAttr,
            remarkMsg,
            qcMsg,
            productDesc,
            productImg,
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiSvg:require('../../../components/ui-svg.vue').default,
            trendsSelect:require('../../../components/trends-select.vue').default,
            imgRequirement:require('../../product/plan-exploit/img-requirement.vue').default,
            channelCategory:require('./channel-category.vue').default,
            pictureGroup:require('../../../components/picture-group.vue').default,
        }
    }
</script>
