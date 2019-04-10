<template>
    <div class="spu-publish">
        <search-card :params="searchData" :clears="clears" @search="search" >

            <label-item label="平台：">
                <el-select
                    v-model="searchData.channel_id"
                    class="width-super"
                    size="small"
                    clearable filterable
                    collapse-tags
                    @change="select_channel"
                >
                    <el-option
                        v-for="item in channels"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select class="s-width-default inline"
                           v-sf.account_id
                           filterable remote clearable
                           placeholder="请输入简称"
                           :remote-method="fillter_methods"
                           v-model="searchData.account_code"
                           :loading="accountLoading"
                >
                    <el-option v-for="item in options"
                               :key="item.value"
                               :value="item.label"
                               :label="item.label"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="SPU：" class="ml-sm">
                <el-input class="inline width-super"
                          v-model="searchData.spu"
                          placeholder="可批量搜索，Shift+回车换行"
                          v-sf.spu
                          type="textarea"
                          v-enter="textarea_search"
                >
                </el-input>
            </label-item><br/>
            <label-item label="销售员：" class="mt-mini mb-mini">
                <el-select
                    placeholder="请输入销售员名称"
                    class="width-sm input"
                    filterable remote clearable
                    v-model="searchData.shelf_name"
                    :remote-method="fillter_seller"
                    :loading="sellerListLoading"
                >
                    <el-option
                        v-for="(opt, index) in sellerOptions"
                        :key="`seller_${index}`"
                        :value="opt.realname"
                        :label="opt.realname"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="下架数量范围：" class="ml-sm">
                <input type="number" v-model="searchData.max_num" @blur="handle_keyup_min" class="number width-mini" v-range.number min="0" :max="searchData.min_num">
                <span>&nbsp;--&nbsp;</span>
                <input type="number" v-model="searchData.min_num" @blur="handle_keyup_max" class="number width-mini" v-range.number :min="searchData.max_num || 0">
            </label-item>
            <label-item label="下架日期：" class="ml-sm">
                <el-date-picker
                    class="inline date width-sm"
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="开始时间"
                    :picker-options="pickerstart"
                ></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                    class="inline mr-sm date width-sm"
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="pickerend"
                ></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<script>
    import {api_get_channel, api_account_list} from  '../../../../api/report-channel'
    import {api_get_seller} from '@/api/platform-statistics'
    export default {
        data() {
            return {
                channel_id:'',
                channels:[],
                clears:{},
                query:'',
                sellerQuery: '',
                sellerLoading: false,
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return time.getTime()>this.searchData.date_e;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime()<this.searchData.date_b;
                        }else{
                            return false;
                        }
                    }
                },
                sellerList: [],
                sellerListLoading: false,
                accountList: [],
                accountLoading: false
            }
        },
        mounted(){
            this.clears=clone(this.searchData);
            this.init_status();
            this.get_seller()
        },
        methods: {
            search(){
                this.$emit('search');
            },
            init_status(){
                this.$http(api_get_channel).then(res=>{
                    this.channels = res
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            change_status(val){
                let channel_id=val+1;
                this.channel_id=val+1;
                this.$emit('search',channel_id);
                this.$emit('getStatus',channel_id)
            },
            textarea_search() {
                this.$emit('search')
            },
            handle_keyup_min(e) {
                const value = e.target.value;
                if(+value >　+this.searchData.min_num) {
                    this.searchData.max_num = this.searchData.min_num
                } else {
                    this.searchData.max_num = value
                }
            },
            handle_keyup_max(e) {
                const value = e.target.value;
                if(+value < +this.searchData.max_num) {
                    this.searchData.min_num = this.searchData.max_num
                } else {
                    this.searchData.min_num = value
                }
            },
            //改变channel_id, 获取账号简称
            select_channel() {
                // const promiseArr = [];
                // this.searchData.channel_id.forEach(v => {
                //     promiseArr.push(this.$http(api_account_list, {channel_id: v}))
                // });
                // Promise.all(promiseArr).then(res => {
                //     const accountList = res.reduce((total, cur) => {
                //         return  [
                //             ...total,
                //             ...cur.account
                //         ]
                //     }, []);
                //     this.accountList = accountList;
                // });
                this.$http(api_account_list, {channel_id: this.searchData.channel_id}).then(res => {
                    this.accountList = res.account;
                })
            },
            //获取销售员
            get_seller() {
                this.$http(api_get_seller).then(res => {
                    this.sellerList = res
                })
            },
            //过滤销售员列表
            fillter_seller(query) {
                this.sellerQuery = query;
            },
            //过滤账号简称
            fillter_methods(query) {
                this.query = query
            }
        },
        computed:{
            options(){
                if(this.query){
                    return this.accountList.filter(row=>{
                        return row.label.toLowerCase()
                            .indexOf(this.query.toLowerCase())>-1
                    })
                }else{
                    if(this.accountList){
                        return this.accountList.length>=50?this.accountList.slice(0,50):this.accountList;
                    }
                }
            },
            sellerOptions() {
                if(this.sellerQuery) {
                    return this.sellerList.filter(v => {
                        if(!isNaN(+this.sellerQuery)){
                            return v.id.toString().indexOf(this.sellerQuery) > -1
                        } else {
                            return v.realname.indexOf(this.sellerQuery) > -1
                        }
                    })
                } else {
                    if(this.sellerList) {
                        return this.sellerList.length>=50?this.sellerList.slice(0,50):this.sellerList;
                    }
                }
            },
        },
        props:{
            searchData:{},
        },
        components:{
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        },
        directives: {
            //回车执行回调，shift+回车换行
            enter: {
                // key: "Enter"
                bind(el, binding) {
                    const TEXTAREA_DOM = el.querySelector('textarea');
                    const callback = binding.value;
                    TEXTAREA_DOM.addEventListener('keydown', function (e) {
                        if(e.key === 'Enter') {
                            e.preventDefault();
                            if(!e.shiftKey) {
                                callback()
                            } else {
                                e.preventDefault();
                                TEXTAREA_DOM.value += '\n';
                            }
                        }
                    })
                }
            },
            //限制输入字母，限制输入范围(可选)
            range: {
                update(el, binding) {
                    let max;
                    let min;
                    if(binding.max) {
                        max = binding.value.max;
                        min = binding.value.min;
                    }
                    const INPUT_DOM = el;
                    const handleInput = () => {
                        //如果指定限制输入number
                        if(binding.modifiers.number) {
                            INPUT_DOM.value = INPUT_DOM.value.replace(/[^0-9]/g, "")
                        }
                        //如果超出指定范围
                        if(max && min) {
                            if(INPUT_DOM.value > max) {
                                INPUT_DOM.value = max;
                            } else if(INPUT_DOM.value < min) {
                                INPUT_DOM.value = 0
                            }
                        }
                    };
                    el.addEventListener('keyup', handleInput)
                }
            }
        },
    }
</script>

<style lang="stylus" scoped>
    .spu-publish >>> .el-select__tags > span {
        display: inline-block;
        width: 100%;
    }
    .spu-publish >>> .el-input__inner {
        height 26px !important
    }
    .spu-publish >>> .el-select .el-tag {
        height 22px;
        line-height:22px
    }
    .spu-publish >>> textarea {
        height: 26px;
        line-height: 15px;
    }
    .number {
        background-color: #fff;
        background-image: none;
        border-radius: 3px;
        outline none;
        border: 1px solid #C0CCDA;
        padding: 3px 10px
        &:focus {
            border-color: #33B2FC;
        }
    }
</style>
