<template>
    <div class="c-batch-we">
        <page-dialog
                @change="change_dialog"
                title="批量编辑运费及Wish Express设置"
                @open="open"
                v-model="dialog"
                size="large"
                @close="close"
                :close-on-click-modal="false">
            <div class="mt-xs">
                <label-item label="国家：">
                    <order-input v-model="form.countries"
                                 class="inline width-super"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行..."></order-input>
                </label-item>
                <label-item label="是否启用国家：" class="ml-sm">
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
                <label-item label="是否启用WE：" class="ml-sm">
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
                <label-item label="是否自定义运费：" class="ml-sm">
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
                <el-button type="warning" size="mini" class="inline" @click.native="clear_search">清空条件</el-button>
                <!--</el-card>-->
            </div>
            <div class="mt-sm">
                <label-item label="WE设置自动匹配：">
                    <el-select v-model="we_model" @change="change">
                        <el-option v-for="item in modelList" :label="item.title" :value="item.id" :key="item.id" style="width: 175px" :title="item.title"></el-option>
                    </el-select>
                </label-item>
            </div>
            <table class="template mt-sm">
                <tr>
                    <th>国家</th>
                    <th>启用国家&nbsp;<el-checkbox v-model="country"></el-checkbox></th>
                    <th>屏蔽国家&nbsp;<el-checkbox v-model="closedCountry"></el-checkbox></th>
                    <th>Wish Express&nbsp;<el-checkbox v-model="status"></el-checkbox></th>
                    <th><span class="red">*</span>运费设置</th>
                    <th>操作</th>
                </tr>
                <tbody  v-loading="isLoad" element-loading-text="玩命加载中...">
                <template v-for="item in newTableList">
                    <tr>
                        <td>
                            <span v-copy>{{item.country}}</span>
                            <span>({{item.country_code}})</span>
                        </td>
                        <td>
                            <el-checkbox v-model="item.enabled"
                                         @change="change_start(item,$event)"></el-checkbox>
                        </td>
                        <td>
                            <el-checkbox v-model="item.closed"
                                         @change="change_shield(item)"></el-checkbox>
                        </td>
                        <td>
                            <el-checkbox v-model="item.wish_express"
                                         @change="change_wish_express(item)"></el-checkbox>
                        </td>
                        <td width="35%">
                            <el-row>
                                <el-col :span="12">
                                    <el-select :disabled="isClosed(item)" v-model="item.use_product_shipping">
                                        <el-option label="使用产品配送运费" :value="1"> </el-option>
                                        <el-option label="自定义设置运费" :value="0"></el-option>
                                        <el-option label="原价基础上加运费" :value="2"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="12">
                                    <el-input v-model="item.shipping_price"
                                              :disabled="isClosed(item)"
                                              v-if="item.use_product_shipping!==1"></el-input>
                                </el-col>
                            </el-row>
                        </td>
                        <td><span class='operate' @click="aplay(item)">应用到所有</span></td>
                    </tr>
                </template>
                </tbody>
            </table>
            <div slot="footer">
                <request-button :mintime="200" req-key="save_batch_we" class="inline" :request="save">确定</request-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-batch-we{
    .custom-card{
        overflow:auto
    }
    }
