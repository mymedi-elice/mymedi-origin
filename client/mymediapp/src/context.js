import React from "react";

export const cookiesContext = React.createContext({
  cookies: {},
  setCookies: () => {},
  hasCookie: false,
  setHasCookie: () => {},
});
