<template>
    <div class="c-search-table mt-xs">
        <el-row>
            <el-col :span="24">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="按重量试算" name="first">
                        <table class="big-table">
                            <tr>
                                <td class="width-sm font-15 t-right"><span class="red">*  </span>发货仓库：</td>
                                <td>
                                    <el-select class="s-width-large width-xs" v-model="form.warehouse_id" filterable clearable>
                                        <el-option
                                            v-for="(item, index) in warehouseList"
                                            :value="item.value"
                                            :label="item.label"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right"><span class="red">*  </span>到达国家：</td>
                                <td>
                                    <el-select class="s-width-large s-width-default" v-model="form.country_code" filterable clearable >
                                        <el-option
                                            v-for="(item, index) in countryList"
                                            :key="index"
                                            :value="item.value"
                                            :label="item.label"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right">运输方式：</td>
                                <td>
                                    <el-select :disabled="isDisabled"
                                               :placeholder="isDisabled?'运输方式暂无数据...':'请选择数据...'"
                                               v-model="form.shipping_methods" multiple filterable clearable>
                                        <el-option
                                            v-for="(item, index) in postwayList"
                                            :value="item.value"
                                            :label="item.label"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right">体  积：</td>
                                <td>
                                    <div class="mb-mini">
                                        <span>长：</span>
                                        <ui-limit-number class="inline" v-model="form.length" :limit="1"></ui-limit-number>
                                        <span>cm</span>
                                    </div>
                                    <div class="mb-mini">
                                        <span>宽：</span>
                                        <ui-limit-number class="inline" v-model="form.width" :limit="1"></ui-limit-number>
                                        <span>cm</span>
                                    </div>
                                    <div class="mb-mini">
                                        <span>高：</span>
                                        <ui-limit-number class="inline" v-model="form.height" :limit="1"></ui-limit-number>
                                        <span>cm</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right"><span class="red">*  </span>货物重量：</td>
                                <td>
                                    <input class="inline mr-xs s-width-large el-input__inner" v-model="form.weight" type="number" min="0" onkeyup="this.value=this.value.replace(/\.{2,}/g, '')" onafterpaste="this.value=this.value.replace(/\.{2,}/g, '')" ><span>g</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right">物流属性：</td>
                                <td>
                                    <el-checkbox v-model="it.enabled"
                                                 v-for="it in propertyData" :key="it.name">{{it.name}}
                                    </el-checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right">可发货平台：</td>
                                <td>
                                    <el-checkbox v-model="it.enabled"
                                                 v-for="it in channelList" :key="it.value">{{it.label}}
                                    </el-checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <el-button type="primary" @click.native="search" size="mini" v-permission.inquire="'entrepotFreight'">提交查询</el-button>
                                </td>
                            </tr>
                        </table>
                    </el-tab-pane>
                    <el-tab-pane label="按包裹试算" name="second">
                        <table class="big-table">
                            <tr>
                                <td class="font-15 t-right"><span class="red">*  </span>包裹号：</td>
                                <td>
                                    <el-input class="inline mr-xs s-width-large"
                                           v-model="form.package_number"
                                           @keyup.enter.native="package_number_enter"
                                           @blur="package_number_enter"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <td class="width-sm font-15 t-right"><span class="red">*  </span>发货仓库：</td>
                                <td>
                                    <el-select class="s-width-large" v-model="form.warehouse_id" filterable clearable>
                                        <el-option
                                            v-for="(item, index) in warehouseList"
                                            :value="item.value"
                                            :label="item.label"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right"><span class="red">*  </span>到达国家：</td>
                                <td>
                                    <el-select class="s-width-large" v-model="form.country_code" filterable clearable >
                                        <el-option
                                            v-for="(item, index) in countryList"
                                            :key="index"
                                            :value="item.value"
                                            :label="item.label"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right">运输方式：</td>
                                <td>
                                    <el-select :disabled="isDisabled"
                                               :placeholder="isDisabled?'运输方式暂无数据...':'请选择数据...'"
                                               v-model="form.shipping_methods" multiple filterable clearable>
                                        <el-option
                                            v-for="(item, index) in postwayList"
                                            :value="item.value"
                                            :label="item.label"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <el-button type="primary" @click.native="search" size="mini" v-permission.inquire="'entrepotFreight'">提交查询</el-button>
                                </td>
                            </tr>
                        </table>
                    </el-tab-pane>
                    <el-tab-pane label="按SKU试算" name="third">
                        <table class="big-table">
                            <tr>
                                <td class="width-sm font-15 t-right"><span class="red">*  </span>发货仓库：</td>
                                <td>
                                    <el-select class="s-width-large" v-model="form.warehouse_id" filterable clearable>
                                        <el-option
                                            v-for="(item, index) in warehouseList"
                                            :value="item.value"
                                            :label="item.label"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right"><span class="red">*  </span>到达国家：</td>
                                <td>
                                    <el-select class="s-width-large" v-model="form.country_code" filterable clearable >
                                        <el-option
                                            v-for="(item, index) in countryList"
                                            :key="index"
                                            :value="item.value"
                                            :label="item.label"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right">运输方式：</td>
                                <td>
                                    <el-select :disabled="isDisabled"
                                               :placeholder="isDisabled?'运输方式暂无数据...':'请选择数据...'"
                                               v-model="form.shipping_methods" multiple filterable clearable>
                                        <el-option
                                            v-for="(item, index) in postwayList"
                                            :value="item.value"
                                            :label="item.label"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right">可发货平台：</td>
                                <td>
                                    <el-checkbox v-model="it.enabled"
                                                 v-for="it in channelList" :key="it.value">{{it.label}}
                                    </el-checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td class="font-15 t-right"><span class="red">*  </span>SKU：</td>
                                <td>
                                    <el-form :model="form" ref="form">
                                        <div v-for="(item,index) in form.sku" :key="index">
                                            <el-form-item label="SKU：" class="inline width-super">
                                                <el-input v-model="item.sku" class="inline"></el-input>
                                            </el-form-item>
                                            <el-form-item label="数量：" class="inline width-super">
                                                <el-input v-model="item.num" class="inline"></el-input>
                                            </el-form-item>
                                            <div class="mt-mini inline sku-operate" @click="delete_sku(index)" v-if="index>0">
                                                <img src="../../../assets/delete(2).png">
                                            </div>
                                            <div class="mt-mini inline pointer sku-operate" @click="add_sku">
                                                <img src="../../../assets/add2.png" style="vertical-align: sub;">
                                            </div>
                                        </div>
                                    </el-form>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <el-button type="primary" @click.native="search" size="mini" v-permission.inquire="'entrepotFreight'">提交查询</el-button>
                                </td>
                            </tr>
                        </table>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .big-table{
        width:100%;
        font-size:1.2rem;
        box-sizing:border-box;
        border-collapse:collapse;
        border-left:1px solid #e0e6ed;
        border-top:1px solid #e0e6ed;
        td,th{
            padding:8px 5px;
            box-sizing: border-box;
            border-right:1px solid #e0e6ed;
            border-bottom:1px solid #e0e6ed;
        }
        td.align-left{text-align:left}
        .sku-operate {
            height: 28px;
        }
    }
