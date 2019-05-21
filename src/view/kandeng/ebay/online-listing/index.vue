<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handClick">
            <el-tab-pane label="已刊登" name="1">
                <already ref="has" v-if="activeName==='1'" :site-list="siteList"></already>
            </el-tab-pane>
            <el-tab-pane label="已下架" name="2">
                <sold-out ref="soldOut" v-if="activeName==='2'" :site-list="siteList"></sold-out>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>

<script>
    import { api_get_ebay_site} from '../../../../api/ebay-kandeng-public-module';
    export default {
        data(){
            return{
                activeName:'1',
                siteList: [],
            }
        },
        watch: {
            $route(to,from) {
                console.log(this.$route.path);
            }
        },
        created(){
            this.get_site()
        },
        methods:{
            handClick(val){
                switch(val.name){
                    case '1':
                        if(!!this.$refs.has) this.$refs.has.init();
                        break;
                    case '2':
                        if(!!this.$refs.soldOut)this.$refs.soldOut.init();
                        break;
                }
            },
            get_site(){
                this.$http(api_get_ebay_site).then(res=>{
                    this.siteList = res.data.map(row => {
                        return {
                            label: row.name.replace("站点", ""),
                            value: row.country,
                            id: row.siteid,
                        }
                    });
                    this.siteList.unshift({label: "全部",value:'',id: ""});
                }).catch(error=>{
                    console.log(error)
                })
            }
        },
        components:{
            already:require('../kandeng-list/already/index.vue').default,
            soldOut:require('../kandeng-list/sold-out/index.vue').default,
        }
    }
</script>

<style lang="stylus">

</style>
