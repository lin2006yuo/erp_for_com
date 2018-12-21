<template>
    <page-dialog v-model="show" size="large" :title="titleName" :close-on-click-modal="false" class="sendRules-dialog"  @change="close_send" @open="open">
        <div v-loading="isLoading" element-loading-text="拼命加载中">
            <el-card class="rule-dialog-header">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="规则名称：" required>
                                <el-input v-model="name" class="inline" style="width:200px"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="平台：" required>
                                <el-select v-model="platform" class="inline" style="width:200px" @change="change_channel">
                                    <el-option
                                            :key="item.value"
                                            v-for="item in channelList"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否启用：" required>
                                <el-switch v-model="isSetup" on-text="启用" off-text="停用"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="触发时间：" required>
                                <el-select v-model="triggerRules" class="inline" style="width:200px">
                                    <el-option-group
                                            v-for="group in trigger"
                                            :key="group.title"
                                            :label="group.title">
                                        <el-option
                                                :key="item.id"
                                                v-for="item in group.datas"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item label="发送渠道：">
                                <el-select v-model="emailRules" class="inline" style="width:300px" :placeholder="emailHolder" :disabled="platform === ''">
                                    <el-option
                                            v-for="item in email_"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
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
                                <li v-for="subItem in item.child"
                                    :key="subItem.name"
                                    :class="current(subItem)" @click="click_item(subItem)">
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
            <el-card class="box-card send-margin">
                <div slot="header" class="clearfix">
                    <label>站内信/评价内容</label>
                </div>
                <div>
                    <el-button size="mini" type="primary" @click="add_delay">添加一条延迟发送</el-button>
                    <table class="template" style="margin-top:5px">
                        <tbody>
                        <tr  v-for="(data, index) in delayData" :key="index">
                            <td>
                                <i class="el-icon-circle-close icon-close"
                                   v-if="index!==0"
                                   @click="del_delay(index)" title="删除"></i>
                            </td>
                            <td>
                                <label class="td-label"><font style="color:red">*</font>在触发后</label>
                                <el-input-number v-model="data.day" :min="0" :debounce="0"></el-input-number>
                                <label class="td-label">天</label>
                                <el-input-number v-model="data.hour" :min="0" :debounce="0"></el-input-number>
                                <label class="td-label">小时，发送</label>
                            </td>
                            <td>
                                <el-select v-model="data.template_id" placeholder="请选择回复/评价模板" filterable clearable>
                                    <el-option-group
                                            v-for="group in template_list"
                                            :key="group.channel_name"
                                            :label="group.channel_name">
                                        <el-option
                                                v-for="item in group.lists"
                                                :label="item.template_name"
                                                :key="item.template_id"
                                                :value="item.template_id">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </el-card>
            <div slot="footer" class="dialog__footer">
                <el-button @click.native="submit" type="primary" size="mini">提交</el-button>
                <el-button @click.native="cancel" size="mini">取消</el-button>
            </div>
        </div>

    </page-dialog>
</template>
<style lang="stylus">
    .sendRules-dialog{
        .el-card__header{
            background:#A9CDEB;
            .fr-checkbox{
                margin-left: 5px;
            }
        }
        .send-margin{
            margin-top: 5px;
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
                display: flex;
                flex:1;
                color: #4e92ce;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
                &:hover{
                    color: #bb7829;
                }
            }
        }
    }
