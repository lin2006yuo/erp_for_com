<template>
    <div class="c-save-new-oe">
        <page-dialog v-model="dialog" title="另存" size="small" :close-on-click-modal="false">
            <el-form :model="form" label-width="100px" ref='formData'>
                <el-form-item label="OE ID：" required>
                    <el-input v-model="form.number" class="inline width-65"></el-input>
                </el-form-item>
                <el-form-item label="Item ID：">
                    <el-input v-model="form.item_id" class="inline width-65"></el-input>
                </el-form-item>
                <el-form-item label="SPU：">
                    <el-input v-model="form.spu" class="inline width-65"></el-input>
                </el-form-item>
                <el-form-item label="工厂型号：">
                    <el-input v-model="form.factory_model" class="inline width-65"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary"
                           size="mini"
                           @click.native="submit"
                           class="inline">保存</el-button>
                <el-button size="mini"
                           @click.native="dialog=false"
                           class="inline">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-save-new-oe{
        .width-65{
            width:65%;
        }
    }
</style>
<script>
    import {api_ebay_oe_save} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                dialog:this.value,
                form:{
                    number:"",
                    item_id:"",
                    spu:"",
                    factory_model:"",
                },
                rules:{
                    number:[
                        {required:true,message:"OE ID要求必填!",}
                    ]
                }
            }
        },
        methods:{
            submit(){
                if(!this.form.number)return this.$message({type:"warning",message:"OE ID要求必填!"});
                this.$emit('submit',this.form);
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{}
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>