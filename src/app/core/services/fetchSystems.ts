import { API_BASE_URL } from ".";

export const fetchSystems = {
    create: (body: any) => {
        return fetch(
            API_BASE_URL + "/system",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );
    },

    update: (id: string, body: any) => {
        return fetch(
            API_BASE_URL + "/system" + `/${id}`,
            { 
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );
    },

    list: async () => {
        const response = await fetch(
            API_BASE_URL + "/system/id",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            }
        );
          
        const fetchedSystems = await response.json() as any[];

        return fetchedSystems;
    },

    getById: async (id: string) => {
        const response = await fetch(
            API_BASE_URL + "/system/id",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }
        );
          
        const fetchedSystem = await response.json();

        return fetchedSystem;
    },

    deleteById: (id: string) => {
        return fetch(
            API_BASE_URL + "/system/" + id,
            { 
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}