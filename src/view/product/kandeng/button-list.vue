<template>
    <el-row class="p-button-list">
        <el-button type="primary" v-for="(item,index) in btnList" @click.native='clicked(item.status)'>{{item.name}}</el-button>
        <el-select placeholder="请选择更多操作" clearable class="p-select card" >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" @click.native="process(item)"></el-option>
        </el-select>
    </el-row>
</template>
<style lang="stylus">

    .p-select{
         width:15%;
         display: inline-block;
     }
</style>
<script>

    export default{
        data(){
            return {

            }
        },
        props:{
            btnList:{
                required:true,
                type:Array
            },
            options:{
                required:true,
                type:Array
            },
            selected:{
                required:true,
                type:Array
            }
        },
        methods:{
            clicked(status){//------------------------------------操作不同按钮执行的事件
                console.log(status);
                console.log(this.selected);
                if(this.selected.length==0){
                    this.$message({
                        type:'error',
                        message:'请选择商品！'
                    });
                }
                if(status==1){


                }else if(status==2){


                }else if(status==3){

                }
            },
            process(option){//--------------操作更多按钮的事件处理
                console.log(`value:${option}`);
                if(this.selected.length==0){
                    this.$message({
                        type:'error',
                        message:'请选择商品！'
                    });

                }else{
                    if(option.value=='1'){
                        this.$confirm('确定批量复制该数据吗?','提示', {
                            type: 'warning'
                        }).then(function () {
                            console.log('调取后台接口');
                            return false;
                        }).catch(function () {
                            console.log('取消')
                        });

                    }else if(option.value=='2'){

                    }
                }
            },
        },
        components: {

        }
    }
</script>