import DatePicker from "@/components/DatePicker";
import { finContext } from "@/contexts/FinContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import TemplateTransactionItem from "../../components/TemplateTransactionItem";

const TemplatesScreen = () => {
  const { templateId: templateIdParamStr } = useLocalSearchParams();
  const templateId = templateIdParamStr ? parseInt(templateIdParamStr as string, 10) : null;
  const { templates, actions } = useContext(finContext);
  const openTemplate = templates.find(t => t.id === templateId);
  const [templateTransactions, setTemplateTransactions] = useState([]);
  const router = useRouter();
  const [date, setDate] = useState(new Date());

  const scaleFontSize = (fontSize) => {
    return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
  }

  const executeTemplateDialog = () => {
    Alert.alert(
      "Execute Template?",
      "Do you want to execute this template?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => executeTemplate() },
      ],
      { cancelable: true }
    );
  };

  const executeTemplate = () => {
    for (const transaction of templateTransactions) {
      const executionDate = transaction.executionDate ? transaction.executionDate : date;
      actions.addTransaction({ name: transaction.name, value: transaction.value, details: transaction.details, date: executionDate, categoryId: transaction.categoryId });
    }
  }

  useEffect(() => {
    (async () => {
      const fetchedTemplateTransactions = await actions.fetchTemplateTransactions(templateId);
      setTemplateTransactions(fetchedTemplateTransactions);
    })();
  }, [templateId]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: 'grey', paddingBottom: 5 }}>
        <Text style={{ color: 'white', fontSize: scaleFontSize(24) }}>{openTemplate?.name}</Text>
        <TouchableOpacity
          style={{ maxWidth: '15%' }}

          onPress={() => {
            router.navigate(`templates/${templateId}/transaction/create`);
          }}
        >
          <MaterialCommunityIcons name="book-plus" size={scaleFontSize(28)} color="white" />
        </TouchableOpacity>
      </View>

      <DatePicker
        style={styles.dateInput}
        date={date}
        setDate={setDate}
        setTime={false}
      />
      <FlatList
        data={templateTransactions}
        keyExtractor={item => `${item.id}`}
        renderItem={itemData => {
          return (<TemplateTransactionItem
            id={itemData.item.id}
            categoryId={itemData.item.categoryId}
            name={itemData.item.name}
            value={itemData.item.value}
            date={date}
            dateOffset={itemData.item.dateOffset}
            executionDate={itemData.item.executionDate ? itemData.item.executionDate : date}
            showBooking={router.navigate}
            setExecutionDate={(date: Date) => { itemData.item.executionDate = date; setTemplateTransactions([...templateTransactions]); }}
            onPress={() => { router.navigate(`templates/${templateId}/transaction/${itemData.item.id}/edit`); }}
          />);
        }}
      />

      <TouchableOpacity
        style={{ position: 'absolute', bottom: 30, right: 30, backgroundColor: '#1E90FF', padding: 15, borderRadius: 50, elevation: 5 }}

        onPress={() => {
          executeTemplateDialog();
        }}
      >
        <MaterialCommunityIcons name="clipboard-text-play-outline" size={scaleFontSize(28)} color="white" />
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
};

export default TemplatesScreen;