</style>
<script>
    import {api_send_rules_addtime,api_send_rules_email,api_send_rules_item,api_send_rules_resources,api_add_send_rules,api_edit_send_rules,api_update_send_rules,api_getTemplates} from '../../../api/send-rules';
    export default{
        data(){
            return{
                urlObject:{},
                showSelect:false,
                showContext:false,
                show:this.value,//--弹框显示
                autoActions:[],
                name:'',//----规则名称
                autoContent:'',
                isSetup:true,//---是否启用
                platform:'',
                configs:{},
                rules:[],
                selected:[],
                panelWith:0,
                panelStatus:1,
                isChange:false,
                loading:false,
                triggerRules:'',
                trigger:[],
                emailRules:'',
                email_:[],
                delayData:[{day:0,hour:0,template_id:''}],
                template_list:[],
                isLoading:true,
                ruleComponent:''
            }
        },
        mounted(){
            this.triggerRulesFun();
        },
        methods:{
            open(){
                this.templateFun();
            },
            change_channel(){
                this.emailRulesFun();
                if(this.panelWith){
                    let code = this.panelWith.code;
                    this.init_config(code);
                };
                this.templateFun();
            },
            triggerRulesFun(){
                this.$http(api_send_rules_addtime).then(res=>{
                    this.trigger = res
                }).catch(code=>{this.$message({type:"error",message:code.message || code})})
            },
            emailRulesFun(){
                this.$http(api_send_rules_email,{channel_id: this.platform}).then(res=>{
                    this.email_ = res
                }).catch(code=>{this.$message({type:"error",message:code.message || code})})
            },
            templateFun(){
                let template = {
                    template_type:3
                };
                this.$http(api_getTemplates,template).then(res=>{
                    if(this.platform){
                        this.template_list = [];
                        this.template_list.push(res.data[this.platform]);
                    }else{
                        this.template_list = res.data
                    }
                }).catch(code=>{this.$message({type:"error",message:code.message || code})})
            },
            add_delay(){
                this.delayData.push({day:0,hour:0,template_id:''})
            },
            del_delay(index){
                this.delayData.splice(index,1)
            },
            close_send(val){
                if (!val) {
                    this.clear()
                }
            },
            //----------------------------------------------------------------
            init(){
                this.$http(api_send_rules_item).then(res=>{
                    this.isLoading = false;
                    /*-----------------后台返回数据格式不一致 需转换格式*/
                    let tempArr = [];
                    let child = [];
                    for(let key in res){
                        child.push(res[key]);
                    }
                    tempArr.push({label:'条件',child:child});
                    /*-----*/
                    this.rules = tempArr;
                    if(this.rules[0].child[0]){
                        this.click_item(this.rules[0].child[0]);
                    }
                });
            },
            clear(){
                this.selected = [];
                this.delayData = [];
                this.name = '';
                this.triggerRules = '',
                this.emailRules = '',
                this.isSetup = true,
                this.platform = '';
                this.autoContent = '';
                this.showSelect = false;
                this.showContext = false;
                this.panelWith = 0;
                this.panelStatus = 1;
            },
            init_config(code){
                let channel;
                switch(this.platform){
                    case 1:
                        channel = 'source_ebay';
                        break;
                    case 2:
                        channel = 'source_amazon';
                        break;
                    case 4:
                        channel = 'source_aliexpress';
                        break;
                    default:
                        channel =  'source';
                        break
                }
                // if(!this.configs[code]){
                    this.$http(api_send_rules_resources,{code:code==='source'?channel:code}).then(res=>{
                        this.$set(this.configs, code, res);
                        console.log(this.configs)
                    })
                // }
            },
            auto_action(actions){
                this.autoActions = actions;
            },

            click_item(item){
              /*  this.panelStatus = 2;*/
                this.panelWith = item;
                this.showContext = true;
                let result = this.get_item(item.code);
                if(!result){
                    this.selected.push({id:item.id,code:item.code,status:false,data:{child:{}}});
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
                    this.selected.push({id:item.id,code:item.code,status:true,data:{child:{}}});
                }
            },

            cancel(){
                this.show = false;
            },
            submit(){
                //限制延迟发送的规则
                if (this.delayData.length > 0) {
                    let bool = true;
                    this.delayData.forEach(data=>{
                        if (!data.template_id) {
                            this.$message({
                              message: '延迟发送规则没填写完善！',
                              type: 'error'
                            });
                            bool = false;
                            return ;
                        }
                    })
                    if (!bool) {
                        return false;
                    }
                }
                let selected = this.selected.filter(row=>row.status);
                selected = selected.map(row=>{
                    let rowgetdata = (data) =>{
                        let ret = [];
                        for(let item in data){
                            if(data.hasOwnProperty(item) && data[item].value){
                                ret.push({
                                    operator:data[item].operator.sel || "",
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

                let params = {
                    name:this.name,
                    platform: this.platform,
                    status:this.isSetup ? 0 : 1,
                    trigger_rule:this.triggerRules,
                    send_email_rule:this.emailRules,
                    delay_data:this.delayData,
                    rules:selected
                };
                if(this.mdfid > 0){
                    this.$http(api_update_send_rules, this.mdfid, params).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message||res
                        });
                        this.show = false;
                        let find = this.trigger.feedback.datas.find(row=>{
                            return row.id === this.triggerRules;
                        });
                        let find2 = this.trigger.message.datas.find(row=>{
                            return row.id === this.triggerRules;
                        });
                        if(!!find){
                            params.trigger_rule_str = find.name;
                        }else if(!!find2){
                            params.trigger_rule_str = find2.name;
                        }
                        this.$emit('add-update',params,this.mdfid);
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message||code
                        });
                    });
                    return;
                }
                this.$http(api_add_send_rules, params).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res
                    });
                    this.show = false;
                    let find = this.trigger.feedback.datas.find(row=>{
                        return row.id === this.triggerRules;
                    });
                    let find2 = this.trigger.message.datas.find(row=>{
                        return row.id === this.triggerRules;
                    });
                    if(!!find){
                        params.trigger_rule_str = find.name;
                    }else if(!!find2){
                        params.trigger_rule_str = find2.name;
                    }
                    this.$emit('add-update',params,parseInt(res.id),'add');
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    });
                });
            },
            current(item){
                return item === this.panelWith ? 'current' : '';
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
            },
            mdfidChange(val){
                this.init();
                if(val){
                    this.isLoading = true;
                    this.$http(api_edit_send_rules, val).then(res=>{
                        while (this.selected.shift()){}
                        this.name = res.name;
                        this.platform = +res.platform;
                        this.isSetup = res.status === 0 ? true : false;
                        this.triggerRules = res.trigger_rule;
                        this.emailRules = res.send_email_rule;
                        this.delayData = res.delay_data;
//                        this.showSelect = true;
//                         this.showContext = true;
                        this.makesure_rule_item().then(()=>{
                            res.rules.forEach(row=>{
                                let item = this.get_rule_item(row.item_id);
                                this.init_config(item.code);
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
                                    code:item.code,
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
                            message:code.message||code
                        });
                    })
                }else{
                    /*this.clear();*/
                    /*    this.isLoading = false;*/
                }
            }
        },
        computed:{
            showRules(){
                let classifys = [];
                console.log("this.rules",this.rules);
                this.rules.forEach(classify=>{
                    classify.child = classify.child || [];
                    let classifyChild = classify.child.filter(row=>{
                    	// console.log(this.showSelect);
                    	// console.log(this.selected);
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
                console.log("classifys",classifys);
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
            },
            emailHolder(){
                if(this.platform === ''){
                    return '请先选择平台'
                }
            }

        },
        props:{
            value:{},
            mdfid:{},
            titleName:{},
            channelList:{}
        },
        watch:{
//            mdfid(val){
//                console.log("val", val);
//                console.log("mdfid", this.mdfid);
//
//            },
            showContext(val){
                if(val){
                    this.panelStatus=2
                }else {
                    this.panelStatus=1
                }
            },
            value(val){
                this.show = val;
                if(val){
                    console.log(this.mdfid);
                    this.mdfidChange(this.mdfid);
                }
            },
            show(val){
                this.$emit('input', val);
            },
        },
        components:{
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
//                    return ["test"];
//                    break;
                        let values  = null;
                        if(values = data[config.key].value){
                            if(!that.urlObject[config.url]){
                                let url = window.config.apiHost+config.url;
                                const resource =http('GET', url);
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
