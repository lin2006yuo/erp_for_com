<template>
    <el-row class="c-set-logistics">
        <rainbow-header title="物流设置" background-color="#ABCD05">
            <div class="fr mt-mini mr-sm" slot="header-right">
                <el-select class="inline width-lg"
                           ref="trans"
                           v-mouse-side.mousewheel="()=>{$refs.trans.visible=false}"
                           :disabled="transList&&transList.length<=0"
                           v-model="form.list.mod_trans"
                           @change="change_trans"
                           filterable clearable
                           :placeholder="placeHolder">
                    <el-option
                            v-for="item in transList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
                <el-button type="primary" size="mini" class="inline" @click.native="save_as">另存为</el-button>
            </div>
            <el-form :model="form" label-width="220px">
                <el-form-item label="国内运输" class="bold-font"></el-form-item>
                <div :class="index===0?'':'mt-lg'" v-for="(item,index) in form.set.shipping" :key="`${index}s`">
                    <el-form-item :label="`运输方式 ${index+1}：`">
                        <el-row>
                            <el-col :span="10">
                                <el-select v-model="item.shipping_service"
                                           :disabled="intransportList&&intransportList.length<=0"
                                           filterable clearable
                                           :placeholder="place_holder(intransportList,shipTitle)">
                                    <el-option
                                            v-for="(res,res_i) in intransportList"
                                            :label="res.description"
                                            :value="res.shipping_service"
                                            :key="`${res.id}${res_i}`"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" v-if="index===0">
                                <span class="icon-refresh" @click="refresh_trans('in')" :title="refreshTitle"></span>
                                <span class="ml-sm red" v-if="inShow">更新请求中...</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="首件运费：">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <ui-limit-number v-model="item.shipping_service_cost" placeholder="请输入首件运费" :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusCom">
                                <label class="normal-font">{{curSite.currency}}</label>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="续件运费：">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <ui-limit-number v-model="item.shipping_service_additional_cost" placeholder="请输入续件运费" :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusCom">
                                <label class="normal-font">{{curSite.currency}}</label>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="AK,HI,PR额外收费：">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <ui-limit-number v-model="item.extra_cost" placeholder="请输入AK,HI,PR额外收费" :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusCom">
                                <label class="normal-font">{{curSite.currency}}</label>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" size="mini" @click.native="add_in_transport">添加运输方式</el-button>
                    <el-button  @click.native="del_transport(form.set.shipping)" size="mini">删除</el-button>
                </el-form-item>
                <el-form-item label="国际运输" class="bold-font mt-lg"></el-form-item>
                <div :class="index===0?'':'mt-lg'"
                     v-for="(item,index) in form.set.international_shipping" :key="`${index}i`">
                    <el-form-item :label="`运输方式 ${index+1}：`">
                        <el-row>
                            <el-col :span="10">
                                <el-select v-model="item.shipping_service"
                                           :disabled="outtransportList&&outtransportList.length<=0"
                                           filterable clearable
                                           :placeholder="place_holder(outtransportList,shipTitle)">
                                    <el-option
                                            v-for="(res,index) in outtransportList"
                                            :label="res.description"
                                            :value="res.shipping_service"
                                            :key="`${res.id}${index}`"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" v-if="index===0">
                                <span class="icon-refresh" @click="refresh_trans('out')" :title="refreshTitle"></span>
                                <span class="ml-sm red" v-if="outShow">更新请求中...</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="首件运费：">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <ui-limit-number v-model="item.shipping_service_cost" placeholder="请输入首件运费" :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusCom">
                                <label class="normal-font">{{curSite.currency}}</label>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="续件运费：">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <ui-limit-number v-model="item.shipping_service_additional_cost" placeholder="请输入续件运费" :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusCom">
                                <label class="normal-font">{{curSite.currency}}</label>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="可运至的国家：">
                        <delivery-country :name-list="nameList"
                                          ref="nameList"
                                          v-model="item.shiptolocation"
                                          :location-list="locationList"
                        ></delivery-country>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" size="mini" @click.native="add_out_transport">添加运输方式</el-button>
                    <el-button  @click.native="del_transport(form.set.international_shipping)" size="mini">删除</el-button>
                </el-form-item>
                <div class="box-border mb-sm"></div>
                <el-form-item label="不运送地区：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select :value="form.set.custom_exclude"
                                       @input="(val)=>{change_exclude(val)}" filterable clearable>
                                <el-option
                                        v-for="res in excludeList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item  v-if="form.set.custom_exclude===3">
                    <span class="inline" style="color:#2F972F">（在您创建了不运送地区列表之后，系统会自动开启【买家条件】功能。 在不运送列表国家或地区注册的用户，将被自动屏蔽掉。不过，您可以随时做更改。）</span>
                    <div>
                        <el-button  class="inline" type="primary" size="mini" @click.native="edit_exclude">编辑不运送地区列表</el-button>
                        <el-select  class="inline"
                                    style="width:15%"
                                    v-model="form.list.mod_exclude"
                                    @change="select_model"
                                    :placeholder="excludesHolder"
                                    :disabled="nondeliveryList&&nondeliveryList.length<=0"
                                    filterable clearable>
                            <el-option v-for="item in nondeliveryList"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                        <el-button type="primary" size="mini" class="inline" @click.native="save_as2">另存为</el-button>
                    </div>
                    <!--编辑列表-->
                    <add-country title="添加不送达地区"
                                 ref="addCountry"
                                 v-model="countryDialog"
                                 :location-list="locationList"
                                 :form="countryForm"
                                 @submit="country_submit"></add-country>
                </el-form-item>
                <el-form-item  v-if="form.set.exclude_location">
                    <div class="gray-background">
                        <span>一系列不送达地区：{{form.set.exclude_location}}</span>
                    </div>
                </el-form-item>
                <el-form-item label="商品采购周期（天）：">
                    <span>暂无字段</span>
                </el-form-item>
                <el-form-item label="备货时间：">
                    <el-row >
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.dispatch_max_time" filterable clearable>
                                <el-option
                                        v-for="res in choiceList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="销售税（Tax）：">
                    <el-row :gutter="8">
                        <el-col :span="commonSpan">
                            <el-select :disabled="salesTaxList.length<=0" v-model="form.list.sales_tax_state" :placeholder="place_holder(salesTaxList)">
                                <el-option v-for="item in salesTaxList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="smallSpan">
                            <ui-limit-number v-model="form.list.sales_tax" :limit="2"></ui-limit-number>
                        </el-col>
                        <el-col :span="largeSpan">
                            <el-checkbox v-model="form.list.shipping_tax">运费包括销售税</el-checkbox>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="上门提货(Local Pickup)：">
                    <el-checkbox v-model="form.set.local_pickup">Buyers can pick up the item from you</el-checkbox>
                    <div class="mt-sm">（注意：只有选择支付方式为PayPal，并且要求买家立即付款，该选项才有效！）</div>
                </el-form-item>
            </el-form>
        </rainbow-header>
        <save-as v-model="dialog" @submit="submit"></save-as>
    </el-row>
