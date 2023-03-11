import { Film } from "./film.model";

export class ListFilm {
    titrelist!: string;
    uid!: string;
    _id!: string;
    shared!: boolean;
    movies!: Film[];
}