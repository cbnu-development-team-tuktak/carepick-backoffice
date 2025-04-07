import React, { useState } from 'react'; 
import { Tab } from 'react-bootstrap'; 
import TabNav from '../common/navigation/TabNav'; 
import DistrictSelectionTab from './DistrictSelectionTab'; 
import GpsAddressSettingTab from './GpsAddressSettingTab'; 
import { useDispatch } from 'react-redux'; 

function LocationFilterModalContent({ onClose }) {
  const [activeKey, setActiveKey] = useState('first');

  const dispatch = useDispatch(); // 이건 GPS 탭에서만 필요하면 그대로 둬

  const menuItems = [
    { key: 'first', label: '읍면동 설정' },
    { key: 'second', label: 'GPS 설정 / 주소 입력' }
  ];

  return (
    <Tab.Container id="location-settings" activeKey={activeKey} onSelect={setActiveKey}>
      <div className="container mb-4">
        {/* 메뉴 항목을 TabNav로 전달 */}
        <TabNav setActiveKey={setActiveKey} menuItems={menuItems} />

        {/* 탭 내용 */}
        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="first">
            {/* 읍면동 설정 */}
            <DistrictSelectionTab 
              onClose={onClose}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="second">
            {/* GPS 설정 / 주소 입력 */}
            <GpsAddressSettingTab onClose={onClose} />
          </Tab.Pane>
        </Tab.Content>
      </div>
    </Tab.Container>
  );
}

export default LocationFilterModalContent;
