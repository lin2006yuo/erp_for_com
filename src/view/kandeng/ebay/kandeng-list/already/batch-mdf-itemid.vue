<template>
    <div class="c-batch-mdf-price">
        <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false" @open="open">
            <el-form  label-width="120px" class="mt-lg" @submit.native.prevent>
                <el-form-item label="ItemId：">
                    <el-input v-model.trim="item_id" style="width:80%"
                              filterable clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button
                    req-key="batchMdfTime"
                    :mintime="300"
                    @click="submit"
                    class="inline">{{$t('common.confirm')}}</request-button>
                <el-button @click.native="dialog = false"
                           size="mini"
                           class="inline">{{$t('common.close')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_up_listing_itemid} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                dialog:this.value,
                item_id:''
            }
        },
        methods:{
            open(){
                this.item_id=''
            },
            submit(){
                if(this.item_id===''){
                    this.$reqKey('batchMdfTime',false);
                    return this.$message({type:"warning",message:"尚未填写ItemId！"});
                }

                this.$http(api_up_listing_itemid,{item_id:this.item_id}).then(res=>{
                    if(!res.data){
                        this.$message({type:"success",message:res.message||res});
                    }else {
                        this.$message({type:"success",message:'同步成功'});
                    }
                    this.$emit('mdf',res)
                    this.dialog = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('batchMdfTime',false)
                })

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
            title:{
                required:true,
                type:String
            }
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>
