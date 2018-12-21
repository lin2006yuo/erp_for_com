<template>
    <div class="p-search-ebay-box-search">
        <search-card :params="searchData" :clears="clears" @search="search">
        <div class="inline">
            <label>关键字：</label>
            <el-autocomplete
                class="inline s-width-middle inline-input"
                v-model="searchData.keyword"
                @keydown.native.enter="search"
                :fetch-suggestions="querySearch"
                @keyup.native="keyupKeyword"
                @select="selectKeyword"
                :placeholder="keywordPlh"
            ></el-autocomplete>
            <label class="ml-sm">客服：</label>
            <el-select v-model="searchData.customer_id" placeholder="请选择" class="inline  s-width-large"  clearable filterable v-sf.customer_id>
                <el-option
                        :key="item.customer_id"
                        v-for="item in options"
                        :label="`${item.realname}/${item.username}`"
                        :value="item.customer_id">
                </el-option>
            </el-select>
            <label class="ml-sm">账号简称：</label>
            <el-select v-model="searchData.account_id" placeholder="请选择" class="inline s-width-middle"  clearable filterable v-sf.account_id>
                <el-option
                        :key="item.value"
                        v-for="item in accounts"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <label class="ml-sm">接收时间：</label>
            <el-date-picker type="date" placeholder="开始时间" v-model="searchData.receive_date_b"   class="inline date" :picker-options="pickerstart" style="width: 115px;" v-sf.receive_date_b></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-model="searchData.receive_date_e"   class="inline mr-sm date"  :picker-options="pickerend" style="width: 115px;" v-sf.receive_date_e></el-date-picker>

        </div>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import labelButtons from "../../../../components/label-all-buttons.vue"
    import {
        api_message_customer,
        api_ebay_message_accout,

        url_ebay_list
    } from "../../../../api/inbox"
    export default{
        permission:{
            url_ebay_list,
        },
        data(){
            return{
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.receive_date_e){
                            return  time.getTime() > this.searchData.receive_date_e
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.receive_date_b){
                            return time.getTime() < this.searchData.receive_date_b
                        }else {
                            return false
                        }

                    }
                },
                accounts:[],
                types:[
                    {label:"订单",value:0},
                    {label:"买家",value:1},
                    {label:"模糊搜索",value:2,},
                ],
                options:[],
                clears:{},
                keywordMemory:[],
                keyupChange:''
            }
        },
        created(){
            let hasMemory = sessionStorage.getItem('ebay_box_keyword_memory');
            this.keywordMemory = hasMemory?JSON.parse(hasMemory):[];
            this.clears=clone(this.searchData)
        },
        mounted(){
            this.get_account();
            this.get_customer();
        },
        methods:{
            keyupKeyword(e){
                this.keyupChange = e.target.value;
            },
            selectKeyword(data){
                this.keyupChange = data.value;
            },
            querySearch(queryString, cb) {
                setTimeout(()=>{
                    let keywordMemory = this.keywordMemory;
                    let results = queryString ? keywordMemory.filter(this.createFilter(this.keyupChange)) : keywordMemory;
                    // 调用 callback 返回建议列表的数据
                    setTimeout(()=>{
                        cb(results);
                    },100);
                },150);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.indexOf(queryString.toLowerCase()) >= 0);
                };
            },
            get_account(){
                this.$http(api_ebay_message_accout,{channel_id:1}).then(res=>{
                    this.accounts = [{label:'全部', value:''}, ...res.account];
                }).catch(code=>{
                    console.log(code)
                })
            },
            search(){
                if(!!this.keyupChange.trim()) {
                    let keyword = this.keyupChange.trim();
                    let find = this.keywordMemory.find(row => row.value === keyword);
                    if (!find) {
                        this.keywordMemory.push({value: keyword});
                    }
                }
                this.searchData.keyword = this.keyupChange;
                this.$emit("reflash")
            },
            clear(){
                this.$emit("clear")

            },
            get_customer(){
                this.options=[]
                this.$http(api_message_customer).then(res=>{
                    this.options= [{realname:'全部', username:'All', customer_id:''}, ...res];
                }).catch(code=>{
                    console.log(code)
                })
            }

        },
        computed:{
            keywordPlh(){
                return this.keywordMemory.length===0?'请输入关键字...':'输入或选择历史记录...';
            }
        },
        destroyed(){
            sessionStorage.setItem('ebay_box_keyword_memory',JSON.stringify(this.keywordMemory));
        },
        props:{
            searchData:{
                type:Object,
                require:true
            }
        },
        components:{
            labelButtons,
            searchCard:require("@/components/search-card.vue").default,
            uiAutocomplete:require('@/components/ui-autocomplete').default
        }
    }
</script>
