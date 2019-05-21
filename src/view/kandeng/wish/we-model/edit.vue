<template>
    <div class="c-batch-we">
        <page-dialog
                @change="change_dialog"
                title="编辑WE设置模板"
                @open="open"
                v-model="dialog"
                size="large"
                :close-on-click-modal="false">
            <div class="mt-xs">
                <el-form :model="ruleForm"  :rules="rules">
                    <el-form-item >
                        <div style="display:flex">
                            <el-form-item label="模板名称 :" prop="modelName">
                                <el-col :span="11">
                                    <el-form-item >
                                        <el-input size="mini" style="width:150px" v-model="searchData.name"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-col :span="7"></el-col>
                            <el-form-item label="售价区间($) :" prop="sale">
                                    <div style="display: flex;">
                                        <el-form-item >
                                            <el-input size="mini" v-model="searchData.from_price" style="width: 80px" @blur="from_p" type="number"></el-input>
                                        </el-form-item>
                                        <span>-</span>
                                        <span>-</span>
                                        <el-form-item>
                                            <el-input size="mini" v-model="searchData.to_price" style="width:80px" @blur="to_p" type="number"></el-input>
                                        </el-form-item>
                                    </div>
                            </el-form-item>
                        </div>
                    </el-form-item>
                    <!--<el-form-item label="产品物流属性:" prop="type">-->
                        <!--<el-checkbox-group v-model="ruleForm.type" style="width: 400px">-->
                            <!--<el-checkbox :label="item" v-for="(item,index) in perties" name="type" :key="index" ></el-checkbox>-->
                        <!--</el-checkbox-group>-->
                    <!--</el-form-item>-->
                    <div style="display: flex;">
                        <span style="width: 81px"><span class="red">*</span>产品物流属性:</span>
                        <el-checkbox-group v-model="searchData.transport_property" style="width: 956px">
                            <el-checkbox :label="item" v-for="(item,index) in perties" name="type" :key="index" style="width: 78px"
                            :class="{mgl:index===0}"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form>
                <!--</el-card>-->
            </div>
            <table class="template mt-sm">
                <tr>
                    <th>国家</th>
                    <th>启用国家&nbsp;<el-checkbox v-model="country"></el-checkbox></th>
                    <th>屏蔽国家&nbsp;<el-checkbox v-model="closedCountry"></el-checkbox></th>
                    <th><span class="red">*</span>运费设置</th>
                    <th>操作</th>
                </tr>
                <tbody  v-loading="isLoad" element-loading-text="玩命加载中...">
                <template v-for="item in newTableList">
                    <tr>
                        <td>
                            <span v-copy>{{item.country}}</span>
                            <span>({{item.country_code}})</span>
                        </td>
                        <td>
                            <el-checkbox v-model="item.enabled"
                                         @change="change_start(item,$event)"></el-checkbox>
                        </td>
                        <td>
                            <el-checkbox v-model="item.closed" @change="change_shield(item)"></el-checkbox>
                        </td>
                        <td width="35%">
                            <el-row>
                                <el-col :span="12">
                                    <el-select :disabled="isClosed(item)" v-model="item.use_product_shipping">
                                        <el-option label="使用产品配送运费" :value="1"> </el-option>
                                        <el-option label="自定义设置运费" :value="0"></el-option>
                                        <el-option label="原价基础上加运费" :value="2"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="12">
                                    <el-input v-model="item.shipping_price"
                                              :disabled="isClosed(item)"
                                              v-if="item.use_product_shipping!==1"></el-input>
                                </el-col>
                            </el-row>
                        </td>
                        <td><span class='operate' @click="aplay(item)">应用到所有</span></td>
                    </tr>
                </template>
                </tbody>
            </table>
            <div slot="footer">
                <el-button size="mini" class="inline" type="primary" @click.native="sure">确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-batch-we{
    .custom-card{
        overflow:auto
    }
    }
    .mgl{
        margin-left: 14px;
    }
