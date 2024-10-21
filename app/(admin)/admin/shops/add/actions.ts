"use client";

export async function addStoreInfo(data: FormData, officers: string[]) {
    const shop = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/add-shop`,
        {
            method: "POST",
            body: data,
            cache: "no-store",
        }
    );

    const {
        shop: { id },
    } = await shop.json();

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/add-officer`, {
        method: "POST",
        body: JSON.stringify({ officers: officers, id: id }),
        cache: "no-store",
    });
}
