<template>
    <div  class="p-express">
        <page-dialog title="编辑运费及Wish Express设置"    size="large"  v-model="show" :close-on-click-modal="false"  @change="change_dialog" @close="close" @open="open">
            <el-row class="mt-sm  mb-sm" v-if="tableData.product">
                <el-col :span="3">  <img :src="tableData.product.main_image"
                                         height="100" width="100" class="ml-lg"></el-col>
                <el-col :span="21">
                    <div> 产品名称：{{tableData.product.name}}</div>
                    <div class="mt-sm "><label-item label="国家：">
                        <order-input v-model="form.countries"
                                     class="inline width-super"
                                     @keydown="search"
                                     placeholder="可批量搜索，Shift+回车换行..."
                                     style="width: 170px"
                        ></order-input>
                    </label-item>
                        <label-item label="是否启用国家：" class="ml-xs ">
                            <el-select v-model="form.isUsing"
                                       class="width-xs"
                                       filterable clearable>
                                <el-option
                                        v-for="res in usingList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </label-item>
                        <label-item label="是否启用WE：" class="ml-xs ">
                            <el-select v-model="form.isWeUsing"
                                       class="width-xs"
                                       filterable clearable>
                                <el-option
                                        v-for="res in usingList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </label-item>
                        <label-item label="是否自定义运费：" class="ml-xs ">
                            <el-select v-model="form.usingFreight"
                                       class="width-xs"
                                       filterable clearable>
                                <el-option
                                        v-for="res in usingList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </label-item>
                        <el-button type="primary" size="mini" class="inline ml-sm" @click.native="search">搜索</el-button>
                        <el-button type="warning" size="mini" class="inline" @click.native="clear_search" >清空条件</el-button>
                    </div>
                    <div class=" mt-sm">
                        <div>
                            <label-item label="WE设置自动匹配：">
                                <el-select v-model="we_model" @change="change">
                                    <el-option v-for="item in modelList" :label="item.title" :value="item.id" :key="item.id" style="width: 175px" :title="item.title"></el-option>
                                </el-select>
                            </label-item>
                        </div>
                    </div>
                </el-col>

            </el-row>
            <table class="template">
                <tr>
                    <th>国家</th>
                    <th><label class="red">*</label>已启用的国家&nbsp;<el-checkbox v-model="country"></el-checkbox></th>
                    <th>Wish Express启用&nbsp;<el-checkbox v-model="status"></el-checkbox></th>
                    <th><label class="red">*</label>运费设置($)</th>
                    <th>&nbsp;</th>
                </tr>
                <tbody v-loading="loading" element-loading-text="玩命加载中..." >
                <tr v-for="item in newTableList">
                    <td>{{item.country}}({{item.country_code}})</td>
                    <td><el-checkbox v-model="item.enabled"  @change="change_start(item,$event)"></el-checkbox></td>
                    <td><el-checkbox v-model="item.wish_express" @change="change_wish_express(item)"></el-checkbox></td>
                    <td>
                        <el-row>
                            <el-col :span="12">
                                <el-select v-model="item.use_product_shipping" filterable clearable>
                                    <el-option label="使用产品配送运费" :value="1"> </el-option>
                                    <el-option label="自定义设置运费" :value="0"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="12">
                                <el-input v-model="item.shipping_price"
                                          :disabled="isClosed(item)"
                                          v-if="!item.use_product_shipping" :class="{error:item.err}"></el-input>
                            </el-col>
                        </el-row>
                    </td>
                    <td><span class='operate' @click="aplay(item)">应用到所有</span></td>
                </tr>

                </tbody>
            </table>
            <div slot="footer" class="dialog-footer">
                <!--<el-button size="mini" @click.native="keep_add" type="primary">保  存</el-button>-->
                <el-button size="mini" @click.native="keep_up" type="primary">保存并上传到平台</el-button>
                <el-button size="mini" @click.native="show=false">关   闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
