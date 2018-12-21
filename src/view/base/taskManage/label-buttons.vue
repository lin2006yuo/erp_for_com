<template>
    <el-row>
        <el-col :span="5" :class="disabled ? 'disabled' : ''" style="width:320px">
            <label :style="labelStyle">{{label}}</label>
            <el-button size="mini" @click.native="buttonClick(index)"
                       v-for="(item,index) in buttons"
                       :key="index"
                       :type="index==current?'primary':'default'" class="button">{{item.name}}{{item.count | filterButton}}</el-button>
        </el-col>
        <el-col :span="5" style="width:355px">
            <label style="line-height: 26px;">筛选条件：</label>
            <el-select clearable v-model="dataParams.snType" placeholder="请选择"  class="inline" style="width: 120px;">
                <el-option
                        :key="item.value"
                        v-for="item in options"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="dataParams.snText" class="inline" @input="snText"></el-input>
        </el-col>
        <el-col :span="5" style="width:345px">
            <label style="line-height: 26px;">创建日期：</label>
            <el-date-picker type="date" placeholder="开始时间" v-model="dataParams.stime"   class="inline date" style="width: 125px;"></el-date-picker>&nbsp;--&nbsp;<el-date-picker type="date" placeholder="结束时间" v-model="dataParams.etime"   class="inline" style="width: 125px;"></el-date-picker>
        </el-col>
        <el-button type="primary" @click="search_list"  class="inline" size="mini" style="margin-top: 2px;">搜索</el-button>
    </el-row>
</template>
<style lang="stylus">
    .button{
        margin-bottom:3px;
    }
    .disabled{
        cursor: not-allowed;
        opacity: 0.7;
    }
    label{
        font-size:1.2rem;
    }
</style>
<script>

    export default{
        name: 'label-buttons',
        data(){
            return{
                current:0,
                options:[
                    {
                        value: 'name',
                        label: '任务名称'
                    },
                    {
                        value: 'max_exec_num',
                        label: '最大执行次数'
                    }, {
                        value: 'cron_time',
                        label: '执行周期'
                    }
                ],
                date_b:'',
                date_e:''
            }
        },
        filters:{
            filterButton(count){
                if(count>0){
                    return `(${count})`
                }else{
                    return ''
                }
            }
        },
        methods:{
            buttonClick(index){
                this.current = index;
            },
            search_list(){
                this.$emit('search_list')

            }
        },
        watch:{
            current(newIndex){
                this.$emit("select", newIndex);
            }
        },
        computed:{
            disabled(){
                if(this.todo != ''){
                    return true;
                }else{
                    return false;
                }
            },
            labelStyle(){
                if(this.labelWidth){
                    return {
                        width:`${this.labelWidth}px`,
                        display:'inline-block',
                        textAlign:'right'
                    };
                }else{
                    return {}
                }
            },
            snText(){
                this.dataParams.snText=this.dataParams.snText.replace(/\s*/g,'')
            }
        },
        props:{
            dataParams:{
                required:true,
                type:Object
            },
            buttons:{
                required:true,
                type:Array
            },
            label:{
                required:true,
                type:String
            },
            todo:{
                type:String,
                default:''
            },
            labelWidth:{}
        },
        components:{
        }
    }
</script>
