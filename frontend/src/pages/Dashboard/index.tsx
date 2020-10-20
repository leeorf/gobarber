import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

import FetchDataLoader from '../../components/FetchDataLoader';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
        setIsLoading(false);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appoitmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(appoitmentsFormatted);
        setIsLoading(false);
      });
  }, [selectedDate]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  /**
   * useMemo is just like useCallback, but for variables. We use to memorize a
   * specific value (a serialization for example), and we tell when we want them
   * to be loaded again
   */
  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

  const sortedAppointments = useMemo(() => {
    return appointments.sort((a: Appointment, b: Appointment) =>
      a.date > b.date ? 1 : -1,
    );
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return sortedAppointments.find(
      appointment =>
        isAfter(parseISO(appointment.date), new Date()) &&
        isToday(parseISO(appointment.date)),
    );
  }, [sortedAppointments]);

  const morningAppoitments = useMemo(() => {
    let serializedAppointments = [...sortedAppointments];

    if (nextAppointment && isToday(selectedDate)) {
      serializedAppointments = sortedAppointments.filter(
        appointment => appointment.id !== nextAppointment.id,
      );
    }

    return serializedAppointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [sortedAppointments, nextAppointment, selectedDate]);

  const afternoonAppoitments = useMemo(() => {
    let serializedAppointments = [...sortedAppointments];

    if (nextAppointment && isToday(selectedDate)) {
      serializedAppointments = sortedAppointments.filter(
        appointment => appointment.id !== nextAppointment.id,
      );
    }

    return serializedAppointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [sortedAppointments, nextAppointment, selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img
              src={
                user.avatar_url ||
                'https://icon-library.net/images/no-profile-pic-icon/no-profile-pic-icon-27.jpg'
              }
              alt={user.name}
            />
            <div>
              <span>Bem vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          {isLoading ? (
            <FetchDataLoader />
          ) : (
            <>
              <h1>Horários agendados</h1>
              <p>
                {isToday(selectedDate) && <span>Hoje</span>}
                <span>{selectedDateAsText}</span>
                <span>{selectedWeekDay}</span>
              </p>

              {nextAppointment && (
                <NextAppointment>
                  <strong>Atendimento a seguir</strong>
                  <div>
                    <img
                      src={nextAppointment.user.avatar_url}
                      alt={nextAppointment.user.name}
                    />

                    <strong>{nextAppointment.user.name}</strong>
                    <span>
                      <FiClock size={24} />
                      {nextAppointment.hourFormatted}
                    </span>
                  </div>
                </NextAppointment>
              )}

              <Section>
                <strong>Manhã</strong>

                {morningAppoitments.length === 0 && (
                  <p>Nenhum agendamento neste período</p>
                )}

                {morningAppoitments.map(appointment => (
                  <Appointment key={appointment.id}>
                    <span>
                      <FiClock />
                      {appointment.hourFormatted}
                    </span>

                    <div>
                      <img
                        src={
                          appointment.user.avatar_url ||
                          'https://icon-library.net/images/no-profile-pic-icon/no-profile-pic-icon-27.jpg'
                        }
                        alt={appointment.user.name}
                      />

                      <strong>{appointment.user.name}</strong>
                    </div>
                  </Appointment>
                ))}
              </Section>

              <Section>
                <strong>Tarde</strong>

                {afternoonAppoitments.length === 0 && (
                  <p>Nenhum agendamento neste período</p>
                )}

                {afternoonAppoitments.map(appointment => (
                  <Appointment key={appointment.id}>
                    <span>
                      <FiClock />
                      {appointment.hourFormatted}
                    </span>

                    <div>
                      <img
                        src={
                          appointment.user.avatar_url ||
                          'https://icon-library.net/images/no-profile-pic-icon/no-profile-pic-icon-27.jpg'
                        }
                        alt={appointment.user.name}
                      />

                      <strong>{appointment.user.name}</strong>
                    </div>
                  </Appointment>
                ))}
              </Section>
            </>
          )}
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
