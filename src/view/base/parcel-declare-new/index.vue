<template>
    <page>
        <el-row class="p-parcel-declare">
            <declare-set title="默认申报设置" :default-data="defaultData" @refresh_set="refresh_set"></declare-set>
            <div class="function">
                <permission tag="ElButton" :route="apis.url_declare_add" type="primary" @click.native="add" size="mini">添加</permission>
                <permission tag="request-button"  req-key="indexSave"
                            :route="apis.url_declare_sort"
                            v-if="isChange" @click="save">确定</permission>
            </div>
            <data-table @refresh-data="init()" @change="isChange=true" :first-loading="firstLoading" @lookup="lookup" @editup="editup" :tables="tables" :loading="loading"></data-table>
        </el-row>
        <rule-dialog ref="releDialog" @refresh-data="init()" :mdfid="mdfid" v-model="show" :isLook="isLook" :title-name="titleName"></rule-dialog>
    </page>
</template>
<style lang="stylus">
    .p-parcel-declare{
        .function{
            padding: 5px 10px 5px 10px;
        }
    }
</style>
<script>
    import declareSet from './declare-set.vue'
    import {api_declare_list,api_declare_rules,api_declare__info,api_declare_sort,
      url_declare_add,url_declare_sort} from '../../../api/parcel-declare'
    export default{
    	  permission:{
          url_declare_add,
          url_declare_sort
        },
        page:{},
        refresh(){
    	  	this.init();
            this.defaultSet();
        },
        data(){
            return{
                initParams:{
                    status:'',
                },
                titleName:'',
                loading:true,
                defaultData:[],
                show:false,
                isLook:false,
                mdfid:0,
                tables:{
                    lists:[]
                },
                isChange:false,
                firstLoading:true
            }
        },
        mounted(){
            this.init();
            this.defaultSet();
        },
        methods:{
            init(){//-----------------list列表
                this.loading=true;
                this.$http(api_declare_list,this.initParams).then(res=>{
                   /* res.data = res.data.sort((s1,s2) =>{
                        return s1.sort > s2.sort;
                    });*/
                    this.tables.lists = res.data;
                    this.tables.lists.forEach(data=>{
                        this.$set(data,'isTurn',false);
                        this.$set(data,'number',1);
                        data.status=data.status===0?true:false
                    });
                    this.loading=false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code,
                    })
                })
            },
            save(){//-------------排序保存
                let sort = this.tables.lists.map((row,index)=>{
                    return {id:row.id,sort:index}
                });
                this.$http(api_declare_sort, {sort}).then(res=>{
                    this.$message({
                        type:'success',
                        message:'保存成功'
                    });
                    this.isChange = false;
                    this.init()
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('indexSave', false);
                    }, 300)
                })
            },
            /*----默认包裹设置*/
            defaultSet(){
                this.$http(api_declare_rules).then(res=>{
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
                    this.$set(data,'showClass',false);
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
            //----------------------------------------------end
            //----------------------------------------------------------------
            add(){//----------添加
                this.show = true;
                this.mdfid = 0;
                this.isLook = true;
                this.titleName='添加包裹自动规则';
                this.$refs.releDialog.defaultFun();
            },
            lookup(itemid){//------------查看
                this.mdfid = itemid;
                this.show = true;
                this.isLook = false;
                this.titleName=`查看规则：`;

            },
            editup(itemid){ //------------编辑
                this.mdfid = itemid;
                this.show = true;
                this.isLook = true;
                this.titleName=`编辑规则：`;
            },
        },
        watch:{
            show(val){
                if(!val){
                    this.mdfid = 0;
                }
                this.init();
            }
        },
        components:{
            declareSet,
            dataTable:require('./data-table.vue').default,
            ruleDialog:require('./rule-dialog.vue').default,
            labelButtons:require('../../../components/label-buttons.vue').default,
            labelItems:require('../../../components/label-items.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
