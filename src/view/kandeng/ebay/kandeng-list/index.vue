<template>
    <page class="p-kandeng">
        <el-tabs v-model="activeName" style="width: 100%;" @tab-click="handleClick">
            <el-tab-pane label="已刊登" name="1">
                <already ref="has" :site-list="siteList" v-if="activeName==='1'"></already>
            </el-tab-pane>
            <el-tab-pane label="未刊登" name="2">
                <not-yet ref="notYet" :site-list="siteList"
                         v-if="activeName==='2'"></not-yet>
            </el-tab-pane>
            <el-tab-pane label="刊登队列" name="3">
                <queue ref="queue" :site-list="siteList" v-if="activeName==='3'"></queue>
            </el-tab-pane>
            <el-tab-pane label="刊登异常" name="4">
                <abnormity ref="abnormity" :site-list="siteList" v-if="activeName==='4'"></abnormity>
            </el-tab-pane>
            <el-tab-pane label="已下架" name="5">
                <sold-out ref="soldOut" :site-list="siteList" v-if="activeName==='5'"></sold-out>
            </el-tab-pane>
            <el-tab-pane label="范本管理" name="6">
                <model-management ref="modelManagement" :site-list="siteList"
                                  v-if="activeName==='6'"></model-management>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import {api_get_account, api_get_ebay_site} from '../../../../api/ebay-kandeng-public-module';
    export default {
        page: {},
        refresh() {
            let cusRefs = ['has', "notYet", 'queue', "abnormity", "soldOut", "modelManagement"];
            this.activeName = '1';
            this.$nextTick(() => {
                let name = cusRefs[parseInt(this.activeName) - 1];
                this.$refs[name].searchData = {
                    searchChooese: "itemID",
                    snText: "",
                    item_id: "",
                    spu: "",
                    sku: "",
                    title: "",
                    listing_sku: "",
                    account_id: "",
                    site: "",
                    listing_type: "",
                    listing_duration: "",
                    replen: "",
                    goods_type: "",
                    work_off: "",
                    sales_status: "",
                    restart: "",
                    category: "",
                    promotion_id: "",
                    paypal_emailaddress: "",
                    picture_gallery: "",
                    location: "",
                    quantity: "",
                    best_offer: "",
                    return_time: "",
                    sub_title: "",
                    choice_date: "",
                    listing_cate: "",
                    user_id: "",
                    listing_status: 3,
                    name: "start",
                    start_date: "",
                    end_date: "",
                };
                this.$refs[name].page = 1;
                this.$refs[name].pageSize = 50;
                this.$refs[name].init();
            });
        },
        data() {
            return {
                activeName: '1',
                siteList: [],
            }
        },
        activated(){
            let refs = ['has', "notYet", 'queue', "abnormity", "soldOut", "modelManagement"];
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1];
                this.$refs[name]&& this.$refs[name].$refs['table']&&this.$refs[name].$refs['table'].table_resize();
            });
            if(this.activeName==='2'){
                let goods_id = sessionStorage.getItem('ebayInfoId');
                if(!!goods_id){
                    let data = this.$refs.notYet.table;
                    let index = data.findIndex(row=>row.goods_id === parseInt(goods_id));
                    if(index>-1){
                        data.splice(index,1);
                        sessionStorage.setItem('ebayInfoId','')
                    }
                }
            }
        },
        created() {
            this.get_site();
        },
        beforeDestroy(){
            sessionStorage.setItem('ebaySearchData','');
        },
        methods: {
            handleClick(val) {
                switch(val.name){
                    case '1':
                        if(!!this.$refs.has) this.$refs.has.init();
                        break;
                    case '2':
                        if(!!this.$refs.notYet)this.$refs.notYet.init();
                        break;
                    case '3':
                        if(!!this.$refs.queue)this.$refs.queue.init();
                        break;
                    case '4':
                        if(!!this.$refs.abnormity)this.$refs.abnormity.init();
                        break;
                    case '5':
                        if(!!this.$refs.soldOut)this.$refs.soldOut.init();
                        break;
                    case '6':
                        if(!!this.$refs.modelManagement)this.$refs.modelManagement.init();
                        break;
                }
            },
            get_site() {
                this.$http(api_get_ebay_site).then(res => {
                    this.siteList = res.data.map(row => {
                        return {
                            label: row.name.replace("站点", ""),
                            value: row.country,
                            id: row.siteid,
                        }
                    });
                    this.siteList.unshift({label: "全部",value:'',id: ""});
                }).catch(code => {
                    console.log(code);
                })
            }
        },
        components: {
            notYet: require('./not-yet/index.vue').default,
            already: require('./already/index.vue').default,
            queue: require('./queue/index.vue').default,
            abnormity: require('./abnormity/index.vue').default,
            soldOut: require('./sold-out/index.vue').default,
            modelManagement: require('./model-management/index.vue').default
        }
    }
</script>
