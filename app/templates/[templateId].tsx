import { finContext } from "@/contexts/FinContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

export default function TemplatesScreen() {
  const { templateId: templateIdParamStr } = useLocalSearchParams();
  const templateId = templateIdParamStr ? parseInt(templateIdParamStr as string, 10) : null;
  const { templates, actions } = useContext(finContext);
  const openTemplate = templates.find(t => t.id === templateId);
  const [templateTransactions, setTemplateTransactions] = useState([]);
  const router = useRouter();

  const scaleFontSize = (fontSize) => {
    return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
  }

  useEffect(() => {
    const fetchedTemplateTransactions = actions.fetchTemplateTransactions(templateId);
    setTemplateTransactions(fetchedTemplateTransactions);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: 'white' }}>{openTemplate?.name}</Text>
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
