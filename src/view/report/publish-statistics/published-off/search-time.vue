<template>
    <div>
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
           <div class="mt-xs mb-xs">
               <label-buttons label="平台：" @select="change_status" :buttons="channels" :max='14' v-model="searchData.channel_id"></label-buttons>
           </div>
            <div class="search-option mt-xs mb-xs inline">
                <span>账号 ：</span>
                <el-select class="s-width-small inline" v-model="searchData.account_id" v-sf.account_id>
                    <el-option v-for="item in accountList"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
                <span class="mt-xs mb-xs">SPU :</span>
                <el-input class="inline s-width-middle" placeholder="请输入SPU" v-model="searchData.spu"></el-input>
                <span class="mt-xs mb-xs">日期 :</span>
                <el-date-picker
                        class="inline date"
                        v-model="searchData.date_b"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerstart"
                        v-sf.date_b
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    class="inline mr-sm date"
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="pickerend"
                    v-sf.date_e
            ></el-date-picker>
            </div>
        </search-card>
    </div>
</template>

<script>
    import {api_get_channel} from  '../../../../api/report-channel'
    export default {
        data() {
            return {
                channels:[],
                channel_id:'',
                clears:{},
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
                }
            }
        },
        mounted(){
            this.clears=clone(this.searchData)
            this.init_status();
        },
        methods: {
            search(){
                this.$emit('search',this.channel_id);
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
                this.channel_id=val+1
                this.$emit('search',channel_id);
                this.$emit('getStatus',channel_id)
            },
        },
        props:{
            searchData:{},
            accountList:{}
        },
        components:{
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
        }
    }
</script>

<style scoped>

</style>