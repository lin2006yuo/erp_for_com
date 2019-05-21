<template>
    <div class="c-batch-mdf-account">
        <page-dialog :title="title" v-model="dialog" size="small" @open="open" :close-on-click-modal="false">
            <el-form :model="form"  label-width="120px" >
                <el-form-item :label="$t('ebay-list.virtualWarehouseDelivery')" class="mt-lg">
                    <el-radio  v-model="form.ware" class="ml-lg" :label="1">{{$t('ebay-list.yes')}}</el-radio>
                    <el-radio  v-model="form.ware" :label="0">{{$t('ebay-list.no')}}</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button class="inline" @click="submit">{{$t('common.confirm')}}</request-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<script>
    export default {
        name: "batch-real-ware",
        data(){
            return{
               dialog:this.value,
               form:{
                   ware:0,
                },
            }
        },
        watch:{
            value(val){this.dialog=val},
            dialog(val){
                this.$emit('input',val);
            },
        },
        methods:{
            open(){
                this.form.ware=0;
            },
            submit(){
                this.$emit('submit',this.form.ware);
            },
        },
        props:{
          title:{},
          value:{
              type:Boolean,
          }
        }
    }
</script>

<style scoped>

</style>
