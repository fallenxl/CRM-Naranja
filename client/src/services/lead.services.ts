import axios from "axios";
import { Endpoints, Roles } from "../constants";
import { LeadDTO } from "../interfaces/lead.interfaces";
import {
  errorAlertWithTimer,
  successAlertWithTimer,
} from "../component/alerts/Alerts";

export const getLeadsByRole = async (role: Roles, id?: string) => {
  try {
    if (
      role === Roles.ADMIN ||
      role === Roles.COMMUNITY_MANAGER ||
      role === Roles.RECEPTIONIST
    ) {
      const { data } = await axios.get(Endpoints.ADMIN_LEADS);
      return data;
    }

    const { data } = await axios.get(Endpoints.LEAD_BY_USER + id);
    return data || [];
  } catch (error) {
    console.log(error);
  }
};

export const getLeadById = async (id: string) => {
  try {
    const response = await axios.get(Endpoints.LEAD + id);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createLead = async (lead: LeadDTO) => {
  try {
    const response = await axios.post(Endpoints.LEAD, lead);
    return response;
  } catch (error) {}
};

export const getLeadStatus = async (id: string) => {
  try {
    const response = await axios.get(Endpoints.LEAD_STATUS + id);
    return response;
  } catch (error) {}
};

export const updateLeadService = async (id: string | undefined, lead: any) => {
  try {
    return axios.put(Endpoints.LEAD + id, lead).then((response) => {
      if (typeof response === "string") {
        errorAlertWithTimer("Error al actualizar el lead", response);
      } else {
        successAlertWithTimer(
          "Lead actualizado",
          "El lead se actualizó correctamente"
        );
        return response;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLeadStatus = async (id: string | undefined, status: any) => {
  try {
    const response = await axios.put(Endpoints.LEAD_STATUS + id, status);
    return response;
  } catch (error) {}
};

export const assignLeadAdvisor = async (
  id: string | undefined,
  advisorID: any
) => {
  try {
    const response = await axios.put(Endpoints.ASSIGN_LEAD_ADVISOR + id, {
      advisorID,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const assignLeadCampaign = async (
  id: string | undefined,
  campaignID: any
) => {
  try {
    const response = await axios.put(Endpoints.ASSIGN_LEAD_CAMPAIGN + id, {
      campaignID,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBankRejected = async (
  leadId: string | undefined,
  bankId: string | undefined
) => {
  try {
    const response = await axios.delete(
      Endpoints.REJECTED_BANK + leadId + "/" + bankId
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteLead = async (id: string | undefined) => {
  try {
    const response = await axios.delete(Endpoints.LEAD + id);
    return response;
  } catch (error) {}
};
