<template>
    <page class="p-add-parcel">
        <page-dialog v-model="showDialog" size="full" :title="titleName" @change="close" :close-on-click-modal="false">
            <el-form  :model="formData" label-width="80px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="规则名称：" required>
                            <el-input v-model="formData.name" class="inline"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否启用：" required>
                            <el-select v-model="formData.status" class="inline">
                                <el-option
                                        :key="item.value"
                                        v-for="item in status"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="8" style="margin-bottom: 5px;">
                    <el-col :span="leftCard">
                        <el-card class="box-card">
                            <div slot="header">
                                <span style="line-height: 26px;">{{leftData.label}}</span>
                                <el-checkbox v-model="showSelect" style="float: right;line-height: 26px;">仅显示已选条件</el-checkbox>
                            </div>
                            <div class="rules">
                                <div  v-for="(data,index) in leftChild" class="leftChild" :class="current(data)" @click="show_right(data)">
                                    <el-checkbox v-model="data.isCheck"></el-checkbox>
                                    <span>
                                        {{data.name}}{{data.statement}}
                                       <!-- <span>{{item_context(data)}}</span>-->
                                    </span>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col  v-if="!isShow" :span="16">
                        <el-card class="box-card">
                            <div slot="header">
                                <span style="line-height: 26px;">{{rightData.titles}}</span>
                                <el-button style="float: right;" size="mini" @click="isShow_btn">隐藏</el-button>
                            </div>
                            <div style="height: 325px;overflow: auto;" v-loading="loading" element-loading-text="拼命加载中">
                                <rules-resources ref="rulesResources" :right-data="rightData" :mark-id="markId"></rules-resources>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <declare-set ref="declareSet" title="生成报表信息" :info-data="infoData" :showBtn="showDialog"></declare-set>
            </el-form>
            <div slot="footer" class="dialog__footer">
                <el-button type="primary" @click="save_data" size="mini" v-if="markId==0">保 存</el-button>
                <el-button type="primary" @click="update_data" size="mini" v-if="markId>0">编 辑</el-button>
                <el-button size="mini"    @click="showDialog=false">取 消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-add-parcel{
        border: 1px solid #d6d6d6;
        height: 325px;
        overflow: auto;
        .leftChild{
            padding: 5px 0;
            &:hover{
                cursor: pointer;
                background: rgb(219, 235, 215);
            }
        }
        .current{
            background-color: rgba(22,22,22,0.1);
        }

    }
