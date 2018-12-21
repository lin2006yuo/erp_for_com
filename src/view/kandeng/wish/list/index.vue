<template>
    <page class="p-kandeng">
        <el-tabs v-model="activeName" style="width: 100%;" @tab-click="handleClick">
            <el-tab-pane label="已刊登" name="1">
                <has-published :options="options" ref="published" v-if="activeName==='1'"></has-published>
            </el-tab-pane>
            <el-tab-pane label="未刊登" name="3">
                <not-published ref="notPublish" v-if="activeName==='3'"></not-published>
            </el-tab-pane>
            <el-tab-pane label="刊登队列" name="2">
                <stay-published ref="wait" v-if="activeName==='2'"></stay-published>
            </el-tab-pane>
            <el-tab-pane label="刊登异常" name="4">
                <timing-published ref="timing" v-if="activeName==='4'"></timing-published>
            </el-tab-pane>
            <el-tab-pane label="草稿箱" name="5">
                <draft-published ref="draft" v-if="activeName==='5'"></draft-published>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">
    .p-kandeng {
        .has-inline {
            font-size: 1.2rem;
            display: inline-block;
            vertical-align: middle;
        }
        .has-mr {
            margin-right: 5px;
        }
    }
</style>
<script>
    import hasPublished from './has-published.vue';//已刊登
    import stayPublished from './stay-published.vue';//待刊登
    import notPublished from './not-published.vue';//未刊登
    import timingPublished from './timingTable.vue';//定时刊登

    export default {
        page: {},
        refresh() {
            let refs = ['published', "wait", 'notPublish', "timing", "draft"];
            this.activeName = '1';
            this.$nextTick(() => {
                let name = refs[parseInt(this.activeName) - 1];
                this.$refs[name].searchData = {
                    status: 1,
                    nType: "product_id",
                    number_sold:"",
                    nContent: "",
                    accountType: "short",
                    accountVal: "",
                    review_status: "",
                    enabled: "",
                    wish_express: "",
                    ntime: "date_uploaded",
                    start_time: "",
                    end_time: "",
                    sell_status: '',
                    order: "",
                    order_by: "",
                    searchPrice: "total",
                    minPrice: "",
                    maxPrice: "",
                };
                this.$refs[name].page = 1;
                this.$refs[name].pageSize = 50;
                this.$refs[name].init();
            })
        },
        activated() {
            let refs = ['published',"wait", 'notPublish', "timing", "draft"];
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1];
                this.$refs[name]&& this.$refs[name].$refs['table']&&this.$refs[name].$refs['table'].table_resize();
            });
            if (this.activeName === '3') {
                let goods_id = sessionStorage.getItem('wishInfoId');
                if (!!goods_id) {
                    let data = this.$refs.notPublish.products;
                    let index = data.findIndex(row => row.goods_id === parseInt(goods_id));
                    if (index > -1) {
                        data.splice(index, 1);
                        sessionStorage.setItem('wishInfoId', '')
                    }
                }
            }
        },
        beforeDestroy(){
            sessionStorage.setItem('searchData','');
            sessionStorage.setItem('searchFixdData','');
        },
        data() {
            return {
                activeName: '1',
                btnList: [//----------------------------------------------操作按钮
                    {name: '添加Listing', clickName: '', status: 1},
                    {name: '从产品库批量刊登', clickName: '', status: 2},
                    {name: '同步Listing', clickName: '', status: 3},
                    {name: '上传Listing', clickName: '', status: 4},
                    {name: '转移至产品库', clickName: '', status: 5},
                    {name: '批量上架', clickName: 'putaway', status: 6},
                    {name: '批量下架', clickName: '', status: 7}
                ],
                options: [//----------------------更多操作按钮
                    {
                        value: '1',
                        label: '批量修改刊登标题',
                        status: 1
                    }, {
                        value: '2',
                        label: '批量修改销售价',
                        status: 2
                    }, {
                        value: '3',
                        label: '批量修改运费',
                        status: 3
                    }, {
                        value: '4',
                        label: '批量修改吊牌价',
                        status: 4
                    }, {
                        value: '5',
                        label: '批量修改可售数量',
                        status: 5
                    }, {
                        value: '6',
                        label: '批量修改发货期',
                        status: 6
                    },
                    {
                        value:'7',
                        label:'批量同步Listing',
                        status:'7'
                    }
                   ],
            }

        },
        created() {//--------------调取list接口

        },
        methods: {
            /**/
            handleClick(val) {
                switch (val.name) {
                    case '1':
                        if (this.$refs.published) this.$refs.published.init();
                        break;
                    case '3':
                        if (this.$refs.notPublish) this.$refs.notPublish.listFun();
                        break;
                    case '2':
                        if (this.$refs.wait) this.$refs.wait.init();
                        break;
                    case '4':
                        if (this.$refs.timing) this.$refs.timing.init();
                        break;
                    case '5':
                        if (this.$refs.draft) this.$refs.draft.init();
                        break;
                }
            },
        },
        watch: {},
        components: {
            hasPublished,
            stayPublished,
            notPublished,
            timingPublished,
            draftPublished: require('./draft-published.vue').default
        }
    }
</script>
