import React, { useContext } from 'react';
export const AppContext = /*#__PURE__*/React.createContext(undefined);
export const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider');
  }

  return context;
};
//# sourceMappingURL=context.js.map