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

    api: "https://saavn.dev/api",
    apiPath: {
        home: "https://saavn.dev/api/modules?language=hindi,english",
        search: "https://saavn.dev/api/search?query=",
    },
};

export default AppData;
