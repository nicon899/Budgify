import { Dimensions } from "react-native";

export const FONT_SIZE_MINI = 6;
export const FONT_SIZE_SMALL = 12;
export const FONT_SIZE_REGULAR = 14;
export const FONT_SIZE_LARGE = 26;
export const FONT_SIZE_XLARGE = 30;
export const FONT_SIZE_XXLARGE = 32;
export const FONT_SIZE_XXXLARGE = 36;
export const CURRENCY_SYMBOL = '€';

export const scaleFontSize = (fontSize: number) => {
    return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
}

export const getDateText = (date: Date) => {
    const dateText = ""
        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "."
        + (date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "."
        + date.getFullYear();
    return dateText;
}

export const getLongDateText = (date: Date) => {
    const dateStr = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
    return dateStr;
}