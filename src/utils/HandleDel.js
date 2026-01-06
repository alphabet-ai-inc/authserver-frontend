/**
 * HandleDelete Hook
 * ----------------
 * Custom hook for handling deletion of various entities (apps, users, etc.)
 * with confirmation dialogs and proper error handling.
 */

import Swal from "sweetalert2";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Entity type configuration
 */
const ENTITY_CONFIG = {
  app: {
    endpoint: (id) => `${import.meta.env.VITE_BACKEND_URL}/admin/apps/${id}`,
    title: "Application",
    successMessage: "Application deleted successfully",
    successRedirect: "/apps",
    confirmTitle: "Delete Application?",
    confirmText: "You won't be able to revert this! This will permanently delete the application and all associated data.",
    icon: "bi-box-seam",
  },
  user: {
    endpoint: (id) => `${import.meta.env.VITE_BACKEND_URL}/admin/users/${id}`,
    title: "User Account",
    successMessage: "User account deleted successfully",
    successRedirect: "/users",
    confirmTitle: "Delete User Account?",
    confirmText: "This will permanently delete the user account and all associated data. The user will no longer be able to access the system.",
    icon: "bi-person",
  },
  // Add more entity types as needed
  // company: {
  //   endpoint: (id) => `${import.meta.env.VITE_BACKEND_URL}/admin/companies/${id}`,
  //   title: "Company",
  //   successMessage: "Company deleted successfully",
  //   successRedirect: "/companies",
  //   confirmTitle: "Delete Company?",
  //   confirmText: "This will permanently delete the company and all associated data.",
  //   icon: "bi-building",
  // },
  // profile: {
  //   endpoint: (id) => `${import.meta.env.VITE_BACKEND_URL}/admin/profiles/${id}`,
  //   title: "Profile",
  //   successMessage: "Profile deleted successfully",
  //   successRedirect: "/profiles",
  //   confirmTitle: "Delete Profile?",
  //   confirmText: "This will permanently delete the profile. Users assigned to this profile will need to be reassigned.",
  //   icon: "bi-person-badge",
  // },
};

/**
 * Custom hook for handling entity deletion
 * @param {string|number} id - The entity ID to delete
 * @param {string} entityType - Type of entity ('app', 'user', etc.)
 * @returns {Function} Function to trigger the delete operation
 */
export const useHandleDelete = (id, entityType = 'app') => {
  const navigate = useNavigate();
  const { jwtToken } = useAuth();

  // Get configuration for the entity type
  const config = ENTITY_CONFIG[entityType] || ENTITY_CONFIG.app;

  const confirmDelete = useCallback(async (customOptions = {}) => {
    if (!jwtToken) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to perform this action",
        icon: "warning",
        confirmButtonText: "Go to Login"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    // Merge custom options with default config
    const options = {
      ...config,
      ...customOptions,
    };

    // Custom confirmation dialog
    const result = await Swal.fire({
      title: options.confirmTitle,
      html: `
        <div class="text-start">
          <p>${options.confirmText}</p>
          <div class="alert alert-warning mt-3 mb-0">
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Warning:</strong> This action cannot be undone.
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const headers = new Headers({
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json"
          });

          const requestOptions = {
            method: "DELETE",
            headers: headers,
          };

          const response = await fetch(options.endpoint(id), requestOptions);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to delete ${options.title.toLowerCase()}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          Swal.showValidationMessage(
            `<i class="bi bi-exclamation-triangle me-1"></i> ${error.message}`
          );
          return null;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isConfirmed && result.value) {
      // Success handling
      await Swal.fire({
        title: "Deleted!",
        html: `
          <div class="text-center">
            <div class="mb-3">
              <i class="bi bi-check-circle text-success display-4"></i>
            </div>
            <h5 class="text-success">${options.title} Deleted</h5>
            <p class="text-muted">${options.successMessage}</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#198754",
        timer: 2000,
        timerProgressBar: true,
      });

      // Redirect after successful deletion
      if (options.onSuccessRedirect) {
        options.onSuccessRedirect();
      } else {
        navigate(options.successRedirect);
      }

      // Optional callback after successful deletion
      if (options.onSuccess) {
        options.onSuccess(result.value);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // User cancelled the deletion
      await Swal.fire({
        title: "Cancelled",
        text: `The ${options.title.toLowerCase()} is safe`,
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#6c757d",
        timer: 1500,
      });
    }
  }, [id, jwtToken, navigate, config]);

  /**
   * Batch delete multiple entities
   * @param {Array} ids - Array of entity IDs to delete
   * @param {Object} options - Additional options
   */
  const batchDelete = useCallback(async (ids, options = {}) => {
    if (!jwtToken) {
      navigate("/login");
      return;
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      Swal.fire({
        title: "No Items Selected",
        text: "Please select items to delete",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }

    const result = await Swal.fire({
      title: `Delete ${ids.length} ${config.title}s?`,
      html: `
        <div class="text-start">
          <p>You are about to delete <strong>${ids.length}</strong> ${config.title.toLowerCase()}${ids.length > 1 ? 's' : ''}. This action cannot be undone.</p>
          <div class="alert alert-danger mt-3 mb-0">
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Warning:</strong> All selected items will be permanently deleted.
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, delete ${ids.length} item${ids.length > 1 ? 's' : ''}`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        const headers = new Headers({
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json"
        });

        const requestOptions = {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ ids })
        };

        // Assuming you have a batch delete endpoint
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/${entityType}s/batch-delete`, requestOptions);
        const data = await response.json();

        if (data.error) {
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: "Success!",
            text: `Successfully deleted ${ids.length} ${config.title.toLowerCase()}${ids.length > 1 ? 's' : ''}`,
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            if (options.onSuccess) {
              options.onSuccess(data);
            }
            window.location.reload(); // Refresh to update the list
          });
        }
      } catch (err) {
        console.error("Error batch deleting:", err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete items. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  }, [jwtToken, navigate, config, entityType]);

  return {
    confirmDelete,
    batchDelete,
    // Helper function to get entity configuration
    getConfig: () => config
  };
};

/**
 * Quick delete function for use outside React components
 * @param {string} entityType - Type of entity
 * @param {string|number} id - Entity ID
 * @param {string} jwtToken - JWT token
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const quickDelete = async (entityType, id, jwtToken, onSuccess, onError) => {
  const config = ENTITY_CONFIG[entityType] || ENTITY_CONFIG.app;

  try {
    const headers = new Headers({
      "Authorization": `Bearer ${jwtToken}`
    });

    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };

    const response = await fetch(config.endpoint(id), requestOptions);
    const data = await response.json();

    if (data.error) {
      if (onError) onError(data.message);
      return false;
    } else {
      if (onSuccess) onSuccess(data);
      return true;
    }
  } catch (err) {
    console.error(`Error deleting ${entityType}:`, err);
    if (onError) onError('Network error');
    return false;
  }
};

export default useHandleDelete;