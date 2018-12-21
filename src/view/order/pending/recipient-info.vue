<template>
    <el-row class="c-recipient-info">
        <el-form label-width="80px">
            <el-form-item label="买家ID">
                <el-input v-if="edit" v-model="form.buyerid"></el-input>
                <span v-else>{{form.buyerid}}</span>
            </el-form-item>
        </el-form>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                edit:false,
            }
        },
        computed:{
        },
        props:{
            form:{}
        },
        components:{

        }
    }
</script>