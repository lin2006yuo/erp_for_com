<template>
    <page-dialog  :title="$t('ymx-list.ASINcheck')" v-model="dialog"
                  @open="open"
                  size="large" :close-on-click-modal="false">
        <h3>{{$t('ymx-list.ASINTip')}}</h3>
        <el-row class="relative">
            <el-col :span="6">
                <h4>{{$t('ymx-list.ASINTip2')}}</h4>
                <el-input v-model='pendingOrder'
                          :placeholder="$t('ymx-list.ASINTip4')"
                          type="textarea" @keydown.native="keydown"
                          :autosize="{ minRows: 30, maxRows: 30}"></el-input>
            </el-col>
            <el-col :span="3" class='absolute-btn'>
                <request-button reqKey="amazon-publish-list-asin-inspect" @click="verification">{{$t('ymx-list.startVerifi')}}</request-button>
            </el-col>
            <el-col :span="9" class="fr asin-inspect-foundorder">
                <h4>{{$t('ymx-list.ASINTip5')}} （{{foundLength}}）</h4>
                <!--<el-input-->
                <!--v-model="existOrder" type="textarea"  ref="existOrder"-->
                <!--:autosize="{ minRows: 30, maxRows: 35}"-->
                <!--&gt;</el-input>-->
                <div class="found-list">
                    <table>
                        <tr>
                            <td>ASIN</td>
                            <td>账号</td>
                            <td>销售员</td>
                        </tr>
                    </table>
                </div>
                <div class="found-list-content">
                    <table>
                        <tbody>
                            <tr  v-for="(item,index) in existOrder" :key="index">
                                <td>{{item.asin}}</td>
                                <td>{{item.account}}</td>
                                <td>{{item.seller}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-col>
            <el-col :span="6" class="fr">
                <h4>{{$t('ymx-list.ASINTip3')}}（{{notFoundLength}}）</h4>
                <el-input v-model="notFoundOrder" type="textarea" ref="notFoundOrder"
                          :autosize="{ minRows: 30, maxRows: 30}"></el-input>
            </el-col>
        </el-row>
        <!--<el-input v-model="existOrder" type="textarea" ref="existOrder"-->
                  <!--style="z-index: 0;position: absolute ;top: -999px;left: -999px;"-->
                  <!--:autosize="{ minRows: 2, maxRows: 4}"></el-input>-->
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
        left:28%
    }
    .asin-inspect-foundorder{
        padding:0 10px;
        .found-list{
            border:1px solid #ccc;
            border-bottom:none;
        }
        .found-list-content{
            border:1px solid #ccc;
            height:515px;
            overflow:auto;
        }
        table{
            width:100%;
            tr {
                display:flex;
                td{
                    flex:1;
                    text-align:center;
                    height:25px;
                    line-height:25px;
                }
            }
        }
    }

</style>
<script>
    import {api_publish_amazon_asins} from '../../../../api/amazon-publish-list';
    export default {
        data() {
            return {
                pendingOrder:'',
                notFoundOrder:'',
                existOrder:[],
                dialog:this.value,
            }
        },
        methods:{
            open(){
                this.pendingOrder = '';
                this.notFoundOrder = '';
                this.existOrder = [];
            },
            keydown(event){
                if(event.keyCode===13){
                    if(!this.pendingOrder)return this.$message({type:"warning",message:this.$t('ymx-list.ordernumber')});
                    this.$reqKey('amazon-publish-list-asin-inspect',true);
                    this.verification();
                }
            },
            async verification(){
                this.notFoundOrder = '';
                this.existOrder = [];
                let list = this.splice_params(500);
                list.forEach((item,index)=>{
                    let params = {content:JSON.stringify(item)};
                    this.$http(api_publish_amazon_asins,params).then(res => {
                        console.log(res);
                        let arr=[...res.exist_list];
                        for(let i=0;i<arr.length;i++){
                            for(let j=i+1;j<arr.length;j++){
                                if(arr[i].asin===arr[j].asin){
                                    arr[j].asin='';
                                }
                            }
                        }
                        this.existOrder=[...arr];
                        console.log(this.existOrder,'existOrder');
                        this.notFoundOrder += this.notFoundOrder&&this.get_data(res,'not_exist_list')?'\n'+this.get_data(res,'not_exist_list'):this.get_data(res,'not_exist_list');
                        // this.existOrder += this.existOrder&&this.get_data(res,'exist_list')?'\n'+this.get_data(res,'exist_list'):this.get_data(res,'exist_list');
                        if(index===list.length-1){
                            this.$message({type:'success',message:this.$t('ymx-list.vercheck')});
                        }
                    }).catch(code => {
                        console.log(code);
                        this.$message({type:'error',message:this.$t('ymx-list.noright')});
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
                    if(target==='existOrder'){
                        let str='';
                        for(let i=0;i<this.existOrder.length;i++){
                            if(this.existOrder[i].asin!==''){
                                str+=this.existOrder[i].asin+' ';
                            }
                        }
                        console.log(str,'str');
                        let input=document.createElement("input");
                        let body=document.getElementsByTagName("body")[0];
                        input.type= 'text';
                        input.value=str;
                        body.appendChild(input);
                        input.select();
                        document.execCommand("Copy");
                        input.style.display='none';
                        this.$message({type:"success",message:this.$t('ymx-list.copySuc')});
                    }else if(target==='notFoundOrder'){
                        this.$refs[target].$refs.textarea.select();
                        document.execCommand("Copy");
                        this.$message({type:"success",message:this.$t('ymx-list.copySuc')});
                    }
                }else {
                    let input=document.createElement("input");
                    let body=document.getElementsByTagName("body")[0];
                    input.type= 'text';
                    input.value=' ';
                    body.appendChild(input);
                    input.select();
                    document.execCommand("Copy",'false',null);
                    this.$message({type:"warning",message:this.$t('ymx-detail.curdata')});
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
                if(key==='exist_list'){
                    // let array=[];
                    // let arr=[...res[key]];
                    // for(let i=0;i<arr.length;i++){
                    //     for(let j=i+1;j<arr.length;j++){
                    //         if(arr[i].asin===arr[j].asin){
                    //             arr[j].asin='                  ';
                    //         }
                    //     }
                    // }
                    // arr.forEach(item=>{
                    //     array.push(item.asin+'\t  \t'+item.account.trim()+'\t  \t'+item.seller.trim());
                    // })
                    // console.log(array);
                    // return array.join('\n');
                }else if(key==='not_exist_list'){
                    return res[key].join('\n');
                }
            },
        },
        computed:{
            notFoundLength(){
                return this.notFoundOrder.split('\n').filter(row=>!!row).length;
            },
            foundLength(){
                let num=0;
                this.existOrder.forEach(item=>{
                    if(item.asin!==''){
                        num++;
                    }
                })
                return num;
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
            uiTable:require('@/components/ui-table.vue').default,
        }
    }
</script>
