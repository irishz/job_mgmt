import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    // styles for the `body`
    body: {
      bg: 'gray.100',
    },
  },
};

const fonts = {
  body: `'Sarabun', sans-serif`,
  heading: `'Sarabun', sans-serif`,
}

const components = {

}

const theme = extendTheme({
  styles,
  fonts,
  components,
})

export default theme;
