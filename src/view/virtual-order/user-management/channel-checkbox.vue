<template>
    <div class="c-channel-checkbox">
        <el-checkbox v-model="form.value" @change="change_channel">
            {{form.channel_name}}
        </el-checkbox>
        <el-row>
            <div class="ml-lg mb-sm">
                用户名：<el-input
                              :disabled="!form.value"
                              placeholder="平台买家用户名"
                              v-model="form.account_name"></el-input>
                <el-checkbox v-if='form.channel_id===2'
                             :disabled="!form.value"
                             v-model="form.is_vip_prime">Prime会员</el-checkbox>
            </div>
        </el-row>
        <div class="ml-lg mb-sm">
            买家ID：<el-input placeholder="平台买家ID"
                           :disabled="!form.value"
                           v-model="form.account_user"></el-input>
        </div>
    </div>
</template>
<style lang="stylus">
    .channel-checkbox{
        .amazon-input{
            display: inline-block;
            width:55%;
            margin-right:10px;
        }
        .amazon-input2{
            display: inline-block;
            width:80%;
        }
    }

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            change_channel(val){
                if(!this.form.value){
                    this.form.account_name = '';
                    this.form.is_vip_prime = 0;
                    this.form.account_user = '';
                }
            },
        },
        props:{
            form:{}
        },
        components: {}
    }
</script>