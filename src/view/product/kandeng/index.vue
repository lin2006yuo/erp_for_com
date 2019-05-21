<template>
    <el-row class="p-kandeng">
        <div class="card">
            <el-card>
                <title-seek :seekList="seekList" @search="search" @empty="empty"></title-seek>
            </el-card>
            <button-list :selected="selected" :btnList="btnList" :options="options"></button-list>
            <table-list :publishList="yetPublishList" @selection-change="selection_change"></table-list>
        </div>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="50"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </el-row>
</template>
<style lang="stylus">
    .p-search {
        margin: 20px 0;
        text-align: right;
    }
</style>
<script>
    import {yetPublish_list} from '../../../api/product';
    import titleSeek from './title-seek.vue';//头部搜索条件引入
    import buttonList from './button-list.vue';//操作按钮引入
    import tableList from './table-list.vue';//列表引入

    export default{
        page:{},
        refresh(){
        	this.seekList = {
                  goodName: '',
                  input_seek: '',
                  site: '',
                  publish: '',
                  ID: '',
                  market: '',
                  status: '',
                  Sync: '',
                  date: ''
          };
          this.init();
        },
        data(){
            return {
                seekList: {//-------------------------搜索条件
                    goodName: '',
                    input_seek: '',
                    site: '',
                    publish: '',
                    ID: '',
                    market: '',
                    status: '',
                    Sync: '',
                    date: ''
                },
                btnList: [//----------------------------------------------操作按钮
                    {name: '添加Listing', clickName: '', status: 1},
                    {name: '从产品库批量刊登', clickName: '', status: 2},
                    {name: '同步Listing', clickName: '', status: 3},
                    {name: '上传Listing', clickName: '', status: 4},
                    {name: '转移至产品库', clickName: '', status: 5},
                    {name: '批量上架', clickName: 'putaway', status: 6},
                    {name: '批量下架', clickName: '', status: 7}
                ],
                options: [{//----------------------更多操作按钮
                    value: '1',
                    label: '批量复制',
                    status: 2
                }, {
                    value: '2',
                    label: '批量导出',
                    status: 3
                }, {
                    value: '3',
                    label: '批量删除',
                    status: 4
                }, {
                    value: '4',
                    label: '批量设置自动补货',
                    status: 5
                }, {
                    value: '5',
                    label: '批量设置上架时间',
                    status: 6
                }, {
                    value: '6',
                    label: '批量设置发货仓库',
                    status: 7
                }
                ],
                yetPublishList: [],
                selected: [], //------------选中项
                total: 0
            }

        },
        created(){//--------------调取list接口
            this.yetPublish_list();
        },
        methods: {
            yetPublish_list(obj) {//-----------------list接口函数
                yetPublish_list(obj).then(res => {
                    console.log(res);
                    this.yetPublishList = res.data;
                    this.total = res.total;
                }).catch(code => {
                    console.log(code);
                    this.$message({
                        type: 'error',
                        message: code
                    });
                })
            },
            search(){//------------------------------------搜索
                console.log(this.seekList);
                this.yetPublish_list(this.seekList);
            },
            empty(){//------------------------清空搜索条件
                this.seekList = {
                    goodName: '',
                    input_seek: '',
                    site: '',
                    publish: '',
                    ID: '',
                    market: '',
                    status: '',
                    Sync: '',
                    date: ''
                };
                console.log(this.seekList)
            },
            handleSizeChange(val) { //-------------------------------改变每页显示多少条
                console.log(`每页显示: ${val} 条`);
                this.yetPublish_list();
            },
            handleCurrentChange(val) { //------------------------------------改变当前页
                console.log(`当前页: ${val}`);
                this.yetPublish_list();

            },
            selection_change(muiSelected){
                this.selected = muiSelected;
                console.log(muiSelected)
            }
        },
        watch: {},
        components: {
            titleSeek,
            buttonList,
            tableList

        }
    }
</script>
