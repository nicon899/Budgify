import React from 'react';
import { Text, Dimensions } from 'react-native';

const scaleFontSize = (fontSize) => {
    return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
}

const TextItem = props => {
    return (
    <Text style={[props.style, {fontSize: scaleFontSize(props.fontSize)}]}>{props.children}</Text>
    );
};

export default TextItem;
