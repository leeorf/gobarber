import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  padding: 0 30px ${Platform.OS === 'ios' ? 40 : 30}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: ${Platform.OS === 'ios' ? 24 : 12}px 0;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: ${getStatusBarHeight() + 24}px;
`;

export const BackButton = styled.TouchableOpacity``;

export const SignOutButton = styled.TouchableOpacity``;

export const UserAvatarButton = styled.TouchableOpacity`
  width: 186px;
  height: 186px;
  border-radius: 93px;
  background: #999591;
  align-self: center;
`;

export const UserAvatarMask = styled.View`
  position: absolute;
  width: 186px;
  height: 186px;
  border-radius: 93px;
  align-self: center;
  justify-content: center;
  background: #000;
  opacity: 0.4;
  z-index: 1;
  align-items: center;
`;

export const MaskTitle = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
`;

export const UserAvatar = styled.Image`
  position: absolute;
  width: 186px;
  height: 186px;
  border-radius: 93px;
  align-self: center;
  z-index: 0;
`;
