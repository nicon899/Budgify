import theme from "@/app/theme";
import DatePicker from "@/components/DatePicker";
import { useApi } from "@/hooks/useApi";
import { Template } from "@/types/Template";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TemplateTransactionItem from "../../../../components/TemplateTransactionItem";
import alert from "../../../../components/alert";

const TemplatesScreen = () => {
    const { templateId: templateIdParamStr } = useLocalSearchParams();
    const templateId = templateIdParamStr ? parseInt(templateIdParamStr as string, 10) : null;
    const [template, setTemplate] = useState<Template | null>(null);
    const [nameChanged, setNameChanged] = useState(false)
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [name, setName] = useState('');
    const { getTemplateById, createTransaction, updateTemplate } = useApi()
    const isFocused = useIsFocused();

    const executeTemplateDialog = () => {
        alert(
            "Execute Template?",
            "Do you want to execute this template?",
            [
                { text: "Cancel", style: "cancel", onPress: () => { } },
                { text: "OK", onPress: () => executeTemplate() },
            ],
            { cancelable: true }
        );
    };

    const executeTemplate = () => {
        if (!template || template.templateTransactions.length <= 0) return
        for (const transaction of template.templateTransactions) {
            const executionDate = transaction.executionDate ? transaction.executionDate : date;
            createTransaction({ name: transaction.name ? transaction.name : name, value: transaction.value, detail: transaction.detail, date: executionDate, categoryId: transaction.categoryId });
        }
    }

    useEffect(() => {
        if (templateId == null) return;
        (async () => {
            const fetchedTemplate = await getTemplateById(templateId);
            setTemplate(fetchedTemplate);
        })();
    }, [templateId, isFocused]);

    return (
        <View style={styles.screen}>

            {nameChanged && <TouchableOpacity
                style={{ maxWidth: '15%' }}
                onPress={() => {
                    if (!template) return
                    updateTemplate(template)
                    setNameChanged(false)
                }}
            >
                <MaterialCommunityIcons name="content-save-alert" size={theme.fontSize.large} color="white" />
            </TouchableOpacity>}

            <Text style={styles.label}>Name</Text>
            <TextInput
                placeholder='Template Name'
                placeholderTextColor="grey"
                style={[styles.input]}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={template?.name}
                onChangeText={(input) => { setTemplate({ ...template, name: input }); setNameChanged(true) }}
            />

            <Text style={styles.label}>Datum</Text>
            <DatePicker
                style={styles.dateInput}
                date={date}
                setDate={setDate}
                setTime={false}
            />

            <Text style={styles.label}>Datum</Text>
            <TextInput
                placeholder='Default Name'
                placeholderTextColor="grey"
                style={[styles.input]}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />

            <Text style={styles.label}>Transactions</Text>
            {template && <FlatList
                style={styles.categoryList}
                data={template.templateTransactions}
                keyExtractor={item => `${item.id}`}
                renderItem={itemData => {
                    return (<TemplateTransactionItem
                        id={itemData.item.id}
                        categoryId={itemData.item.categoryId}
                        name={itemData.item.name ? itemData.item.name : name}
                        value={itemData.item.value}
                        date={date}
                        dateOffset={itemData.item.dateOffset}
                        executionDate={itemData.item.executionDate ? itemData.item.executionDate : date}
                        showBooking={router.navigate}
                        setExecutionDate={(date: Date) => { itemData.item.executionDate = date; setTemplate({ ...template }); }}
                        onPress={() => { router.navigate(`templates/${templateId}/transaction/${itemData.item.id}/edit`); }}
                    />);
                }}
            />}

            <View style={styles.transBarLeft}>
                <TouchableOpacity
                    style={styles.transButton}
                    onPress={() => {
                        router.navigate(`templates/${templateId}/transaction/create`);
                    }}
                >
                    <MaterialCommunityIcons name="book-plus" size={theme.fontSize.xlarge} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.transButton}

                    onPress={() => {
                        executeTemplateDialog();
                    }}
                >
                    <MaterialCommunityIcons name="clipboard-text-play-outline" size={theme.fontSize.xlarge} color="white" />
                </TouchableOpacity>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        backgroundColor: 'black',
        paddingTop: 20,
        flex: 1,
    },
    header: {
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        paddingBottom: 5
    },
    input: {
        width: '80%',
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.primary_text,
        borderRadius: 10,
        padding: 10,
    },
    label: {
        color: theme.colors.secondary_text,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 5,
        marginTop: 15,
    }, dateInput: {
        width: '80%',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
        padding: 10,
    },
    transBarLeft: {
        position: 'absolute',
        bottom: 30, // Abstand vom unteren Bildschirmrand
        right: 30,  // Abstand vom rechten Rand,
        flexDirection: 'row',
        gap: 15,
    },
    transBar: {
        position: 'absolute',
        bottom: 30, // Abstand vom unteren Bildschirmrand
        right: 30,  // Abstand vom rechten Rand
    },
    transButton: {
        width: 60,
        height: 60,
        borderRadius: 30, // Hälfte der Breite/Höhe für einen Kreis
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // für Android Schatten
        shadowColor: '#000', // für iOS Schatten
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    transButtonText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 32,
    },
       categoryList: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginTop: 10,
        paddingVertical: 10,
        width: '80%',
    },
});

export default TemplatesScreen;