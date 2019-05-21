<template>
    <el-row class="p-kandeng">
        <div class="card">
            <el-tabs  v-model="activeName" style="width: 100%;" @tab-click="handleClick">
                <el-tab-pane label="已刊登" name="1">
                    <has-published :options="options"  ></has-published>
                </el-tab-pane>
                <el-tab-pane label="未刊登" name="3">
                    <not-published ref="notPublish"></not-published>
                </el-tab-pane>
                <el-tab-pane label="刊登队列" name="2">
                    <stay-published  :opt="options" ref="wait"></stay-published>
                </el-tab-pane>
                <el-tab-pane label="定时刊登" name="4">
                    <timing-published  ref="timing"></timing-published>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .p-kandeng{
        .has-inline{
            display: inline-block;
        }
        .has-mr{
            margin-right: 5px;
        }
    }
</style>
<script>
    import { } from '../../../api/kandeng';//已刊登接口
    import hasPublished from './has-published.vue';//已刊登
    import stayPublished from './stay-published.vue';//待刊登
    import notPublished from './not-published.vue';//未刊登
    import timingPublished from './timingTable.vue';//定时刊登

    export default{
    	  page:{},
        data(){
            return{
                activeName:'1',
                btnList:[//----------------------------------------------操作按钮
                    {name:'添加Listing',clickName:'',status:1},
                    {name:'从产品库批量刊登',clickName:'',status:2},
                    {name:'同步Listing',clickName:'',status:3},
                    {name:'上传Listing',clickName:'',status:4},
                    {name:'转移至产品库',clickName:'',status:5},
                    {name:'批量上架',clickName:'putaway',status:6},
                    {name:'批量下架',clickName:'',status:7}
                ],
                options: [{//----------------------更多操作按钮
                    value: '1',
                    label: '批量复制',
                    status:2
                }, {
                    value: '2',
                    label: '批量导出',
                    status:3
                }, {
                    value: '3',
                    label: '批量删除',
                    status:4
                }, {
                    value: '4',
                    label: '批量设置自动补货',
                    status:5
                }, {
                    value: '5',
                    label: '批量设置上架时间',
                    status:6
                }, {
                    value: '6',
                    label: '批量设置发货仓库',
                    status:7
                }],
            }

        },
        created(){//--------------调取list接口

        },
        methods:{
            /**/
            handleClick(){
                console.log(this.activeName)
                if(this.activeName=='3'){
                    this.$refs.notPublish.listFun()
                }else if(this.activeName=='2'){
                    this.$refs.wait.init()
                }else if(this.activeName=='4'){
                    this.$refs.timing.init()
                }
            },

        },
        watch:{

        },
        components:{
            hasPublished,
            stayPublished,
            notPublished,
            timingPublished

        }
    }
</script>
