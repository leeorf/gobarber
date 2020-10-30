import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { Platform } from 'react-native';
import { useAuth } from '../../hooks/auth';

import { apiAndroid, apiIOS } from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
} from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const route = useRoute();

  const { providerId } = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    (Platform.OS === 'ios' ? apiIOS : apiAndroid)
      .get('/providers')
      .then(response => {
        setProviders(response.data);
      });
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar
          source={{
            uri:
              user.avatar_url ||
              'https://icon-library.net/images/no-profile-pic-icon/no-profile-pic-icon-27.jpg',
          }}
        />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          data={providers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer>
              <ProviderAvatar
                source={{
                  uri:
                    provider.avatar_url ||
                    'https://icon-library.net/images/no-profile-pic-icon/no-profile-pic-icon-27.jpg',
                }}
              />
              <ProviderName>{provider.name}</ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
    </Container>
  );
};

export default CreateAppointment;
