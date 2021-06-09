<template>
    <div class="circle-chart">
        <Icon :style="{ width, height }">
            <template #component>
                <svg x="0px" y="0px" viewBox="0 0 176 172" style="enable-background:new 0 0 595.28 841.89;">
                    <path id="XMLID_11_" style="fill:#4ECB73;" d="M87.718,3.83C42.012,3.83,4.96,40.882,4.96,86.588s37.052,82.758,82.758,82.758
                        s82.758-37.052,82.758-82.758S133.424,3.83,87.718,3.83z M87.718,167.463c-44.666,0-80.875-36.209-80.875-80.875
                        S43.052,5.713,87.718,5.713s80.875,36.209,80.875,80.875S132.384,167.463,87.718,167.463z"/>
                    <g id="XMLID_4_">
                        <defs>
                            <circle id="XMLID_3_" cx="87.718" cy="85.812" r="78.87"/>
                        </defs>
                        <clipPath id="XMLID_2_">
                            <use xlink:href="#XMLID_3_"  style="overflow:visible;"/>
                        </clipPath>
                        <linearGradient id="XMLID_6_" gradientUnits="userSpaceOnUse" x1="95.7665" y1="93.6394" x2="95.7665" y2="167.4632">
                            <stop  offset="0" style="stop-color:#77BFF8"/>
                            <stop  offset="1" style="stop-color:#1E92FF"/>
                        </linearGradient>
                        <path id="XMLID_5_" style="clip-path:url(#XMLID_2_);fill:url(#XMLID_6_);" d="M9.766,97.701c0,0,19.816,11.512,33.963,15.565
                            c2.538,0.727,10.619,3.069,17.823,2.337c4.474-0.455,10.3-1.826,17.431-5.062c2.199-0.998,10.448-5.918,16.326-8.72
                            c6.854-3.268,16.899-7.062,28.181-8.089c3.916-0.357,19.307,0.375,27.067,1.339c5.523,0.687,11.335,1.707,15.046,3.187
                            c2.925,1.167,5.669,2.117,8.037,2.869c4.856,1.541,8.129,2.242,8.129,2.242l-6.465,25.991c0,0-17.715,17.457-18.491,17.974
                            c-0.776,0.517-23.793,9.181-24.569,9.828s-2.715,6.595-2.715,6.595l-72.174,3.708l-29.483-24.797c0,0-10.863-16.693-14.741-16.81
                            C12.131,125.826,9.766,97.701,9.766,97.701z"/>
                    </g>
                </svg>
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

