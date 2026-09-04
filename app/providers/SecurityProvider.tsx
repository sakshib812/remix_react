// app/providers/SecurityProvider.tsx — React Router v7 Client Security Provider
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SecureShield, SecurityAuditReport } from '@secureshield/web';

interface SecurityContextType {
    isReady: boolean;
    isSecure: boolean;
    trustScore: number;
    report: (SecurityAuditReport & { trustScore?: number }) | null;
    runScan: () => SecurityAuditReport | null;
}

const SecurityContext = createContext<SecurityContextType>({
    isReady: false,
    isSecure: true,
    trustScore: 100,
    report: null,
    runScan: () => null,
});

export function SecurityProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SecurityContextType>({
        isReady: false,
        isSecure: true,
        trustScore: 100,
        report: null,
        runScan: () => null,
    });

    useEffect(() => {
        // 🛡️ SSR safety: only execute in browser DOM
        if (typeof window === 'undefined') return;

        let isMounted = true;

        async function init() {
            try {
                const sdk = await SecureShield.init({
                    headerKey: 'enc:v1:bf004452ea9f2170fa2f0d75:b0d33433ad98d9648c17bafe4a45cdde:07ff537a3441f0059e1134d902233f',
                    encryptionKey: 'U1MEOYmR2f9ZePypUKvFtCGC7xHuXcJKsukRKEeHjYQ=',
                    initializationKey: 'INIT_7KPdVYpw2_tiSJbHAs4l4Y1fcXmGSBjY',
                    tenantId: 'TEN-SAKSHI-8743',
                    appId: 'ast_web_190308',
                    serverUrl: 'https://radiator-waving-cahoots.ngrok-free.dev/api/v1/telemetry/ingest',
                    environment: 'development',            // 🛡️ Set 'production' for live deployment
                    skipHandshake: true,
                    enableRuntimeIntegrityWatchdog: true,
                    enableStorageLeakScrubber: false,      // Kept false on initial boot
                    enablePrototypeFreezing: false,
                    enableDomLockoutOverlay: false,        // 🚀 Set false in dev to prevent black screen
                    blockRedirectUrl: null,

                    onTamperDetected: (apiName: string, reason?: string) => {
                        console.warn(`[SecureShield Tamper Alert] ${apiName}: ${reason}`);
                    }
                });

                // ⚡ Defer heavy evaluation to keep initial route rendering at 0ms
                setTimeout(async () => {
                    try {
                        const report = await sdk.evaluateSecurityState();
                        if (isMounted) {
                            setState({
                                isReady: true,
                                isSecure: report.verdict === 'SECURE',
                                trustScore: report.trustScore ?? 100,
                                report,
                                runScan: () => sdk.runScan(),
                            });
                            console.log('[SecureShield] React Router v7 Protected ✅. Trust Score:', report.trustScore);
                        }
                    } catch (e) {
                        console.warn('[SecureShield] Background evaluation notice:', e);
                    }
                }, 50);
            } catch (err) {
                console.error('[SecureShield] React Router v7 Init Error:', err);
            }
        }

        init();
        return () => { isMounted = false; };
    }, []);

    return (
        <SecurityContext.Provider value={state}>
            {children}
        </SecurityContext.Provider>
    );
}

export const useSecurity = () => useContext(SecurityContext);