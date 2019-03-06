/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer,createSwitchNavigator } from 'react-navigation';

import LoginScreen from "./src/screens/Login";
import SignupScreen from "./src/screens/Signup";
import DashboardScreen from "./src/screens/Dashboard";
import ForgotPasswordScreen from "./src/screens/ForgotPassword";
import MenuScreen from "./src/screens/Menu";
import WalletScreen from "./src/screens/Wallet";
import SettingsScreen from "./src/screens/Settings";
import AuthLoadingScreen from "./src/screens/AuthLoading";
import EditProfileScreen from "./src/screens/EditProfile";
import ChangePasswordScreen from "./src/screens/ChangePassword";
import GeneratePinScreen from "./src/screens/GeneratePin";
import VerifyPinScreen from "./src/screens/VerifyPin";
import PairScreen from "./src/screens/Pair";
import ReceviePaymentScreen from "./src/screens/ReceviePayment";
import SendPaymentScreen from "./src/screens/SendPayment";
import QrScannerScreen from "./src/screens/QrScanner";
import HistoryReceiveScreen from "./src/screens/HistoryReceive";


const AppStack = createStackNavigator(
  { 
    Dashboard: DashboardScreen,
    Menu: MenuScreen,
    Wallet:WalletScreen,
    Settings:SettingsScreen,
    EditProfile:EditProfileScreen,
    ChangePassword:ChangePasswordScreen,
    GeneratePin:GeneratePinScreen,
    Pair:PairScreen,
    ReceviePayment:ReceviePaymentScreen,
    SendPayment:SendPaymentScreen,
    QrScanner:QrScannerScreen,
    HistoryReceive:HistoryReceiveScreen,
  });

  const AppStack2 = createStackNavigator(
  { 
    VerifyPin:VerifyPinScreen,
    Dashboard: DashboardScreen,
    Menu: MenuScreen,
    Wallet:WalletScreen,
    Settings:SettingsScreen,
    EditProfile:EditProfileScreen,
    ChangePassword:ChangePasswordScreen,
    GeneratePin:GeneratePinScreen,
    Pair:PairScreen,
    ReceviePayment:ReceviePaymentScreen,
    SendPayment:SendPaymentScreen,
    QrScanner:QrScannerScreen,
    HistoryReceive:HistoryReceiveScreen,
  }
    );
const AuthStack = createStackNavigator(
  { 
    Login: LoginScreen,
    Signup: SignupScreen,
    ForgotPassword: ForgotPasswordScreen,
  }
  );



export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    App2: AppStack2,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

