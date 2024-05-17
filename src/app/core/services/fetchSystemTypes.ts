import { API_BASE_URL } from ".";

export const fetchSystemType = {
    create: (body: Partial<{ description: string | null; }>) => {
        return fetch(
            API_BASE_URL + "/systemtype",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );
    },

    update: (id: string, body: Partial<{ description: string | null; }>) => {
        return fetch(
            API_BASE_URL + "/systemtype" + `/${id}`,
            { 
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );
    },

    list: async () => {
        const response = await fetch(
            API_BASE_URL + "/systemtype/id/",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            }
        );
          
        const fetchedSystemTypes = await response.json() as any[];

        return fetchedSystemTypes;
    },

    getById: async (id: string) => {
        const response = await fetch(
            API_BASE_URL + "/systemtype/id/",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }
        );
          
        const fetchedSystemTypes = await response.json();

        return fetchedSystemTypes;
    },

    deleteById: (id: string) => {
        return fetch(
            API_BASE_URL + "/systemtype/" + id,
            { 
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}