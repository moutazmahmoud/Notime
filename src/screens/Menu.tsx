import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

interface Drink {
  id: number;
  name: string;
  price: number;
}

const drinksData: Drink[] = [
  { id: 1, name: 'Coffee', price: 3.0 },
  { id: 2, name: 'Tea', price: 2.5 },
  { id: 3, name: 'Juice', price: 4.0 },
  { id: 4, name: 'Soda', price: 1.5 },
];

const MenuPage: React.FC = () => {
  const renderItem = ({ item }: { item: Drink }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <FlatList
       data={drinksData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 18,
    color: '#888',
  },
});

export default MenuPage;
