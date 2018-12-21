<template>
    <div class="c-add_rule">
        <page-dialog :title="title"
                     @close="close"
                     @open="open"
                     size="large" v-model="dialog" :close-on-click-modal="false">
            <div>
                <!--top start-->
                <div class="mb-xs">
                    <el-form :model="form" ref="form" label-width="100px">
                        <el-row :gutter="8">
                            <el-col :span="8">
                                <el-form-item label="规则名称：" prop="name"
                                    :rules="[{required:true,message:'规则名称必填',trigger:'blur'}]"
                                >
                                    <el-input v-model="form.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="是否启用：">
                                    <el-switch
                                            v-model="form.status"
                                            on-text="启用"
                                            off-text="停用">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                </div>
                <!--top end-->
                <!--middle start-->
                <el-row class="mb-sm" :gutter="8">
                    <el-col :span="showContext?12:24">
                        <div class="colors-box  primary-blue">
                            <label class="bold-font">{{rules.label}}</label>
                            <span class="fr mr-sm">
                                <el-checkbox v-model="showSelect" label="仅显示勾选项" @change="showChecked"></el-checkbox>
                                <el-checkbox v-model="showContext" :label="showContext ? '显示选项内容' :'隐藏选项内容' "></el-checkbox>
                            </span>
                        </div>
                        <div class="default-box" style="height:300px;overflow-y:auto;">
                            <ul class="showchecked">
                                <li v-for="subItem in rules.child" :class="current(subItem)" @click="click_item(subItem)" style="display: block">
                                    <el-checkbox :value="subItemStatus(subItem)"
                                                 @change="change(subItem)"
                                                 :disabled="disable(subItem)">
                                    </el-checkbox>
                                    <span>
                                                {{subItem.name}}&nbsp;{{subItem.statement}}
                                         <span class="select-context" v-if="showContext || showSelect">{{item_context(subItem)}}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col v-if="showContext" :span="12">
                        <rule-cond :config="ruleConfig"
                                   :data="ruleData"
                                   :code="ruleCode"
                                   :title="ruleTitle"
                                   >
                        </rule-cond>
                    </el-col>
                </el-row>
                <!--middle end-->
                <!--footer start-->
                <div>
                    <div class="colors-box primary-blue">
                        <span class="red inline">*</span>
                        <span class="bold-font">生成Invoice使用模板</span>
                        <el-select class="inline ml-xs" v-model="form.template_id">
                            <el-option
                                placeholder="请选择模板"
                                v-for="item in templateList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="default-box">
                        <el-row>
                            <el-col :span="8">
                                <div class="t-center mt-lg">
                                    <img src="./tongtool.jpg" class="template-img" @click="show_template" alt="" v-if="form.template_id === 2">
                                    <img src="./enmodel.jpg" class="template-img" @click="show_template" alt="" v-else>
                                </div>
                                <show-template v-model="isShow" :template-id="form.template_id"></show-template>
                            </el-col>
                            <el-col :span="16"   style="height:270px;overflow-y:auto">
                                <div class="mb-xs">
                                    <span>自定义区域1(最多3行)</span>
                                    <ui-textarea-row  v-model="form.custom_area1" :row="3"></ui-textarea-row>
                                </div>
                                <div class="mb-xs">
                                    <span>自定义区域2(限定1行)</span>
                                    <ui-textarea-row  v-model="form.custom_area2" :row="1"></ui-textarea-row>
                                </div>
                                <div class="mb-xs">
                                    <span>自定义区域3(最多2行)</span>
                                    <ui-textarea-row  v-model="form.custom_area3" :row="2"></ui-textarea-row>
                                </div>
                                <div class="mb-xs">
                                    <span>自定义区域4(限定1行)</span>
                                    <ui-textarea-row  v-model="form.custom_area4" :row="1"></ui-textarea-row>
                                </div>
                                <div class="mb-xs">
                                    <span>自定义区域5(最多8行)</span>
                                    <ui-textarea-row  v-model="form.custom_area5" :row="8">
                                    </ui-textarea-row>
                                </div>
                                <div class="mb-xs">
                                    <span style="margin-left:22px">税率</span>
                                    <input class="inline width-xs el-input__inner" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="form.tax_rate" type="number" min="0"></input>%
                                </div>
                                <div class="mb-xs">
                                    <span>日期格式</span>
                                    <el-select class="inline" v-model="form.date_format">
                                        <el-option
                                            :key="item.code"
                                            v-for="item in timeRulesList"
                                            :label="item.name"
                                            :value="item.code"
                                        ></el-option>
                                </el-select>
                                </div>
                                <div class="mb-xs">
                                    <span>客户编号</span>
                                    <el-select class="inline" v-model="form.customer_code_rule">
                                        <el-option
                                            :key="item.code"
                                            v-for="item in serialNumber"
                                            :value="item.code"
                                            :label="item.name"
                                        ></el-option>
                                </el-select>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!--footer end-->
            </div>
            <div slot="footer">
                <request-button req-key="addRuleSave" @click="save">提交/保存</request-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-add_rule{
        .template-img{
            width:170px;
            &:hover{
                -webkit-box-shadow:0 0 25px rgb(204,227,199);
                -moz-box-shadow:0 0 25px rgb(204,227,199);
                box-shadow:0 0 25px rgb(204,227,199);
            }
            &:active{
                -webkit-box-shadow:0 0 25px rgb(173,227,255);
                -moz-box-shadow:0 0 25px rgb(173,227,255);
                box-shadow:0 0 25px rgb(173,227,255);
            }
        }
        .colors-box{
            box-sizing: border-box;
            height:30px;
            line-height: 28px;
            font-size: 1.2rem;
            padding-left:3px;
        }
        .default-box{
            border:1px solid #9DB5CB;
            padding:5px 3px;
            >label{
                margin: 5px;
                display: block;
            }
            li{
                cursor: pointer;
                padding:10px 5px;
                padding-top:5px;
                padding-bottom:5px;
                &:hover{
                    background-color: rgba(204,227,199,.7);
                }
            }
            .current{
                background: rgba(173,227,255,.5);
            }
            .select-context{
                display: flex;
                flex:1;
                color: #4e92ce;
                /*white-space:nowrap;*/
                word-break:break-all;
                overflow:hidden;
                text-overflow:ellipsis;
                &:hover{
                    color: #bb7829;

                }
            }
            .content-select{

            }
            .cccc{
                >.el-textarea__inner{
                    white-space: nowrap;
                    overflow-x: hidden;
                }
            }
        }
        .primary-blue{
            border:1px solid #A9CDEB;
            background-color:#A9CDEB;
        }

    }
