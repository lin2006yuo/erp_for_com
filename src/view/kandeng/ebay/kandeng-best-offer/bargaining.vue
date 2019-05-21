<template>
    <page-dialog v-model="show" size="small" :title=title
                 @open="open"
                 class="p-batch-edit" :close-on-click-modal="false">
        <el-form :model="bargain" ref="bargain" label-width="70px">
            <el-form-item label="我的开价：" prop="counterOfferPrice"  v-if="!reject" required>
                <ui-limit-number style="width:100px"
                                 class="inline"
                                 :limit="999999"
                                 v-model="bargain.counterOfferPrice"
                ></ui-limit-number><span> AUD</span>
            </el-form-item>
            <el-form-item label="开价数量：" prop="counterOfferQuantity" v-if="!reject" required>
                <ui-limit-number style="width:100px"
                                 class="inline"
                                 v-model="bargain.counterOfferQuantity"
                ></ui-limit-number><span>（数量不能多于买家提出的数量）</span>
            </el-form-item>
            <el-form-item label="我要留言：" prop="message">
                <el-input type="textarea" v-model="bargain.message" class="messageWidth"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="submit" type="primary" :disabled="disabled">{{$t('common.confirm')}}</el-button>
            <el-button size="mini" @click.native="close" >{{$t('common.close')}}</el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_best_offer_batch} from '@/api/ebay-kandeng-public-module';
    export default {
        name: "bargaining",
        data(){
            return{
                title:'BestOffer处理：议价',
                disabled:true,
                show:this.value,
                bargain:{
                    action:'counter',
                    bestOfferIds:this.bestOfferId,
                    counterOfferPrice:'',//议价价格
                    counterOfferQuantity:'',//议价数量
                    message:''
                }
            }
        },
        watch:{
            'bargain.counterOfferPrice'(val){
                if(val!==''&&this.bargain.counterOfferQuantity!==''){
                    this.disabled=false;
                }else if(!this.reject){
                    this.disabled=true;
                }
            },
            'bargain.counterOfferQuantity'(val){
                if(val!==''&&this.bargain.counterOfferPrice!==''){
                    this.disabled=false;
                }else if(!this.reject){
                    this.disabled=true;
                }
            },
            value(val){this.show=val},
            show(val){this.$emit('input',val)}
        },
        methods:{
            open(){
                this.bargain.bestOfferIds=this.bestOfferId;
                this.bargain.counterOfferPrice='';
                this.bargain.message='';
                this.bargain.counterOfferQuantity='';
                if(this.reject){
                    this.title='BestOffer处理：拒绝';
                    this.disabled=false;
                }else {
                    this.title='BestOffer处理：议价';
                    this.disabled=true;
                }
            },
            submit(){
                if(this.reject){//拒绝
                    this.bargain.action='decline';
                }else {
                    this.bargain.action='counter';
                }
                let data = clone(this.bargain);
                this.show=false;
                this.$http(api_best_offer_batch,data).then(res=>{
                    this.$emit('change-status')
                    this.$message({type:"success",message: res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message: code.message||code});
                })
            },
            close(){
                this.show=false;
            }
        },
        components:{
            uiLimitNumber:require('@/components/ui-limit-number.vue').default,
        },
        props:{
            reject:{},
            value:{

            },
            bestOfferId:{}
        }
    }
</script>

<style scoped>
    .messageWidth{width: 80%}
</style>
