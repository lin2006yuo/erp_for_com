<template>
    <page class="p-index">
        <declare-set title="默认申报设置" :default-data="defaultData" @refresh_set="refresh_set"></declare-set>
        <data-table :tables="tables" @refresh_list="refresh_list" :loading="loading"></data-table>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import declareSet from './declare-set.vue'
    import dataTable from './data-table.vue'
    import {api_declare_list,api_declare_rules,api_declare__info} from '../../../api/parcel-declare'
    export default{
    	page:{},
      refresh(){
    		this.defaultData = [];
    		this.init();
      },
        data(){
            return {
                loading:true,
                defaultData:[],
                tables:{
                    lists:[]
                },
                listParams:{
                    status:''
                }
            }
        },
        created(){
            this.listFun()
        },
        mounted(){
            this.defaultSet()
        },
        methods: {
            listFun(){
                this.$http(api_declare_list,this.listParams).then(res=>{
//                    console.log(res);
                    this.loading=false;
                    this.tables.lists=res.data;
                    this.tables.lists.forEach(data=>{
                        this.$set(data,'isTurn',false);
                        this.$set(data,'number',1);
                        data.status=data.status===0?true:false
                    })
                }).catch(code=>{})
            },
            defaultSet(){
                this.$http(api_declare_rules).then(res=>{
//                    console.log(res);
                    this.defaultData=res;
                    this.defaultData.forEach(item=>{
                        this.$set(item,'radio','');
                        this.rulesFun(item.data)
                    });
                    this.$http(api_declare__info).then(res=>{
                        res.rules.forEach(rules=>{
                            this.defaultData.forEach(item=>{
                                if(item.code===rules.item_code){
                                    this.infoFun(item.data,rules.choose,item)
                                }
                            });
                        })
                    }).catch(code=>{})
                }).catch(code=>{})
            },
            rulesFun(arr){
                arr.forEach(data=>{
                    this.$set(data,'val','');
                    this.$set(data,'checked',false);
                    if(data.child.length>0){
                        this.rulesFun(data.child)
                    }
                })
            },
            infoFun(arr,rules,item){
                arr.forEach(data=>{
                    let child=[];
                    rules.forEach(choose=>{
                        if(data.key===choose.key){
                            if(data.type==2||data.type==6){
                                item.radio=data.key
                            }
                            if(data.type==5){
                                data.checked=true
                            }
                            data.val=choose.value;
                            data.group=choose.group;
                            data.other=choose.other;
                            data.operator=choose.operator;
                            child=choose.child
                        }
                    });
                    if(data.child.length>0){
                        this.infoFun(data.child,child,item)
                    }
                })
            },
            refresh_set(){
                this.defaultSet()
            },
            refresh_list(){
                this.listFun()
            }
        },
        filters: {},
        watch: {},
        computed: {},
        props: {},
        components: {
            declareSet,
            dataTable
        }
    }
</script>
