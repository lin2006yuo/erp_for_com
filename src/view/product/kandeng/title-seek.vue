<template>
    <el-row class="p-title-seek" :model="seekList">
            <el-col :span="2">
                <el-select v-model="seekList.goodName" placeholder="商品名称">
                    <el-option
                            :key="item.value"
                            v-for="item in goods"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3" style="padding-left: 10px;">
                <el-input placeholder="请输入搜索内容..." v-model="seekList.input_seek"></el-input>
            </el-col>
            <el-col :span="2">
                <el-select v-model="seekList.site" placeholder="站点">
                    <el-option
                            :key="item.value"
                            v-for="item in sites"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="seekList.publish" filterable placeholder="刊登号" >
                    <el-option
                            :key="item.value"
                            v-for="item in publishs"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="seekList.ID" filterable placeholder="账号">
                    <el-option
                            :key="item.value"
                            v-for="item in idList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="seekList.market" placeholder="销售趋势">
                    <el-option
                            :key="item.value"
                            v-for="item in markets"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="seekList.status" placeholder="产品状态">
                    <el-option
                            :key="item.value"
                            v-for="item in statusList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-select v-model="seekList.Sync" placeholder="是否同步到产品库">
                    <el-option
                            :key="item.value"
                            v-for="item in isSync"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-date-picker
                        class="date"
                        v-model="seekList.date"
                        type="daterange"
                        placeholder="更新时间"
                        >
                </el-date-picker>
            </el-col>
            <el-col :span="3">
            <el-button type="primary" icon="search" @click.native="search">搜索</el-button>
            <el-button type="primary"  @click.native="empty">清空搜索</el-button>
            </el-col>

    </el-row>
</template>
<style lang="stylus">
    .p-goodName{
        line-height: 36px;
        text-align: right;
    }
    .p-row{
        margin: 10px 0;
    }

</style>
<script>

    export default{
        data(){
            return {
                goods:[
                    {
                        value: '选项1',
                        label: '系统SKU'
                    }, {
                        value: '选项2',
                        label: '渠道Sku'
                    }, {
                        value: '选项3',
                        label: '自定义SKU'
                    }, {
                        value: '选项4',
                        label: '产品SKU'
                    }, {
                        value: '选项5',
                        label: 'ebSKU'
                    }
                ],
                sites:[
                    {
                        value: '选项1',
                        label: '美国'
                    }, {
                        value: '选项2',
                        label: '英国'
                    }, {
                        value: '选项3',
                        label: '德国'
                    }
                ],
                publishs:[],
                idList:[],
                markets:[
                    {
                        value: '选项1',
                        label: '旺款'
                    }, {
                        value: '选项2',
                        label: '爆款'
                    }, {
                        value: '选项3',
                        label: '平款'
                    }, {
                        value: '选项4',
                        label: '呆滞款'
                    }
                ],
                statusList:[
                    {
                        value: '选项1',
                        label: '全部'
                    }, {
                        value: '选项2',
                        label: '已上线'
                    }, {
                        value: '选项3',
                        label: '已下线'
                    }, {
                        value: '选项4',
                        label: '未上传'
                    }
                    , {
                        value: '选项5',
                        label: '已售出'
                    }
                    , {
                        value: '选项6',
                        label: '未售出'
                    }
                    , {
                        value: '选项7',
                        label: '已删除'
                    }
                ],
                isSync:[
                    {
                        value: '选项1',
                        label: '未同步'
                    },
                    {
                        value: '选项2',
                        label: '已同步'
                    }
                ]

            }
        },
        methods:{
            search(){
                this.$emit("search");
            },
            empty(){
                this.$emit("empty");
            }
        },
        props:{
            seekList:{
                required:true,
                type:Object
            }
        },
        components: {}
    }
</script>