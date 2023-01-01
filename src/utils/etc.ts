// etc utils

const regionMap_zh = [
    { '+86': '中国' },
    { '+93': '阿富汗' },
    { '+355': '阿尔巴尼亚' },
    { '+213': '阿尔及利亚' },
    { '+376': '安道尔共和国' },
    { '+244': '安哥拉' },
    { '+1264': '安圭拉岛' },
    { '+247': '阿森松' },
    { '+1268': '安提瓜和巴布达' },
    { '+54': '阿根廷' },
    { '+374': '亚美尼亚' },
    { '+297': '阿鲁巴岛' },
    { '+61': '澳大利亚' },
    { '+43': '奥地利' },
    { '+994': '阿塞拜疆' },
    { '+1242': '巴哈马' },
    { '+973': '巴林' },
    { '+880': '孟加拉国' },
    { '+1246': '巴巴多斯' },
    { '+375': '白俄罗斯' },
    { '+32': '比利时' },
    { '+501': '伯利兹' },
    { '+229': '贝宁' },
    { '+1441': '百慕大群岛' },
    { '+975': '不丹王国' },
    { '+591': '玻利维亚' },
    { '+387': '波斯尼亚和黑塞哥维那' },
    { '+267': '博茨瓦纳' },
    { '+55': '巴西' },
    { '+673': '文莱' },
    { '+359': '保加利亚' },
    { '+226': '布基纳法索' },
    { '+257': '布隆迪' },
    { '+855': '柬埔寨' },
    { '+237': '喀麦隆' },
    { '+1': '加拿大' },
    { '+238': '佛得角共和国' },
    { '+1345': '开曼群岛' },
    { '+236': '中非共和国' },
    { '+235': '乍得' },
    { '+56': '智利' },
    { '+57': '哥伦比亚' },
    { '+269': '科摩罗伊斯兰联邦共和国' },
    { '+242': '刚果共和国' },
    { '+243': '刚果民主共和国' },
    { '+682': '库克群岛' },
    { '+506': '哥斯达黎加' },
    { '+225': '科特迪瓦' },
    { '+385': '克罗地亚' },
    { '+53': '古巴' },
    { '+357': '塞浦路斯' },
    { '+420': '捷克' },
    { '+45': '丹麦' },
    { '+253': '吉布提' },
    { '+1767': '多米尼克' },
    { '+1809': '多米尼加共和国' },
    { '+593': '厄瓜多尔' },
    { '+20': '埃及' },
    { '+503': '萨尔瓦多' },
    { '+372': '爱沙尼亚' },
    { '+251': '埃塞俄比亚' },
    { '+298': '法罗群岛' },
    { '+679': '斐济' },
    { '+358': '芬兰' },
    { '+33': '法国' },
    { '+594': '法属圭亚那' },
    { '+689': '法属玻利尼西亚' },
    { '+241': '加蓬' },
    { '+220': '冈比亚' },
    { '+995': '格鲁吉亚' },
    { '+49': '德国' },
    { '+233': '加纳' },
    { '+350': '直布罗陀' },
    { '+30': '希腊' },
    { '+299': '格陵兰' },
    { '+1473': '格林纳达' },
    { '+590': '瓜德罗普岛' },
    { '+1671': '关岛' },
    { '+502': '危地马拉' },
    { '+240': '几内亚' },
    { '+44': '根西岛' },
    { '+224': '几内亚' },
    { '+592': '圭亚那' },
    { '+509': '海地' },
    { '+504': '洪都拉斯' },
    { '+852': '香港' },
    { '+95': '缅甸' },
    { '+36': '匈牙利' },
    { '+354': '冰岛' },
    { '+91': '印度' },
    { '+62': '印度尼西亚' },
    { '+98': '伊拉克' },
    { '+964': '伊拉克共和国' },
    { '+353': '爱尔兰' },
    { '+44': '马恩岛' },
    { '+972': '以色列' },
    { '+39': '意大利' },
    { '+1876': '牙买加' },
    { '+81': '日本' },
    { '+44': '泽西岛' },
    { '+962': '约旦' },
    { '+7': '哈萨克斯坦共和国' },
    { '+254': '肯尼亚' },
    { '+383': '科索沃' },
    { '+965': '科威特' },
    { '+996': '吉尔吉斯坦' },
    { '+856': '老挝' },
    { '+371': '拉脱维亚' },
    { '+961': '黎巴嫩' },
    { '+266': '莱索托' },
    { '+231': '利比里亚' },
    { '+218': '利比亚' },
    { '+423': '列支敦士登' },
    { '+370': '立陶宛' },
    { '+352': '卢森堡' },
    { '+853': '澳门' },
    { '+389': '马其顿共和国' },
    { '+261': '马达加斯加' },
    { '+265': '马拉维' },
    { '+60': '马来西亚' },
    { '+960': '马尔代夫' },
    { '+223': '马里' },
    { '+356': '马耳他' },
    { '+596': '马提尼克' },
    { '+222': '毛利塔尼亚' },
    { '+230': '毛里求斯' },
    { '+262': '马约特岛' },
    { '+52': '墨西哥' },
    { '+373': '摩尔多瓦' },
    { '+377': '摩纳哥' },
    { '+976': '蒙古' },
    { '+382': '黑山共和国' },
    { '+1664': '蒙特塞拉特岛' },
    { '+212': '摩洛哥' },
    { '+258': '莫桑比克' },
    { '+264': '纳米比亚' },
    { '+977': '尼泊尔' },
    { '+31': '荷兰' },
    { '+599': '荷属安的列斯' },
    { '+687': '新喀里多尼亚' },
    { '+64': '新西兰' },
    { '+505': '尼加拉瓜' },
    { '+227': '尼日尔' },
    { '+234': '尼日利亚' },
    { '+47': '挪威' },
    { '+968': '阿曼' },
    { '+92': '巴基斯坦' },
    { '+970': '巴勒斯坦' },
    { '+507': '巴拿马' },
    { '+675': '巴布亚新几内亚' },
    { '+595': '巴拉圭' },
    { '+51': '秘鲁' },
    { '+63': '菲律宾' },
    { '+48': '波兰' },
    { '+351': '葡萄牙' },
    { '+1': '波多黎各' },
    { '+974': '卡塔尔' },
    { '+262': '留尼旺' },
    { '+40': '罗马尼亚' },
    { '+7': '俄罗斯' },
    { '+250': '卢旺达' },
    { '+684': '东萨摩亚(美)' },
    { '+685': '西萨摩亚' },
    { '+378': '圣马力诺' },
    { '+239': '圣多美和普林西比' },
    { '+966': '沙特阿拉伯' },
    { '+221': '塞内加尔' },
    { '+381': '塞尔维亚' },
    { '+248': '塞舌尔' },
    { '+232': '塞拉利昂' },
    { '+65': '新加坡' },
    { '+421': '斯洛伐克' },
    { '+386': '斯洛文尼亚' },
    { '+27': '南非' },
    { '+82': '韩国' },
    { '+34': '西班牙' },
    { '+94': '斯里兰卡' },
    { '+1869': '圣基茨和尼维斯' },
    { '+1758': '圣卢西亚' },
    { '+1784': '圣文森特' },
    { '+249': '苏丹' },
    { '+597': '苏里南' },
    { '+268': '斯威士兰' },
    { '+46': '瑞典' },
    { '+41': '瑞士' },
    { '+963': '叙利亚' },
    { '+886': '台湾' },
    { '+992': '塔吉克斯坦' },
    { '+255': '坦桑尼亚' },
    { '+66': '泰国' },
    { '+670': '东帝汶' },
    { '+228': '多哥' },
    { '+676': '汤加' },
    { '+1868': '特立尼达和多巴哥' },
    { '+216': '突尼斯' },
    { '+90': '土耳其' },
    { '+993': '土库曼斯坦' },
    { '+1649': '特克斯和凯科斯群岛' },
    { '+256': '乌干达' },
    { '+380': '乌克兰' },
    { '+971': '阿拉伯联合酋长国' },
    { '+44': '英国' },
    { '+1': '美国' },
    { '+598': '乌拉圭' },
    { '+998': '乌兹别克斯坦' },
    { '+678': '瓦努阿图' },
    { '+58': '委内瑞拉' },
    { '+84': '越南' },
    { '+1340': '维尔克群岛' },
    { '+967': '也门' },
    { '+260': '赞比亚' },
    { '+263': '津巴布韦' },
];