</style>
<script>
    import {
        api_get_trial,
        api_get_warehouse,
        api_get_country,
        api_get_postway,
        api_trial_index,
        api_shipping_method_property} from '@/api/freight-trial';
    import {api_get_channel} from "@/api/common"
    export default{
        data(){
            return {
                warehouseList:[],
                countryList:[],
                postwayList:[],
                channelList:[],
                isDisabled:false,
                decimals:1,
                form:{
                    warehouse_id:"",
                    country_code:"",
                    shipping_methods:[],
                    length:0,
                    width:0,
                    height:0,
                    weight:100,
                    package_number:'',
                    sku:[{
                    	sku:'',
                    	num:'',
                    }],
                },
                activeName:'first',
                propertyData:[],
                shipping_methods:''
            }
        },
        created(){
            this.get_trial_index();
            this.api_get_warehouse();
            this.api_get_country();
            this.get_shipping_method_property();
            this.init_channel();
        },
        watch:{
            "form.warehouse_id"(val){
                this.form.shipping_methods = [];
                if(!val||!this.form.country_code)return;
                this.api_get_postway(val,this.form.country_code);
            },
            "form.country_code"(val){
                this.form.shipping_methods = [];
                if(!val || !this.form.warehouse_id)return;
                this.api_get_postway(this.form.warehouse_id,val);
            },
        },

        methods:{
            init_channel() {
                this.$http(api_get_channel).then(res => {
                    this.channelList = res.map(row => {
                        return Object.assign(row, {
                            enabled: false,
                        });
                    })
                });
            },
            package_number_enter(){
                this.form.package_number = this.form.package_number.trim();
            	if(this.form.package_number){
                    let data = {
                        package_number:this.form.package_number,
                        get_package:1,
                        search_type:2,
                    };
                    this.shipping_methods = '';
                    this.$http(api_get_trial,data).then(res=>{
                    	if(res){
                            this.form.warehouse_id = res.warehouse_id;
                            this.form.country_code = res.country_code;
                            this.shipping_methods = res.shipping_method_id;
                        }
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message || code});
                    });
                }
            },
            delete_sku(index){
            	this.form.sku.splice(index,1);
            },
            add_sku(){
                this.form.sku.push({sku:'',num:''});
            },
            search(){
                typeof this.form.package_number === 'string' && (this.form.package_number = this.form.package_number.trim());
                this.form.sku.forEach(row => {
                    Object.keys(row).forEach(key => {
                        if(typeof row[key] === 'string') {
                            row[key] = row[key].trim();
                        }
                    });
                });
                let cur = window.clone(this.form);
                if(this.activeName==='first'){
                    this.$set(cur,'search_type',1);
                    let property = [];
                    let channel = [];
                    this.propertyData.forEach(res=>{
                        if(res.enabled){
                            property.push(res.value);
                        }
                    });
                    this.$set(cur,'property',property);
                    this.$set(cur, 'channel', channel);
                }else if(this.activeName==='second'){
                    this.$set(cur,'search_type',2);
                }else {
                    this.$set(cur,'search_type',3);
                    let channel = [];
                    this.channelList.forEach(res => {
                        if(res.enabled) {
                            channel.push(res.value);
                        }
                    });
                    this.$set(cur, 'channel', channel);
                }
                this.$emit("search",cur);
            },
