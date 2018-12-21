<template>
    <div class="c-batch-mdf-sales-method">
        <page-dialog v-model="dialog"
                     title="批量修改出售方式"
                     size="large" :close-on-click-modal="false">
            <el-form :model="form" label-width="100px">
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="出售方式：">
                            <el-radio-group v-model="form.listing_type"
                                            @change="change_listing_type"
                                            fill="#20a0ff" text-color="#ffffff">
                                <el-radio-button :label="2" type="primary">拍卖</el-radio-button>
                                <el-radio-button :label="1" type="primary">一口价</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="SKU属性：">
                            <el-radio-group v-model="form.varions"
                                            :disabled="form.listing_type===2"
                                            @change="change_varions"
                                            fill="#20a0ff" text-color="#ffffff">
                                <el-radio-button :label="0" type="primary">单属性</el-radio-button>
                                <el-radio-button :label="1" type="primary" disabled>多属性</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="上架时间：">
                            <el-select v-model="form.listing_duration" filterable clearable>
                                <el-option
                                    v-for="res in timeList"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9" v-if="form.listing_type===2">
                        <el-form-item label="数量：">
                            <el-input v-model='quantity' disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <table class="template">
                <tr>
                    <th></th>
                    <th>范本ID</th>
                    <th>账号简称</th>
                    <th>拍卖SKU</th>
                    <th v-if="form.listing_type===2">拍卖底价</th>
                    <th v-else>一口价</th>
                    <th v-if="form.listing_type===2">保底拍卖价</th>
                    <th v-if="form.listing_type===2">一口价</th>
                    <th v-if="form.listing_type!==2">数量</th>
                </tr>
                <tbody>
                    <tr>
                        <td>
                            <el-checkbox v-model="checkAll"></el-checkbox>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <ui-limit-number v-model="start_price" :limit="2" @blur="change_price('start_price',start_price)"></ui-limit-number>
                        </td>
                        <td v-if="form.listing_type===2">
                            <ui-limit-number v-model="reserve_price" :limit="2" @blur="change_price('reserve_price',reserve_price)"></ui-limit-number>
                        </td>
                        <td v-if="form.listing_type===2">
                            <ui-limit-number v-model="buy_it_nowprice" :limit="2" @blur="change_price('buy_it_nowprice',buy_it_nowprice)"></ui-limit-number>
                        </td>
                        <th v-if="form.listing_type!==2">
                            <integer-input v-model="quantity" @blur="change_price('quantity',quantity)" :min="0"></integer-input>
                        </th>
                    </tr>
                    <tr v-for="item in tableData">
                        <td>
                            <el-checkbox v-model="item.isCheck"></el-checkbox>
                        </td>
                        <!--范本ID-->
                        <td>{{item.id}}</td>
                        <!--账号简称-->
                        <td>{{filterAccount(item.account_id)}}</td>
                        <!--拍卖SKU  单属性下-->
                        <template v-if="form.varions===0">
                            <td>
                                <el-input class="inline" v-if="item.varians&&item.varians.length>0" v-model="item.varians[0].v_sku" disabled></el-input>
                                <el-button type="primary" size="mini" class="inline"
                                           @click.native="choose_product(item)">选择产品</el-button>
                            </td>
                            <!--拍卖底价-->
                            <td>
                                <ui-limit-number v-model="item.start_price"></ui-limit-number>
                            </td>
                            <!--保底拍卖价-->
                            <td v-if="form.listing_type===2">
                                <ui-limit-number v-model="item.reserve_price"></ui-limit-number>
                            </td>
                            <!--一口价-->
                            <td v-if="form.listing_type===2">
                                <ui-limit-number v-model="item.buy_it_nowprice"></ui-limit-number>
                            </td>
                            <td v-if="form.listing_type!==2">
                                <integer-input v-model="item.quantity" @blur="change_price('quantity',quantity)" :min="0"></integer-input>
                            </td>
                        </template>
                        <template v-else>
                            <td>
                                <template v-for="it in item.varians">
                                    <el-input v-model="it.v_sku" disabled></el-input>
                                </template>
                            </td>
                            <td>
                                <!--一口价-->
                                <template v-for="it in item.varians">
                                    <el-input v-model="it.start_price"></el-input>
                                </template>
                            </td>
                            <td>
                                <!--数量-->
                                <template v-for="it in item.varians">
                                    <el-input v-model="it.quantity"></el-input>
                                </template>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
            <add-product
                    :search-param="formSpu"
                    @submit="submit_product"
                    v-model="addDialog"></add-product>
            <div slot="footer">
                <request-button req-key="salesMethods" :mintime='300' class="inline" @click="submit">确定</request-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {mapGetters} from 'vuex';
    import {api_draf_listingtype} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                dialog:this.value,
                addDialog:false,
                curRow:{},
                quantity:1,
                start_price:"",
                reserve_price:"",
                buy_it_nowprice:"",
                formSpu:"",
                form:{
                    listing_type:2,
                    varions:0,
                    listing_duration:2,
                    quantity:1,
                },
                time2:[
                    {label:"3天",value:3},
                    {label:"5天",value:4},
                    {label:"7天",value:5},
                    {label:"10天",value:6},
                    {label:"30天(此选项仅用于店铺与部分平台)",value:7},
                    {label:"GTC(此选项仅用于店铺)",value:1},
                ],
                time1:[
                    {label:"1天",value:2},
                    {label:"3天",value:3},
                    {label:"5天",value:4},
                    {label:"7天",value:5},
                    {label:"10天",value:6},
                ],
            }
        },
        computed:{
            ...mapGetters({accounts:'api/getPublishAccount'}),
            timeList(){
                return this.form.listing_type===1?this.time2:this.time1;
            },
            checkAll:{
                get(val){
                    return !this.tableData.find(row=>!row.isCheck);
                },
                set(val){
                    this.tableData.forEach(row=>{
                        row.isCheck = val;
                    });
                },
            },
        },
        methods:{
            submit_product(val){
                this.curRow.varians[0].v_sku = val.sku;
            },
            submit(){
                let params = {
                    listing_type:this.form.listing_type,
                    varions:this.form.varions,
                    listing_duration:this.form.listing_duration,
                };
                let data = this.tableData.map(row=>{
                    let cur = {
                        id:row.id,
                        local_sku:row.varians[0].v_sku,
                        sku:this.form.listing_type===2?`${row.varians[0].v_sku}*1`:`${row.varians[0].v_sku}*${row.quantity}`,
                        account_id:row.account_id,
                        quantity:this.form.listing_type===2?1:row.quantity,
                        start_price:row.start_price,
                    };
                    if(this.form.listing_type===2){
                        this.$set(cur,'reserve_price',row.reserve_price);
                        this.$set(cur,'buy_it_nowprice',row.buy_it_nowprice);
                    }
                    return cur;
                });
                this.$set(params,'data',data);
                this.$http(api_draf_listingtype,params).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.dialog = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('salesMethods',false)
                })
            },
            change_listing_type(val){
                if(val===2){
                    this.form.varions = 0;
                    this.form.listing_duration = '1';
                }else{
                    this.form.listing_duration = 'GTC';
                }
            },
            change_varions(val){

            },
            change_price(name,val){
                if(!val)return;
                this.tableData.forEach(row=>{
                    row[name] = val;
                });
            },
            filterAccount(val){ // 过滤账号
                this.accountList = this.accounts("ebay");
                let name = "";
                this.accountList.forEach(row =>{
                    if(val === row.value){
                        name = row.label
                    }
                });
                return name
            },
            choose_product(val){
                this.addDialog = true;
                this.formSpu = val.spu;
                this.curRow = val;
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            tableData:{
                type:Array,
                required:true,
            },
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            integerInput:require('../../../../../components/integer-input.vue').default,
            addProduct:require('../add-edit-listing/add-product.vue').default,
        }
    }
</script>
