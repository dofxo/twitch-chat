import axios from "axios";

export const changeTheme = (theme: string) => {
  // changes the theme
  const html = document.querySelector("html")!;
  html.dataset.theme = theme;

  // update cookie
  axios.post(`/api/cookie/${theme}`);
};
