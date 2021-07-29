<template>
    <div class="control-circle" :style="circleColor">
        <template v-if="$props.type === 'bulb'">
            <img class="bulb" src="@/assets/bulb-blue.png" alt="bulb" v-if="$props.color === 'blue'" />
            <img class="bulb" src="@/assets/bulb-yellow.png" alt="bulb" v-else-if="$props.color === 'yellow'" />
            <img class="bulb" src="@/assets/bulb-red.png" alt="bulb" v-else-if="$props.color === 'red'" />
            <img class="bulb" src="@/assets/bulb-gray.png" alt="bulb" v-else-if="$props.color === 'gray'" />
        </template>
        <template v-if="$props.type === 'curtain'">
            <img src="@/assets/curtain-pause.png" alt="curtain" v-if="$props.curtainType === 'pause'" />
            <img src="@/assets/curtain-off.png" alt="curtain" class="curtain" v-if="$props.curtainType === 'off'" />
            <img src="@/assets/curtain-on.png" alt="curtain" class="curtain" v-if="$props.curtainType === 'on'" />
            <img src="@/assets/curtain-alloff.png" alt="curtain" class="curtain" v-if="$props.curtainType === 'alloff'" />
            <img src="@/assets/curtain-allon.png" alt="curtain" class="curtain" v-if="$props.curtainType === 'allon'" />
        </template>
        <template v-if="$props.type === 'fan'">
            <img src="@/assets/fan_on_low.png" alt="fan" class="fan" v-if="$props.fanType === 'low' && $props.active" />
            <img src="@/assets/fan_on_mid.png" alt="fan" class="fan" v-if="$props.fanType === 'mid' && $props.active" />
            <img src="@/assets/fan_on_high.png" alt="fan" class="fan" v-if="$props.fanType === 'high' && $props.active" />
            <img src="@/assets/fan_off_low.png" alt="fan" class="fan" v-if="$props.fanType === 'low'&& !$props.active" />
            <img src="@/assets/fan_off_mid.png" alt="fan" class="fan" v-if="$props.fanType === 'mid'&& !$props.active" />
            <img src="@/assets/fan_off_high.png" alt="fan" class="fan" v-if="$props.fanType === 'high'&& !$props.active" />
        </template>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ControlCircle',
    props: {
        type: {
            type: String,
            required: true,
        },
        curtainType: {
            type: String,
        },
        fanType: {
            type: String,
        },
        color: {
            type: String,
        },
        active: {
            type: Boolean,
        },
    },
    data() {
        return {
            backgroundColor: {},
            border: {},
        };
    },
    computed: {
        circleColor() {
            switch (this.$props.color) {
                case 'blue':
                    return {
                        background: 'rgba(24, 144, 255, 0.1)',
                        border: '2px solid #1890FF',
                    };
                case 'yellow':
                    return {
                        background: 'rgba(252, 220, 92, 0.1)',
                        border: '2px solid #FCDC5C',
                    };
                case 'red':
                    return {
                        background: 'rgba(230, 1, 1, 0.1)',
                        border: '2px solid #E60101',
                    };
                default:
                    return {
                        border: '2px solid #BFBFBF',
                    };
            }
        },
    },
    mounted() {
        // this.circleColor()
    },
    methods: {},
});
</script>
<style lang="stylus">
.control-circle
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display flex
    justify-content center
    align-items center
    .bulb
        width 27px
        height 39px
    .curtain
        width 69px
        height 28px
    .fan
        width 50px
</style>
