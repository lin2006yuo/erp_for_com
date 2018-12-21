<template>
    <div class="p-pricing-cond">
        <div class="head mb-sm">{{configs.label}}</div>
        <div v-for="child in configs.child" :key="child.name" class="mb-sm">
            <span>{{child.name}}</span>
            <div class="rules">
                <div v-if="child && child.resources"
                     v-for="(item, index) in child.resources.data"
                     :key="`${item.title}-${index}`" :class="{inline: (child.resources.title === '物流附加费设置' && item.type === 1) || (child.resources.title === '物流挂号费设置' && item.type !== 3)}">
                    <div v-if="item.type === 9" class="mt-xs">
                        <span>{{item.title}}</span>
                        <el-input :value="item_value(item)"
                                  @input="(val)=>item_value_change(item,val)"
                                  type="number" class="width-xs inline" min="0"></el-input>
                        <span>{{item.unit}}</span>
                        <span>{{item.desc}}</span>
                        <el-input :value="item_value(item, 'other')"
                                  @input="(val)=>item_value_change(item,val, 'other')"
                                  type="number" class="width-xs inline" min="0"></el-input>
                        <!--<span>RMB</span>-->
                    </div>
                    <div v-if="item.type === 2" class="mt-xs">
                        <el-radio :value="item_value(item) ? item.key:'' ? item.key:''"
                                  @input="(val)=>item_value_change(item,val, 'value',child.resources.data)"
                                  :label="item.key"
                                  class="width-xs inline">
                            {{item.title}}
                        </el-radio>
                        <ui-select v-if="!isEmpty(item.condition)"
                                   :value="item_value(item)"
                                   class="inline"
                                   ref="brand"
                                   v-mouse-side.mousewheel="()=>{$refs.brand[index].visible=false}"
                                   @input="val=>item_value_change(item,val)"
                        >
                            <el-option v-for="(cond,value) in item.condition"
                                       :key="value"
                                       :label="cond" :value="value"
                            ></el-option>
                        </ui-select>
                        <span>{{item.unit}}</span>
                    </div>
                    <div v-if="item.type === 3" class="mt-xs">
                        <span>{{item.title}}</span>
                        <el-input :value="item_value(item)"
                                  @input="val=>item_value_change(item,val)"
                                  type="number" class="width-xs inline" min="0"></el-input>
                        <span>{{item.unit}}</span>
                        <span>{{item.desc}}</span>
                    </div>
                    <div v-if="item.type === 1" class="mt-xs inline mr-sm">
                        <el-checkbox :value="item_value(item)"
                                     @input="val=>item_value_change(item,val)">
                            {{item.title}}
                        </el-checkbox>
                        <ui-select v-if="!isEmpty(item.condition)"
                                   :value="item_value(item, 'operator')"
                                   ref="brand" filterable clearable
                                   v-mouse-side.mousewheel="()=>{$refs.brand[index].visible=false}"
                                   @input="val=>item_value_change(item, val, 'operator')"
                                   class="width-super inline">
                            <el-option v-for="(opt,key) in item.condition"
                                       :key="key"
                                       :label="opt" :value="key"></el-option>
                        </ui-select>
                        <span>{{item.unit}}</span>
                        <span>{{item.desc}}</span>
                    </div>
                    <div v-if="item.type === 5" class="mt-xs inline">
                        <div class="inline alignWidth" :class="{weightMargin:item.title==='重量'}">
                            <el-checkbox :value="!!item_value(item)" class="inline"></el-checkbox>
                            <span>{{item.title}}</span>
                            <ui-select v-if="!isEmpty(item.condition)"
                                       :value="item_value(item, 'operator')"
                                       ref="brand"
                                       v-mouse-side.mousewheel="()=>{$refs.brand[index].visible=false}"
                                       @input="val=>item_value_change(item, val, 'operator')"
                                       class="width-xs inline">
                                <el-option v-for="(opt,key) in item.condition"
                                           :key="key"
                                           :label="key" :value="opt">
                                </el-option>
                            </ui-select>
                            <el-input :value="item_value(item)"
                                      @input="val=>item_value_change(item, val)"
                                      type="number" class="width-xs inline" min="0"></el-input>
                            <span>{{item.unit}}</span>
                        </div>
                        <div class="inline" v-for="child in item.child" :key="child.title">
                            <span class="pricing-cond-title">{{child.title}}</span>
                            <div v-if="child.type === 9" class="inline">
                                <el-input :value="item_value(child)"
                                          @input="val=>item_value_change(child, val)"
                                          type="number" class="width-xs inline" min="0"></el-input>
                                <span>:</span>
                                <el-input :value="item_value(child, 'other')"
                                          @input="val=>item_value_change(child, val, 'other')"
                                          type="number" class="width-xs inline" min="0"></el-input>
                            </div>
                            <div v-if="child.type === 5" class="inline">
                                <el-input :value="item_value(child)"
                                          @input="val=>item_value_change(child, val)"
                                          type="number" class="width-xs inline" min="0"></el-input>
                                <span>{{child.unit}}</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.type === 6" class="mt-xs inline mr-sm">
                        <el-radio :value="item_value(item) ? item.key:''"
                                  @input="(val)=>item_value_change(item, val, 'value', child.resources.data)"
                                  :label="item.key">
                            {{item.title}}
                        </el-radio>
                        <el-input :value="item_value(item, 'operator')"
                                  @input="val=>item_value_change(item, val, 'operator')"
                                  type="number" class="width-xs inline" min="0"></el-input>
                    </div>
                    <div v-if="item.type === 10" class="mt-xs">
                        <div class="inline alignWidth">
                            <el-checkbox :value="!!item_value(item)"
                            ></el-checkbox>
                            <el-input :value="item_value(item)"
                                      @input="val=>item_value_change(item, val)"
                                      @change="change_value"
                                      type="number" class="width-xs inline" min="0"></el-input>
                            <span>{{item.title}}</span>
                            <el-input :value="item_value(item, 'other')"
                                      @input="val=>item_value_change(item, val, 'other')"
                                      type="number" class="width-xs inline" :min="minNum"></el-input>
                        </div>
                        <div class="inline" v-for="child in item.child" :key="child.title">
                            <span class="pricing-cond-title">{{child.title}}</span>
                            <div v-if="child.type === 9" class="inline">
                                <el-input :value="item_value(child)"
                                          @input="val=>item_value_change(child, val)"
                                          type="number" class="width-xs inline" min="0"></el-input>
                                <span>:</span>
                                <el-input :value="item_value(child,'other')"
                                          @input="val=>item_value_change(child, val,'other')"
                                          type="number" class="width-xs inline" min="0"></el-input>
                            </div>
                            <div v-if="child.type === 5" class="inline">
                                <el-input :value="item_value(child)"
                                          @input="val=>item_value_change(child, val)" type="number" class="width-xs inline" min="0"></el-input>
                                <span>{{child.unit}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
    .p-pricing-cond{
        .head{
            height:32px;
            line-height:32px;
            font-size:18px;
            border-bottom:1px solid #D3DCE6;
        }
        .error-color{
            border: 1px solid red;
            border-radius: 4px;
        }
        //兼容火狐浏览器，给el-input加上type:number之后会自动产生红色box-shadow
        .el-input__inner{
            box-shadow: none !important;
        }
    }
    .pricing-cond-title {
        display: inline-block;
        text-align: right;
        width: 90px;
    }
    .rules {
        border: 1px solid #d6d6d6;
        margin-top: 5px;
        padding: 5px;
        >
        label {
            margin: 5px;
            display: block;
        }

        li {
            cursor: pointer;
            padding-top: 5px;
            padding-bottom: 5px;
        }

        .current {
            background-color: rgba(22, 22, 22, 0.1);
        }

        .context {
            display: flex;
            flex: 1;
            color: #4e92ce;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &
            :hover {
                color: #bb7829;
            }
        }
        .content-select {

        }
    }
    .alignWidth{
        width: 400px;
    }
    .weightMargin {
        margin-left: 53px;
    }
</style>
<script>

    export default{
        data(){
            return {
                minNum:""
            }
        },
        methods: {
            isEmpty(cond){
                return isEmpty(cond);
            },
            item_value(item, property = 'value'){
                if(item[property] === undefined){
                    this.$set(item, property, '');
                }
                return item[property];
            },
            change_value(value){
                this.minNum = Number(value) + 1
            },
            item_value_change(item, value, property = 'value', items){
                item[property] = value;
                if(item.title==='发送国家：'){
                    this.$emit('change-country',value)
                }
                switch (item.type){
                    case 2:
                    case 6:
                        if(value){
                            items.forEach(row =>{
                                if(row === item)return;
                                if(row.group === item.group && [2,6].includes(row.type)){
                                    row.value = false;
                                }
                            })
                        }
                        break;
                    default:
                        break;
                }
            },
        },
        filters: {},
        watch: {
        },
        computed: {

        },
        props: {
            configs:{},
            datas:{},
        },
        components: {
            labelItems: require('../../../components/label-items.vue').default,
            uiSelect: require('../../../components/ui-select.vue').default
        }
    }
    function type_default(type){
        switch (type){
            case 1:
                return false;
            case 3:
                return '';
            default:
                return ''
        }
    }
</script>
