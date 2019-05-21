<template>
    <div class="c-add-paypal-account">
        <template v-if='paramsData.length>0' v-for="(item,index) in paramsData">
            <param-account
                    @change="change_value(item,index,'id')"
                    class="inline"
                    placeholder="可输入搜索"
                    :param="{is_invalid:1,pageSize:99999}"
                    v-model="item.id"
                    :fixResult="paypal_fix_result"
                    type="paypalAccount"
                    url="get|paypal-account">
            </param-account>
            <el-select v-model="item.type"
                       @change="change_value(item,index,'type')"
                       class="inline width-xs"
                       filterable clearable>
                <el-option
                        v-for="res in typeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-button type="primary"
                       size="mini"
                       @click.native="delete_cur(paramsData,index)"
                       v-if="paramsData.length>1"
                       class="inline">删除</el-button>
            <el-button type="primary"
                       size="mini"
                       @click.native="add_more(paramsData)"
                       v-if="index===(paramsData.length-1)"
                       class="inline">添加</el-button>
        </template>
        <el-button type="primary" size="mini"
                   class="inline"
                   @click.native="add_more(paramsData)"
                   v-if="paramsData.length<=0">添加</el-button>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                typeList:[
                    {label:'本地仓',value:1},
                    {label:'海外仓',value:2},
                ],
                paramsData:this.value
            }
        },
        methods:{
            add_more(data){
                if(data.find(row=>!row.id||!row.type))return this.$message({type:"warning",message:"发现有数据未填写完整，请补充！"});
                let obj = {id:"",type:""};
                data.push(obj);
            },
            delete_cur(data,index){
                data.splice(index,1);
            },
            change_value(val,index,name){
                let cloneData = clone(this.paramsData);
                cloneData.splice(index,1);
                let find = cloneData.find(row=>row.id===val.id&&row.type===val.type);
                if(!!find){
                    if(name==='id'){
                        val.id='';
                    }else if(name==='type'){
                        val.type='';
                    }
                    return this.$message({type:"warning",message:"相同数据已存在，请不要重复添加！"});
                }
            },
            paypal_fix_result(res){
                return res.data.map(item=>{
                    return{
                        value:item.id,
                        label:item.account_name
                    }
                });
            },
        },
        watch:{
            paramsData(val){
                this.$emit('input',val);
            },
            value(val){
                this.paramsData = val;
            },
        },
        props:{
            value:{}
        },
        components: {
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>