.error{
    border:1px solid red;
}
</style>
<script>
    import {api_wish_express,api_wish_express_save,api_wish_express_save_now,api_wish_express_detail,api_get_express_list,api_get_wish_expressData} from "../../../../api/kandeng"
    export default{
        data(){
            return {
                modelList:[],
                newTableList:[],
                we_model:'',
                show:false,
                id:0,
                tableData:{},
                loading:true,
                form:{
                    countries:"",
                    isUsing:"",
                    isWeUsing:"",
                    usingFreight:"",
                },
                usingList:[
                    {label:"全部",value:""},
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
            }
        },
        created(){
            this.$http(api_get_express_list).then(res=>{
                res.data.forEach(row=>{
                    let transport_p = row.transport_property.split("、");
                    let title = `${row.name}+${transport_p}+$ ${row.from_price}-${row.to_price}`;
                    this.$set(row,'title',title)
                });
                this.modelList = res.data;
                this.modelList.unshift({title:'请选择',id:98765})
            })
        },
        mounted(){
        },
        computed: {
            // country:{
            //     get(){
            //         if (this.tableData.all_country_shipping){
            //             let sta=this.tableData.all_country_shipping.find(row =>!row.enabled);
            //             return !sta;
            //         }else {
            //             return false;
            //         }
            //     },
            //     set(val){
            //         this.tableData.all_country_shipping.forEach(row=>{
            //             row.enabled=val;
            //         })
            //     }
            // },
            country:{
                get(){
                    if(this.newTableList&&this.newTableList.length>0){
                        return this.get_start_using('country',this.newTableList);
                    }
                },
                set(val){
                    this.set_start_using('country',this.newTableList,val);
                },
            },
            status:{
                get(){
                    if (this.newTableList){
                        let sta=this.newTableList.find(row => !row.wish_express);
                        return !sta;
                    }else {
                        return false;
                    }
                },
                set(val){
                    this.newTableList.forEach(row=>{
                        row.wish_express=val;
                    })
                }
            },
        },
        methods: {
            change_wish_express(item){
                if(!!item.closed){
                    item.wish_express =false;
                }else {
                    if(item.wish_express){
                        if(item.closed){
                            item.closed = false;
                        }
                        if(!item.enabled){
                            item.enabled = true;
                        }
                    }
                    this.change_country(item);
                }
            },
            change_country(val){
                if(!val.enabled){
                    val.use_product_shipping = '';
                    val.shipping_price = 0;
                }else if(val.enabled&&val.use_product_shipping===''){
                    val.use_product_shipping = 1;
                }
            },
            change_start(item){
                if(!!item.closed){
                    item.enabled = false;
                }else{
                    if(item.enabled){
                        if(item.closed){
                            item.closed = false;
                        }
                    }
                    this.change_country(item);
                }
            },
            isClosed(item){
                if(item.closed){
                    item.use_product_shipping = '';
                    item.shipping_price = 0;
                }
                return item.closed;
            },
            get_start_using(name,Array){
                if(name==='country'){
                    let cur = Array.find(row=>!row.enabled);
                    return !cur;
                }else{
                    let cur = Array.find(row=>!row.wish_express);
                    return !cur;
                }
            },
            set_start_using(name,Array,val){
                if(name==='country'){
                    Array.forEach(row=>{
                        row.enabled = val;
                        if(row.enabled){
                            if(row.closed){
                                row.closed = false;
                                this.closedCountry = false;
                            }
                        }
                        this.change_country(row);
                    });
                }else{
                    Array.forEach(row=>{
                        row.wish_express = val;
                        if(row.wish_express){
                            if(!row.enabled){
                                row.enabled = true;
                            }
                            if(row.closed){
                                row.closed = false;
                                this.closedCountry = false;
                            }
                        }
                        this.change_country(row);
                    });
                }
            },
            change(val){
             if(val!==98765){
                 this.$http(api_wish_express_detail,{id:val}).then(res=>{
                     this.$nextTick(()=>{
                         this.newTableList.forEach(k=>{
                             k.closed = false;
                             k.enabled = false;
                             k.shipping_price = '';
                             if(res.all_country_shipping.some(row=>k.country_code===row.ProductCountryShipping.country_code)){
                                 let i = res.all_country_shipping.find(row2=>k.country_code===row2.ProductCountryShipping.country_code);
                                 k.enabled= i.ProductCountryShipping.enabled?true:false;
                                 k.use_product_shipping = i.ProductCountryShipping.use_product_shipping;
                                 k.closed = i.ProductCountryShipping.closed?true:false;
                                 if(!!i.ProductCountryShipping.closed){
                                     k.wish_express = false
                                 }else {
                                     k.wish_express = i.ProductCountryShipping.wish_express
                                 }
                                 if(typeof (i.ProductCountryShipping.shipping_price)==='number'){
                                     k.shipping_price = i.ProductCountryShipping.shipping_price
                                 }else {
                                     if(i.ProductCountryShipping.shipping_price.includes('Use')){
                                         k.shipping_price = 0
                                     }else {
                                         k.shipping_price = i.ProductCountryShipping.shipping_price
                                     }
                                 }
                             }
                         });
                         this.tableData.all_country_shipping = this.newTableList
                     })
                 })
             }else {
                 this.$http(api_get_wish_expressData).then(res=>{
                     this.newTableList = res
                 });
             }
            },
            search(){
                this.search_data();
            },
            clear_search(){
                this.form = {
                    countries:"",
                    isUsing:"",
                    isWeUsing:"",
                    usingFreight:"",
                };
                this.search_data();
            },
            open(){
                this.init_data()
            },
            close(){
                this.dialog=false;
                this.we_model=''
            },
            search_data(){
                let cur = {},table=[];
                let countries = [];
                if(this.form.countries){
                    countries = this.form.countries.split('\n').map(row=>row.trim());
                    cur.country=countries
                }
                this.form.isUsing!==""&&(cur.enabled= this.form.isUsing?true:false);
                this.form.usingFreight!==""&&(cur.use_product_shipping = this.form.usingFreight?0:1);//0表示自定义  1表示
                this.form.isWeUsing!==""&&(cur.wish_express= this.form.isWeUsing?true:false);
                this.newTableList = this.tables.filter(row=>{
                    return this.cale(row,cur)
                });
            },
            cale(row,obj){
                let flag=true;
                for(let i in obj){
                    if(typeof obj[i]==="object"){
//                        let a=obj[i].findIndex(item=> item===row[i]);
                        let a=obj[i].findIndex(item=>{
                            let curRow = row[i].toLowerCase();
                            let curItem = item.toLowerCase();
                            return curRow.includes(curItem)
                        });
                        if(a===-1){
                            flag=false;
                            break;
                        }
                    }else {
                        if(row[i]!==obj[i]){
                            flag=false;
                            break;
                        }
                    }
                }
                return flag
            },
            init_data(){
                this.isLoad = true;
                this.$http(api_get_wish_expressData).then(res=>{
                    this.newTableList=res;
                    this.isLoad = false;
                    this.tables = res.map(row=>{
                        row.enabled = row.enabled?true:false;
                        row.closed = row.closed?true:false;
                        row.wish_express = row.wish_express?true:false;
                        return row;
                    });
                }).catch(code=>{
                    this.isLoad = false;
                    this.$message({type:"error",message:code});
                })
            },
            aplay(item){
                this.newTableList.forEach(row=>{
                    if(!!row.enabled){
                        row.shipping_price=item.shipping_price;
                        row.use_product_shipping=item.use_product_shipping;
                    }else {
                        row.shipping_price=0
                    }

                })
            },
            get_data(){
                this.tableData={};
                this.loading=true;
                this.$http(api_wish_express,{product_id:this.id}).then(res=>{
                    res.data.all_country_shipping&&res.data.all_country_shipping.forEach(row=>{
                        row.enabled=row.enabled?true:false;
                        row.wish_express=row.wish_express?true:false;
                    });
                    this.tableData=res.data;
                    this.newTableList.forEach(k=>{
                        if(this.tableData.all_country_shipping.some(row=>k.country_code===row.country_code)){
                            let i = this.tableData.all_country_shipping.find(row2=>k.country_code===row2.country_code);
                            k.enabled= i.enabled?true:false;
                            k.use_product_shipping = i.use_product_shipping;
                            k.closed = i.closed?true:false;
                            k.wish_express = i.wish_express;
                            if(typeof (i.shipping_price)==='number'){
                                k.shipping_price = i.shipping_price
                            }else {
                                if(i.shipping_price.includes('Use')){
                                    k.shipping_price = 0
                                }else {
                                    k.shipping_price = i.shipping_price
                                }
                            }
                            //console.log(k,'kkk')
                        }
                    });
                    this.loading=false;
                }).catch(code=>{
                    this.loading=false;
                    this.$message({type:"error",message:code.message||code});
                })
            },
            keep_add(){
                if(!this.add_params())return;
                let all_country_shipping = this.add_params();
                if(all_country_shipping.length<=0) return this.$message({type:"warning",message:"请至少填写一条完整的数据！"});
                this.$http(api_wish_express_save,{all_country_shipping,product_id:this.id,uid:10}).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.show=false;
                }).catch(code=>{
                    this.newTableList.forEach(row=>{
                        if(code.error.some(row1=>row1===row.country_code)){
                            this.$set(row,'err',true)
                        }
                    });
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            add_params(){
                let curObj = this.newTableList.find(row=>{return (!!row.enabled&&row.use_product_shipping==='')||(!row.enabled&&row.use_product_shipping!=='')});
                if(curObj)return this.$message({type:"warning",message:"数据有必填项未补充完整!"});
                let all_country_shipping=window.clone(this.newTableList).filter(res=>!!res.enabled&&res.use_product_shipping!=='');
                all_country_shipping.forEach(row=>{
                    row.enabled=row.enabled?1:0;
                    row.wish_express=row.wish_express?1:0;
                    if(row.use_product_shipping){
                        delete row.shipping_price
                    }
                });
                return all_country_shipping;
            },
            keep_up(){
                if(!this.add_params())return;
                let all_country_shipping = this.add_params();
                if(all_country_shipping.length<=0) return this.$message({type:"warning",message:"请至少填写一条完整的数据！"});
                this.$http(api_wish_express_save_now,{all_country_shipping,product_id:this.id,uid:10}).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                    this.newTableList.forEach(row=>{
                        if(code.error.some(row1=>row1===row.country_code)){
                            this.$set(row,'err',true)
                        }
                    });
                })

            },
            change_dialog(val){
                if(val){
                    this.get_data();
                }
            }
        },
        filters: {},
        watch: {
            show(val){
                this.$emit("input", val)
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            value:{}
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            labelItem:require('@/components/label-item.vue').default,
            orderInput:require('@/components/order-input.vue').default,
        }
    }
</script>