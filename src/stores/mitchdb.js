import { defineStore } from "pinia";
import PouchDB from "pouchdb-browser"
import _ from "lodash";
const db = new PouchDB("mitch-db")


export const mitchDB = defineStore({
    id: "mitchDB",
    state: () => ({
        document: {
            currentStep: 0,
            progress: 0, // 0 = not started, 1 = in progress, 2 = finished
            maxSteps: 16,
            injectionTime: 500, // miliseconds
            closingTime: 1000, // miliseconds
            _id: "main",
            _rev: ""
        }
    }),
    actions: {
        update() {
            return new Promise((resolve, reject) => {
                const doc = _.merge({},_.pick( this.document, ["_id", "_rev", "currentStep", "maxSteps", "closingTime"]))
                db.put(doc).then((res) => {
                    this.document._rev = res.rev
                    resolve(this.document)
                }).catch(reject)
            })
        },
        load() {
            return new Promise((resolve, reject) => {
                db.allDocs({
                    include_docs: true,
                    attachments: true
                }).then((result) => {
                    _.merge(this.document,_.pick( result.rows[0].doc, ["_id", "_rev", "currentStep", "maxSteps", "closingTime"]))
                    return resolve(this.document)
                }).catch(reject)

            })
        },
    },
    getters: {
    }
});

export default mitchDB;