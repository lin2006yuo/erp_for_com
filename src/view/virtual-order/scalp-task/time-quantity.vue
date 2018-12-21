<template>
    <div class="c-time-quantity.vue">
        <page-dialog :title="comTitle" v-model="dialog"
                     @open="open"
                     size="small" :close-on-click-modal="false">
            <div>
                <ui-table
                    :heads="currentHandle==='add'&&!!form.isSaveBtn?addHeader:otherHeader"
                >
                    <template v-for="(item,index) in form.time_quantity">
                        <tr>
                            <td>
                                <el-date-picker
                                        v-if="currentHandle==='add'&&!!form.isSaveBtn"
                                        v-model="item.date"
                                        align="right"
                                        type="date"
                                        placeholder="选择日期">
                                </el-date-picker>
                                <label v-else>{{filterTime(item.date)}}</label>
                            </td>
                            <td>
                                <el-input v-model="item.total" v-if="currentHandle==='add'&&!!form.isSaveBtn"></el-input>
                                <label v-else>{{item.total}}</label>
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
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                dialog:this.value,
                cloneData:{},
                addHeader:[
                    {label:'执行日期',width:50,isRequired:true},
                    {label:'订单数量',width:30,isRequired:true},
                    {label:'操作',width:20}
                ],
                otherHeader:[
                    {label:'执行日期',width:50,isRequired:true},
                    {label:'订单数量',width:50,isRequired:true},
                ]
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
            open(){
                this.cloneData = clone(this.form);
                this.cloneData.time_quantity.forEach((row,index)=>{
                    let cur = this.form.time_quantity.find((row,i)=>i===index);
                    if(!!cur) row.date = cur.date;
                })
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
                    if(!row.date||!Number(row.total)){
                        canSubmit = false;
                        return this.$message({type:"warning",message:`第${index+1}行存在必填项未填写，请补充完整`});
                    }
                });
                if(!canSubmit) return;
                this.$emit("submit",this.form);
                this.dialog = false;
            },
            cancel(){
                this.$emit("cancel",this.cloneData);
                this.dialog = false;
            },
            add(row){
                let oneDay = 24*60*60*1000;
                if(!row.date||!row.total)return this.$message({type:'warning',message:"请完善此行必填数据"});
                let lastDate = row.date+oneDay;
                let lastTotal = row.total;
                let obj = {
                    date:lastDate,
                    total:lastTotal,
                };
                this.form.time_quantity.push(obj);
            },
            delete_line(row,index){
                this.form.time_quantity.splice(index,1);
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
            uiTable:require('../../../components/ui-table.vue').default,
        }
    }
</script>