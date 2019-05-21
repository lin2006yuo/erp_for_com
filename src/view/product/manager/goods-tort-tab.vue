<template>
    <ui-card>
        <span slot="header" class="title">{{tabData.channel_name}}</span>
        <label>是否设置无需下架的店铺：</label>
        <el-checkbox v-model="tabData.isShow"
                     :disabled="isDisabled">是</el-checkbox>
        <add-tort-account :tags="tabData.shops"
                          v-if="tabData.isShow"
                          :select-data="tabData"
                          :step="step"></add-tort-account>
    </ui-card>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                step:['\n',' ']
            }
        },
        mounted(){

        },
        methods:{

        },
        computed:{
            isShow:{
                get(val){
                    return this.tabData.shops&&this.tabData.shops.length>0
                },
                set(val){
                    console.log(val);

                },
            },
            isDisabled(){
                if(this.tabData&&this.tabData.shops){
                    return !!this.tabData.shops.find(row=>!!row.isDisabled);
                }else{
                    return false
                }
            },
        },
        props:{
            tabData:{
                required:true,
                type:Object,
            }
        },
        components:{
            uiCard:require('@/components/ui-card.vue').default,
            addTortAccount:require('./add-tort-account.vue').default,
        }
    }
</script>