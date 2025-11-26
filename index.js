const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    acc[key] = value;
    return acc;
}, {});

console.log(args);