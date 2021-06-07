<template>
    <div class="card-action">
        <sync-outlined
            v-if="hasRefreshFunc"
            class="action-icon"
            :spin="spin"
            @click.stop="refresh"
        />
        <a-switch
            v-else-if="hasAllToggleFunc"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SyncOutlined } from '@ant-design/icons-vue';
import _ from 'lodash';

export default defineComponent({
    name: 'CardAction',

    props: {
        cardData: {
            required: true
        }
    },

    components: {
        SyncOutlined
    },

    data() {
        return {
            spin: false
        };
    },

    computed: {
        hasRefreshFunc() {
            // Only these types of device support
            const uiids = [126, 32, 5, 15];
            const { uiid } = this.cardData as any;

            if (uiids.indexOf(uiid) === -1) {
                return false;
            } else {
                return true;
            }
        },
        hasAllToggleFunc() {
            // Only these types of device support
            const uiids = [2, 3, 4, 7, 8, 9, 113, 114];
            const { uiid, params } = this.cardData as any;

            if (params) {
                const isLock = params.lock === 1;
                return uiids.indexOf(uiid) !== -1 && !isLock;
            } else {
                return uiids.indexOf(uiid) !== -1;
            }
        }
    },

    methods: {
        refresh() {
            this.spin = true;
            setTimeout(() => {
                this.spin = false;
            }, 2000);
        }
    },

    mounted() {
        this.refresh = _.throttle(this.refresh, 2200, { 'leading': true, 'trailing': false });
    }
});
</script>

<style lang="stylus" scoped>
.card-action
    display flex
    justify-content center
    align-items center
    margin-right 6px

    .action-icon
        color #04a9f1
        font-size 22px
        padding 6px
        border-radius 50%
        &:hover
            background-color #f7f7f7
</style>