//            为关联仓库而有的接口
            get_trial_index(){
                this.$http(api_trial_index).then(res=>{
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            get_shipping_method_property(){
                this.$http(api_shipping_method_property).then(res=>{
                    this.propertyData = res;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                })
            },
//            获取仓库
            api_get_warehouse(){
                this.warehouseList = [],
                    this.$http(api_get_warehouse).then(res=>{
                        this.warehouseList = res.map(row=>{
                            return {
                                label:row.name,
                                value:row.id,
                            }
                        });
                        this.$set(this.form,"warehouse_id",this.warehouseList[0].value);
                    }).catch(code=>{
                        this.$message({type: 'error', message: code.message || code});
                    })
            },
//          获取国家
            api_get_country(){
                this.countryList = [];
                this.$http(api_get_country).then(res=>{
                    this.countryList = res.map(row=>{
                        return {
                            label:row.country_cn_name,
                            value:row.country_code
                        }
                    });
                    this.$set(this.form,"country_code",this.countryList[0].value);
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                })
            },
//          获取运输方式
            api_get_postway(d,v){
                let params = {
                    warehouse_id:d,
                    country_code:v
                };
                this.postwayList = [];
                this.$http(api_get_postway,params).then(res=>{
                    this.isDisabled = res.length>0?false:true;
                    this.postwayList = res.map(row=>{
                        return {
                            label:row.shortname,
                            value:row.id
                        }
                    });
                    let find = this.postwayList.find(row=>{
                    	return row.value === this.shipping_methods;
                    });
                    if(!!find){
                    	if(!this.form.shipping_methods.includes(this.shipping_methods)){
                            this.form.shipping_methods.push(this.shipping_methods);
                            this.isDisabled = false;
                        }
                    }
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                })
            },
        },
        props:{},
        components: {
            uiLimitNumber:require("../../../components/ui-limit-number.vue").default
        }
    }
</script>
