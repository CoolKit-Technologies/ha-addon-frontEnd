<template>
    <div class="rf-gateway" :style="notOnline">
        Number of remotes: {{ value }}
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name:'RfGateway',
    props:{
        params:{
            required:true
        },
        online:{
            required:true
        }
    },
    computed:{
        value(){
            const { rfList } = this.$props.params as any
            return rfList ? rfList.length : 0;
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
</style>