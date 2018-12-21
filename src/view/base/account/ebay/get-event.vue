
<template>
    <el-row class="p-get-event">
        <page-dialog :title="titlename"
                     v-model="eventVisible"
                     :close-on-click-modal="false"
                     size="large">
            <div v-loading="loading"
                 style="min-height: 150px;"
                 element-loading-text="玩命加载中...">
                <div v-if="event_list.length>0">
                    <div v-for="(row,index) in event_list"
                         :key="index">
                        <label>{{row.title}}</label>
                        <el-checkbox-group v-model="row.list" class="check" @change="change_select">
                            <el-checkbox
                                :label="item.event"
                                v-for="item in row.events"
                                :key="item.event"
                                v-model="item.enable"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div v-else  style="text-align: center;">
                    <label style="margin-top: 75px;display: inline-block;">暂无数据</label>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <request-button req-key='getEvent' @click="get_event" :disabled="eventDisabled">同 步</request-button>
                <request-button req-key='submitKey' @click="submit" :disabled="submitDisabled">设 置</request-button>
                <el-button @click="cannel" size="mini">关 闭</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-get-event{
        .check .el-checkbox{
            width:200px;
            height: 35px;
            line-height: 35px;
            margin:0;
        }
    }
</style>
<script>
    import  pageDialog from "../../../../components/page-dialog.vue"
    import  {api_setevent_ebay_account} from '../../../../api/account-ebay'
    export default{
        data(){
            return{
                eventVisible:false,
                submitDisabled:false,
                eventDisabled:false,
                loading:false,
                event_list:[]
            }
        },
        created(){},
        mounted(){
        },
        computed:{
            titlename(){
                return  `账户：${this.accountName} 通知信息`
            }
        },
        methods:{
            change_select(){
                this.event_list.forEach(res=>{
                    res.events.forEach(row=>{
                        if(res.list.includes(row.event)){
                            row.enable = 1;
                        }else{
                            row.enable = 0;
                        }
                    });
                    console.log('res.list',res.list);
                });
            },
            get_event(){
                this.$emit("update-event",this.accountId,1);
            },
            submit(){
                let list = window.clone(this.event_list);
                list.forEach(res=>{
                	this.$delete(res,'list');
                });
                let param={
                    account_id:this.accountId,
                    data:list
                };
                this.submitDisabled = true;
                this.loading = true;
                this.$http(api_setevent_ebay_account,param).then(res=>{
                    this.submitDisabled = false;
                    this.loading = false;
                    this.event_list = res.data;
                    this.$message({
                        type: 'success',
                        message: res.message||res,
                    });
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code,});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('submitKey', false);
                    }, 300)
                });
            },
            cannel(){
                this.eventVisible = false;
            }
        },
        watch:{
            eventVisible(val){
                this.$emit('input',val);
                this.submitDisabled = false;
            },
            eventData(val){
            	console.log(val);
                this.event_list = [];
                this.event_list = val;
                console.log('this.event_list',this.event_list);
            },
            event_list(val){
                val.forEach(res=>{
                	let list = res.events.map(res=>{
                        if(res.enable === 1){
                            return res.event;
                        }
                    });
                    this.$set(res,'list',list);
                });
            },
            value(val){
                this.eventVisible = val;
            }
        },
        props:{
            value: {},
            eventData:{
                required:true,
                type:Array
            },
            accountName: {},
            accountId: {}
        },
        components:{
            pageDialog
        }
    }
</script>
