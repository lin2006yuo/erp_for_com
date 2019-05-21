<template>
    <page-dialog title="批量修改刊登标题" v-model="dialog" @open="open"
                 size="large" :close-on-click-modal="false">
        <el-table
            class="scroll-bar mb-lg"
            highlight-current-row
            :data="tableData"
        >
            <el-table-column label="范本ID" v-if="status==='2'" inline-template width="150">
                <ui-tip :content="row.id" :width="95"></ui-tip>
            </el-table-column>
            <el-table-column label="商品ID" v-else inline-template width="150">
                <ui-tip :content="row.id" :width="95"></ui-tip>
            </el-table-column>
            <el-table-column label="SPU" inline-template width="150">
                <span @click="bind_spu(row)" class="operate" v-if="row.goods_id===0">
                     <i class="el-icon-information"
                        style="position: absolute;top:50%;margin-top:-6px;left: 5px"
                        title="点击关联"></i>
                    <ui-tip :content="row.spu||'未关联'" style="padding-left: 12px"></ui-tip>
                </span>
                <ui-tip :content="row.spu" v-else></ui-tip>
            </el-table-column>
            <el-table-column label="刊登标题" inline-template>
                <limit-input v-model="row.title"
                             :is-textarea="false"
                             :maxlength="80"
                             :cur-span="22"></limit-input>
            </el-table-column>
        </el-table>
        <label-item label="查找：" class="ml-lg">
            <el-input v-model="searchData" class="width-super"></el-input>
        </label-item>
        <label-item label="替换为：" class="ml-sm">
            <el-input v-model="replaceData" class="width-super"></el-input>
        </label-item>
        <el-button type="primary" size="mini" class="inline ml-sm" @click.native="replace_cur">替换</el-button>
        <div slot="footer">
            <request-button class="inline" @click="submit" :mintime="300"
                            req-key="mdfTitleEbay">确定</request-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
        </div>
        <bind-spu v-model="bindVisable"
                  :is-multiattribute="isMultiattribute"
                  :channel-sku="channelSku"
                  :local-sku="localSku"
                  :is-ebay="true"
                  type="ebay"
                  @valids-ebay="valids_ebay">
        </bind-spu>
        <add-goods v-model="addlistVisable" @selected="selecteds"></add-goods>
    </page-dialog>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {
        api_ebay_variations,
        api_get_relatedProduc,
    } from '../../../api/ebay-kandeng-public-module';
    import {api_add_goods} from "../../../api/supplier-quote"
    export default {
        data() {
            return {
                dialog:this.value,
                searchData:"",
                replaceData:"",
                cron_time:"",
                remark:"",
                isMultiattribute:'',
                addlistVisable:false,
                bindVisable:false,
                channelSku:[],
                localSku:{
                    data:[]
                },
                argumentData:[/*关联参数*/],
                goodsIdSpu:{
                    goods_id:"",
                    spu:"",
                },
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        methods:{
            open(){
                this.tableData.forEach(row=>{
                    this.$set(row,"old_title",row.title);
                })
            },
            replace_cur(){
                if(!this.searchData&&!this.replaceData)return this.$message({type:"warning",message:"数据不存在，无法更换"});
                let reg = new RegExp(this.searchData,'g');
                let search_num = 0;
                this.tableData.forEach((row)=>{
                    if(this.searchData==row.title){
                        search_num += 1;
                        row.title = row.title.replace(reg, this.replaceData);
                    }
                });
                if(search_num===0){
                    this.$message({type:"warning",message:"此标题不存在，无法更换"});
                }else{
                    this.$message({type:"success",message:`替换成功！共替换${search_num}个标题`});
                }
            },
            submit(){
                let data= this.tableData.map(row=>{
                    if(this.status === '2'){
                        return {
                            id:row.id,
                            title:row.title
                        }
                    }else{
                        return {
                            item_id:row.item_id,
                            site:row.site,
                            listing_sku:row.listing_sku,
                            title:row.title,
                            old_title:row.old_title,
                            account_id:row.account_id,
                            cron_time:this.cron_time,
                            remark:this.remark,
                        };
                    }
                });
                this.$emit('submit',data);
            },
            get_detail(ids){
                if(typeof ids ==='array') ids = ids.join(',');
                return this.$http(api_ebay_variations,{ids:ids}).then(res=>{
                    return Promise.resolve(res);
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            bind_spu(res){
                this.get_detail(res.id).then(row=>{
                    let data = row.data[0];
                    this.channelSku = [];
                    this.argumentData = [];
                    let vars = [{id:"",sku_id:"",combine_sku:"",map_sku:[]}];
                    let obj = {
                        id:res.id,
                        listing_type:res.listing_type,
                        goods_id:"",
                        account_id:res.account_id,
                        listing_sku:res.listing_sku,
                        spu:"",
                    };
                    this.argumentData.push(obj);
                    /*-------------------------------我是分割线-------------------------*/
                    this.addlistVisable=true;
                    if(data.varians&&data.varians.length>0){
                        this.isMultiattribute = true;
                        this.channelSku=window.clone(data.varians).map((row,row_i)=>{
                            let obj={
                                id:row.id,
                                sku:row.channel_map_code,
                                sku_id:row.sku_id,
                                local:[
                                    {local_sku_id:"",good_id:'',sku_id:'',quantity:1,local_sku:''}
                                ]
                            };
                            obj.key=data.v_varkey.map((item,index)=>{
                                obj[`color${index}`]=row.variation[item];
                                return {name:item,field:`color${index}`}
                            });
                            return obj;
                        });
                    }else {
                        this.isMultiattribute = false;
                        //todo 无sku时
                        let obj = {
                            listing_sku:res.listing_sku,
                            local:[
                                {quantity:1,local_sku_id:'',local_sku:"",sku_id:"",goods_id:"",}
                            ]
                        };
                        this.channelSku.push(obj);
                    }
                }).catch(code=>{
                    console.log(code);
                });
            },
            valids_ebay(channelSku){
                let oldData = clone(channelSku);
                let curObj = this.argumentData[0];
                curObj.goods_id = this.goodsIdSpu.goods_id;
                curObj.spu = this.goodsIdSpu.spu;
                if(this.isMultiattribute){
                    let vars = [];
                    channelSku.forEach(row=>{
                        let map_sku = row.local.map(res=>{
                            return {
                                sku_id:res.sku_id,
                                goods_id:res.goods_id,
                                sku:res.local_sku
                            }
                        });
                        let combine_sku = row.local.map(res=>{return `${res.local_sku}*${res.quantity}`}).join(',');
                        let obj = {
                            id:row.id,
                            sku_id:row.local[0].sku_id,
                            combine_sku:combine_sku,
                            map_sku:[...map_sku],
                        };
                        vars.push(obj);
                    });
                    this.$set(curObj,'vars',[...vars]);
                }else{
                    curObj.listing_sku = channelSku[0].listing_sku;
                    let sku = channelSku[0].local.map(res=>{return `${res.local_sku}*${res.quantity}`}).join(',');
                    curObj.sku = sku;//todo
                    curObj.local_sku = channelSku[0].local[0].local_sku;
                }
                this.$http(api_get_relatedProduc,{data:this.argumentData}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.bindVisable = false;
                    let cur = this.tableData.find(row=>row.id===curObj.id);
                    if(!!cur) {
                        cur.goods_id=curObj.goods_id;
                        cur.spu=curObj.spu;
                    }
                    this.$emit('change-spu',this.tableData)
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            selecteds(val){
                this.goodsIdSpu.goods_id = val[0].id;
                this.goodsIdSpu.spu = val[0].spu;
                let spu=val.map(row=> row.spu).join(',');
                this.$http(api_add_goods,{page:1,pageSize:100,snType:'spu',snText:spu}).then(res=>{
                    this.localSku=res;
                    this.bindVisable=true;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
        },
        props:{
            value:{},
            tableData:{
                required:true,
                type:Array,
            },
            status:{
            	default(){
            		return '2'
                    // '1' 已刊登
                    // '2' 范本
                }
            },
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            limitInput:require('../../kandeng/ebay/kandeng-list/add-edit-listing/limit-input.vue').default,
            bindSpu:require("../bind-spu.vue").default,
            addGoods:require('../wish/info/add-goods.vue').default,
        }
    }
</script>
