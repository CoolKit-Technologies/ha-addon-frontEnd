import { createStore } from 'vuex';
import _ from 'lodash';

import { getRegionMap } from '@/utils/etc';

export default createStore({
    state: {
        // If user is login
        isLogin: false,

        // Browser window size, 'lg' for large screen, 'md' for medium screen,
        // 'sm' for small, 'xm' for smartphone
        windowSize: 'lg',

        // Hold on until page complete
        pageLoading: false,

        // Component 'ModalBox' visibility
        modalVisible: false,
        // Component 'ModalBox' type
        modalType: '',
        // Component 'ModalBox' params
        modalParams: null,

        // Locale for i18n: 'en' or 'zh'
        locale: 'en',

        // Origin device list
        originDeviceList: [
            {
                key: '01',
                uiid: 15,
                type: 4,
                online: true,
                deviceName: 'T H',
                deviceId: '100086af3c',
                params: {
                    deviceType: 'Normal',
                    currentHumidity: 19.23,
                    currentTemperature: 30,
                    switch: 'off',
                    sledOnline: "on"
                },
                
                unit: 'c'
            },
            {
                key: '0001',
                uiid: 3,
                type: 4,
                online: true,
                deviceName: 'socket',
                apikey: 'dddd',
                deviceId: '2008',
                params: {
                    startup: 'on',
                    switches: [{
                        switch: 'on'
                    },{
                        switch: 'on'
                    },{
                        switch: 'on'
                    },{
                        switch: 'off'
                    }],
                    pulses:[{
                            pulse:'on',
                            width:500,
                            outlet:0
                        },{
                            pulse:'on',
                            width:1000,
                            outlet: 1
                        },{
                            pulse:'off',
                            width:1000,
                            outlet: 2
                        },{
                            pulse:'on',
                            width:1000,
                            outlet: 3
                        }
                    ]
                }
            },
            {
                key: '03',
                uiid: 5,
                type: 4,
                online: true,
                deviceName: 'UIID5',
                deviceId: '1000093c3d',
                params: {
                    switch: 'on',
                    power: 120
                }
            },
            {
                key: '0x',
                uiid: 32,
                type: 4,
                online: true,
                deviceName: 'IW100',
                deviceId: '1000093c3d',
                params: {
                    switch: 'off',
                    power: 120,
                    voltage: 120,
                    current: 1
                }
            },
            {
                key: '0y',
                uiid: 126,
                type: 4,
                online: true,
                deviceName: 'Dual R3',
                deviceId: '1000093c3x',
                params: {
                    voltage_00: 120,
                    voltage_01: 140,
                    current_00: 2.0,
                    current_01: 3.0,
                    actPow_00: 110,
                    actPow_01: 120,
                    reactPow_00: 130,
                    reactPow_01: 140,
                    apparentPow_00: 150,
                    apparentPow_01: 160,
                    switches: [
                        {
                            switch: 'on'
                        },
                        {
                            switch: 'off'
                        }
                    ]
                }
            },
            {
                key: '0z',
                uiid: 226,
                type: 1,
                online: true,
                deviceName: 'fake dev',
                deviceId: '111'
            }
        ]
    },

    getters: {
        regionMap(state) {
            const result = [];
            const res = getRegionMap(state.locale);
            for (let i = 0; i < res.length; i++) {
                const [code, name] = Object.entries(res[i])[0];
                result.push({ i, code, name });
            }
            return result;
        },
        deviceCardList(state) {
            const origin = state.originDeviceList as any[];
            const result = [];
            for (let i = 0; i < origin.length; i++) {
                if (origin[i].uiid === 126) {
                    // When a device UIID is 126, it should be renderred
                    // in two cards form.
                    for (let j = 0; j < 2; j++) {
                        const item = _.cloneDeep(origin[i]);
                        item.cardId = `${i}_${origin[i].key}_${j}`;
                        item.cardIndex = j;
                        result.push(item);
                    }
                } else {
                    const item = _.cloneDeep(origin[i]);
                    item.cardId = `${i}_${origin[i].key}`;
                    result.push(item);
                }
            }
            return result;
        }
    },

    mutations: {
        setIsLogin(state, v) {
            state.isLogin = v;
        },
        setModalVisible(state, v) {
            state.modalVisible = v;
        },
        setModalType(state, v) {
            state.modalType = v;
        },
        setModalParams(state, v) {
            state.modalParams = v;
        },
        setLocale(state, v) {
            state.locale = v;
        },
        setOriginDeviceList(state, v) {
            state.originDeviceList = v;
        },
        setWindowSize(state, v) {
            if (v > 1500) {
                state.windowSize = 'lg';
            } else if (v > 1000) {
                state.windowSize = 'md';
            } else if (v > 500) {
                state.windowSize = 'sm';
            } else {
                state.windowSize = 'xm';
            }
        },
        setPageLoading(state, v) {
            state.pageLoading = v;
        }
    },

    actions: {
        openModal(context, v) {
            // type - modal box type, 'login' or 'device'
            // params - modal box params, used when type is 'device'
            const { type, params } = v;
            context.commit('setModalVisible', true);
            context.commit('setModalType', type);
            context.commit('setModalParams', params);
        },
        closeModal(context) {
            context.commit('setModalVisible', false);
            context.commit('setModalType', '');
            context.commit('setModalParams', null);
        }
    }
});
