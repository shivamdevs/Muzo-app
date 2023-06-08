const AppData = {
    name: "Muzo",
    title: "Muzo",
    parent: {
        name: "MyOasis",
        href: "https://myoasis.tech",
        copyright: "MyOasis.tech ©2022-" + (new Date()).getFullYear(),
    },

    storage: "muzo:settings",
    bucket: "muzo:saved:songs",

    api: "https://saavn.me",
    apiPath: {
        home: "https://saavn.me/modules?language=hindi,english",
        search: "https://saavn.me/search/all?query=",
    },
};

export default AppData;