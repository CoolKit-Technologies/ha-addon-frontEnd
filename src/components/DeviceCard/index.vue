<template>
    <div class="device-card" @click="openModalBox">
        card ...
        <a-button>send</a-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

// TODO: add DeviceCardHeader, DeviceCardFooter

export default defineComponent({
    name: 'DeviceCard',

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
.device-card
    background-color tomato
</style>
