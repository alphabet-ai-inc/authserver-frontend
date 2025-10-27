// Unified field configuration with all necessary metadata
export const FIELD_CONFIG = {
  general: {
    title: "General Information",
    icon: "bi-info-circle",
    fields: {
      name: {
        label: "Application Name",
        type: "text",
        required: true,
        colWidth: 6
      },
      release: {
        label: "Release Version",
        type: "select",
        required: true,
        colWidth: 3,
        fetchOptions: true
      },
      path: {
        label: "Installation Path",
        type: "text",
        required: true,
        colWidth: 3
      },
      // Add all other general fields following this pattern
    }
  },
  technical: {
    title: "Technical Specifications",
    icon: "bi-cpu",
    fields: {
      platform: {
        label: "Supported Platforms",
        type: "checkbox-group",
        options: ['Windows', 'macOS', 'Linux', 'Web'],
        colWidth: 6
      },
      compatibility: {
        label: "System Compatibility",
        type: "tags",
        colWidth: 6
      },
      // Add all technical fields
    }
  },
  // Continue with other sections using same structure
};

// Single source of truth for initial state
export const INITIAL_STATE = Object.values(FIELD_CONFIG).reduce((acc, section) => {
  Object.entries(section.fields).forEach(([fieldName, config]) => {
    acc[fieldName] = config.type === 'checkbox-group' ? [] :
                     config.type === 'number' ? 0 :
                     '';
  });
  return acc;
}, {});

// Derived required fields list
export const REQUIRED_FIELDS = Object.values(FIELD_CONFIG).reduce((acc, section) => {
  Object.entries(section.fields).forEach(([fieldName, config]) => {
    if (config.required) acc.push(fieldName);
  });
  return acc;
}, []);

// Field groups structure for component organization
export const FIELD_GROUPS = Object.entries(FIELD_CONFIG).reduce((acc, [groupName, config]) => {
  acc[groupName] = {
    title: config.title,
    icon: config.icon,
    fields: Object.keys(config.fields)
  };
  return acc;
}, {});
