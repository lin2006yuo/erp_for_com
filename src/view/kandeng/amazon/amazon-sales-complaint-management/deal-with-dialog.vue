<template>
    <page-dialog
            :title="$t('ymx-follow.process_method')"
            v-model="dialogShow"
            size="small"
            :close-on-click-modal="false"
            @open="open"
            @close="close">
        <el-radio-group v-model="modify_price_type" @change="set_type">
            <div class="mt-sm">
                <el-radio :label="1">{{$t('ymx-follow.automatic_price')}}</el-radio>
                <el-input-number class="s-width-mini" :controls="false" :min="0" :max="100" v-model="percent" :disabled="modify_price_type !== 1"></el-input-number>
                <span class="mr-sm">%</span>
                <span>{{$t('ymx-follow.lowest_price')}}</span>
                <el-input-number class="s-width-mini" :controls="false" :min="0" v-model="floorPrice1" :disabled="modify_price_type !== 1"></el-input-number>
            </div>
            <div class="mt-sm">
                <el-radio :label="2">{{$t('ymx-follow.auto_depreciate')}}</el-radio>
                <el-input-number class="s-width-mini mr-sm" :controls="false" :min="0" v-model="money" :disabled="modify_price_type !== 2"></el-input-number>
                <span>{{$t('ymx-follow.lowest_price')}}</span>
                <el-input-number class="s-width-mini" :controls="false" :min="0" v-model="floorPrice2" :disabled="modify_price_type !== 2"></el-input-number>
            </div>
            <div class="mt-sm">
                <el-radio :label="0">{{$t('ymx-follow.ignore')}}</el-radio>
            </div>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click.native="submit">{{this.$t('ymx-detail.confirm')}}</el-button>
            <el-button size="mini" @click.native="dialogShow = false">{{$t('ymx-detail.cancel')}}</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data(){
            return {
                dialogShow: false,
                modify_price_type: 1,
                percent: '',
                money: '',
                floorPrice1: '',
                floorPrice2: ''
            }
        },
        methods:{
            open(){
                    this.modify_price_type = 1;
                    this.percent = '';
                    this.money = '';
                    this.floorPrice1 = '';
                    this.floorPrice2 = ''
            },
            close(){

            },
            submit(){
                let modify_price;
                let lowest_price;
                if(this.modify_price_type === 1){
                    if(!this.percent||!this.floorPrice1){
                        this.$message({type: 'warning', message: this.$t('ymx-follow.error_info_percent')});
                        return
                    }else{
                        modify_price = this.percent;
                        lowest_price = this.floorPrice1
                    }
                }else if(this.modify_price_type === 2){
                    if(!this.money||!this.floorPrice2){
                        this.$message({type: 'warning', message: this.$t('ymx-follow.error_info_percent')});
                        return
                    }else{
                        modify_price = this.money;
                        lowest_price = this.floorPrice2
                    }
                }else{
                    modify_price = '';
                    lowest_price = ''
                }
                this.$emit('submit',this.modify_price_type,modify_price,lowest_price)
            },
            set_type(val){
                switch (val) {
                    case 0:
                        this.money = '';
                        this.percent = '';
                        this.floorPrice1 = '';
                        this.floorPrice2 = '';
                        break;
                    case 1:
                        this.money = '';
                        this.floorPrice2 = '';
                        break;
                    case 2:
                        this.percent = '';
                        this.floorPrice1 = '';
                        break;
                }
            }
        },
        watch: {
            value(val){
                this.dialogShow = val;
            },
            dialogShow(val){
                this.$emit('input',val);
            }
        },
        props:{
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>

<style scoped>

</style>
