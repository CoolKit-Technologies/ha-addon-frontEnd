<template>
    <div class="device-name">
        <div>Device Name</div>
        <a-input>
            <template #suffix>
                <SaveOutlined  v-if="editable"/>
                <EditOutlined  v-else="editable"/>
            </template>
        </a-input>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EditOutlined, SaveOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    name: "DeviceName",

    components:{
        EditOutlined,
        SaveOutlined,
    },

    props: {
        icon: {
            default: "",
        },
        title: {
            default: "",
        },
        desc: {
            default: "",
        },
    },
    data() {
        return {
            editable: false
        }
    },

    methods: {
        toggle(v: boolean, e: any) {
            // TODO: send request
            e.stopPropagation();
        },
    },
});
</script>

<style lang="stylus" scoped>
.device-name {
    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
    }

    .text {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 14px;

        & > p {
            margin: 0;
        }

        .title {
            margin-right: 14px;
        }
    }

    .action {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 6px;
    }
}
</style>
