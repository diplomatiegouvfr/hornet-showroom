import { URL_COMPOSANT } from "src/utils/urls";
import { ServiceRequest } from "hornet-js-core/src/services/service-request";
import {ServicePage} from "hornet-js-core/src/services/service-page";


export interface ShowroomService {
    rechercheComposantMd(composantName: string) : Promise <any> ;
    readDirRecursive(dir, callback) : any;
}

export class ShowroomServiceImpl extends ServicePage  implements ShowroomService {

    rechercheComposantMd(composantName: string) : Promise <any> {

        let url: string = URL_COMPOSANT + "/test/" + composantName;

        return this.fetch({method: "get", url : this.buildUrl(url)}).then((result) => {
            return result;
        });
    }
    readDirRecursive(dir, callback) : any {};
}

