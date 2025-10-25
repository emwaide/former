/* eslint-disable @typescript-eslint/no-var-requires */
type TailwindColors = Record<string, string>;

const tailwindConfig = require('../tailwind.config.js') as {
    theme?: { extend?: { colors?: TailwindColors } };
};

const palette = (tailwindConfig.theme?.extend?.colors ?? {}) as TailwindColors;

export type ColorToken = keyof typeof palette;

const ensureColor = (token: ColorToken) => {
    const value = palette[token];
    if (typeof value !== 'string') {
        throw new Error(`Color token "${String(token)}" is not defined as a string in tailwind.config.js`);
    }
    return value;
};

const hexToRgb = (hex: string) => {
    const normalized = hex.replace('#', '');
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const a = normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : undefined;
    return { r, g, b, a };
};

const rgbaString = (r: number, g: number, b: number, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`;

export const getColor = (token: ColorToken) => ensureColor(token);

export const colorWithOpacity = (token: ColorToken, alpha: number) => {
    const value = ensureColor(token);
    if (value.startsWith('#')) {
        const { r, g, b, a } = hexToRgb(value);
        const appliedAlpha = a !== undefined ? a * alpha : alpha;
        return rgbaString(r, g, b, appliedAlpha);
    }

    if (value.startsWith('rgb')) {
        const matches = value.match(/rgba?\(([^)]+)\)/);
        if (matches) {
            const [r, g, b, existingAlpha] = matches[1].split(',').map((component) => Number(component.trim()));
            const normalizedAlpha = Number.isFinite(existingAlpha) ? existingAlpha : 1;
            return rgbaString(r, g, b, normalizedAlpha * alpha);
        }
    }

    return value;
};

export const colors = palette;