const regionMap_en = [
    { '+86': 'China' },
    { '+93': 'Afghanistan' },
    { '+355': 'Albania' },
    { '+213': 'Algeria' },
    { '+376': 'Andorra' },
    { '+244': 'Angola' },
    { '+1264': 'Anguilla' },
    { '+247': 'Ascension' },
    { '+1268': 'Antigua and Barbuda' },
    { '+54': 'Argentina' },
    { '+374': 'Armenia' },
    { '+297': 'Aruba' },
    { '+61': 'Australia' },
    { '+43': 'Austria' },
    { '+994': 'Azerbaijan' },
    { '+1242': 'Bahamas' },
    { '+973': 'Bahrain' },
    { '+880': 'Bangladesh' },
    { '+1246': 'Barbados' },
    { '+375': 'Belarus' },
    { '+32': 'Belgium' },
    { '+501': 'Belize' },
    { '+229': 'Benin' },
    { '+1441': 'Bermuda' },
    { '+975': 'Bhutan' },
    { '+591': 'Bolivia' },
    { '+387': 'Bosnia and Herzegovina' },
    { '+267': 'Botswana' },
    { '+55': 'Brazil' },
    { '+673': 'Brunei' },
    { '+359': 'Bulgaria' },
    { '+226': 'Burkina Faso' },
    { '+257': 'Burundi' },
    { '+855': 'Cambodia' },
    { '+237': 'Cameroon' },
    { '+1': 'Canada' },
    { '+238': 'Cape Verde' },
    { '+1345': 'Cayman Islands' },
    { '+236': 'Central African Republic' },
    { '+235': 'Chad' },
    { '+56': 'Chile' },
    { '+57': 'Colombia' },
    { '+269': 'Comoros' },
    { '+242': 'Republic of the Congo' },
    { '+243': 'Democratic Republic of the Congo' },
    { '+682': 'Cook Islands' },
    { '+506': 'Costa Rica' },
    { '+225': 'Cote dIvoire' },
    { '+385': 'Croatia' },
    { '+53': 'Cuba' },
    { '+357': 'Cyprus' },
    { '+420': 'Czech Republic' },
    { '+45': 'Denmark' },
    { '+253': 'Djibouti' },
    { '+1767': 'Dominica' },
    { '+1809': 'Dominican Republic' },
    { '+593': 'Ecuador' },
    { '+20': 'Egypt' },
    { '+503': 'ElSalvador' },
    { '+372': 'Estonia' },
    { '+251': 'Ethiopia' },
    { '+298': 'Faroe Islands' },
    { '+679': 'Fiji' },
    { '+358': 'Finland' },
    { '+33': 'France' },
    { '+594': 'French Guiana' },
    { '+689': 'French Polynesia' },
    { '+241': 'Gabon' },
    { '+220': 'Gambia' },
    { '+995': 'Georgia' },
    { '+49': 'Germany' },
    { '+233': 'Ghana' },
    { '+350': 'Gibraltar' },
    { '+30': 'Greece' },
    { '+299': 'Greenland' },
    { '+1473': 'Grenada' },
    { '+590': 'Guadeloupe' },
    { '+1671': 'Guam' },
    { '+502': 'Guatemala' },
    { '+240': 'Guinea' },
    { '+44': 'Guernsey' },
    { '+224': 'Guinea' },
    { '+592': 'Guyana' },
    { '+509': 'Haiti' },
    { '+504': 'Honduras' },
    { '+852': 'Hong Kong' },
    { '+95': 'Myanmar' },
    { '+36': 'Hungary' },
    { '+354': 'Iceland' },
    { '+91': 'India' },
    { '+62': 'Indonesia' },
    { '+98': 'Iran' },
    { '+964': 'Iraq' },
    { '+353': 'Ireland' },
    { '+44': 'Isle of Man' },
    { '+972': 'Israel' },
    { '+39': 'Italy' },
    { '+1876': 'Jamaica' },
    { '+81': 'Japan' },
    { '+44': 'Jersey' },
    { '+962': 'Jordan' },
    { '+7': 'Kazakhstan' },
    { '+254': 'Kenya' },
    { '+383': 'Kosovo' },
    { '+965': 'Kuwait' },
    { '+996': 'Kyrgyzstan' },
    { '+856': 'Laos' },
    { '+371': 'Latvia' },
    { '+961': 'Lebanon' },
    { '+266': 'Lesotho' },
    { '+231': 'Liberia' },
    { '+218': 'Libya' },
    { '+423': 'Liechtenstein' },
    { '+370': 'Lithuania' },
    { '+352': 'Luxembourg' },
    { '+853': 'Macao' },
    { '+389': 'Macedonia' },
    { '+261': 'Madagascar' },
    { '+265': 'Malawi' },
    { '+60': 'Malaysia' },
    { '+960': 'Maldives' },
    { '+223': 'Mali' },
    { '+356': 'Malta' },
    { '+596': 'Martinique' },
    { '+222': 'Mauritania' },
    { '+230': 'Mauritius' },
    { '+262': 'Mayotte' },
    { '+52': 'Mexico' },
    { '+373': 'Moldova' },
    { '+377': 'Monaco' },
    { '+976': 'Mongolia' },
    { '+382': 'Montenegro' },
    { '+1664': 'Montserrat' },
    { '+212': 'Morocco' },
    { '+258': 'Mozambique' },
    { '+264': 'Namibia' },
    { '+977': 'Nepal' },
    { '+31': 'Netherlands' },
    { '+599': 'Netherlands Antilles' },
    { '+687': 'New Caledonia' },
    { '+64': 'NewZealand' },
    { '+505': 'Nicaragua' },
    { '+227': 'Niger' },
    { '+234': 'Nigeria' },
    { '+47': 'Norway' },
    { '+968': 'Oman' },
    { '+92': 'Pakistan' },
    { '+970': 'Palestinian' },
    { '+507': 'Panama' },
    { '+675': 'Papua New Guinea' },
    { '+595': 'Paraguay' },
    { '+51': 'Peru' },
    { '+63': 'Philippines' },
    { '+48': 'Poland' },
    { '+351': 'Portugal' },
    { '+1': 'PuertoRico' },
    { '+974': 'Qatar' },
    { '+262': 'Reunion' },
    { '+40': 'Romania' },
    { '+7': 'Russia' },
    { '+250': 'Rwanda' },
    { '+684': 'Samoa Eastern' },
    { '+685': 'Samoa Western' },
    { '+378': 'San Marino' },
    { '+239': 'Sao Tome and Principe' },
    { '+966': 'Saudi Arabia' },
    { '+221': 'Senegal' },
    { '+381': 'Serbia' },
    { '+248': 'Seychelles' },
    { '+232': 'Sierra Leone' },
    { '+65': 'Singapore' },
    { '+421': 'Slovakia' },
    { '+386': 'Slovenia' },
    { '+27': 'South Africa' },
    { '+82': 'Korea' },
    { '+34': 'Spain' },
    { '+94': 'Sri Lanka' },
    { '+1869': 'St Kitts and Nevis' },
    { '+1758': 'St.Lucia' },
    { '+1784': 'St.Vincent' },
    { '+249': 'Sudan' },
    { '+597': 'Suriname' },
    { '+268': 'Swaziland' },
    { '+46': 'Sweden' },
    { '+41': 'Switzerland' },
    { '+963': 'Syria' },
    { '+886': 'Taiwan' },
    { '+992': 'Tajikistan' },
    { '+255': 'Tanzania' },
    { '+66': 'Thailand' },
    { '+670': 'Timor Leste' },
    { '+228': 'Togo' },
    { '+676': 'Tonga' },
    { '+1868': 'Trinidad and Tobago' },
    { '+216': 'Tunisia' },
    { '+90': 'Turkey' },
    { '+993': 'Turkmenistan' },
    { '+1649': 'Turks and Caicos Islands' },
    { '+256': 'Uganda' },
    { '+380': 'Ukraine' },
    { '+971': 'United Arab Emirates' },
    { '+44': 'United Kingdom' },
    { '+1': 'USA' },
    { '+598': 'Uruguay' },
    { '+998': 'Uzbekistan' },
    { '+678': 'Vanuatu' },
    { '+58': 'Venezuela' },
    { '+84': 'Vietnam' },
    { '+1340': 'Virgin Islands' },
    { '+967': 'Yemen' },
    { '+260': 'Zambia' },
    { '+263': 'Zimbabwe' },
];

