import axios from "axios";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi, { HttpBackendOptions } from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import z from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

//Tutorial: https://www.youtube.com/watch?v=w04LXKlusCQ&t
export default i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init<HttpBackendOptions>({
        fallbackLng: "nl",
        // debug: true,
        defaultNS: "common",
        ns: ["common", "zod", "zodCustom", "input", "ui", "homePage", "authPage", "profilePage"],
        detection: {
            order: [
                "querystring",
                "cookie",
                "localStorage",
                "sessionStorage",
                "navigator",
                "htmlTag",
                "path",
                "subdomain",
            ],
        },
        // missingKeyHandler: (lngs, ns, key, fallbackValue, updateMissing, options) => {
        //     console.log(lngs, ns, key, fallbackValue, updateMissing, options);
        //     return "test test joe";
        // },

        // parseMissingKeyHandler: (key) => {
        //     console.log("parse deze zooi", key);
        // },
        saveMissing: true,
        backend: {
            loadPath: "/assets/locals/{{ns}}/{{lng}}.json",
            request: async (_options, url, _payload, callback) => {
                try {
                    const translation = await axios.get(url);
                    callback(null, {
                        status: 200,
                        data: JSON.stringify(translation.data),
                    });
                } catch (e) {
                    callback(e, {
                        status: 500,
                        data: [],
                    });
                }
            },
        },
        keySeparator: ".",
        react: {
            useSuspense: true,
        },
    });

z.setErrorMap(makeZodI18nMap({ ns: ["zod", "zodCustom"] }));
