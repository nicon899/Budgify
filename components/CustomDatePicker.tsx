import theme, { FONT_SIZE_SMALL } from '@/app/theme';
import { getLongDateText } from '@/util/util';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomDatePicker = props => {
    const [show, setShow] = useState(false);

    return (
        <View style={[styles.datepicker, props.style]}>
            <TouchableOpacity style={props.style_btn} onPress={() => setShow(true)}>
                <View>
                    <Text style={{ color: theme.colors.primary_text, fontSize: FONT_SIZE_SMALL, fontWeight: 'bold' }} >{getLongDateText(props.date)}</Text>
                </View>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={props.date}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                        setShow(false);
                        if (date != undefined) {
                            props.setDate(date);
                        }
                    }}
                />
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    datepicker: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrow: {
        marginHorizontal: 5
    }
});


export default CustomDatePicker;
