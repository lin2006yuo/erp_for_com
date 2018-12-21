<template>
    <page-dialog v-model="show" size="large" @open="open"
                 title="批量修改一口价和数量" :close-on-click-modal="false">
        <el-row>
            <el-col :span="8" class="text-right">
                <label>
                    <el-checkbox v-model="checked_price">修改一口价：</el-checkbox>
                </label>
            </el-col>
            <el-col :span="16">
                <el-select v-model="price.select"
                           :disabled="!checked_price"
                           class="inline mb-mini"
                           style="width:120px">
                    <el-option v-for="item in priceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <ui-limit-number v-model="price.changePrice"
                                 :limit="2" :nagetive="true"
                                 :disabled="checked_price&&price.select ? false : true"
                                 placeholder="如果减少，可以输入负数"
                                 class="inline mb-mini"
                                 style="width:160px"
                ></ui-limit-number>
                <span v-if="price.select==='2'">%</span>
            </el-col>
        </el-row>
        <el-row class="mb-xs">
            <el-col :span="8" class="text-right">
                <label>
                    <el-checkbox v-model="checked_num">修改可售量：</el-checkbox>
                </label>
            </el-col>
            <el-col :span="16">
                <integer-input v-model="price.changeQuantity" :min="0"
                               class="inline"
                               style="width:120px"
                               :disabled="!checked_num"
                ></integer-input>
            </el-col>
        </el-row>
        <el-row class="mb-xs" v-if="ebayStatus==='already'">
            <el-col :span="8" class="text-right">
                定时提交修改：
            </el-col>
            <el-col :span="16">
                <el-date-picker
                    v-model="price.cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row v-if="ebayStatus==='already'">
            <el-col :span="8" class="text-right">
                修改备注：
            </el-col>
            <el-col :span="16">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:50%"
                    placeholder="请输入内容"
                    v-model="price.remark">
                </el-input>
            </el-col>
        </el-row>
        <div class="fr">
            <el-button @click="look" type="primary" size="mini">预览</el-button>
        </div>
        <table class="template">
            <tr>
                <th><el-checkbox v-model="checkAll" @change="head_check"></el-checkbox></th>
                <th>商品ID</th>
                <th>平台sku</th>
                <th>一口价</th>
                <th>可售量</th>
            </tr>
            <!--<tr v-for="row in showTables" :key="row.sku" @click="row_click(row)">-->
            <tr v-for="row in showTables" :key="row.sku">
                <td>
                    <el-checkbox v-model="row.isCheck" @change="(event)=>{row_click(row,event)}"></el-checkbox>
                </td>
                <td>
                    <ui-tip :content="row.item_id" :width="98" v-if="ebayStatus==='already'"></ui-tip>
                    <ui-tip :content="row.good_id" :width="98" v-else></ui-tip>
                </td>
                <td>
                    <ui-tip :content="row.sku" :width="95"></ui-tip>
                </td>
                <td>
                    <!--<ui-limit-number v-model="row.price" :limit="2" :nagetive="true"-->
                                     <!--style="width:100px" class="inline"></ui-limit-number>-->
                    <el-input v-model="row.price" style="width:100px" class="inline"></el-input>
                </td>
                <td>
                    <integer-input v-model="row.quantity" :min="0"
                                   class="inline"
                                   style="width:100px"></integer-input>
                </td>
            </tr>
        </table>
        <div slot="footer" class="dialog-footer">
            <request-button size="mini" @click="keep" req-key="actionPrice"
                            v-if="ebayStatus==='already'">保存待同步平台</request-button>
            <request-button @click="keep" req-key="actionPrice" v-else>确定</request-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .text-right{
        text-align: right;
        padding-right:5px;
    }
