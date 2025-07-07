import express from 'express';
import expressListEndpoints from 'express-list-endpoints';

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// FgGray = "\x1b[90m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
// BgGray = "\x1b[100m"


export const colorConsole = (color: string, message: string) => {
  let colorCode = '';
  switch (color) {
    case 'red':
      colorCode = '\x1b[31m';
      break;
    case 'green':
      colorCode = '\x1b[32m';
      break;
    case 'yellow':
      colorCode = '\x1b[33m';
      break;
    case 'blue':
      colorCode = '\x1b[34m';
      break;
    case 'magenta':
      colorCode = '\x1b[35m';
      break;
    case 'cyan':
      colorCode = '\x1b[36m';
      break;
    case 'white':
      colorCode = '\x1b[37m';
      break;
    case 'gray':
      colorCode = '\x1b[90m';
      break;
    default:
      colorCode = '\x1b[37m';
      break;
  }
  console.log(colorCode + message);
}

export const printRoutes = (app: express.Express, port: number) => {
  const endpoints = expressListEndpoints(app);
  console.log('\x1b[34m' + 'Registered Routes:');
  endpoints.forEach((endpoint) => {
    const methods = endpoint.methods.join(', ').toUpperCase();
    const path = `http://localhost:${port}${endpoint.path}`;
    colorConsole('green', `${path} ${methods}`);
  });
};
