<template>
    <page-dialog v-model="show" size="small" title="重上规则设置" @open="open"
                 class="p-batch-edit" :close-on-click-modal="false">
        <el-row class="auto-add">
            <el-col :span="8" style="text-align: right">
                <label for=""><i class="icon-red">*</i>自动重新刊登规则：</label>
            </el-col>
            <el-col :span="16">
                <el-radio class="radio" v-model="restart.restart_rule" label=1>只要物品下架</el-radio><br />
                <el-radio class="radio" v-model="restart.restart_rule" label=2>所有物品卖出</el-radio><br />
                <el-radio class="radio" v-model="restart.restart_rule" label=3>没有物品卖出</el-radio><br />
                <el-radio class="radio" v-model="restart.restart_rule" label=4>没有物品卖出后仅刊登一次</el-radio><br />
                <el-radio class="radio" v-model="restart.restart_rule" label=5>当物品卖出数量大于或等于</el-radio>
                <integer-input v-model="restart.restart_count" :min="1"
                               class="width-sm inline"
                               style="width:100px"
                               :disabled="restart.restart_rule!=='5'"
                ></integer-input>
            </el-col>
        </el-row>
        <el-row class="auto-add">
            <el-col :span="8" style="text-align: right">
                <label for=""><i class="icon-red">*</i>重新刊登时间：</label>
            </el-col>
            <el-col :span="16">
                <el-radio class="radio" v-model="restart.restart_way" label=1>立即重上</el-radio><br />
                <el-radio class="radio" v-model="restart.restart_way" label=2>定时重上，执行时间
                    <el-time-select v-model="restart.restart_time"
                                    :picker-options="{
                                      start: '00:01',
                                      step: '00:10',
                                      end: '23:51'
                                    }"
                                    :disabled="restart.restart_way!=='2'"
                                    placeholder="选择时间"
                                    class="inline"
                                    style="width: 100px;">
                    </el-time-select>
                </el-radio>
            </el-col>
        </el-row>
        <div class="tips">
            小提示：GTC仅支持【卖出多少，即补多少】，不支持【重上规则】，即使您在刊登内选择了带有
            【重上规则】的设定，重新刊登也不会生效！但eBay会进行自动重新刊登。
        </div>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="restartRule" @click="keep">确定</request-button>
            <el-button size="mini" @click.native="close" >关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-batch-edit{
        .auto-add{
            padding-top: 20px;
            label{
                line-height 30px;
            }
        }
        .tips{
            padding-top: 50px;
            text-align: center;
        }
        .dialog-footer{
            text-align:center;
        }
        .icon-red{
            color: red;
            font-weight :bolder;
            padding: 0px 3px;
        }
    }
</style>
<script>
    import {api_ebay_reshelf} from "../../../../../api/ebay-kandeng-operated"
    export default{
        data(){
            return{
                show:this.value,
                restart:{
                    restart_rule:"",
                    restart_way:"",
                    restart_count:"",
                    restart_time:""
                },
            }
        },
        created(){
        },
        mounted(){

        },
        computed:{
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                this.restart = {
                    restart_rule:"",
                    restart_way:"",
                    restart_count:"",
                    restart_time:""
                }
            },
            keep(){
                if(parseInt(this.restart.restart_rule)===5){
                    if(!Number(this.restart.restart_count)){
                    	this.$message({type:"warning", message: "物品卖出数需大于或等于1"});
                    	return this.$reqKey('restartRule',false);
                    }
                }
                let arr =[];
                this.selectIds.forEach(row=>{
                    if( row.isCheck){
                        arr.push({
                            id:row.id,
                            restart:1,
                            restart_rule:this.restart.restart_rule,
                            restart_count:this.restart.restart_count,
                            restart_way:this.restart.restart_way,
                            restart_time:this.restart.restart_time
                        })
                    }
                })
                this.$http(api_ebay_reshelf,{data:arr}).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.show = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                }).finally(()=>{
                    return this.$reqKey('restartRule',false);
                })
            },
            close(){
                this.show=false;
            },
        },
        filters:{
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val)
            }
        },
        props:{
            value:{},
            selectIds:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require("../../../../../components/page-dialog.vue").default,
            integerInput:require("../../../../../components/integer-input.vue").default
        }
    }
</script>
