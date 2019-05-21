<template>
    <page-dialog v-model="consumingShow"
                 width="70%"
                 :title="title"
                 class="c-consuming-dialog">
        <div v-loading="loading">
            <div class="top-tasks" v-if="consuming.length">
            <span v-for="(item,index) in consuming"
                  :key="index">
               {{item}}
            </span>
            </div>
            <div v-else style="text-align: center">
                暂无正在消费的消息
            </div>
        </div>
        <div slot="footer">
            <!--<el-button size="mini" @click.native="$emit('fresh')">刷新</el-button>-->
            <el-button @click.native="$emit('close')" size="mini">关闭</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus" scoped>
    .c-consuming-dialog{
        .top-tasks {
            min-height: 200px;
            span {
                display: inline-block;
                margin-left: 5px;
                padding: 2px 5px;
                border: 1px dashed #d7cbcb;
            }
            span:nth-child(even) {
                color: #0000ff
            }
            span:nth-child(odd) {
                color: #2ba9bc
            }
        }
    }
</style>

<script>
    export default {
        name: "element-detail",
        data() {
            return {
                consumingShow:this.value,
            }
        },
        watch: {
            consumingShow(val){
                this.$emit('input',val);
            },
            value(val){
                this.consumingShow=val;
            }
        },
        props: {
            value:Boolean,
            title:String,
            consuming:Array,
            loading:Boolean
        },
    }
</script>

