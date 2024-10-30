export type Issue = {
    id: number;
    number: number;
    title: string;
    body: string;
    pull_request?: object;
}