</style>
<script>
    import {api_get_wish_expressData} from '../../../../api/kandeng';
    import {api_edit_template} from '../../../../api/wish-publish';
    export default {
        data() {
            return {
                dialog:this.value,
                isLoad:false,
                newTableList:[],
                ruleForm:{
                    modelName:'',
                    minSale:'',
                    maxSale:'',
                    type:[],
                },
                perties:['普货','抛货','种子','超尺寸','LED灯','强磁性','纯电池','超大电池','电池内置','带纽扣电池','液体','粉状','膏状','易碎品','带电容','带磁性','刀枪火','异型包装','情趣用品','带蓝牙标示产品'],
                rules:{
                    modelName:[
                        {required:true,message:'请输入模板名称',trigger:'blur'}
                    ],
                    sale:[
                        {required:true,message:'test',trigger:'blur'}
                    ],
                    type:[
                        {type:'array',required:true,message:'请选择产品物流属性',trigger:'blur'}
                    ]
                },
                usingList:[
                    {label:"全部",value:""},
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                closedCountry:false
            }
        },
        mounted(){
            // this.init_data()
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
            closedCountry(val){
                this.newTableList.forEach(row=>{
                    row.closed = val;
                    if(val){
                        row.enabled = false;
                        row.wish_express = false;
                    }
                });
            }
        },
        computed:{
            country:{
                get(){
                    if(this.newTableList&&this.newTableList.length>0){
                        return this.get_start_using('country',this.newTableList);
                    }
                },
                set(val){
                    this.set_start_using('country',this.newTableList,val);
                },
            },
            status:{
                get(){
                    if(this.newTableList&&this.newTableList.length>0){
                        return this.get_start_using('status',this.newTableList);
                    }
                },
                set(val){
                    this.set_start_using('status',this.newTableList,val);
                },
            },
        },
        methods:{
            from_p(){
                if(this.searchData.from_price>this.searchData.to_price){
                    this.$message({type:"warning",message:'最小售价不能大于最大售价',duration:2000});
                }else {
                    this.searchData.from_price=Number(this.searchData.from_price).toFixed(2);
                }
            },
            to_p(){
                if(this.searchData.from_price>this.searchData.to_price){
                    this.$message({type:"warning",message:'最大售价不能小于最小售价',duration:2000});
                }else {
                    this.searchData.to_price = Number(this.searchData.to_price).toFixed(2)
                }
            },
            sure(){
                let all_country_shipping =  this.add_params();
                let id = this.searchData.id;
                let name = this.searchData.name;
               let ts =  this.searchData.transport_property;
               if(ts.includes('')){
                   ts.splice(0,1)
               };
                let transport_property = ts.join(',');
                let from_price = this.searchData.from_price;
                let to_price = this.searchData.to_price;
                if(this.searchData.transport_property.length===0){
                    this.$message({type:"warning",message:'请选择产品物流属性',duration:2000});
                }else {
                    this.$http(api_edit_template,{all_country_shipping,id:id,name:name,transport_property:transport_property,from_price:from_price,to_price:to_price}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.dialog = false;
                        this.$emit('search')
                    }).catch(code=>{
                        this.$message({type:"warning",message:code.message||code})
                    })
                }
            },
            search_data(){
                let cur = {},table=[];
                let countries = [];
                if(this.form.countries){
                    countries = this.form.countries.split('\n').map(row=>row.trim());
                    cur.country=countries
                }
                this.form.isUsing!==""&&(cur.enabled= this.form.isUsing?true:false);
                this.form.usingFreight!==""&&(cur.use_product_shipping = this.form.usingFreight?0:1);//0表示自定义  1表示
                this.form.isWeUsing!==""&&(cur.wish_express= this.form.isWeUsing?true:false);
                this.newTableList = this.tables.filter(row=>{
                    return this.cale(row,cur)
                });
            },
            isClosed(item){
                if(item.closed){
                    item.use_product_shipping = '';
                    item.shipping_price = 0;
                }
                return item.closed;
            },
            open(){
                this.ruleForm={
                    modelName:'',
                    minSale:'',
                    maxSale:'',
                    type:[],
                };
                this.init_data();
            },
            change_country(val){
                if(!val.enabled){
                    val.use_product_shipping = '';
                    val.shipping_price = 0;
                }else if(val.enabled&&val.use_product_shipping===''){
                    val.use_product_shipping = 1;
                }
            },
            change_start(item){
                if(item.enabled){
                    if(item.closed){
                        item.closed = false;
                    }
                }
                this.change_country(item);
            },
            change_shield(item){
                if(item.closed){
                    if(item.enabled){
                        item.enabled = false;
                    }
                    if(item.wish_express){
                        item.wish_express = false;
                    }
                }
                this.change_country(item);
            },
            change_wish_express(item){
                item.wish_express = !item.wish_express;
                if(item.wish_express){
                    if(item.closed){
                        item.closed = false;
                    }
                    if(!item.enabled){
                        item.enabled = true;
                    }
                }
                this.change_country(item);
            },
            change_dialog(val){
                if(val)this.init_data();
            },
            add_params(){
                let curObj = this.newTableList.find(row=>{return (!!row.enabled&&row.use_product_shipping==='')||(!row.enabled&&row.use_product_shipping!=='')});
                if(curObj)return this.$message({type:"warning",message:"数据有必填项未补充完整!"});
                let all_country_shipping = window.clone(this.newTableList).filter(res=>(!!res.enabled&&res.use_product_shipping!=='')||res.closed);
                all_country_shipping.forEach(row=>{
                    row.enabled=row.enabled?1:0;
                    row.closed = row.closed?1:0;
                    if(row.use_product_shipping===1){
                        delete row.shipping_price
                    }
                });
                return all_country_shipping;
            },
            cale(row,obj){
                let flag=true;
                for(let i in obj){
                    if(typeof obj[i]==="object"){
//                        let a=obj[i].findIndex(item=> item===row[i]);
                        let a=obj[i].findIndex(item=>{
                            let curRow = row[i].toLowerCase();
                            let curItem = item.toLowerCase();
                            return curRow.includes(curItem)
                        });
                        if(a===-1){
                            flag=false;
                            break;
                        }
                    }else {
                        if(row[i]!==obj[i]){
                            flag=false;
                            break;
                        }
                    }
                }
                return flag
            },
            get_start_using(name,Array){
                if(name==='country'){
                    let cur = Array.find(row=>!row.enabled);
                    return !cur;
                }else{
                    let cur = Array.find(row=>!row.wish_express);
                    return !cur;
                }
            },
            set_start_using(name,Array,val){
                if(name==='country'){
                    Array.forEach(row=>{
                        row.enabled = val;
                        if(row.enabled){
                            if(row.closed){
                                row.closed = false;
                                this.closedCountry = false;
                            }
                        }
                        this.change_country(row);
                    });
                }else{
                    Array.forEach(row=>{
                        row.wish_express = val;
                        if(row.wish_express){
                            if(!row.enabled){
                                row.enabled = true;
                            }
                            if(row.closed){
                                row.closed = false;
                                this.closedCountry = false;
                            }
                        }
                        this.change_country(row);
                    });
                }
            },
            init_data(){
                this.isLoad = true;
                this.$http(api_get_wish_expressData).then(res=>{
                    this.$nextTick(()=>{
                        res.forEach(k=>{
                            if(this.searchData.all_country_shipping.some(row=>k.country===row.ProductCountryShipping.country)){
                                let i = this.searchData.all_country_shipping.find(row2=>k.country===row2.ProductCountryShipping.country);
                                k.enabled= i.ProductCountryShipping.enabled?true:false;
                                k.use_product_shipping = i.ProductCountryShipping.use_product_shipping;
                                k.closed = i.ProductCountryShipping.closed?true:false;
                                  if(typeof (i.ProductCountryShipping.shipping_price)==='number'){
                                      k.shipping_price = i.ProductCountryShipping.shipping_price
                                  }else {
                                      if(i.ProductCountryShipping.shipping_price.includes('Use')){
                                          k.shipping_price = 0
                                      }else {
                                          k.shipping_price = i.ProductCountryShipping.shipping_price
                                      }
                                  }
                            }
                        });
                        this.newTableList=res;
                    })
                    this.isLoad = false;
                }).catch(code=>{
                    this.isLoad = false;
                    this.$message({type:"error",message:code});
                })
            },
            //应用到所有
            aplay(item){
                if(!item.enabled)return;
                this.newTableList.forEach(row=>{
                    if(!!row.enabled){
                        row.use_product_shipping=item.use_product_shipping;
                        row.shipping_price=item.shipping_price;
                    }else {
                        row.shipping_price=0
                    }
                })
            },
        },
        props:{
            value:{},
            // productId:{
            //     require:true
            // },
            searchData:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            orderInput:require('@/components/order-input.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTable:require('@/components/ui-table.vue').default,
            ulLimitNumber:require('@/components/ui-limit-number.vue').default
        }
    }
</script>
