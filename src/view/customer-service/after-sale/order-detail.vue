<template>
    <div class="c-order-detail">
        <page-dialog v-model="dialog" size="large" :title="`查看订单: ${orderNumber} 信息`">
            <form-mdf ref="formmdf"
                      :mdfid="orderId"
                      :forms="forms"
                      :btn-show="btnShow"
                      @submit-note="submit_note"
                      @delete-note="delete_note"></form-mdf>
            <div slot="footer">
                <el-button type="default" size="mini" class="inline" @click.native="dialog=false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {get_find} from '../../../api/after-sale';
    export default {
        data() {
            return {
                dialog:false,
                orderId:"",
                forms:{},
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
                if(val){
                    this.get_find_();
                }
            }
        },
        methods:{
            get_find_(){
                this.$http(get_find,{content:this.orderNumber}).then(res=>{
                    this.orderId = res.id;
                    this.$set(this.forms,this.orderId,res);
                }).catch(code=>{
                    console.log(code);
                })
            },
            submit_note(){
                this.get_find_();
            },
            delete_note(){
                this.get_find_();
            },
        },
        props:{
            value:{},
            orderNumber:{},
            btnShow:{
            }
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            formMdf:require('./form-mdf-after.vue').default
        }
    }
</script>
