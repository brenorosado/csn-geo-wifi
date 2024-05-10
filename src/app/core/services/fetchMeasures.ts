import { Measure } from "../../features/geomap/utils/generateMockedMeasures";

const API_BASE_URL = "http://localhost:4011/mapeamento";
const MEASURES_ENDPOINT = "/buscar-peers/";

export const fetchMeasures = {
    list: async () => {
        const response = await fetch(
            API_BASE_URL + MEASURES_ENDPOINT,
            { method: "POST" }
        );
          
        const fetchedMeasures = await response.json() as Measure[];

        return fetchedMeasures;
    }
}

export const fetchSystemType = {
    create: (body: Partial<{ description: string | null; }>) => {
        return fetch(
            API_BASE_URL + "/systemtype",
            { method: "POST", body: JSON.stringify(body) }
        );
    },

    list: async () => {
        const response = await fetch(
            API_BASE_URL + "/systemtype/id/",
            { method: "POST" }
        );
          
        const fetchedMeasures = await response.json() as any[];

        return fetchedMeasures;
    }
}