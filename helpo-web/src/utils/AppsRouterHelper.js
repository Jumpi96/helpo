

const createFacadeUrl = (href) => {
    const app = process.env.REACT_APP_FACADE_URL;
    return `${app}${href}`
}

export default createFacadeUrl;