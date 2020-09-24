import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, isAfter, getDate } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

// To declare an Array type on TypeScript we can not use interface.
// Instead we use type =
type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // Array.from: create an array out of some options we can pass
    // Result: [1, 2, 3, 4, ..., 30 or 31]
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const currentDate = new Date(Date.now());

    console.log(currentDate);

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available:
          isAfter(compareDate, currentDate) && appointmentsInDay.length < 10,
      };
    });

    /*
     * Return format: [ { day: 1, available: false }, { day: 1, available: false } ...]
     */
    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
