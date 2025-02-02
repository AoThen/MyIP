import { createApp } from 'vue'
import i18n from './i18n';
import './style.css'
import App from './App.vue'
import store from './store';
// import Analytics from 'analytics';
// import googleAnalytics from '@analytics/google-analytics';

const app = createApp(App);

// const analytics = Analytics({
//     app: 'MyIP',
//     plugins: [
//         googleAnalytics({
//             measurementIds: ['G-TEYKKD81TL'],
//         })
//     ]
// });


// 窗口大小变化处理函数
function handleResize() {
    store.commit('setIsMobile', window.innerWidth < 768);
}

// 更新网页标题和元数据的函数
function updateMeta() {
    // 使用 i18n.global.t 来获取翻译后的值
    document.title = i18n.global.t('page.title');

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaKeywords) {
        metaKeywords.setAttribute('content', i18n.global.t('page.keywords'));
    }
    if (metaDescription) {
        metaDescription.setAttribute('content', i18n.global.t('page.description'));
    }
}

// 设置语言的函数
function setLanguageFromURL() {
    const searchParams = new URLSearchParams(window.location.search);
    const browserLanguage = navigator.language || navigator.userLanguage;
    const hl = searchParams.get('hl');
    if (hl && ['en', 'zh', 'fr'].includes(hl)) {
        i18n.global.locale = hl;
    } else if (!hl) {
        i18n.global.locale = browserLanguage.substring(0, 2);
    }
    updateMeta();
}

// 在应用启动时设置语言
setLanguageFromURL();

// 监听窗口大小变化
handleResize();
window.addEventListener('resize', handleResize);

// 监听 URL 变化
window.addEventListener('popstate', setLanguageFromURL);

// 启动 Google Analytics
// analytics.page();

app.use(store);
app.use(i18n);
app.config.globalProperties.$Lang = i18n.global.locale;
// app.config.globalProperties.$analytics = analytics;

// app.config.globalProperties.$trackEvent = function (category, action, label) {
//     analytics.track(action, {
//         category: category,
//         label: label,
//     });
// };

app.mount('#app');
