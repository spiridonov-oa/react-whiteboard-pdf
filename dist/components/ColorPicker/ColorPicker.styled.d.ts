/// <reference types="react" />
interface ColorPickerProps {
    size?: number;
}
interface ColorLabelProps {
    size?: number;
    color?: string;
}
export declare const ColorPickerS: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, ColorPickerProps>> & string;
export declare const ColorLabelS: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, ColorLabelProps>> & string;
export declare const HiddenColorInputS: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, never>> & string;
export {};
