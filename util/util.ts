import { Dimensions } from "react-native";

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
    const dateStr = date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
    return dateStr;
}