/**
 * Open a new browser window
 * @param url New page URL
 */
export function openWindow(url: string) {
    window.open(url, '_blank');
}

/**
 * Get the region map
 * @param lang Display language
 * @returns Region Map
 */
export function getRegionMap(lang: string) {
    if (lang === 'en') {
        return regionMap_en;
    } else {
        return regionMap_zh;
    }
}

/**
 * If device was supported
 * @param uiid Device UIID
 * @returns If device was supported
 */
export function isSupportedDevice(uiid: number) {
    const uiids = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        11,
        14,
        15,
        22,
        28,
        32,
        34,
        44,
        59,
        77,
        78,
        102,
        103,
        104,
        107,
        112,
        113,
        114,
        126,
        130,
        137,
        138,
        139,
        140,
        141,
        160,
        161,
        162,
        173,
        1000,
        1009,
        1256,
        1770,
        2026,
        3026,
        4026,
        133,
        181,
        190,
		2256,
		3256,
		4256,
		1258,
		3258,
        7004
    ];
    return uiids.indexOf(uiid) !== -1;
}

/**
 * Temperature conversion
 * @param t Cel temperature
 * @returns Fahr temperature
 */
export function tempC2F(t: number) {
    return t * 9 / 5 + 32;
}

// Format number
export function fmtNum(n: number, m: number) {
    return parseFloat(n.toFixed(m));
}

