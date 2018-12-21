/**
 * Created by wcg on 16-10-14.
 */


import { mapGetters, mapActions } from 'vuex'

export default function (getts, actions) {
    return {
        computed:mapGetters(getts),
        methods:mapActions(actions)
    };
};