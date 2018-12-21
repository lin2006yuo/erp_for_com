<template>
    <page-dialog  title="ASIN核查" v-model="dialog"
                  @open="open"
                  size="large" :close-on-click-modal="false">
        <h3>{{$t('ymx-list.ASINTip')}}</h3>
        <el-row class="relative">
            <el-col :span="10">
                <h4>{{$t('ymx-list.ASINTip2')}}</h4>
                <el-input v-model='pendingOrder'
                          :placeholder="$t('ymx-list.ASINTip4')"
                          type="textarea" @keydown.native="keydown"
                          :autosize="{ minRows: 30, maxRows: 35}"></el-input>
            </el-col>
            <el-col :span="4" class='absolute-btn'>
                <request-button reqKey="amazon-publish-list-asin-inspect" @click="verification">{{$t('ymx-list.startVerifi')}}</request-button>
            </el-col>
            <el-col :span="10" class="fr">
                <h4>{{$t('ymx-list.ASINTip3')}}（{{notFoundLength}}）</h4>
                <el-input v-model="notFoundOrder" type="textarea" ref="notFoundOrder"
                          :autosize="{ minRows: 30, maxRows: 35}"></el-input>
            </el-col>
        </el-row>
        <el-input v-model="existOrder" type="textarea" ref="existOrder"
                  style="z-index: 0;position: absolute ;top: -999px;left: -999px;"
                  :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click.native="copy_order('exist')">{{$t('ymx-list.foundOrder')}}</el-button>
            <el-button type="primary" size="mini" class="inline" @click.native="copy_order('notFound')">{{$t('ymx-list.unfoundOrder')}}</el-button>
            <el-button size="mini" class="inline" @click.native="dialog=false">{{$t('common.close')}}</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .absolute-btn{
        position:absolute;
        top:50%;
        left:46%
    }
</style>
<script>
    import {api_publish_amazon_review_asin} from '@/api/amazon-publish-list';
    export default {
        data() {
            return {
                pendingOrder:'',
                notFoundOrder:'',
                existOrder:'',
                dialog:this.value,

            }
        },
        methods:{
            open(){
                this.pendingOrder = '';
                this.notFoundOrder = '';
                this.existOrder = '';
            },
            keydown(event){
                if(event.keyCode===13){
                    if(!this.pendingOrder)return this.$message({type:"warning",message:"请输入需要查询的订单"});
                    this.$reqKey('amazon-publish-list-asin-inspect',true);
                    this.verification();
                }
            },
            async verification(){
                this.notFoundOrder = '';
                this.existOrder = '';
                let list = this.splice_params(500);
                list.forEach((item,index)=>{
                    let params = {data:JSON.stringify(item)};
                    this.$http(api_publish_amazon_review_asin,params).then(res => {
                        this.notFoundOrder += this.notFoundOrder&&this.get_data(res,'not_exist_asin')?'\n'+this.get_data(res,'not_exist_asin'):this.get_data(res,'not_exist_asin');
                        this.existOrder += this.existOrder&&this.get_data(res,'not_exist_asin')?'\n'+this.get_data(res,'exist_asin'):this.get_data(res,'exist_asin');
                        if(index===list.length-1){
                            this.$message({type:'success',message:`核查已完成！`});
                        }
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        if(index===list.length-1){
                            this.$reqKey('amazon-publish-list-asin-inspect',false)
                        }
                    })
                });
            },
            copy_order(name){
                switch (name){
                    case 'exist':
                        this.copy_process('existOrder');
                        break;
                    case 'notFound':
                        this.copy_process('notFoundOrder');
                        break;
                }
            },
            copy_process(target){
                if(!!this[target]){
                    this.$refs[target].$refs.textarea.select();
                    document.execCommand("Copy");
                    this.$message({type:"success",message:"复制成功"});
                }else {
                    let input=document.createElement("input");
                    let body=document.getElementsByTagName("body")[0];
                    input.type= 'text';
                    input.value=' ';
                    body.appendChild(input);
                    input.select();
                    document.execCommand("Copy",'false',null);
                    this.$message({type:"warning",message:"当前数据为空"});
                }
            },
            get_pendingOrder(){
                let pendingOrder = this.pendingOrder.replace(new RegExp(' ', 'gm'), '\n');
                let list = pendingOrder.split('\n').filter(row=>!!row).map(row=>row.trim());
                return list
            },
            splice_params(size){
                let list = this.get_pendingOrder();
                let result = [];
                for(let i =0;i<Math.ceil(list.length/size);i++){
                    let start = i*size;
                    let end = start+size;
                    result.push(list.slice(start,end));
                }
                return result;
            },
            get_data(res,key){
                return res[key].join('\n');
            },
        },
        computed:{
            notFoundLength(){
                return this.notFoundOrder.split('\n').filter(row=>!!row).length;
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{
                type:Boolean,
                required:true
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
