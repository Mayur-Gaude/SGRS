import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { getComplaintMeta, submitComplaint, uploadComplaintMedia } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { isPointInPolygon, normalizePolygonFromGeoBoundary } from '../lib/geofence';
import OsmInteractiveMap from './OsmInteractiveMap';

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
  geo_boundary?: {
    type?: 'Polygon';
    coordinates?: number[][][];
  };
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
  const [selectedMediaUri, setSelectedMediaUri] = useState<string>('');

  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [verifyingLocation, setVerifyingLocation] = useState<boolean>(false);
  const [pickingMedia, setPickingMedia] = useState<boolean>(false);

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
  const selectedAreaPolygon = useMemo(
    () => normalizePolygonFromGeoBoundary(selectedArea?.geo_boundary as any),
    [selectedArea?.geo_boundary]
  );

  const isLocationInsideSelectedArea = useMemo(() => {
    if (latitude == null || longitude == null) return true;
    if (!selectedAreaPolygon.length) return true;

    return isPointInPolygon(
      { latitude, longitude },
      selectedAreaPolygon
    );
  }, [latitude, longitude, selectedAreaPolygon]);

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
    setSelectedMediaUri('');
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
    // Let native modal close animation finish before navigating.
    setTimeout(() => {
      router.push('/citizen/create-grievance');
    }, 300);
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

    if (selectedAreaPolygon.length && !isLocationInsideSelectedArea) {
      Alert.alert('Outside service area', 'Selected location is outside this area boundary. Move the marker inside the boundary to continue.');
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

      const complaintRes = await submitComplaint(
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

      const complaint = complaintRes?.data?.data || complaintRes?.data || complaintRes;
      const complaintId = complaint?._id || complaint?.id;

      if (selectedMediaUri && complaintId) {
        try {
          await uploadComplaintMedia(complaintId, selectedMediaUri, authToken);
        } catch {
          Alert.alert('Uploaded complaint', 'Complaint was submitted, but image upload failed. You can upload it later.');
        }
      }

      setShowSuccess(true);
    } catch (e: any) {
      Alert.alert('Submit failed', e?.message || 'Unable to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const pickImageFrom = async (source: 'camera' | 'library') => {
    setPickingMedia(true);
    try {
      if (source === 'camera') {
        const camPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!camPermission.granted) {
          Alert.alert('Permission required', 'Please allow camera permission to capture photo evidence.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.7,
        });

        if (!result.canceled && result.assets?.length) {
          setSelectedMediaUri(result.assets[0].uri);
        }
        return;
      }

      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libraryPermission.granted) {
        Alert.alert('Permission required', 'Please allow media library permission to pick photo evidence.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length) {
        setSelectedMediaUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Image error', 'Unable to select image. Please try again.');
    } finally {
      setPickingMedia(false);
    }
  };

  const handleMarkerDragEnd = async (coords: { latitude: number; longitude: number }) => {
    const lat = coords.latitude;
    const lng = coords.longitude;

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
        if (first.postalCode) setPincode(first.postalCode);
        return;
      }
    } catch {
      // Ignore reverse geocoding failure and keep coordinates.
    }

    setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
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

                <TouchableOpacity
                  onPress={() => pickImageFrom('camera')}
                  disabled={pickingMedia}
                  className="border border-slate-300 py-3 rounded-xl flex-row items-center justify-center mb-3"
                >
                  <Feather name="camera" size={20} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-medium">Open Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => pickImageFrom('library')}
                  disabled={pickingMedia}
                  className="border border-slate-300 py-3 rounded-xl flex-row items-center justify-center mb-4"
                >
                  <Feather name="image" size={20} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-medium">Choose from Gallery</Text>
                </TouchableOpacity>

                {pickingMedia ? (
                  <View className="py-2 items-center">
                    <ActivityIndicator color="#2563eb" />
                  </View>
                ) : null}

                {selectedMediaUri ? (
                  <View className="mb-4">
                    <Image source={{ uri: selectedMediaUri }} style={{ width: '100%', height: 140, borderRadius: 12 }} />
                    <Text className="text-xs text-green-700 mt-2">Photo attached and will upload on submit.</Text>
                  </View>
                ) : null}

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

                {latitude && longitude ? (
                  <View className="mb-3">
                    <OsmInteractiveMap
                      mode="marker"
                      center={{ latitude, longitude }}
                      marker={{ latitude, longitude }}
                      polygon={selectedAreaPolygon}
                      height={220}
                      onMarkerChange={handleMarkerDragEnd}
                    />
                  </View>
                ) : (
                  <View className="bg-slate-200 h-32 rounded-xl mb-3 flex items-center justify-center">
                    <Feather name="map-pin" size={30} color="#2563eb" />
                    <Text className="text-xs text-slate-600 mt-1">Location not available</Text>
                  </View>
                )}

                {selectedAreaPolygon.length > 0 && !isLocationInsideSelectedArea ? (
                  <View className="bg-amber-100 border border-amber-300 rounded-xl p-3 mb-3">
                    <Text className="text-amber-900 text-xs">
                      Warning: your selected point is outside this service area boundary. Move the marker inside the highlighted zone.
                    </Text>
                  </View>
                ) : null}

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