</template>
<style lang="stylus" scoped>
    .c-set-logistics{
        .c-box-label {
            box-sizing: border-box;
            width: 100%;
            color: #5e6d82;
            font-size: 1.25rem;
            padding: 0 10px 10px 0;
            display: inline-block;
            border-bottom: 2px solid #dee5ee;
            margin-bottom: 20px;
        }
        .box-border{
            border-bottom:2px dotted #ddd;
            margin-top:10px;
            height:10px;
            margin-left:60px;
        }
        .gray-background{
            background-color: #F2F2F5;
            padding:10px 15px;
            word-wrap: break-word;
            word-break:break-word;
        }
    }
</style>
<script>
    import {api_get_transform,api_get_trans,api_save_common_trans,api_get_countrys,api_common_modeList,api_batch_sync,
        api_get_vat_info,api_edit_model,api_save_common_model} from '@/api/ebay-kandeng-public-module';
    import {get_local} from'./get_localtion';
    export default{
        data(){
            return {
                outShow:false,
                inShow:false,
                curModel:"",
                dialog:false,
                countryDialog:false,
                newModelName:"",
                refreshTitle:'点击更新运输方式',
                transList:[],
                outtransportList:[],
                intransportList:[],
                nondeliveryList:[],
                salesTaxList:[],
                country:{
                    exclude:[]
                },
                excludeList:[
                    {label:"运输至所有国家",value:1},
                    {label:"使用eBay站点设置",value:2},
                    {label:"选择不运送地区",value:3},
                ],
                shipTitle:"运输方式",
                salesTax:"销售税",
                nameList:[
                    {name:"亚洲",value:1},
                    {name:"欧洲",value:2},
                    {name:"非洲",value:3},
                    {name:"北美洲",value:4},
                    {name:"南美洲",value:5},
                    {name:"澳洲",value:6},
                ],
                choiceList:[
                    {label:"当天发货",value:0},
                    {label:"1天",value:1},
                    {label:"2天",value:2},
                    {label:"3天",value:3},
                    {label:"4天",value:4},
                    {label:"5天",value:5},
                    {label:"10天",value:10},
                    {label:"15天",value:15},
                    {label:"20天",value:20},
                    {label:"30天",value:30},
                    {label:"40天",value:40},
                ]
            }
        },
        computed:{
            placeHolder(){
                if(this.form.list.site===""){
                    return "请先选择站点";
                }else if(this.form.list.site!==""&&this.transList&&this.transList.length<=0){
                    return "暂无数据";
                }else{
                    return "选择已有模板";
                }
            },
            excludesHolder(){
                if(this.form.list.site===""){
                    return "请先选择站点";
                }else if(this.form.list.site!==""&&this.nondeliveryList&&this.nondeliveryList.length<=0){
                    return "暂无数据";
                }else{
                    return "选择已有模板";
                }
            },
            surplusCom(){
                return Number(23-this.commonSpan);
            },
            surplusLar(){
                return Number(23-this.largeSpan);
            },
            countryForm(){
                this.country.exclude = [];
                if(this.form.set.exclude_location){
                    let cloneData = window.clone(this.form.set.exclude_location);
                    this.country.exclude = cloneData.split('，');
                }
                return  this.country;
            },
            curSite(){
                let curObj = {};
                if(this.siteList&&this.siteList.length>0){
                    let cur = this.siteList.find(row=>row.siteid===this.form.list.site);
                    if(!!cur) curObj = cur;
                }
                return curObj
            },
        },
        mounted(){
            this.get_exclude();//获取不送达地区
            this.get_trans_temp();
            this.get_sales_tax();
            if(this.curPage==='notYet'){
                this.get_shipping();
            }
        },
        watch:{
            "form.list.site"(){
                this.get_exclude();
            },
        },
        methods:{
            get_local,
            change_show(name,bool){
                if(name==='in'){
                    this.inShow=bool;
                }else if(name==='out'){
                    this.outShow=bool;
                }
            },
            refresh_trans(name){
                this.change_show(name,true);
                let params = {
                    site_id:this.form.list.site,
                    account_id:this.form.list.account_id,
                };
                this.$http(api_batch_sync,params).then(res => {
                    this.get_shipping();
                    this.change_show(name,false);
                    this.$message({type:'success',message:res.message||res});
                }).catch(code => {
                    this.change_show(name,false);
                    this.$message({type:'error',message:code.message||code})
                })
            },
            edit_set_continent(){
                if(this.$refs.nameList&&this.$refs.nameList.length>0){
                    this.$refs.nameList.forEach(row=>{
                        row.edit_set_continent();
                    });
                }
                this.$refs.addCountry&&this.$refs.addCountry.edit_set_continent();
            },
//            ---------------------------------------------------------------  国内运输 国际运输
            /*选用现有的模板*/
            change_trans(val){
                this.form.set.international_shipping = [];
                let params = {
                    model_type:"trans",
                    id:val,
                };
                 this.$http(api_get_trans,params).then(res=>{
                     let cur1 = [{
                         shipping_service:"",
                         shipping_service_cost:"",
                         shipping_service_additional_cost:"",
                         selectAll:false,
                         shiptolocation:[],
                     }];
                     let cur2 = [{
                         shipping_service:"",
                         shipping_service_cost:"",
                         shipping_service_additional_cost:"",
                         extra_cost:"",
                     }];
                     this.form.set.shipping = [];
                     this.form.set.international_shipping =[];
                     let trans = res.data.trans.filter(row=>{return parseInt(row.inter)===1});
                     let transin = res.data.trans.filter(row=>{return parseInt(row.inter)===0});
                     if(trans.length<=0&&transin.length<=0){
//                         this.form.set.international_shipping = cur1;
                         this.form.set.shipping = cur2;
                     }else if(trans.length<=0&&transin.length>0){
//                         this.form.set.international_shipping = cur1;
                         res.data.trans.forEach(it=>{
                            this.set_shipping(it);
                         });
                     }else if(transin.length<=0&&trans.length>0){
                         res.data.trans.forEach(row=>{
                            this.set_international_shipping(row);
                         });
                         this.form.set.shipping = cur2
                     }else {
                         res.data.trans.forEach(row=>{//trans有数据时
                             if(parseInt(row.inter)===1){
                                this.set_international_shipping(row);
                             }else{
                                 this.set_shipping(row);
                             }
                         })
                     }
                 }).catch(code=>{
                     console.log(code);
                 })
            },
            set_shipping(row){//国内
                let obj = {
                    shipping_service:row.trans_code,
                    shipping_service_cost:row.cost,
                    shipping_service_additional_cost:row.add_cost,
                    extra_cost:row.extra_cost,
                };
                this.form.set.shipping.push(obj);
            },
            set_international_shipping(row){
                let obj = {};
                obj.shipping_service = row.trans_code;
                obj.shipping_service_cost = row.cost;
                obj.shipping_service_additional_cost = row.add_cost;
                if(row.location==='Worldwide'){
                    obj.selectAll = true;
                    obj.shiptolocation = this.get_local(this.locationList);
                }else{
                    obj.shiptolocation = row.location?JSON.parse(row.location):[];
                    obj.selectAll = false;
                    /*调国家组件内事件*/
                }
                this.$nextTick(()=>{
                    this.form.set.international_shipping.push(obj);
                    if(this.$refs.nameList&&this.$refs.nameList.length>0){
                        this.$refs.nameList.forEach(row=>{
                            row.edit_set_continent();
                        });
                    }
                })
            },
            /*另存为*/
            save_as(){
                this.curModel = "trans";
                this.dialog = true;
            },
            /*保存为新模板*/
            submit(val){//两个"另存为"按钮共用的事件
                if(this.curModel==="trans") {
                    let model_type = "trans";
                    let detail = [];
                    let cloneTrans = window.clone(this.form.set.international_shipping);
                    let cloneTransIn = window.clone(this.form.set.shipping);
                    cloneTrans.forEach(row => {
                        row.trans_code = row.shipping_service;
                        row.cost = row.shipping_service_cost;
                        row.add_cost = row.shipping_service_additional_cost;
                        row.location = row.shiptolocation;
                        row.extra_cost = "";
                        row.inter = 1;
                        delete row.shipping_service;
                        delete row.shipping_service_cost;
                        delete row.shipping_service_additional_cost;
                        delete row.shiptolocation;
                        delete row.selectAll;
                    });
                    cloneTransIn.forEach(row => {
                        row.trans_code = row.shipping_service;
                        row.cost = row.shipping_service_cost;
                        row.add_cost = row.shipping_service_additional_cost;
                        row.location = [];
                        row.inter = 0;
                        delete row.shipping_service;
                        delete row.shipping_service_cost;
                        delete row.shipping_service_additional_cost;
                    });
                    let obj = {
                        site: this.form.list.site,
                        model_name: val,
                        type: model_type,
                        trans: [...cloneTrans, ...cloneTransIn],
                    };
                    let params = {
                        action: "add",
                    };
                    params.detail = JSON.stringify([obj]);
                    this.$http(api_save_common_trans, params).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.get_trans_temp();
                        this.dialog = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code || code});
                    })
                }else if(this.curModel==="exclude"){
                    if(val===""||this.form.list.site==="") return this.$message({type:"warning",message:"站点及另存模板名称为必填项"});
                    let model_type="exclude";
                    let detail = [];
                    let obj = {
                        model_type:model_type,
                        model_name:val,
                        site:this.form.list.site,
                        exclude:this.form.set.exclude_location.split("，")
                    };
                    detail.push(obj);
                    let params = {
                        model_type:model_type,
                    };
                    params.detail = JSON.stringify(detail);
                    this.$http(api_save_common_model,params).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.dialog = false;
                        this.get_exclude();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message||code});
                    })
                }
            },
            /*物流方式模板*/
            get_trans_temp(){
                this.transList = [];
                if(!this.form.list||this.form.list.site==='')return;
                let params = {
                    model_type:"trans",
                    site:this.form.list.site
                };
                this.$http(api_common_modeList,params).then(res=>{
                    this.transList = res.data.map(row=>{
                        return {
                            label:row.model_name,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*placeholder*/
            place_holder(array,title){
                if(this.form.list.site===''){
                    return "请先选择站点";
                }else if((this.form.list.site||this.form.list.site===0) && array &&array.length<=0){
                    if(!!title){
                        return  `该站点下暂无${title}`;
                    }else{
                        return   `暂无数据`;
                    }
                }else{
                    if(!!title){
                        return  `请选择${title}`;
                    }else{
                        return  `请选择`;
                    }
                }
            },
            /*国际 添加物流方式*/
            add_out_transport(){
                let length = this.form.set.international_shipping.length;
                if(length>0){
                    let cur_code = this.form.set.international_shipping[length-1].shipping_service;
                    if(!cur_code) return this.$message({message:"请完善当前国际运输方式！", type:'warning'});
                }
                let obj = {
                    selectAll:false,
                    shipping_service:"",
                    shipping_service_cost:"",
                    shipping_service_additional_cost:"",
                    shiptolocation:this.get_local(this.locationList),
                };
                this.form.set.international_shipping.push(obj);
            },
            /*国内  添加物流方式*/
            add_in_transport(){
                let length =  this.form.set.shipping.length;
                if(length>0){
                    let shipping_service = this.form.set.shipping[length-1].shipping_service;
                    if(!shipping_service) return this.$message({message:"请完善当前国内运输方式！", type:'warning'});
                }
                let obj = {
                    shipping_service:"",
                    shipping_service_cost:"",
                    shipping_service_additional_cost:"",
                    extra_cost:"",
                };
                this.form.set.shipping.push(obj);
            },
            /*物流方式*/
            del_transport(Array){
//                if(Array.length<=1)return this.$message({type:"warning",message:"现有数据不允许删除"});
                let length = Array.length;
                if(length<=0)return;
                Array.splice(length-1,1);
            },
            /*获取运输方式*/
            get_shipping(){
                this.outtransportList = [];
                this.intransportList = [];
                if(!this.form.list||this.form.list.site==='')return;
                this.$http(api_get_transform,{site:this.form.list.site}).then(res=>{
                    res.forEach(row=>{
                        let r = '';
                        let min = row.shipping_time_min;
                        let desc = row.description;
                        let max = row.shipping_time_max;
                        if(min&&max){
                            r = `${desc} (${min}-${max} days)`;
                        }else if(min&&!max){
                            r = `${desc} (${min} days)`;
                        }else if(!min&&max){
                            r = `${desc} (${max} days)`;
                        }else {
                            r = `${desc}`;
                        }
                        row.description = r;
                        if(row.international_service){
                            if(this.outtransportList.includes(row.id))return;
                            this.outtransportList.push(row);
                        }else{
                            if(this.intransportList.includes(row.id))return;
                            this.intransportList.push(row);
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
//            --------------------------------------------------------------- 不送达地区
            /*编辑不送达地区*/
            edit_exclude(){
                this.countryDialog = true;
            },
            /*添加不送达地区*/
            country_submit(val){

                this.form.set.exclude_location = val.join("，");
            },
            /*更改不送达地区*/
            change_exclude(val){
                this.form.set.custom_exclude = val;
                this.form.list.mod_exclude = "";
                this.form.set.exclude_location = "";
            },
            select_model(val){
                this.form.set.exclude_location = "";
                if(!val) return;
                let params = {
                    model_type:"exclude",
                    id:val
                };
                this.$http(api_edit_model,params).then(res=>{
                    let cur = (res.data!=='null'&&!!res.data.exclude)?res.data.exclude:'[]';
                    this.form.set.exclude_location = JSON.parse(cur).join("，")
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*获得不送达地区下拉框 数据*/
            get_exclude(){
                if(!this.form.list||this.form.list.site==='')return;
                this.nondeliveryList = [];
                let params = {
                    model_type:"exclude",
                    site:this.form.list.site
                };
                this.$http(api_common_modeList,params).then(res=>{
                    this.nondeliveryList = res.data.map(row=>{
                        return {
                            label:row.model_name,
                            value:row.id,
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*获取销售税*/
            get_sales_tax(){
                if(this.form.list.site==="")return;
                let param = {
                    site:this.form.list.site
                };
                this.$http(api_get_vat_info,param).then(res=>{
                    this.salesTaxList = res.data.map(row=>{
                        return {
                            label:row.jurisdiction_name,
                            value:row.jurisdiction_id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*另存为*/
            save_as2(){
                this.curModel = "exclude";
                this.dialog = true;
            },
        },
        props:{
            curPage:{
                type:String,
                required:true
            },
            form:{},
            /*根据站点变化的货币符号*/
            locationList:{
                type:Array,
                required:true
            },
            commonSpan:{
                require:true,
                type:Number
            },
            largeSpan:{
                require:true,
                type:Number
            },
            smallSpan:{
                require:true,
                type:Number
            },
            siteList:{
                require:true,
                type:Array
            }
        },
        components: {
            saveAs:require('./save-as.vue').default,
            addCountry:require('./add-country.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            deliveryCountry:require('./delivery-country.vue').default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>
