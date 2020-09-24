import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  // index method following the RESTful definition
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    /**
     * GET request made in the Browser doest not support to send data in the
     * request.body. Only POST, PATCH and PUT methods support this.
     * To fix this we take day, month and year prom request.query
     * GET (request.query): http://localhost:3333/rota?year=2020&month=5&day=20
     */
    const { month, year } = request.query;

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      // Queries always come as strings. Use Number() to transform them.
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
