<template>
    <div v-show="show" class="find-view">
        <el-input ref="input" v-model="string">
            <span slot="append">
                <span>{{current}}/{{total}}</span>
                <span class="btn" @click="prevFind" :class="prev?'':'disabled'">上一个</span>
                <span class="btn" @click="nextFind" :class="next?'':'disabled'">下一个</span>
                <span class="el-icon-close" @click="show = false"></span>
            </span>
        </el-input>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                show:this.value,
                string:'',
                current:0,
                result:[]
            };
        },
        methods:{
            prevFind(){
                this.prev && (this.current -=1);
            },
            nextFind(){
                this.next && (this.current +=1);
            }
        },
        computed:{
            total(){
                return this.result.length;
            },
            next(){
                return this.current < (this.result.length+1);
            },
            prev(){
                return this.current > 0;
            }
        },
        watch:{
            current(cur){
                if(this.value){
                    this.$emit('find', this.result[cur]);
                }
            },
            string(val){
                this.result = this.query(val);
            },
            value(val){
                this.show = val;
                if(val){
                    this.current = 0;
                    this.$nextTick(_=>{
                        this.$refs.input.$refs.input.focus();
                        this.$refs.input.inputSelect();
                    })
                }
            },
            show(val){
                this.$emit('input', val);
            }
        },
        props:{
            query:{},
            value:{
                default(){
                    return true;
                }
            },
            placeholder:{}
        },
        components:{
            uiAutocomplete:require('@/components/ui-autocomplete').default,
            pageDialog:require('@/components/page-dialog').default
        }
    }
</script>
<style lang="stylus">
    .find-view{
        background-color: #FFF;
        border: 1px solid #CCC;
        padding: 3px;
        position: fixed;
        top:2px;
        right:2px;
        z-index: 99999;
        width:280px;
    }
</style>