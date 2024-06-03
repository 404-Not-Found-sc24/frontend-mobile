import Restaurant from './Restaurant';
import Accommodation from "./Accommodation";
import Culture from "./Culture";
import Festival from "./Festival";
import Leisure from "./Leisure";
import Shopping from "./Shopping";
import Tour from "./Tour";

type PlaceDetail = {
    accommodation: Accommodation,
    address: string,
    culture: Culture,
    detail: object,
    division: string,
    festival: Festival,
    latitude: number,
    leisure: Leisure,
    longitude: number,
    name: string,
    phone: string,
    restaurant: Restaurant,
    shopping: Shopping,
    tour: Tour,
};

export default PlaceDetail;