</style>
<script>
    import {api_get_wish_expressData,api_setting_wish_express,api_get_express_list,api_wish_express_detail} from '../../../../../api/kandeng';
    export default {
        data() {
            return {
                cloneData:[],
                we_model:'',
                modelList:[],
                dialog:this.value,
                isLoad:false,
                newTableList:[],
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
                closedCountry:false
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
            closedCountry(val){
                this.newTableList.forEach(row=>{
                    row.closed = val;
                    if(val){
                        row.enabled = false;
                        row.wish_express = false;
                    }
                });
            }
        },
        created(){
            this.$http(api_get_express_list).then(res=>{
                res.data.forEach(row=>{
                    let transport_p = row.transport_property.split("、");
                    let title = `${row.name}+${transport_p}+$ ${row.from_price}-${row.to_price}`;
                    this.$set(row,'title',title)
                });
                this.modelList = res.data
                this.modelList.unshift({title:'请选择',id:98765})
            })
        },
        computed:{
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
                    if(this.newTableList&&this.newTableList.length>0){
                        return this.get_start_using('status',this.newTableList);
                    }
                },
                set(val){
                    this.set_start_using('status',this.newTableList,val);
                },
            },
        },
        methods:{
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
                        })
                    })
                }else {
                    this.$http(api_get_wish_expressData).then(res=>{
                        this.newTableList = res
                    });
                }
            },
            isClosed(item){
                if(item.closed){
                    item.use_product_shipping = '';
                    item.shipping_price = 0;
                }
                return item.closed;
            },
            open(){
                this.form = {
                    countries:"",
                    isUsing:"",
                    isWeUsing:"",
                    usingFreight:"",
                }
            },
            close(){
                this.dialog=false;
                this.we_model=''
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
                if(item.enabled){
                    if(item.closed){
                        item.closed = false;
                    }
                }
                this.change_country(item);
            },
            change_shield(item){
                if(item.closed){
                    if(item.enabled){
                        item.enabled = false;
                    }
                    if(item.wish_express){
                        item.wish_express = false;
                    }
                }
                this.change_country(item);
            },
            change_wish_express(item){
                //item.wish_express = !item.wish_express;
                if(item.wish_express){
                    if(item.closed){
                        item.closed = false;
                    }
                    if(!item.enabled){
                        item.enabled = true;
                    }
                }
                this.change_country(item);
            },
            change_dialog(val){
                if(val)this.init_data();
            },
            add_params(){
                let curObj = this.newTableList.find(row=>{return (!!row.enabled&&row.use_product_shipping==='')||(!row.enabled&&row.use_product_shipping!=='')});
                if(curObj)return this.$message({type:"warning",message:"数据有必填项未补充完整!"});
                let all_country_shipping = window.clone(this.newTableList).filter(res=>(!!res.enabled&&res.use_product_shipping!=='')||res.closed);
                all_country_shipping.forEach(row=>{
                    row.enabled=row.enabled?1:0;
                    row.wish_express=row.wish_express?1:0;
                    row.closed = row.closed?1:0;
                    if(row.use_product_shipping===1){
                        delete row.shipping_price
                    }
                });
                return all_country_shipping;
            },
            save(){
                if(!this.add_params())return;
                let all_country_shipping =  this.add_params();
                if(all_country_shipping.length<=0){
                    this.$reqKey('save_batch_we',false);
                    return this.$message({type:"warning",message:"请至少填写一条完整的数据"});
                }
                let productId = this.productId.join(';');
                return this.$http(api_setting_wish_express,{all_country_shipping,product_ids:productId}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.dialog = false;
                    if(res.error.length!==0){
                        this.$emit('req-err',res.error);
                    }
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code})
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('save_batch_we',false);
                    },200);
                });
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
            init_data(){
                this.isLoad = true;
                this.$http(api_get_wish_expressData).then(res=>{
                    this.cloneData = JSON.parse(JSON.stringify(res));
                    this.tables = res.map(row=>{
                        row.enabled = row.enabled?true:false;
                        row.closed = row.closed?true:false;
                        row.wish_express = row.wish_express?true:false;
                        return row;
                    });
                    this.search_data();
                    this.isLoad = false;
                }).catch(code=>{
                    this.isLoad = false;
                    this.$message({type:"error",message:code});
                })
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
            //应用到所有
            aplay(item){
                if(!item.enabled)return;
                this.newTableList.forEach(row=>{
                    if(!!row.enabled){
                        row.shipping_price=item.shipping_price;
                        row.use_product_shipping=item.use_product_shipping;
                    }else {
                        row.shipping_price=0
                    }
                })
            },
        },
        props:{
            value:{},
            productId:{
                require:true
            }
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            orderInput:require('../../../../../components/order-input.vue').default,
            labelItem:require('../../../../../components/label-item.vue').default,
            uiTable:require('../../../../../components/ui-table.vue').default,
        }
    }
</script>
