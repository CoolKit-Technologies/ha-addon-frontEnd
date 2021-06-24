<template>
    <div class="rf-gateway" :style="notOnline">
        {{ $t('card.remotenum') }}: {{ value }}
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name:'RfGateway',
    props:{
        tags:{
            required:true
        },
        online:{
            required:true
        }
    },
    computed:{
        value(){
            const { tags } = this.$props as any
            return tags.zyx_info ? tags.zyx_info.length : 0;
        },
        notOnline(){
            const online = this.$props.online as boolean
            return online ? '' : '{ color: #E8E8E8 }';
        }
    }
})
</script>
<style lang="stylus">
.rf-gateway
    font-size 18px
    color: #212121;
    padding-left 44px
    padding-top 14px
</style>
