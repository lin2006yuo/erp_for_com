<template>
    <div class="c-batch-mdf-price">
        <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false">
            <el-form  label-width="120px" class="mt-lg">
                <el-form-item label="刊登天数：">
                    <el-select v-model="days"
                               style="width:80%"
                               filterable clearable>
                        <el-option
                                v-for="res in comList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button
                           req-key="batchMdfTime"
                           :mintime="300"
                           @click="submit"
                           class="inline">确定</request-button>
                <el-button @click.native="dialog = false"
                           size="mini"
                           class="inline">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_up_listing_duration,api_ebay_d_chinese_listing_duration} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                dialog:this.value,
                days:''
            }
        },
        methods:{
            submit(){
                if(this.days===''){
                    this.$reqKey('batchMdfTime',false);
                    return this.$message({type:"warning",message:"尚未选择刊登天数！"});
                }
                if(this.type === '一口价'){
                    let params = this.paramData.map(row=>{
                        return {
                            item_id:row.item_id,
                            listing_sku:row.listing_sku,
                            listing_type:row.listing_type,
                            listing_duration:row.listing_duration,
                            old_listing_duration:this.days,
                            account_id:row.account_id,
                            site:row.site,
                            cron_time:'',
                            remark:'',
                        }
                    });
                    this.$http(api_up_listing_duration,{data:params}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.dialog = false;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message||code});
                    }).finally(()=>{
                        this.$reqKey('batchMdfTime',false)
                    })
                }else{
                    let params = this.paramData.map(row=>{
                        return {
                            id:row.id,
                            listing_duration:this.days
                        }
                    });
                    this.$http(api_ebay_d_chinese_listing_duration,{data:params}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.dialog = false;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message||code});
                    }).finally(()=>{
                        this.$reqKey('batchMdfTime',false)
                    })
                }
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
        computed:{
            comList(){
                let list1 = [
                    {label:"3天",value:3},
                    {label:"5天",value:4},
                    {label:"7天",value:5},
                    {label:"10天",value:6},
                    {label:"30天(此选项仅用于店铺与部分平台)",value:7},
                    {label:"GTC(此选项仅用于店铺)",value:1},
                ];
                let list2 = [
                    {label:"1天",value:2},
                    {label:"3天",value:3},
                    {label:"5天",value:4},
                    {label:"7天",value:5},
                    {label:"10天",value:6},
                ];
                return this.type==='一口价'?list1:list2;
            }
        },
        props:{
            value:{},
            paramData:{
                /*提交所需要的参数
                * item_id/listing_sku/listing_duration/old_listing_duration/account_id/site/cron_time/remark
                * */
                required:true,
                type:Array
            },
            type:{
                /*
                * type:'一口价':'拍卖'
                * */
                required:true,
                type:String,
            },
            title:{
                required:true,
                type:String
            }
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            labelItem:require('../../../../../components/label-item.vue').default,
        }
    }
</script>