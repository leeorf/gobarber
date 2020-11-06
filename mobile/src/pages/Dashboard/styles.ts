import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Provider } from './index';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  /* With translucent={true} on StatusBar component */
  padding-top: ${getStatusBarHeight() + 24}px;
  /* With translucent={false} on StatusBar component */
/*padding-top: ${24 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0)}px; */
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Use this to debug on Flipper and find the component on React DevTools
Header.displayName = 'DashboardHeader';

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`;

export const Username = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #999591;
`;

/**
 * By default styled does not have styled.FlatList and FlatList is
 * a component that has a method called renderItem that returns a JSX for
 * each item.
 * So, to overcome both problems we use this syntax below
 */
export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)`
  padding: 32px 24px 16px;
`;

export const ProvidersListTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin-bottom: 24px;
`;

export const ProviderContainer = styled(RectButton)`
  align-items: center;

  background: #3e3b47;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  flex-direction: row;
`;

export const ProviderAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background: #999591;
`;

export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ProviderName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
`;

export const ProviderMetaData = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const ProviderMetaText = styled.Text`
  margin-left: 8px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
`;
