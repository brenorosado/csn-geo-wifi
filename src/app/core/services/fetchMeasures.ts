import { Measure } from "../../features/geomap/utils/generateMockedMeasures";

const API_BASE_URL = "http://localhost:4011";
const MEASURES_ENDPOINT = "/mapeamento/buscar-peers/";

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