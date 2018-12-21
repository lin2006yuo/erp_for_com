<template>
    <page-dialog v-model="dialog" size="small" @open="open"
                 title="生成UPC" width="350px"
                 :close-on-click-modal="false">
        <div style="display: flex;">
            <label class="required-sign" style="width:105px;line-height: 26px;">请输入生成数量：</label>
            <el-input-number v-model="number"
                             style="flex: 1;"
                             :controls="false"
                             :min="1"
                             class="inline width-super"></el-input-number>
        </div>
        <el-input
                class="mt-md"
                type="textarea"
                :autosize="{ minRows: 12, maxRows: 15}"
                placeholder="请输入内容"
                v-model="upcData">
        </el-input>
        <div slot="footer">
            <request-button class="inline"
                            reqKey="generate-upc"
                            @click="generate_upc"
                            :mintime="300">生成</request-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">{{$t('common.cancel')}}</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_upc} from '@/api/amazon-publish-info';
    export default {
        data() {
            return {
                dialog:this.value,
                number:"",
                upcData:'',
            }
        },
        methods:{
            generate_upc(){
                if(!this.number)return this.$message({type:'warning',message:'数量不正确，请重新填写！'});
                this.$http(api_get_upc,this.number).then(res => {
                    this.upcData = res.data.join('\n');
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.$reqKey('generate-upc',false)
                })
            },
            open(){
                this.number = "";
                this.upcData = '';
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
            value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            integerInput:require('@/components/integer-input.vue').default,
        }
    }
</script>