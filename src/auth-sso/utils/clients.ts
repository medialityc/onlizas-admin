export interface Client {
  id: string;
  url: string;
}
export const clientsConfig: Client[] = [
  {
    id: "0",
    url: "http://localhost:3000",
  },
  {
    id: "1",
    url: "https://my.zasdistributor.com",
  },
  {
    id: "2",
    url: "https://admin.zasdistributor.com",
  },
];
