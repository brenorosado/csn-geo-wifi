import { Measure } from "../../features/geomap/utils/generateMockedMeasures";

const API_BASE_URL = "http://localhost:4011/mapeamento";
const MEASURES_ENDPOINT = "/buscar-peers/";

export const fetchMeasures = {
    list: async () => {
        const response = await fetch(
            API_BASE_URL + MEASURES_ENDPOINT,
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            }
        );
          
        const fetchedMeasures = await response.json() as Measure[];

        return fetchedMeasures;
    }
}