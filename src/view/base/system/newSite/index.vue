<template>
    <page class="congfig-p-index">
    <div  v-loading="loading" element-loading-text="玩命加载中..." >
        <el-tabs @tab-click="handleClick"  :active-name="currentTab">
            <el-tab-pane  v-for="(tab,index) in tab_pane"
                          :key="tab.name"
                          :label="tab.value" :name="tab.name">
                <config :systemData="tabData[tab.name]"  :ref="`tab-${tab.name}`" :id="group_id"></config>
            </el-tab-pane>
        </el-tabs>
    </div>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import {system_list} from '../../../../api/system'
    export default{
    	page:{},
        refresh(){
            this.get_init(this.tab_pane[0].name);
            this.currentTab=this.tab_pane[0].name;
        },
        data(){
            return {
                tabData:{},
                tab_pane:[],
                currentTab:'',
                group_id:'',
                loading:true
            }
        },
        created(){
            this.loading=true
            this.$http(system_list,"site").then(res=>{
                for(let key in res.groups){
                    this.tab_pane.push({name:key,value:res.groups[key]});
                    this.$set(this.tabData,key,[])
                }
                this.loading=false
                this.get_init(this.tab_pane[0].name);
                this.currentTab=this.tab_pane[0].name;
            }).catch(code=>{})
        },
        methods: {
            handleClick(tab,e){
                this.currentTab=tab.name;
               this.tabData[tab.name].length==0&&this.get_init(tab.name)
            },
            get_init(name){
                this.$http(system_list,name).then(res=>{
                    this.group_id=res.group_id;
                    this.tabData[name]= res.list.map(row=>{
                        //0 单选  1多选
                            row.type===3&&row.choose_type===0&&this.action_type_zero(row);
                            row.type===3&&row.choose_type===1&&this.action_type_one(row);
                            return row
                        })
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            action_type_zero(item){
                let curValue = item.value.value;
                if(this.is_show(item)){
                    curValue = !!Number(item.value.value);
                }
                if(!this.common_acction(item)){
                    this.$set(item,'choose',curValue);
                    return
                }
                let find=item.setting.find(row=>{
                    return row.value==item.value.value;
                });
                if(!!find&&item.value.child&&item.value.child.length>0){
                       if(find.choose_type===0){
                           find.choose=item.value.child[0].value;
                       }else {
                           find.child.forEach(child=>{
                                let findChild=item.value.child.find(val=>{
                                        return val.value==child.value;
                                })
                               child.checked=!!findChild;
                           })
                       }
                }
                this.$set(item,'choose',curValue);
            },
            is_show(item){
                let list = ["tort_ebay","tort_amazon","tort_wish","tort_aliexpress","tort_pandao","tort_joom","tort_shopee"];
                return list.includes(item.name);
            },
            action_type_one(item){
                if( !this.common_acction(item)){
                    return
                }
                 item.setting.forEach(row=>{
                        let find=item.value.find(child=>{
                                return row.value===child.key.value;
                        });
                        row.checked=!!find;
                            if(!!find&&row.child&&row.child.length>0){
                                if(row.choose_type===0){
                                    row.choose=find.child[0].value;
                                }else {
                                    row.child.forEach(setting=>{
                                            let findChild=find.child.find(val=>{
                                                return setting.value===val.value;
                                            })
                                        setting.checked=!!findChild;
                                    })
                                }
                            }
                 })
            },
            common_acction(item){
                if(!item.setting||item.setting.length===0){
                    return false
                }
                item.setting.forEach(row=>{
                    if(row.child&&row.child.length>0){
                        row.choose_type=row.child[0].choose_type;
                        row.child[0].choose_type===0&&(row.choose='');
                        row.child[0].choose_type===1&&(row.child.forEach(child=>{child.checked=false}))
                    }
                });
                if(!item.value){
                    return false
                }
                return true
            },
        },
        components: {
            config:require('./config.vue').default
        }
    }
</script>
