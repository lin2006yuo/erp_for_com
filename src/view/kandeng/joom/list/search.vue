<template>
    <div class="c-search-time">
    <search-card @search="search" :params="paramList" :clears="clears">
        <el-select v-sf.snType
                   v-model="paramList.snType"
                   :account-list="accountList"
                   :user-list="userList"
                   class="inline s-width-default"
                    @change="change">
            <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <order-input v-model="paramList.snText"
                     class="inline width-super"
                     @keydown='key_down'
                     v-sf.snText
                     :placeholder="placeholder">
        </order-input>
        <label-item label="平台账号：" class="mr-sm">
            <super-select
                class="inline s-width-middle"
                v-model="paramList.account_id"
                :options="accountList"
                storageKey="accountList"
                @change="select_account"
            ></super-select>
        </label-item>
        <label-item label="平台店铺：" class="mr-sm">
            <super-select
                class="inline s-width-middle"
                v-model="paramList.shop_id"
                :options="shopList"
                storageKey="shopList"
                :disabled="storeIsDisable"
                v-sf.shop_id
            ></super-select>
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
        <el-date-picker class="inline date mb-mini" v-sf.max_time
                        v-model="paramList.max_time" type="date"
                        :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
    </search-card>
    </div>
</template>
<style lang="stylus">
    .c-search-time{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_get_joom_store,} from '../../../../api/joom-set-classify'
	export default{
		data(){
			return {
                placeholder:'可批量搜索，shift+回车换行...',
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
            key_down(){
                this.$emit('search')
            },
            change(val){
                if(val==='name'){
                    this.placeholder = '可支持模糊搜索'
                }else {
                    this.placeholder='可批量搜索，shift+回车换行...'
                }
            },
            search(){
                this.$emit("search",this.paramList);
            },
            // 选择了账号
            select_account(val){
                if(val === ''){
                    this.shopList = [];
                    this.paramList.shop_id = '';
                }else {
                    this.paramList.shop_id = '';
                    this.get_joom_store();
                }
            },
            //获取店铺列表
            get_joom_store(){
                this.$http(api_get_joom_store, {channel_id:7,account_id:this.paramList.account_id}).then(res => {
                    this.shopList = [...res.data];
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
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            orderInput:require('@/components/order-input').default,
        }
	}
</script>
