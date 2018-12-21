<template>
    <search-card @search="search" @enter="search" :params="paramList" :clears="clears">
        <el-select v-sf.snType
                   filterable
                   v-model="paramList.nType"
                   class="inline mb-mini s-width-default" >
            <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input placeholder="请输入搜索内容..." v-sf.snText v-model="paramList.nContent" class="inline mr-sm mb-mini s-width-large" ></el-input>
        <label-item label="账号简称：" class="mr-sm mb-mini">
            <param-account v-sf.account_id  v-model="paramList.account_id"
                           type="mymallPublishAccount"
                           url="get|pandao-account?is_invalid=1"
                           clearabled
                           :refresh="true"
                           :fixResult="fixAccount"
                           placeholder="全部"
                           class="mr-sm s-width-small">
            </param-account>
        </label-item>
        <label-item label="销售员：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       filterable
                       clearable
                       v-sf.create_id
                       v-model="paramList.create_id">
                <el-option v-for="item in userList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="审核状态：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       filterable
                       v-sf.review_status
                       v-model="paramList.review_status">
                <el-option v-for="item in reviewList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="本地状态：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       v-sf.sell_status
                       v-model="paramList.spu_status">
                <el-option v-for="item in saleList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="刊登工具：" class="mr-sm mb-mini">
            <el-select class="inline s-width-small"
                       v-sf.tool
                       v-model="paramList.application">
                <el-option v-for="item in toolsList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="上传时间：" class="mr-sm mb-mini">
            <el-date-picker class="inline date mb-mini" v-sf.start_time
                            v-model="paramList.start_time" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            <span>&nbsp;&nbsp; -- &nbsp;&nbsp;</span>
            <el-date-picker class="inline date mb-mini" v-sf.end_time
                            v-model="paramList.end_time" type="date"
                            :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
        </label-item>
    </search-card>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.paramList.end_time){
                            return  time.getTime() > this.paramList.end_time;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.paramList.start_time){
                            return  time.getTime() < this.paramList.start_time;
                        }else {
                            return false
                        }
                    }
                },
                clears:{
                    nType:"spu",
                    nContent:"",
                    account_id:"",
                    start_time:"",
                    end_time:"",
                    create_id:"",
                    field:'',
                    order:'',
                    review_status:"",
                    spu_status:'',
                    application:'',
                },
                goods:[
                    {
                        label: '本地SPU',
                        value: 'spu',
                    },
                    {
                        label: '本地SKU',
                        value: 'local_sku',
                    },
                    {
                        label: '平台SKU',
                        value: 'sku',
                    },
                    {
                        label: '平台产品ID',
                        value: 'product_id',
                    },
                    {
                        label: '刊登标题',
                        value: 'name',
                    },
                ],
                saleList:[ //本地状态
                    {label:"全部",value:""},
                    {label:"在售",value:1},
                    {label:"停售",value:2},
                    {label:"卖完下架",value:3},
                    {label:"缺货",value:4},
                ],
                reviewList:[//审核状态
                    {label:"全部",value:""},
                    {label:"待审核",value:0},
                    {label:"已批准",value:1},
                    {label:"被拒绝",value:2},
                ],
                enableList:[//平台状态
                    {label:"全部",value:""},
                    {label:"下架",value:0},
                    {label:"上架",value:1},
                ],
                toolsList:[//刊登工具
                    {label:"全部",value:""},
                    {label:"ERP刊登",value:'1'},
                    {label:"非ERP刊登",value:'0'},
                ],
            }
        },
        methods:{
            fixAccount(res){
                return res.data.map(row=>{
                    return {
                        label:row.code,
                        value:row.id,
                    }
                })
            },
            created(){
            },
            search(){
                this.$emit("search",this.paramList);
            },
        },
        computed: {

        },
        props:{
            paramList:{
                required:true,
                type:Object
            },
            userList:{
                required: true,
                type: Array
            }
        },
        components: {
            paramAccount:require("@/api-components/param-account.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
        }
    }
</script>
