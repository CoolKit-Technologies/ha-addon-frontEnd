<template>
    <div class="header-bar">
        <span>header bar</span>
        <a-button>hello</a-button>
        <home-outlined></home-outlined>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { HomeOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    name: 'HeaderBar',

    components: {
        HomeOutlined
    }
});
</script>
