import React, { useContext, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';

import { useTranslation } from 'react-i18next';
import { components } from '../../components';
import { BASE_URL_IMG } from '../../config';
import { reviews, theme } from '../../constants';
import { useAppDispatch, useAppNavigation } from '../../hooks';
import BottomTabBar from '../../navigation/BottomTabBar';
import {
  useGetCarouselQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetRecommendationsQuery,
  useGetTrendingQuery
} from '../../store/slices/apiSlice';
import { setScreen } from '../../store/slices/tabSlice';
import { AuthContext } from '../../context/AuthContext';

const Home: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const {userInfor} = useContext(AuthContext);

  const {
    data: carouselData,
    error: carouselError,
    isLoading: carouselLoading,
  } = useGetCarouselQuery();

  const {
    data: trendinglData,
    error: trendinglError,
    isLoading: trendinglLoading,
  } = useGetTrendingQuery();

  const {
    data: recommendationsData,
    error: recommendationsError,
    isLoading: recommendationsLoading,
  } = useGetRecommendationsQuery(userInfor?userInfor.id:0);

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery();

  const carousel = carouselData instanceof Array ? carouselData : [];
  const categories = categoriesData instanceof Array ? categoriesData : [];

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const updateCurrentSlideIndex = (e: any): void => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / theme.sizes.width);
    setCurrentSlideIndex(currentIndex);
  };

  const renderStatusBar = () => {
    return <components.StatusBar />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        basket={true}
        user={true}
        userImage={true}
        userName={true}
      />
    );
  };

  const renderCarousel = () => {
    const renderCarouselImages = () => {
      return (
        <FlatList
          data={carousel}          
          onScroll={(e) => { updateCurrentSlideIndex(e) }}
          renderItem={({ item }) => (
            <components.Image
              source={{ uri: BASE_URL_IMG+item.image }}
              style={{ width: theme.sizes.width, height: 250, aspectRatio: 1.5 }}
            />
          )}
          pagingEnabled={true}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate={0}
          bounces={false}
          alwaysBounceHorizontal={false}
          automaticallyAdjustsScrollIndicatorInsets={true}
        />
      );
    };

    const renderIndicator = () => {
      if (carousel.length > 1) {
        return (
          <View
            style={{
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 20,
              flexDirection: 'row',
              alignSelf: 'center',
            }}
          >
            {carousel.map((image, index, array) => {
              return (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: currentSlideIndex === index ? 20 : 8,
                    borderRadius: 8 / 2,
                    backgroundColor: theme.colors.white,
                    opacity: currentSlideIndex === index ? 1 : 0.5,
                    borderColor:
                      currentSlideIndex === index
                        ? theme.colors.mainColor
                        : '#DBE9F5',
                    marginHorizontal: 4,
                  }}
                />
              );
            })}
          </View>
        );
      }
      return null;
    };

    if (carousel.length > 0) {
      return (
        <View style={{ marginBottom: 30 }}>
          {renderCarouselImages()}
          {renderIndicator()}
        </View>
      );
    }

    if (carousel.length === 0) {
      return null;
    }
  };

  const renderCategories = () => {
    if (categories.length > 0) {
      return (
        <View style={{ marginBottom: 30 }}>
          <components.BlockHeading
            title={t('categories')}
            onPress={() => {
              dispatch(setScreen('Menu'));
            }}
            containerStyle={{ marginHorizontal: 20, marginBottom: 14 }}
          />                    
          <FlatList
            data={categories}
            horizontal={true}
            contentContainerStyle={{ paddingLeft: 20 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            pagingEnabled={true}
            decelerationRate={0}
            renderItem={({ item }) => {
              const lastItem = categories[categories.length - 1];
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Menulist', {
                      category: item.name,
                    });
                  }}
                >
                  <components.ImageBackground
                    source={{ uri: BASE_URL_IMG+item.image }}
                    style={{
                      width: 90,
                      height: 90,
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      marginRight: item.id === lastItem.id ? 20 : 10,
                      justifyContent: 'flex-end',
                    }}
                    resizeMode='cover'
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.DMSans_400Regular,
                        fontSize: 10,
                        color: theme.colors.mainColor,
                      }}
                    >
                      {item.name}
                    </Text>
                  </components.ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      );
    }

    return null;
  };

  const renderTrending = () => {
    if (trendinglData && trendinglData.length > 0) {
      return (
        <View style={{ marginBottom: 30 }}>
          <components.BlockHeading
            title={t('trending')}
            containerStyle={{ marginHorizontal: 20, marginBottom: 14 }}
          />
          <FlatList
            data={trendinglData}
            horizontal={true}
            contentContainerStyle={{ paddingLeft: 20 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id+''}
            pagingEnabled={true}
            snapToInterval={theme.sizes.width - responsiveWidth(44.2)}
            decelerationRate={0}
            renderItem={({ item, index }) => {
              const lastItem = index === trendinglData.length - 1;
              return (
                <components.RecommendedItem item={item} lastItem={lastItem} />
              );
            }}
          />
        </View>
      );
    }
  };

  const renderRecommended = () => {
    if (recommendationsData && recommendationsData.products.length > 0) {
      const data = recommendationsData.products
      
      return (
        <View style={{ marginBottom: 30 }}>
          <components.BlockHeading
            title={t('recommended')}
            containerStyle={{ marginHorizontal: 20, marginBottom: 14 }}
          />
          <FlatList
            data={data}
            horizontal={true}
            contentContainerStyle={{ paddingLeft: 20 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id+'re'}
            pagingEnabled={true}
            snapToInterval={theme.sizes.width - responsiveWidth(44.2)}
            decelerationRate={0}
            renderItem={({ item, index }) => {
              const lastItem = index === data.length - 1;
              return (
                <components.RecommendedItem item={item} lastItem={lastItem} />
              );
            }}
          />
        </View>
      );
    }
  };

  const renderReviews = () => {
    const slice = reviews?.slice(0, 12);

    return (
      <View style={{ marginBottom: 20 }}>
        <components.BlockHeading
          title={t('review')}
          onPress={() => {
            navigation.navigate('Reviews');
          }}
          containerStyle={{ marginHorizontal: 20, marginBottom: 14 }}
        />
        <FlatList
          data={slice}
          horizontal={true}
          contentContainerStyle={{ paddingLeft: 20 }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled={true}
          snapToInterval={theme.sizes.width - 54}
          decelerationRate={0}
          renderItem={({ item, index }) => {
            const last = index === reviews.length - 1;
            return <components.ReviewItem item={item} last={last} />;
          }}
        />
      </View>
    );
  };

  const renderContent = () => {
    if (carouselLoading || categoriesLoading || productsLoading) {
      return <components.Loader />;
    }
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
      >
        {renderCarousel()}
        {renderCategories()}
        {renderTrending()}
        {renderRecommended()}
        {renderReviews()}
      </ScrollView>
    );
  };  

  const renderBottomTabBar = () => {
    return <BottomTabBar />;    
  };

  const renderHomeIndicator = () => {
    return <components.HomeIndicator />;
  };

  return (
    <components.SmartView>
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
      {renderBottomTabBar()}
      {renderHomeIndicator()}
    </components.SmartView>
  );
};

export default Home;
