// import React, { useState } from 'react';
// import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import RNPickerSelect from 'react-native-picker-select';
// interface GrievanceWizardModalProps {
//   visible: boolean;
//   onClose: () => void;
// }
// export default function GrievanceWizardModal({ visible, onClose }: GrievanceWizardModalProps) {
//   const [step, setStep] = useState(0);

//   const [dept, setDept] = useState('');
//   const [title, setTitle] = useState('');
//   const [desc, setDesc] = useState('');
//   const [location, setLocation] = useState('Detected Location...');
//   const [landmark, setLandmark] = useState('');

//   const departments = [
//     { label: 'Water Department', value: 'water' },
//     { label: 'Electricity Department', value: 'electricity' },
//     { label: 'Road & Transport', value: 'road' },
//     { label: 'Garbage & Sanitation', value: 'garbage' },
//     { label: 'Housing', value: 'housing' },
//     { label: 'Police / Security', value: 'security' },
//   ];

//   return (
//     <Modal transparent visible={visible} animationType="fade">
//       <View className="flex-1 bg-black/50 justify-center items-center px-6">

//         <View className="bg-white rounded-2xl p-5 w-full max-h-[80%]">

//           {/* ================= VERIFY LOCATION SCREEN ================= */}
//           {step === 0 && (
//             <>
//              <View className="bg-blue-100 p-3 rounded-full self-center">
//                 <Feather name="map-pin" size={28} color="#1d4ed8" />
//               </View>
//               <Text className="text-lg font-bold text-slate-900 mb-2 text-center">
//                 Verify Your Location
//               </Text>

//               <Text className="text-slate-600 text-sm mb-4">
//                 We need your location to auto-assign the correct department and speed up complaint resolution.
//               </Text>

//               <TouchableOpacity
//                 onPress={() => setStep(1)}
//                 className="bg-blue-600 py-3 rounded-xl mb-2"
//               >
//                 <Text className="text-white text-center font-semibold">
//                   Verify Location
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={onClose}>
//                 <Text className="text-center text-slate-500">Maybe Later</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {/* ================= STEP 1 ================= */}
//           {step === 1 && (
//             <>
//               <Text className="text-lg font-bold">Complaint Details</Text>
//               <Text className="text-slate-500 text-sm mb-3">Step 1 of 3</Text>

//                {/* Department Dropdown */}
//               <Text className="text-sm font-semibold text-slate-700 mb-1">Select Department</Text>
//               <View className="border border-slate-300 rounded-xl mb-3 px-2">
//                 <RNPickerSelect
//                   onValueChange={setDept}
//                   value={dept}
//                   placeholder={{ label: 'Choose Department...', value: null }}
//                   items={departments}
//                   style={{
//                     inputAndroid: { color: '#0f172a', padding: 12 },
//                     inputIOS: { color: '#0f172a', padding: 12 },
//                   }}
//                 />
//               </View>

//               <Text className="text-slate-700">Title</Text>
//               <TextInput
//                 value={title}
//                 onChangeText={setTitle}
//                 placeholder="Complaint title"
//                 className="border border-slate-300 rounded-xl px-3 py-2 mb-2"
//               />

//               <Text className="text-slate-700">Description</Text>
//               <TextInput
//                 value={desc}
//                 onChangeText={setDesc}
//                 multiline
//                 className="border border-slate-300 rounded-xl px-3 py-2 h-20"
//               />

//               <View className="flex-row gap-2 mt-4">
//                 <TouchableOpacity onPress={onClose} className="flex-1 border py-2 rounded-xl">
//                   <Text className="text-center">Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => setStep(2)} className="flex-1 bg-blue-600 py-2 rounded-xl">
//                   <Text className="text-white text-center">Next</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           )}

//           {/* ================= STEP 2 ================= */}
//           {step === 2 && (
//             <>
//               <Text className="text-lg font-bold">Upload Photo</Text>
//               <Text className="text-slate-500 text-sm mb-4">Step 2 of 3</Text>

//               <TouchableOpacity className="bg-blue-600 py-3 rounded-xl mb-2 flex-row justify-center items-center">
//                 <Feather name="camera" size={18} color="white" />
//                 <Text className="text-white ml-2">Open Camera</Text>
//               </TouchableOpacity>

//               <TouchableOpacity className="bg-slate-200 py-3 rounded-xl flex-row justify-center items-center">
//                 <Feather name="image" size={18} color="#334155" />
//                 <Text className="text-slate-800 ml-2">Gallery</Text>
//               </TouchableOpacity>

//               <View className="flex-row gap-2 mt-4">
//                 <TouchableOpacity onPress={() => setStep(1)} className="flex-1 border py-2 rounded-xl">
//                   <Text className="text-center">Back</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => setStep(3)} className="flex-1 bg-blue-600 py-2 rounded-xl">
//                   <Text className="text-white text-center">Next</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           )}

//           {/* ================= STEP 3 ================= */}
//           {step === 3 && (
//             <>
//               <Text className="text-lg font-bold">Location Details</Text>
//               <Text className="text-slate-500 text-sm mb-3">Step 3 of 3</Text>

//               <View className="bg-slate-200 h-28 rounded-xl mb-2 items-center justify-center">
//                 <Feather name="map-pin" size={26} color="#2563eb" />
//                 <Text className="text-slate-600">Adjust Pin</Text>
//               </View>

//               <Text className="text-slate-700">Location</Text>
//               <TextInput
//                 value={location}
//                 editable={false}
//                 className="border border-slate-300 bg-slate-100 rounded-xl px-3 py-2 mb-2"
//               />

//               <Text className="text-slate-700">Landmark (optional)</Text>
//               <TextInput
//                 value={landmark}
//                 onChangeText={setLandmark}
//                 className="border border-slate-300 rounded-xl px-3 py-2"
//               />

