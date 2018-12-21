<template>
    <div class="wishPublish-list">
        <el-card>
            <el-select v-model="listParams.snType" style="display:inline-block;">
                <el-option v-for="item in options"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <el-input placeholder="请输入内容..." v-model="listParams.snText" style="display:inline-block;"></el-input>
            <el-button size="mini" @click.native="seek" type="primary">搜索</el-button>
        </el-card>
        <!--table数据-->
        <el-table :data="products"   v-resize="{height:240}" style="width:100%;margin-top:5px"  highlight-current-row>
            <el-table-column  inline-template label="操作" width="100">
                <div>
                    <el-button size="mini" @click="publish(row)" type="primary">刊登</el-button>
                </div>
            </el-table-column>
            <el-table-column inline-template label="图片" width="120">
                <div>
                    <img :src="row.thumb" width="26px" height="26px" style="vertical-align: middle;">
                </div>
            </el-table-column>
            <el-table-column prop="spu" label="系统SKU" width="200"></el-table-column>
            <el-table-column prop="" label="客户产品编码" width="200"></el-table-column>
            <el-table-column prop="name" label="产品中文名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="packing_en_name" label="产品英文名称" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=listParams.page
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=listParams.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .wishPublish-list{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
    }

</style>
<script>
    import {get_product_list} from '../../../api/kandeng';
    export default{
        data(){
            return{
                listParams:{
                    page:1,
                    pageSize:50,
                    snType:'name',
                    snText:''
                },
                total:0,
                options:[
                    {
                        value: 'name',
                        label:'商品标题'
                    }
                ],
                products:[]

            }
        },
        created(){
        },
        watch:{
        },
        methods:{
            listFun(){
                this.$http(get_product_list,this.listParams).then(res=>{
                    this.products=res.data;
                    this.total=res.count;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            publish(data) {
                let param={id:data.id};//---查看标示id为1
                this.$open('/kandeng/wish/info',param)
            },
            /*---------搜索*/
            seek() {
                this.listFun()
            },
            handleSizeChange(size){
                this.listParams.pageSize = size;
                this.listFun()
            },
            handleCurrentChange(page){
                this.listParams.page = page;
                this.listFun()
            }
        },
        components:{

        }
    }
</script>