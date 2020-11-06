import React, { useCallback, useEffect, useState } from 'react';
import { Platform, RefreshControl } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    (Platform.OS === 'ios' ? apiIOS : apiAndroid)
      .get('/providers')
      .then(response => {
        setProviders(response.data);
      });
  }, []);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  const handleRefreshing = useCallback(async () => {
    setRefreshing(true);

    const { data } = await (Platform.OS === 'ios' ? apiIOS : apiAndroid).get(
      '/providers',
    );
    setProviders(data);

    setRefreshing(false);
  }, []);

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
              uri: user.avatar_url,
            }}
          />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        contentContainerStyle={{
          paddingBottom: getBottomSpace() + 32,
        }}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        keyExtractor={provider => provider.id}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefreshing}
            refreshing={refreshing}
            colors={['white', 'red']}
            tintColor="#f4ede8"
          />
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar
              source={{
                uri: provider.avatar_url,
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
