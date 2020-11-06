import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { Alert, Platform } from 'react-native';
import { useAuth } from '../../hooks/auth';

import { apiAndroid, apiIOS } from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  CalendarContainer,
  Title,
  Calendar,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentText,
} from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

export interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const route = useRoute();

  const { providerId } = route.params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [selectedHour, setSelectedHour] = useState(0);
  const [androidShowDatePicker, setAndroidShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    (Platform.OS === 'ios' ? apiIOS : apiAndroid)
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year,
          month,
          day,
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const handleSelectProvider = useCallback((selectedProviderId: string) => {
    setSelectedProvider(selectedProviderId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    /**
     * For every setState if we pass to it a function as a parameter, this
     * function has the previous state as the parameter
     *
     * Thus we can use a function inside the setState to update a previous state.
     * Instead of setAndroidShowDatePicker(!androidShowDatePicker)
     * We do setAndroidShowDatePicker(state => !state)
     */
    setAndroidShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setAndroidShowDatePicker(state => !state);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await (Platform.OS === 'ios' ? apiIOS : apiAndroid).post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      /**
       * It is not a good practice to send classes as parameters. Instead, we
       * must send primitive types (strings, objects, arrays, numbers, etc).
       * So instead of the class Date, we send the number with date.getTime()
       */
      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const selectedProviderFirst = useMemo(() => {
    providers.forEach((item, index) => {
      if (item.id === providerId) {
        providers.splice(index, 1);
        providers.unshift(item);
      }
    });

    return providers;
  }, [providerId, providers]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar
          source={{
            uri: user.avatar_url,
          }}
        />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            data={selectedProviderFirst}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={provider => provider.id}
            contentContainerStyle={{ paddingRight: 24 }}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar
                  source={{
                    uri: provider.avatar_url,
                  }}
                />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <CalendarContainer>
          <Title>Escolha a data</Title>

          {Platform.OS === 'ios' ? (
            <Calendar>
              <DateTimePicker
                mode="date"
                value={selectedDate}
                display="inline"
                textColor="#f4ede8"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            </Calendar>
          ) : (
            <>
              <OpenDatePickerButton onPress={handleToggleDatePicker}>
                <OpenDatePickerButtonText>
                  Selecionar outra data
                </OpenDatePickerButtonText>
              </OpenDatePickerButton>
              {androidShowDatePicker && (
                <DateTimePicker
                  mode="date"
                  value={selectedDate}
                  display="calendar"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </>
          )}
        </CalendarContainer>

        <Schedule>
          <Title style={{ marginLeft: 24, marginRight: 24 }}>
            Escolha o horário
          </Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  selected={selectedHour === hour}
                  key={hourFormatted}
                  enabled={available}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    selected={selectedHour === hour}
                    key={hourFormatted}
                    enabled={available}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentText>Agendar</CreateAppointmentText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