//               <View className="flex-row gap-2 mt-4">
//                 <TouchableOpacity onPress={() => setStep(2)} className="flex-1 border py-2 rounded-xl">
//                   <Text className="text-center">Back</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => {
//                     alert('Complaint Submitted 🎉');
//                     onClose();
//                     setStep(0);
//                   }}
//                   className="flex-1 bg-green-600 py-2 rounded-xl"
//                 >
//                   <Text className="text-white text-center">Submit</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           )}

//         </View>
//       </View>
//     </Modal>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVerify: () => void; 
}

export default function CreateComplaintModal({ visible, onClose, onVerify }: Props) {
  const [step, setStep] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Step 1 data
  const [department, setDepartment] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Step 3 location
  const [location, setLocation] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');

  // Reset when modal closes
  useEffect(() => {
    if (!visible) {
      setStep(0);
      setShowSuccess(false);
      setDepartment('');
      setTitle('');
      setDescription('');
      setLocation('');
      setLandmark('');
    }
  }, [visible]);

  const submitComplaint = () => {
    // Later you will call backend API here
    setShowSuccess(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-4">

        {/* ================= SUCCESS SCREEN ================= */}
        {showSuccess ? (
          <View className="bg-white w-full rounded-2xl p-5 items-center">
            <View className="bg-green-100 p-3 rounded-full mb-3">
              <Feather name="check-circle" size={40} color="#16a34a" />
            </View>

            <Text className="text-lg font-bold text-slate-900">
              Complaint Submitted
            </Text>

            <Text className="text-slate-600 text-center mt-2">
              Your complaint has been successfully submitted.  
              You will be notified about updates.
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="mt-5 bg-blue-600 px-6 py-3 rounded-xl w-full"
            >
              <Text className="text-white text-center font-semibold">
                Go to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white w-full rounded-2xl p-4">

            {/* ================= STEP 0 VERIFY LOCATION ================= */}
            {step === 0 && (
              <>
                <View className="bg-blue-100 p-3 rounded-full self-center">
                  <Feather name="map-pin" size={28} color="#1d4ed8" />
                </View>

                <Text className="text-lg font-bold text-slate-900 mb-2 text-center">
                  Verify Your Location
                </Text>

                <Text className="text-slate-600 text-sm mb-4 text-center">
                  We need your location to assign the complaint to the correct department and ensure faster resolution.
                </Text>

                <TouchableOpacity
                  onPress={() => setStep(1)}
                  className="bg-blue-600 py-3 rounded-xl mb-3"
                >
                  <Text className="text-white text-center font-bold">
                    Verify Location
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose} className="py-2">
                  <Text className="text-center text-slate-500">
                    Maybe Later
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ================= STEP 1 DETAILS ================= */}
            {step === 1 && (
              <>
                <Text className="text-lg font-bold">Complaint Details</Text>
                <Text className="text-xs text-slate-500 mb-3">
                  Step 1 of 3
                </Text>

                <View className="border border-slate-300 rounded-xl mb-3">
                  <Picker
                    selectedValue={department}
                    onValueChange={(v: string) => setDepartment(v)}
                  >
                    <Picker.Item label="Select Department" value="" />
                    <Picker.Item label="Water Supply" value="water" />
                    <Picker.Item label="Electricity" value="electricity" />
                    <Picker.Item label="Road" value="road" />
                    <Picker.Item label="Garbage" value="garbage" />
                  </Picker>
                </View>

                <TextInput
                  placeholder="Complaint Title"
                  value={title}
                  onChangeText={setTitle}
                  className="border border-slate-300 rounded-xl px-3 py-2 mb-3"
                />

                <TextInput
                  placeholder="Describe your issue..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  className="border border-slate-300 rounded-xl px-3 py-2 mb-4"
                />

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={onClose}
                    className="border border-slate-300 px-4 py-2 rounded-lg"
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-bold">Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ================= STEP 2 UPLOAD PHOTO ================= */}
            {step === 2 && (
              <>
                <Text className="text-lg font-bold">Upload Photo</Text>
                <Text className="text-xs text-slate-500 mb-4">
                  Step 2 of 3
                </Text>

                <TouchableOpacity className="border border-slate-300 py-3 rounded-xl flex-row items-center justify-center mb-3">
                  <Feather name="camera" size={20} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-medium">
                    Open Camera
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="border border-slate-300 py-3 rounded-xl flex-row items-center justify-center mb-4">
                  <Feather name="image" size={20} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-medium">
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    className="border border-slate-300 px-4 py-2 rounded-lg"
                  >
                    <Text>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setStep(3)}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-bold">Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ================= STEP 3 LOCATION ================= */}
            {step === 3 && (
              <>
                <Text className="text-lg font-bold">Location Details</Text>
                <Text className="text-xs text-slate-500 mb-3">
                  Step 3 of 3
                </Text>

                <View className="bg-slate-200 h-32 rounded-xl mb-3 flex items-center justify-center">
                  <Feather name="map-pin" size={30} color="#2563eb" />
                  <Text className="text-xs text-slate-600 mt-1">
                    Adjust Pin
                  </Text>
                </View>

                <TextInput
                  placeholder="Detected Location"
                  value={location}
                  onChangeText={setLocation}
                  className="border border-slate-300 rounded-xl px-3 py-2 mb-3"
                />

                <TextInput
                  placeholder="Nearby Landmark (optional)"
                  value={landmark}
                  onChangeText={setLandmark}
                  className="border border-slate-300 rounded-xl px-3 py-2 mb-4"
                />

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    className="border border-slate-300 px-4 py-2 rounded-lg"
                  >
                    <Text>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={submitComplaint}
                    className="bg-green-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-bold">
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>
        )}
      </View>
    </Modal>
  );
}