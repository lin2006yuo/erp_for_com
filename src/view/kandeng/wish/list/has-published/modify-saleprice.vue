<template>
    <page-dialog v-model="show" @open="open" size="large" title="修改销售价" :close-on-click-modal="false">
        <el-row>
            <el-col :span="3" class="text-right">
                <el-radio  v-model="salePrice.select" label="1">统一售价</el-radio>
            </el-col>
            <el-col :span="21">
                <ui-limit-number  v-model="salePrice.price" :limit="2" :disabled="salePrice.select!=='1'" class="inline">
                </ui-limit-number>
            </el-col>
        </el-row>
        <el-row class="mt-xs mb-sm">
            <el-col :span="3" class="text-right">
                <el-radio  v-model="salePrice.select" label="2">售价涨幅</el-radio>
            </el-col>
            <el-col :span="21">
                <ui-limit-number  v-model="salePrice.increase.value" :limit="2" :disabled="salePrice.select!=='2'" class="inline">
                </ui-limit-number>
                <span>%</span>
                <el-checkbox v-model="salePrice.increase.isInt">取整</el-checkbox>
                <el-radio  v-model="salePrice.increase.intValue" label="1">进一法</el-radio>
                <el-radio  v-model="salePrice.increase.intValue" label="2">四舍五入法</el-radio>
                <el-radio  v-model="salePrice.increase.intValue" label="3">去尾法</el-radio>
            </el-col>
        </el-row>
        <!--bug#4414-->
        <!--<p>-->
            <!--小提示：如果减少，可输入负数-->
        <!--</p>-->
        <el-row class="mb-xs">
            <el-col :span="3" class="text-right">
                定时提交修改：
            </el-col>
            <el-col :span="21">
                <el-date-picker
                    v-model="salePrice.cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3" class="text-right">
                修改备注：
            </el-col>
            <el-col :span="21">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="salePrice.remark">
                </el-input>
            </el-col>
        </el-row>
        <p>
            <el-button size="mini"
                       @click.native="look"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </p>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column
                prop="sku"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                prop="price"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newPrice"
                label="修改后">
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
    import {api_wish_batch_edit} from "../../../../../api/kandeng"
    export default{
        data(){
            return{
                show:this.value,
                cloneData:[],
                salePrice:{
                    select:"",
                    price:"",
                    increase:{value:"",isInt:false,intValue:""},
                    cron_time:"",
                    remark:"",
                },
            }
        },
        methods:{
            open(){
                this.clear();
                this.cloneData = clone(this.selectedIds);
            },
            clear(){
                this.salePrice = {
                    select:"",
                    price:"",
                    increase:{value:"",isInt:false,intValue:""},
                    cron_time:"",
                    remark:"",
                }
            },
            look(){
                let flag=true;
                if(!this.salePrice.select){
                    flag=false;
                    this.$message({type:'warning',message:"请选择修改方式"})
                    return;
                }
                switch (this.salePrice.select){
                    case "1":
                        this.selectedIds.forEach((row,index)=>{
                            let find = this.cloneData.find(res=>res.product_id===row.product_id);
                            if(!!find){
                                let newPrice = this.transit_change(this.salePrice.price,find.price,row,index)?this.salePrice.price:find.price;
                                this.$set(row,"newPrice", newPrice);
                            }
                        })
                        break;
                    case "2":
                        let getPrice=Number(this.salePrice.increase.value)
                        this.selectedIds.forEach((row,index)=>{
                            let price=0;
                            if(this.salePrice.increase.isInt){
                                if(this.salePrice.increase.intValue==="3"){
                                    price=Math.floor(row.price*(getPrice/100+1))
                                }else if(this.salePrice.increase.intValue==="1"){
                                    price=Math.ceil(row.price*(getPrice/100+1))
                                }else  if(this.salePrice.increase.intValue==="2"){
                                    price=Math.round(row.price*(getPrice/100+1))
                                }else {
                                    flag=false
                                    this.$message({type:'warning',message:"请选择取整方式"})
                                }
                            }else {
                                price=(row.price*(getPrice/100+1)).toFixed(2)
                            }
                            let find = this.cloneData.find(res=>res.product_id===row.product_id);
                            if(!!find){
                                let newPrice = this.transit_change(price,find.price,row,index)?price:find.price;
                                this.$set(row,"newPrice",newPrice)
                            }
                        })
                }
                return flag
            },
            transit_change(newV,old,row,index){
                let cur = true;
                if(!!row.is_promoted&& parseFloat(newV)>parseFloat(old)) {
                    cur = false;
                    this.$message({type:"warning",message:`第${index+1}行，为促销产品，销售价格不允许提高`});
                }
                return cur;
            },
            keep(){
                let flag=this.look();
                if(this.salePrice.cron_time && this.salePrice.cron_time instanceof Object){
                    this.salePrice.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.salePrice.cron_time/1000);
                }else if(!this.salePrice.cron_time){
                    this.salePrice.cron_time = "";
                }
                if(flag){
                    let table=this.selectedIds.map(row=>{
                        return {variant_id:row.variant_id,price:row.newPrice}
                    })
                    let data={
                    	type:'price',
                        data:table,
                        cron_time:this.salePrice.cron_time || 0,
                        remark:this.salePrice.remark,
                    };
                    this.$http(api_wish_batch_edit,data).then(res=>{
                        this.show=false;
                        this.$message({type:"success",message:res.message||res})
                        this.$emit('change-data',this.selectedIds)
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
            },
            close(){
                this.show =false;
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
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                required:true,
                type:Array,
            },
            accountId:{}
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default
        }
    }
</script>
