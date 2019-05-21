<template>
    <page-dialog :title="$t('ymx-list.bulkTitle')" v-model="dialog"
                 size="large" :close-on-click-modal="false" @open="open_dialog">
        <table class="pi-liang" style="width: 100%;margin-top: 30px;" cellspacing="0">
            <tr style="background-color: #eff2f7">
                <td style="width: 30%">{{$t('ymx-list.platsku')}}</td>
                <td>{{$t('ymx-list.upTitle')}}</td>
            </tr>
            <tr v-for = "(item, index) in selectProduct">
                <td>{{item.seller_sku}}</td>
                <td>
                    <el-input v-model="item.new_item_name" type="textarea"></el-input>
                    <span style="line-height: 30px;padding-left: 10px;">{{item.item_name}}</span>
                </td>
            </tr>
        </table>
        <div style="margin-top: 20px;">
            <label>{{$t('ymx-list.find')}}：</label><el-input class="inline" v-model="titleFind"></el-input>
            <label>{{$t('ymx-list.replace2')}}：</label><el-input class="inline" v-model="titleReplace" @blur="replace_find"></el-input>
        </div>
        <div style="text-align: right; margin-top: 10px;">
            <el-button type="primary" size="mini" @click="update_title_affirm">{{$t('common.confirm')}}</el-button>
            <el-button size="mini" @click="dialog = false">{{$t('common.cancel')}}</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_edit_listing} from '@/api/amazon-publish-list';
    export default {
        data() {
            return {
                dialog:this.value,
                titleFind:'',
                titleReplace:''
            }
        },
        mounted(){

        },
        methods:{
            open_dialog(){
                this.titleFind = '';
                this.titleReplace = '';
            },
            replace_find(val){
                if(this.titleFind === ''){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.selectSearch')
                    });
                }else{
                    let reg = new RegExp(this.titleFind,'g');
                    this.selectProduct.forEach(item=>{
                        item.new_item_name = item.new_item_name.replace(reg, this.titleReplace);
                    })
                }
            },
            update_title_affirm(){
                let result =  this.selectProduct.map(item=>{
                    return {
                        amazon_listing_id:item.amazon_listing_id,
                        account_id:item.account_id,
                        new_value:item.new_item_name,
                        old_value:item.item_name
                    }
                });
                let data = {
                    type:'itemname',
                    data:result,
                };
                this.$http(api_edit_listing,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.dialog = false;
                    this.$emit('update-title',result);
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{},
            selectProduct:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog').default,
        }
    }
</script>
