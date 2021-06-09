<template>
    <div class="circle-chart">
        <Icon :style="{ width, height }">
            <template #component>
            </template>
        </Icon>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@ant-design/icons-vue';

export default defineComponent({
    name: 'CircleChart',

    components: {
        Icon
    },

    props: {
        width: {
            default: '180px',
            required: true
        },
        height: {
            default: '180px',
            required: true
        }
    }
});
</script>

