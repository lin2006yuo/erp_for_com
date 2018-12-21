<template>
    <el-row class="p-authorize">
        <el-dialog title="授权"   size="tiny" v-model="authorVisible">
            <el-form :model="authorizeData">
                <el-form-item label="账户ID"    label-width="100px">
                    <el-col :span="10">
                    <el-input v-model="authorizeData.id"   ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="账户秘钥"    label-width="100px">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.psd"   ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="授权码"    label-width="100px">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.author"   ></el-input>
                    </el-col>
                    <el-col :span="5">
                    <el-button type="primary"  style="margin-left:20px" >获取授权码</el-button>
                    </el-col>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="close_author">获取token</el-button>
                <el-button type="primary"  size="mini" @click="close_author">取 消</el-button>
            </div>
        </el-dialog>

    </el-row>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                authorVisible:false
            }
        },
        computed:{

        }
        ,
        methods:{
            close_author(){
                this.authorVisible = false;
            }
        },
        watch:{
            authorVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.authorVisible = val;
            }
        },
        props:{
            authorizeData:{
                required:true,
                type:Object
            },
            value:{
            }
        },
        components:{

        }
    }
</script>