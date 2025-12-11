import { useRoute } from '@react-navigation/native';
import React, { PropsWithChildren, useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  ViewStyle,
  TextStyle,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { responsiveWidth } from 'react-native-responsive-dimensions';

import { text } from '../text';
import { svg } from '../assets/svg';
import { theme } from '../constants';
import Image from '../components/custom/Image';
import { setScreen } from '../store/slices/tabSlice';
import BurgerProfileItem from './BurgerProfileItem';
import { statusBarHeight, homeIndicatorHeight } from '../utils';
import { useAppNavigation, useAppSelector, useAppDispatch } from '../hooks';
import { AuthContext } from '../context/AuthContext';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import ChangeLanguage from './Language';

type Props = PropsWithChildren<{
  skip?: boolean;
  title?: string;
  phone?: boolean;
  basket?: boolean;
  goBack?: boolean;
  goHome?: boolean;
  filter?: boolean;
  search?: boolean;
  style?: ViewStyle;
  bottomLine?: boolean;
  burgerIcon?: boolean;
  user?: boolean;
  userName?: boolean;
  userImage?: boolean;
  skipOnPress?: () => void;
}>;

const Header: React.FC<Props> = ({
  skip,
  userName,
  title,
  style,
  phone,
  basket,
  search,
  goBack,
  goHome,
  filter,
  userImage,
  bottomLine,
  skipOnPress,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(true);
  const [faceID, setFaceID] = useState(false);

  const route = useRoute();

  const cart = useAppSelector((state) => state.cartSlice.list);
  const total = useAppSelector((state) => state.cartSlice.total);
  const { logout, userInfor } = useContext(AuthContext);
  const email = userInfor?.email;
  const [userAvatar, setUserAvatar] = useState('https://george-fx.github.io/dine-hub/10.jpg');
  useEffect(()=>{
    setUserAvatar(userInfor?.picture? userInfor.picture :'https://george-fx.github.io/dine-hub/10.jpg')
  },[userInfor])
  console.log(userAvatar, "AVT");

  const handleOnPress = () => {
    // if (cart.length > 0) {
      dispatch(setScreen('Order'));
      route.name === 'Shop' && navigation.navigate('TabNavigator');
      route.name === 'Product' && navigation.navigate('TabNavigator');
    // }
    // if (cart.length === 0) {
    //   Alert.alert('Your cart is empty', 'Please add some items to your cart', [
    //     {
    //       text: 'OK',
    //       onPress: () => console.log('OK Pressed'),
    //     },
    //   ]);
    // }
  };

  const renderUser = (): JSX.Element | null => {
    const touchableStyle: ViewStyle = {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      left: 0,
      paddingVertical: 12,
      paddingHorizontal: 20,
    };

    const textStyle: TextStyle = {
      marginLeft: 10,
      ...theme.fonts.H5,
      textTransform: 'capitalize',
    };

    if (userImage) {
      return (
        <TouchableOpacity
          style={{ ...touchableStyle }}
          onPress={() => {
            
            if(!userInfor){
              navigation.navigate("SignIn");
              return;
            }
            setShowModal(true);
          }}
        >
          <Image
            source={{ uri: userAvatar }}
            style={{
              width: 22,
              height: 22,
              borderRadius: 20 / 2,
            }}
          />
          {userName && <Text style={{ ...textStyle }}>{userInfor?.user_name}</Text>}
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderBurgerUser = (): JSX.Element | null => {
    return (
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#DBE9F5',
          marginBottom: 20,
        }}
      >
        <Image
          source={{ uri: userInfor?.picture? userInfor.picture :'https://george-fx.github.io/dine-hub/10.jpg' }}
          style={{
            width: responsiveWidth(14),
            aspectRatio: 1,
            borderRadius: responsiveWidth(20) / 2,
          }}
        />
        <View style={{ marginLeft: 14 }}>
          <Text
            style={{
              ...theme.fonts.DMSans_500Medium,
              fontSize: 14,
              lineHeight: 14 * 1.2,
              marginBottom: 4,
            }}
          >
            {userInfor?.user_name}
          </Text>
          <Text
            style={{ ...theme.fonts.textStyle_14, color: theme.colors.textColor }}
          >
            {email}
          </Text>
        </View>
      </View>
    );
  };

  const renderCloseButton = (): JSX.Element | null => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          marginTop: statusBarHeight(),
          right: -responsiveWidth(11),
        }}
        onPress={() => setShowModal(false)}
      >
        <svg.CloseSvg />
      </TouchableOpacity>
    );
  };

  const renderBurgerContent = (): JSX.Element | null => {
    return (
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>        
        <BurgerProfileItem
          text={t('personal_info')}
          onPress={() => {
            setShowModal(false);
            navigation.navigate('EditProfile');
          }}
        />
        <BurgerProfileItem
          text={t('my_orders')}
          onPress={() => {
            setShowModal(false);
            navigation.navigate('OrderHistory');
          }}
        />
        <BurgerProfileItem
          text={t('promodecodes_gifts')}
          onPress={() => {
            setShowModal(false);
            navigation.navigate('Promocodes');
          }}
        />
        <BurgerProfileItem
          text={t('wallet')}
          onPress={() => {
            setShowModal(false);
            navigation.navigate('Wallet');
          }}
        />
        <BurgerProfileItem
          text={t('notification')}
          onPress={() => {
            setNotification(!notification);
          }}
          disabled={notification}
        />
        <BurgerProfileItem
          text={'Face ID'}
          onPress={() => {
            setFaceID(!faceID);
          }}
          disabled={faceID}
        />
        <BurgerProfileItem
          text={t('chat_support')}
          onPress={() => {
            setShowModal(false);
            navigation.navigate('Chat');
          }}
        />
        <BurgerProfileItem
          text={t('sign_out')}
          onPress={() => {
            setShowModal(false);
            logout();
          }}
        />
        <ChangeLanguage/>
      </ScrollView>
    );
  };

  const renderBurgerProfile = (): JSX.Element | null => {
    return (
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        style={{ margin: 0 }}
        animationIn='slideInLeft'
        animationOut='slideOutLeft'
        animationInTiming={500}
        animationOutTiming={500}
        deviceWidth={theme.sizes.height}
        deviceHeight={theme.sizes.height}
      >
        <View
          style={{
            width: responsiveWidth(74),
            height: theme.sizes.height,
            backgroundColor: theme.colors.white,
            paddingTop: statusBarHeight(),
            paddingBottom: homeIndicatorHeight(),
          }}
        >
          {renderBurgerUser()}
          {renderBurgerContent()}
          {renderCloseButton()}
        </View>
      </Modal>
    );
  };

  const renderGoBack = (): JSX.Element | null => {
    if (goBack && navigation.canGoBack()) {
      return (
        <View style={{ position: 'absolute', left: 0 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            onPress={() => navigation.goBack()}
          >
            <svg.GoBackSvg />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderGoHome = (): JSX.Element | null => {
    if (goHome && navigation.canGoBack()) {
      return (
        <View style={{ position: 'absolute', left: 0 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            onPress={() => navigation.navigate("Home")}
          >
            <svg.GoBackSvg />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderSkipText = (): JSX.Element | null => {
    if (skip) {
      return (
        <TouchableOpacity
          style={{
            right: 0,
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          onPress={skipOnPress}
        >
          <Text
            style={{
              // ...theme.fonts.Lato_700Bold,
              fontSize: 14,
              lineHeight: 14 * 1.7,
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderTitle = (): JSX.Element | null => {
    const titleStyle: TextStyle = {
      ...theme.fonts.DMSans_400Regular,
      fontSize: 16,
      color: theme.colors.mainColor,
    };

    if (title) {
      return (
        <Text style={{ ...titleStyle }} numberOfLines={1}>
          {title}
        </Text>
      );
    }

    return null;
  };

  const renderSearch = (): JSX.Element | null => {
    if (search) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: theme.sizes.width - 190,
            marginRight: 60,
          }}
          onPress={() => navigation.navigate('Search')}
        >
          <View style={{ marginRight: 7 }}>{/* <svg.SearchSvg /> */}</View>
          <text.T14>search</text.T14>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderFilter = (): JSX.Element | null => {
    if (filter) {
      return (
        <View style={{ position: 'absolute', right: 0 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            onPress={() => navigation.navigate('Filter')}
          >
            {/* <svg.FilterSvg /> */}
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderBasket = (): JSX.Element | null => {
    if (basket) {
      return (
        <TouchableOpacity
          onPress={handleOnPress}
          style={{
            right: 0,
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              height: 22,
              borderRadius: 11,
              paddingHorizontal: 4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.mainTurquoise,
            }}
          >
            <Text
              style={{
                color: theme.colors.white,
                ...theme.fonts.DMSans_700Bold,
                fontSize: 10,
              }}
            >
              {cart.length > 0 ? `$${total}` : '$0'}
            </Text>
          </View>
          <svg.CartSvg />
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderPhone = (): JSX.Element | null => {
    if (phone) {
      return (
        <TouchableOpacity
          onPress={()=>{showMessage({
            message: "0359100154",
            description: `Call if you need`,
            type: 'info',
            icon: 'info',
            autoHide: false,
          })}}
          style={{
            right: 0,
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <svg.PhoneCallSvg />
        </TouchableOpacity>
      );
    }

    return null;
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderBottomColor: bottomLine ? '#DBE9F5' : 'transparent',
    borderBottomWidth: bottomLine ? 1 : 0,
    ...style,
  };

  return (
    <View style={{ ...containerStyle }}>
      {renderUser()}
      {renderGoBack()}
      {renderTitle()}
      {renderSkipText()}
      {renderGoHome()}
      {renderFilter()}
      {renderSearch()}
      {renderBasket()}
      {renderPhone()}
      {renderBurgerProfile()}
    </View>
  );
};

export default Header;
