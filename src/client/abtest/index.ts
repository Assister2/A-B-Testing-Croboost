import { API_ROOT, V2_API_ROOT } from "../../constants"

export interface ABTest {
  description: string
  iso_created_at: string
  iso_updated_at: string
  user_id: string
  record_id: string
  s3_key: string
  title: string
  is_live: boolean
  preview_url: string
  data?: string
}

export const getABTest = async (
  token: string,
  recordId: string
): Promise<ABTest> => {
  const url = `${API_ROOT}/ab/tests/${recordId}`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  return data
}
export const getTests = async (token: string): Promise<ABTest[]> => {
  const url = `${API_ROOT}/ab/tests/`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  return data
}
export const createTest = async (
  token: string,
  title: string,
  preview_url: string,
  data?: string
): Promise<ABTest> => {
  // console.log("IN API", data)
  const url = `${API_ROOT}/ab/tests/`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      preview_url,
      data,
    }),
  })
  // console.log("POST body", JSON.stringify({title, preview_url, data}))
  const json = await response.json()
  return json
}
export const createV2Test = async (
  token: string,
  data?: object
): Promise<ABTest> => {
  const url = `${V2_API_ROOT}/mojito_tests/`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      "is_live":false,
      "mojito_object_root": data,
    }),
  })
  const json = await response.json()
  return json
}

export const deleteTest = async (
  token: string,
  recordId: string
): Promise<void> => {
  const url = `${API_ROOT}/ab/tests/${recordId}`
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  // const data = await response.json();
  if (response.status !== 204) {
    console.log("error deleting test", response.status, recordId)
  }
}
export const updateTest = async (
  token: string,
  recordId: string,
  title: string,
  is_live: boolean
  // data?: string
) => {
  const url = `${API_ROOT}/ab/tests/${recordId}`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      is_live,
      // data,
    }),
  })
  // const data2 = await response.json()
  return { status: "OK" }
}


export const getChartData = async (token: string,id:any): Promise<any> => {
  const url = `${API_ROOT}/metrics/${id}`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  return data
}

export const getTestData = async (token: string, id:any): Promise<any> => {
  const url = `${V2_API_ROOT}/metrics/tests/${id}`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  })
  const data = await response.json()
  return data
}

export const getInsightsNames = async (token: string, user_id:any): Promise<any> => {
  const url = `${V2_API_ROOT}/metrics/shopify-insights/${user_id}/names`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  })
  const data = await response.json()
  // console.log("shopify-insights user_id names",user_id,data)
  return data
}

export const getInsightsData = async (token: string, user_id:any, insight_name: string): Promise<any> => {
  const url = `${V2_API_ROOT}/metrics/shopify-insights/${user_id}/insight/${insight_name}`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  })
  const data = await response.json()
  // console.log("shopify-insights datas names", insight_name ,user_id,data)
  return data
}

export const getUserData = async () => {
  const tokens: any = localStorage.getItem('ab-website-tokens');
  const parsedTokens = JSON.parse(tokens);
  
  const url = `${API_ROOT}/ab/tests/`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${parsedTokens?.id_token}`,
    },
  })
  console.log("USER", response)
  const data = await response.json()
  return parsedTokens?.id_token
}