</style>
<script>
    import {api_edit_ebay_product_price_quantity} from "../../../../../api/ebay-kandeng-operated"
    import {api_up_price_qty,api_ebay_variations} from "../../../../../api/ebay-kandeng-public-module"
    export default{
        data(){
            return{
                show:this.value,
                price:{
                    select:"",
                    changePrice:"",
                    changeQuantity:"",
                    cron_time:"",
                    remark:"",
                },
                priceList:[
                    {label:"按金额添加",value:'1'},
                    {label:"按涨幅添加",value:'2'},
                    {label:"统一修改为",value:'3'},
                ],
                showTables:[],
                checked_price:false,
                checked_num:false,
                selectArr:[],
                checkAll:false,
            }
        },
        methods:{
            open(){
                this.checked_num = false;
                this.checked_price = false;
                this.checkAll = false;
                this.selectArr =[];
                this.showTables =[];
                this.init();
            },
            look(){
            	if(!this.selectArr.length){
            		this.$message({type:"warning",message: "请先勾选要操作的数据"});
            		return ;
                }
                this.change_price();
                this.change_quantity();
            },
            row_click(row,event){
            	if(event){
                    row.isCheck = event.target.checked
                }else{
                    row.isCheck = !row.isCheck;
                }
                this.operate_arr();
            	let flag = true;
                this.showTables.forEach(it=>{
                	if(!it.isCheck){
                		flag = false;
                		return ;
                    }
                })
                this.checkAll = flag;
            },
            head_check(){
                this.showTables.forEach(row=>{
                    row.isCheck=this.checkAll;
                });
                this.operate_arr();
            },
            operate_arr(){
            	this.selectArr = this.showTables.filter(row=>row.isCheck);
            },
            init(){
                this.price = {
                    select:"",
                    changePrice:"",
                    changeQuantity:"",
                    cron_time:"",
                    remark:"",
                };
                this.showTables = [];
                this.get_variations();
            },
            get_variations(){
                let ids=this.selectIds.map(x=>x.id);
                this.$http(api_ebay_variations,{ids:ids.join(",")}).then(res=>{
                    res.data.forEach(it=>{
                        let find = this.selectIds.find(row=> {return Number(row.id)===Number(it.listing_id)});
                        if(find){
                            it.varians.forEach(va=>{
                                !!va.variation&&(va.variation=JSON.parse(va.variation));
                            });
                            this.$set(find,"varians",it.varians);
                            this.$set(find,"v_varkey",it.v_varkey);
                        }
                    });
                    this.selectIds.forEach(row=>{
                        if(row.varians&&row.varians.length!==0){
                            row.varians.forEach(sku => {
                                let obj = {
                                    account_id:row.account_id,
                                    good_id:row.goods_id,
                                    sku: sku.channel_map_code,
                                    price: sku.v_price,
                                    quantity: sku.v_qty || 0,
                                    item_id: row.item_id,
                                    id:row.id,
                                    site:row.site,
                                    old_price: sku.v_price,
                                    old_quantity: sku.v_qty || 0,
                                    isCheck:false,
                                };
                                let find=this.showTables.find(it=>{
                                	return it.sku ===sku.channel_map_code;
                                })
                                !find&&this.showTables.push(obj)
                            })
                        } else {
                            let obj = {
                                account_id:row.account_id,
                                good_id:row.goods_id,
                                sku: row.listing_sku,
                                price: row.start_price,
                                quantity: row.quantity || 0,
                                item_id: row.item_id,
                                id:row.id,
                                site:row.site,
                                old_price: row.start_price,
                                old_quantity: row.quantity || 0,
                                isCheck:false,
                            };
                            let find=this.showTables.find(it=>{
                                return it.sku ===row.listing_sku;
                            })
                            !find&&this.showTables.push(obj);
                        }
                    })
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            change_price(){
            	if(this.checked_price){
                    this.price.changePrice = Number(this.price.changePrice).toFixed(2);
                    this.selectArr.forEach(it=>{
                    	let find = this.showTables.find(row=>{
                    		return row.sku===it.sku;
                        })
                        if(find){
                            switch (this.price.select){
                                case "1":
                                    find.price = (Number(find.price)+Number(this.price.changePrice)).toFixed(2);
                                    break;
                                case "2":
                                    find.price = (Number(find.price)*(1+Number(this.price.changePrice)/100)).toFixed(2);
                                    break;
                                case "3":
                                    find.price = this.price.changePrice;
                                    break;
                                default:
                                    break;
                            }
                        }
                    })
                }
            },
            change_quantity(){
            	if(this.checked_num){
                    this.selectArr.forEach(it=>{
                        let find = this.showTables.find(row=>{
                            return row.sku===it.sku;
                        })
                        find&&(find.quantity = Number(this.price.changeQuantity));
                    });
                }
            },
            //保存修改一口价和数量
            keep(){
                if(this.price.cron_time && this.price.cron_time instanceof Object){
                    this.price.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.price.cron_time/1000);
                }else if(!this.price.cron_time){
                    this.price.cron_time = "";
                }
                let data = this.showTables.map(row=>{
                    let data_row={};
                    if(this.ebayStatus==='already'){
                        data_row = {
                            item_id:row.item_id,
                            site:row.site,
                            start_price:Number(row.price),
                            old_start_price:row.old_price,
                            quantity:row.quantity,
                            old_quantity:row.old_quantity,
                            account_id:row.account_id,
                            listing_sku:row.sku,
                            cron_time:this.price.cron_time,
                            remark:this.price.remark,
                        };
                    }else{
                        data_row = {
                            id:row.id,
                            start_price:Number(row.price),
                            quantity:row.quantity,
                            listing_sku:row.sku,
                        };
                    }
                    return data_row;
                });
                if(this.ebayStatus==='already'){
                    this.operate_ajax(api_up_price_qty,data);
                } else {
                    this.operate_ajax(api_edit_ebay_product_price_quantity,data);
                }
            },
            operate_ajax(api,data){
                this.$http(api,{data:data}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    this.$reqKey('actionPrice',false)
                });
            },
            close(){
                this.show=false;
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
        props:{
            value:{
                required:true,
            },
            selectIds:{},
            ebayStatus:{
                required:true,
                type:String,
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            integerInput:require("../../../../../components/integer-input.vue").default,
        }
    }
</script>
