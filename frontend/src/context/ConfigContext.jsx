import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_FLAGS = {
  // Wireframe default per Section 13: Only Admin/HR can create accounts
  EMPLOYEE_SELF_REGISTRATION_ENABLED: false,
  // Wireframe default per Section 13: Salary Info is Admin-only
  SALARY_INFO_VISIBLE_TO_EMPLOYEE: false,
};

const ConfigContext = createContext(undefined);

export const ConfigProvider = ({ children }) => {
  const [flags, setFlags] = useState(() => {
    const saved = localStorage.getItem('dayflow_config_flags');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse config flags from storage', e);
      }
    }
    return DEFAULT_FLAGS;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_config_flags', JSON.stringify(flags));
  }, [flags]);

  const toggleSelfRegistration = () => {
    setFlags((prev) => ({
      ...prev,
      EMPLOYEE_SELF_REGISTRATION_ENABLED: !prev.EMPLOYEE_SELF_REGISTRATION_ENABLED,
    }));
  };

  const toggleSalaryVisibility = () => {
    setFlags((prev) => ({
      ...prev,
      SALARY_INFO_VISIBLE_TO_EMPLOYEE: !prev.SALARY_INFO_VISIBLE_TO_EMPLOYEE,
    }));
  };

  const setFlag = (key, value) => {
    setFlags((prev) => ({ ...prev, [key]: value }));
  };

  const resetFlags = () => {
    setFlags(DEFAULT_FLAGS);
  };

  return (
    <ConfigContext.Provider
      value={{
        flags,
        toggleSelfRegistration,
        toggleSalaryVisibility,
        setFlag,
        resetFlags,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
