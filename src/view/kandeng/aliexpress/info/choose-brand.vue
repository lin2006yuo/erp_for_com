<template>
    <div class="p-accounts">
        <page-dialog v-model="show" title="请选择品牌" :close-on-click-modal="false">
            <el-table
                @row-click="row_click"
                :data="brands"
                border
                class="scroll-bar"
                ref="table"
                height="300"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    width="35"
                    inline-template>
                    <el-checkbox v-model="row.isCheck"></el-checkbox>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="品牌ID">
                </el-table-column>
                <el-table-column
                    prop="name_zh"
                    label="中文名称"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="name_en"
                    label="英文名称">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
                <el-button size="mini" @click.native="close" >关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-batch-edit{
        .auto-add{
            padding-top: 20px;
            label{
                line-height 30px;
            }
        }
        .tips{
            padding-top: 50px;
            text-align: center;
        }
        .dialog-footer{
            text-align:center;
        }
        .icon-red{
            color: red;
            font-weight :bolder;
            padding: 0px 3px;
        }
    }
</style>
<script>
    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            handleSelectionChange(val){
                this.selected=val;
            },
            //单行点击选择
            row_click(row,event,col){
            	this.brands.forEach(item=>{
                    item.isCheck = false;
                });
                row.isCheck = true;
            },
            keep(){
                let arr = this.brands.filter(row=>row.isCheck);
                let id = '';
                arr.forEach(row=>{
                    id = row.id;
                });
                this.$emit('choose-brand',id);
                this.show = false;
            },
            close(){
                this.show=false;
            },
        },
        filters:{
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val);
                if(val){
                    if(this.brands.length){
                    	this.brands[0].isCheck = true;
                    }
                }
            }
        },
        props:{
            value:{},
            brands:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require("../../../../components/page-dialog.vue").default,
        }
    }
</script>
