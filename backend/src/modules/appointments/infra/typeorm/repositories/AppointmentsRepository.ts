import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // Our Raw query will search for MM in month number (01-12), but the month
    // we receive is just number (1-12). We create a variable to convert the
    // 1 into 01.
    // padStart works like this: if our string doest not have 2 digits, we want
    // to fill the digits on the left with 0.
    // With padStart 1 turns 01.
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        // Raw is used to pass the text directly to Postgres without being
        // interpreted by TypeORM. It is just a normal SQL query.
        // Raw receives a function instead of just plain text, because TypeORM
        // adds a prefix on each field before sending to the database. We can
        // grab this name TypeORM with this function.
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    // Our Raw query will search for MM in month number (01-12), but the month
    // we receive is just number (1-12). We create a variable to convert the
    // 1 into 01.
    // padStart works like this: if our string doest not have 2 digits, we want
    // to fill the digits on the left with 0.
    // With padStart 1 turns 01.
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        // Raw is used to pass the text directly to Postgres without being
        // interpreted by TypeORM. It is just a normal SQL query.
        // Raw receives a function instead of just plain text, because TypeORM
        // adds a prefix on each field before sending to the database. We can
        // grab this name TypeORM with this function.
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      /**
       * When using TypeORM, when we load a relationship between 2 tables
       * (either loading through the entity `eager/lazy` or through the repository
       * with `relations`), typeORM uses a strategy called Eager Loading.
       *
       * Imagine that we made a query that return a list of 10 appointments,
       * each appoint scheduled by a different user. Thus, we have 10 appointments,
       * with 10 different user_ids.
       *
       * Using Eager Loading,  instead of making 10 different queries using the
       * user_ids to return the users, it will only do one query with 10 user_ids.
       */
      relations: ['user'],
    });

    appointments.map(appointment => delete appointment.user.password);

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
