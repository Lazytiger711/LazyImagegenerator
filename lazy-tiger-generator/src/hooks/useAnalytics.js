import { useCallback } from 'react';

export function useAnalytics() {
    const trackEvent = useCallback((eventName, eventParams = {}) => {
        // 개발자 모드가 활성화되어 있으면 추적하지 않음
        const isDevMode = localStorage.getItem('dev_mode') === 'true';

        if (isDevMode) {
            console.log('🚫 개발자 모드: 이벤트 추적 안 함 ->', eventName, eventParams);
            return;
        }

        if (window.gtag) {
            window.gtag('event', eventName, eventParams);
            console.log('✅ GA 이벤트 전송:', eventName, eventParams);
        }
    }, []);

    return { trackEvent };
}
