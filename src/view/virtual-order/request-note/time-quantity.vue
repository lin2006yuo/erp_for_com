<template>
    <div class="c-time-quantity.vue">
        <page-dialog :title="comTitle" v-model="dialog"
                     @open="open"
                     @close="close"
                     size="large" :close-on-click-modal="false">
            <div>
                <ui-table
                    :heads="currentHandle==='add'&&!!form.isSaveBtn?addHeader:otherHeader"
                >
                    <template v-for="(item,index) in form.time_quantity">
                        <tr>
                            <td>
                                <el-date-picker
                                        v-if="currentHandle==='add'&&!!form.isSaveBtn"
                                        v-model="item.task_time"
                                        align="right"
                                        type="date"
                                        :picker-options="pickerPerform"
                                        placeholder="选择日期">
                                </el-date-picker>
                                <label v-else>{{filterTime(item.task_time)}}</label>
                            </td>
                            <td>
                                <el-input-number :controls="false" size="small" :min="1" v-model="item.quantity" v-if="currentHandle==='add'&&!!form.isSaveBtn"></el-input-number>
                                <label v-else>{{item.quantity}}</label>
                            </td>
                            <td>
                                <el-input-number :controls="false" size="small" :min="0" v-model="item.seller_cost" v-if="currentHandle==='add'&&!!form.isSaveBtn"></el-input-number>
                                <label v-else>{{item.seller_cost}}</label>
                            </td>
                            <td>
                                <el-input-number :controls="false" size="small" :min="0" v-model="item.estimate_cost" v-if="currentHandle==='add'&&!!form.isSaveBtn"></el-input-number>
                                <label v-else>{{item.estimate_cost}}</label>
                            </td>
                            <td>
                                <el-select  v-if="currentHandle==='add'&&!!form.isSaveBtn" v-model="item.order_currency" placeholder="请选择">
                                    <el-option
                                            v-for="items in currencyOptions"
                                            :key="items.value"
                                            :label="items.label"
                                            :value="items.value">
                                    </el-option>
                                </el-select>
                                <label v-else>{{ item.order_currency }}</label>
                            </td>
                            <td>
                                <el-date-picker
                                        v-if="currentHandle==='add'&&!!form.isSaveBtn"
                                        v-model="item.msg_time"
                                        align="right"
                                        type="date"
                                        :picker-options="pickerMsg"
                                        placeholder="选择日期">
                                </el-date-picker>
                                <label v-else>{{filterTime(item.msg_time)}}</label>
                            </td>
                            <td v-if="currentHandle==='add'&&!!form.isSaveBtn">
                                <span class="operate" v-if="index===(form.time_quantity.length-1)" @click="add(item)">添加</span>
                                <span v-if="index===(form.time_quantity.length-1)&&form.time_quantity.length>1">|</span>
                                <span class="operate" v-if="form.time_quantity.length>1" @click="delete_line(item,index)">删除</span>
                            </td>
                        </tr>
                    </template>
                </ui-table>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog =false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
   import {api_get_currency_type} from '../../../api/request-note';
    export default {
        data() {
            return {
                currencyOptions:[],//货币类型
                dialog:this.value,
                cloneData:{},
                addHeader:[
                    {label:'执行日期',width:19,isRequired:true},
                    {label:'订单数量',width:14,isRequired:true},
                    {label:'销售单价',width:14,isRequired:true},
                    {label:'费用预估',width:14,isRequired:true},
                    {label:'币种',width:10,isRequired:true},
                    {label:'留评日期',width:19},
                    {label:'操作',width:10}
                ],
                otherHeader:[
                    {label:'执行日期',width:30,isRequired:true},
                    {label:'订单数量',width:10,isRequired:true},
                    {label:'销售单价',width:10,isRequired:true},
                    {label:'费用预估',width:10,isRequired:true},
                    {label:'币种',width:10,isRequired:true},
                    {label:'留评日期',width:30},
                ],
                pickerPerform:{
                    disabledDate:(time)=>{
                        return time.getTime()<Date.now()-24*60*60*1000;
                    }
                },
                pickerMsg:{
                    disabledDate:(time)=>{
                        return time.getTime()<Date.now()-24*60*60*1000
                    }
                },
                isSubmit: false
            }
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
            comTitle(){
                if(this.currentHandle==="add"&&this.form.isSaveBtn) return `添加SKU:${this.form.sku}虚拟订单数量及要求`;
                return `查看SKU:${this.form.sku}虚拟订单数量及要求`;
            },
        },
        methods:{
            close(){
                if(this.isSubmit === false){//判断是否是提交的弹框关闭
                    this.$emit("cancel",this.cloneData);
                }
            },
            open(){
                this.cloneData = clone(this.form);
                this.cloneData.time_quantity.forEach((row,index)=>{
                    let cur = this.form.time_quantity.find((row,i)=>i===index);
                    if(!!cur) row.date = cur.date;
                });
                this.get_currency_type();
                this.isSubmit = false
            },
            filterTime(val){
                let date=0;
                if(!!val){
                    if(this.currentHandle==="add"){
                        date = new Date(val).getTime()/1000
                    }else{
                        date = val;
                    }
                }
                return val?datef('YYYY-MM-dd',date):"-- --";
            },
            submit(){
                if(this.form.time_quantity.length<=0)return this.$message({type:"warning",message:"请至少添加一条数据"});
                let canSubmit = true;
                this.form.time_quantity.forEach((row,index)=>{
                    if(!row.task_time||!Number(row.quantity)||!row.seller_cost||!row.estimate_cost||!row.order_currency){
                        canSubmit = false;
                        return this.$message({type:"warning",message:`第${index+1}行存在必填项未填写，请补充完整`});
                    }else if(parseInt(row.quantity)!==row.quantity){
                        canSubmit = false;
                        return this.$message({type:"warning",message:`第${index+1}行订单数量为小数，请改成正整数`});
                    }else if(row.msg_time&&row.msg_time<row.task_time){
                        canSubmit = false;
                        return this.$message({type:"warning",message:`第${index+1}行留评日期比执行日期早，请重新选择日期`})
                    };
                });
                if(!canSubmit) return;
                this.$emit("submit",this.form);
                this.isSubmit = true;
                this.dialog = false;
            },
            // cancel(){
            //     this.$emit("cancel",this.cloneData);
            //     this.dialog = false;
            // },
            add(row){
                let oneDay = 24*60*60*1000;
                if(!row.task_time||!Number(row.quantity)||!row.seller_cost||!row.estimate_cost||!row.order_currency){
                    return this.$message({type:"warning",message:'请完善此行必填数据'});
                }else if(parseInt(row.quantity)!==row.quantity){
                    return this.$message({type:"warning",message:`数量为小数，请改成正整数`});
                }else if(row.msg_time&&row.msg_time<row.task_time){
                    return this.$message({type:"warning",message:'留评日期不能比执行日期早'})
                };
                let lastDate = row.task_time+oneDay;
                let obj = {
                    task_time:lastDate,
                    quantity:row.quantity,
                    seller_cost: row.seller_cost,
                    estimate_cost: row.estimate_cost,
                    order_currency: row.order_currency,
                    msg_time: row.msg_time
                };
                this.form.time_quantity.push(obj);
            },
            delete_line(row,index){
                this.form.time_quantity.splice(index,1);
            },
            get_currency_type(){//获取货币类型
                this.$http(api_get_currency_type,{}).then(res => {
                    this.currencyOptions = res.map(row => {
                        return {
                            label: row.code,
                            value: row.code
                        }
                    })
                })
            },
        },

        props:{
            form:{
                required:true,
                type:Object,
            },
            value:{},
            currentHandle:{
                required:true,
                type:String
            },
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiTable:require('../../../components/ui-table.vue').default
        }
    }
</script>