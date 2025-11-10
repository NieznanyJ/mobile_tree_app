import React from 'react';
import { SvgXml } from 'react-native-svg';

interface SvgIconProps {
    icon: string; // surowa zawartość SVG-a
    color?: string;
    size?: number;
}

export default function SvgIcon({ icon, color = '#000000', size = 24 }: SvgIconProps) {
    // Zamień kolory w SVG-u na wymagany kolor
    const modifiedSvg = typeof icon === 'string'
        ? icon.replace(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|currentColor/gi, color)
        : '';

    return <SvgXml xml={modifiedSvg} width={size} height={size} />;
}