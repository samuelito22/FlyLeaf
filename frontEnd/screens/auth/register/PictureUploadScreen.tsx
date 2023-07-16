import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import {
  SafeContainer,
  Button,
  UploadSelectionAlert,
  LoadingSpinner,
} from '../../../components';
import {
  usePreventBackHandler,
  useImagePicker,
  useDispatch,
} from '../../../utils/hooks';
import {
  setIsRegisterCompleted,
  setPictures,
  setProgressBarValue,
} from '../../../redux';
import {TYPES, COLORS, ROUTES} from '../../../constants';
import {icons} from '../../../assets';
import {styles} from './styles';
import {NavigationProp} from '@react-navigation/native';

const PictureUploadScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  const dispatch = useDispatch();

  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isFirstButtonPressed, setIsFirstButtonPressed] = useState(false);
  const [imageOne, setImageOne] = useState<string | null>(null);
  const [imageTwo, setImageTwo] = useState<string | null>(null);
  const [valid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {handleCameraButtonPress, handleGalleryButtonPress} = useImagePicker();

  usePreventBackHandler();

  const handlePress = useCallback(async () => {
    if (valid && imageOne && imageTwo) {
      setIsLoading(true);
      try {
        dispatch(setPictures([imageOne, imageTwo]));

        dispatch(setProgressBarValue(84));

        navigation.navigate(ROUTES.REGISTER_RECOVERY_EMAIL_SCREEN);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [valid, imageOne, imageTwo, dispatch]);

  const handleSkipPress = () => {
    dispatch(setProgressBarValue(84));
    navigation.navigate(ROUTES.REGISTER_RECOVERY_EMAIL_SCREEN);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleImageSelection = useCallback(
    async (getImage: () => Promise<string | undefined>) => {
      setIsLoading(true);
      const result = await getImage();
      setIsLoading(false);

      setAlertVisible(false);

      if (result) {
        isFirstButtonPressed ? setImageOne(result) : setImageTwo(result);
        setIsFirstButtonPressed(false);
      }
    },
    [isFirstButtonPressed],
  );

  const handleGalleryPress = () =>
    handleImageSelection(handleGalleryButtonPress);
  const handleTakePhotoPress = () =>
    handleImageSelection(handleCameraButtonPress);

  useEffect(() => {
    setValid(!!(imageOne && imageTwo));
  }, [imageOne, imageTwo]);

  useEffect(
    () => dispatch(setIsRegisterCompleted({status: false, currentScreen: ROUTES.REGISTER_PICTURE_UPLOAD_SCREEN})),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.container}>
        {isLoading && <LoadingSpinner />}
        <TouchableOpacity
          style={styles.skipContainer}
          onPress={handleSkipPress}>
          <Text style={styles.skipContainerText}>SKIP</Text>
        </TouchableOpacity>
        <Text style={styles.requirement}>Optional</Text>
        <Text style={styles.title}>Add your first 2 photos</Text>
        <View style={styles.galleryButtonsContainer}>
          <TouchableNativeFeedback
            onPress={() => {
              setAlertVisible(true);
              setIsFirstButtonPressed(true);
            }}>
            <View style={styles.shadowContainer}>
              <View
                style={[
                  styles.galleryButtonContainer,
                  imageOne ? null : {padding: 23},
                ]}>
                <Image
                  source={imageOne ? {uri: imageOne} : icons.uploadPicture}
                  style={
                    imageOne
                      ? styles.imageInGalleryButtonContainer
                      : styles.galleryButtonImage
                  }
                />
              </View>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => setAlertVisible(true)}>
            <View style={styles.shadowContainer}>
              <View
                style={[
                  styles.galleryButtonContainer,
                  imageTwo ? null : {padding: 23},
                ]}>
                <Image
                  source={imageTwo ? {uri: imageTwo} : icons.uploadPicture}
                  style={
                    imageTwo
                      ? styles.imageInGalleryButtonContainer
                      : styles.galleryButtonImage
                  }
                />
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.alignNextButtonContainer}>
          <Button.PrimaryButton
            onPress={handlePress}
            style={{
              ...styles.nextButtonContainer,
              backgroundColor: valid ? COLORS.primary : COLORS.gray,
            }}>
            CONTINUE
          </Button.PrimaryButton>
        </View>
        <Text style={styles.extraInformation}>
          Upload a high-quality photo of yourself. On FlyLeaf, this photo
          remains private until meaningful interaction occurs
        </Text>
        <UploadSelectionAlert
          visible={isAlertVisible}
          onClose={handleAlertClose}
          onGalleryPress={handleGalleryPress}
          onTakePhotoPress={handleTakePhotoPress}
        />
      </View>
    </SafeContainer>
  );
};

export default PictureUploadScreen;
