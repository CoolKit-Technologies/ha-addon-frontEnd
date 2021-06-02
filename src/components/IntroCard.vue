<template>
    <a-card hoverable>
        <template #cover>
            <img
                alt="introduction card picture"
                src="https://appcms.coolkit.cn/wp-content/uploads/2021/04/Purple-and-Cream-Illustrated-Technology-Business-Plan-Presentation-1.png"
            />
        </template>
        <a-card-meta title="the quick brown fox jumps over the lazy dog there is no doubt that the job is awesome" />
    </a-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'IntroCard'
});
</script>
