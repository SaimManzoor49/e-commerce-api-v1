export const getHtmlForStock = ({
  email,
  product,
  avaliablity,
}: {
  email: string;
  product: any;
  avaliablity: boolean;
}): string => {
  return avaliablity
    ? `
    <h1>Hello World!!!</h1>
    `
    : `
    <h1>Not Helllo</h1>
    `;
};
