<template>
    <div class="device-card" @click="openModalBox">
        <span>card id: {{ cardData.cardId }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

// TODO: add DeviceCardHeader, DeviceCardFooter

export default defineComponent({
    name: 'DeviceCard',

    props: {
        cardData: {
            required: true
        }
    },

    methods: {
        openModalBox() {
            this.openModal({
                type: 'device',
                params: {
                    foo: 'bar'
                }
            });
        },
        ...mapActions(['openModal'])
    }
});
</script>

<style lang="stylus" scoped>
$color-white = #ffffff
$color-grey = #e3e3e3
$color-grey-dark = #eaeaea

.device-card
    background-color $color-white
    padding 14px
    border: 1px solid $color-grey
    border-radius: 4px
    transition all 0.3s
    // TODO: remove margin
    margin-bottom 20px
    &:hover
        box-shadow 0 2px 4px 2px $color-grey-dark
        cursor pointer
</style>
