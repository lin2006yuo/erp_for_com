<template>
    <page class="p-dialog">
        <page-dialog
                :title="$t('ymx-heel-sale-list.title')"
                v-model="dialogShow"
                size="large"
                :close-on-click-modal="false"
                @open="open"
                @close="close">
            <label-item :label="$t('ymx-heel-sale-list.designAccount')+'：'" class="ml-sm" style="color: blue">
                <param-account v-model="account_id" class="s-width-default"
                               :fixResult="fixAccount"
                               type="amazonAccount"
                               :placeholder="$t('ymx-heel-sale-list.selectEnter')"
                               url="get|publish/amazon/account"></param-account>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.setAutoPrice')+'：'" style="margin-left: 30px;color: blue">
                <el-radio-group v-model="modify_price_type" @change="set_type">
                    <el-radio class="ml-xs" :label="1">{{$t('ymx-heel-sale-list.percentAdjust')}}</el-radio>
                    <el-input-number class="s-width-mini" :controls="false" :min="0" :max="100" v-model="percent" :disabled="modify_price_type !== 1"></el-input-number>
                    <span class="ml-xs">%</span>
                    <el-radio class="ml-sm" :label="2">{{$t('ymx-heel-sale-list.amountAdjust')}}</el-radio>
                    <el-input-number class="s-width-mini ml-xs" :controls="false" :min="0" v-model="money" :disabled="modify_price_type !== 2"></el-input-number>
                    <el-radio class="ml-sm" :label="0">{{$t('ymx-heel-sale-list.status3')}}</el-radio>
                </el-radio-group>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.designRule')+'：'" style="margin-left: 30px;color: blue">
                <param-account v-model="rule_id" class="s-width-default"
                               type="saleRule"
                               :fixResult="fixRule"
                               :placeholder="$t('ymx-heel-sale-list.selectEnter')"
                               :params="{rule_name: '',status: 0}"
                               url="get|publish/amazon/up-lower-rule-list"></param-account>
            </label-item>
            <div class="ml-sm" style="color: red">
                {{$t('ymx-heel-sale-list.note')}}
                <br>
                {{$t('ymx-heel-sale-list.note1')}}
                <br>
                {{$t('ymx-heel-sale-list.note2')}}
            </div>
            <div class="ml-sm mt-sm">
                <label style="color: blue">{{$t('ymx-heel-sale-list.hijackData')}}：</label>
                <el-input type="textarea"
                          :rows="8"
                          v-model="formData">
                </el-input>
                <div class="mt-sm">
                    <label style="color: blue">{{$t('ymx-heel-sale-list.hijackResult')}}：</label>
                    <div style="border: 1px solid gray;width: 100%;height: 156px;overflow: scroll">
                        <div v-for="(list, index) in result" :key="index">
                            <span>{{list.sku}}  {{list.asin}}</span>
                            <span style="color: red">{{list.status?list.status:''}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" :disabled="formData === ''" @click.native="submit">{{$t('ymx-heel-sale-list.submitBtn')}}</el-button>
                <el-button size="mini" @click.native="dialogShow = false">{{$t('ymx-heel-sale-list.cancelBtn')}}</el-button>
            </div>
        </page-dialog>
    </page>
</template>

<style scoped lang="stylus">

</style>

<script>
    import {api_post_heel_sale} from '../../../../api/heel-sale-list';
    export default {
        data(){
            return {
                dialogShow: this.value,
                account_id: '',
                percent: '',
                money: '',
                modify_price_type: 1,
                formData: '',
                result: [],
                rule_id: '',
            }
        },
        created(){

        },
        filters:{

        },
        methods: {
            open(){
                this.formData = '';
                this.result = [];
                this.account_id = '';
                this.rule_id = '';
                this.percent = '';
                this.money = '';
                this.modify_price_type = 1;
            },
            close(){
                this.$emit('close')
            },
            set_type(val){
                switch (val) {
                    case 0:
                        this.money = '';
                        this.percent = '';
                        break;
                    case 1:
                        this.money = '';
                        break;
                    case 2:
                        this.percent = '';
                        break;
                }
            },
            submit(){
                if(this.formData.trim() === ''){
                    this.$message({type: 'warning', message: this.$t('ymx-heel-sale-list.warningData')})
                    return
                }
                let modify_price;
                if(this.modify_price_type === 1){
                    if(!this.percent){
                        this.$message({type: 'warning', message: this.$t('ymx-heel-sale-list.warningPercent')});
                        return
                    }else{
                        modify_price = '';
                    }
                }else if(this.modify_price_type === 2){
                    if(!this.money){
                        this.$message({type: 'warning', message: this.$t('ymx-heel-sale-list.warningAmount')});
                        return
                    }else{
                        modify_price = '';
                    }
                }else{
                    modify_price = this.money;
                }
                let arr1 = this.formData.split('\n');
                let arr2 = arr1.map(row => row.replace(/\s+/g, ' ').split(' '));
                let params = arr2.map(row => {
                    return {
                        sku: row[0],
                        account_id: this.account_id,
                        modify_price_type: this.modify_price_type,
                        modify_price: modify_price,
                        asin: row[1],
                        price: row[2],
                        quantity: row[3],
                        lowest_price: row[4]
                    }
                });
                let params2 = [];
                params.forEach(row => {
                    if(row.sku !== ''){
                        params2.push(row)
                    }
                });
                this.$http(api_post_heel_sale,{data:JSON.stringify(params2),rule_id:this.rule_id}).then(res => {
                    this.result = res.data;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            //获取账号列表
            fixAccount(res){
                let list = res.map(row=>{
                    return {
                        label:row.code,
                        value:row.account_id,
                    }
                });
                return list
            },
            //获取规则列表
            fixRule(res){
                let list = res.data.map(row => {
                    return {
                        label: row.rule_name,
                        value: row.id
                    }
                });
                return list
            }
        },
        watch: {
            value(val){
                this.dialogShow = val;
            },
            dialogShow(val){
                this.$emit('input',val);
            }
        },
        props:{
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            paramAccount:require("@/api-components/param-account.vue").default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>