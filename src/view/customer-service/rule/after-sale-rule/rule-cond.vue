<template>
    <div class="c-rule-cond">
        <label class="rule-title">{{title}}<span>{{configs.title}}</span></label>
        <div class="rule-content">
            <rule-form :config="configs" :channel="channel" :data="data"></rule-form>
            <label class="rule-profile" v-if="configs.profile">{{configs.profile}}</label>
        </div>
    </div>
</template>
<style lang="stylus">
    .rule-content {
        padding-top: 10px;
        > div > .rule1 {
            width: auto;
            display: inline;
            > b {
                width: auto;
                vertical-align:middle;
            }
        }
    }

    .rule-title {
        font-size: 10px;
        > span {
            color: #5e8fce;
            margin-left: 8px;
        }
    }

    .rule-desc {
        display: inline-block;
        color: #ff0000;
    }

    .rule-unit {
        display: inline-block;
        vertical-align: middle;
    }

    .rule-profile {
        color: #ce7e0f;
    }

    .label-width {
        max-width: 150px;
    }
</style>
<script>

    import {api_get_resource} from '@/api/order-rules';

    export default {
        data() {
            return {}
        },
        computed: {
            configs(){
                switch (this.code){
                    case 'source':
                        let data = this.config.data || [];
                        data = data.filter(row =>{
                            if(row.group === 'channel'){
                                if(!this.channel || Number(row.key) === Number(this.channel)){
                                    return true;
                                }
                            }
                        });
                        return {
                            type:this.config.type || 1,
                            profile:this.config.profile,
                            title:this.config.title,
                            election:this.config.election,
                            data:data,
                        };
                    default:
                        return this.config;
                }
            }
        },
        props: {
            data: {},
            title: {},
            code: {},
            config: {},
            channel:{},
        },
        components: {
            ruleForm: require('./rule-form').default,
        }
    }
</script>
