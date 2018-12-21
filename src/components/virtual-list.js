/* 切屏操作,记录切屏位置,此插件由吴楚光开发*/
let _debounce = function (func, wait, immediate) {
    let timeout
    return function () {
        let context = this
        let args = arguments
        let later = function () {
            timeout = null
            if (!immediate) {
                func.apply(context, args)
            }
        }
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) {
            func.apply(context, args)
        }
    }
}

export default {
    props: {
        //item的高度
        size: { type: Number, required: true },
        //显示item的数量
        remain: { type: Number, required: true },
        rtag: { type: String, default: 'div' },
        wtag: { type: String, default: 'div' },
        wclass: { type: String, default: '' },
        //初始item第几条开始
        start: { type: Number, default: 0 },
        offset: { type: Number, default: 0 },
        variable: [Function, Boolean],
        //渲染显示item后几条(多渲染的)
        bench: Number,
        debounce: Number,
        totop: Function,
        tobottom: Function,
        onscroll: Function
    },

    created: function () {
        let start = this.start >= this.remain ? this.start : 0
        let keeps = this.remain + (this.bench || this.remain)

        this.delta = {
            start: start, // start index.
            end: start + keeps - 1, // end index.
            keeps: keeps, // nums keeping in real dom.
            total: 0, // all items count, update in filter.
            offsetAll: 0, // cache all the scrollable offset.
            paddingTop: 0, // container wrapper real padding-top.
            paddingBottom: 0, // container wrapper real padding-bottom.
            varCache: {}, // object to cache variable index height and scroll offset.
            varAverSize: 0, // average/estimate item height before variable be calculated.
            varLastCalcIndex: 0 // last calculated variable height/offset index, always increase.
        }
    },

    watch: {
        size: function () {
            this.alter = 'size'
        },
        remain: function () {
            this.alter = 'remain'
        },
        bench: function () {
            this.alter = 'bench'
        },
        start: function () {
            this.alter = 'start'
        },
        offset: function () {
            this.alter = 'offset'
        }
    },

    methods: {
        onScroll: function (e) {
            let delta = this.delta
            let offset = this.$refs.vsl.scrollTop

            if (delta.total > delta.keeps) {
                this.updateZone(offset)
            } else {
                delta.end = delta.total - 1
            }

            let offsetAll = delta.offsetAll
            if (this.onscroll) {
                this.onscroll(e, {
                    offset: offset,
                    offsetAll: offsetAll,
                    start: delta.start,
                    end: delta.end
                })
            }

            if (!offset && delta.total) {
                this.triggerEvent('totop')
            }

            if (offset >= offsetAll) {
                this.triggerEvent('tobottom')
            }
        },

        // update render zone by scroll offset.
        updateZone: function (offset) {
            let overs = this.variable
                ? this.getVarOvers(offset)
                : Math.floor(offset / this.size)

            let delta = this.delta
            let zone = this.getZone(overs)
            let bench = this.bench || this.remain

            // for better performance, if scroll pass items within now bench, do not update.
            if (!zone.isLast && (overs > delta.start) && (overs - delta.start <= bench)) {
                return
            }

            delta.end = zone.end
            delta.start = zone.start;
            this.$forceUpdate()
        },

        // return the scroll passed items count in variable.
        getVarOvers: function (offset) {
            let low = 0
            let middle = 0
            let middleOffset = 0
            let delta = this.delta
            let high = delta.total

            while (low <= high) {
                middle = low + Math.floor((high - low) / 2)
                middleOffset = this.getVarOffset(middle)

                // calculate the average variable height at first binary search.
                if (!delta.varAverSize) {
                    delta.varAverSize = Math.floor(middleOffset / middle)
                }

                if (middleOffset === offset) {
                    return middle
                } else if (middleOffset < offset) {
                    low = middle + 1
                } else if (middleOffset > offset) {
                    high = middle - 1
                }
            }

            return low > 0 ? --low : 0
        },

        // return a variable scroll offset from given index.
        getVarOffset: function (index, nocache) {
            let delta = this.delta
            let cache = delta.varCache[index]

            if (!nocache && cache) {
                return cache.offset
            }

            let offset = 0
            for (let i = 0; i < index; i++) {
                let size = this.getVarSize(i, nocache)
                delta.varCache[i] = {
                    size: size,
                    offset: offset
                }
                offset += size
            }

            delta.varLastCalcIndex = Math.max(delta.varLastCalcIndex, index - 1)
            delta.varLastCalcIndex = Math.min(delta.varLastCalcIndex, delta.total - 1)

            return offset
        },

        // return a variable size (height) from given index.
        getVarSize: function (index, nocache) {
            let cache = this.delta.varCache[index]
            if (!nocache && cache) {
                return cache.size
            }

            if (typeof this.variable === 'function') {
                return this.variable(index) || 0
            } else {
                let slot = this.$slots.default[index]
                let style = slot && slot.data && slot.data.style
                if (style && style.height) {
                    let shm = style.height.match(/^(.*)px$/)
                    return (shm && +shm[1]) || 0
                }
            }
            return 0
        },

        // return the variable paddingTop base current zone.
        // @todo: if set a large `start` before variable was calculated,
        // here will also case too much offset calculate when list is very large,
        // consider use estimate paddingTop in this case just like `getVarPaddingBottom`.
        getVarPaddingTop: function () {
            return this.getVarOffset(this.delta.start)
        },

        // return the variable paddingBottom base current zone.
        getVarPaddingBottom: function () {
            let delta = this.delta
            let last = delta.total - 1
            if (delta.total - delta.end <= delta.keeps || delta.varLastCalcIndex === last) {
                return this.getVarOffset(last) - this.getVarOffset(delta.end)
            } else {
                // if unreached last zone or uncalculate real behind offset
                // return the estimate paddingBottom avoid too much calculate.
                return (delta.total - delta.end) * (delta.varAverSize || this.size)
            }
        },

        // retun the variable all heights use to judge reach bottom.
        getVarAllHeight: function () {
            let delta = this.delta
            if (delta.total - delta.end <= delta.keeps || delta.varLastCalcIndex === delta.total - 1) {
                return this.getVarOffset(delta.total)
            } else {
                return this.getVarOffset(delta.start) + (delta.total - delta.end) * (delta.varAverSize || this.size)
            }
        },

        // the ONLY ONE public method, allow the parent update variable by index.
        updateVariable: function (index) {
            // clear/update all the offfsets and heights ahead of index.
            this.getVarOffset(index, true)
        },

        // return the right zone info base on `start/index`.
        getZone: function (index) {
            let start, end
            let delta = this.delta

            index = parseInt(index, 10)
            index = Math.max(0, index)

            let lastStart = delta.total - delta.keeps
            let isLast = (index <= delta.total && index >= lastStart) || (index > delta.total)
            if (isLast) {
                end = delta.total - 1
                start = Math.max(0, lastStart)
            } else {
                start = index
                end = start + delta.keeps - 1
            }

            return {
                end: end,
                start: start,
                isLast: isLast
            }
        },

        // trigger a props event on parent.
        triggerEvent: function (event) {
            if (this[event]) {
                this[event]()
            }
        },

        // set manual scroll top.
        setScrollTop: function (scrollTop) {
            this.$refs.vsl.scrollTop = scrollTop
        },

        // filter the shown items base on `start` and `end`.
        filter: function () {
            let delta = this.delta
            let slots = this.$slots.default

            if (!slots) {
                slots = []
                delta.start = 0
            }

            delta.total = slots.length

            let paddingTop, paddingBottom, allHeight
            let hasPadding = delta.total > delta.keeps

            if (this.variable) {
                allHeight = this.getVarAllHeight()
                paddingTop = hasPadding ? this.getVarPaddingTop() : 0
                paddingBottom = hasPadding ? this.getVarPaddingBottom() : 0
            } else {
                allHeight = this.size * delta.total
                paddingTop = this.size * (hasPadding ? delta.start : 0)
                paddingBottom = this.size * (hasPadding ? delta.total - delta.keeps : 0) - paddingTop
            }

            delta.paddingTop = paddingTop
            delta.paddingBottom = paddingBottom
            delta.offsetAll = allHeight - this.size * this.remain
            console.log(delta);
            return slots.filter(function (slot, index) {
                if(index >= delta.start && index <= delta.end){
                    return true;
                }else{
                    return false;
                }
            })
        }
    },

    mounted: function () {
        if (this.start) {
            let start = this.getZone(this.start).start
            this.setScrollTop(this.variable ? this.getVarOffset(start) : start * this.size)
        } else if (this.offset) {
            this.setScrollTop(this.offset)
        }
    },

    // check if delta should update when prorps change.
    beforeUpdate: function () {
        let delta = this.delta
        delta.keeps = this.remain + (this.bench || this.remain)

        let calcstart = this.alter === 'start' ? this.start : delta.start
        let zone = this.getZone(calcstart)

        // if start, size or offset change, update scroll position.
        if (~['start', 'size', 'offset'].indexOf(this.alter)) {
            this.$nextTick(this.setScrollTop.bind(this, this.alter === 'offset'
                ? this.offset : this.variable
                    ? this.getVarOffset(zone.isLast ? delta.total : zone.start)
                    : zone.isLast ? delta.total * this.size : zone.start * this.size)
            )
        }

        // if points out difference, force update once again.
        if (calcstart !== zone.start || delta.end !== zone.end || this.alter) {
            this.alter = ''
            delta.end = zone.end
            delta.start = zone.start
            this.$forceUpdate()
        }
    },

    render: function (h) {
        let list = this.filter()
        let delta = this.delta
        let dbc = this.debounce

        return h(this.rtag, {
            'ref': 'vsl',
            'style': {
                'display': 'block',
                'overflow-y': 'auto',
                'height': this.size * this.remain + 'px'
            },
            'on': {
                'scroll': dbc ? _debounce(this.onScroll.bind(this), dbc) : this.onScroll
            }
        }, [
            h(this.wtag, {
                'style': {
                    'display': 'block',
                    'padding-top': delta.paddingTop + 'px',
                    'padding-bottom': delta.paddingBottom + 'px'
                },
                'class': this.wclass
            }, list)
        ])
    }
};
