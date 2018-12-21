<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="indentImpower"
                 label-width="190px"
                 ref="indentImpower"
                 :rules="rules">
            <el-form-item label="consumerId：" prop="client_id">
                <el-col :span="14">
                    <el-input v-model="indentImpower.client_id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="privateKey：" prop="client_secret">
                <el-col :span="14">
                    <el-input v-model="indentImpower.client_secret"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="channelType：" prop="channel_type">
                <el-col :span="14">
                    <el-input v-model="indentImpower.channel_type"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addObtain" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_token_walmart} from '../../../../api/walmart-account';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    client_id:[
                        {required: true, message: '订单授权账号ID必填项', trigger: 'change'}
                    ],
                    client_secret:[
                        {required: true, message: '订单授权账号秘钥为必填项', trigger: 'change' }
                    ],
                    channel_type:[
                        {required: true, message: 'V3专用key为必填项', trigger: 'change' }
                    ],
                },
            }
        },
        methods:{
            open(){

            },
            cloce(){

            },
            keep(){
                this.$emit('add-impower');
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                type:String
            },
            indentImpower:{
                require:true,
                type:Object
            },
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
