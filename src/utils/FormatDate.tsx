import {format} from "date-fns";
import { id } from "date-fns/locale";

export function FormatDateId(rawDate: string) {
    return format(new Date(rawDate), "dd MMMM, yyyy hh:mm a",  { locale: id });
}