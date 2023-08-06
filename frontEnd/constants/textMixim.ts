import {FONTS} from './Fonts';

type FontStyles = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

const generateFontStyles = (
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  lineHeightPercentage: string,
  letterSpacing = 0,
): FontStyles => {
  let computedLineHeight = lineHeight;

  if (lineHeightPercentage !== '') {
    const percentageValue = parseFloat(lineHeightPercentage) / 100;
    computedLineHeight = fontSize * percentageValue;
  }

  return {
    fontFamily,
    fontSize,
    lineHeight: computedLineHeight,
    letterSpacing,
  };
};

export const themeText = {
  headingOne: generateFontStyles(FONTS.rubikBold, 32, 41.6, '130%'),
  headingTwo: generateFontStyles(FONTS.rubikBold, 24, 38.4, '160%'),
  headingThree: generateFontStyles(FONTS.rubikBold, 18, 21.3, '100%'),

  bodyBoldOne: generateFontStyles(FONTS.rubikBold, 40, 42, '88.61%', 1),
  bodyBoldTwo: generateFontStyles(FONTS.rubikBold, 24, 38.4, '160%'),
  bodyBoldThree: generateFontStyles(FONTS.rubikBold, 20, 23.7, '100%'),
  bodyBoldFour: generateFontStyles(FONTS.rubikBold, 18, 21.33, '100%'),
  bodyBoldFive: generateFontStyles(FONTS.rubikBold, 16, 18.96, '100%'),
  bodyBoldSix: generateFontStyles(FONTS.rubikBold, 14, 22.4, '160%'),
  bodyBoldSeven: generateFontStyles(FONTS.rubikBold, 12, 19.2, '160%'),

  bodyMediumOne: generateFontStyles(FONTS.rubikMedium, 40, 42, '88.61%', 1),
  bodyMediumTwo: generateFontStyles(FONTS.rubikMedium, 24, 36, '150%'),
  bodyMediumThree: generateFontStyles(FONTS.rubikMedium, 20, 30, '150%'),
  bodyMediumFour: generateFontStyles(FONTS.rubikMedium, 18, 21.33, '100%'),
  bodyMediumFive: generateFontStyles(FONTS.rubikMedium, 16, 24, '150%'),
  bodyMediumSix: generateFontStyles(FONTS.rubikMedium, 14, 16.59, '150%'),
  bodyMediumSeven: generateFontStyles(FONTS.rubikMedium, 12, 14.22, '100%'),

  bodyRegularOne: generateFontStyles(FONTS.rubikRegular, 40, 42, '88.61%', 1),
  bodyRegularTwo: generateFontStyles(FONTS.rubikRegular, 24, 36, '150%'),
  bodyRegularThree: generateFontStyles(FONTS.rubikRegular, 20, 30, '150%'),
  bodyRegularFour: generateFontStyles(FONTS.rubikRegular, 18, 27, '150%'),
  bodyRegularFive: generateFontStyles(FONTS.rubikRegular, 16, 18.96, '120%'),
  bodyRegularSix: generateFontStyles(FONTS.rubikRegular, 14, 21, '150%'),
  bodyRegularSeven: generateFontStyles(FONTS.rubikRegular, 12, 19.2, '160%'),
};
