import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useAuth } from '../../hooks/auth';

import { apiIOS, apiAndroid } from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  Username,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMetaData,
  ProviderMetaText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    (Platform.OS === 'ios' ? apiIOS : apiAndroid)
      .get('/providers')
      .then(response => {
        setProviders(response.data);
      });
  }, []);

  const navigateToProfile = useCallback(() => {
    signOut();
    // navigate('Profile');
  }, [signOut]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <Username>{user.name}</Username>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar
            source={{
              uri:
                user.avatar_url ||
                'https://icon-library.net/images/no-profile-pic-icon/no-profile-pic-icon-27.jpg',
            }}
          />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        contentContainerStyle={{
          paddingBottom: getBottomSpace() + 16,
        }}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        keyExtractor={provider => provider.id}
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar
              source={{
                uri:
                  provider.avatar_url ||
                  'https://icon-library.net/images/no-profile-pic-icon/no-profile-pic-icon-27.jpg',
              }}
            />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMetaData>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à Sexta</ProviderMetaText>
              </ProviderMetaData>

              <ProviderMetaData>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMetaData>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
