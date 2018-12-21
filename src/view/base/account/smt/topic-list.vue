<template>
    <div class="c-topic-list">
        <page-dialog v-model="dialog" @open="open" :loading="loading"
                     title='消息通知' :close-on-click-modal="false">
            <div v-for="item in topicList">
                <title-content :label="item.title">
                    <el-row slot="content">
                        <template v-for="it in item.events">
                            <el-col :span="6">
                                <el-checkbox :label="it.name" v-model="it.status"></el-checkbox>
                            </el-col>
                        </template>
                    </el-row>
                </title-content>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.antive="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.antive="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_topic_list,api_post_user_permit} from "../../../../api/aliexpress";
    export default {
        data() {
            return {
                checkList:[],
                dialog:this.value,
                loading:false,
                topicList:[],
            }
        },
        methods:{
            open(){
                this.loading = true;
                this.$http(api_get_topic_list,{account_id:this.id}).then(res => {
                    let list = Object.keys(res).map(row=>{
                        let item = Object.keys(res[row]).map(item=>{
                            res[row][item]['status'] = !!res[row][item]['status'];
                            this.$set(res[row][item],'id',item);
                            return res[row][item];
                        });
                        return {
                            title:`${row}通知`,
                            events:item
                        }
                    });
                    this.topicList = list;
                    this.loading = false;
                }).catch(code => {
                    console.log(code,'code');
                    this.loading = false;
                })
            },
            submit(){
                let ids = [];
                this.topicList.forEach(row=>{
                    let idList = row.events.filter(res=>res.status).map(res=>res.id);
                    ids = [...ids,...idList];
                });
                this.$http(api_post_user_permit,{account_id:this.id,topics_id:ids.join(',')}).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    this.dialog = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{},
            id:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            titleContent:require('@/components/title-content.vue').default,
        }
    }
</script>