</style>
<script>
    import declareSet from './declare-set.vue'
    import rulesResources from './rules-resources.vue'
    import {api_declare__items,api_declare_resources,api_declare_add,api_declare_update} from '../../../api/parcel-declare'
    export default{
        data(){
            return {
                showDialog:false,
                formData:{
                    name:'',
                    status:0
                },
                status:[
                    {
                        value: 1,
                        label: '否'
                    },
                    {
                        value: 0,
                        label: '是'
                    }
                ],
                showSelect:false,
                isShow:false,
                leftData:{},
                rightData:{},
                tempData:{},
                loading:true,
                panel:0,
            }
        },
        created(){
            /*this.getRules()*/
        },
        mounted(){
        },
        methods: {
            current(item){
                return item==this.panel?'current':'';

            },
            getRules(){
                /*---获取规则可选条件*/
                this.tempData={};
                this.$http(api_declare__items).then(res=>{
                    this.leftData=res;
                    this.leftData.child.forEach(data=>{
                        this.$set(data,'isCheck',false)
                    });
                    this.show_right(this.leftData.child[0]);
                    /**/
                    this.leftData.child.forEach(data=>{
                        this.rulesData.rules.forEach(rules=>{
                            if(rules.item_code==data.code){
                                data.isCheck=true
                            }
                        });
                    });
                    /**/
                }).catch(code=>{})
            },
            isShow_btn(){
                this.isShow=!this.isShow
            },
            show_right(data){/*----根据条件获取资源信息*/
//                console.log('!!!!!!!!data',data);
                this.panel=data;
                this.isShow=false;
                let code={
                    code:data.code
                };
                if(!this.tempData[data.code]){
                    this.loading=true;
                    this.$http(api_declare_resources,code).then(res=>{
//                        console.log(res);
                        this.loading=false;
                        this.tempData[data.code]=res;
                        this.rightData=res;
                        this.rightData.titles=data.statement;
                        this.rightData.data.forEach(data=>{
                            let obj={};
                            if(data.condition instanceof Array&&data.condition.length>0){
                                data.condition.forEach((item,i)=>{
                                    obj[item.id]=item.shortname;
                                });
                                data.condition=obj;
                            }
                        });
                        if(this.rightData.type==2){
                            this.$set(this.rightData,'radio','');
                        }
                        /*--初始化*/
                        this.rulesFun(this.rightData.data);
                        /*---查看*/
                        if(window.objlength(this.rulesData)>0){
                            this.rulesData.rules.forEach(rules=>{
                                if(rules.item_code==data.code){
                                    this.infoFun(this.rightData.data,rules.choose,this.rightData)
                                }
                            });
                        }
                    }).catch(code=>{})
                }else {
                    this.rightData=this.tempData[data.code];
                }
            },
            rulesFun(arr){
                arr.forEach(data=>{
                    this.$set(data,'val',"");
                    this.$set(data,'test',{label:"",value:""});
                    this.$set(data,'other','');
                    this.$set(data,'operator','');
                    this.$set(data,'checked',false);
                    if(data.child instanceof Array&&data.child.length>0){
                        this.rulesFun(data.child)
                    }
                })
            },
            infoFun(arr,rules,item){
                arr.forEach(data=>{
                    let child=[];
                    rules.forEach(choose=>{
                        if(data.key===choose.key){
                            if(data.type==''&&item.type==1){
                                data.checked=true
                            }
                            if((data.type==''&&item.type==2)||data.type==2){
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
                        if(data.type==1&&!(data.child instanceof Array)&&data.child.url){
                            this.$refs.rulesResources.selected_id.push({id:choose.key,shortname:choose.value})
                        }
                        if(data.type==8){
                            this.$refs.rulesResources.select.push(choose.key)
                        }
                    });

                    if(data.child.length>0){
                        this.infoFun(data.child,child,item)
                    }
                })
            },
            /*---新增*/
            save_data(){
                console.log(JSON.stringify(this.tempData));
                let rules_data=[];
                this.leftData.child.forEach(item=>{
                    if(item.isCheck&&this.tempData[item.code]){
                        rules_data.push({
                            item_source:item.code,
                            item_value: this.getVal(this.tempData[item.code].data,this.tempData[item.code])
                        })
                    }
                });
                let saveData={
                    title:this.formData.name,
                    status:this.formData.status,
                    action_value:this.$refs.declareSet.saveData(),
                    rules:rules_data
                };
                console.log(JSON.stringify(saveData));
                this.$http(api_declare_add,saveData).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.showDialog=false;
                    this.$emit('refresh_list')

                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            /*------------------更新*/
            update_data(){
//                console.log(this.rulesData);
//                console.log(this.tempData);
                let rules_data=[];
                this.leftData.child.forEach(item=>{
                    if(item.isCheck&&this.tempData[item.code]){
                        rules_data.push({
                            item_source:item.code,
                            item_value: this.getVal(this.tempData[item.code].data,this.tempData[item.code])
                        })
                    }
                    this.rulesData.rules.forEach(data=>{
                        if(item.isCheck&&(item.code==data.item_code)&&!(this.tempData[data.item_code])){
                            rules_data.push({
                                item_source:data.item_code,
                                item_value: data.choose
                            })
                        }
                    })
                });
                let updateData={
                    title:this.formData.name,
                    status:this.formData.status,
                    action_value:this.$refs.declareSet.saveData(),
                    rules:rules_data
                };
                this.$http(api_declare_update,this.markId,updateData).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    this.showDialog=false;
                    this.$emit('refresh_list')
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            getVal(arr,item){
                if(arr.length>0){
                    let  item_value=[];
                    arr.forEach(data=>{
                        if((data.type==''&&item.type==1&&data.checked)||(data.type==1&&(data.child instanceof Array))||(data.type==5&&data.checked)||(data.type==4)||(data.type==''&&item.type==2&&data.key===item.radio)){
                            item_value.push({
                                operator:data.operator||'',
                                value:data.val,
                                key:data.key,
                                other:data.other||'',
                                group:data.group,
                                child:this.getVal(data.child,item)
                            })
                        }else if(data.type==1&&!(data.child instanceof Array)&&data.child.url){
                                let selectList=this.$refs.rulesResources.selected_id;
                                if(selectList.length>0){
                                    selectList.forEach(list=>{
                                        item_value.push({
                                            operator:data.operator||'',
                                            value:list.shortname,
                                            key:list.id,
                                            other:data.other||'',
                                            group:data.group
                                        });
                                    })
                                }
                        }else if(data.type==8){
                            console.log('选中的id ', this.$refs.rulesResources.select);
                            let selectList=this.$refs.rulesResources.select;
                            if(selectList.length>0){
                                selectList.forEach(list=>{
                                    item_value.push({
                                        operator:data.operator||'',
                                        value:true,
                                        key:list,
                                        other:data.other||'',
                                        group:data.group,
                                        child:this.getVal(data.child,item)
                                    });
                                })
                            }
                        }
                    });
                    return item_value
                }
            },
            /*---关闭 清空*/
            close(val){
//                console.log(val);
                if(!val){
                    for(let key in this.tempData){
                        this.rulesFun(this.tempData[key].data)
                    }
                    this.formData.name='';
                    this.formData.status=0;
                    this.panel=0;
                }
            }
        },
        filters: {},
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input', val);
            },
            rulesData(val){
//                console.log(val)
            },

            rightData(rightData){
                console.log('rightData',rightData)
            }
        },
        computed: {
            leftCard(){
                if(this.isShow){
                    return 24
                }else{
                    return 8
                }
            },
            leftChild(){
                if(this.showSelect){
                    return this.leftData.child.filter(child=>{
                        return child.isCheck
                    })
                }else {
                    return this.leftData.child;
                }
            }

        },
        props: {
            value:{},
            infoData:{},
            markId:{},
            rulesData:{},
            titleName:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            declareSet,
            rulesResources
        }
    }
</script>