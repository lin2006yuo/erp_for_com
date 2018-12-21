<template>
    <page-dialog v-model="show" size="large" title="修改拍卖价"
                 @open="open"
                 :close-on-click-modal="false">
        <el-row>
            <el-col :span="3" class="text-right">
                <label>批量修改范围：</label>
            </el-col>
            <el-col :span="21">
                <el-row class="mb-xs">
                    <el-radio class="radio" v-model="auction.select" label="1">按金额增加</el-radio>
                    <ui-limit-number style="width:100px" class="inline" v-model="auction.add" :nagetive=true :disabled="!(auction.select&&auction.select==='1')" :limit="2" @blur="blur_add()"></ui-limit-number>
                    <span>小提示：如果减少，可以为负数</span>
                </el-row>
                <el-row class="mb-xs">
                    <el-radio class="radio" v-model="auction.select" label="2">按涨幅增加</el-radio>
                    <ui-limit-number style="width:100px" class="inline" v-model="auction.up" :nagetive=true :disabled="!(auction.select&&auction.select==='2')" :limit="2" @blur="blur_up()"></ui-limit-number>%
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb-xs">
            <el-col :span="3" class="text-right">
                <label><i class="c-r">*</i>批量修改方式：</label>
            </el-col>
            <el-col :span="21">
                <el-checkbox v-model="auction.lowest">拍卖底价</el-checkbox>
                <el-checkbox v-model="auction.reserve">保底拍卖价</el-checkbox>
                <el-checkbox v-model="auction.once">一口价</el-checkbox>
            </el-col>
        </el-row>
        <el-row class="mb-xs" v-if="ebayStatus==='already'">
            <el-col :span="3" class="text-right">
                定时提交修改：
            </el-col>
            <el-col :span="21">
                <el-date-picker
                    v-model="auction.cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row v-if="ebayStatus==='already'">
            <el-col :span="3" class="text-right">
                修改备注：
            </el-col>
            <el-col :span="21">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="auction.remark">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-button size="mini"
                       @click.native="look_auction_price"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </el-row>
        <el-table
            :data="showTables"
            style="width: 100%">
            <el-table-column label="商品ID" inline-template>
                <span>{{ row.item_id ? row.item_id : row.id }}</span>
            </el-table-column>
            <el-table-column prop="sku" label="平台sku">
            </el-table-column>
            <el-table-column label="修改前" inline-template>
                <ul>
                    <li>拍卖底价：{{row.buy_it_nowprice}}</li>
                    <li>保底拍卖价：{{row.reserve_price}}</li>
                    <li>一口价：{{row.start_price}}</li>
                </ul>
            </el-table-column>
            <el-table-column label="修改后" inline-template>
                <ul v-if="auction.show">
                    <li>拍卖底价：{{row.new_buy_it_nowprice || row.buy_it_nowprice}}</li>
                    <li>保底拍卖价：{{row.new_reserve_price || row.reserve_price}}</li>
                    <li>一口价：{{row.new_start_price || row.start_price}}</li>
                </ul>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" req-key="actionAuction" v-if="ebayStatus==='already'">保存待同步平台</request-button>
            <request-button @click="keep" req-key="actionAuction" v-else>确定</request-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .text-right{
        text-align: right;
        padding-right:5px;
        .c-r {
            color: red;
            font-weight: bolder;
            padding: 0px 3px;
        }
    }
