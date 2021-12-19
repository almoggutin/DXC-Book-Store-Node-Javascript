const dayjs = require('dayjs');

const formatDate = (date) => {
    const formatedDate = dayjs(date).format('dddd, MMM DD, YYYY');

    return formatedDate;
};

module.exports = {
    formatDate,
};
