export function _fetch(url: string) {
    return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`);
}
