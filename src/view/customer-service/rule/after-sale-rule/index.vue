 <template>
    <page>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" :enable="startCompare">
            <div>
                <label-buttons label="平台："
                               class="inline"
                               @select="selectChannel"
                               :buttons="channelActions">
                </label-buttons>
                <label-buttons label="状态："
                               class="inline"
                               @select="selectStatus"
                               :buttons="statusList">
                </label-buttons>
            </div>
            <label-items label="规则名称：" class="inline">
                <el-input v-model="searchData.title"
                          v-sf.condValue
                          placeholder="请输入规则名称..."
                          class="inline enter-result"></el-input>
            </label-items>
            <label-items label="创建日期：" class="inline ml-sm">
                <el-date-picker
                    class="inline date"
                    v-model="searchData.date_b"
                    v-sf.date_b
                    type="date"
                    :picker-options="pickerstart"
                    placeholder="开始时间">
                </el-date-picker>&nbsp;--&nbsp;<el-date-picker
                class="inline date mr-sm"
                v-model="searchData.date_e"
                v-sf.date_e
                type="date"
                format="yyyy-MM-dd"
                :picker-options="pickerend"
                placeholder="结束时间">
            </el-date-picker>
            </label-items>
        </search-card>
        <div class="function">
            <permission tag="ElButton" type="primary" @click.native="add" size="mini" :route="apis.url_post_after_sale_rules">添加</permission>
            <permission tag="ElButton" v-if="isChange" type="primary" @click.native="save"  size="mini" :route="apis.url_post_after_sale_rules_sort">确定</permission>
            <permission tag="ElButton" v-if="isChange" type="primary" @click.native="cancelSolt"  size="mini" :route="apis.url_post_after_sale_rules_sort">取消</permission>
        </div>
        <rule-dialog :mdfid.sync="mdfid"
                     :title="addEditTitle"
                     :channel-list="channelActions"
                     @create="create"
                     @modify="modify"
                     v-model="show"></rule-dialog>
        <data-table @refresh-data="init"
                    :loading="loading"
                    @change="isChange=true"
                    @update-table="update_table"
                    @lookup="lookup"
                    :tables="tables" ></data-table>
    </page>
</template>
<style lang="stylus">
    .function{
        padding: 5px 10px 5px 10px;
    }
    .el-message-box{
        .el-message-box__input{
            .el-input{
                width: 380px;
            }
        }
    }
</style>
<script>
    import {
        api_get_after_sale_rules,
        url_post_after_sale_rules,
        api_get_after_sale_rules_hannel,
        api_post_after_sale_rules_sort,
        url_post_after_sale_rules_sort
    } from '@/api/after-sale-rules';
    export default{
        permission: {
            url_post_after_sale_rules,
            url_post_after_sale_rules_sort
        },
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return{
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return  time.getTime() > this.searchData.date_e.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b.getTime()
                        }else {
                            return false
                        }
                    }
                },
                addEditTitle:"",
                show:false,
                mdfid:0,
                tables:{
                    lists:[]
                },
                loading:true,
                isChange:false,
                searchData:{
                    title:'',
                    date_b:'',
                    date_e:'',
                },
                clears:{
                    title:'',
                    date_b:'',
                    date_e:'',
                },
                startCompare:false,
                platform:0,
                status:0,
                statusList:[
                    {label:'启用',value:0},
                    {label:'停用',value:1}
                ],
                cloneData:[],
                channelActions:[],
                initCount:0
            }
        },
        mounted(){
            this.get_channel();
            this.init();
        },
        methods:{
            create(data,params){
                if(params.channel_id===this.platform&&params.status===this.status) {
                    this.tables.lists.push(data);
                }
            },
            modify(data,params){
                if(params.channel_id===this.platform&&params.status===this.status) {
                    let find = this.tables.lists.find(row => row.id === data.id);
                    if (find) {
                        Object.assign(find, data);
                    }
                }else{
                    let index = this.tables.lists.findIndex(row => row.id === data.id);
                    if (index>-1) {
                        this.tables.lists.splice(index,1);
                    }
                }
            },
            search(){
                this.page = 1;
                this.pageSize = 50;
                this.init();
            },
            search_clear(){
                this.searchData.title="";
                this.platform="";
                this.searchData.date_b="";
                this.searchData.date_e="";
                this.init()
            },
            compare(){
                this.startCompare = true;
            },
            get_channel(){
                this.$http(api_get_after_sale_rules_hannel).then(res=>{
                    this.channelActions = res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    });
                });
            },
            selectChannel(index, item){
                this.initCount++;
                if(this.initCount>2) {
                    this.platform = item.value;
                    this.init();
                }
            },
            selectStatus(index,item){
                this.initCount++;
                if(this.initCount>2) {
                    this.status = item.value;
                    this.init();
                }
            },
            add(){
                this.addEditTitle = '添加订单规则';
                this.show = true;
                this.mdfid = 0;
            },
            cancelSolt(){
                this.isChange = false;
                this.tables.lists = clone(this.cloneData);
            },
            save(){
                let sort = this.tables.lists.map((row,index)=>{
                    return {id:row.id,sort:index}
                });
                this.$http(api_post_after_sale_rules_sort,{sort}).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res
                    });
                    this.isChange = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    });
                })
            },
            init(){
                this.isChange= false;
                let params = {
                    title:this.searchData.title.trim(),
                    status:this.status
                };
                if(this.platform){
                    params.channel_id = this.platform;
                }
                if(this.searchData.date_b){
                    params.date_b = datef("YYYY-MM-dd",this.searchData.date_b/1000);
                }
                if(this.searchData.date_e){
                    params.date_e =datef("YYYY-MM-dd",this.searchData.date_e/1000);
                }
                this.loading=true;
                this.$http(api_get_after_sale_rules, params).then(res=>{
                    res.data.forEach(row=>{
                        row.isTurn=false;
                        row.number=1;
                    });
                    this.tables.lists = res.data;
                    this.cloneData = clone(res.data);
                    this.loading=false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code,
                    })
                })
            },
            lookup(itemid,itemName){
                this.mdfid = itemid;
                this.show = true;
                this.addEditTitle = `查看编辑订单规则：${itemName} 信息`
            },
            update_table(id){
                let index = this.cloneData.findIndex(row=>row.id===id);
                if(index>-1){
                    this.cloneData.splice(index,1);
                }
            }
        },
        components:{
            dataTable:require('./data-table.vue').default,
            ruleDialog:require('./rule-dialog.vue').default,
            warehouse:require('@/api-components/warehouse.vue').default,
            selectFilter:require('@/components/select-filter.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItems:require('@/components/label-items.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
            searchCard:require('@/components/search-card.vue').default,
        }
    }
</script>
