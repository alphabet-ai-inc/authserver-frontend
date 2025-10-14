import { fetchWithHandling, handleError } from "../../utils/fetchHandling";
export const fetchAppDetails = async (jwtToken) => {
  try {
    const [releases] = await Promise.all([
      fetchWithHandling(`${process.env.REACT_APP_BACKEND_URL}/releases`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      }).then(res => res.json())
    ]);

    return {
      release: releases.map(r => ({ value: r.id, label: r.value }))
    };
  } catch (error) {
    handleError(error);
    return {};
  }
};

export const submitAppForm = async (formData, appId, jwtToken) => {
  const method = appId === 0 ? 'POST' : 'PATCH';
  const url = `${process.env.REACT_APP_BACKEND_URL}/admin/apps/${appId || 0}`;
const normalizeValue = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'bigint') return val.toString();
    return val ?? '';
  };

  try {
    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => [key, normalizeValue(val)])
    );
    const response = await fetchWithHandling(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      let errorMessage = 'Submission failed';
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      }
      handleError(new Error(errorMessage));
      // Error is handled, do not rethrow to avoid double handling
      return;
    }

    return await response.json();
  }
  catch (error) {
    handleError(error);
    throw error;
  }
};
