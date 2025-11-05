import theme from "@/app/theme";
import DatePicker from "@/components/DatePicker";
import { useApi } from "@/hooks/useApi";
import { Template } from "@/types/Template";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
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
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: 'grey', paddingBottom: 5 }}>
                <TextInput
                    placeholder='Template Name'
                    placeholderTextColor="grey"
                    style={[styles.input, { marginBottom: 25 }]}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={template?.name}
                    onChangeText={(input) => { setTemplate({ ...template, name: input }); setNameChanged(true) }}
                />
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
                <TouchableOpacity
                    style={{ maxWidth: '15%' }}
                    onPress={() => {
                        router.navigate(`templates/${templateId}/transaction/create`);
                    }}
                >
                    <MaterialCommunityIcons name="book-plus" size={theme.fontSize.large} color="white" />
                </TouchableOpacity>
            </View>

            <DatePicker
                style={styles.dateInput}
                date={date}
                setDate={setDate}
                setTime={false}
            />

            <TextInput
                placeholder='Default Name'
                placeholderTextColor="grey"
                style={[styles.input, { marginBottom: 25 }]}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />

            {template && <FlatList
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

            <TouchableOpacity
                style={{ position: 'absolute', bottom: 30, right: 30, backgroundColor: '#1E90FF', padding: 15, borderRadius: 50, elevation: 5 }}

                onPress={() => {
                    executeTemplateDialog();
                }}
            >
                <MaterialCommunityIcons name="clipboard-text-play-outline" size={theme.fontSize.xlarge} color="white" />
            </TouchableOpacity>


        </View>
    );
}

const styles = {
    dateInput: {
        borderColor: 'grey',
        color: 'white',
        borderRadius: 5,
    },
    input: {
        width: '75%',
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white',
        borderRadius: 5,
    },
};

export default TemplatesScreen;