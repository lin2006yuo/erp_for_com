<template>
    <page-dialog
        v-model="dialog"
        :title="title"
        width="350px"
    >
        <div class="linheight">
            <label class="ml-sm">{{$t('ymx-list.account')}}：</label>
            <span>{{dat.code}}</span>
        </div>
        <div class="linheight">
            <label class="ml-sm">{{$t('ymx-list.seller')}}：</label>
            <span>{{dat.seller_name}}</span>
        </div>
        <div class="linheight">
            <label class="ml-sm">{{$t('ymx-list.switchCell')}}：</label>
            <super-select
                class="inline s-width-default"
                v-model="dat.seller_id"
                :options="seller_arr"
                @change="change"
                storageKey="swith_seller_name"
            ></super-select>
        </div>
        <div class="linheight">
            <label class="ml-sm">{{$t('ymx-list.sitchaAcount')}}：</label>
            <super-select
                class="inline s-width-default"
                v-model="dat.account_id"
                :options="code_arr"
                storageKey="swith_code">
            </super-select>
        </div>
        <div class="block" style="text-align: right;margin-right: 20px;">
            <el-button
                class="inline"
                size="mini"
                @click.native="is_chack"
                type="primary"
            >{{$t('common.confirm')}}
            </el-button>
            <el-button size="mini" class="inline"
                       @click.native="close">{{$t('common.cancel')}}
            </el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_amazon_task} from '../../../../api/amazon-publish-list';
    import {api_member_list} from "@/api/member"
    export default {
        data() {
            return {
                dialog: false,
                seller_id: '',
                account_id: '',
                code_arr:[]
            }
        },
        methods: {
            change(val){
                this.$http(api_member_list,{snText:val,snType:"sales",channel_id:2}).then(res=>{
                    this.code_arr=res.data.map(row=>{
                        return{
                            label:row.code,
                            value:row.account_id
                        }
                    })
                });
            },
            is_chack() {
                this.$http(api_amazon_task,{data:[this.dat]}).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.dialog=false;
                }).catch(err=>{
                    this.$message({type:'error',message:err.message});
                })
            },
            close() {
                this.dialog=false;
            }
        },
        computed: {
            title() {
                return `SPU:${this.dat.spu || ''}${this.$t('ymx-list.assignSwith')}`
            }
        },
        watch: {
            value(val) {
                this.dialog = val;
            },
            dialog(val) {
                this.$emit('input', val)
            }
        },
        props: {
            value: {},
            dat: {
                required: true,
                type: Object,
            },
            seller_arr: {},
        },
        components: {
            pageDialog: require("@/components/page-dialog.vue").default,
        }
    }
</script>

<style scoped>
    .linheight{
        line-height:40px ;
    }
</style>
