export const NAVY = '#060826';
export const ACC_TEAL = '#A8DADC';
export const ACC_OFFWHITE = '#eef1faff';
export const ACC_PINK = '#FFE3EC';
export const ACC_BLUEGREY = '#DDE7F2';
export const ACC_MINT = '#C7F9CC';

export const rgba = (hex: string, a: number) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};
