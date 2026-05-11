import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { getComplaintMeta, submitComplaint } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVerify: () => void;
}

type IdRef = string | { _id?: string; id?: string; name?: string };

type Department = {
  _id?: string;
  id?: string;
  name?: string;
  code?: string;
};

type Area = {
  _id?: string;
  id?: string;
  name?: string;
  department_id?: IdRef;
  pincode?: string;
  ward?: string;
};

type Category = {
  _id?: string;
  id?: string;
  name?: string;
  department_id?: IdRef;
  priority?: string;
};

const getId = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
};

const normalizeList = <T,>(res: any): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.data)) return res.data as T[];
  if (Array.isArray(res?.items)) return res.items as T[];
  return [];
};

export default function LocationVerifyModal({ visible, onClose, onVerify }: Props) {
  const router = useRouter();
  const authToken = useAuthStore((state) => state.token) || undefined;

  const [step, setStep] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Keep original field set only
  const [departmentId, setDepartmentId] = useState<string>('');
  const [areaId, setAreaId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);

  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [verifyingLocation, setVerifyingLocation] = useState<boolean>(false);

  const activeDepartments = useMemo(() => departments, [departments]);
  const filteredAreas = useMemo(
    () => areas.filter((a) => getId(a.department_id) === departmentId),
    [areas, departmentId]
  );
  const filteredCategories = useMemo(
    () => categories.filter((c) => getId(c.department_id) === departmentId),
    [categories, departmentId]
  );
  const selectedArea = useMemo(() => filteredAreas.find((a) => getId(a) === areaId), [filteredAreas, areaId]);

  const resetState = () => {
    setStep(0);
    setShowSuccess(false);
    setDepartmentId('');
    setAreaId('');
    setCategoryId('');
    setTitle('');
    setDescription('');
    setLocation('');
    setLandmark('');
    setPincode('');
    setLatitude(undefined);
    setLongitude(undefined);
  };

  useEffect(() => {
    if (!visible) {
      resetState();
      return;
    }

    const loadMeta = async () => {
      if (!authToken) return;

      setLoadingDepartments(true);
      try {
        const metaRes = await getComplaintMeta(authToken);
        const payload = metaRes?.data || metaRes;
        setDepartments(normalizeList<Department>(payload?.departments));
        setAreas(normalizeList<Area>(payload?.areas));
        setCategories(normalizeList<Category>(payload?.categories));
      } catch {
        // Avoid startup failure popup.
        setDepartments([]);
        setAreas([]);
        setCategories([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadMeta();
  }, [visible, authToken]);

  useEffect(() => {
    setAreaId('');
    setCategoryId('');
  }, [departmentId]);

  useEffect(() => {
    if (selectedArea?.pincode) {
      setPincode(selectedArea.pincode);
    }
  }, [selectedArea]);

  const goToMyGrievances = () => {
    onClose();
    router.push('/citizen/create-grievance');
  };

  const handleVerifyLocation = async () => {
    setVerifyingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please allow location permission to continue.');
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert('Location disabled', 'Please enable location services on your device and try again.');
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = current.coords.latitude;
      const lng = current.coords.longitude;
      setLatitude(lat);
      setLongitude(lng);

      try {
        const geocoded = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        const first = geocoded?.[0];
        if (first) {
          const detectedAddress = [
            first.name,
            first.street,
            first.city || first.subregion,
            first.region,
            first.postalCode,
          ]
            .filter(Boolean)
            .join(', ');
          setLocation(detectedAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          setPincode(first.postalCode || '');
        }
      } catch {
        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }

      setStep(1);
    } catch {
      Alert.alert('Location error', 'Unable to fetch your current location. Please enable GPS and try again.');
    } finally {
      setVerifyingLocation(false);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!authToken) {
      Alert.alert('Login required', 'Please login again to submit complaint.');
      return;
    }

    if (!departmentId || !areaId || !categoryId || !title.trim() || !description.trim()) {
      Alert.alert('Missing fields', 'Please fill Department, Area, Category, Title and Description.');
      return;
    }

    setSubmitting(true);
    try {
      const mergedDescription = [
        description.trim(),
        location.trim() ? `Location: ${location.trim()}` : '',
        landmark.trim() ? `Landmark: ${landmark.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await submitComplaint(
        {
          department_id: departmentId,
          area_id: areaId,
          category_id: categoryId,
          title: title.trim(),
          description: mergedDescription,
          latitude,
          longitude,
          pincode: pincode || undefined,
        },
        authToken
      );

      onVerify();
      setShowSuccess(true);
    } catch (e: any) {
      Alert.alert('Submit failed', e?.message || 'Unable to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        {showSuccess ? (
          <View className="bg-white w-full rounded-2xl p-5 items-center">
            <View className="bg-green-100 p-3 rounded-full mb-3">
              <Feather name="check-circle" size={40} color="#16a34a" />
            </View>

            <Text className="text-lg font-bold text-slate-900">Complaint Submitted</Text>
            <Text className="text-slate-600 text-center mt-2">
              Your complaint was submitted successfully. You can track status in My Grievances.
            </Text>

            <TouchableOpacity onPress={goToMyGrievances} className="mt-5 bg-blue-600 px-6 py-3 rounded-xl w-full">
              <Text className="text-white text-center font-semibold">View My Grievances</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white w-full rounded-2xl p-4">
            {step === 0 && (
              <>
                <View className="bg-blue-100 p-3 rounded-full self-center">
                  <Feather name="map-pin" size={28} color="#1d4ed8" />
                </View>

                <Text className="text-lg font-bold text-slate-900 mb-2 text-center">Verify Your Location</Text>

                <Text className="text-slate-600 text-sm mb-4 text-center">
                  We need your location to assign the complaint to the correct department and ensure faster resolution.
                </Text>

                <TouchableOpacity onPress={handleVerifyLocation} className="bg-blue-600 py-3 rounded-xl mb-3" disabled={verifyingLocation}>
                  {verifyingLocation ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center font-bold">Verify Location</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose} className="py-2">
                  <Text className="text-center text-slate-500">Maybe Later</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 1 && (
              <>
                <Text className="text-lg font-bold">Complaint Details</Text>
                <Text className="text-xs text-slate-500 mb-3">Step 1 of 3</Text>

                {loadingDepartments ? (
                  <View className="py-6 items-center">
                    <ActivityIndicator color="#2563eb" />
                  </View>
                ) : (
                  <View className="border border-slate-300 rounded-xl mb-3">
                    <Picker selectedValue={departmentId} onValueChange={(v: string) => setDepartmentId(v)}>
                      <Picker.Item label="Select Department" value="" />
                      {activeDepartments.map((d) => (
                        <Picker.Item key={getId(d)} label={d.name || 'Unnamed Department'} value={getId(d)} />
                      ))}
                    </Picker>
                  </View>
                )}

                <View className="border border-slate-300 rounded-xl mb-3">
                  <Picker enabled={!!departmentId} selectedValue={areaId} onValueChange={(v: string) => setAreaId(v)}>
                    <Picker.Item label={departmentId ? 'Select Area' : 'Select Department First'} value="" />
                    {filteredAreas.map((a) => (
                      <Picker.Item key={getId(a)} label={a.name || 'Unnamed Area'} value={getId(a)} />
                    ))}
                  </Picker>
                </View>

                <View className="border border-slate-300 rounded-xl mb-3">
                  <Picker
                    enabled={!!departmentId}
                    selectedValue={categoryId}
                    onValueChange={(v: string) => setCategoryId(v)}
                  >
                    <Picker.Item label={departmentId ? 'Select Category' : 'Select Department First'} value="" />
                    {filteredCategories.map((c) => (
                      <Picker.Item key={getId(c)} label={c.name || 'Unnamed Category'} value={getId(c)} />
                    ))}
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
                  <TouchableOpacity onPress={onClose} className="border border-slate-300 px-4 py-2 rounded-lg">
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setStep(2)} className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-bold">Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <Text className="text-lg font-bold">Upload Photo</Text>
                <Text className="text-xs text-slate-500 mb-4">Step 2 of 3</Text>

                <TouchableOpacity className="border border-slate-300 py-3 rounded-xl flex-row items-center justify-center mb-3">
                  <Feather name="camera" size={20} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-medium">Open Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity className="border border-slate-300 py-3 rounded-xl flex-row items-center justify-center mb-4">
                  <Feather name="image" size={20} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-medium">Choose from Gallery</Text>
                </TouchableOpacity>

                <View className="flex-row justify-between">
                  <TouchableOpacity onPress={() => setStep(1)} className="border border-slate-300 px-4 py-2 rounded-lg">
                    <Text>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setStep(3)} className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-bold">Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <Text className="text-lg font-bold">Location Details</Text>
                <Text className="text-xs text-slate-500 mb-3">Step 3 of 3</Text>

                <View className="bg-slate-200 h-32 rounded-xl mb-3 flex items-center justify-center">
                  <Feather name="map-pin" size={30} color="#2563eb" />
                  <Text className="text-xs text-slate-600 mt-1">Adjust Pin</Text>
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
                  <TouchableOpacity onPress={() => setStep(2)} className="border border-slate-300 px-4 py-2 rounded-lg">
                    <Text>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmitComplaint}
                    disabled={submitting}
                    className={`px-4 py-2 rounded-lg ${submitting ? 'bg-green-400' : 'bg-green-600'}`}
                  >
                    {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Submit</Text>}
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