/* -------- determine device type -------- */

// Pure switch or socket device
export function isPureSwOrSockDevice(uiid: number) {
    const uiids = [
        1,
        2,
        3,
        4,
        6,
        7,
        8,
        9,
        14,
        77,
        78,
        107,
        112,
        113,
        114,
        138,
        139,
        140,
        141,
        1009,
        1256,
		2256,
		3256,
		4256,
        7004
    ];
    return uiids.indexOf(uiid) !== -1;
}

// One channel simple protocol device
export function isOneChannelSPDevice(uiid: number) {
    const uiids = [
        1,
        5,
        6,
        14,
        15,
        32,
        181,
        7004
    ];
    return uiids.indexOf(uiid) !== -1;
}

// Multi-channel device (not include Dual R3)
export function isMultiChannelDevice(uiid: number) {
    const uiids = [
        2,
        3,
        4,
        7,
        8,
        9,
        113,
        114,
        130,
        139,
        140,
        141,
        133,
        161,
        162,
		2256,
		3256,
		4256
	];
    return uiids.indexOf(uiid) !== -1;
}

// 2 channels device (not include Dual R3)
export function isTwoChannelDevice(uiid: number) {
    const uiids = [
        2,
        7,
        113,
        139,
        133,
        161,
		2256
    ];
    return uiids.indexOf(uiid) !== -1;
}

