<template>
    <search-card @search="search" @enter="search" :params="paramList" :clears="clears">
        <div  class="inline">
            <el-select v-sf.snType
                    v-model="paramList.nType"
                    class="inline s-width-default" >
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..."
                    v-sf.snText
                    v-model="paramList.nContent"
                    class="inline mr-sm s-width-middle" ></el-input>
            <label-item label="账号简称：" class="mr-sm">
                <param-account v-sf.account_id  v-model="paramList.account_id"
                               type="mymallPublishAccount"
                               url="get|pandao-account?is_invalid=1"
                               clearabled
                               :fixResult="fixAccount"
                               placeholder="全部"
                               class="mr-sm s-width-default">
                </param-account>

            </label-item>
            <label-item label="销售员：" class="mr-sm">
                <el-select class="inline s-width-middle"
                        filterable
                        clearable
                        v-sf.create_id
                        v-model="paramList.create_id"
                        >
                    <el-option v-for="item in userList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="上传状态：" class="mr-sm">
                <el-select class="inline s-width-middle"
                        filterable
                        v-sf.status
                        v-model="paramList.publish_status"
                        >
                    <el-option v-for="item in statusList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label class="mr-sm ">创建时间：</label>
            <el-date-picker class="inline date " v-sf.start_time
                            v-model="paramList.start_time" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            --
            <el-date-picker class="inline date " v-sf.end_time
                            v-model="paramList.end_time" type="date"
                            :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
        </div>
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
                },
                shopList:[],
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
                statusList:[//修改状态
                    {label:"全部",value:""},
                    {label:"上传中",value:0},
                    {label:"上传成功",value:1},
                    {label:"上传失败",value:-1},
                ],
            }
		},
        mounted(){
		    this.search();
        },
        methods:{
            search(){
                this.$emit("search",this.paramList);
            },
            fixAccount(res){
                return res.data.map(row=>{
                    return {
                        label:row.code,
                        value:row.id,
                    }
                })
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
