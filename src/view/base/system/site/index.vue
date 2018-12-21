<template>
    <page class="p-index">
        <div>
            <ui-tabs @tab-click="handleClick" class="tabs-box">
                <ui-tab-item v-for="(tab,index) in tab_pane"
                             :key="index"
                             :label="tab.value" :name="tab.name">
                    <system-config :ref="`tab-${tab.name}`" :systemData="tabData"></system-config>
                </ui-tab-item>
            </ui-tabs>
        </div>
    </page>
</template>
<style lang="stylus">
    .tabs-box{
        width: 100%;
        height: 100%;
    }
</style>
<script>
    import systemConfig from './system-config.vue'
    import {system_list} from '../../../../api/system'
    export default{
    	  page:{},
        data(){
            return {
                activeName: '',
                tabData:{},
                tab_pane:[]
            }
        },
        created(){
            this.$http(system_list,"site").then(res=>{
                this.tabData=res;
                for(let key in res.groups){
                    this.tab_pane.push({name:key,value:res.groups[key]})
                }
                this.$http(system_list,this.tab_pane[0].name).then(resa=>{
                    this.tabData=resa;
                }).catch(code=>{})
            }).catch(code=>{})
        },
        mounted(){

        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
                let SC = this.$refs[`tab-${tab.name}`][0];
                SC.init.call(SC, tab.name);
            }
        },
        filters: {},
        watch: {
            tabData(val){
                if(val){
                    val.list.forEach(data=>{
                    	console.log("data val.list",data);
                        if(data.choose_type===1){
                            if(data.valueTrue===undefined){
                                this.$set(data,"valueTrue",[]);
                                let itemValue = [];
                                if(data.value instanceof Array){
                                    data.value.forEach(res=>{
                                        if(itemValue.indexOf(res.key)===-1){
                                            itemValue.push(res.key);
                                        }else{
                                            itemValue = [];
                                        }
                                    })
                                }
                                data.valueTrue = itemValue;
                            }
                        }else if(data.choose_type===0){
                            if(data.valueTrue===undefined){
                            	if(data.value.value){
                                    this.$set(data,"valueTrue",data.value.value)
                                }else{
                                    this.$set(data,"valueTrue",'')
                                }
                            }else {
                                data.valueTrue ='';
                            }
                        }
                        data.setting.forEach(row => {
                            let changeValue = row.changeValue;
                            if (row.changeValue === undefined && row.child.length>0) {
                                this.$set(row, "changeValue", []);
                            } else {
                                row.changeValue = changeValue;
                            }
                        })
                    })
                }
            }
        },
        computed: {
        },
        props: {},
        components: {
            systemConfig,
            uiTabs:require('../../../../components/ui-tabs'),
            uiTabItem:require('../../../../components/ui-tab-item')
        }
    }
</script>
