import axios from "axios";
import { Endpoints } from "../constants";


export const createProject = async (data: any) => {
    try {
        const response = await axios.post(Endpoints.PROJECTS, data);
        return response
    } catch (error) {

    }

}


export const getAllProjects = async () => {
    try {
        const response = await  axios.get(Endpoints.PROJECTS);
        return response
    } catch (error) {

    }
};

export const getAllAvailableProjects = async () => {
    try {
        const response = await axios.get(Endpoints.PROJECTS_AVAILABLE);
        return response
    } catch (error) {

    }
}

export const getModelsByProjectID = async (id: string) => {
    try {
        const response = await axios.get(`${Endpoints.PROJECTS}models/${id}`);
        return response
    } catch (error) {

    }
}