import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Map from '../components/Map';
import { MapProvider } from '../context/MapContext';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddPlaceForm: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState({
    name: '',
    address: '',
    detail: '',
    division: '',
    phone: '',
    content: '',
    latitude: 37.2795,
    longitude: 127.0438,
    images: [] as File[],
    placeId: 0,
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { accessToken, refreshAccessToken } = useAuth();
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // 타이머 ID 상태 추가
  const ALLOW_FILE_EXTENSION = 'jpg,jpeg,png';
  const FILE_SIZE_MAX_LIMIT = 1 * 1024 * 1024;

  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        setKakaoLoaded(true);
      } else {
        setTimeout(checkKakaoLoaded, 100);
      }
    };
    checkKakaoLoaded();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // 언마운트 시 타이머 제거
      }
    };
  }, [timeoutId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setPlaceInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPlaceInfo((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      const validImages: File[] = [];
      const imagePreviews: string[] = [];
      let hasInvalidFile = false;

      selectedImages.forEach((image) => {
        const fileExtension = image.name.split('.').pop()?.toLowerCase();
        const fileSize = image.size;

        if (
          fileExtension &&
          ALLOW_FILE_EXTENSION.includes(fileExtension) &&
          fileSize <= FILE_SIZE_MAX_LIMIT
        ) {
          validImages.push(image);
          imagePreviews.push(URL.createObjectURL(image));
        } else {
          hasInvalidFile = true;
        }
      });
      setPreviewImages(imagePreviews);

      if (hasInvalidFile) {
        toast.error(
          'jpg, jpeg, png 파일만 업로드 가능하며, 파일 크기는 1MB 이하로 제한됩니다.',
          {
            position: 'top-center',
          },
        );
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', placeInfo.name);
      formData.append('address', placeInfo.address);
      formData.append('detail', placeInfo.detail);
      formData.append('division', placeInfo.division);
      formData.append('phone', placeInfo.phone);
      formData.append('content', placeInfo.content);
      formData.append('latitude', String(placeInfo.latitude));
      formData.append('longitude', String(placeInfo.longitude));
      placeInfo.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post('/tour/new-location', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('장소 정보 제출됨:', response.data);
      toast.success('장소 정보 제출에 성공했습니다.', {
        position: 'top-center',
      });
      const id = setTimeout(() => {
        navigate('/');
      }, 3000);
      setTimeoutId(id);
      // 성공적으로 제출되었을 경우 처리
    } catch (error) {
      if ((error as AxiosError).response) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          toast.error('accesstoken 재발급에 실패했습니다.', {
            position: 'top-center',
          });
          // 액세스 토큰 갱신에 실패한 경우 사용자에게 알립니다.
        }
      } else {
        console.error('장소 정보 제출 실패:', error);
        toast.error('장소 정보 제출에 실패했습니다.', {
          position: 'top-center',
        });
      }
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handleAddressSearch = () => {
    if (!kakaoLoaded) {
      console.error('Kakao Maps JavaScript API is not loaded.');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(placeInfo.address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x } = result[0];
        handleMapClick(parseFloat(y), parseFloat(x));
      } else {
        toast.error('주소 검색에 실패했습니다.', {
          position: 'top-center',
        });
      }
    });
  };

  const initialCenter = placeInfo
    ? { latitude: placeInfo.latitude, longitude: placeInfo.longitude }
    : { latitude: 37.2795, longitude: 127.0438 };

  const initialMarkers = placeInfo
    ? [
        {
          placeId: placeInfo.placeId,
          latitude: placeInfo.latitude,
          longitude: placeInfo.longitude,
        },
      ]
    : [];

  return (
    <div className="w-full h-[90%] flex">
      <ToastContainer />
      <div className="flex flex-col w-1/2 p-4 h-full">
        <div className="flex items-center w-full h-[5%]">
          <button
            className="backArrow w-[10%] h-full"
            onClick={handleBackButtonClick}
          ></button>
          <div className="flex w-[90%] h-full items-center text-2xl px-2 font-[BMJUA]">
            나만의 장소 추가하기
          </div>
        </div>
        <div className="py-5 flex flex-col items-center h-[90%]">
          <div className="relative py-2 flex flex-col w-full border h-[20%]">
            <div className="mx-auto h-full">
              {previewImages.length === 0 && (
                <div className="flex justify-center items-center border border-gray-300 rounded-md h-full px-5">
                  <div className="text-gray-500">사진을 업로드 해주세요</div>
                </div>
              )}
              {previewImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index}`}
                  className={`object-cover mr-2 mb-2 h-full ${
                    index === currentImageIndex ? '' : 'hidden'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col my-2 w-full p-5 shadow-xl border font-BMJUA h-[80%]">
            <div className="flex p-1 items-center">
              <div className="flex w-20">장소명 :</div>
              <input
                type="text"
                placeholder="장소명"
                name="name"
                value={placeInfo.name}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field"
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">주소 :</div>
              <input
                type="text"
                placeholder="주소"
                name="address"
                value={placeInfo.address}
                onChange={handleChange}
                className="w-[80%] p-2 border-2 input-field"
              />
              <button
                onClick={handleAddressSearch}
                className="w-[20%] ml-2 p-2 bg-main-red-color text-white rounded-md"
              >
                주소 검색
              </button>
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">상세 설명 :</div>
              <textarea
                placeholder="상세 설명"
                name="detail"
                value={placeInfo.detail}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field"
                rows={1}
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">구분 :</div>
              <select
                name="division"
                value={placeInfo.division}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field"
              >
                <option value="">구분 선택</option>
                <option value="숙박">숙박</option>
                <option value="문화시설">문화시설</option>
                <option value="음식점">음식점</option>
                <option value="축제 공연 행사">축제 공연 행사</option>
                <option value="관광지">관광지</option>
                <option value="레포츠">레포츠</option>
                <option value="쇼핑">쇼핑</option>
              </select>
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">전화번호 :</div>
              <input
                type="text"
                placeholder="전화번호"
                name="phone"
                value={placeInfo.phone}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field"
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">내용 :</div>
              <textarea
                placeholder="내용"
                name="content"
                value={placeInfo.content}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field"
                rows={1}
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">위도 :</div>
              <div className="mx-2">{placeInfo.latitude}</div>
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">경도 :</div>
              <div className="mx-2">{placeInfo.longitude}</div>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mb-2 p-2 border-2 border-main-red-color"
            />
          </div>
        </div>
        <div className="w-full h-[5%] flex justify-center">
          <button
            onClick={handleSubmit}
            className="p-2 bg-main-red-color text-white rounded-md font-bold"
          >
            장소 추가
          </button>
        </div>
      </div>
      <MapProvider
        key={JSON.stringify(initialMarkers)}
        initialCenter={initialCenter}
        initialMarkers={initialMarkers}
      >
        <Map onMapClick={handleMapClick} />
      </MapProvider>
    </div>
  );
};

export default AddPlaceForm;
