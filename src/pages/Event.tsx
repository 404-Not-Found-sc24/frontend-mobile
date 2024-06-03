import React, { useEffect, useRef, useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import axios from 'axios';
import '../index.css';
import { useNavigate } from 'react-router-dom';

interface Event {
  title: string;
  content: string;
  createdDate: Date;
  updatedDate: Date;
  memberName: string;
}

const Event: React.FC = () => {
  const gridRef = useRef();
  const [activeTab, setActiveTab] = useState('공지사항');
  const [rowsNoticeData, setRowsNoticeData] = useState([]);
  const [rowsEventData, setRowsEventData] = useState([]);
  const [rowsPromotionData, setRowsPromotionData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getNoticeData();
    getEventData();
    getPromoteData();
  }, []);

  const getNoticeData = async () => {
    try {
      await axios
        .get(`/event/announce`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          setRowsNoticeData(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const getEventData = async () => {
    try {
      await axios
        .get(`/event/event`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          setRowsEventData(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const getPromoteData = async () => {
    try {
      await axios
        .get(`/event/promotion`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          setRowsPromotionData(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTitleClick = (event: any) => {
    const clickedRowData = event.data;
    navigate('/notice/view', {
      state: {
        title: clickedRowData.title,
        content: clickedRowData.content,
        createdDate: clickedRowData.createdDate,
        updatedDate: clickedRowData.updatedDate,
        memberName: clickedRowData.memberName,
      },
    });
  };

  const gridOptions: AgGridReactProps<Event> = {
    columnDefs: [
      {
        headerName: '번호',
        valueGetter: (params) =>
          params.node && params.node.rowIndex != null
            ? params.node.rowIndex + 1
            : '',
        width: 70,
        cellStyle: { textAlign: 'center' },
      },
      { headerName: '제목', field: 'title', width: 250 },
      { headerName: '내용', field: 'content', width: 300 },
      {
        headerName: '작성일자',
        field: 'createdDate',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '수정일자',
        field: 'updatedDate',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '작성자',
        field: 'memberName',
        width: 100,
        cellStyle: { textAlign: 'center' },
      },
    ],
    defaultColDef: {
      sortable: true,
      headerClass: 'centered',
    },
    onCellClicked: handleTitleClick,
  };

  const rowNoticeData =
    rowsNoticeData &&
    rowsNoticeData.map((v: any) => {
      return {
        title: v.title,
        content: v.content,
        createdDate: new Date(v.createdDate),
        updatedDate: new Date(v.updatedDate),
        memberName: v.memberName,
      };
    });

  const rowEventData =
    rowsEventData &&
    rowsEventData.map((v: any) => {
      return {
        title: v.title,
        content: v.content,
        createdDate: new Date(v.createdDate),
        updatedDate: new Date(v.updatedDate),
        memberName: v.memberName,
      };
    });

  const rowPromotionData =
    rowsPromotionData &&
    rowsPromotionData.map((v: any) => {
      return {
        title: v.title,
        content: v.content,
        createdDate: new Date(v.createdDate),
        updatedDate: new Date(v.updatedDate),
        memberName: v.memberName,
      };
    });

  const writeEvent = () => {
    navigate('/addevent');
  };

  const writePromotion = () => {
    navigate('/addpromotion');
  };

  return (
    <div className="flex flex-col w-full h-[90%]">
      <div className="flex max-w-2xl mx-auto pt-4 h-[8%] w-full">
        <div
          id="1"
          className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
            activeTab === '공지사항'
              ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
              : 'border-b-2'
          }`}
          onClick={() => handleTabClick('공지사항')}
        >
          공지사항
        </div>
        <div
          id="2"
          className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
            activeTab === '이벤트'
              ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
              : 'border-b-2'
          }`}
          onClick={() => handleTabClick('이벤트')}
        >
          이벤트
        </div>
        <div
          id="3"
          className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
            activeTab === '홍보'
              ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
              : 'border-b-2'
          }`}
          onClick={() => handleTabClick('홍보')}
        >
          홍보
        </div>
      </div>
      <div className="w-full flex justify-center h-[92%] pt-5">
        {activeTab === '공지사항' && (
          <div
            className="ag-theme-alpine"
            style={{ height: '90%', width: '70%' }}
          >
            <AgGridReact
              rowData={rowNoticeData}
              gridOptions={gridOptions}
              animateRows={true} // 행 애니메이션
              suppressRowClickSelection={true} // true -> 클릭 시 행이 선택안됌
              rowSelection={'multiple'} // 여러행 선택
              enableCellTextSelection={true} // 그리드가 일반 테이블인 것처럼 드래그시 일반 텍스트 선택
            ></AgGridReact>
          </div>
        )}
        {activeTab === '이벤트' && (
          <div className="w-[70%] h-[100%] flex flex-col ">
            <div>
              <button
                className="bg-main-green-color text-white rounded-full px-3 py-1 font-bold text-sm float-end mb-3"
                onClick={writeEvent}
              >
                + 이벤트 작성
              </button>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: '90%', width: '100%' }}
            >
              <AgGridReact
                rowData={rowEventData}
                gridOptions={gridOptions}
                animateRows={true} // 행 애니메이션
                suppressRowClickSelection={true} // true -> 클릭 시 행이 선택안됌
                rowSelection={'multiple'} // 여러행 선택
                enableCellTextSelection={true} // 그리드가 일반 테이블인 것처럼 드래그시 일반 텍스트 선택
              ></AgGridReact>
            </div>
          </div>
        )}
        {activeTab === '홍보' && (
          <div className="w-[70%] h-[100%] flex flex-col ">
            <div>
              <button
                className="bg-main-green-color text-white rounded-full px-3 py-1 font-bold text-sm float-end mb-3"
                onClick={writePromotion}
              >
                + 홍보 작성
              </button>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: '90%', width: '100%' }}
            >
              <AgGridReact
                rowData={rowPromotionData}
                gridOptions={gridOptions}
                animateRows={true} // 행 애니메이션
                suppressRowClickSelection={true} // true -> 클릭 시 행이 선택안됌
                rowSelection={'multiple'} // 여러행 선택
                enableCellTextSelection={true} // 그리드가 일반 테이블인 것처럼 드래그시 일반 텍스트 선택
              ></AgGridReact>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
