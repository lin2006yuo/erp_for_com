<template>
    <page-dialog v-model="show"
                 width="70%"
                 :title="title">
        <template v-if="lookDetail.length">
            <span v-for="(item,index) in lookDetail"
                  :key="index"
                  class="inline ml-sm mb-xs">
            {{item}}
        </span>
        </template>
        <template v-else>
            <div class="t-center">
                暂无正在消费的元素
            </div>
        </template>
        <span slot="footer">
            <el-button @click.native="show=false"
                       size="mini">关闭
            </el-button>
        </span>
    </page-dialog>
</template>

<script>
    export default {
        name: "look-detail",
        data() {
            return {
                show:this.value,

            }
        },
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            value:Boolean,
            title:String,
            lookDetail:Array
        },
    }
</script>

