import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo * 1.5,
    width: Metrics.images.logo * 1.5,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  subText: {
    ...Fonts.style.h3,
      paddingVertical: Metrics.doubleBaseMargin,
      color: 'white',
      marginVertical: Metrics.smallMargin* 1.2,
      textAlign: 'center'
  }
})
