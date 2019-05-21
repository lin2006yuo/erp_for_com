<template>
    <div class="p-emotions-textarea">
        <el-row  :gutter="10">
            <el-col :span="16" class="p-emotions-left">
                <textarea rows="9" cols="30" placeholder="请输入内容..." id="emotionsText" v-model="textarea"></textarea>
            </el-col>
            <el-col :span="6">
                <el-card :style="`width:${emotionsWidth}`">
                    <div class="emotions">
                         <span v-for="item in emotionsData">
                            <img :src="item.url" @click="get_emotion(item)" :title="item.phrase">
                        </span>
                    </div>
                    <el-pagination
                            :current-page="page"
                            :page-size="20"
                            @current-change="handleCurrentChange"
                            layout="prev, pager, next"
                            :total="filterLists.length">
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .p-emotions-textarea{
        #emotionsText{
            width: 100%;
            max-width: 649px;
            border-radius: 4px;
            font-size:12px;
        }
        .emotions{
            height: 116px;
            overflow: auto;
            span{
                padding: 8px;
                img{
                    &:hover{
                        cursor: pointer;
                        opacity: 0.6;
                    }
                    &:active{
                        cursor: pointer;
                        opacity: 1;
                    }
                }
            }
        }
    }

</style>
<script>

    export default{
        data(){
            return {
                textarea:this.value,
                page:1,
                emotion: '',
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            get_emotion(data){
                this.test(data.alt);
                this.textarea = document.getElementById('emotionsText').value;
            },
            //光标放入的位置插入文字
            test(str){
                var tc = document.getElementById('emotionsText');
                var tclen = tc.value.length;
                tc.focus();
                if(typeof document.selection != "undefined")
                {
                    document.selection.createRange().text = str;
                }
                else
                {
                    tc.value = tc.value.substr(0,tc.selectionStart)+str+tc.value.substring(tc.selectionStart,tclen);
                }
            },
            //修改表情分页
            handleCurrentChange(page){
                this.page = page;
            },
            //循环将表情文字替换为表情字符
            replaceFun(str){
                //定义对应关系
                let obj = {};
                this.filterLists.forEach(data=>{
                    obj[data.alt] = data.phrase;
                });
                //循环替换
                for (let key in obj) {
                    let regs =  '\\'+ obj[key] ;
                    let reg = new RegExp(regs,'g');
                    str = str.replace(reg,key);
                }
                return str;
            },
            //循环将表情字符替换为表情img
            replaceImg(str){
                //定义对应关系
                let obj = {};
                this.filterLists.forEach(data=>{
                    obj[data.alt] = data.url;
                });
                //循环替换
                for (let key in obj) {
                    let reg = new RegExp(key,'g');
                    str = str.replace(reg,'<img src="'+obj[key]+'" />');
                }
                return str;
            },
        },
        filters: {},
        watch: {
            value(val){
                this.textarea = val;
            },
            textarea(val){
                this.$emit('input',val);
            }
        },
        computed: {
            //数据扁平化
            filterLists(){
                let tampArr = [];
                this.emotions.forEach(row=>{
                    row.forEach(data=>{
                        tampArr.push(data);
                    })
                });
                return tampArr;

            },
            //-------表情分页
            emotionsData(){
                let ret = [];
                let index = (this.page -1) * 20;
                let j = 20;
                for(let i=index; i< this.filterLists.length && j>0; i++){
                    let row = this.filterLists[i];
                    ret.push(row);
                    j = j-1;
                }
                return ret;
            },
        },
        props:{
            value:{},
            emotions:{},
            emotionsWidth:{
                type:String,
                default(){
                    return '220px'
                }
            }
        },
        components: {}
    }
</script>
