import theme from '@/app/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WebSortableList = ({ data, onReorder }: { data: any[], onReorder: (f: number, t: number) => void }) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View
          key={item.id}
          style={styles.webItem}
        >
          {index > 0 && <TouchableOpacity onPress={() => onReorder(index, index - 1)}>
            <MaterialCommunityIcons name="arrow-up" size={24} color={theme.colors.divider} />
          </TouchableOpacity>}
          {index < data.length - 1 && <TouchableOpacity onPress={() => onReorder(index, index + 1)}>
            <MaterialCommunityIcons name="arrow-down" size={24} color={theme.colors.divider} />
          </TouchableOpacity>}
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
  },
  webItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 15,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  itemText: {
    color: theme.colors.primary_text,
    fontSize: 16,
    marginLeft: 10,
  },
  dropTarget: {
    borderTopWidth: 3,
    borderTopColor: '#00FF00', // Shows a green line where item will land
    marginTop: 2,
  }
});

export default WebSortableList;