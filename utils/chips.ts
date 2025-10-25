import { colorWithOpacity, getColor } from './colors';

export function chip(category: string, scheme: 'light' | 'dark') {
    if (scheme === 'dark') {
        switch (category) {
            case 'Subscriptions':
                return {
                    bg: colorWithOpacity('accentBlueGrey', 0.18),
                    border: colorWithOpacity('accentBlueGrey', 0.35),
                    text: getColor('frost'),
                };
            case 'Loans & Debt':
                return {
                    bg: colorWithOpacity('accentPink', 0.18),
                    border: colorWithOpacity('accentPink', 0.35),
                    text: getColor('frost'),
                };
            case 'Housing':
                return {
                    bg: colorWithOpacity('accentTeal', 0.18),
                    border: colorWithOpacity('accentTeal', 0.35),
                    text: getColor('frost'),
                };
            case 'Transport':
                return {
                    bg: colorWithOpacity('accentMint', 0.18),
                    border: colorWithOpacity('accentMint', 0.35),
                    text: getColor('frost'),
                };
            default:
                return {
                    bg: colorWithOpacity('surface', 0.08),
                    border: colorWithOpacity('surface', 0.18),
                    text: getColor('frost'),
                };
        }
    }
    switch (category) {
        case 'Subscriptions':
            return { bg: getColor('accentBlueGrey'), border: getColor('accentBlueGreyBorder'), text: getColor('navy') };
        case 'Loans & Debt':
            return { bg: getColor('accentPink'), border: getColor('accentPinkBorder'), text: getColor('accentPinkText') };
        case 'Housing':
            return { bg: getColor('accentTeal'), border: getColor('accentTealBorder'), text: getColor('navy') };
        case 'Transport':
            return { bg: getColor('accentMint'), border: getColor('accentMintBorder'), text: getColor('navy') };
        default:
            return { bg: getColor('slateSurface'), border: getColor('slateBorder'), text: getColor('slateText') };
    }
}
