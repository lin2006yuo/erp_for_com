<template>
    <div class="c-change-published-image.vue">
        <page-dialog :title="$t('ymx-list.mdfImg')" v-model="dialog" size="large" :close-on-click-modal="false">
            <img-add v-model="rowData.images"
                     class="mt-lg"
                     :default-random="false"
                     :show-swatch-img="true"
                     :id="rowData.goods_id"
                     :baseUrl="rowData.baseUrl"></img-add>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">{{$t('common.confirm')}}</el-button>
                <el-button size="mini" class="inline" @click.native="dialog = false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_resend_images,api_edit_listing} from '@/api/amazon-publish-list';
    export default {
        data() {
            return {
                dialog:this.value,
            }
        },
        methods:{
            submit(){
                let imageList = this.rowData.images.map((row,index)=>{
                    return {
                        path:row.path,
                        is_default: index === 0 ? 1 : 0,
                        is_swatch: row.isSwatch
                    }
                });
                let params = [{
                    account_id:this.rowData.account_id,
                    amazon_listing_id:this.rowData.amazon_listing_id,
                    new_value:imageList,
                    old_value:'',
                }];
                this.$http(api_edit_listing,{type:'image',data:params}).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    this.dialog = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
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
            value:{
                required:true,
                type:Boolean
            },
            rowData:{
                required:true,
                type:Object
            },
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            imgAdd: require('../../../../components/img-add.vue').default,

        }
    }
</script>