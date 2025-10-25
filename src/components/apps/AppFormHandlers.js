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
  console.log('RUNNING CORRECT VERSION OF submitAppForm');

  const method = appId === 0 ? 'POST' : 'PATCH';
  const url = `${process.env.REACT_APP_BACKEND_URL}/admin/apps/${appId || 0}`;

  try {
    const response = await fetchWithHandling(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      let errorMessage = 'Submission failed';
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      }
      handleError(new Error(errorMessage));
      return;
    }

    return await response.json();
  } catch (error) {
    handleError(error);
    throw error;
  }
};