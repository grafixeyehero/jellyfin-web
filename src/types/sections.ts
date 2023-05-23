import { CardOptions } from './cardOptions';
import { LibraryParametersOptions } from './library';

export interface Sections {
    name: string;
    id: string;
    type: string;
    viewType?: string,
    parametersOptions?: LibraryParametersOptions;
    cardOptions: CardOptions;
}
