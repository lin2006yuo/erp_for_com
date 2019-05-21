<template>
    <div class="add-tort-account">
        <div :style="`min-height: ${minHeight}px;`" class="contants">
            <drag-drop tag="ul" class="inline" v-model="tags">
                <li v-for="(tag,i) in tags"
                    :key="tag.name"
                    class="mr-xs mb-xs cursor-class el-tag el-tag--success">{{tag.name}}
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
            <!--<div>-->
            <el-checkbox v-model="handleType" class="ml-sm">搜索添加</el-checkbox>
            <!--</div>-->
            <!--<el-select class='inline s-width-small'-->
                       <!--v-model="handleType"-->
                       <!--default-first-option filterable>-->
                <!--<el-option-->
                        <!--v-for="res in typeList"-->
                        <!--:label="res.label"-->
                        <!--:value="res.value"-->
                        <!--:key="res.value"></el-option>-->
            <!--</el-select>-->
                <input v-if='!handleType' v-model="input"
                       :disabled="disabled||goBeyond" ref="inputData"
                       class="inline enter" @keyup.enter="add_tag"
                       :placeholder="placeholder">
                <el-select
                        ref="selectData" size="mini"
                        class="select-border ml-sm"
                        v-model="select" v-else
                        filterable default-first-option
                        remote multiple @keydown.native.space="search"
                        placeholder="输入关键词搜索更多数据，勾选后点击空格键添加"
                        :remote-method="remoteMethod">
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
    .add-tort-account {
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
                    /*max-width: 208px;*/
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

    export default {
        data() {
            return {
                select:[],
                input: '',
                handleType:false,
                typeList:[
                    {label:'批量添加',value:1},
                    {label:'搜索添加',value:2},
                ],
                options:[]
            }
        },
        computed: {
            goBeyond() {
                return this.tags.length >= this.num
            }
        },
        methods: {
            remoteMethod(query) {
                if (!!query) {
                    let query_ = query.trim();
                    setTimeout(() => {
                        this.options = this.selectData.curAccount.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query_.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options = [];
                }
            },
            search(){
                if(!this.select||this.select.length<=0)return;
                console.log(this.tags,'this.tags');
                let list = this.select.filter(row=>!this.tags.find(res=>Number(res.shop_id) ===row));
                if(list.length!==this.select.length)this.$message({type:'warning',message:'已过滤重复店铺！'});
                list.forEach(val=>{
                    let find = this.selectData.curAccount.find(row=>row.value===val);
                    if(find){
                        let findIndex = this.tags.findIndex(row=>row.shop_id===val);
                        if(findIndex>-1)return this.$message({type:'warning',message:`不要重复添加【${find.label}】店铺`})
                        this.tags.push({shop_id:find.value,name:find.label})
                    }
                });
                this.select = [];
                this.$refs.selectData.$refs.input.focus();
            },
            get_focus() {//用于组件获取焦点
                this.$refs.inputData.focus();
            },
            add_tag() {
                if (!this.input) this.$message({type: "info", message: '请输入店铺名'});
                let value = '';
                if(typeof this.step=== 'string'){
                    value = this.input.split(this.step).filter(row=>!!row).map(row=>row.trim());
                }else{
                    this.step.forEach(row=>{
                        this.input = this.input.replace(new RegExp(row, 'gm'),',')
                    });
                    value = this.input.split(',').filter(row=>!!row).map(row=>row.trim());;
                }
                let surplus = [];
                value.forEach(row=>{
                    let find = this.selectData.curAccount.find(item=>item.label===row);
                    if(!find){
                        surplus.push(row);
                    }else{
                        let findIndex = this.tags.findIndex(item=>item.name===row);
                        if(findIndex>-1){
                            surplus.push(row);
                        }else{
                            this.tags.push({shop_id:find.value,name:find.label});
                        }
                    }
                });
                this.input = surplus.join(' ');
                if(this.input) return this.$message({type:'warning',message:'请检查输入框内容是否已添加 或 是否输入有误！'});
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
                    return ' '
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
            selectData:{
                type:Object,
                required:true
            }
        },
        components: {
            dragDrop
        }
    }
</script>
