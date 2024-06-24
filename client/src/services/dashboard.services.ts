import axios from "axios";
import { Endpoints } from "../constants";

export async function getDashboardService({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) {
  try {

    if(startDate && endDate){
      if(startDate > endDate) throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
      const response = await axios.get(Endpoints.DASHBOARD, {
        params: {
          startDate,
          endDate,
        },
      });
      return response;
    }
    const response = await axios.get(Endpoints.DASHBOARD);
    return response;
  } catch (error) {
    return error;
  }
}