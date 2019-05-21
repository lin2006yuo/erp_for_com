<template>
        <!-- 搜索数据 -->
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" style="overflow:initial;">
            <div  class="inline">
                <el-select v-sf.snType
                           v-model="searchData.snType"
                           class="inline s-width-default" >
                    <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input placeholder="请输入搜索内容..."
                          v-sf.nContent
                          v-model="searchData.nContent"
                          class="inline mr-sm s-width-middle" ></el-input>
                <label-item label="账号简称：" class="ml-sm">
                    <super-select v-sf.account_id
                                  class="mr-sm s-width-default"
                                  v-model="searchData.account_id"
                                  :options="accountList"
                                  storageKey="shopeeAccount">
                    </super-select>
                </label-item>
                <label-item label="销售员：" class="ml-sm">
                    <super-select v-sf.create_id
                                  class="inline s-width-default"
                                  v-model="searchData.create_id"
                                  placeholder="输入搜索更多"
                                  :options="userList"
                                  storageKey="shopeeuserList">
                    </super-select>
                </label-item>
                <label-item label="上传状态：" class="ml-sm">
                    <el-select class="inline s-width-middle"
                               filterable
                               v-sf.status
                               v-model="searchData.publish_status"
                    >
                        <el-option v-for="item in statusList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label class="ml-sm">创建时间：</label>
                <el-date-picker class="inline date " v-sf.start_time
                                v-model="searchData.start_time" type="date"
                                :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
                --
                <el-date-picker class="inline date " v-sf.end_time
                                v-model="searchData.end_time" type="date"
                                :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
            </div>
        </search-card>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shopee_account} from "@/api/shopee-publish"
	export default{
		data(){
			return {
			    accountList:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return  time.getTime() > this.searchData.end_time;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_time){
                            return  time.getTime() < this.searchData.start_time;
                        }else {
                            return false
                        }
                    }
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
            this.getList();
        },
        methods:{
            getList(){
                this.$http(api_shopee_account,{}).then(res=>{
                    this.accountList=res.map(val=>{return {label:val.code,value:val.id}});

                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            search(){
                this.$emit("search",this.searchData);
            },
            fixAccount(res){
                console.log(res,'res');
                return res.map(row=>{
                    return {
                        label:row.code,
                        value:row.account_id,
                    }
                })
            },

        },
        props:{
            clears:{
                required: true,
                type:Object
            },
            userList:{
                required: true,
                type: Array
            },
            searchData:{
            	required:true,
                type:Object
            }
        },
		components: {
            paramAccount:require("@/api-components/param-account.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
        }
	}
</script>