// 3 channels device (not include Dual R3)
export function isThreeChannelDevice(uiid: number) {
    const uiids = [
        3,
        8,
        114,
        140,
        162,
		3256,
    ];
    return uiids.indexOf(uiid) !== -1;
}

// 4 channels device (not include Dual R3)
export function isFourChannelDevice(uiid: number) {
    const uiids = [
        4,
        9,
        141,
		4256
    ];
    return uiids.indexOf(uiid) !== -1;
}

// Device has refresh UI function
export function hasRefreshUiDevice(uiid: number) {
    const uiids = [
        5,
        32,
        126,
        130,
        181,
        190,
    ];
    return uiids.indexOf(uiid) !== -1;
}

// Device has stat tab
export function hasStatDevice(uiid: number) {
    const uiids = [
        5,
        32,
        126
    ];
    return uiids.indexOf(uiid) !== -1;
}

// 1 channel switch or socket with simple protocol
export function isOneChannelSwOrSockSPDevice(uiid: number) {
    const uiids = [
        1,
        6,
        14,
        1009,
        1256,
        7004
    ];
    return uiids.indexOf(uiid) !== -1;
}

// 1 channel switch or socket with complex protocol
export function isOneChannelSwOrSockCPDevice(uiid: number) {
    const uiids = [
        77,
        78,
        107,
        112,
        138,
    ];
    return uiids.indexOf(uiid) !== -1;
}

// light device
export function isLightDevice(uiid: number) {
    const uiids = [
        22,
        59,
		44,
        103,
        104,
        137,
        173,
		1258,
		3258
    ];
    return uiids.indexOf(uiid) !== -1;
}

export function isZigbeeDevice(uiid: number) {
    const uiids = [
        1000,
        1009,
        1256,
        1770,
        2026,
        3026,
        4026,
		2256,
		3256,
		4256,
		1258,
		3258,
        7004
    ];
    return uiids.indexOf(uiid) !== -1;
}

export function isDeviceOnline(device:any) {
	const { uiid, online } = device;
	if (uiid === 102) {
		// WiFi 门磁判断在线或不在线的逻辑不同于其它设备
		const { params } = device;
		const now = Date.now();
		const timeout = 7500000;
		let { actionTime, lastUpdateTime } = params;
		actionTime = new Date(actionTime).valueOf();
		lastUpdateTime = new Date(lastUpdateTime).valueOf();
		return (now - actionTime < timeout) || (now - lastUpdateTime < timeout);
	} else {
		return online;
	}
}