<template>
    <div class="bundling-sales">
        <page-dialog :title="$t('ymx-detail.bundSale')" v-model="dialog" size="large" :close-on-click-modal="false" >
            <div class="reminder" v-if="channelName!=='Amazon'">
                注意：捆绑的产品SKU是通过同一个listing刊登到{{channelName}}，而{{channelName}}页面不会直接显示捆绑产品的SKU，捆绑的产品内容需要您在物品
                标题或者物品描述里注明；客户拍下产品后，产生的订单会同时显示主SKU和捆绑产品的SKU。捆绑销售的功能不需要收费
            </div>
            <div v-else class="reminder">{{$t('ymx-detail.bundledTips')}}</div>
            <el-button class="inline mt-sm" type="primary" size="mini" @click.native="add_new_bundling">{{$t('ymx-detail.addBundle')}}</el-button>
            <!--添加产品  弹出页面-->
            <add-goods v-model="goodsDialog" @add-goods="add_goods"></add-goods>
            <el-table
                class="scroll-bar mt-sm"
                :data="data"
                highlight-current-row
            >
                <el-table-column :label="$t('ymx-detail.localSku')" prop="local_sku"></el-table-column>
                <el-table-column :label="$t('ymx-detail.bundNum')" inline-template>
                    <el-input-number v-model="row.quantity"
                                     :min="1"
                                     @input="input(row)"
                                     :controls = "false"
                                     class="inline width-sm"></el-input-number>
                </el-table-column>
                <el-table-column :label="$t('ymx-detail.op')">
                    <template  slot-scope="scope">
                        <div>{{$t('ymx-detail.delete')}}</div>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">{{$t('ymx-detail.confirm')}}</el-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">{{$t('ymx-detail.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .bundling-sales{
        .reminder{
            margin-top:10px;
            padding:10px 15px;
            background-color: #FFCCCC;
            border:1px solid #AEA2A2;
            border-radius: 5px;
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                dialog:this.value,
                goodsDialog:false,

            }
        },
        mounted(){
            console.log(this.$t('ymx-detail.delete'),'ymx-detail.delete');
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
        },
        methods:{
            input(row){
                if((row.quantity+'').includes('.')){
                    this.$nextTick(_=>{
                        row.quantity=Math.round(row.quantity)
                    })
                }
            },
            //添加 捆绑销售数
            add_new_bundling(){
                this.goodsDialog = true;
            },
            //添加  产品
            add_goods(val){
                val.forEach(row=>{
                    let cur = this.data.find(res=>{return res.local_sku===row.sku});
                    if(!!cur) return this.$message({message:"请不要重复添加sku相同的产品", type:'warning'});
                    if(this.isFixedPriceItem){//一口价
                        let obj = {
                            local_sku:row.sku,
                            quantity:1,
                            sku_id:row.sku_id,
                            goods_id:row.goods_id
                        };
                        this.data.push(obj);
                    }else{//拍卖
                        let obj = {
                            local_sku:row.sku,
                            quantity:1,
                        };
                        this.data.push(obj);
                    }
                })
            },
            //删除  当前捆绑sku
            cur_delete(row){
                let index = this.data.findIndex(res=>{return res.local_sku===row.local_sku});
                this.data.splice(index,1);
            },
            //当前页面  确定
            submit(){
                if(!this.data) return this.$message({type:"warning",message:"数据有误！"});
                let canSubm = this.data.length===1&&(!this.data[0].local_sku||!this.data[0].quantity);
                if(this.data.length<=0||canSubm) return this.$message({type:"warning",message:"请至少添加一条数据！"});
                let strList = [];
                let lastStrList = "";
                let str = "";
                let deliveryList = [];
                this.data.forEach((row)=>{
                    if(this.isFixedPriceItem){//一口价
                        let obj = {
                            sku_id:row.sku_id,
                            goods_id:row.goods_id,
                        };
                        str =`${row.local_sku}*${row.quantity}`;
                        strList.push(str);
                        obj.sku = str;
                        deliveryList.push(obj);
                    }else{//拍卖
                        str =`${row.local_sku}*${row.quantity}`;
                        strList.push(str);
                    }
                });
                let curClone = window.clone(strList);
                switch (this.channel){
                    case '1':
                        lastStrList = curClone.join(",");
                        break;
                    case '3':
                        lastStrList = curClone.join("|");
                        break;
                    case '4':
                        lastStrList = curClone.join("|");
                        break;
                    default:
                        lastStrList = curClone.join(",");
                        break;
                }
                this.isFixedPriceItem?this.$emit("submit",lastStrList,deliveryList):this.$emit("submit",lastStrList);
            },
        },
        computed:{
            channelName(){
//                ['eBay' => 1, 'Amazon' => 2, 'Wish' => 3, 'AliExpress' => 4];
            	switch (this.channel){
                    case '1':
                    	return "eBay";
                    	break;
                    case '2':
                    	return "Amazon";
                    	break;
                    case '3':
                    	return "Wish";
                    	break;
                    case '4':
                    	return "AliExpress";
                    	break;
                    default:
                    	return "eBay";
                    	break;
                }
            },
        },
        props:{
            data:{
                required:true,
                type:Array
            },
            value:{},
            isFixedPriceItem:{
                required:true,
                type:Boolean
            },
            channel:{
                default(){
                	return '1';
                }
            }
        },
        components: {
            addGoods:require('../../../../../api-components/add-goods.vue').default,
            pageDialog:require('../../../../../components/page-dialog.vue').default,

        }
    }
</script>
