<template>
    <div class="p-batch-edit">
        <page-dialog :title="titles" size="large"  v-model="show" :close-on-click-modal="false"   @change="change_dialog" >
                    <div  v-if="flag===1" >
                        <el-row>
                            <el-col :span="4" style="width: 150px">
                            <el-radio  v-model="title.select" label="1">添加前后缀</el-radio>
                            </el-col>
                            <el-col :span="20">
                                    <el-row class="mb-xs">
                                        <el-checkbox v-model="title.prefix.isPre">前缀</el-checkbox>
                                        <el-input v-model="title.prefix.pre" placeholder="请输入内容"
                                                  class="inline" style="width:400px"></el-input>
                                    </el-row>
                                <el-row class="mb-xs">
                                    <el-checkbox v-model="title.prefix.isSuf">后缀</el-checkbox>
                                    <el-input v-model="title.prefix.suf" placeholder="请输入内容"
                                              class="inline" style="width:400px"></el-input>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4" style="width: 150px">
                                <el-radio  v-model="title.select" label="2">查找并替换</el-radio>
                            </el-col>
                            <el-col :span="20">
                                    <el-row class="mb-xs" style="padding-left: 18px;">
                                        查找 <el-input v-model="title.find.value" placeholder="请输入内容"
                                                     class="inline" style="width:400px"></el-input>
                                    </el-row>
                                <el-row  class="mb-xs" style="padding-left: 18px;">
                                    替换 <el-input v-model="title.find.replace" placeholder="请输入内容"
                                                 class="inline" style="width:400px"></el-input>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4" style="width: 150px">
                                <el-radio  v-model="title.select" label="3">统一修改为</el-radio>
                            </el-col>
                            <el-col :span="20" style="padding-left: 45px;">
                                <el-input v-model="title.unite" placeholder="请输入内容"
                                          class="inline" style="width:400px"></el-input>
                            </el-col>
                        </el-row>
                        <!--<el-row>-->
                            <!--<el-radio  v-model="title.select" label="4">过滤重复词</el-radio>-->
                        <!--</el-row>-->
                        <el-row>
                            <el-radio  v-model="title.select" label="5">首字母改大写</el-radio>
                        </el-row>
                        <el-row>
                            <el-button size="mini"
                                       @click.native="title_preview"
                                       type="primary"
                                       class="mt-sm mb-sm fr">预览</el-button>
                        </el-row>

                        <el-table
                                :data="tableData"
                                style="width: 100%">
                            <el-table-column
                                    prop="product_id"
                                    label="商品ID"
                                    >
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="修改前"
                                    >
                            </el-table-column>
                            <el-table-column
                                    prop="newName"
                                    label="修改后">
                            </el-table-column>
                        </el-table>

                    </div>
                    <div v-if="flag===2">
                        <el-row>
                            <el-col :span="2" style="width: 150px">
                                <el-radio  v-model="salePrice.select" label="1">统一售价</el-radio>
                            </el-col>
                            <el-col :span="16">
                                <ui-limit-number  v-model="salePrice.price" :limit="2" class="inline">

                                </ui-limit-number>
                            </el-col>
                        </el-row>
                        <el-row class="mt-xs">
                            <el-col :span="2" style="width: 150px">
                                <el-radio  v-model="salePrice.select" label="2">售价涨幅</el-radio>
                            </el-col>
                            <el-col :span="16">
                                <ui-limit-number  v-model="salePrice.increase.value" :limit="2" class="inline">
                                </ui-limit-number>
                                <span>%</span>
                                <el-checkbox v-model="salePrice.increase.isInt">取整</el-checkbox>
                                <el-radio  v-model="salePrice.increase.intValue" label="1">进一法</el-radio>
                                <el-radio  v-model="salePrice.increase.intValue" label="2">四舍五入法</el-radio>
                                <el-radio  v-model="salePrice.increase.intValue" label="3">去尾法</el-radio>
                            </el-col>
                        </el-row>
                        <!--bug#4415  去掉提示 -->
                        <!--<el-row>-->
                            <!--小提示：如果减少，可输入负数-->
                        <!--</el-row>-->
                        <el-row>
                            <el-button size="mini"
                                       @click.native="price_preview"
                                       type="primary"
                                       class="mt-sm mb-sm fr">预览</el-button>
                        </el-row>
                        <el-table
                                :data="tableData"
                                style="width: 100%">
                            <el-table-column
                                    prop="product_id"
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
                    </div>
                     <div v-if="flag===3">
                         <label class="inline">批量修改运费为($)： </label>
                         <ui-limit-number  v-model="shipping" :limit="2" class="inline"></ui-limit-number>
                         <el-row>
                             <el-button size="mini"
                                        @click.native="shipping_preview"
                                        type="primary"
                                        class="mt-sm mb-sm fr">预览</el-button>
                         </el-row>
                         <el-table
                                 :data="tableData"
                                 style="width: 100%">
                             <el-table-column
                                     prop="product_id"
                                     label="商品ID"
                             >
                             </el-table-column>
                             <el-table-column
                                     prop="shipping"
                                     label="修改前"
                             >
                             </el-table-column>
                             <el-table-column
                                     prop="newShipping"
                                     label="修改后">
                             </el-table-column>
                         </el-table>

                     </div>
                    <div v-if="flag===5">
                        <label class="inline">批量修改可售数为：</label>
                        <!--<el-input-number size="small"-->
                                         <!--v-model="counts"-->
                                         <!--style="width:70px"-->
                                         <!--:debounce="0"-->
                                         <!--:controls="false">-->
                        <!--</el-input-number>-->
                        <ui-limit-number v-model="counts"
                                         class="inline width-sm"></ui-limit-number>
                        <el-row>
                            <el-button size="mini"
                                       @click.native="counts_preview"
                                       type="primary"
                                       class="mt-sm mb-sm fr">预览</el-button>
                        </el-row>
                        <el-table
                                :data="tableData"
                                style="width: 100%">
                            <el-table-column
                                    prop="product_id"
                                    label="商品ID"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="inventory"
                                    label="修改前"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="newInventory"
                                    label="修改后">
                            </el-table-column>
                        </el-table>
                     </div>
                    <div v-if="flag===6">
                         <label class="inline">批量修改发货期为：</label>
                        <el-input-number size="small"
                                         v-model="shipTime[0]"
                                         style="width:70px"
                                         :debounce="0"
                                         :controls="false">
                        </el-input-number> <span>-</span>
                        <el-input-number size="small"
                                         v-model="shipTime[1]"
                                         style="width:70px"
                                         :debounce="0"
                                         :controls="false">
                        </el-input-number>
                        <el-row>
                            <el-button size="mini"
                                       @click.native="shipTime_preview"
                                       type="primary"
                                       class="mt-sm mb-sm fr">预览</el-button>
                        </el-row>
                        <el-table
                                :data="tableData"
                                style="width: 100%">
                            <el-table-column
                                    prop="product_id"
                                    label="商品ID"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="shipping_time"
                                    label="修改前"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="newShipping_time"
                                    label="修改后">
                            </el-table-column>
                        </el-table>
                     </div>
                    <div v-if="flag===4">
                        <el-row class="mb-xs">
                            <el-col :span="8" style="width: 150px">
                                <el-radio  v-model="msrp.select" label="1">统一售价</el-radio>
                            </el-col>
                            <el-col :span="16">
                                <ui-limit-number  v-model="msrp.price" :limit="2" class="inline"  style="width:200px"></ui-limit-number>
                            </el-col>
                        </el-row>
                        <el-row class="mb-xs">
                            <el-col :span="8" style="width: 150px">
                                <el-radio  v-model="msrp.select" label="2">价格公式</el-radio>
                            </el-col>
                            <el-col :span="16">
                                <ui-limit-number  v-model="msrp.multiple" :limit="1" class="inline"  style="width:200px"></ui-limit-number>
                                <span>×(销售价+运费) 即：吊牌价等于销售价加上运费之和再乘以某倍数</span>
                            </el-col>
                        </el-row>
                        <el-row class="mb-xs">
                            <el-col :span="8" style="width: 150px">
                                <el-radio  v-model="msrp.select" label="3">售价涨幅</el-radio>
                            </el-col>
                            <el-col :span="16">
                                <ui-limit-number  v-model="msrp.increase.value" :limit="1" class="inline"  style="width:200px"></ui-limit-number>%
                                <el-checkbox v-model="msrp.increase.isInt">取整</el-checkbox>
                                <el-radio  v-model="msrp.increase.intValue" label="1">进一法</el-radio>
                                <el-radio  v-model="msrp.increase.intValue" label="2">四舍五入法</el-radio>
                                <el-radio  v-model="msrp.increase.intValue" label="3">去尾法</el-radio>
                            </el-col>
                        </el-row>
                        <!--bug#4415  去掉提示 -->
                        <!--<el-row>-->
                            <!--小提示：如果减少，可输入负数-->
                        <!--</el-row>-->
                        <el-row>
                            <el-button size="mini"
                                       @click.native="msrp_preview"
                                       type="primary"
                                       class="mt-sm mb-sm fr">预览</el-button>
                        </el-row>
                        <el-table
                                :data="tableData"
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
                    </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="keep" type="primary"  >保存待同步平台</el-button>
                <el-button size="mini" @click.native="show=false" >关   闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
