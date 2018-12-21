<template>
    <page-dialog v-model="show" size="large" title="延长有效期" :close-on-click-modal="false">
        <span>小提示：产品有效期在3天以内的才能修改，大于3天的都不能修改产品有效期。产品有效期延长方式为：自动延长至初始刊登时所选择的有效期天数。</span>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <request-button :mintime="200" :request="keep" req-key="product_keep">保存待同步平台</request-button>
            <el-button size="mini" @click.native="close">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_aliexpress_batch_eff
    } from "../../../../../api/publish-smt"
	export default{
		data(){
			return {
                show:this.value,
                delivery:{
                    select:"",
                    text:0,
                    add:0
                },
                minAdd:0,
            }
		},
        methods:{
            close(){
                this.show=false;
            },
            keep(){
                let data= this.selectedIds.map(row=>{
                    return row.product_id;
                });
                return this.$http(api_aliexpress_batch_eff,{productIds:data.join(",")}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('product_keep',false);
                    },200);
                });
            },
        },
        watch: {
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val)
            },
        },
        props:{
			value:{},
            selectedIds:{
            	required:true,
                type:Array,
            }
        },
		components: {
            uiListCheck:require("../../../../../components/ui-list-check.vue").default,
            pageDialog:require('../../../../../components/page-dialog.vue').default
        }
	}
</script>

