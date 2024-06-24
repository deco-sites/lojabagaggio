export interface Props {
  data: Record<string, unknown>;
  acronym: string;
}

export const formFirstPurchase = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const { data, acronym } = props;

  try {
    const response = await fetch(
      `/api/dataentities/${acronym}/documents/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "content-type": "aplication/json",
        },
        body: JSON.stringify(data),
      },
    );
    const res = await response.json();

    return res;
  } catch (e) {
    return e;
  }
};

export default formFirstPurchase;
