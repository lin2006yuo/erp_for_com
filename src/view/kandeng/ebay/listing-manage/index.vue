<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handClick">
            <el-tab-pane label="选品刊登" name="1">
                <not-yet ref="notYet" :site-list="siteList"
                         v-if="activeName==='1'"></not-yet>
            </el-tab-pane>
            <el-tab-pane label="刊登记录" name="2">
                <model-management ref="modelManagement" :site-list="siteList"
                                  v-if="activeName==='2'"></model-management>
            </el-tab-pane>
            <el-tab-pane label="范本列表" name="3">
                <draft-record ref="draftRecord" :site-list="siteList"
                              v-if="activeName==='3'"></draft-record>
            </el-tab-pane>
            <el-tab-pane label="每日刊登" name="4">
                <daily-model ref="dailyModel"
                             v-if="activeName==='4'"></daily-model>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>

<script>
    import { api_get_ebay_site} from '@/api/ebay-kandeng-public-module';
    export default {
        name: "index",
        data(){
            return{
                activeName:'1',
                siteList:[]
            }
        },
        created(){
            this.get_site()
        },
        methods:{
            handClick(val){
                switch (val.name){
                    case '1':
                    if(!!this.$refs.notYet)this.$refs.notYet.init();
                    break;
                    case '2':
                    if(!!this.$refs.modelManagement)this.$refs.modelManagement.init();
                    break;
                    case '3':
                    if(!!this.$refs.draftRecord)this.$refs.draftRecord.init();
                    break;
                    case '4':
                        if(!!this.$refs.draftRecord)this.$refs.draftRecord.init();
                        break;
                }
            },
            get_site() {
                this.$http(api_get_ebay_site).then(res => {
                    this.siteList = res.data.map(row => {
                        return {
                            label: row.name.replace( this.$t('ebay-list.site'), ""),
                            value: row.country,
                            id: row.siteid,
                        }
                    });
                    this.siteList.unshift({label: this.$t('ebay-list.all'),value:'',id: ""});
                }).catch(code => {
                    console.log(code);
                })
            }
        },
        components:{
            notYet:require('../kandeng-list/not-yet/index.vue').default,
            modelManagement: require('../kandeng-list/model-management/index.vue').default,
            draftRecord:require('../kandeng-list/draft-record/index.vue').default,
            dailyModel:require('../kandeng-list/daily-model/index.vue').default,
        }
    }
</script>

<style scoped>

</style>
