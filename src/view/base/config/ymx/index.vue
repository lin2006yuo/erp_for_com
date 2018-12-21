<template>
    <el-row class="p-index">
        <el-card>
            <el-row class="line">
                <el-col :span="18">
                    产品分类配置导入
                </el-col>
                <el-col :span="6">
                    <el-upload
                            accept="application/vnd.ms-excel"
                            action=config.apiHost+"amazon/categorys"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-col>
            </el-row>
        </el-card>
    </el-row>
</template>
<style lang="stylus">
    .line{
        height:40px;
        line-height:40px;
    }
</style>
<script>

    export default{
        data(){
            return{

            }
        },
        methods:{
            handleRemove(file, files){

            },
            handlePreview(file){

            }
        },
        components:{

        }
    }
</script>