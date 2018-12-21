<template>
    <page-dialog v-model="show" size="full" @open="open"
                 :title="`${titleName}${name} 信息`" class="parcelRules-dialog"  @change="close_" >
        <div v-loading="isLoading" element-loading-text="拼命加载中">
            <el-card class="rule-dialog-header">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="规则名称：" required>
                                <el-input v-model="name" class="inline" style="width:200px"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="是否启用：" required>
                                <el-switch v-model="isSetup" on-text="启用" off-text="停用"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
            <el-row :gutter="8" class="send-margin">
                <el-col v-show="leftSpan" :span="leftSpan">
                    <el-card>
                        <div slot="header">
                            <label>选择条件</label>
                            <el-checkbox class="fr fr-checkbox" v-model="showContext" :label="showContext ? '显示选项内容' :'隐藏选项内容' "></el-checkbox>
                            <el-checkbox class="fr" v-model="showSelect" label="仅显示已选条件"></el-checkbox>
                        </div>
                        <div class="rules" v-for="(item,item_i) in showRules" :key="item_i">
                            <ul>
                                <li v-for="subItem in item.child" :key="subItem.name" :class="current(subItem)" @click="click_item(subItem)">
                                    <el-checkbox :value="subItemStatus(subItem)"
                                                 @change="change(subItem)">
                                    </el-checkbox>
                                    <span>
                                    {{subItem.name}}
                                    <span class="context" v-if="showContext || showSelect">{{item_context(subItem)}}</span>
                                </span>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </el-col>
                <el-col v-if="rightSpan" :span="rightSpan" >
                    <el-card>
                        <div slot="header">
                            <label style="line-height: 17px;">{{ruleTitle}}</label>
                        </div>
                        <div style="height: 341px;overflow: auto;">
                            <rule-cond :config="ruleConfig"
                                       :data="ruleData"
                                       :code="ruleCode"
                                       :title="ruleTitle"
                                       :component="ruleComponent">
                            </rule-cond>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <declare-set ref="declareSet" title="生成报表信息" :info-data="infoData" :showBtn="show"></declare-set>
            <div slot="footer" class="dialog__footer">
                <request-button @click="submit" req-key='ruleDialog' v-if="isLook">确定</request-button>
                <el-button @click.native="cancel" size="mini">取消</el-button>
            </div>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .parcelRules-dialog{
        .el-card__header{
            background:#A9CDEB;
            .fr-checkbox{
                margin-left: 5px;
            }
        }
        .el-input-number{
            width: 100px;
        }
        .icon-close{
            color: #ff3333;
            &:hover{
                cursor: pointer;
            }
        }
        .td-label{
            vertical-align: super;
        }
        .rule-dialog-header{
            height:20%;
            .el-card__body{
                padding: 20px;
            }
            .el-form-item__label{
                line-height: 30px;
            }
        }
        .send-margin{
            margin: 5px 0;
        }
        .rules{
            border: 1px solid #d6d6d6;
            margin-top:5px;
            padding:5px;
            height: 325px;
            overflow: auto;
            li{
                padding-top:5px;
                padding-bottom:5px;
                &:hover{
                    cursor: pointer;
                    background: rgb(219, 235, 215);
                }
            }
            .current{
                background-color: rgba(22,22,22,0.1);
            }
            .context{
              //  display: flex;
             //   flex:1;
                color: #4e92ce;
                display :block;
                white-space: pre-wrap;
            //    white-space:nowrap;
             //   overflow:hidden;
             //   text-overflow:ellipsis;
                &:hover{
                    color: #bb7829;
                }
            }
        }
    }
