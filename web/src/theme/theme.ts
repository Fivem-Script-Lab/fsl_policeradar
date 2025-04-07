import { createTheme } from '@mantine/core';

export const theme = createTheme({
    fontFamily: 'Inter, sans-serif',
    primaryColor: 'cyan',
    primaryShade: 8,
    components: {
      Button: {
        styles: () => {
          return {
            root: {
              border: "none"
            },
          };
        }
      }
    }
});
