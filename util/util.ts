import { Dimensions } from "react-native";

export const scaleFontSize = (fontSize: number) => {
    return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
}