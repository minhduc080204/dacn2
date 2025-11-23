import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from "expo-auth-session";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ENDPOINTS } from '../config';
import axiosInstance from '../config/axios/config';
import { setUser } from '../store/slices/userSlice';
import { showMessage } from '../utils';
import { setWishlist } from '../store/slices/wishlistSlice';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const AuthContext = createContext<any>(null);
WebBrowser.maybeCompleteAuthSession();
export const AuthProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem('userToken'));
  const [userInfor, setUserInfor] = useState<any | null>(null);
  const dispatch = useDispatch();

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'dinehub' });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "529775059239-o4e6r433b2l2uun0rj370arli9bgq516.apps.googleusercontent.com",
    androidClientId: "529775059239-7u57lvor7ovm67cp9c9buqqi6j7qarac.apps.googleusercontent.com",
    iosClientId: "529775059239-2l5jv9hmb3cvfaff3rdpllbj18p5vmki.apps.googleusercontent.com",
    redirectUri: redirectUri
  });

  useEffect(() => {
    if (userToken) {
      dispatch(
        setUser({
          user: userInfor,
          token: userToken,
        })
      );
      getWhishlistData();
    }
    handleSignInWithGoogle();
  }, [response]);

  const getWhishlistData = async () => {
    const resWishlist = await axiosInstance.get(ENDPOINTS.get.favorites);
    console.log("resWishlist", resWishlist);
    dispatch(setWishlist(resWishlist.data || []));
  }

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  async function handleSignInWithGoogle() {
    if (response?.type === "success") {
      await getUserInfo(response.authentication?.accessToken)
    } else {
      console.log("handleSignInWithGoogle", response);
    }
  };

  const getUserInfo = async (token: any) => {
    console.log("BUMMMM");
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userRes = await response.json();
      const email = userRes.email;
      const user_name = userRes.name;
      const password = "alksnvksvnkdjsnv;ksndvknknajshkca";
      const picture = userRes.picture;

      try {
        const res = await axiosInstance.post(ENDPOINTS.auth.check, { email });
 
        console.log("ressssss", res);
        if (res.data.user.id) {
          const token = res.data.access_token;

          const user = {
            id: res.data.user.id,
            user_name: user_name,
            email: email,
            picture: picture,
          }
          console.log(user);

          setUserToken(token);
          setUserInfor(user);
          dispatch(
            setUser({
              user: user,
              token: token,
            })
          );
          await AsyncStorage.setItem('userInfor', JSON.stringify(user));
          await AsyncStorage.setItem('userToken', token);

          getWhishlistData();
        } else {
          register(user_name, email, password, password, picture);
        }
      } finally {
        setIsLoading(false);
      }

    } catch (error) {
      console.log("fetch", error);
    }
  }

  // const loginGoogleWeb = useGoogleLogin({
  //   onSuccess: async (tokenResponse: TokenResponse) => {
  //     const accessToken = tokenResponse.access_token; // Lấy access_token

  //     if (accessToken) {
  //       try {
  //         // Gửi yêu cầu đến Google UserInfo API để lấy thông tin người dùng
  //         const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         });

  //         if (!userInfoResponse.ok) {
  //           throw new Error('Failed to fetch user info');
  //         }

  //         const userProfile = await userInfoResponse.json();

  //         const email = userProfile.email;
  //         const user_name = userProfile.name;
  //         const password = "alksnvksvnkdjsnv;ksndvknknajshkca";

  //         try {
  //           setIsLoading(true);
  //           const res = await axiosInstance.post(ENDPOINTS.auth.check, { email });

  //           if (res.data.id) {
  //             register(user_name, email, password, password);
  //           } else {

  //             const token = res.data.access_token;
  //             const user = res.data.user;
  //             setUserToken(token);
  //             setUserInfor(user);
  //             await AsyncStorage.setItem('userInfor', JSON.stringify(user));
  //             await AsyncStorage.setItem('userToken', token);
  //             dispatch(setUser(user));
  //           }
  //         } finally {
  //           setIsLoading(false);
  //         }

  //       } catch (error) {
  //         console.error('Error fetching user profile:', error);
  //       }
  //     }
  //   }
  // });
  const loginGoogleWeb = () => { }
  // const loginGoogleApp = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfoResponse = await GoogleSignin.signIn();
  //     console.log(userInfoResponse, "APPP");
  //     promptAsync();

  //   } catch (error: any) {
  //     console.log("Đăng nhập thất bại: ", error.code); // Ghi lại mã lỗi
  //     console.log("Thông báo thất bại: ", error.message); // Ghi lại thông báo lỗi
  //   }
  // }



  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.post(ENDPOINTS.auth.login, { email, password });
      const token = res.data.access_token;
      const user = res.data.user;

      setUserToken(token);
      setUserInfor(user);
      await AsyncStorage.setItem('userInfor', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', token);

      dispatch(
        setUser({
          user: user,
          token: token,
        })
      );
    } catch (error: any) {
      let codeErr = error.status;
      if (codeErr == 401) {
        return showMessage({
          message: 'Login Failed :(',
          description: `Wrong email or password. Try again!`,
          type: 'danger',
          icon: 'danger',
        })
      }

      return showMessage({
        message: 'Login Failed :(',
        description: `Lỗi ko xác định!`,
        type: 'danger',
        icon: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, password_c: string, picture: string) => {
    if (password !== password_c) {
      showMessage({
        message: 'Retype password ',
        description: `Password does not match!`,
        type: 'warning',
        icon: 'warning',
      });
      return;
    }

    const data = {
      user_name: name,
      email: email,
      password: password,
      password_confirmation: password_c,
    };

    try {
      setIsLoading(true);
      const res = await axiosInstance.post(ENDPOINTS.auth.register, data);
      const token = res.data.access_token;

      const user = {
        id: res.data.user.id,
        user_name: name,
        email: email,
        picture: picture,
      };

      setUserToken(token);
      setUserInfor(user);
      await AsyncStorage.setItem('userInfor', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', token);
      dispatch(
        setUser({
          user: user,
          token: token,
        })
      );

    } catch (error: any) {
      let codeErr = error.status;
      if (codeErr == 422) {
        return showMessage({
          message: 'Use other Email',
          description: `Email has been registered!`,
          type: 'danger',
          icon: 'danger',
        });
      }

      if (error.response) {
        console.log(`Registration failed: ${error.response.data.message}`);
      } else {
        console.log(`Registration error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);

    }
  };



  const logout = async () => {
    setIsLoading(true);
    try {
      // Xóa thông tin trong AsyncStorage
      await AsyncStorage.removeItem('userInfor');
      await AsyncStorage.removeItem('userToken');

      // Reset thông tin người dùng trong Redux
      dispatch(setUser({
        user: null,
        token: null,
      }));

      // Reset trạng thái context
      setUserToken(null);
      setUserInfor(null);

      showMessage({
        message: 'Logged out successfully',
        type: 'success',
        icon: 'success',
      });
    } catch (error) {
      console.error('Logout error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      let userInfor = await AsyncStorage.getItem('userInfor');
      if (userInfor) {
        userInfor = JSON.parse(userInfor);
        setUserToken(userToken);
        setUserInfor(userInfor);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`Login error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ promptAsync, signInWithGoogle, loginGoogleWeb, login, logout, register, isLoading, userToken, userInfor }}>
      {children}
    </AuthContext.Provider>
  );
};