</style>
<script>
import {code_info,format_info,invoice_item,get_resource,invoice_template,add_invoice_rules,update_invoice_rules,edit_invoice_rules,look_invoice_rules,} from '../../../../api/invoice';
import http from '../../../../lib/http';
    export default{
        data(){
            return {
                urlObject:{},
                clickData: [],
                dialog:false,
                gainForm:{},
                templateList:[],
                onlyShowSelect:false,
                hideRight:false,
                form:{
                    name:"",
                    status:false,
                    template_id:"",
                    custom_area1:"",
                    custom_area2:"",
                    custom_area3:"",
                    custom_area4:"",
                    custom_area5:"",
                    tax_rate:"",
                    date_format:"",
                    customer_code_rule:"",
                },
                timeRulesList:[],
                serialNumber:[],
                curCode:"",
//
                autoAction:1,
                showSelect:false,
                showContext:false,
                rules:{},
                panelWith:0,
                selected:[],
                configs:{},
                panelStatus:1,
                isShow:false,
                isTemplate:false,
                lists:[],
            }
        },
        created(){
            this.dialog = this.value;
            this.get_invoice_item();
            this.get_template();
            this.code_info();
            this.format_info();
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
        },
        computed:{
            ruleConfig(){
                return this.configs[this.ruleCode] || {};
            },
            ruleCode(){
                if(this.panelWith){
                    let code = this.panelWith.code;
                    this.get_resource(code);
                    return code;
                }else{
                    return "";
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
            ruleTitle(){
                if(this.panelWith){
                    return this.panelWith.statement;
                }else{
                    return "";
                }
            },
        },
        methods:{
            open(){
                this.click_item(this.rules.child[0]);
                if(!this.mdfid){
                    this.form.name="";
                    this.form.status=false;
                    this.form.template_id="";
                    this.form.custom_area1="";
                    this.form.custom_area2="";
                    this.form.custom_area3="";
                    this.form.custom_area4="";
                    this.form.custom_area5="";
                    this.form.tax_rate="";
                    this.form.date_format="";
                    this.form.customer_code_rule="";
                    this.selected = [];
                }
            },
            close(){
                this.showSelect=false;
                this.showContext=false;
                this.panelStatus=1
            },
            edit_form(val){
                this.$http(edit_invoice_rules,val).then(res=>{
                    while (this.selected.shift()){}
                    this.$set(this.form,'name',res.name);
                    this.$set(this.form,'status',res.status===1?false:true);
                    this.$set(this.form,'template_id',res.template_id);
                    this.$set(this.form,'custom_area1',this.add_n(res.custom_area1));
                    this.$set(this.form,'custom_area2',this.add_n(res.custom_area2));
                    this.$set(this.form,'custom_area3',this.add_n(res.custom_area3));
                    this.$set(this.form,'custom_area4',this.add_n(res.custom_area4));
                    this.$set(this.form,'custom_area5',this.add_n(res.custom_area5));
                    this.$set(this.form,'tax_rate',res.tax_rate);
                    this.$set(this.form,'date_format',res.date_format);
                    this.$set(this.form,'customer_code_rule',res.customer_code_rule);
                    this.makesure_rule_item().then(()=>{
                        res.rules.forEach(row=>{
                            let item = this.get_rule_item(row.item_code);
                            this.get_resource(item.item_code);
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
                }).catch(code=>{
                    console.log(code);
                })
            },
            showChecked(){
              var selectDom = document.getElementsByClassName('showchecked')[0];
              var select = selectDom.children;
              var a = select[0];
              if(this.showSelect){//选中，显示选中的列表
                console.log(111);
                for(var i=0;i<=select.length;i++){
                  if(select[i].children[0].children[0].className == 'el-checkbox__input is-checked' || select[i].children[0].children[0].className == 'el-checkbox__input is-checked is-focus'){
                      select[i].style.display = 'block';
                  }else {
                    select[i].style.display = 'none';
                  }
                }
                console.log(select);


              }else {//取消，显示所有
                console.log(222);
                for(var j=0;j<=select.length;j++){
                    select[j].style.display = 'block';
                }
              }

            },
            key_event(val,id,num){
                this.lists = [];
                let reg = /\s/;
                this.lists = val.split(reg);
                let ue = document.getElementById(id);
                if(this.lists.length>=num){
                    ue.addEventListener("keydown",this.key_down);
                }else{
                    ue.removeEventListener("keydown",this.key_down);
                }
            },
            key_down(e){
                if(e.keyCode===13){
                    e.cancelBubble = true;
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            show_template(){
                this.isShow = true;
            },
            create_pdf(){
              this.isTemplate = true;
            },
            get_rule_item(code){
                    let childs = this.rules.child;
                    for(let j=0; j < childs.length; j++){
                        if(childs[j].code === code){
                            return childs[j];
                        }
                    }
            },
            makesure_rule_item(){
                return new Promise((succ,fail)=>{
                    let make = () =>{
                        if(this.rules.child.length > 0 ){
                            succ();
                        }else{
                            setTimeout(make, 500);
                        }
                    };
                    setTimeout(make, 0);
                })
            },
            change_dialog(val){
                if(!val){

                }else {

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
            disable(item){
                if(item.rule_type===1&&this.autoAction===1){
                    return true
                }else  return false
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
            subItemStatus(item){
                let result = this.get_item(item.code || false);
                return result && result.status;
            },
            current(item){
                return item == this.panelWith ? 'current' : '';
            },
            get_item(value){
                return this.selected.find(row=>row.code==value);
            },
            click_item(row){
                this.showContext=true;
                this.panelWith = row;
                let result = this.get_item(row.code);
                if(!result){
                    this.selected.push({code:row.code,status:false,data:{child:{}}});
                }
            },
            addClass(index){
                this.clickData = this.clickData.map(()=>{
                    return  false
                });
                this.clickData[index] = true;
            },
            add_br(val,row){
                if(!val)return '';
                let list = val.split('\n');
                if(list.length>row){
                    list.length = row;
                }
                return list.join('<br>')
            },
            add_n(val){
                if(!val)return '';
                let reg = /<br>/ig;
                return val.replace(reg,'\n');
            },
            save(){
                this.$refs.form.validate((b)=>{
                    if(b){
                        if(!this.form.template_id)return this.$message({type: "warning", message:"请选择生成Invoice所使用的模板"});
                        let selected = this.selected.filter(row=>row.status);
                        selected = selected.map(row=>{
                            let rowgetdata = (data) =>{
                                let ret = [];
                                for(let item in data){
                                    if(data.hasOwnProperty(item) && data[item].value){
                                        let ids = [];
                                    	if(data[item].value.length>0){
                                            ids = data[item].value.map(row=>{
                                            	return {
                                                    id:row.id,
                                                    shortname:row.shortname,
                                                }
                                            });
                                        }else{
                                            ids = [];
                                        }
                                        ret.push({
                                            operator:data[item].operator.sel || "",
                                            key:item,
                                            value:ids,
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
                                item_source:row.code,
                                item_value:value
                            }
                        });
                        let params = {
                            name:this.form.name,
                            status:this.form.status ? 0:1,
                            rules:selected,
                            template_id:this.form.template_id,
                            custom_area1:this.add_br(this.form.custom_area1,3),
                            custom_area2:this.add_br(this.form.custom_area2,1),
                            custom_area3:this.add_br(this.form.custom_area3,2),
                            custom_area4:this.add_br(this.form.custom_area4,1),
                            custom_area5:this.add_br(this.form.custom_area5,8),
                            tax_rate:this.form.tax_rate,
                            date_format:this.form.date_format,
                            customer_code_rule:this.form.customer_code_rule,
                        };
                        if(this.mdfid > 0){
                            this.$http(update_invoice_rules, this.mdfid, params).then(res=>{
                                this.$message({type: "success", message: res.message || res});
                                this.dialog = false;
                                this.$emit("submit");
                            }).catch(code=>{
                                this.$message({type: "error", message: code.message || code})
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('addRuleSave', false);
                                }, 300)
                            });
                            return;
                        }
                        this.$http(add_invoice_rules, params).then(res=>{
                            this.$message({type: "success", message: res.message || res});
                            this.dialog = false;
                            this.$emit("submit");
                        }).catch(code=>{
                            this.$message({type: "error", message: code.message || code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addRuleSave', false);
                            }, 300)
                        });
                    }
                });
            },
            cancel(){
                this.dialog = false;
            },
//            ----------------------------------------------- API
            /*获取规则可选条件*/
            get_invoice_item(){
                this.$http(invoice_item).then(res=>{
                    this.rules = res;
                }).catch(code=>{
                    console.log(code);
                });
            },
            /*获取条件资源*/
            get_resource(code){
                    if(!this.configs[code]){
                        this.$http(get_resource,{code:code}).then(res=>{
                            this.$set(this.configs, code, res);
                        }).catch(code=>{
                            console.log(code);
                        })
                    }
            },
            /*获取模板信息*/
            get_template(){
               this.$http(invoice_template).then(res=>{
                   this.templateList = res;
               }).catch(code=>{
                   console.log(code);
               })
            },
            /*获取客户编号选项*/
            code_info(){
                this.$http(code_info).then(res=>{
                    this.serialNumber = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            /*获取日期格式选项*/
            format_info(){
                this.$http(format_info).then(res=>{
                    this.timeRulesList = res;
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        props:{
            value:{},
            mdfid:{},
            edit:{},
            title:{

            }
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            ruleCond:require("./rule-cond").default,
            showTemplate:require("./show-template").default,
            invoiceTemplate:require('./invoice-template.vue').default,
            uiTextareaRow:require("../../../../components/ui-textarea-row.vue").default,
            requestButton:require('../../../../global-components/request-button').default
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
