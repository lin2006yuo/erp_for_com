import Sortable from '../lib/Sortable';
function removeNode(node) {
    node.parentElement.removeChild(node)
}

function insertNodeAt(fatherNode, node, position) {
    if (position < fatherNode.children.length) {
        fatherNode.insertBefore(node, fatherNode.children[position])
    } else {
        fatherNode.appendChild(node)
    }
}

function computeVmIndex(vnodes, element) {
    return vnodes.map(elt => elt.elm).indexOf(element)
}

function updatePosition(collection, oldIndex, newIndex) {
    if (collection) {
        collection.splice(newIndex, 0, collection.splice(oldIndex, 1)[0])
    }
}

function computeIndexes(slots, children) {
    return Array.prototype.map.call(children, elt => computeVmIndex(slots, elt))
}

function merge(target, source) {
    let output = Object(target)
    for (let nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey]
        }
    }
    return output
}

function emit(evtName, evtData) {
    this.$emit(evtName.toLowerCase(), evtData)
}

function delegateAndEmit(evtName) {
    return (evtData) => {
        this['onDrag' + evtName](evtData)
        emit.call(this, evtName, evtData)
    }
}

export default {
    data() {
        return {
            list: this.value
        }
    },
    watch: {
        list(val) {
            this.$emit('input', val);
        },
        value(val) {
            this.list = val;
        }
    },
    props: {
        options: Object,
        tag: {
            default() {
                return 'div'
            }
        },
        clone: {
            type: Function,
            default: (original) => {
                return original;
            }
        },
        value: {}
    },
    render(h) {
        return h(this.tag, {class: "drag-parent"}, this.$slots.default);
    },

    mounted() {
        var optionsAdded = {};
        ['Start', 'Add', 'Remove', 'Update', 'End'].forEach(elt => {
            optionsAdded['on' + elt] = delegateAndEmit.call(this, elt, this.list)
        });

        ['Choose', 'Sort', 'Filter', 'Move', 'Clone'].forEach(elt => {
            optionsAdded['on' + elt] = emit.bind(this, elt, this.list)
        });

        const options = merge(this.options, optionsAdded)
        this._sortable = new Sortable(this.$el, options)
        this.computeIndexes()
    },

    beforeDestroy() {
        this._sortable.destroy()
    },

    updated() {
        this.computeIndexes()
    },

    methods: {

        computeIndexes() {
            this.$nextTick(() => {
                this.visibleIndexes = computeIndexes(this.$slots.default, this.$el.children)
            })
        },

        onDragStart(evt) {
            if (!this.list) {
                return
            }
            const currentIndex = computeVmIndex(this.$slots.default, evt.item)
            const element = this.list[currentIndex]
            this.context = {
                currentIndex,
                element
            }
            evt.item._underlying_vm_ = this.clone(element)
        },

        onDragAdd(evt) {
            const element = evt.item._underlying_vm_
            if (!this.list || element === undefined) {
                return
            }
            removeNode(evt.item)
            const indexes = this.visibleIndexes
            const domNewIndex = evt.newIndex
            const numberIndexes = indexes.length
            const newIndex = (domNewIndex > numberIndexes - 1) ? numberIndexes : indexes[domNewIndex]
            this.list.splice(newIndex, 0, element)
            this.computeIndexes()
        },

        onDragRemove(evt) {
            if (!this.list) {
                return
            }
            insertNodeAt(this.$el, evt.item, evt.oldIndex)
            const isCloning = !!evt.clone
            if (isCloning) {
                removeNode(evt.clone)
                return
            }
            const oldIndex = this.context.currentIndex;
            this.list.splice(oldIndex, 1)
        },

        onDragUpdate(evt) {
            if (!this.list) {
                return
            }
            removeNode(evt.item)
            insertNodeAt(evt.from, evt.item, evt.oldIndex)
            const oldIndexVM = this.context.currentIndex
            const newIndexVM = this.visibleIndexes[evt.newIndex]
            updatePosition(this.list, oldIndexVM, newIndexVM)
        },

        onDragEnd(evt) {
            this.computeIndexes()
        }
    }
}