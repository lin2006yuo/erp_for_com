<template>
    <div class="c-input-tag">
        <div :style="`min-height: ${minHeight}px;`" class="contants">
            <drag-drop tag="ul" class="inline" v-model="tags">
                <li v-for="(tag,i) in tags"
                    :key="tag.name"
                    class="mr-xs mb-xs cursor-class el-tag el-tag--success">{{getTag(tag)}}
                    <i class="el-tag__close el-icon-close" v-show="!disabled" @click="handle_close(i)"></i>
                </li>
                <li class="inline">
                    <el-button style="margin-bottom: 3px" type="primary" size="mini" class="inline "
                               v-show="!disabled"
                               @click="clear" v-if="tags.length!==0">清除所有</el-button>
                </li>
            </drag-drop>
        </div>
        <div class="tag-input-footer">
            <input v-model="input" :disabled="disabled||goBeyond" ref="inputData"
                   class="inline enter" @keyup.enter="add_tag"
                   :placeholder="placeholder">
        </div>
    </div>
</template>
<style lang="stylus" scoped>
    .c-input-tag {
        border: 1px solid #cccccc;
        border-radius: 4px;
        .contants {
            padding: 5px 5px 0 5px;
        }
        .cursor-class {
            cursor: move
        }
        .type-default {

        }
        .type-success {
            background-color: rgba(18, 206, 102, .1);
            border-color: rgba(18, 206, 102, .2);
            color: #13ce66;
        }
        .tag-input-footer {
            margin-top: 5px;
            display: flex;
            .enter {
                flex: 1;
                padding: 10px 5px;
                outline: #cccccc;
                color: #1f2d3d;
                border-top: 1px dotted #aaa;
                border-left: 1px solid transparent;
                border-bottom: 1px solid transparent;
                border-right: 1px solid transparent;
                border-radius: 4px;
                &:disabled {
                    background: #eef1f6;
                    color: #bbb;
                    cursor: not-allowed;
                }
            }
        }
    }
</style>
<script>
    import dragDrop from './drag-drop';

    export default {
        data() {
            return {
                input: '',
            }
        },
        computed: {
            goBeyond() {
                return this.tags.length >= this.num
            }
        },
        methods: {
            get_focus() {//用于组件获取焦点
                this.$refs.inputData.focus();
            },
            add_tag() {
                if (!this.input) {
                    this.$message({type: "info", message: '请输入标签值'})
                }
                let value = this.input.split(this.step);
                if(this.isEmail){
                    let filter = value.filter(row=>!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[a-zA-Z]{1,20}$/i.test(row));
                    if(filter.length>0){
                        this.$message({type:'warning',message:'存在格式不正确的邮箱地址，请正确填写邮箱地址！'});
                        filter.forEach(row=>{
                            let findIndex = value.findIndex(val=>row===val);
                            if(findIndex>=0){
                                value.splice(findIndex,1);
                            }
                        })
                    }
                }
                value.forEach(row => {
                    row = row.trim();
                    if (this.tags.length < this.num && row) {
                        let find = this.tags.find(item => {
                            return this.getTag(item) === row;
                        });
                        if (!find) {
                            this.tags.push(this.setTag(row))
                        } else {
                            this.$message({type: 'warning', message: `标签${row}已重复!`});
                        }
                    }
                })
                this.input = '';
            },
            handle_close(i) {
                this.tags.splice(i, 1)
            },
            clear() {
                while (this.tags.shift()) {
                }
            }
        },
        props: {
            type: {
                type: String,
                default() {
                    return "success"
                },
            },
            placeholder: {
                type: String,
                default: '请输入，并按Enter键添加，多个以逗号分隔。'
            },
            tags: {
                required: true,
                type: Array,
            },
            disabled: {
                type: Boolean,
                default: false
            },
            num: {
                type: Number,
                default() {
                    return 99
                }
            },
            step: { //多个标签 时，切割符号
                type: String,
                default() {
                    return ','
                }
            },
            getTag: {
                type: Function,
                default(item) {
                    return item.name
                }
            },
            setTag: {
                type: Function,
                default(value) {
                    return {name: value}
                }
            },
            minHeight:{
                type:Number,
                default(){
                    return 50
                }
            },
            isEmail:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components: {
            dragDrop
        }
    }
</script>
