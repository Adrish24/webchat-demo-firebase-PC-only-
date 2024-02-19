const getCurrentTime = () => {
   return getTime() + ", " + getDate()
};


export const getTime = () => {
    const now = new Date();
    const time = { hour: "numeric", minute: "numeric", hour12: true };
    const currentTime = now.toLocaleTimeString("en-US", time);
    return currentTime
}

export const getDate = () => {
    const now = new Date();
    const date = { day: "2-digit", month: "2-digit", year: "2-digit" };
    const currentDate = now.toLocaleDateString("en-GB", date).replace(/\//g, '_');
    return currentDate;
}

export const retriveTime = (timestamp) => {
    const now = new Date(timestamp);
    const time = { hour: "numeric", minute: "numeric", hour12: true };
    const currentTime = now.toLocaleTimeString("en-US", time);
    // console.log(currentTime);
    return currentTime
}

export default getCurrentTime;