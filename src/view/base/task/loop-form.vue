<template>
    <div class="c-loop-form">
        <el-form-item label="循环类型：" class="inline" required>
            <el-select style="width:80px" v-model="loop_type_">
                <template v-for="group in loop_types">
                    <el-option-group v-if="group.values"
                                     :key="group.label"
                                     :label="group.label">
                        <el-option v-for="loop in group.values"
                                   :label="loop.label"
                                   :value="loop.value"
                                   :key="loop.value"
                        ></el-option>
                    </el-option-group>
                    <el-option v-else :label="group.label"
                               :value="group.value"
                               :key="group.value"
                    ></el-option>
                </template>

            </el-select>
        </el-form-item>
        <el-form-item v-if="loop_type" label="执行次数：" class="inline" required>
            <el-input-number :debounce="0" style="width:120px;" v-model="max_count_" :min="0"></el-input-number>
            <span class="warning">0次为无限次</span>
        </el-form-item>

        <el-form-item v-if="loop_type_ && loop_type_ < 10" label="循环参数：" class="inline" required>
            <el-input-number :debounce="0" style="width:120px;" v-model="loop_value_" :min="0"></el-input-number>
        </el-form-item>
        <template v-if="loop_type_ >= 11">
            <el-form-item label="循环参数：" class="inline" required>
                <template v-if="loop_type_ <= 11">
                <span>周<el-input-number :debounce="0" style="width:120px;" v-model="loop_value_day"
                                        :min="1" :max="7"></el-input-number></span>
                </template>
                <template v-if="loop_type_ <= 12">
                <span><el-input-number :debounce="0" style="width:120px;" v-model="loop_value_hour"
                                       :min="0" :max="23"></el-input-number>点</span>
                </template>
                <template v-if="loop_type_ <= 13">
                <span><el-input-number :debounce="0" style="width:120px;" v-model="loop_value_min"
                                       :min="0" :max="59"></el-input-number>分</span>
                </template>
            </el-form-item>
        </template>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    import {loop_types} from './task-const';
    export default{
        data(){
            return {
                loop_type_: this.loop_type,
                loop_value_: this.loop_value,
                max_count_: this.max_count,
                loop_types: loop_types,
            }
        },
        computed: {
            loop_value_day: {
                get(){
                    switch (this.loop_type_){
                        case 11:
                            return Math.floor(this.loop_value_ / (3600 * 24));
                    }
                    return 0;
                },
                set(val){
                    const diff = val - this.loop_value_day;
                    this.loop_value_ += (diff * 3600 * 24);
                }
            },
            loop_value_hour: {
                get(){
                    let hour = this.loop_value_;
                    switch (this.loop_type_) {
                        case 11://周
                            hour -= (this.loop_value_day * 3600 * 24);
                        case 12://日,天
                            return Math.floor(hour / 3600);
                    }
                    return 0;
                },
                set(val){
                    const diff = val - this.loop_value_hour;
                    this.loop_value_ += (diff * 3600);
                }
            },
            loop_value_min: {
                get(){
                    let min = this.loop_value_;
                    switch (this.loop_type_) {
                        case 11://周
                            min -= (this.loop_value_day * 3600 * 24);
                        case 12://日,天
                            min -= (this.loop_value_hour * 3600);
                        case 13://分
                            return Math.floor(min / 60);
                    }
                },
                set(val){
                    console.log(typeof val);
                    const diff = val - this.loop_value_min;
                    this.loop_value_ += (diff * 60);
                }
            },
        },
        watch: {
            loop_type_(val){
                this.$emit('update:loop_type', val);
            },
            loop_value_(val){
                this.$emit('update:loop_value', val);
            },
            max_count_(val){
                this.$emit('update:max_count', val);
            },
            loop_type(val){
                this.loop_type_ = val;
            },
            loop_value(val){
                this.loop_value_ = val;
            }
        },
        props: {
            loop_type: {
                required: true,
            },
            loop_value: {
                required: true
            },
            max_count: {
                required: true
            }
        },
        components: {}
    }
</script>