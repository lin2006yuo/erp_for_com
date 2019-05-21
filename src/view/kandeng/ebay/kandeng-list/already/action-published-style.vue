<template>
    <page-dialog v-model="show" size="large" @open="open"
                 title="批量修改刊登风格" :close-on-click-modal="false">
        <el-row>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="16">
                <label class="inline">第一：</label>
                <el-select v-model="classify.first" placeholder="全部" clearable class="has-inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in localStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="16">
                <label class="inline">第类：</label>
                <el-select v-model="classify.second" placeholder="全部" clearable class="has-inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in localStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <p>小提示：请确认您的eBay账号开通了商店，否则无法使用商店分类。</p>
            </el-col>
        </el-row>
        <el-row>
            <el-button size="mini"
                       @click.native="look_auction_price"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </el-row>
        <el-table
            :data="selectIds"
            style="width: 100%">
            <el-table-column prop="item_id" label="item_ID">
            </el-table-column>
            <el-table-column label="修改前" inline-template>
                <ul>
                </ul>
            </el-table-column>
            <el-table-column label="修改后" inline-template>
                <ul>
                </ul>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">保存待同步平台</el-button>
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
    import {api_edit_ebay_product_auction_price} from "../../../../../api/ebay-kandeng-operated"
    export default{
        data(){
            return{
                show:this.value,
                classify:{ //分类
                    select:"",
                    first:"",
                    second:"",
                },
                localStatus:[],
            }
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                this.classify.select = "";
                this.classify.first = "";
                this.classify.second = "";
            },
            //预览拍卖价
            look_auction_price(){
                if(this.auction.select===""){
                    this.$message({type:"warning",message:"请选择修改方式"})
                    return  false;
                };
                this.auction.show = true;
                if(this.auction.lowest){
                    this.add_auction_fun("buy_it_nowprice","new_buy_it_nowprice")
                }
                if(this.auction.reserve){
                    this.add_auction_fun("reserve_price","new_reserve_price")
                }
                if(this.auction.once){
                    this.add_auction_fun("start_price","new_start_price")
                }
                return true
            },
            add_auction_fun(val,attr){
                switch (this.auction.select){
                    case "1":
                        this.showTables.forEach(row=>{
                            let price=parseFloat(row[val])+this.auction.add;
                            this.$set(row,attr,price.toFixed(2))
                        })
                        break;
                    case "2":
                        this.showTables.forEach(row=>{
                            let price=(parseFloat(row[val]))*(1+this.auction.up/100);
                            this.$set(row,attr,price.toFixed(2))
                        });
                        break;
                }
            },
            //保存拍卖价
            keep(){
                let flag=this.look_auction_price();
                if(flag){
                    let data = this.showTables.map(row=>{
                        let data_row={
                            id:row.item_id,
                            start_price:row.new_buy_it_nowprice,
                            buy_it_nowprice:row.new_reserve_price,
                            reserve_price:row.new_start_price
                        }
                        return  data_row
                    })
                    this.$http(api_edit_ebay_product_auction_price,{data:data}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
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
            }
        },
        computed:{
        },
        props:{
            value:{},
            selectIds:{
            },
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default
        }
    }
</script>
