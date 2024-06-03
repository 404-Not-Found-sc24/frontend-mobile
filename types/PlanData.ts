type PlanData = {
    placeId: number;
    locationId: number;
    locationName: string;
    date: string;
    time: string;
    diaryId: number | null;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    latitude: number;
    longitude: number;
};

export default PlanData;