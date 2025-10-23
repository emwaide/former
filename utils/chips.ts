import { ACC_BLUEGREY, ACC_MINT, ACC_PINK, ACC_TEAL, NAVY, rgba } from './colors';

export function chip(category: string, scheme: 'light' | 'dark') {
    if (scheme === 'dark') {
        switch (category) {
            case 'Subscriptions': return { bg: rgba(ACC_BLUEGREY, 0.18), border: rgba(ACC_BLUEGREY, 0.35), text: '#E8ECF6' };
            case 'Loans & Debt': return { bg: rgba(ACC_PINK, 0.18), border: rgba(ACC_PINK, 0.35), text: '#E8ECF6' };
            case 'Housing': return { bg: rgba(ACC_TEAL, 0.18), border: rgba(ACC_TEAL, 0.35), text: '#E8ECF6' };
            case 'Transport': return { bg: rgba(ACC_MINT, 0.18), border: rgba(ACC_MINT, 0.35), text: '#E8ECF6' };
            default: return { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.18)', text: '#E8ECF6' };
        }
    }
    switch (category) {
        case 'Subscriptions': return { bg: ACC_BLUEGREY, border: '#C4D3E0', text: NAVY };
        case 'Loans & Debt': return { bg: ACC_PINK, border: '#F8C9D8', text: '#7A2E3A' };
        case 'Housing': return { bg: ACC_TEAL, border: '#90C9C7', text: NAVY };
        case 'Transport': return { bg: ACC_MINT, border: '#A6EFB1', text: NAVY };
        default: return { bg: '#F1F5F9', border: '#E2E8F0', text: '#334155' };
    }
}
