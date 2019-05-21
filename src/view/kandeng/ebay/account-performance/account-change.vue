<template>
    <div class="mt-xs mb-xs border_b ">
        <label class="inline mb-mini">账号简称：</label>
        <super-select class="inline width-super"
                      v-model="form.account_id"
                      :options="accountList"
                      @change="change_account"
                      storageKey="ebayAccount">
        </super-select>
    </div>
</template>

<script>
    import {api_get_account} from '@/api/ebay-kandeng-public-module';
    export default {
        name: "account-change",
        data(){
            return{
                accountList:[]
            }

        },
        mounted(){
            this.get_account();
        },
        methods:{
            change_account(){
                this.$emit('change-account')
            },
            get_account(){//获取账号
                this.accountList = [];
                this.$http(api_get_account,{}).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        };
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            form:{}
        }
    }
</script>

<style scoped>
.border_b{
    padding-bottom: 10px;
    border-bottom: 1px solid #21b6b6;
}
</style>
