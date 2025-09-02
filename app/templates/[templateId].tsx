import { finContext } from "@/contexts/FinContext";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function TemplatesScreen() {
  const { templateId: templateIdParamStr } = useLocalSearchParams();
  const templateId = templateIdParamStr ? parseInt(templateIdParamStr as string, 10) : null;
  const { templates } = useContext(finContext);
  const openTemplate = templates.find(t => t.id === templateId);


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: 'white' }}>{openTemplate?.name}</Text>
    </View>
  );
}
