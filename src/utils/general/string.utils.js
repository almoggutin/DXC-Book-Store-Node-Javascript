const formatString = (string) => {
    if (string == null) throw new Error();
    const words = string.split(' ');

    let formattedString = '';
    for (let i = 0; i < words.length; i++) {
        const formattedWord = words[i].slice(0, 1).toUpperCase() + words[i].slice(1);

        formattedString += i === words.length - 1 ? formattedWord : `${formattedWord} `;
    }

    return formattedString;
};

module.exports = {
    formatString,
};
