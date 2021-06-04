<template>
    <div class="card-header">
        <card-icon :cardData="cardData" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CardIcon from './CardIcon.vue';

export default defineComponent({
    name: 'CardHeader',

    components: {
        CardIcon
    },

    props: {
        cardData: {
            required: true
        }
    }
});
</script>
