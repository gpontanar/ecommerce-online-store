export async function fetchData() {
    const endpoint = `${process.env.REACT_APP_API_BASE_URL}/products/all/`;

    try {
        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Debugging log
        return data; 
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        return []; // Return empty array to avoid undefined errors
    }
}

