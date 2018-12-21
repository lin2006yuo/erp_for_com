<template>
    <div class="c-edit-page">
        <page-dialog :title="`查看invoice编号：${invoiceCode} 生成记录`"
                     @open="open" v-model="dialog"
                     size="large" :close-on-click-modal="false">
            <div class="box">
                <label class="head bold-font">订单信息</label>
                <div class="main">
                    <el-steps v-if="steps.length>0" ref="step" :space="100" :active="active" finish-status="success" class="ml-lg">
                        <el-step v-for="(item,index) in steps" :key="index" :title="item.name"
                                 :description="filterTime(item.time)"></el-step>
                    </el-steps>
                    <el-card v-else>
                        暂无订单进度信息...
                    </el-card>
                </div>
            </div>
            <div class="box mt-sm">
                <label class="head bold-font">生成involce使用的模板</label>
                <div class="main">
                    <el-row :gutter="8">
                        <el-col :span="8" class="left-main">
                            <div class="t-center mt-sm">
                                <img src="../invoice-rules/tongtool.jpg" class="template-img" @click="show_template">
                            </div>
                            <label class="bold-font ml-lg">{{data.template_name}}</label>
                            <label class="bold-font mr-lg fr">{{data.lang}}</label>
                            <show-template v-model="isShow"></show-template>
                        </el-col>
                        <el-col :span="16" class="right-main">
                            <el-form :model="data.rule" label-width="0">
                                <el-form-item>
                                    <label>自定义区域1(最多3行)</label>
                                    <el-input
                                            id="area1"
                                            disabled
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            placeholder="请输入内容"
                                            v-model="data.rule.custom_area1"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <label>自定义区域2(限定1行)：</label>
                                    <el-input
                                            id="area2"
                                            disabled
                                            type="textarea"
                                            placeholder="请输入内容"
                                            v-model="data.rule.custom_area2"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <label>自定义区域3(最多2行)：</label>
                                    <el-input
                                            id="area3"
                                            disabled
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            min="2"
                                            max="4"
                                            placeholder="请输入内容"
                                            v-model="data.rule.custom_area3"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <label>自定义区域4(限定1行)：</label>
                                    <el-input
                                            id="area4"
                                            disabled
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            min="2"
                                            max="4"
                                            placeholder="请输入内容"
                                            v-model="data.rule.custom_area4"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <label>自定义区域5(最多8行)</label>
                                    <el-input
                                            id="area5"
                                            disabled
                                            type="textarea"
                                            :autosize="{ minRows: 6, maxRows: 8}"
                                            min="6"
                                            max="8"
                                            placeholder="请输入内容"
                                            v-model="data.rule.custom_area5"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="">
                                    <label class="inline">税率：</label>
                                    <ui-limit-number :disabled="true" :limit="2" class="inline width-sm" v-model="data.rule.tax_rate"></ui-limit-number>&nbsp;%
                                    <!--<input class="inline width-xs el-input__inner" disabled onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="" type="number" min="0"></input>%-->
                                </el-form-item>
                                <el-form-item label="">
                                    <label class="inline">日期格式：</label>
                                    <el-select class="inline" v-model="data.rule.date_format" disabled>
                                        <el-option
                                                :key="item.code"
                                                v-for="item in timeRulesList"
                                                :label="item.name"
                                                :value="item.code"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="">
                                    <label class="inline">客户编号：</label>
                                    <el-select class="inline" v-model="data.rule.customer_code_rule" disabled>
                                        <el-option
                                                :key="item.code"
                                                v-for="item in serialNumber"
                                                :value="item.code"
                                                :label="item.name"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="box mt-sm">
                <table class="template">
                    <tr>
                        <th class="t-center" width="8%">生成方式</th>
                        <th class="t-left">
                            <div v-if="data.generate_type===0">Invoice自动规则：<label class="success">{{data.rule.name}}</label></div>
                            <div v-if="data.generate_type===1">手动生成：<label class="success">{{data.operator}}</label></div>
                        </th>
                    </tr>
                    <tr>
                        <td class="blue-bg t-left" colspan="2">
                            <label class="bold-font inline t-center" style="width:7%">生成状态</label>
                            <div class="mt-mini ml-sm">
                                <!--生成状态-->
                                <label :class="[data.status===4?'red':'success']">{{data.status | filterStatus}}：</label>
                                <label v-if="data.reason">原因：{{data.reason}}</label>
                                <label v-if="data.invoice_code" class="ml-sm">{{data.invoice_code}}</label>
                                <label v-if="data.create_time" class="ml-sm">{{data.create_time | filterTime}}</label>
                                <a class="link ml-sm" :href="downUrl" :download="data.file_url" target="_blank" title="点击下载pdf文件">{{data.file_url}}</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <el-button size="mini" @click.native="close">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-edit-page{
        .box{
            border:1px solid #BDCDDC;
            padding:0;
            >label.head{
                display: block;
                box-sizing: border-box;
                width:100%;
                height:26px;
                line-height: 1;
                padding:5px 10px;
                background-color: #A9CDEB;
            }
            .blue-bg{
                background-color: #D7E8F6;
             }
            .success{
                color:#009300;
            }
            .main{
                padding:8px 10px;
                .left-main{
                    height:270px;
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
                }
                .right-main{
                    max-height:270px;
                    overflow-y: auto;
                }
            }
        }
    }
</style>
<script>
    import {api_get_speed} from '../../../../api/order-local';
    import {format_info,code_info} from '../../../../api/invoice';
    export default{
        data(){
            return {
                dialog:false,
                steps:[],
                active:0,
                timeRulesList:[],
                serialNumber:[],
                isShow:false
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        filters:{
            filterStatus(val){
                switch (val){
                    case 0:
                        return "未生成";
                        break;
                    case 1:
                        return "待生成";
                        break;
                    case 2:
                        return "生成中";
                        break;
                    case 3:
                        return "成功";
                        break;
                    case 4:
                        return "失败";
                        break;
                }
            },
            filterTime(val){
                if(val) return datef("YYYY-MM-dd HH:mm:ss",val);
            }
        },
        created(){
            this.code_info();
            this.format_info();
        },
        computed:{
            downUrl(){
                if(this.data.file_url){
                    return config.apiHost+this.data.file_url;
                }
            }
        },
        methods:{
            open(){
                this.api_get_step();
            },
            //左侧模板弹出事件
            show_template(){
                this.isShow = true;
            },
            close(){
                this.dialog = false;
            },
            //进度条时间过滤
            filterTime(val){
                if(val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            //进度条   API
            api_get_step(){
                this.$http(api_get_speed,this.orderId).then(res=>{
                    let active = 0;
                    res.map(row=>{
                        if(row.time){
                            active = active+1;
                        }
                    })
                    this.active = active;
                    this.steps = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //获取日期格式选项 API
            format_info(){
                this.$http(format_info).then(res=>{
                    this.timeRulesList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //获取客户编号选项
            code_info(){
                this.$http(code_info).then(res=>{
                    this.serialNumber = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            value:{},
            invoiceCode:{},
            data:{},
            orderId:{
                required:true
            },
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
            tabs:require("../../../../components/tabs.vue").default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
            showTemplate:require('../invoice-rules/show-template.vue').default,
        }
    }
</script>
