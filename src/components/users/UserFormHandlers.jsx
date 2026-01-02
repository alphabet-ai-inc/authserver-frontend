import { convertUserData, convertApiToFormData } from '../../utils/formConverters/UserConverter';

export const fetchUserForEdit = async (userId, jwtToken) => {
  try {

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const apiData = await response.json();
    return convertApiToFormData(apiData); // Convert API response to form-ready data
    } catch (error) {
      throw new Error(`Error fetching user data: ${error.message}`);
  }
};

// fetchUserDetails is for initializing the form. In the future change for
//
// Smart Form Initialization

// Create a smarter form initialization pattern:
// javascript

// // UserFormHandlers.js - Improved version
// export const initializeUserForm = async (userId = null, jwtToken) => {
//   const [userData, dropdownData] = await Promise.allSettled([
//     userId ? fetchUserForEdit(userId, jwtToken) : Promise.resolve(getEmptyUserTemplate()),
//     fetchDropdownData(jwtToken) // Renamed from fetchUserDetails
//   ]);

//   return {
//     user: userData.status === 'fulfilled' ? userData.value : getEmptyUserTemplate(),
//     dropdowns: dropdownData.status === 'fulfilled' ? dropdownData.value : {
//       roles: [], profiles: [], groups: [], companies: []
//     },
//     errors: {
//       user: userData.status === 'rejected' ? userData.reason : null,
//       dropdowns: dropdownData.status === 'rejected' ? dropdownData.reason : null
//     }
//   };
// };

// // New function with proper name and error handling
// const fetchDropdownData = async (jwtToken) => {
//   try {
//     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/dropdown-data`, {
//       headers: {
//         'Authorization': `Bearer ${jwtToken}`
//       }
//     });

//     if (!response.ok) {
//       // Log but don't throw - dropdowns are secondary
//       console.warn('Dropdown data unavailable, using empty arrays');
//       return { roles: [], profiles: [], groups: [], companies: [] };
//     }

//     return await response.json();
//   } catch (error) {
//     console.warn('Failed to fetch dropdown data:', error.message);
//     return { roles: [], profiles: [], groups: [], companies: [] };
//   }
// };

// // Template for new user
// const getEmptyUserTemplate = () => ({
//   id: 0,
//   username: '',
//   email: '',
//   firstName: '',
//   lastName: '',
//   roleId: null,
//   profileId: null,
//   groupId: null,
//   companyId: null,
//   isActive: true
// });

// Create the Backend Endpoint (If dropdowns are needed)
// go

// // In your Go backend
// type DropdownData struct {
//     Roles     []Role     `json:"roles"`
//     Profiles  []Profile  `json:"profiles"`
//     Groups    []Group    `json:"groups"`
//     Companies []Company  `json:"companies"`
// }

// func GetDropdownData(w http.ResponseWriter, r *http.Request) {
//     // Your auth middleware here

//     data := DropdownData{
//         Roles:     getAllRoles(),
//         Profiles:  getAllProfiles(),
//         Groups:    getAllGroups(),
//         Companies: getAllCompanies(),
//     }

//     w.Header().Set("Content-Type", "application/json")
//     json.NewEncoder(w).Encode(data)
// }

export const fetchUserDetails = async (jwtToken) => {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/options`, {
      method: 'GET',
      headers: headers,
      credentials:'include'
    });

    if (!response.ok) {
      return { roles: [], profiles: [], groups: [], companies: [] };
      // throw new Error(`Failed to fetch user details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Handle network errors or other fetch exceptions
    return { roles: [], profiles: [], groups: [], companies: [] };
    // throw new Error(`Error fetching user details: ${error.message}`);
  }
};

export const submitUserForm = async (formData, userId, jwtToken) => {
  try {
    const isNewUser = userId === 0;
    const apiData = convertUserData(formData, isNewUser);

    const method = isNewUser ? 'POST' : 'PUT';
    const url = isNewUser
      ? `${process.env.REACT_APP_BACKEND_URL}/admin/users`
      : `${process.env.REACT_APP_BACKEND_URL}/admin/users/${userId}`;

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to ${method === 'POST' ? 'create' : 'update'} user`);
    }

    return await response.json();
    } catch (error) {
    throw new Error(`Error fetching user details: ${error.message}`);
  }
};