const conf = {
    token: {
        table: 'sessions',
        delimiter: '\'',
        maxAge: 2 * 60 * 60 * 1000,
    },
    api: {
        renewal: true,
        refresh: false,
        refreshTime: 5 * 60 * 1000,
    },
    web: {
        prefix: '_t_ses',
        renewal: true,
        refresh: true,
        refreshTime: 5 * 60 * 1000,
    },
    lang: {
        default: 'hy',
        all: {'hy': 'Հայերեն', 'en': 'English', 'ru': 'Русский'},
    },

}

module.exports = {conf};