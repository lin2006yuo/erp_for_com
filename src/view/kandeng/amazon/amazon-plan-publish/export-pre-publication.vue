<template>
    <page-dialog title="选择真实目标账号" v-model="downVisible" @open="open_dialog"
                 size="small" :close-on-click-modal="false">
        <div class="ml-lg">
            <label><sup class="red">*</sup>账号：</label>
            <super-select v-model="user" :options="amazonAccountSales" class="inline s-width-large"
                          storageKey="amazonAccountSales"></super-select>
        </div>
        <div slot="footer">
            <request-button type="primary" size="mini"
                            reqKey="preExport"
                            @click="down_excel">导出</request-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_amazon_account_sales} from '../../../../api/amazon-publish';
    export default {
        data() {
            return {
                downVisible:this.value,
                amazonAccountSales:[],
                user:'',
            }
        },
        methods:{
            down_excel(){
                let findObj = this.amazonAccountSales.find(row=>row.value===this.user);
                if(!findObj)return this.$message({type:'warning',message:'未找到对应的账号数据'});
                this.$emit('down-excel',findObj);
            },
            get_account_sales(){
                this.$http(api_amazon_account_sales).then(res=>{
                    this.amazonAccountSales = res.map(row=>{
                        return {
                            value:row.account_id,
                            label:row.code
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            open_dialog(){
                this.user = '';
                this.get_account_sales();
            },
        },
        watch:{
            downVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.downVisible = val;
            },
        },
        props:{
            value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog').default,
        }
    }
</script>
