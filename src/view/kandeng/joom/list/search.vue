<template>
    <search-card @search="search" @enter="search" :params="paramList" :clears="clears">
        <el-select v-sf.snType
                   v-model="paramList.snType"
                   :account-list="accountList"
                   :user-list="userList"
                   class="inline s-width-default" >
            <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input placeholder="请输入搜索内容..."
                  v-sf.snText
                  v-model="paramList.snText"
                  class="inline mr-sm s-width-middle"></el-input>
        <label-item label="平台账号：" class="mr-sm">
            <el-select class="inline s-width-middle" v-sf.account_id
                       filterable
                       clearable
                       @change="select_account"
                       v-model="paramList.account_id">
                <el-option v-for="item in accountList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="平台店铺：" class="mr-sm">
            <el-select class="inline s-width-middle"
                       filterable
                       clearable
                       v-sf.shop_id
                       :disabled="storeIsDisable"
                       v-model="paramList.shop_id">
                <el-option v-for="item in shopList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="销售员：" class="mr-sm">
            <el-select class="inline s-width-default"
                       filterable
                       clearable
                       v-sf.create_id
                       v-model="paramList.create_id" >
                <el-option v-for="item in userList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="上传状态：" class="mr-sm">
            <el-select class="inline s-width-default"
                       filterable
                       v-sf.status
                       v-model="paramList.status">
                <el-option v-for="item in statusList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label class="mr-sm mb-mini">创建时间：</label>
        <el-date-picker class="inline date mb-mini" v-sf.min_time
                        v-model="paramList.min_time" type="date"
                        :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
        --
        <el-date-picker class="inline date mb-mini" v-sf.max_time
                        v-model="paramList.max_time" type="date"
                        :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
    </search-card>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_joom_store,} from '../../../../api/joom-set-classify'
	export default{
		data(){
			return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.paramList.max_time){
                            return  time.getTime() > this.paramList.max_time;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.paramList.min_time){
                            return  time.getTime() < this.paramList.min_time;
                        }else {
                            return false
                        }
                    }
                },
                clears:{
                    snType:"local_spu",
                },
                shopList:[],
                goods:[
                    {
                        label: '本地SKU',
                        value: 'local_sku',
                    },
                    {
                        label: '本地SPU',
                        value: 'local_spu',
                    },
                    {
                        label: '平台SKU',
                        value: 'platform_sku',
                    },
                    {
                        label: '平台SPU',
                        value: 'platform_spu',
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
                    {label:"上传失败",value:2},
                ],
            }
		},
        methods:{
            search(){
                this.$emit("search",this.paramList);
            },
            // 选择了账号
            select_account(val){
                if(val === ''){
                    this.paramList.shop_id = '';
                    this.shopList = [];
                }else {
                    this.paramList.shop_id = '';
                    this.get_joom_store();
                }
            },
            //获取店铺列表
            get_joom_store(){
                this.$http(api_get_joom_store, {joom_account_id:this.paramList.account_id}).then(res => {
                    this.shopList = [{label: '全部', value: ''}, ...res.data];
                })
            },
        },
        computed: {
            storeIsDisable(){
                return this.paramList.account_id === '';
            }
        },
        props:{
            paramList:{
                required:true,
                type:Object
            },
            accountList:{
                required: true,
                type: Array
            },
            userList:{
                required: true,
                type: Array
            }
        },
		components: {
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
        }
	}
</script>
