<template>
    <div class="c-card-search">
        <search-card :params="searchData" @search="search" :clears="clears" @enter="search">
            <el-row>
                <label-buttons label="平台：" :buttons="channelId" @select="channel_remote" class="inline ml-sm" v-sf.channel_id></label-buttons>
            </el-row>
            <label-item label="客服人员：" class="ml-sm">
                <el-select v-sf.customer_id
                           v-model="searchData.customer_id"
                           class="s-width-default"
                           filterable clearable>
                    <el-option v-for="item in serviceList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label class="inline ml-sm">回复时间：</label>
            <el-date-picker
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="开始时间"
                    class="inline date"
                    v-sf.date_b
                    :picker-options="pickerstart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="结束时间"
                    class="inline date"
                    v-sf.date_e
                    :picker-options="pickerend">
            </el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                clears:{
                    channel_id:'',
                    customer_id:'',
                    date_b:'',
                    date_e:'',
                },
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return  time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return  time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },
            }
        },

        methods:{
            search(){
                this.$emit('search');
            },
            channel_remote(val,item){//---平台
                this.$emit('channel-remote',item.value);
            },
            channel_service(){//---客服人员
                this.$emit('channel-service');
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
            serviceList:{
                required:true,
                type:Array
            },
            channelId:{
                required:true,
                type:Array
            }
        },
        components: {
            labelButtons:require("@/components/label-buttons.vue").default,
            selectRemote: require('@/components/select-remote.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            searchCard:require("@/components/search-card.vue").default,
        }
    }
</script>