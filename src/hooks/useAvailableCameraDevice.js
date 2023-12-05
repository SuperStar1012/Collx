import {useEffect, useState} from 'react';
// import DeviceInfo from 'react-native-device-info';
import {Camera} from 'react-native-vision-camera';

export const useAvailableCameraDevice = () => {
  const [cameraDevice, setCameraDevice] = useState(null);

  useEffect(() => {
    // let isMounted = true;

    const getAvailableCameraDevices = async () => {
      // const model = DeviceInfo.getModel();

      // if (model === 'iPhone 14 Pro Max') {
      //   setCameraDevice('ultra-wide-angle-camera');
      //   return
      // }

      try {
        const cameraDevices = await Camera.getAvailableCameraDevices();

        const cameraDeviceTypes = [];

        cameraDevices.map((cameraDevice) => {
          if (cameraDevice.position === 'back' && cameraDevice.physicalDevices?.length) {
            cameraDeviceTypes.push(...cameraDevice.physicalDevices);
          }
        });

        if (cameraDeviceTypes.includes('triple-camera')) {
          setCameraDevice('triple-camera');
        } else if (cameraDeviceTypes.includes('dual-wide-camera')) {
          setCameraDevice('dual-wide-camera');
        } else if (cameraDeviceTypes.includes('dual-camera')) {
          setCameraDevice('dual-camera');
        } else if (cameraDeviceTypes.includes('ultra-wide-angle-camera')) {
          setCameraDevice('ultra-wide-angle-camera');
        } else if (cameraDeviceTypes.includes('wide-angle-camera')) {
          setCameraDevice('wide-angle-camera');
        } else if (cameraDeviceTypes.includes('telephoto-camera')) {
          setCameraDevice('telephoto-camera');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAvailableCameraDevices();
  }, []);

  return cameraDevice;
};
