<template>
    <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
        <div class="mb-xs">
            <label >状态：</label>
            <div class="inline">
                <template v-for="item in btn_list">
                    <el-button :key="item.type"
                               :type="activeButton===item.type?'primary':''"
                               size="mini"
                                @click="changeBtn(item)">{{item.label}}</el-button>
                </template>
            </div>
        </div>
        <label> 仓库： </label>
        <div class="inline width-xs mr-sm" >
            <el-select v-model="searchData.warehouse_id" placeholder="请选择" clearable>
                <el-option
                    v-for="item in warehouse_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <label >SKU：</label>
        <div class="inline mr-sm">
            <el-input v-model="searchData.sku" clearable></el-input>
        </div>
        <label >申请人：</label>
        <div class="inline mr-sm">
            <el-input v-model="searchData.proposer" clearable></el-input>
        </div>
        <div class="inline">
            <el-select v-model="searchData.snType" class="inline width-xs mr-xs">
                <el-option
                    v-for="item in application_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker class="inline date"
                            v-model="searchData.start_time"
                            type="date"
                            :picker-options="pickerstart"
                            placeholder="开始时间">
            </el-date-picker>
            -
            <el-date-picker class="inline date mr-sm"
                            v-model="searchData.end_time"
                            type="date"
                            placeholder="结束时间"
                            :picker-options="pickerend">
            </el-date-picker>
        </div>
    </search-card>

</template>

<script>
    import {api_warehouse_options} from '@/api/subsidized-list.js'
    export default {
        name: "search-list",
        data(){
            return{
                pickerstart:{
                    disabledDate:(val)=>{
                        if(this.searchData.end_time){
                            return val.getTime()>this.searchData.end_time
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(val)=>{
                        if(this.searchData.start_time){
                            return val.getTime()<this.searchData.start_time
                        }else{
                            return false
                        }
                    }
                },
                value:"",
                warehouse_options:[],
                application_options:[
                    {label:"申请时间",value:"proposer_time"},
                    {label:"有效时间",value:"valid_time"}
                ],
                activeButton:1, // 初始时按钮选中全部
                btn_list:[
                    {label:"全部",type:1,status:'',action:function(){
                            this.$set(this.searchData,'status','');
                            this.$emit("refresh");
                        }},
                    {label:"待审核",type:2,status:0,action:function(){
                            this.$set(this.searchData,'status',0);
                            this.$emit("refresh");
                        }},
                    {label:"审核通过",type:3,status:1,action:function(){
                            this.$set(this.searchData,'status',1);
                            this.$emit("refresh");
                        }},
                    {label:"审核未通过",type:4,status:2,action:function(){
                            this.$set(this.searchData,'status',2);
                            this.$emit("refresh");
                        }},
                    {label:"作废",type:5,status:3,action:function(){
                            this.$set(this.searchData,'status',3);
                            this.$emit("refresh");
                        }},
                    {label:"已结束跌价",type:6,status:4,action:function(){
                            this.$set(this.searchData,"status",4);
                            this.$emit("refresh");
                        }},
                ]
            }
        },
        created(){
            this.getWarehouseList();

        },
        methods:{
            search(){
                this.$emit("refresh",this.searchData);
            },
            changeBtn(item){
                this.activeButton = item.type;
                item.action.call(this);
            },
            getWarehouseList(){
                this.$http(api_warehouse_options).then(res=>{
                    this.warehouse_options = res.map(val=>{
                        return {
                            label:val.name,
                            value:val.id
                        }
                    })
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error})
                })
            }
        },
        props:{
            searchData:{
                type:Object,
                required:true
            },
            clears:{
                type:Object,
            }

        },
        components: {
            "search-card": require('@/components/search-card.vue').default,
        }
    }
</script>

<style lang="stylus" scoped>

</style>
