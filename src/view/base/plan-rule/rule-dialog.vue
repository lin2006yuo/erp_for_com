<template>
    <page-dialog v-model="show" size="large" @open="open" :title="`${title}${name}`"  @change="change_dialog">
        <el-card class="rule-dialog-header">
            <el-form>
                <el-row>
                    <el-form-item prop="name" class="inline">
                        <label class="red mr-mini inline">*</label>规则名称：
                        <el-input v-model="name" class="inline"></el-input>
                    </el-form-item>
                    <el-form-item prop="level" class="inline ml-sm">
                        <label class="mr-mini inline">审批层级：</label>
                        <el-select v-model="level" class="inline width-lg">
                            <el-option v-for="item in grades"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="start_time" class="inline ml-sm">
                        <label class="red inline">*</label>有效日期：
                        <el-date-picker v-model="start_time" type="date"
                                        placeholder="年/月/日"
                                        :picker-options="pickerStart"
                                        class="inline width-lg"></el-date-picker>
                        <label class="inline">-</label>
                        <el-date-picker v-model="end_time" type="date"
                                        placeholder="年/月/日"
                                        :picker-options="pickerEnd"
                                        class="inline width-lg"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="inline ml-sm">
                        <label class="inline">状态：</label>
                        <el-switch
                            class="inline"
                            v-model="isSetup"
                            on-text="启用"
                            off-text="停用"></el-switch>
                    </el-form-item>
                </el-row>
                <el-row style="margin:10px 0">
                    <el-col :span="24">
                        <el-form-item label="审批人：" required>
                            <el-button size="mini" type="primary" @click.native="add">添加</el-button>
                            <ul>
                                <li v-for="(approver,i) in approvers" style=" margin: 10px 10px 0 0;;display: inline-block;">
                                    <el-select v-model="approvers[i]"
                                               filterable
                                               remote
                                               :loading="loading"
                                               :remote-method="(query)=>{approver_remote(query,i)}"
                                               class="inline">
                                        <el-option
                                                v-for="opt in approversOpts[i]"
                                                :key="opt.id"
                                                :label="opt.realname"
                                                :value="opt.id">
                                        </el-option>
                                    </el-select>
                                    <el-button size="mini" type="warning" @click.native="remove(i)">删除</el-button>
                                </li>
                            </ul>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card  class="mt-xs">
            <el-row>
                <el-col class="rule-dialog-body" v-show="leftSpan" :span="leftSpan">
                    <el-card>
                        <el-checkbox v-model="showSelect" label="仅显示勾选项"></el-checkbox>
                        <el-checkbox v-model="showContext" :label="showContext ? '显示选项内容' :'隐藏选项内容' "></el-checkbox>
                        <div class="rules" v-for="item in showRules">
                            <label>{{item.label}}</label>
                            <ul>
                                <li v-for="subItem in item.child" v-if="approve_show(subItem)" :class="current(subItem)">
                                    <el-checkbox :value="subItemStatus(subItem)"
                                    @change="change(subItem)">
                                    </el-checkbox>
                                    <span @click="click_item(subItem)">
                                        {{subItem.name}}
                                        <span class="context" v-if="showContext || showSelect">{{item_context(subItem)}}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </el-col>
                <el-col class="rule-dialog-body" v-if="rightSpan" :span="rightSpan">
                    <el-card>
                        <rule-cond :config="ruleConfig"
                                   :data="ruleData"
                                   :code="ruleCode"
                                   :title="ruleTitle"
                                  >
                        </rule-cond>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <div slot="footer" >
            <request-button @click="submit" :mintime="200" req-key="submit_rule" class="inline">保存</request-button>
            <el-button @click.native="cancel" size="mini" class="inline">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .rule-dialog-header{
        height:20%;
        .el-card__body{
            padding: 20px;
        }
    }
    .rule-dialog-body{
        height:400px;
        max-height:400px;
        overflow-y: auto;
    }
    .rules{
        border: 1px solid #d6d6d6;
        margin-top:5px;
        padding:5px;
        >label{
            margin: 5px;
            display: block;
        }
        li{
            cursor: pointer;
            padding-top:5px;
            padding-bottom:5px;
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
</style>
<script>
    import {validators} from '../order-rule/validators'
    import {api_add, api_update, api_lookup, api_rule_items,api_get_resource, api_approver} from '../../../api/plan-rule';
    export default{
        data(){
            return{
                showSelect:false,
                showContext:false,
                show:this.value,
                autoActions:[],
                name:'',
                autoContent:'',
                isSetup:false,
                platform:0,
                configs:{},
                rules:[],
                selected:[],
                panelWith:0,
                panelStatus:1,
                isChange:false,
                btime:'',
                etime:'',
                approvers:[],
                approversOpts:[],
                loading:false,
                test:'',
                level:1,
                grades: [
                    {label: '一级审批', value: 1},
                    {label: '二级审批', value: 2}
                ],
                start_time: '',
                end_time: '',
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.end_time) {
                            return time.getTime() > this.end_time;
                        } else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.start_time) {
                            return time.getTime() < this.start_time;
                        } else {
                            return false
                        }
                    }
                }
            }
        },
        created(){
            this.init();
        },
        methods:{
            open(){
                if(this.mdfid!==0){
                    this.approversOpts = [];
                    this.$http(api_lookup, this.mdfid).then(res=>{
                        while (this.selected.shift()){}
                        this.name = res.title;
                        this.level = res.level;
                        this.start_time = res.start_time*1000;
                        this.end_time = res.end_time*1000;
                        this.isSetup = res.status === 0 ? true : false;
                        this.approvers = [];
                        res.approver.forEach((app,i)=>{
                            this.$nextTick(()=>{
                                this.approversOpts[i] = [app];
                                this.approvers.push(app.id);
                            });
                        });
//                            this.showSelect = true;
                        this.showContext = true;
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
                                    name:item.name,
                                    data:{
                                        value:true,
                                        child:chooses(row.choose)
                                    }
                                };
                                this.selected.push(select);
                            });
                        });

                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message||code
                        });
                    })
                }else{
                    this.clear();
                }
                this.$nextTick(()=>{
                    this.click_item(this.rules[0].child[0])
                })
            },
            validators,
            init(){
                this.$http(api_rule_items).then(res=>{
                    this.rules = res;
                });
            },
            clear(){
                this.selected = [];
                this.name = '';
                this.level = 1;
                this.platform = 0;
                this.autoContent = '';
                this.approvers = [];
                this.showSelect = false;
                this.showContext = false;
                this.panelWith = 0;
                this.panelStatus = 1;
            },
            init_config(code){
                if(!this.configs[code]){
                    this.$http(api_get_resource,{code:code}).then(res=>{
                        this.$set(this.configs, code, res);
                    })
                }
            },
            auto_action(actions){
                this.autoActions = actions;
            },
            approver_remote(query, i){
                this.loading = true;
                this.$http(api_approver, query).then(res=>{
                    this.approversOpts[i] = res.data.filter(
                        row=>{
                            if(this.approvers[i] === row.id){
                              return true;
                            }
                            return !this.approvers.find(approverid=>row.id === approverid);
                        });
                    this.loading = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                })
            },
            click_item(item){
                this.panelStatus = 2;
                this.panelWith = item;
                this.showContext = true;
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
                    strs = calc_item_context(this.configs[node.code].type,this.configs[node.code].data, node.data.child);
                }
                node.status=!!strs.length;
                return strs.join(', ');
            },
            subItemStatus(item){
                let result = this.get_item(item.code || false);
                return result && result.status;
            },
            get_item(value){
                return this.selected.find(row=>row.code===value);
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
            add(){
                this.approvers.push('');
                let index=this.approvers.length-1;
                this.approver_remote("",index)
            },
            remove(index){
                this.approvers.splice(index, 1);
                this.approversOpts[index] = this.approversOpts[index+1];
            },
            cancel(){
                this.show = false;
            },
            submit(){
                let selected = this.selected.filter(row=>row.status);
                let valid=  this.validators(selected);
                if(this.name === ''){
                    this.$reqKey('submit_rule',false);
                    this.$message({type:"info",message:`规则名称未填写，请检查！`});
                    return false
                }
                if(this.start_time === ''){
                    this.$reqKey('submit_rule',false);
                    this.$message({type:"info",message:`有效开始时间未填写，请检查！`});
                    return false
                }
                if(this.end_time === ''){
                    this.$reqKey('submit_rule',false);
                    this.$message({type:"info",message:`有效结束时间未填写，请检查！`});
                    return false
                }
                if(this.approvers.toString() === ''){
                    this.$reqKey('submit_rule',false);
                    this.$message({type:"info",message:`审批人未选择，请检查！`});
                    return false
                }
                this.approvers = this.approvers.filter(row=>{
                	return row !=='';
                });
                if(valid.length){
                    let str=valid.map(row=>row.name).join(',');
                    this.$reqKey('submit_rule',false);
                    this.$message({type:"info",message:`${str}不符合实际业务条件，请检查！`});
                    return false
                }
                if(selected.length===0){
                    this.$reqKey('submit_rule',false);
                    this.$message({type:"info",message:`请至少勾选一个条件，请检查！`});
                    return false
                }
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
                    title:this.name,
                    level:this.level,
                    start_time:datef('YYYY-MM-dd',this.start_time/1000),
                    end_time:datef('YYYY-MM-dd',this.end_time/1000),
                    approver:this.approvers,
                    status:this.isSetup ? 0 : 1,
                    rules:selected
                };
                if(this.mdfid === 0){
                    this.$http(api_add, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.show = false;
                        this.$emit('refresh-data');
                        this.clear();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('submit_rule', false);
                        }, 200);
                    });
                }else {
                    this.$http(api_update, this.mdfid, params).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message||res
                        });
                        this.$emit('refresh-data');
                        this.show = false;
                        this.clear();
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message||code
                        });
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('submit_rule',false);
                        },200);
                    });
                }
            },
            current(item){
                return item == this.panelWith ? 'current' : '';
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
            change_dialog(val){
                if (!val) {
                    this.showSelect=false;
                    this.showContext=false;
                    this.panelStatus = 1
                } else {

                }
            },
            approve_show(item) {
                switch (true) {
                    case item.code === 'firstApprove':
                        return this.level === 2;
                }
                return true;
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
                        return 12;
                    case 3:
                        return 0;
                }
            },
            rightSpan(){
                switch (this.panelStatus){
                    case 1:
                        return 0;
                    case 2:
                        return 12;
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
            title:{},
            mdfid:{}
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
                if(val){
                    this.init();
                    this.$nextTick(()=>{
                        this.click_item(this.rules[0].child[0])
                    })
                }
            },
            showContext(val){
                if (val) {
                    this.panelStatus = 2
                } else {
                    this.panelStatus = 1
                }
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            labelItems:require('../../../components/label-items.vue').default,
            tree:require('./tree.vue').default,
            ruleCond:require('./rule-cond.vue').default,
        }
    }

    function calc_item_context(type, configs, data) {
        let strs = [];
        for(let i=0; i < configs.length; i++){
            let config = configs[i];
            let title = '';
            if(data[config.key]){
                switch (config.type || type){
                    case 1:
                        if(data[config.key].value){
                            let childstr = calc_item_context(config.type || type, config.child, data[config.key].child).join(',');
                            childstr = childstr ? `:${childstr}` : '';
                            title = `${config.title}${childstr}`;
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
                    default:
                        break;
                }
                title && strs.push(title);
            }

        }
        return strs;
    }
</script>
