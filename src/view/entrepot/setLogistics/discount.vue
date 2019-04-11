<template>
        <page class="p-discount" v-loading="loading">
            <el-form>
                <div class="form-item">
                    <el-form-item label="运费折扣：" class="discount">
                        <el-input   v-model="disData.shipping_fee_discount"  :step="0.1"
                                    class="inline width-xs" :min="0" :max="2" :disabled="!editable"
                                    type="number"></el-input>
                        <span class="c-red">
                            (请注意,无折扣是请输入1, 8折时,请输入0.8)
                        </span>
                    </el-form-item>
                    <el-form-item label="运费币种：" class="corn">
                        <el-select v-model="disData.currency_code" ref="currency"
                                    v-mouse-side.mousewheel="()=>{$refs.currency.visible=false}"
                                    placeholder="请选择" class="inline width-md" :disabled="!editable">
                            <el-option :key="item.code"
                                        v-for="item in moneys"
                                        :label="item.name"
                                        :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <!-- 跟踪号规则 -->
                <div class="form-item">
                    <label class="inline lh-29">截取跟踪号规则：</label>
                    <div>
                        <!-- 第一条 -->
                        <div class="track-rule" v-for="(track, index) in disData.tracking_rules" :key="`track_${index}`">
                            <label for="">跟踪号总位数：</label>
                                <el-input 
                                    class="inline width-mini mr-md" 
                                    v-number:int 
                                    :ref="`firstInput${index}`"
                                    v-model="track.tracking_number_total"
                                ></el-input>
                            <label for="">截取跟踪号总位数：
                                </label>
                                    第 <el-input class="inline width-mini" v-model="track.start_position"></el-input> 位 --- 
                                    第 <el-input class="inline width-mini" v-model="track.end_position"></el-input> 位
                            <!-- 删除按钮 -->
                            <el-button 
                                size="mini" icon="delete" 
                                type="danger" 
                             
                                class="ml-sm" 
                                @click="delete_track_rule(index, track)"
                            ></el-button>
                            <!-- 占位添加按钮 -->
                            <el-button 
                                size="mini" icon="plus" 
                                type="primary" 
                                class="ml-sm" 
                                @click="new_track_rule" 
                                v-if="index === (disData.tracking_rules.length - 1)"
                            ></el-button>
                            <!-- 校验错误提示 -->
                            <span class="c-red ml-sm" v-show="(Number(track.tracking_number_total) <　Number(track.end_position)) || (!track.end_position ? false : Number(track.start_position) > Number(track.end_position))">请填写正确位数</span>
                        </div>
                        <!-- 跟踪号添加按钮 -->
                        <el-button size="mini" icon="plus" type="primary" class="ml-sm" @click="new_track_rule()" v-if="disData.tracking_rules && !disData.tracking_rules.length"></el-button>
                    </div>
                </div>
                <!-- 敏感词 -->
                <div class="form-item mt-sm">
                    <span class="inline lh-29 sensitive-span">禁止发货的敏感词：</span>
                    <div class="sensitive-input-group">
                    <el-tag
                        :key="`tag_${index}`"
                        v-for="(tag, index) in disData.sensitive_words"
                        closable
                        :disable-transitions="false"
                        @close="handle_delete(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="inline width-mini"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handle_input_confrim"
                        @blur="handle_input_confirm"
                    >
                    </el-input>
                    <!-- 敏感词添加按钮 -->
                    <el-button 
                        v-else class="button-new-tag" 
                        type="primary" 
                        size="mini" 
                        @click="show_input" 
                        icon="plus"></el-button>
                    </div>
                </div>
            </el-form>
        </page>
    </template>
    
    <script>
        import number from './mixin/number'
        import {api_get_currency, api_delete_racking_rule} from '@/api/setLogistics'
        export default {
            mixins: [number],
            name: "discount",
            data(){
                return{
                    loading:false,
                    // mock跟踪号数据
                    tracking_rules: [
                        { tracking_number_total: '21', start_position: '1', end_position: '3' },
                        { tracking_number_total: '33', start_position: '22', end_position: '24' },
                        { tracking_number_total: '13', start_position: '2', end_position: '4' },
                    ],
                    sensitive_words: ['标签一', '标签二', '标签三'],
                    inputVisible: false,
                    inputValue: '',
                    disData:{},
                    moneys:[],
                }
            },
            mounted(){
                this.get_currency();
                this.disData = this.discountData
            },
            watch:{
                discountData:{
                    deep:true,
                    handler(val){
                        this.disData = val;
                    }
                }
            },
            methods:{
                get_currency(){
                    this.$http(api_get_currency).then(res=>{
                        this.moneys=[];
                        for (let i in res){
                            this.moneys.push(res[i])
                        }
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message || code});
                    })
                },
                //添加跟踪号规则
                new_track_rule() {
                    const { length } = this.disData.tracking_rules
                    const lastData = this.disData.tracking_rules[length - 1]
                    if(lastData && !lastData.tracking_number_total && !lastData.start_position && !lastData.end_position) {
                        return this.$message({type: 'info', message: '请填写跟踪号截取规则'})
                    }
                    this.disData.tracking_rules.push({tracking_number_total: '', start_position: '', end_position: ''})
                },
                //删除跟踪号规则
                delete_track_rule(index, item) {
                    //如果没有填写数据，直接删除
                    if( item.tracking_number_total === '' || item.start_position === '' || 
                        item.end_position === '' || Number(item.tracking_number_total) <= 0 ||
                        !item.id
                        ) {
                        this.disData.tracking_rules.splice(index, 1)
                    } else {
                        this.$confirm('确定要删除该条跟踪号规则吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.$http(api_delete_racking_rule, item.id).then(res => {
                                    this.$message({type: 'success', message: res.message})
                                    this.disData.tracking_rules.splice(index, 1)
                                }).catch(err => {
                                    this.$message({type: 'error', message: err})
                                })
                            }).catch(() => {
                        });
                    }
                },
                //删除敏感词
                handle_delete(tag) {
                    this.$confirm('确定要删除该敏感词吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.disData.sensitive_words.splice(this.disData.sensitive_words.indexOf(tag), 1);
                        }).catch(() => {});
                },
                show_input() {
                    this.inputVisible = true;
                    this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                    });
                },
                //添加敏感词
                handle_input_confirm() {
                    let inputValue = this.inputValue;
                    if (inputValue) {
                        if(this.disData.sensitive_words.length) this.disData.sensitive_words.push(inputValue);
                        else {
                            this.disData.sensitive_words = []
                            this.disData.sensitive_words.push(inputValue);
                        }
                    }
                    this.inputVisible = false;
                    this.inputValue = '';
                }
            },
            props:{
                discountData:{},
                editable:{
                    required:true,
                    type:Boolean
                }
            },
            components: {
                inputGroup: require('./input-group').default
            }
        }
    </script>
    
    <style lang="stylus">
        .lh-29 {
            line-height: 29px
        }
        .p-discount{
            .form-item {
                display: flex
                .sensitive-input-group {
                    width: 600px;
                }
                .track-rule {
                    margin-bottom: 6px;
                }
                .discount {
                    width: 420px
                }
                .corn {
                    width: 200px
                }
                .el-tag + .el-tag {
                    margin-left: 5px;
                }
            }
        }
    </style>
    