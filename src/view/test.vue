<template>
    <div class="c-test ">
        <!--<super-select v-model="account00"-->
                     <!--:options="options"-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account00">-->
        <!--</super-select>-->
        <super-select v-model="account11"
                      :options='siteOptions11'
                      :is-paging="true"
                      storage-key="account11"></super-select>
        <super-select v-model="account11"
                      :remote-request-http="remoteRequestHttp"
                     :is-paging="true"
                     storage-key="account1122"></super-select>
        <super-select v-model="account22"
                      :options='siteOptions22'
                      :is-paging="true"
                      storage-key="account22"></super-select>
        <!--<super-select v-model="account33"-->
                      <!--:options='siteOptions33'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account33"></super-select>-->
        <!--<super-select v-model="account44"-->
                      <!--:options='siteOptions44'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account44"></super-select>-->
        <!--<super-select v-model="account55"-->
                      <!--:options='siteOptions55'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account55"></super-select>-->

        <!--<super-select v-model="account66"-->
                      <!--:options='siteOptions66'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account66"></super-select>-->
        <!--<super-select v-model="account22"-->
                      <!--:options='siteOptions22'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account22"></super-select>-->
        <!--<super-select v-model="account22"-->
                      <!--:options='siteOptions22'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account22"></super-select>-->
        <!--<super-select v-model="account22"-->
                      <!--:options='siteOptions22'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account22"></super-select>-->
        <!--<super-select v-model="account22"-->
                      <!--:options='siteOptions22'-->
                      <!--:is-paging="true"-->
                      <!--storage-key="account22"></super-select>-->
        <el-button @click="synchronizes">同步</el-button>
    </div>
</template>
<style lang="stylus">
    .c-test{
        span.test{
            position :relative;
            border :1px solid gainsboro
            .icon{
                position :absolute;
                right :0;
                top:0;
                font-size :12px;
                color red;
                display :none;
            }
            &:hover{
                .icon{
                    display :inline-block;
                }
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                account00:'',
                siteOptions00:createOrderArray(1, 20000).map(num =>{
                    return {label:`label00 ${num}`, value:num};
                }),
                account11:2200,
                siteOptions11:createOrderArray(1, 10000).map(num =>{
                    return {label:`吴楚光 ${num}`, value:num};
                }),
                account22:'',
                siteOptions22:createOrderArray(1, 20000).map(num =>{
                    return {label:`label22 ${num}`, value:num};
                }),
                account33:'',
                siteOptions33:createOrderArray(1, 20000).map(num =>{
                    return {label:`label33 ${num}`, value:num};
                }),
                account44:'',
                siteOptions44:createOrderArray(1, 20000).map(num =>{
                    return {label:`label44 ${num}`, value:num};
                }),
                account55:'',
                siteOptions55:createOrderArray(1, 20000).map(num =>{
                    return {label:`label55 ${num}`, value:num};
                }),
                account66:'',
                siteOptions66:createOrderArray(1, 20000).map(num =>{
                    return {label:`label66 ${num}`, value:num};
                }),
                account2:'',
                account3:'',
                num:0,
                form:{
                    company:'',
                    info:''
                },
                siteOptions:createOrderArray(1, 200000).map(num =>{
                    return {label:`label ${num}`, value:num};
                }),
                gottaParams:{
                    url:'get|goods/supplier-select',
                    params:{page:1,pageSize:50,company_name:''},
                },
                options:[
                    {label:'111,',value:111}
                ]
            }
        },
        methods:{
            test(){
                console.log(54555);
            },
            synchronizes(){
                this.options.push({label:'sss'+this.options.length, value:this.options.length});
                console.log(this.options);
                // this.account33 = this.account2
            },
            remoteRequestHttp(page, pageSize, query){
                console.log(`remoteRequestHttp page:${page} pageSize:${pageSize} query:${query}`);
                return new Promise((succ) =>{
                    succ({data:createOrderArray(pageSize*(page-1), pageSize*(page-1) +　pageSize).map(n =>{
                        return {
                            label:`http ${n}`,
                            value:n
                        }
                        }), count:3000})
                })
            },
            adjust_params(res){
                return {
                    page:res.page,
                    pageSize:res.pageSize,
                    company_name:res.keyword
                }
            }
        },
        components:{
            integerInput:require('@/components/integer-input').default,
            integerZeroInput:require('@/components/integer-zero-input').default,
        }

    }
</script>
