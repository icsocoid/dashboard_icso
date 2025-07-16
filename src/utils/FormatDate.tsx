import {format} from "date-fns";
import { id } from "date-fns/locale";

export function FormatDate(rawDate: string) {
    return format(new Date(rawDate), "dd MMM, yyyy hh:mm a",  { locale: id });
}

export function FormatDateId(rawDate: string) {
    return format(new Date(rawDate), "dd MMMM, yyyy hh:mm a",  { locale: id });
}
