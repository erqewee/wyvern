import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: false,
               process: false,
               database: true
          });

          this.setName(this.Events.Database.DataPulled);
                    
          this.execute = function (data) {
               return console.log(data);
          };
     };
};