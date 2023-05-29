import { createTheme } from "@mui/material/styles"

export { theme, lightTheme, darkTheme }

const theme = createTheme({
  smallMargin: "20px",
  mediumMargin: "40px",
  largeMargin: "80px",
});

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
});
