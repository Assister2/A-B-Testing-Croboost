import { API_ROOT } from "../../constants";

export interface ABTest {
  iso_created_at: string;
  iso_updated_at: string;
  user_id: string;
  record_id: string;
  s3_key: string;
  title: string;
  data?: string;
}

export const getABTest = async (
  token: string,
  recordId: string
): Promise<ABTest> => {
  const url = `${API_ROOT}/ab/tests/${recordId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
export const getTests = async (token: string): Promise<ABTest[]> => {
  const url = `${API_ROOT}/ab/tests/`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
export const createTest = async (
  token: string,
  title: string,
  data?: string
): Promise<ABTest> => {
  const url = `${API_ROOT}/ab/tests/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      data,
    }),
  });
  const json = await response.json();
  return json;
};
export const deleteTest = async (
  token: string,
  recordId: string
): Promise<void> => {
  const url = `${API_ROOT}/ab/tests/${recordId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // const data = await response.json();
  if (response.status !== 204) {
    console.log("error deleting test", response.status, recordId);
  }
};
export const updateTest = async (
  token: string,
  recordId: string,
  title: string,
  data?: string
): Promise<ABTest> => {
  const url = `${API_ROOT}/ab/tests/${recordId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      data,
    }),
  });
  const data2 = await response.json();
  return data2;
};
