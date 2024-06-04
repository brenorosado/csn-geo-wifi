import { API_BASE_URL } from ".";

export const fetchEquipment = {
    create: (body: any) => {
        return fetch(
            API_BASE_URL + "/equipment",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );
    },

    update: (id: string, body: Partial<{ description: string | null; }>) => {
        return fetch(
            API_BASE_URL + "/equipment" + `/${id}`,
            { 
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );
    },

    list: async () => {
        const response = await fetch(
            API_BASE_URL + "/equipment/id/",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            }
        );
          
        const fetchedequipments = await response.json() as any[];

        return fetchedequipments;
    },

    getById: async (id: string) => {
        const response = await fetch(
            API_BASE_URL + "/equipment/id/",
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }
        );
          
        const fetchedequipments = await response.json();

        return fetchedequipments;
    },

    deleteById: (id: string) => {
        return fetch(
            API_BASE_URL + "/equipment/" + id,
            { 
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}