</style>
<script>
    import declareSet from './declare-set.vue'
    import {validators} from '../order-rule/validators'
    import {api_declare__items,api_declare_resources,api_declare_add,api_declare_update,api_declare_edit,api_declare_rules,api_declare_look} from '../../../api/parcel-declare'
    export default{
        data(){
            return{
                showSelect:false,
                showContext:false,
                show:this.value,//--弹框显示
                autoActions:[],
                name:'',//----规则名称
                autoContent:'',
                isSetup:true,//---是否启用
                platform:0,
                configs:{},
                rules:[],
                selected:[],
                panelWith:0,
                panelStatus:1,
                isChange:false,
                loading:false,
                infoData:[],
                isLoading:false,
                ruleComponent:'',
                urlObject:{},
            }
        },
        mounted(){


        },
        methods:{
            validators,
            open(){
                this.init();
            },
            defaultFun(){//----获取默认设置并初始化函数
                this.infoData=[];
                this.$http(api_declare_rules).then(res=>{
                    res.forEach(item=>{
                        this.$set(item,'radio','');
                        /*---------------初始化单选项默认选择第一个--------------*/
                        item.data.forEach(data=>{
                            if((data.type==2||data.type==6)&&item.radio==''){
                                item.radio=data.key;
                            }
                        });
                        /*-----------------------------*/
                        this.rulesFun(item.data)
                    });
                    this.$set(this,"infoData",res)

                }).catch(code=>{})
            },
            rulesFun(arr){//-----初始化
                arr.forEach(data=>{
                    this.$set(data,'val','');
                    this.$set(data,'other','');
                    this.$set(data,'checked',false);
                    this.$set(data,'showClass',false);
                    if(data.child.length>0){
                        this.rulesFun(data.child)
                    }
                })
            },
            infoFun(arr,rules,item){//----获取默认设置值函数
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

            close_(val){
                if(!val){
                    this.clear()
                }
            },
            //----------------------------------------------------------------
            init(){
                this.$http(api_declare__items).then(res=>{
                    this.rules = [res];

                this.click_item(this.rules[0].child[0])
                });
            },
            clear(){
                this.selected = [];
                this.name = '';
                this.isSetup=true;
                this.platform = 0;
                this.autoContent = '';
                this.showSelect = false;
                this.showContext = false;
                this.panelWith = 0;
                this.panelStatus = 1;
            },
            init_config(code){
                if(!this.configs[code]){
                    this.$http(api_declare_resources,{code:code}).then(res=>{
                        this.$set(this.configs, code, res);
                    })
                }
            },
            auto_action(actions){
                this.autoActions = actions;
            },
            click_item(item){
              /*  this.panelStatus = 2;*/
                this.panelWith = item;
                this.showContext=true;
                let result = this.get_item(item.code);
                if(!result){
                    this.selected.push({name:item.name,id:item.id,code:item.code,status:false,data:{child:{}}});
                }
            },
            item_context(item){
                let node = this.selected.find(row=>row.code==item.code);
                if(!node){
                    return '';
                }
                let strs = [];
                if(this.configs[node.code]){
                    strs = calc_item_context(this.configs[node.code].type,this.configs[node.code].data, node.data.child,this);
                }
                node.status=!!strs.length;
                return strs.join(', ');
            },
            subItemStatus(item){
                let result = this.get_item(item.code || false);
                return result && result.status;
            },
            get_item(value){
                return this.selected.find(row=>row.code==value);
            },
            get_rule_item(id){
                for(let i = 0; i < this.rules.length; i++){
                    let childs = this.rules[i].child;
                    for(let j=0; j < childs.length; j++){
                        if(childs[j].id === id){
                            return childs[j];
                        }
                    }
                }
            },
            change(item){
                let result = this.get_item(item.code);
                if(result){
                    let index = this.selected.indexOfFun(row=>row.code === item.code);
//                    result.status = !result.status;
                    this.selected.splice(index, 1, result);
                }else{
                    this.selected.push({name:item.name,id:item.id,code:item.code,status:true,data:{child:{}}});
                }
            },

            cancel(){
                this.show = false;
            },
            submit(){
                let selected = this.selected.filter(row=>row.status);
                let valid=  this.validators(selected);
                if(valid.length){
                    let str=valid.map(row=>row.name).join(',');
                    this.$reqKey('ruleDialog',false);
                    return this.$message({type:"info",message:`${str}不符合实际业务条件，请检查！`});
                }
                selected = selected.map(row=>{
                    let rowgetdata = (data) =>{
                        let ret = [];
                        for(let item in data){
                            if(data.hasOwnProperty(item) && data[item].value){
                                ret.push({
                                    operator:data[item].operator.sel || data[item].operator,
                                    key:item,
                                    value:data[item].value,
                                    other:'',
                                    group:data[item].group,
                                    child:rowgetdata(data[item].child)
                                });
                            }
                        }
                        return ret;
                    };
                    let value = rowgetdata(row.data.child);
                    return {
                        item_id:row.id,
                        item_source:row.code,
                        item_value:value
                    }
                });
                if (this.$refs.declareSet.showFun()) {
                    this.$reqKey('ruleDialog',false);
                    return this.$message({type: "error", message: '请输入正确数字'})
                }
                let params = {
                    title:this.name,
                    status:this.isSetup ? 0 : 1,
                    rules:selected,
                    action_value:this.$refs.declareSet.saveData()
                };
                if(this.mdfid > 0){
                    this.$http(api_declare_update, this.mdfid, params).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message
                        });
                        this.show = false;
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message
                        });
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('ruleDialog', false);
                        }, 300)
                    });
                    return;
                }
                this.$http(api_declare_add, params).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message
                    });
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('ruleDialog', false);
                    }, 300)
                })
            },
            current(item){
                return item == this.panelWith ? 'current' : '';
            },
            auto_remote(){
                return this.$http(api_getaction).then(res=>{
                            let ret = res.map(row=>{
                                        return {
                                            label:row.name,
                                            value:row.id
                                        }
                                    });
                            return Promise.resolve(ret);
                        });
            },
            makesure_rule_item(){
                return new Promise((succ,fail)=>{
                    let make = () =>{
                        if(this.rules.length > 0 ){
                            succ();
                        }else{
                            setTimeout(make, 500);
                        }
                    };
                    setTimeout(make, 0);
                })
            }
        },
        computed:{
            showRules(){
                let classifys = [];
                this.rules.forEach(classify=>{
                    classify.child = classify.child || [];
                    let classifyChild = classify.child.filter(row=>{
                        if(this.showSelect){
                            let node = this.selected.find(old=>old.code===row.code);
                            if(!node || !node.status){
                                return false;
                            }
                            return true;
                        }else{
                            return true;
                        }
                    });
                    classifys.push({label:classify.label,child:classifyChild});
                });
                return classifys;
            },
            leftSpan(){
                switch (this.panelStatus){
                    case 1:
                        return 24;
                    case 2:
                        return 8;
                    case 3:
                        return 0;
                }
            },
            rightSpan(){
                switch (this.panelStatus){
                    case 1:
                        return 0;
                    case 2:
                        return 16;
                    case 3:
                        return 24;
                }
            },
            ruleData:{
                get(){
                    try{
                        let item = this.get_item(this.ruleCode);
                        if(item){
                            return item.data || {};
                        }else{
                            return {};
                        }
                    }catch ($exp){
                        return {};
                    }

                }
            },
            ruleCode(){
                if(this.panelWith){
                    let code = this.panelWith.code;
                    this.init_config(code);

                    return code;
                }else{
                    return "";
                }
            },
            ruleConfig(){
                return this.configs[this.ruleCode] || {};
            },
            ruleTitle(){
                if(this.panelWith){
                    return this.panelWith.statement;
                }else{
                    return "";
                }
            }

        },
        props:{
            value:{},
            mdfid:{},
            titleName:{},
            isLook:{}
        },
        watch:{
            mdfid(val){
                this.init();
                if(val){
                    this.isLoading = true;
                    this.infoData=[];
                    this.$http(api_declare_rules).then(res=>{
                        res.forEach(item=>{
                            this.$set(item,'radio','');
                            this.rulesFun(item.data)
                        });
                        this.$set(this,"infoData",res);
                        this.$http(api_declare_edit,val).then(res=>{
                            while (this.selected.shift()){}
                            this.name = res.title;
                            this.isSetup = res.status === 0 ? true:false;//--0启用1停用
                            this.showSelect = false;
                            res.action_value.forEach(rules=>{//----默认设置值
                                this.infoData.forEach(item=>{
                                    if(item.code===rules.item_code){
                                        this.infoFun(item.data,rules.choose,item)
                                    }
                                });
                            });
//                        this.showContext = true;
                            this.makesure_rule_item().then(()=>{
                                res.rules.forEach(row=>{
                                    /*    let item = this.get_rule_item(row.item_id);*/
                                    this.init_config(row.item_code);
                                    let chooses = (rows)=>{
                                        let obj = {};
                                        rows.forEach(row=>{
                                            obj[row.key] = choose(row);
                                        });
                                        return obj;
                                    };
                                    let choose = (row)=>{
                                        row.child = chooses(row.child);
                                        return row;
                                    };
                                    let select = {
                                        status:true,
                                        id:row.item_id,
                                        code:row.item_code,
                                        name:row.name,
                                        data:{
                                            value:true,
                                            child:chooses(row.choose)
                                        }
                                    };
                                    this.selected.push(select);
                                });
                            });
                            this.isLoading = false;
                        }).catch(code=>{
                            this.$message({
                                type:'error',
                                message:code.message
                            });
                        })
                    }).catch(code=>{this.$message(code.message)});
                }else{

                }
            },
            showContext(val){
                if(val){
                    this.panelStatus=2
                }else {
                    this.panelStatus=1
                }
            },
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
        },
        components:{
            declareSet,
            pageDialog:require('../../../components/page-dialog.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            labelItems:require('../../../components/label-items.vue').default,
            tree:require('./tree.vue').default,
            ruleCond:require('./rule-cond.vue').default,
        }
    }

    function calc_item_context(type, configs, data,self) {
        let that=self
        let strs = [];
        for(let i=0; i < configs.length; i++){
            let config = configs[i];
            let title = '';
            if(data[config.key]){
                switch (config.type || type){
                    case 1:
                        if(data[config.key].value){
                            let shortName=[];
                            if(data[config.key].value instanceof Array){
                                data[config.key].value.forEach(val=>{
                                    shortName.push(val.shortname)
                                })
                            }
                            let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                            childstr = childstr ? `:${childstr}` : '';
                            title = `${config.title}${childstr}`||`${shortName.join(',')}`;
                        }
                        break;
                    case 2:
                        if(data[config.key].value){
                            let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                            childstr = childstr ? `:${childstr}` : '';
                            title = `${config.title}${childstr}`;
                        }
                        break;
                    case 3:
                        if(data[config.key].value){
                            let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                            childstr = childstr ? `:${childstr}` : '';
                            title = `${config.title}${data[config.key].value}${childstr}`;
                        }
                        break;
                    case 4:
                        if(data[config.key].value){
                            let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                            childstr = childstr ? `:${childstr}` : '';
                            title = `${config.title}${data[config.key].value}${childstr}`;
                        }
                        break;
                    case 5:
                        if(data[config.key].value){
                            let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                            childstr = childstr ? `:${childstr}` : '';
                            title = `${config.title}${data[config.key].value}${childstr}`;
                        }
                        break;
                    case 7:
                        if(data[config.key].value[0] != "" && data[config.key].value[1] != ""){
                            let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                            childstr = childstr ? `:${childstr}` : '';
                            title = `${config.title}${data[config.key].value}${childstr}`;
                        }
                        break;
                    case 8:
                        let values  = null;
                        if(values = data[config.key].value){
                            if(!that.urlObject[config.url]){
                                let url = window.config.apiHost+config.url;
                                const resource =window.http('GET', url);
                                resource.then(res=>{
                                    that.$set(that.urlObject, config.url, res);
                                }).catch(code=>{
                                });
                            }
                            values = values.mapExclude(row=>{
                                row = that.urlObject[config.url][row];
                                return row.name;
                            },
                            exclude=>{
                                if(!that.urlObject[config.url])return true;
                                if(!that.urlObject[config.url][exclude])return true;
                                return false;
                            });
                            title = values.join(',');
                        }
                        break;
                    default:
                        break;
                }
                title && strs.push(title);
            }

        }
        return strs;
    }
</script>
