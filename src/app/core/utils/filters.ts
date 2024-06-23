export const applyFilters = (
    list: any[],
    filters: { field: string; value: any }[],
    especialCases?: { field: string; list: { label: string, value: string }[] }[]
) => {
    const filteredList = list.filter((item: any) => {
        return filters.every(({ field, value }) => {
            if (especialCases) {
                const especialCase = especialCases?.find(({ field: f }) => f === field)
                
                if (especialCase) {
                    const especialOption =  especialCase?.list?.find(({ label }) =>
                        label?.toLowerCase()?.includes(value.toLowerCase())
                    );
                    if (especialOption)
                        return Number(especialOption?.value) === Number(item[field]);
                }
            }

            if (typeof item[field] === "number")
                return item[field]?.toString() === value;

            if (typeof item[field] === "string") 
                return item[field]?.toLowerCase()?.includes(value.toLowerCase());

            return item[field] === value;
        });
    });

    return filteredList;
}