<template>
    <div>
        <div class="butoon-part" style="overflow:hidden;margin-left:10px;">
            <div class="butoon-down" :title="leftControllerTitle" v-show="show" @click="show = false;">
                <i class="white-down"></i>
            </div>
            <div style="float:left;overflow:hidden;" class="mt-sm mb-sm">
                <slot name="button-list"></slot>
            </div>
            <slot name="other" style="float:right;"></slot>
        </div>
        <el-row>
            <el-col :span="leftSpan" v-show="!show" style="padding-right:4px;">
                <slot name="goods-tree" v-resize="{height:75}"></slot>
            </el-col>
            <el-col :span="rightSpan" style="padding:0 4px;">
                <slot name="goods-tabel" v-resize="{height:75}"></slot>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
        }
    },
    computed: {
        rightSpan() {
            return this.show? 24 : this.rightMinSpan;
        }
    },
    methods: {
        showLeft(val){
            this.show = val;
        },
    },
    props: {
        defaultShowLeft: {
            default() {
                return false;
            }
        },
        rightMinSpan: {
            default() {
                return 21;
            }
        },
        leftControllerTitle:{
            default(){
                return '显示分类'
            }
        },
        leftSpan: {
            default(){
                return 3;
            }
        },
    }
}
</script>
