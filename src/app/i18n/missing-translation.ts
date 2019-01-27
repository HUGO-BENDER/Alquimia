import {MissingTranslationHandler, MissingTranslationHandlerParams} from 'ng2-translate';

export class MissingTranslation implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        console.log('Error: MissingTranslationHandler ' + params.key);
        return params.key;
    }
}
