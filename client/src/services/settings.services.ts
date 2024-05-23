import axios from "axios";
import {Endpoints} from "../constants";

export async function  getSettings() {
    try {
        const response = await axios.get(Endpoints.SETTINGS);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function  updateSettings(data:{
    bureauPrequalificationDays: number,
    bankPrequalificationDays: number,
}) {
    try {
        const response = await axios.patch(Endpoints.SETTINGS, data);
        return response;
    } catch (error) {
        console.log(error);
    }
}