<template>
    <div class="c-card-search">
        <search-card :params = "form" :clears ="clears" @enter="search" @search="search" @clearParams="clearParams">
            <div>
                <label-buttons label="状态："
                              class="inline"
                              :buttons="buttonList"
                              v-sf.status
                              @select="change_status"></label-buttons>
                <label-buttons label="类型："
                              class="inline ml-xs"
                              :buttons="typeList"
                              v-sf.type
                              @select="change_type"></label-buttons>
           </div>
            <div class="mb-mini">
            <label-item label="申请编号：">
                <el-input
                        class="inline width-sm"
                        placeholder="请输入申请编号..."
                        v-sf.number
                        v-model="form.number"></el-input>
            </label-item>
            <label-item label="">
                <el-select class="inline s-width-mini ml-sm mr-xs"
                           v-sf.snType
                           v-model="form.snType">
                    <el-option v-for="item in optionList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
                <el-input class="inline"
                          v-sf.snText
                          :placeholder="`请输入${placeHolder}`"
                          v-model="form.snText"></el-input>
            </label-item>
            <label-item label="平台：" class="ml-sm">
                <el-select class="inline s-width-default"
                           v-sf.channel
                           v-model="form.channel">
                    <el-option v-for="item in options"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="站点：" class="ml-sm">
                <el-select :disabled="siteOptions.length<=1"
                           class="s-width-default"
                           filterable clearable
                           :placeholder="sitePlaceholder"
                           v-sf.site
                           v-model="form.site">
                    <el-option v-for="item in siteOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select class="inline s-width-default"
                           filterable clearable
                           :disabled="accountList.length<=1"
                           :placeholder="accountPlaceholder"
                           v-sf.account_id
                           v-model="form.account_id">
                    <el-option v-for="item in accountList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="销售员：" class="ml-sm">
                <param-account
                    class="inline s-width-default"
                    ref="paramSale"
                    placeholder="输入搜索更多..."
                    v-model="form.seller_id"
                    v-sf.seller_id
                    :param="{type:'sales',data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="memberShipSales"
                    url="get|user/:type/staffs">
                </param-account>
            </label-item>
            <label-item label="负责人：" class="ml-sm">
                <param-account
                    class="inline s-width-default"
                    ref="paramSale"
                    placeholder="输入搜索更多..."
                    v-model="form.functionary_id"
                    v-sf.functionary_id
                    :param="{type:'virtual',data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="virtual_fix_result"
                    type="memberShipVirtual"
                    url="get|virtual-order/principal-list">
                </param-account>
            </label-item>
            </div>
            <el-select class="inline s-width-small"
                       v-sf.date_type
                       v-model="form.date_type">
                <el-option v-for="item in dateTypeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value"></el-option>
            </el-select>
            <el-date-picker type="date"
                            placeholder="开始时间"
                            v-sf.date_start
                            v-model="form.date_start"
                            :picker-options="pickerStart"
                            class="inline date"></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date"
                            placeholder="结束时间"
                            v-sf.date_end
                            v-model="form.date_end"
                            :picker-options="pickerEnd"
                            class="inline date mr-sm"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    import {api_account_list} from '../../../api/scalp-task';
    export default {
        data() {
            return {
                optionList:[
                    {label:"SKU",value:"sku"},
                    {label:"SPU",value:"spu"},
                ],
                dateTypeList:[
                    {label:'计划时间',value:1},
                    {label:'申请时间',value:2},
                    {label:'完成时间',value:3}
                ],
                accountList:[{label:"",value:0}],
                siteOptions:[{label:"",value:""}],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.form.date_end){
                            return time.getTime()>this.form.date_end;
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.form.date_start){
                            return time.getTime()<this.form.date_start;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        computed:{
            sitePlaceholder(){
                if(this.form.channel<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if((this.form.site<=0&&this.accountList.length>1) || this.form.site>0){
                    return "请选择账号";
                }else if(this.form.site<=0){
                    return "请先选择站点";
                }else if(this.accountList.length<=1){
                    return "该站点下暂无账号";
                }
            },
            placeHolder(){
            	let find = this.optionList.find(res=>{
            		return res.value === this.form.snType;
                });
            	if(!!find){
            		return find.label;
                }
            }
        },
        watch:{
            "form.channel"(val){
                this.accountList = [{label:"",value:""}];
                this.siteOptions = [{label:"",value:""}];
                this.form.site = '';
                this.form.account_id = "";
                this.get_site(val);
            },
            'form.site'(val){
                this.accountList = [{label:"",value:""}];
                this.form.account_id = "";
                this.get_account(this.form.channel,val);
            }
        },
        methods:{
            change_status(index){
                this.form.status = this.buttonList[index].value;
                this.$emit("change-status",index);
            },
            change_type(index){
                this.form.type = this.typeList[index].value;
                this.$emit("change-status",index);
            },
            search(){
                this.$emit("search");
            },
            clearParams(){
                this.$emit("clearParams");
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            virtual_fix_result(val){
                return val.map(res=>{
                    return {
                        label:res.realname,
                        value:res.id
                    }

                });
            },
            get_site(channel_id){
                if(!channel_id)return;
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        if(res.account.length>0){
                            res = res.account;
                            this.accountList = [{label:"全部",value:""},...res];
                        }else{
                            this.accountList = [{label:"",value:""}];
                        }
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })

            },
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accountList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accountList = [{label:"全部",value:""},...res];
                    }else{
                        this.accountList = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            form:{},
            clears:{},
            options:{
                type:Array,
                required:true
            },
            buttonList:{
                type:Array,
                required:true
            },
            typeList:{
                type:Array,
                required:true
            }
        },
        components: {
            labelButtons:require('../../../components/label-buttons.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>
