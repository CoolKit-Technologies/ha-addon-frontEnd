<template>
    <div class="rf-bridge-content">
        <div class="btn-box">
            <ctrl-button v-for="item in curRemotes" :key="`${cardData.cardId}_${item.index}`" :cardData="cardData" :type="remoteType" :name="item.name" :channelData="item" />
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { defineComponent } from 'vue';
import CtrlButton from '@/components/CtrlItem/CtrlButton.vue';

type TypeRFItem = { rfChl: number; rfVal: string };
type TypeZyxInfoItem = { remote_type: string; name: string; buttonName: { [key: string]: string }[] };

export default defineComponent({
    name: 'RFBirdgeContent',
    components: {
        CtrlButton,
    },
    data() {
        return {
            allChannel: Array.from({ length: 64 }, () => ''),
        };
    },
    props: {
        uiid: {
            required: true,
            type: Number,
        },
        cardData: {
            required: true,
        },
    },

    computed: {
        remoteType() {
            const {
                tags: { zyx_info },
                cardIndex,
            } = this.cardData as any;
            return +_.get(zyx_info, [cardIndex, 'remote_type']);
        },
        curRemotes() {
            const result = [] as { name: string; rfVal?: string; rfChl: number; index: number; rfTrig?: string }[];
            const {
                tags: { zyx_info },
                params,
                cardIndex,
            } = this.cardData as { tags: { zyx_info: TypeZyxInfoItem[] }; params: any; cardIndex: number };
            const { rfList }: { rfList: TypeRFItem[] } = params;

            for (let i = 0; i < rfList.length; i++) {
                const { rfChl, rfVal } = rfList[i];
                this.allChannel[rfChl] = rfVal;
            }
            const { buttonName, remote_type } = zyx_info[cardIndex];
            if (+remote_type === this.remoteType) {
                buttonName.forEach((item, index) => {
                    const [key, name] = Object.entries(item)[0];
                    const rfVal = this.allChannel[+key];
                    const rfTrig = params[`rfTrig${key}`];
                    result.push({
                        index,
                        rfVal,
                        name,
                        rfTrig,
                        rfChl: +key,
                    });
                });
            }
            return result;
        },
    },
});
</script>

<style lang="stylus" scoped>
.rf-bridge-content
    display flex
    align-items center
    .btn-box
        width 100%
        & > div:not(:first-child)
            margin-top 14px
    .text
        flex 1
        display flex
        justify-content space-between
        align-items center
        & > p
            margin 0
        .title
            margin-right 10px
            color #212121
</style>
