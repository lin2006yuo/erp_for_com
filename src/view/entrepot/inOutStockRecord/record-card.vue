<template>
    <el-row class="p-record-card">
        <el-card class="card">
            <el-row>
                <div class="inline">
                    <span class="inline"style="width:65px;text-align:right">仓库：</span>
                    <el-select v-model="form.warehouse" class="inline" style="width:150px">
                        <el-option v-for="item in warehouses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="inline ml-sm">
                    <span>出入库类型：</span>
                    <el-select v-model="form.type" class="inline width-xs">
                        <el-option v-for="item in typeList" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="form.typeValue" class="inline width-sm">
                        <el-option v-for="item in typeOptions" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="inline ml-sm">
                    <span>状态：</span>
                    <el-select placeholder="请选择出入库类型" v-model="form.status" class="inline width-sm">
                        <el-option v-for="item in statusOptions" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </el-row>
            <el-row class="mt-mini">
                <div class="inline">
                    <span class="inline" style="width:65px;text-align:right">筛选条件：</span>
                    <el-select v-model="form.snType" class="inline width-xs">
                        <el-option v-for="item in snTypeDetail" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input class="inline" v-model="form.input"></el-input>
                </div>
                <div class="inline ml-sm">
                    <span>日期：</span>
                    <el-date-picker
                            v-model="form.startT"
                            type="date"
                            placeholder="开始时间"
                            :picker-options="pickerStart"
                    ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                        v-model="form.endT"
                        type="date"
                        placeholder="结束时间"
                        :picker-options="pickerEnd"
                ></el-date-picker>
                    <el-button class="ml-xs" size="mini" type="primary" @click.native="search">搜索</el-button>
                    <!--<el-button size="mini" type="primary" @click.native="advanced_search">高级搜索</el-button>-->
                    <el-button size="mini" :plain="true" type="info"  @click="search_clear">清空搜索</el-button>
                </div>
            </el-row>
        </el-card>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import {api_config_data} from '../../../api/inoutstock-record';
    export default{
        data(){
            return {
                warehouses:[],
                snTypeDetail:[
                    {label:"订单号",value:"order_number"},
                    {label:"来源单号",value:"original_code"},
                ],
                typeList:[
                    {label:"入库",value:'in'},
                    {label:"出库",value:'out'},
                ],
                type:{},
                status:{},
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.form.endT){
                            return time.getTime() > this.form.endT.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.form.startT){
                            return time.getTime() < this.form.startT.getTime();
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.$http(api_config_data).then(res=>{
                    this.warehouses=res.data.warehouses;
                    this.type = res.data.stockType.type;
                    this.status = res.data.stockType.status;
                });
            },
            pickerOptions0(){
                console.log("pickerOptions0")
            },
            search_clear(){
                this.$emit("search-clear");
            },
            search(){
              this.$emit("search");  
            },
            advanced_search(){
                this.$emit("advanced-search");
            },
        },
        watch:{
            'form.type'(val){
                let detail = this.typeOptions[0] || {};
                this.form.typeValue= detail.value || '';
                let status = this.statusOptions[0] || {};
                this.form.status = status.value === undefined ? '' : status.value;
            }
        },
        computed:{
            typeOptions(){
                let types = this.type[this.form.type] || [];
                types =  types[1] || [];
                types = types.map(row=>{
                    return {
                        label:row.attName,
                        value:row.attValue,
                    }
                });
                return types;
            },
            statusOptions(){
                let status = this.status[this.form.type] || [];
                status = status[1] || [];
                status = status.map(row=>{
                    return {
                        label:row.attName,
                        value:row.attValue,
                    }
                });
                return status;
            },
        },
        props:{
            form:{
                required:true,
                type:Object
            }
        },
        components: {

        }
    }
</script>