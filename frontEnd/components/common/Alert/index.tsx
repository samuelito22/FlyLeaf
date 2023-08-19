import React, {FC} from 'react';
import {View, Text, Modal, Pressable} from 'react-native';
import {styles} from './styles';
import {TYPES} from '../../../constants';

const CustomAlert: FC<TYPES.AlertProps> = ({
  title,
  message,
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.centeredView__modalView}>
          <Text style={styles.centeredView__modalView__title}>{title}</Text>
          <Text style={styles.centeredView__modalView__message}>{message}</Text>
          <View style={styles.centeredView__modalView__buttonContainer}>
            <Pressable
              onPress={onClose}>
              <Text style={styles.centeredView__modalView__textStyle}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}>
              <Text style={styles.centeredView__modalView__textStyle}>
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
