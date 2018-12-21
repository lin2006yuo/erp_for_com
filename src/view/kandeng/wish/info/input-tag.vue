<template>
    <div class="add-tort-account-my">
        <div :style="`min-height: ${minHeight}px;`" class="contants">
            <drag-drop tag="ul" class="inline" v-model="tags">
                <li v-for="(tag,i) in tags"
                    :key="tag.name"
                    class="mr-xs mb-xs cursor-class el-tag el-tag--success">{{getTag(tag)}}
                    <i class="el-tag__close el-icon-close" v-show="!tag.isDisabled" @click="handle_close(i)"></i>
                </li>
                <li class="inline">
                    <el-button style="margin-bottom: 3px" type="primary" size="mini" class="inline "
                               v-show="!disabled"
                               @click="clear" v-if="tags.length!==0">清除所有</el-button>
                </li>
            </drag-drop>
        </div>
        <div class="tag-input-footer">
            <el-checkbox v-model="handleType" class="ml-sm">搜索添加</el-checkbox>
            <input v-if='!handleType' v-model="input"
                   :disabled="disabled||goBeyond" ref="inputData"
                   class="inline enter" @keyup.enter="add_tag"
                   :placeholder="placeholder">
            <el-select
                v-else
                ref="selectData" size="mini"
                class="select-border ml-sm"
                v-model="select" :loading="loading"
                filterable default-first-option
                remote multiple @keydown.native.space="search"
                placeholder="输入关键词搜索更多数据，勾选后按下空格键添加"
                :remote-method="remoteMethod" @keyup.native="keydown">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>
<style lang="stylus">
    .add-tort-account-my {
         .el-select-dropdown{
            min-width: 400px !important;
            left: 582px !important;
        }
        .el-select__input{
            height: 32px !important;
        }
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
            box-sizing:border-box;
            heigth:40px;
            padding:3px;
            line-height:40px;
            margin-top: 5px;
            display: flex;
            border-top: 1px dotted #aaa;
            .select-border{
                flex: 1;
                .el-select__tags{
                    height: 32px!important;
                    overflow-y: auto;
                    >span{
                        white-space: inherit;
                    }
                }
                .el-input{
                    .el-input__inner{
                        border:1px solid transparent !important;
                    }
                }
            }
            .enter {
                flex: 1;
                padding: 10px;
                outline: #cccccc;
                color: #1f2d3d;
                border: 1px dotted transparent;
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
    import dragDrop from '@/components/drag-drop';
    import {api_kangdeng_local} from "../../../../api/kandeng"
    export default {
        data() {
            return {
                keywordContent:'',
                select:[],
                input: '',
                handleType:true,
                options:[],
                curAccount:'',
                list: [],
                loading: false,
                timeout: null,
            }
        },
        computed: {
            goBeyond() {
                return this.tags.length >= this.num
            }
        },
        methods: {
            keydown(){
                if(this.timeout){
                    clearTimeout(this.timeout);
                }
               this.timeout = setTimeout(() => {
                    let current = this.$refs.selectData.query;
                    let parms = {
                        q: String(current),
                        l: 1,
                    };
                    this.$http(api_kangdeng_local,parms).then(res => {
                        this.keywordContent = current;
                        this.$emit('keydown',this.keywordContent);
                        this.list = res.map(item => {
                            return {value: item, label: item}
                        })
                    }).catch(code => {
                        console.log(code);
                    });
                },500)
            },
            remoteMethod(query) {
                if (!!query) {
                    this.loading = true;
                    let query_ = query.trim();
                    if(!!this.options){
                        setTimeout(() => {
                            this.loading = false;
                            this.options = this.list.filter(item => {
                                return item.label.toLowerCase().indexOf(query_.toLowerCase()) > -1;
                            });
                        }, 1200);
                    }
                } else {
                    this.options = [];
                }
            },
            search(){
                if(!this.select||this.select.length<=0)return;
                this.select.forEach(row => {
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
                });
                this.select = [];
                this.$refs.selectData.$refs.input.focus();
            },
            get_focus() {//用于组件获取焦点
                // this.$refs.inputData.focus();
            },
            add_tag() {
                if (!this.input) {
                    this.$message({type: "info", message: '请输入标签值'})
                }
                let value = this.input.split(this.step);
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
                });
                this.input = '';
            },
            handle_close(i) {
                this.tags.splice(i, 1)
            },
            clear() {
                while (this.tags.shift()) {
                }
            },

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
                default: '批量添加，多个以空格或换行符分隔，点击Enter键添加'
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
                type: [Array,String],
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
            },
        },
        components: {
            dragDrop
        }
    }
</script>
