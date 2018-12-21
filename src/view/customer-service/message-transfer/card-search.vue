<template>
    <div class="c-card-search">
        <search-card  :params="searchData" @search="search" @enter="search" :clears="clears">
            <el-row>
                <label-buttons label="平台：" :buttons="channelId" @select="select_boxs" class="inline" v-sf.channel_id></label-buttons>
            </el-row>
            <div class="inline">
                <label>操作人：</label>
                <el-select v-model="searchData.create_id" placeholder="请选择" class="inline  mr-sm s-width-middle" v-sf.customer_id>
                    <el-option
                            :key="item.value"
                            v-for="item in createId"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <label>接收日期：</label>
                <el-date-picker
                        class="inline date"
                        v-model="searchData.time_start"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerstart"
                        v-sf.time_start
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    class="inline mr-sm date"
                    v-model="searchData.time_end"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="pickerend"
                    v-sf.time_end
            ></el-date-picker>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_message_creator} from '@/api/message-record'
    export default {
        data() {
            return {
                clears:{},
                channelId:[
                    {label:"Ebay",value:1},
                    {label:"亚马逊",value:2},
                    {label:"速卖通",value:4},
                ],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.time_end){
                            return time.getTime()>this.searchData.time_end;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.time_start){
                            return time.getTime()<this.searchData.time_start;
                        }else{
                            return false;
                        }
                    }
                },
                createId:[],
            }
        },
        mounted(){
            this.message_creator();
        },
        methods:{
            search(){
                this.$emit('search');
            },
            select_boxs(val){
                this.$emit('select-boxs',this.channelId[val].value);
            },
            message_creator(){
                this.$http(api_message_creator).then(res=>{
                    this.createId =res.data.map(row=>{
                        return {
                            label:row.label,
                            value:row.value,
                        }
                    });
                    this.createId.unshift({label:"全部",value:""});
                });

            }
        },
        props:{
            searchData:{
                required:true,
                type:Object
            }
        },
        components: {
            labelButtons:require("@/components/label-buttons.vue").default,
            searchCard:require("@/components/search-card.vue").default
        }
    }
</script>