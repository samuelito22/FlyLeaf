import React, {FC} from 'react';
import {View, Text, Modal, TouchableNativeFeedback, Image} from 'react-native';
import {styles} from './styles';
import {TYPES} from '../../../../constants';
import {icons} from '../../../../assets';

const UploadSelectionAlert: FC<TYPES.UploadSelectionAlertProps> = ({
  visible,
  onClose,
  onGalleryPress,
  onTakePhotoPress,
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.bottomView}>
        <View style={styles.bottomView__modalView}>
          <TouchableNativeFeedback onPress={onGalleryPress}>
            <View style={styles.bottomView__modalView__buttonContainer}>
              <Image source={icons.gallery} style={styles.iconStyle} />
              <Text style={styles.bottomView__modalView__textStyle}>
                Upload from gallery
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={onTakePhotoPress}>
            <View style={styles.bottomView__modalView__buttonContainer}>
              <Image source={icons.camera} style={styles.iconStyle} />
              <Text style={styles.bottomView__modalView__textStyle}>
                Take a photo
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </Modal>
  );
};

export default UploadSelectionAlert;
