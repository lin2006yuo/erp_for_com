<script>
    import Vue from 'vue';
    import {Autocomplete} from 'element-ui';
    export default {
        name: 'ui-autocomplete',
        extends: Autocomplete,
        mixins: [
            {
                methods: {
                    select(item) {
                        if (this.beforeSelect(item)) {
                            this.$emit('input', item[this.props.value]);
                            this.$emit('select', item);
                            this.$nextTick(_ => {
                                this.suggestions = [];
                            });
                        }
                    },
                    handleComposition(event) {
                       if (event.type === 'compositionend') {
                            this.isOnComposition = false;
                            this.handleChange(event.target.value);
                        } else {
                            this.isOnComposition = true;
                        }
                    },
                },
                computed: {
                    suggestionVisible() {
                        const suggestions = this.suggestions;
                        let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
                        return (isValidData || this.loading) && (this.isFocus || this.muiPage || this.activated);
                    }
                },
                props: {
                    beforeSelect: {
                        default() {
                            return () => {
                                return true;
                            }
                        }
                    },
                    muiPage:{}
                },
                watch:{
                }
            },
        ],
        data() {
            return {}
        },
        mounted() {
            this.$refs.input.$on("blur", () => {
                setTimeout(_ => {
                    this.$emit("blur")
                }, 300);
            })
        },
        methods: {},
        components: {}
    }
</script>
