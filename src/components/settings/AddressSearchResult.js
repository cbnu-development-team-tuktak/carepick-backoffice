import React from 'react';
import { getCoordinatesByAddress } from '../../services/hospital/geolocationService'

const AddressSearchResult = ({ results, onSelect }) => {
  // 검색 전이면 표시하지 않음
  if (results === null) return null;

  const handleSelect = async (item) => {
    try {
      const coordinates = await getCoordinatesByAddress(item.roadAddr);
      onSelect({
        address: item.roadAddr,
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
    } catch (error) {
      alert('해당 주소의 좌표를 확인할 수 없습니다.');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        height: '180px',
        overflowY: 'scroll',
        marginTop: '0.5rem',
        borderRadius: '4px',
        padding: '0.5rem',
        border: '1px solid #ccc',
      }}
    >
      {Array.isArray(results) && results.length > 0 ? (
        <ul className="list-group mb-0">
          {results.map((item, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(item)}
              style={{ cursor: 'pointer' }}
            >
              {item.roadAddr} ({item.jibunAddr})
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            fontSize: '0.9rem',
          }}
        >
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default AddressSearchResult;