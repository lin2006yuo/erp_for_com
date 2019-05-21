<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <div class="mb-sm">
            <el-form :model="form">
                <el-col :span="5">
                    <label-item label="选择折扣名称：" label-width="100" required>
                        <el-select v-model="form.account_id" class="width-sm" @change="change_discount">
                            <el-option v-for="(item, index) in discountList"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </label-item>
                </el-col>
                <el-col :span="4">
                    <label :span="4" class="inline text-right ml-sm mt-xs">账号简称：{{thecode}}</label>
                </el-col>
            </el-form>
            <label :span="6" class="inline text-right mt-xs">有效期：
                <times class="inline mb-xs" :time="form.start_time"></times>
                <times class="inline mb-xs" :time="form.end_time"></times>
            </label>
        </div>
        <table class="template">
            <tr>
                <th style="width:45px"></th>
                <th style="min-width:90px">图片</th>
                <th style="min-width:90px">刊登标题</th>
                <th style="min-width:90px">平台SKU</th>
                <th style="min-width:90px">原销售价{{curCurrency}}</th>
                <th style="min-width:90px">折后价{{curCurrency}}</th>
                <th style="min-width:90px">折扣%</th>
                <th style="min-width:90px">限制购买</th>
                <th width="50px">操作</th>
            </tr>
            <tbody>
            <tr>
                <th>
                    <el-checkbox v-model="checkAll" @change="check_all"></el-checkbox>
                </th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <!-- 折后价 -->
                <th>
                    <ui-limit-number
                        v-model="mdfPrice"
                        @blur="batch_change('mdfPrice',mdfPrice)"
                        :limit="2"></ui-limit-number>
                </th>
                <!-- 折扣% -->
                <th>
                    <ui-limit-number
                        v-model="discountPrice"
                        @blur="batch_change('discountPrice',discountPrice)"
                        :limit="2"></ui-limit-number>
                </th>
                <!-- 限制购买 -->
                <th>
                    <integer-input
                        v-model="mdfQuantity"
                        :min="1"
                        @blur="batch_change('mdfQuantity',mdfQuantity)"></integer-input>
                </th>
                <th></th>
            </tr>
            <tr v-for="(row,row_i) in form.lists">
                <td>
                    <el-checkbox v-model="row.isCheck"></el-checkbox>
                </td>
                <td>
                    <el-popover placement="right" trigger="hover">
                        <img v-lazy="main_img(row.images,200)"
                             @click="search_img(row.images)"
                             width="200px" height="200px">
                        <span slot="reference">
                                <img v-lazy="main_img(row.images,100)"
                                     @click="search_img(row.images)"
                                     height="60px" width="60px" style="border:none">
                            </span>
                    </el-popover>
                </td>
                <td><span>{{row.name}}</span></td>
                <td>
                    <div class="mb-xs mt-xs" v-for="(item,index) in row.variants" :key="index">
                        <span>{{item.variation_sku}}</span>
                    </div>
                </td>
                <!-- 原销售价 -->
                <td>
                    <div class="mb-xs mt-xs" v-for="(item,index) in row.variants" :key="index">
                        <span>{{item.price}}</span>
                    </div>

                </td>
                <!-- 折后价 -->
                <td>
                    <div v-for="(item,index) in row.variants" :key="index">
                        <ui-limit-number v-model="item.promotion_price" :limit="2" @blur="blur_price(item)"></ui-limit-number>
                    </div>
                </td>
                <!-- 折扣% -->
                <td>
                    <div v-for="(item,index) in row.variants" :key="index">
                        <ui-limit-number v-model="item.discount_price" :limit="2" @blur="blur_discount(item)"></ui-limit-number>
                    </div>
                </td>
                <!-- 数量 -->
                <td>
                    <div v-for="(item,index) in row.variants" :key="index">
                        <el-input v-model="item.purchase_limit" class="inline"></el-input>
                    </div>
                </td>
                <!-- 删除 -->
                <td>
                    <span class="operate" @click="curDelete(row)">删除</span>
                </td>
            </tr>
            </tbody>
        </table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import  {api_logistics_shopee,api_shopee_discount,api_batch_setting} from "../../../../api/shopee-publish"
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        data(){
            return{
                show:this.value,
                discountList:[],
                form:{
                    account_id:'',
                    end_time:'',
                    start_time:'',
                    lists:[]
                },
                discount_name:'',
                mdfPrice:'',
                discountPrice:'',
                mdfQuantity:"",
                curCurrency:'',
            }
        },
        methods:{
            batch_change(name,val){
                if(!val)return;
                let curData = this.form.lists.filter(row=>!!row.isCheck);
                switch(name){
                    case 'mdfPrice':
                        curData.forEach(row=>{
                            row.variants.forEach(res=>{
                                res.promotion_price = val;
                                res.discount_price = (Number(res.promotion_price)/Number(res.price)).toFixed(2)
                            })
                        });
                        this.mdfPrice = '';
                        break;
                    case 'discountPrice':
                        curData.forEach(row=>{
                            row.variants.forEach(res=>{
                                res.discount_price = Number(val);
                                res.promotion_price = (Number(res.price)*Number(res.discount_price)).toFixed(2)
                            })
                        });
                        this.discountPrice = '';
                        break;
                    case 'mdfQuantity':
                        curData.forEach(row=>{
                            row.variants.forEach(res=>{
                                res.purchase_limit = Number(val);
                            })
                        });
                        this.mdfQuantity = '';
                        break;
                }
            },
            blur_price(res){
                if(res.promotion_price === '')return
                res.discount_price =  (Number(res.promotion_price)/Number(res.price)).toFixed(2)

            },
            blur_discount(res){
                if(res.discount_price === '')return
                res.promotion_price = (Number(res.price)*Number(res.discount_price)).toFixed(2)
            },
            change_discount(val){
                let find = this.discountList.find(row=>row.value===val);
                if(find){
                    this.$set(this.form,'end_time',find.end_time);
                    this.$set(this.form,'start_time',find.start_time);
                }
            },
            open(){
                this.getList();
                this.dataList();
            },
            getList(){ //------获取折扣名称、有效期
                let list = this.selectedIds.map(row=>{
                    return row.account_id
                });
                list =[...new Set(list)];
                let params = {
                    account_id:list[0]
                };
                this.$http(api_shopee_discount,params).then(res=>{
                    this.discountList = res.data.map(row=>{
                        return {
                            label:row.discount_name,
                            value:row.discount_id,
                            end_time:row.end_time,
                            start_time:row.start_time,

                        }
                    });
                });
            },
            dataList(){
                this.form.lists = clone(this.selectedIds);
                this.form.lists.forEach(row=>{
                    this.curCurrency = row.currency;
                    if(this.form.lists.length>0){
                        row.variants.forEach(res=>{
                            this.$set(res,'promotion_price','');
                            this.$set(res,'discount_price','');
                            this.$set(res,'purchase_limit','');
                        });
                        this.$set(row,'isCheck',true);
                    }
                });
            },
            search_img(image,base_url){
                this.imgPath = this.main_img(image,500,base_url);
                this.imgDialog = true;
            },
            get_path,
            main_img(image,size,base_url){
                if(image.includes('http')){
                    if(size===500){
                        return image;
                    }
                    if(image.includes('original')){
                        return image.replace('_original.',`_${size}_${size}.`);
                    }
                }
                return this.get_path(image,`_${size}x${size}.`, base_url||this.baseUrl);
            },
            check_all(val){},
            curDelete(row){//------删除
                let index = this.form.lists.findIndex(res=>{return res.id===row.id});
                this.form.lists.splice(index,1);
            },
            cloce(){},
            keep(){
                if(this.form.account_id === ''){return this.$message({type: "warning", message: '请选择账号简称'})}
            	let datas = [];
            	this.form.lists.forEach(item=>{
                    let dataTable = [];
                    if(item.variants.length>0){
                        item.variants.forEach(row=>{
                            this.$set(row,'item_id',item.item_id);
                        });
                        let itemList = item.variants.map(res=>{
                            return {
                                item_id:res.item_id,
                                promotion_price:res.promotion_price,
                                purchase_limit:res.purchase_limit,
                                variation_id:res.variation_id,
                                account_id:this.form.account_id,
                                start_time:this.form.start_time,
                                end_time:this.form.end_time,
                            }
                        });
                        dataTable = [...itemList];
                    }else{
                        let account = {
                            item_id:item.item_id,
                        };
                        dataTable = [account];
                    }
                    datas = [...datas,...dataTable];
                });
                let params = {
                    field:'discount_id',
                    data:datas
                }
                this.$http(api_batch_setting,params).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    this.show=false;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            selected(){

            },
            selectedAll(){

            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        computed:{
            checkAll:{
                get(){
                    if(this.form.lists.length>0){
                        return !this.form.lists.find(row =>!row.isCheck);
                    }else{
                        return false
                    }
                },
                set(val){
                    this.form.lists.forEach(row=>{
                        this.$set(row,'isCheck',val);
                    });
                },
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
            	required:true,
                type:String
            },
            selectedIds:{
            	required:true,
            	type:Array
            },
            thecode:{
                type:String
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
            integerInput:require('../../../../components/integer-input.vue').default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
        }
    }
</script>
