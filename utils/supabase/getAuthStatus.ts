export async function getAuthStatus() {
    const getAuth = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/getAuthStatus`
        );
        return res;
    };
    const data = await (await getAuth()).json();
    return data;
}
