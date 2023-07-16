import {Pressable, Text, View, Modal, FlatList, TextInput} from 'react-native';
import React, {useState} from 'react';
import {COLORS, TYPES} from '../../../constants';
import {ButtonImage} from '../Button';
import {icons} from '../../../assets';
import countriesData from 'countries-phone-masks';
import {styles} from './styles';

// Import countries
const countries: TYPES.Country[] = countriesData as TYPES.Country[];

const DropdownItem: React.FC<TYPES.DropdownItemProps> = React.memo(
  ({item, handleOptionPress}) => {
    return (
      <Pressable onPress={() => handleOptionPress(item)}>
        <View style={styles.dropdown__item}>
          <Text style={styles.dropdown__item__name}>{item.name}</Text>
          <Text style={styles.dropdown__item__code}>{item.code}</Text>
        </View>
      </Pressable>
    );
  },
);

const renderItem: React.FC<TYPES.RenderItemProps> = ({
  item,
  handleOptionPress,
}) => <DropdownItem item={item} handleOptionPress={handleOptionPress} />;

const Dropdown: React.FC<TYPES.DropdownProps> = ({
  defaultValue = 'GB +44',
  borderColor,
  setMask,
  setDialingCode,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');

  const toggleDropdown = () => {
    //setIsOpen(!isOpen);
    setIsOpen(false);
    setFilter('');
  };

  const handleOptionPress = (item: TYPES.Country) => {
    setSelectedValue(item.iso + ' ' + item.code);
    setDialingCode(item.code);
    setMask(item.mask);
    setIsOpen(false);
  };

  const filteredData: TYPES.Country[] = countries.filter(
    (item: TYPES.Country) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <View style={styles.dropdown}>
      <Pressable
        style={[styles.dropdown__toggle, {borderBottomColor: borderColor}]}
        onPress={toggleDropdown}>
        <Text style={styles.dropdown__toggle__value}>{selectedValue}</Text>
        <ButtonImage
          imgUrl={icons.arrowDown}
          style={styles.dropdown__arrowDown}
        />
      </Pressable>
      <Modal visible={isOpen} transparent>
        <View style={styles.dropdown__search}>
          <ButtonImage
            imgUrl={icons.arrowLeft}
            style={styles.dropdown__arrowLeft}
            tintColor={COLORS.dark}
            onPress={toggleDropdown}
          />
          <TextInput
            value={filter}
            onChangeText={setFilter}
            placeholder="Search"
            autoCapitalize="words"
            style={styles.dropdown__textField}
          />
        </View>
        <FlatList
          overScrollMode={'never'}
          data={filteredData}
          keyExtractor={item => item.name}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => renderItem({item, handleOptionPress})}
          style={styles.dropdown__modal}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
        />
      </Modal>
    </View>
  );
};

export default Dropdown;
