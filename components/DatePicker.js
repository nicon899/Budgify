import theme, { FONT_SIZE_LARGE, FONT_SIZE_REGULAR } from '@/app/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DatePicker = props => {
    const [show, setShow] = useState(false);

    const dateText = ""
        + (props.date.getDate() < 10 ? "0" + props.date.getDate() : props.date.getDate()) + "."
        + (props.date.getMonth() < 9 ? "0" + (props.date.getMonth() + 1) : (props.date.getMonth() + 1)) + "."
        + props.date.getFullYear();

    return (
        <View style={[styles.datepicker, props.style]}>
            {props.showArrow !== false && <TouchableOpacity
                style={styles.arrowLeft}
                onPress={() => {
                    let newDate = new Date(props.date.setDate(props.date.getDate() - 1));
                    props.setDate(newDate);
                }}
            >
                <Ionicons name="arrow-back" size={FONT_SIZE_REGULAR} color="white" />
            </TouchableOpacity>}

            {Platform.OS === 'web' && (
                <input type="date" value={props.date.toISOString().split('T')[0]} onChange={(e) => props.setDate(new Date(e.target.value))} />
            )}


            {Platform.OS !== 'web' && <TouchableOpacity style={styles.btn} onPress={() => setShow(true)}>
                <Ionicons style={{ marginRight: '10%' }} name="calendar" size={FONT_SIZE_LARGE} color={theme.colors.primary_text} />
                <View>
                    <Text style={{ color: 'white', fontSize: FONT_SIZE_LARGE, fontWeight: 'bold' }} >{dateText}</Text>
                </View>
            </TouchableOpacity>}

            {props.showArrow !== false && <TouchableOpacity
                style={styles.arrowRight}
                onPress={() => {
                    let newDate = new Date(props.date.setDate(props.date.getDate() + 1));
                    props.setDate(newDate);
                }}
            >
                <Ionicons name="arrow-forward" size={FONT_SIZE_REGULAR} color="white" />
            </TouchableOpacity>}

            {Platform.OS !== 'web' && show && (
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
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowLeft: {
        marginRight: 10
    },
    arrowRight: {
        marginLeft: 5
    }
});


export default DatePicker;
