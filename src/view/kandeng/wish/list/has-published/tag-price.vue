<template>
    <page-dialog @open="open" v-model="show" size="large" title="修改吊牌价" :close-on-click-modal="false">
        <el-row class="mb-xs">
            <el-col :span="8" style="width: 150px">
                <el-radio  v-model="msrp.select" label="1">统一售价</el-radio>
            </el-col>
            <el-col :span="16">
                <ui-limit-number  v-model="msrp.price" :limit="2" class="inline"  :disabled="msrp.select!=='1'" style="width:200px"></ui-limit-number>
            </el-col>
        </el-row>
        <el-row class="mb-xs">
            <el-col :span="8" style="width: 150px">
                <el-radio  v-model="msrp.select" label="2">价格公式</el-radio>
            </el-col>
            <el-col :span="16">
                <ui-limit-number  v-model="msrp.multiple" :limit="1" class="inline" :disabled="msrp.select!=='2'" style="width:200px"></ui-limit-number>
                <span>×(销售价+运费) 即：吊牌价等于销售价加上运费之和再乘以某倍数</span>
            </el-col>
        </el-row>
        <el-row class="mb-xs">
            <el-col :span="8" style="width: 150px">
                <el-radio  v-model="msrp.select" label="3">售价涨幅</el-radio>
            </el-col>
            <el-col :span="16">
                <ui-limit-number  v-model="msrp.increase.value" :limit="1" class="inline" :disabled="msrp.select!=='3'" style="width:200px"></ui-limit-number>%
                <el-checkbox v-model="msrp.increase.isInt">取整</el-checkbox>
                <el-radio  v-model="msrp.increase.intValue" label="1">进一法</el-radio>
                <el-radio  v-model="msrp.increase.intValue" label="2">四舍五入法</el-radio>
                <el-radio  v-model="msrp.increase.intValue" label="3">去尾法</el-radio>
            </el-col>
        </el-row>
        <p>
            小提示：如果减少，可输入负数
        </p>
        <p>
            <label class="has-inline text-right" style="width: 90px;"> 定时提交修改：</label>
            <el-date-picker
                v-model="msrp.cron_time"
                type="datetime"
                class="has-inline"
                placeholder="选择日期时间">
            </el-date-picker>
        </p>
        <p>
            <label class="has-inline text-right" style="width: 90px;"> 修改备注：</label>
            <el-input
                type="textarea"
                :rows=4
                style="width:35%"
                placeholder="请输入内容"
                v-model="msrp.remark">
            </el-input>
        </p>
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
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                prop="msrp"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="newMsrp"
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
                cloneData:[],
                show:this.value,
                msrp:{
                    select:"",
                    price:"",
                    multiple:"",
                    increase:{value:"",isInt:false,intValue:""},
                    cron_time:"",
                    remark:"",
                }
            }
        },
        methods:{
            open(){
                this.cloneData = clone(this.selectedIds);
                this.msrp= {
                    select: "",
                    price: "",
                    multiple: "",
                    increase: {
                        value: "",
                        isInt: false,
                        intValue: "",
                    },
                    cron_time:"",
                    remark:"",
                }

            },
            look(){
                let flag=true;
                if(!this.msrp.select){
                    flag=false;
                    this.$message({type:'warning',message:"请选择修改方式"});
                    return;
                }
                switch (this.msrp.select){
                    case "1":
                        this.selectedIds.forEach((row,index)=>{
                            let find = this.cloneData.find(res=>res.product_id===row.product_id);
                            if(!!find){
                                let newPrice = this.transit_change(this.msrp.price,find.price,find,index)?this.msrp.price:find.price;
                                this.$set(row,"newMsrp",newPrice)
                            }
                        })
                        break;
                    case "2":
                        this.selectedIds.forEach((row,index)=>{
                            let price=0;
                            price=(Number(row.price)+ Number(row.shipping))*this.msrp.multiple;
                            let find = this.cloneData.find(res=>res.product_id===row.product_id);
                            if(!!find){
                                let newPrice = this.transit_change(price,find.price,find,index)?price:find.price;
                                this.$set(row,"newMsrp",newPrice)
                            }
                        });
                        break;
                    case '3':
                        this.selectedIds.forEach((row,index)=>{
                            let price=0;
                            if(this.msrp.increase.isInt){
                                if(this.msrp.increase.intValue==="3"){
                                    price=Math.floor(Number(row.msrp)*(this.msrp.increase.value/100+1))
                                }else if(this.msrp.increase.intValue==="1"){
                                    price=Math.ceil(Number(row.msrp)*(this.msrp.increase.value/100+1))
                                }else  if(this.msrp.increase.intValue==="2"){
                                    price=Math.round(Number(row.msrp)*(this.msrp.increase.value/100+1))
                                }else {
                                    flag=false;
                                    this.$message({type:'warning',message:"请选择取整方式"})
                                }
                            }else {
                                price=(Number(row.msrp)*(this.msrp.increase.value/100+1)).toFixed(2)
                            }
                            let find = this.cloneData.find(res=>res.product_id===row.product_id);
                            if(!!find){
                                let newPrice = this.transit_change(price,find.price,find,index)?price:find.price;
                                this.$set(row,"newMsrp",newPrice)
                            }
                        })
                        break;
                }
                return flag;
            },
            transit_change(newV,old,row,index){
                let cur = true;
                if(!!row.is_promoted&&parseFloat(newV)>parseFloat(old)) {
                    cur = false;
                    this.$message({type:"warning",message:`第${index+1}行，为促销产品，吊牌价不允许提高`});
                }
                return cur;
            },
            keep(){
                let b=this.look();
                if(b){
                    let table=this.selectedIds.map(row=>{
                        return {variant_id:row.variant_id,msrp:row.newMsrp}
                    });
                    let data={
                    	type:'msrp',
                        data:table,
                        cron_time:this.msrp.cron_time || 0,
                        remark:this.msrp.remark,
                    };
                    this.$http(api_wish_batch_edit,data).then(res=>{
                        this.show = false;
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',this.selectedIds)
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
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
        computed:{
        },
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                require:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default
        }
    }
</script>
