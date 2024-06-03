import {ChangeEvent, useEffect, useState} from "react";
import Place from "../../types/Place";

interface DayPlaceProps {
    dayIndex: number;
    placeIndex: number;
    selectedPlace: Place;
    removePlace: (dayIndex: number, placeIndex: number) => void;
    onTimeChange: (dayIndex: number, placeIndex: number, time: string) => void;
}

const DayPlace: React.FC<DayPlaceProps> = ({ dayIndex, placeIndex, selectedPlace, removePlace, onTimeChange }) => {
    const [hours, setHours] = useState<string>('');
    const [minutes, setMinutes] = useState<string>('');

    useEffect(() => {
        const formattedHours = hours.padStart(2, '0');
        const formattedMinutes = minutes.padStart(2, '0');
        const newTime = `${formattedHours}:${formattedMinutes}`;
        onTimeChange(dayIndex, placeIndex, newTime);
    }, [hours, minutes]);

    const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || (/^\d{1,2}$/.test(value) && Number(value) >= 0 && Number(value) <= 23)) {
            setHours(value);
        }
    };

    const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || (/^\d{1,2}$/.test(value) && Number(value) >= 0 && Number(value) <= 59)) {
            setMinutes(value);
        }
    };

    const handleRemovePlace = () => {
        removePlace(dayIndex, placeIndex);
    };

    return (
        <div className="w-11/12 h-[80px] flex items-center mb-3">
            <button className="delete mr-3" onClick={() => handleRemovePlace()}></button>
            <div className="w-full h-full rounded-md shadow-xl flex items-center">
                <div className="flex w-[40%] p-1 ml-1 font-['BMJUA'] text-[#ED661A] items-center">
                    <input
                        placeholder="00"
                        className="w-[45%] p-1 text-center rounded text-xl font-['BMJUA'] text-[#ED661A]"
                        value={hours}
                        onChange={handleHoursChange}
                    />
                    <span className="mx-1">:</span>
                    <input
                        placeholder="00"
                        className="w-[45%] p-1 text-center rounded text-xl font-['BMJUA'] text-[#ED661A]"
                        value={minutes}
                        onChange={handleMinutesChange}
                    />
                </div>
                <div className="w-full ml-1">
                    <div className="font-extrabold text-lg font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {selectedPlace.name.length > 9 ? `${selectedPlace.name.slice(0, 9)}...` : selectedPlace.name}
                    </div>
                    <div className="text-sm font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {selectedPlace.address.length > 14 ? `${selectedPlace.address.slice(0, 14)}...` : selectedPlace.address}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayPlace;
