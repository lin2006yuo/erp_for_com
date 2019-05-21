<template>
    <page-dialog title="添加折扣活动" v-model="show" size="large" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <div class="ml-sm">
            <label-item label="账号简称：" class="mr-sm required-sign">
                <param-account v-model="addEditForm.account_id"
                               type="shopeeAccount"
                               url="get|publish/shopee/accounts"
                               clearabled
                               :refresh="true"
                               :fixResult="fixAccount"
                               placeholder="全部"
                               class="mr-sm s-width-default">
                </param-account>
            </label-item>
            <label-item
                class="inline required-sign"
                label="折扣名称：">
                <el-input
                    v-model="addEditForm.discount_name"
                    @keyup.enter.native="id_enter">
                </el-input>
            </label-item>
            <label-item label="创建时间：" class="inline ml-sm">
                <el-date-picker v-model="addEditForm.start_time"
                                placeholder="开始时间"
                                :picker-options="pickerstart"
                                class="inline date"></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker v-model="addEditForm.end_time"
                                placeholder="结束时间"
                                :picker-options="pickerend"
                                class="inline date mr-sm"></el-date-picker>
            </label-item>
        </div>
        <div class="inline mt-sm mb-sm ml-sm">
            <el-button type="primary"
                       size="mini"
                       :disabled="addEditForm.account_id===''"
                       @click.native="add_commodity">添加商品
            </el-button>
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
                <tr v-for="(row,row_i) in addEditForm.discountData">
                    <td>
                        <el-checkbox v-model="row.isCheck"></el-checkbox>
                    </td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img :src="row.images[0]" style="vertical-align: middle;height:200px;width:200px"/>
                            <span slot="reference">
                                <img :src="row.images[0]" height="60px" width="60px" style="border:none">
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
        <add-commodity v-model="addCommodity" @select-add="selectAdd" :addthe-goods="addtheGoods"></add-commodity>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {url_delete_publish_shopee,api_delete_publish_shopee,api_batch_setting,api_shopee_discount} from '../../../../api/shopee-publish';
    export default{
        permission:{
            url_delete_publish_shopee
        },
        data(){
            return{
                curCurrency:'',
                addtheGoods:{
                    account_id:'',
                    discount_name:'',
                    start_time:'',
                    end_time:'',
                },
                mdfPrice:'',
                discountPrice:'',
                mdfQuantity:"",
                show:this.value,
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.addEditForm.end_time){
                            return  time.getTime() > this.addEditForm.end_time;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.addEditForm.start_time){
                            return time.getTime() < this.addEditForm.start_time;
                        }else {
                            return false
                        }

                    }
                },
                addCommodity:false,
            }
        },
        mounted(){

        },
        methods:{
            check_all(val){},
            batch_change(name,val){
                if(!val)return;
                let curData = this.addEditForm.discountData.filter(row=>!!row.isCheck);
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
            open(){},
            cloce(){},
            keep(){
            	if(this.addEditForm.account_id === ''){return this.$message({type: "warning", message: '请选择账号简称'})}
            	if(this.addEditForm.discount_name === ''){return this.$message({type: "warning", message: '请输入折扣名称'})}
                let datas =[];
                this.addEditForm.discountData.forEach(item=>{
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
                                account_id:this.addEditForm.account_id,
                                discount_name:this.addEditForm.discount_name,
                                start_time:this.addEditForm.start_time,
                                end_time:this.addEditForm.end_time,
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
                    this.$message({type: "success", message: res.message || res})
                    this.show = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            id_enter(){//------快速添加
                console.log('回车添加');
            },
            //获取账号列表
            fixAccount(res){
                return res.map(row=>{
                    return {
                        label:row.account_name,
                        value:row.account_id,
                    }
                })
            },
            add_commodity(){//------添加商品
                this.addtheGoods = {
                    account_id : this.addEditForm.account_id,
                    discount_name : this.addEditForm.discount_name,
                    start_time : this.addEditForm.start_time,
                    end_time : this.addEditForm.end_time,
                }
                this.addCommodity = true;
            },
            curDelete(row){//------删除
                let index = this.addEditForm.discountData.findIndex(res=>{return res.id===row.id});
                this.addEditForm.discountData.splice(index,1);
            },
            selectAdd (val){//----------------子组件添加商品传过来的
                val.forEach(row => {
                    this.curCurrency = row.currency;
                	if(this.addEditForm.discountData.length>0){
                        let find = this.addEditForm.discountData.find(res=>res.id === row.id);
                        if(!!find){
                            return this.$message({type: "warning", message: '当前数据已存在'})
                        }else {
                            row.variants.forEach(res=>{
                                this.$set(res,'promotion_price','');
                                this.$set(res,'discount_price','');
                                this.$set(res,'purchase_limit','');
                            });
                            this.$set(row,'isCheck',true);
                            this.addEditForm.discountData.push(row);
                        }
                        this.$message({type:'success',message:`添加成功`})
                    }else {
                        row.variants.forEach(res=>{
                            this.$set(res,'promotion_price','');
                            this.$set(res,'discount_price','');
                            this.$set(res,'purchase_limit','');
                        });
                        this.$set(row,'isCheck',true);
                        this.addEditForm.discountData.push(row);
                        this.$message({type:'success',message:`添加成功`})
                    }

                });
            },
            select_account(val){
                if(val === ''){
                    this.addEditForm.shop_id = '';
                    this.shopList = [];

                }else {
                    this.addEditForm.shop_id = '';
                    this.get_joom_store();
                }
            },
            get_joom_store(){
                this.$http('', {joom_account_id:this.addEditForm.account_id}).then(res => {
                    this.shopList = [{label: '全部', value: ''}, ...res.data];
                })
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
            		if(this.addEditForm.discountData.length>0){
                        return !this.addEditForm.discountData.find(row =>!row.isCheck);
                    }else{
                        return false
                    }
                },
                set(val){
                    this.addEditForm.discountData.forEach(row=>{
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
            addEditForm:{
            	type:Object,
                required:true
            }
        },
        components:{
            paramAccount:require("@/api-components/param-account.vue").default,
            pageDialog:require('../../../../components/page-dialog.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
            uiTip: require('../../../../components/ui-tip.vue').default,
            addCommodity:require('./add-commodity.vue').default,
            integerInput:require('../../../../components/integer-input.vue').default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
        }
    }
</script>
