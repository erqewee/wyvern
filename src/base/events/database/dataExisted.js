import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.DataExisted);
                    
          this.execute = function (key, data, name) {
               return console.log(`[Database(${name})] Data existed. \nKey: ${key} | Data: ${data}`);
          };
     };
};