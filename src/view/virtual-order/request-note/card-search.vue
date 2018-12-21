<template>
    <div class="c-card-search">
        <search-card :params = "form" :clears ="clears" @enter="search" @search="search" @clearParams="clearParams">
           <div>
               <label-buttons label="状态："
                              :buttons="buttonList"
                              v-sf.status
                              @select="change_status"></label-buttons>
           </div>
            <div class="mb-mini">
                <label-item label="编号：">
                    <el-input
                            class="inline width-sm"
                            placeholder="请输入编号..."
                            v-sf.number
                            v-model="form.number"></el-input>
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
                <label-item label="站点：" class="ml-xs">
                    <el-select :disabled="siteList.length<=1"
                               class="inline s-width-default"
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               v-sf.site
                               v-model="form.site">
                        <el-option v-for="item in siteList"
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
                               :placeholder="accountHolder"
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
                <label-item label="操作人：" class="ml-sm">
                    <param-account
                            class="inline s-width-default"
                            ref="paramSale"
                            placeholder="输入搜索更多..."
                            v-model="form.operator_id"
                            v-sf.operator_id
                            :param="{type:'virtual',data:{content:''}}"
                            :fixUrl="true"
                            :fixResult="virtual_fix_result"
                            type="memberShipVirtual"
                            url="get|user/:type/staffs">
                    </param-account>
                </label-item>
            </div>
            <label-item label="">
                <el-select class="inline s-width-mini mr-xs"
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
            <div class="inline ml-sm">
                    <label>申请时间：</label>
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
                </div>
        </search-card>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    import {api_account_list} from '../../../api/request-note';
    export default {
        data() {
            return {
                optionList:[
                    {label:"SKU",value:"sku"},
                    {label:"SPU",value:"spu"},
                ],
                accountList:[{label:"",value:0}],
                siteList:[{label:"",value:""}],
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
                }else if(this.siteList.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountHolder(){
                if(!this.form.channel){
                    return "请先选择平台";
                }else if(this.form.channel&&this.accountList.length<=0){
                    return "该平台下暂无数据";
                }else{
                    return "请选择账号";
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
                this.form.account = "";
            },
//            "form.number"(){
//                this.form.snText="";
//            },
            "form.channel"(val){
                this.siteList = [{label:"",value:""}];
                this.accountList = [{label:"",value:""}];
                this.form.account_id = "";
                this.form.site = '';
                this.get_site(val);
                this.get_account(val);
            },
        },
        methods:{
            change_status(index){
                this.form.status = this.buttonList[index].value;
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
                if(!channel_id)return this.siteList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        this.siteList = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteList = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id){
                if(!channel_id)return;
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    this.accountList = [{label:"全部",value:""},...res.account];
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
        },
        components: {
            labelButtons:require('../../../components/label-buttons.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>