</style>
<script>
    import {api_edit_ebay_product_auction_price} from "../../../../../api/ebay-kandeng-operated"
    import {api_up_chinese_price} from "../../../../../api/ebay-kandeng-public-module"
    export default{
        data(){
            return{
                show:this.value,
                auction:{ //拍卖
                    select:"",
                    lowest:false, // 底价
                    reserve:false, // 保底价
                    once:false,   // 一口价
                    show:false,
                    add:"",
                    up:"",
                    cron_time:"",
                    remark:"",
                },
                showTables:[],
            }
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                this.auction = {
                    select:"",
                    lowest:false,
                    reserve:false,
                    once:false,
                    show:false,
                    add:"",
                    up:"",
                    cron_time:"",
                    remark:"",
                };
                this.showTables = [];
                this.selectIds.forEach(row=>{
                    let obj={
                        id: row.id,
                        site:row.site,
                        sku: row.listing_sku,
                        price: row.start_price, // 需要修改
                        quantity: row.quantity,
                        item_id: row.item_id,
                        buy_it_nowprice:row.start_price,
                        reserve_price:row.reserve_price,
                        start_price:row.buy_it_nowprice,
                        account_id:row.account_id,
                    };
                    this.showTables.push(obj)
                })
            },
            blur_add(){
                if(!!this.auction.add){
                    this.auction.add = parseFloat(this.auction.add).toFixed(2);
                }
            },
            blur_up(){
                if(!!this.auction.up){
                    this.auction.up = parseFloat(this.auction.up).toFixed(2);
                }
            },
            //预览拍卖价
            look_auction_price(){
                if(this.auction.select===""){
                    this.$message({type:"warning",message:"请选择修改方式"});
                    this.$reqKey('actionAuction',false);
                    return  false;
                }
                this.auction.show = true;
                if(this.auction.lowest){
                    this.add_auction_fun("buy_it_nowprice","new_buy_it_nowprice");
                }else{
                    this.no_auction_fun("buy_it_nowprice","new_buy_it_nowprice");
                }
                if(this.auction.reserve){
                    this.add_auction_fun("reserve_price","new_reserve_price");
                }else{
                    this.no_auction_fun("reserve_price","new_reserve_price");
                }
                if(this.auction.once){
                    this.add_auction_fun("start_price","new_start_price");
                }else{
                    this.no_auction_fun("start_price","new_start_price");
                }
                return true
            },
            add_auction_fun(val,attr){
                switch (this.auction.select){
                    case "1":
                        this.showTables.forEach(row=>{
                            let price= parseFloat(row[val]) + parseFloat(this.auction.add||0);
                            this.$set(row,attr,price.toFixed(2));
                        });
                        break;
                    case "2":
                        this.showTables.forEach(row=>{
                            let price=(parseFloat(row[val]))*(1+parseFloat(this.auction.up||0)/100) || row[val];
                            this.$set(row,attr,price.toFixed(2));
                        });
                        break;
                }
            },
            no_auction_fun(val,attr){
                this.showTables.forEach(row=>{
                    this.$set(row,attr,row[val]);
                });
            },
            //保存拍卖价
            keep(){
                let flag=this.look_auction_price();
                if(flag){
                    if(this.auction.cron_time && this.auction.cron_time instanceof Object){
                        this.auction.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.auction.cron_time/1000);
                    }else if(!this.auction.cron_time){
                        this.auction.cron_time = "";
                    }
                    let data = this.showTables.map(row=>{
                    	let data_row = {};
                    	if(this.ebayStatus==='already'){
                            data_row = {
                                item_id:row.item_id,
                                site:row.site,
                                listing_sku:row.sku,
                                start_price:row.new_start_price || row.start_price,
                                old_start_price:row.start_price,
                                reserve_price:row.new_reserve_price || row.reserve_price,
                                old_reserve_price:row.reserve_price,
                                buy_it_nowprice:row.new_buy_it_nowprice || row.buy_it_nowprice,
                                old_buy_it_nowprice:row.buy_it_nowprice,
                                account_id:row.account_id,
                                cron_time:this.auction.cron_time,
                                remark:this.auction.remark,
                            };
                        } else {
                            data_row ={
                                id:row.id,
                                start_price:row.new_buy_it_nowprice || row.buy_it_nowprice,
                                reserve_price:row.new_reserve_price || row.reserve_price,
                                buy_it_nowprice:row.new_start_price || row.start_price,
                            }
                        }
                        return data_row;
                    });
                    if(this.ebayStatus==='already'){
                    	this.operate_ajax(api_up_chinese_price,data);
                    } else {
                        this.operate_ajax(api_edit_ebay_product_auction_price,data);
                    }
                }
            },
            operate_ajax(api,data){
                this.$http(api,{data:data}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('change-data',data);
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    this.$reqKey('actionAuction',false)
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
            value:{},
            selectIds:{},
            ebayStatus:{
            	required:true,
                type:String,
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
        }
    }
</script>
