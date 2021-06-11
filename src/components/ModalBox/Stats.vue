<template>
    <div class="stats">
        用电信息统计
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
    name: 'Stats',

    components: {
    },

    computed: {
        ...mapState(['modalParams']),
    },
});
</script>

<style lang="stylus" scoped>
</style>
