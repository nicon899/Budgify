import DatePicker from "@/components/DatePicker";
import { finContext } from "@/contexts/FinContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
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

  useEffect(() => {
    (async () => {
      const fetchedTemplateTransactions = await actions.fetchTemplateTransactions(templateId);
      setTemplateTransactions(fetchedTemplateTransactions);
    })();
  }, [templateId]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: 'white' }}>{openTemplate?.name}</Text>

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
            showBooking={router.navigate}
          />);
        }}
      />

      <TouchableOpacity
        style={{ maxWidth: '15%' }}

        onPress={() => {
          router.navigate(`templates/${templateId}/transaction/create`);
        }}
      >
        <MaterialCommunityIcons name="book-plus" size={scaleFontSize(36)} color="white" />
      </TouchableOpacity>

    </View>
  );
}

const styles = {
  dateInput: {
    borderColor: 'grey',
    borderWidth: 1,
    color: 'white',
    borderRadius: 5,
  },
};

export default TemplatesScreen;