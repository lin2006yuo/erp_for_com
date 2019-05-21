<template>
    <div>
        <page-dialog :title="$t('ymx-list.batchEditSell')" v-model="show" size="full" :close-on-click-modal="false">
            <el-table
                class="input-border"
                :data="selectMsg"
                border
                style="width: 100%">
                <el-table-column :label="$t('ymx-list.userName')" prop="account.account_name" width="140"></el-table-column>
                <el-table-column label="SKU"  prop="sku" width="180" >
                </el-table-column>
                <el-table-column label="ASIN" prop="asin" width="220" ></el-table-column>
                <el-table-column :label="$t('ymx-list.sellPrice')"  width="150">
                    <template slot-scope="scope">
                        <input type="text" @input="input_price(scope.row,1)" v-model="scope.row.price"  style="width:50px;padding-left:1rem;" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ymx-list.quantity')"  width="136">
                    <template slot-scope="scope">
                        <input type="text" @input="input_number(scope.row)" v-model="scope.row.quantity" style="width:50px;padding-left:1rem;" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ymx-list.lowerPrice')"   width="140">
                    <template slot-scope="scope">
                        <input type="text" @input="input_price(scope.row,2)" v-model="scope.row.lowest_price" style="width:50px;padding-left:1rem;" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ymx-list.automaticAdjustment')"  >
                    <template slot-scope="scope">
                        <input type="radio" :name="scope.row.id"  :value='1'  @change="change_radio(scope.row)"   v-model="scope.row.modify_price_type"  :checked="scope.row.modify_price_type===1? true:false" ><label>{{$t('ymx-list.percentageAdjustment')}}</label>
                        <span v-if="scope.row.modify_price_type===1? true:false" style="position:relative">
                            <input   type="text"  @input="input_price(scope.row,3)" style="width:50px;padding-right:23px;padding-left:1rem;" :disabled="scope.row.modify_price_type!==1? true:false"   v-model="scope.row.modify_price"  />
                            <img  src="../../../../assets/input.png" alt="纸飞机"   style="position:absolute;top:0px;right:5px;width:18px;height:18px;cursor:pointer;" @click="all_change_btn(1,scope.row.modify_price)" />
                        </span>
                        <span v-else>
                            <input type="text"  style="width:50px;padding-right:23px;padding-left:1rem;" :disabled="scope.row.modify_price_type!==1? true:false"  />
                        </span>
                        %
                        <input type="radio" :name="scope.row.id"  @change="change_radio(scope.row)"  :value='2'  v-model="scope.row.modify_price_type"  :checked="scope.row.modify_price_type===2? true:false"><label>{{$t('ymx-list.amountPricing')}}</label>
                        <span v-if="scope.row.modify_price_type===2? true:false" style="position:relative">
                            <input   type="text"  @input="input_price(scope.row,3)"  style="width:50px;padding-right:23px;padding-left:1rem;" :disabled="scope.row.modify_price_type!==2? true:false" v-model="scope.row.modify_price" />
                            <img  src="../../../../assets/input.png" alt="纸飞机"   style="position:absolute;top:0px;right:5px;width:18px;height:18px;cursor:pointer;" @click="all_change_btn(2,scope.row.modify_price)" />
                        </span>
                        <span v-else>
                             <input type="text"  style="width:50px;padding-right:23px;padding-left:1rem;" :disabled="scope.row.modify_price_type!==2? true:false" />
                        </span>
                        <input type="radio" :name="scope.row.id" :value='0' @change="change_radio(scope.row)" v-model="scope.row.modify_price_type" :checked="scope.row.modify_price_type===0? true:false" ><label>无</label>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ymx-list.regularRules')"  width="200" >
                    <template slot-scope="scope" >
                        <div style="position:relative;"  v-if="!scope.row.is_rule_status">
                            <param-account
                                v-model="scope.row.rule_id"
                                class="s-width-default"
                                type="saleRule"
                                :fixResult="fixRule"
                                :placeholder="$t('ymx-heel-sale-list.selectEnter')"
                                :param="{rule_name: '',status: 0, page: 1, pageSize: 10000000}"
                                url="get|publish/amazon/up-lower-rule-list"></param-account>
                            <img  src="../../../../assets/input.png" alt="纸飞机"   style="position:absolute;top:50%;right:60px;width:18px;height:18px;cursor:pointer;transform: translateY(-50%);"  @click.stop="all_change_btn_rule(scope.row.rule_id,scope.row.is_rule_status)" />
                        </div>
                        <div style="position: relative" v-else>
                            <param-account
                                v-model="scope.row.frame_rule.rule_name"
                                :oldValue="selectMsg"
                                class="s-width-default"
                                @change="change_val(scope.row)"
                                type="saleRule"
                                :fixResult="fixRule"
                                :placeholder="$t('ymx-heel-sale-list.selectEnter')"
                                :param="{rule_name: '',status: 0, page: 1, pageSize: 10000000}"
                                url="get|publish/amazon/up-lower-rule-list"></param-account>
                            <img  src="../../../../assets/input.png" alt="纸飞机"   style="position:absolute;top:50%;right:60px;width:18px;height:18px;cursor:pointer;transform: translateY(-50%);"  @click.stop="all_change_btn_rule(scope.row.rule_id,scope.row.is_rule_status)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button v-if="!loadingBtn" type="primary" size="mini" @click="update_data">{{$t('common.commitData')}}</el-button>
                <el-button v-else type="primary" size="mini" >{{$t('ymx-heel-sale-list.loadingBtn')}}</el-button>
                <el-button size="mini" @click="exit_updata">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import {api_change_heel_sale_info} from  '../../../../api/amazon-publish-info';
    export default {
        data(){
            return {
                show:this.value,
                changeNumber:0,
                submitMsg:[],
                loadingBtn:false,
            }
        },
        methods:{
            update_data(){
                let array=[];
                this.selectMsg.forEach(item=>{
                    array.push(this.clone(item));
                })
                this.submitMsg=[...array];
                this.submitMsg.forEach(item=>{
                    if(item.rule_id===null){
                        item.rule_id=0;
                    }
                })
                let str;
                for(let i=0;i<this.submitMsg.length;i++){
                    if(this.submitMsg[i].rule_id!==this.defaultValue[i].rule_id){
                        console.log(i);
                        str=this.submitMsg[i].rule_id;
                        this.submitMsg[i].new_rule_id=str;
                        this.submitMsg[i].rule_id=this.defaultValue[i].rule_id;
                    }else{
                        this.submitMsg[i].new_rule_id=0;
                    }
                }
                let arr=this.submitMsg.filter(item=>{
                    return parseFloat(item.modify_price)!==0;
                })
                let arr2=this.submitMsg.filter(item=>{
                    return parseFloat(item.modify_price_type)===0;
                })
                let arr3=this.submitMsg.filter(item=>{
                    return parseFloat(item.quantity)!==0;
                })
                console.log(this.submitMsg);
                let number=this.submitMsg.length-arr2.length;
                if(arr.length===number && arr3.length===this.submitMsg.length){
                    this.loadingBtn=true;
                    this.$http(api_change_heel_sale_info,{data:this.submitMsg})
                        .then(res=>{
                            this.show=false;
                            this.$emit("clear-select");
                            this.submitMsg=[];
                            this.loadingBtn=false;
                            this.$emit("init-msg");
                            return this.$message({
                                type:"success",
                                message:'执行成功'
                            });
                        })
                        .catch(err=>{
                            console.log(err.message+'出错了');
                        })
                }else{
                    if(arr.length!==number) {
                        this.$message({
                            type: "error",
                            message: "百分比调价和金额调价不能为0"
                        })
                    }else if( arr3.length!==this.submitMsg.length){
                        this.$message({
                            type:"error",
                            message:"可售量不能为0"
                        })
                    }
                }
            },
            all_change_btn(type,val){
                let arr;
                arr=this.selectMsg.filter(item=>{
                    return item.modify_price_type===type;
                })
                arr.forEach(item=>{
                    item.modify_price=val;
                })
                console.log(val);
            },
            exit_updata(){
                this.show=false;
                this.$emit("clear-select");
            },
            all_change_btn_rule(val,type){
                console.log(val);
                if(!type){
                    this.selectMsg.forEach(item=>{
                        this.$set(item,'rule_id',val);
                        item.is_rule_status=0;
                    })
                    console.log(this.selectMsg,'this.selectMsg')
                }else{
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.allChangeRuleError')
                    })
                }
            },
            change_val(obj){
                console.log(111);
                this.changeNumber++;
                console.log(this.changeNumber);
                if(this.changeNumber>0){
                    obj.is_rule_status=0;
                    obj.rule_id=null;
                }
            },
            change_radio(val){
                val.modify_price=0;
            },
            //获取规则列表
            fixRule(res){
                let list = res.data.map(row => {
                    return {
                        label: row.rule_name,
                        value: row.id
                    }
                });
                return list
            },

            //限制输入框输入规则
            input_price(val,type){
                if(type===1) {
                    console.log(1);
                    val.price = val.price.replace(/[^\d.]/g, "");//清除数字和点以外的字符
                    val.price = val.price.replace(/\.{2,}/g, ".");//清除多余的.字符
                    val.price = val.price.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                    val.price = val.price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
                    if (val.price.indexOf(".") < 0 && val.price !== "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                        val.price = parseFloat(val.price);
                    }
                }else if(type===2){
                    console.log(2);
                    val.lowest_price = val.lowest_price.replace(/[^\d.]/g, "");//清楚数字和点以外的字符
                    val.lowest_price = val.lowest_price.replace(/\.{2,}/g, ".");//清楚多余的.字符
                    val.lowest_price = val.lowest_price.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                    val.lowest_price = val.lowest_price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
                    if (val.lowest_price.indexOf(".") < 0 && val.lowest_price !== "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                        val.lowest_price = parseFloat(val.lowest_price);
                    }
                }else if(type===3){
                    console.log(1);
                    val.modify_price = val.modify_price.replace(/[^\d.]/g, "");//清除数字和点以外的字符
                    val.modify_price = val.modify_price.replace(/\.{2,}/g, ".");//清除多余的.字符
                    val.modify_price = val.modify_price.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                    val.modify_price = val.modify_price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
                    if (val.modify_price.indexOf(".") < 0 && val.modify_price !== "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                        val.modify_price = parseFloat(val.modify_price);
                    }
                }
            },
            input_number(val){
                val.quantity=val.quantity.replace(/\D/g,'');
                if (val.quantity.indexOf(".") < 0 && val.quantity !== "") {//以上已经过滤，首位不能为类似于 01、02的金额
                    val.quantity = parseFloat(val.quantity);
                }
            },
            clone(obj){
                let result={};
                for(let key in obj){
                    result[key]=obj[key];
                }
                return result;
            },
        },
        watch:{
          value(val){
              this.show=val;
          },
          show(val){
              this.$emit("change-show",val);
              this.changeNumber=0;
          }
        },
        props:{
            value:{
                required: true,
                type: Boolean
            },
            selectMsg:{
                required: true,
                type: Array
            },
            defaultValue:{
                required: true,
                type: Array
            }
        },
        components:{
            paramAccount:require('@/api-components/param-account').default,
        },
    }
</script>

