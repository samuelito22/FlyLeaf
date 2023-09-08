import {StackCardInterpolationProps} from '@react-navigation/stack';

export const cardSlideLeftAnimation = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
        {
          translateX: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -layouts.screen.width],
              })
            : 0,
        },
      ],
    },
  };
};

export const cardSlideUpAnimation = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps) => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
        {
          translateY: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -layouts.screen.height],
              })
            : 0,
        },
      ],
    },
  };
};



export const cardSlideDownAnimation = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps) => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-layouts.screen.height, 0],
          }),
        },
        {
          translateY: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, layouts.screen.height],
              })
            : 0,
        },
      ],
    },
  };
};