</style>
<script>
  import {api_wish_batch_edit} from "../../../../api/kandeng"
    export default{
        data(){
            return {
                isEdit:false,
                show:false,
                tableData:[],
                title:{
                    select:"",
                    prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                    find:{value:"",replace:""},
                    unite:""
                },
                salePrice:{
                    select:"",
                    price:"",
                    increase:{value:"",isInt:false,intValue:""}
                },
                shipping:"",
                counts:"",
                shipTime:["",""],
                msrp:{
                    select:"",
                    price:"",
                    multiple:"",
                    increase:{value:"",isInt:false,intValue:""}
                }
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {
            titles(){
                switch (this.flag){
                    case 1:
                        return "修改刊登标题"
                    break;
                    case 2:
                        return "修改销售价"
                        break;
                    case 3:
                        return "修改运费"
                        break;
                    case 5:
                        return "修改可售数量"
                        break;
                    case 6:
                        return "修改发货期"
                        break;
                    case 4:
                        return "修改吊牌价";
                        break;
                }
            }
        },
        methods: {
            title_preview(){
                    if(!this.title.select){
                        this.$message({type:'warning',message:"请选择修改方式"})
                        return;
                    }
                    let flag=true;
                    switch (this.title.select){
                        case "1":      //选择前缀 或者后缀
                         if(this.title.prefix.isPre&&this.title.prefix.isSuf){
                             this.tableData.forEach(row=>{
                                this.$set(row,"newName",this.title.prefix.pre+row.name+this.title.prefix.suf)
                             })
                         }else if(this.title.prefix.isPre&&!this.title.prefix.isSuf){
                             this.tableData.forEach(row=>{
                                 this.$set(row,"newName",this.title.prefix.pre+row.name)
                             })
                         }else if(!this.title.prefix.isPre&&this.title.prefix.isSuf){
                             this.tableData.forEach(row=>{
                                 this.$set(row,"newName",row.name+this.title.prefix.suf)
                             })
                         }else {
                             flag=false
                             this.$message({type:'warning',message:"请选择加前缀或后缀"})
                         }
                            break;
                        case "2":   //查找替换
                            if(this.title.find.value===""){
                                flag=false
                                this.$message({type:'warning',message:"请选择要替换的内容"})
                            }else {
                                this.tableData.forEach(row=>{
                                    let reg=new RegExp(this.title.find.value,"g")
                                    let name=row.name.replace(reg,this.title.find.replace)
                                    this.$set(row,"newName",name)
                                })
                            }
                            break;
                        case "3":  //统一修改
                            if(this.title.unite===""){
                                flag=false
                                this.$message({type:'warning',message:"请选择要替换的内容"})
                            }else {
                                this.tableData.forEach(row=>{
                                    this.$set(row,"newName",this.title.unite)
                                })
                            }
                            break;
                        case "4": //过滤重复词
                            break;
                        case "5": //首字母大写
                            this.tableData.forEach(row=>{
                                let name= row.name.split(/\s+/);
                                name= name.map(rows=>{
                                    rows=this.up_first_letter(rows)
                                    return rows;
                                });
                                this.$set(row,"newName",name.join(' '))
                            })
                            break;
                    }
                    return flag
            },
            price_preview(){
                let flag=true;
                if(!this.salePrice.select){
                    flag=false;
                    this.$message({type:'warning',message:"请选择修改方式"});
                    return;
                }
                switch (this.salePrice.select){
                    case "1":
                        this.tableData.forEach(row=>{
                            this.$set(row,"newPrice", this.salePrice.price)
                        })
                       break;
                    case "2":
                        let getPrice=Number(this.salePrice.increase.value)
                        this.tableData.forEach(row=>{
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
                            this.$set(row,"newPrice",price)
                        })
                }
                return flag
            },
            shipping_preview(){
                        this.tableData.forEach(row=>{
                            this.$set(row,"newShipping",this.shipping)
                        })
            },
            counts_preview(){
                this.tableData.forEach(row=>{
                    this.$set(row,"newInventory",this.counts)
                })
            },
            shipTime_preview(){
                this.tableData.forEach(row=>{
                    this.$set(row,"newShipping_time",this.shipTime[0]+"-"+this.shipTime[1])
                })

            },
            msrp_preview(){
                let flag=true;
                if(!this.msrp.select){
                    flag=false;
                    this.$message({type:'warning',message:"请选择修改方式"})
                    return;
                }
                switch (this.msrp.select){
                    case "1":
                        this.tableData.forEach(row=>{
                            this.$set(row,"newMsrp",this.msrp.price)
                        })
                        break;
                    case "2":
                        this.tableData.forEach(row=>{
                            let price=0;
                            price=(Number(row.price)+ Number(row.shipping))*this.msrp.multiple;
                            this.$set(row,"newMsrp",price)
                        });
                        break;
                    case '3':
                        this.tableData.forEach(row=>{
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
                            this.$set(row,"newMsrp",price)
                        })
                        break;
                }
                return flag;
            },
            //
            up_first_letter(str){  //首字母大写
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
            keep(){
                switch (this.flag){
                    case 1:
                      let flag=this.title_preview();
                     if(flag){
                         let table=this.tableData.map(row=>{
                              return {product_id:row.product_id,name:row.newName}
                         })
                         let data={type:'name',data:table}
                         this.post_data(data) ;
                     }
                        break;
                    case 2:
                        let b=this.price_preview();
                        if(b){
                            let table2=this.tableData.map(row=>{
                                return {variant_id:row.variant_id,price:row.newPrice}
                            })
                            let data2={type:'price',data:table2};
                            this.post_data(data2) ;
                        }
                        break;
                    case 3:
                        this.shipping_preview();
                        let table3=this.tableData.map(row=>{
                            return {variant_id:row.variant_id,shipping:row.newShipping}
                        })
                        let data3={type:'shipping',data:table3};
                        this.post_data(data3) ;
                        break;
                    case 4:
                      let a=this.msrp_preview();
                        if(a){
                            let table4=this.tableData.map(row=>{
                                return {variant_id:row.variant_id,msrp:row.newMsrp}
                            })
                            let data4={type:'msrp',data:table4};
                            this.post_data(data4) ;
                        }
                        break;
                    case 5:
                        this.counts_preview();
                        let table5=this.tableData.map(row=>{
                            return {variant_id:row.variant_id,inventory:row.newInventory}
                        })
                        let data5={type:'inventory',data:table5};
                        this.post_data(data5) ;
                        break;
                    case 6:
                        this.shipTime_preview();
                        let table6=this.tableData.map(row=>{
                            return {variant_id:row.variant_id,shipping_time:row.newShipping_time}
                        })
                        let data6={type:'shipping_time',data:table6};
                        this.post_data(data6) ;
                        break;
                }
            },
            post_data(data){
            this.$http(api_wish_batch_edit,data).then(res=>{
                    this.show=false;
                this.$message({type:"success",message:res.message||res})
                this.$emit("reflash")
            }).catch(code=>{
                this.$message({message:code.message||code,type:'error'})
            })
            },
            change_dialog(val){
                if(!val){
                    this.title={
                        select:"",
                                prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                        find:{value:"",replace:""},
                        unite:""
                    };
                    this.salePrice={
                        select:"",
                                price:"",
                                increase:{value:"",isInt:false,intValue:""}
                    };
                            this.shipping="";
                            this.counts="";
                            this.shipTime=["",""];
                            this.msrp={
                                select:"",
                                price:"",
                                multiple:"",
                                increase:{value:"",isInt:false,intValue:""}
                    }
                }
            }
        },
        filters: {},
        watch: {
            show(val){
                this.$emit("input", val)
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            value:{},
            flag:{
                require:true,
                type:Number,
            }
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiLimitNumber:require("../../../../components/ui-limit-number.vue").default,
        }
    }
</script>
