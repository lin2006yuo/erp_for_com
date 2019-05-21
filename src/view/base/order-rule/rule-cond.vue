<template>
    <div class="c-rule-cond">
        <label class="rule-title">{{title}}<span>{{configs.title}}</span></label>
        <div class="rule-content">
            <!-- 当type 类型为1时，引入头部查找的组件。 -->
            <!-- <div v-if="showSearch" class="mb-xs adrees-compoents">
                <el-select multiple filterable clearable                   
                        placeholder="请输入关键词（ 空格）（;分号）（,逗号）可多搜索"
                        remote  :remote-method="remoteMethod"
                        :loading="loading"
                        v-model="address">
                    <el-option v-for="(item,index) in condition"
                            :key="`${index}-${item.value}`"
                            :label="item.label"
                            :value="item.value"></el-option>
                </el-select>
                <div class="mt-lg">
                    <el-tag v-if="tags&&tags.length>0" class="ml-sm mb-mini"
                        v-for="(tag,index) in tags" closable
                        :key="`${index}-${tag.value}`"
                        @close="close_tags(tag.value)"
                        >{{tag.label}}</el-tag>
                </div>
            </div> -->

            <!-- @typecomplete='typecomplete'
            @rendercomplate='rendercomplate' -->
            <rule-form :config="configs" :channel="channel"
                       :data="data"></rule-form>
            <label class="rule-profile" v-if="configs.profile">{{configs.profile}}</label>
        </div>
    </div>
</template>
<style lang="stylus">
    .rule-content {
        padding-top: 10px;
        > div > .rule1 {
            width: auto;
            display: inline;
            > b {
                width: auto;
                vertical-align:middle;
            }
        }
    }
    .adrees-compoents{
        .el-select__tags span{
            display none
        }
    }

    .rule-title {
        font-size: 10px;
        > span {
            color: #5e8fce;
            margin-left: 8px;
        }
    }

    .rule-desc {
        display: inline-block;
        color: #ff0000;
    }

    .rule-unit {
        display: inline-block;
        vertical-align: middle;
    }

    .rule-profile {
        color: #ce7e0f;
    }

    .label-width {
        max-width: 150px;
    }
</style>
<script>

    import {api_get_resource} from '../../../api/order-rules';
    import {handleData, handleSelect, backFill} from './handleData'

    export default {
        data() {
            return {                          
                address: [],              
                component_type: 0,
                listData: [],
                condition: [],
                loading: false,
                newTest: [],
                flagwatch: '',    
                showSearch: false,
            }
        },
        methods: {
            handleData,
            handleSelect,
            backFill,
            remoteMethod(query) {
                this.list = this.listData;
                this.$nextTick(_=>{
                    const values = query.split(/[;, ]/);
                    this.condition = this.list.filter(row=>{
                       return  values.find(res=>{
                            return row.label.toLowerCase().indexOf(res.toLowerCase())>-1
                        })
                    });
                });
            },            
            close_tags(value) {
               let index = this.address.indexOf(value);
               if(index>-1) {
                 this.flagwatch = value;
                 this.address.splice(index,1);                 
               }
            },
            // typecomplete(type) { 
            //     // 关闭在开的话,此时watch相同不会执行.                          
            //     this.component_type = type;
            //     // 选取出要回填的数据.
            //     if (this.component_type === 1) {
            //          this.listData = this.handleData(this.config.data);         
            //     }                
            // },
            // rendercomplate() {                
            //     // 只调用一次。                
            //     if (this.config.type === 1) {                 
            //         let list = []; 
            //         let list2 = [];
            //         console.log(this.data.child);
            //         if (this.data.hasOwnProperty('child') && Object.keys(this.data.child).length > 0) {
            //             if (this.searchFlag) {
            //                 this.backFill(list, this.data.child);    
            //                // 防止下面勾选取消的情况。                      
            //                 this.address = list;
            //             }                                                 
            //             if (this.searchFlag && this.component_type === 1) {                            
            //                 this.$set(this, 'showSearch', true);
            //             } else if (!this.searchFlag && this.component_type === 1) {
            //                 this.$set(this, 'showSearch', false);
            //             }
            //         }                                                                         
            //     }    
            // }
        },
        computed: {
            configs(){
                switch (this.code){
                    case 'source':
                        let data = this.config.data || [];
                        data = data.filter(row =>{
                            if(row.group === 'channel'){
                                if(!this.channel || Number(row.key) === Number(this.channel)){
                                    return true;
                                }
                            }
                        });
                        return {
                            type:this.config.type || 1,
                            profile:this.config.profile,
                            title:this.config.title,
                            election:this.config.election,
                            data:data,
                        };
                    default:
                        return this.config;
                }
            },       
            tags() {               
                if(!this.listData)return [];
                return this.listData.filter(row=>this.address.includes(row.value));                            
            },
        },
        watch: {
            config: {
                handler(val, oldVal) {
                    // this.component_type = val.type;
                    // if (this.component_type === 1) {
                    //    if (typeof val.data === 'object') {
                    //        this.listData = this.handleData(val.data);
                    //    }                        
                    //    //    this.address = this.backFill(this.flagEdit);                 
                    // }                                                           
                },
                deep: true
            },
            address(val) {        
                // 更新对应的选择框。
                // if (this.flagwatch) {
                //     // 这里是去掉选择项。                    
                //     this.handleSelect([this.flagwatch], this.data, 1);             
                //     this.flagwatch = '';
                // } else {
                //     // 新增一项。
                //     this.handleSelect(val, this.data, 2);             
                // }                
            }
        },
        props: {
            data: {},
            title: {},
            code: {},
            config: {},
            channel:{},
            value: {},
            searchFlag: {
                type: Boolean,
                default: false
            }
        },
        components: {
            ruleForm: require('./rule-form').default,
        }
    }
</script>
