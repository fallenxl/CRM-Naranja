import axios from "axios";
import { Endpoints } from "../constants";


export const getAllLots = async () => {
  try {
    const response = await axios.get(Endpoints.LOTS+"all");
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLotsByProject = async (projectId: string) => {
  try {
    const response = await axios.get(Endpoints.LOTS_BY_PROJECT + projectId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLotsAvailable = async () => {
  try {
    const response = await axios.get(Endpoints.LOTS);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLotByID = async (lotId: string) => {
  try {
    const response = await axios.get(Endpoints.LOTS + lotId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLotsByProjectAndStatus = async (
  projectId: string,
  status: string
) => {
  try {
    const response = await axios.get(
      Endpoints.LOTS_BY_PROJECT + projectId + "/" + status
    );
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};
