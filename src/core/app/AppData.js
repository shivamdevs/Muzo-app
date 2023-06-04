const AppData = {
    name: "Muzo",
    title: "Muzo",
    parent: {
        name: "MyOasis",
        href: "https://myoasis.tech",
        copyright: "MyOasis.tech ©2022-" + (new Date()).getFullYear(),
    },

    storage: "muzo:settings",

    api: "https://saavn.me",
    apiPath: {
        home: "https://saavn.me/modules?language=hindi,english",
    },
};

export default AppData;