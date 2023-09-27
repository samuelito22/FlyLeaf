import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import {
  SafeContainer,
  Button,
  UploadSelectionAlert,
} from '../../../components';
import {
  usePreventBackHandler,
  useImagePicker,
  useDispatch,
} from '../../../utils/hooks';
import {RegisterActions} from '../../../redux';
import {TYPES, THEME_COLORS, ROUTES} from '../../../constants';
import {icons} from '../../../assets';
import {styles} from './styles';
import {NavigationProp} from '@react-navigation/native';
import {ActiveIndicator} from '../../../components/common/Loading';
import { useSelector } from 'react-redux';

const PictureUploadScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  const dispatch = useDispatch();

  const {
    email,
  } = useSelector((state: TYPES.AppState) => state.registerReducer);

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
        dispatch(RegisterActions.setPictures([imageOne, imageTwo]));

        dispatch(RegisterActions.setProgressBarValue(84));

        email ? navigation.navigate(ROUTES.REGISTER_MULTIPLE_QUESTIONS_SCREEN) : navigation.navigate(ROUTES.REGISTER_RECOVERY_EMAIL_SCREEN);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [valid, imageOne, imageTwo, dispatch]);
  
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
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_PICTURE_UPLOAD_SCREEN,
        }),
      ),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.container}>
        {isLoading && <ActiveIndicator />}
        <Text style={styles.requirement}>Optional</Text>
        <Text style={styles.title}>Add your first 2 pictures</Text>
        <View style={styles.galleryButtonsContainer}>
          <TouchableNativeFeedback
            onPress={() => {
              setAlertVisible(true);
              setIsFirstButtonPressed(true);
            }}>
            <View
              style={[
                styles.galleryButtonContainer,
                imageOne ? null : {padding: 23},
              ]}>
              <Image
                source={imageOne ? {uri: imageOne} : icons.plus}
                style={
                  imageOne
                    ? styles.imageInGalleryButtonContainer
                    : styles.galleryButtonImage
                }
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => setAlertVisible(true)}>
            <View
              style={[
                styles.galleryButtonContainer,
                imageTwo ? null : {padding: 23},
              ]}>
              <Image
                source={imageTwo ? {uri: imageTwo} : icons.plus}
                style={
                  imageTwo
                    ? styles.imageInGalleryButtonContainer
                    : styles.galleryButtonImage
                }
              />
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.alignNextButtonContainer}>
          <Button.PrimaryButton
            onPress={handlePress}
            style={{
              ...styles.nextButtonContainer,
              backgroundColor: valid
                ? THEME_COLORS.primary
                : THEME_COLORS.tertiary,
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
